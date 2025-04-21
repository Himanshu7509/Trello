import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  postBoardColumn,
  getBoardColumns,
  updateBoardColumns,
  postAddTask
} from "../../utils/Api";
import ShareBoardModal from "../../common/modals/ShareBoardModal";
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
  
  // State for adding cards - store which column is being edited
  const [addingCardToColumnId, setAddingCardToColumnId] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  const fetchColumns = async () => {
    try {
      const response = await getBoardColumns(id);
      console.log(response);
      
      console.log("Fetched columns data:", response.data);
      
      const sortedColumns = response.data.sort(
        (a, b) => a.position - b.position
      );
      setColumns(sortedColumns);
     
      const initialTasks = {};
      sortedColumns.forEach(col => {
        if (col.taskId && Array.isArray(col.taskId)) {
          initialTasks[col._id] = col.taskId;
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

  const handleDragEnd = async (result) => {
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

  const handleAddList = async (e) => {
    e.preventDefault();
    if (newListTitle.trim() === "") return;

    try {
      // When adding a new column, set its position to be at the end
      const position = columns.length;
      const response = await postBoardColumn({
        boardId: id,
        title: newListTitle,
        position: position, // Make sure your API accepts and stores this position value
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
    console.log("Adding card to column:", columnId);
    
    if (newCardTitle.trim() === "") return;

    try {
      console.log("Sending API request with:", {
        columnId: columnId,
        title: newCardTitle
      });
      
      const response = await postAddTask({
        columnId: columnId,
        title: newCardTitle
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
                        
                        {/* Cards display area */}
                        <div className="flex-grow mb-4">
                          {/* Use taskId from column data OR our tasks state */}
                          {((col.taskId && Array.isArray(col.taskId) && col.taskId.length > 0) || 
                            (tasks[col._id] && tasks[col._id].length > 0)) && (
                            <div>
                              {/* First try to use taskId from column if they are objects with title */}
                              {col.taskId && Array.isArray(col.taskId) && col.taskId.some(task => task.title) && 
                                col.taskId.map((task, idx) => (
                                  <div 
                                    key={task._id || `task-${col._id}-${idx}`}
                                    className="bg-white p-3 mb-2 rounded shadow border border-gray-200"
                                  >
                                    <p className="text-sm">{task.title}</p>
                                  </div>
                                ))
                              }
                              
                              {/* If no taskId with title, use our tasks state */}
                              {(!col.taskId || !col.taskId.some(task => task.title)) && 
                                tasks[col._id] && tasks[col._id].map((task, idx) => (
                                  <div 
                                    key={task._id || `task-${col._id}-${idx}`}
                                    className="bg-white p-3 mb-2 rounded shadow border border-gray-200"
                                  >
                                    <p className="text-sm">{task.title}</p>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                        
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
    </div>
    </>
  );
};

export default MyBoard;