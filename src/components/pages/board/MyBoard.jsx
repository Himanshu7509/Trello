import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  postBoardColumn,
  getBoardColumns,
  updateBoardColumns,
  postAddTask,
  putUpdatedTask
} from "../../utils/Api";
import ShareBoardModal from "../../common/modals/ShareBoardModal";
import TaskDetailModal from "../../common/modals/TaskDetailModal"; 
import { X, Link as LinkIcon, Search } from "lucide-react";
import Header from "../../common/header/Header";

const MyBoard = () => {
  const { id } = useParams();
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [addingCardToColumnId, setAddingCardToColumnId] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumnTitle, setSelectedColumnTitle] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState("");

  const fetchColumns = async () => {
    try {
      const response = await getBoardColumns(id);
      console.log("Fetched columns data:", response.data);
  
      const sortedColumns = response.data.sort((a, b) => a.position - b.position);
      setColumns(sortedColumns);
  
      // 👉 Extract _id from each column
      const columnIds = sortedColumns.map(col => col._id);
      console.log("Column IDs:", columnIds);
  
      const initialTasks = {};
      sortedColumns.forEach(col => {
        if (col.taskId && Array.isArray(col.taskId)) {
          const sortedTasks = [...col.taskId].sort((a, b) =>
            a.position !== undefined && b.position !== undefined
              ? a.position - b.position
              : 0
          );
          initialTasks[col._id] = sortedTasks;
        } else {
          initialTasks[col._id] = [];
        }
      });
      setTasks(initialTasks);
    } catch (error) {
      console.error("Error fetching board columns:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchColumns();
  }, [id]);

  const handleModal = () => {
    setModal(true);
  };



  
  const closeModal = () => {
    setModal(false);
  };

  const handleColumnDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.index === destination.index) return;
    const items = Array.from(columns);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setColumns(updatedItems);

    try {
      await updateBoardColumns({
        boardId: id,
        columnId: draggableId,
        newPosition: destination.index,
        allColumns: updatedItems.map((col, idx) => ({
          id: col._id,
          position: idx,
        })),
      });

      console.log("Column position updated successfully!");
    } catch (error) {
      console.error("Error updating column position:", error);
      fetchColumns();
    }
  };

  // Handle card drag and drop
  const handleCardDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    
    // If dropped outside a droppable area or at the same position, do nothing
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    console.log("Moving task", draggableId);
    console.log("From column:", source.droppableId, "at position:", source.index);
    console.log("To column:", destination.droppableId, "at position:", destination.index);

    // Create a copy of the current tasks state
    const newTasks = { ...tasks };
    
    // Get the task being dragged
    const draggedTask = newTasks[source.droppableId][source.index];
    
    // Remove the task from source column
    newTasks[source.droppableId].splice(source.index, 1);
    
    // Add the task to the destination column at the specified index
    newTasks[destination.droppableId].splice(destination.index, 0, draggedTask);
    
    // Update state with the new task positions - applying optimistic update
    setTasks(newTasks);
    
    try {
      const requestBody = {
        position: destination.index,
        columnId: destination.droppableId
      };
      
      console.log("Updating task position:", {
        taskId: draggableId,
        ...requestBody
      });
      
      // Send API request to update the task
      await putUpdatedTask(draggableId, requestBody);
      console.log("Card position updated successfully!");
      
      // Refresh data to ensure UI is in sync with backend
      fetchColumns();
    } catch (error) {
      console.error("Error updating card position:", error);
      // Revert to the previous state on error
      fetchColumns();
    }
  };

  // Combined drag end handler for both columns and cards
  const handleDragEnd = (result) => {
    const { type } = result;
    
    if (type === "column") {
      handleColumnDragEnd(result);
    } else {
      handleCardDragEnd(result);
    }
  };

  const handleAddList = async (e) => {
    e.preventDefault();
    if (newListTitle.trim() === "") return;

    try {
      // When adding a new column, set its position to be at the end
      const position = columns.length;
      const response = await postBoardColumn({
        boardId: id,
        title: newListTitle,
        position: position,
      });

      const newColumn = response.data;
      setColumns([...columns, newColumn]);
      
      setTasks(prev => ({
        ...prev,
        [newColumn._id]: []
      }));
      
      setNewListTitle("");
      setAddingList(false);
    } catch (error) {
      console.error("Error creating column:", error);
    }
  };

  // Show the card input form
  const handleShowAddCard = (columnId) => {
    setAddingCardToColumnId(columnId);
    setNewCardTitle("");
  };

  // Cancel adding a card
  const handleCancelAddCard = () => {
    setAddingCardToColumnId(null);
    setNewCardTitle("");
  };

  const handleAddCard = async (e, columnId) => {
    e.preventDefault();
    
    if (newCardTitle.trim() === "") return;

    try {
      // Get the current position for the new task
      const currentColumnTasks = tasks[columnId] || [];
      const position = currentColumnTasks.length;
      
      const response = await postAddTask({
        columnId: columnId,
        title: newCardTitle,
        position: position // Include position in the API call
      });
      
      console.log("Card added successfully:", response.data);
      
      // Extract the task object from the response
      const newTask = response.data.task;

      // Update our tasks state with the new task
      setTasks(prevTasks => ({
        ...prevTasks,
        [columnId]: [...(prevTasks[columnId] || []), newTask]
      }));
      
      // Reset form
      setNewCardTitle("");
      setAddingCardToColumnId(null);
      
      // Refresh columns data to ensure synchronization
      fetchColumns();
      
    } catch (error) {
      console.error("Error adding card:", error);
      alert("Failed to add card. Please try again.");
    }
  };

  // New functions for task detail modal
  const handleOpenTaskModal = (task, columnTitle, columnId) => {
    setSelectedTask(task);
    setSelectedColumnTitle(columnTitle);
    setSelectedColumnId(columnId); 
  };

  const handleCloseTaskModal = () => {
    setSelectedTask(null);
    setSelectedColumnId("");
  };

  const handleTaskUpdate = (updatedTask) => {
    // Update the task in our local state
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      // Find the column that contains this task
      Object.keys(newTasks).forEach((columnId) => {
        const index = newTasks[columnId].findIndex(
          (task) => task._id === updatedTask._id
        );
        if (index !== -1) {
          // Replace the task with updated version
          newTasks[columnId][index] = updatedTask;
        }
      });

      return newTasks;
    });

    // Update the selected task state to show updated info in modal
    setSelectedTask(updatedTask);
  };

  
  

  return (
    <>
    <Header/>
    <div
      className="p-6 h-screen bg-cover bg-center overflow-x-auto"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">
          My Trello Board
        </h2>
        <button
          onClick={handleModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg"
        >
          Share Board
        </button>
      </div>

      {loading ? (
        <p className="text-white">Loading columns...</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns" direction="horizontal" type="column">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex gap-6"
              >
                {columns.map((col, index) => (
                  <Draggable key={col._id} draggableId={col._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white/90 p-4 rounded-lg shadow-lg min-w-[250px] max-w-[250px] flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg truncate">
                            {col.title}
                          </h3>
                          <button className="text-gray-400 hover:text-gray-600">
                            ⋮
                          </button>
                        </div>
                        
                        {/* Cards display area with drop zone */}
                        <Droppable droppableId={col._id} type="task">
                          {(provided) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="flex-grow mb-4 min-h-[50px]"
                            >
                              {/* Display cards from tasks state */}
                              {tasks[col._id] && tasks[col._id].map((task, idx) => (
                                <Draggable
                                  key={task._id}
                                  draggableId={task._id}
                                  index={idx}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`bg-white p-3 mb-2 rounded shadow border ${
                                        snapshot.isDragging ? 'border-blue-400 shadow-lg' : 'border-gray-200'
                                      } hover:bg-gray-50 cursor-pointer`}
                                      onClick={() => handleOpenTaskModal(task, col.title, col._id)}
                                    >
                                      <p className="text-sm">{task.title}</p>
                                      {task.tags && task.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {task.tags.map((tag, idx) => (
                                            <span
                                              key={idx}
                                              className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      {task.dueDate && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        
                        {/* Add a card UI */}
                        <div className="mt-auto">
                          {addingCardToColumnId === col._id ? (
                            <form 
                              onSubmit={(e) => handleAddCard(e, col._id)} 
                              className="flex flex-col gap-2"
                            >
                              <textarea
                                placeholder="Enter card title..."
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                className="border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                autoFocus
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                >
                                  Add Card
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelAddCard}
                                  className="text-gray-700 hover:text-black p-1 text-sm"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button
                              onClick={() => handleShowAddCard(col._id)}
                              className="text-sm text-gray-700 hover:text-blue-600 w-full text-left py-1"
                            >
                              + Add a card
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {/* Add another list */}
                <div className="min-w-[250px] max-w-[250px] p-4 bg-white/50 rounded-lg flex flex-col shadow-lg">
                  {addingList ? (
                    <form
                      onSubmit={handleAddList}
                      className="flex flex-col gap-3"
                    >
                      <input
                        type="text"
                        placeholder="Enter list title..."
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                        >
                          Add List
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingList(false);
                            setNewListTitle("");
                          }}
                          className="text-gray-700 hover:text-black text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setAddingList(true)}
                      className="text-gray-800 hover:text-black font-medium text-left"
                    >
                      + Add another list
                    </button>
                  )}
                </div>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {modal && <ShareBoardModal onClose={closeModal} boardId={id} />}
      
      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
     
          task={selectedTask}
          columnTitle={selectedColumnTitle}
          columnId={selectedColumnId}
          onClose={handleCloseTaskModal}
          onTaskUpdate={handleTaskUpdate}
          onReloadBoard={fetchColumns} 
        />
      )}
    </div>
    </>
  );
};

export default MyBoard;