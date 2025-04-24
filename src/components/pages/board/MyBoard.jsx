import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  postBoardColumn, updateColumnName, getBoardColumns, updateBoardColumns, postAddTask, putUpdatedTask
} from "../../utils/Api";
import TaskDetailModal from "../../common/modals/TaskDetailModal";
import { X } from "lucide-react";
import Header from "../../common/header/Header";
import BoardHeader from "./boardComponents/BoardHeader";
import Sidebar from "../../common/sidebar/Sidebar";
import io from "socket.io-client";

// Socket instance
let socket = null;

const scrollbarStyles = {
  scrollContainer: {
    overflowX: "auto",
    scrollbarWidth: "none", 
    msOverflowStyle: "none", 
  }
};

const hideScrollbarStyle = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

const MyBoard = () => {
  const { id } = useParams();
  const [columns, setColumns] = useState([]);
  const [boardTitle, setBoardTitle] = useState("");
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [addingCardToColumnId, setAddingCardToColumnId] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumnTitle, setSelectedColumnTitle] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState("");
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editedColumnTitle, setEditedColumnTitle] = useState("");
  
  // Socket related states
  const [activeUsers, setActiveUsers] = useState([]);
  const [userCursors, setUserCursors] = useState({});
  const socketInitialized = useRef(false);

  // Initialize socket connection
  useEffect(() => {
    if (!socketInitialized.current) {
      // Connect to socket server - replace with your actual socket URL
      socket = io("https://trello-441q.onrender.com" , {
        withCredentials: true, // If you're using cookies for auth
      });

      // Socket connection handlers
      socket.on('connect', () => {
        console.log('Socket connected');
        // Join this specific board room
        socket.emit('joinBoard', id);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      socketInitialized.current = true;
    }

    return () => {
      if (socket) {
        // Leave the board room when component unmounts
        socket.emit('leaveBoard', id);
      }
    };
  }, [id]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for board content updates
    socket.on('boardContentUpdated', ({ content, updatedBy }) => {
      console.log(`Board updated by ${updatedBy.userName}`);
      fetchColumns(); // Refresh the board data
    });

    // Listen for user presence
    socket.on('userActive', ({ userId, userName, timestamp }) => {
      setActiveUsers(prev => {
        if (!prev.some(user => user.userId === userId)) {
          return [...prev, { userId, userName, timestamp }];
        }
        return prev;
      });
    });

    socket.on('userLeft', ({ userId }) => {
      setActiveUsers(prev => prev.filter(user => user.userId !== userId));
      setUserCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[userId];
        return newCursors;
      });
    });

    socket.on('userOnline', ({ userId, userName }) => {
      setActiveUsers(prev => {
        if (!prev.some(user => user.userId === userId)) {
          return [...prev, { userId, userName, timestamp: new Date() }];
        }
        return prev;
      });
    });

    socket.on('userOffline', ({ userId }) => {
      setActiveUsers(prev => prev.filter(user => user.userId !== userId));
      setUserCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[userId];
        return newCursors;
      });
    });

    // Listen for cursor movements
    socket.on('userCursorMoved', ({ userId, userName, position, selection }) => {
      setUserCursors(prev => ({
        ...prev,
        [userId]: { userName, position, selection, timestamp: new Date() }
      }));
    });

    // Listen for column events
    socket.on('columnCreated', ({ columnData }) => {
      setColumns(prev => [...prev, columnData]);
      setTasks(prev => ({ ...prev, [columnData._id]: [] }));
    });

    socket.on('columnUpdated', ({ columnId, updatedData }) => {
      setColumns(prev => prev.map(col => 
        col._id === columnId ? { ...col, ...updatedData } : col
      ));
    });

    socket.on('columnDeleted', ({ columnId }) => {
      setColumns(prev => prev.filter(col => col._id !== columnId));
      setTasks(prev => {
        const newTasks = { ...prev };
        delete newTasks[columnId];
        return newTasks;
      });
    });

    // Listen for task events
    socket.on('taskCreated', ({ columnId, taskData }) => {
      setTasks(prev => ({
        ...prev,
        [columnId]: [...(prev[columnId] || []), taskData]
      }));
    });

    socket.on('taskUpdated', ({ taskId, updatedData }) => {
      setTasks(prev => {
        const newTasks = { ...prev };
        Object.keys(newTasks).forEach(columnId => {
          const taskIndex = newTasks[columnId].findIndex(task => task._id === taskId);
          if (taskIndex !== -1) {
            newTasks[columnId][taskIndex] = { 
              ...newTasks[columnId][taskIndex], 
              ...updatedData 
            };
          }
        });
        return newTasks;
      });
      
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(prev => ({ ...prev, ...updatedData }));
      }
    });

    socket.on('taskMoved', ({ taskId, fromColumnId, toColumnId, newPosition }) => {
      fetchColumns(); // Simpler to just refresh all data for complex moves
    });

    socket.on('taskDeleted', ({ taskId, columnId }) => {
      setTasks(prev => ({
        ...prev,
        [columnId]: prev[columnId].filter(task => task._id !== taskId)
      }));
      
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(null);
      }
    });

    // Clean up event listeners
    return () => {
      socket.off('boardContentUpdated');
      socket.off('userActive');
      socket.off('userLeft');
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off('userCursorMoved');
      socket.off('columnCreated');
      socket.off('columnUpdated');
      socket.off('columnDeleted');
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskMoved');
      socket.off('taskDeleted');
    };
  }, [id, selectedTask]);

  // Emit cursor position on mouse movement
  const handleMouseMove = (e) => {
    if (!socket) return;
    
    // Throttle cursor updates to avoid overwhelming the server
    if (!handleMouseMove.lastEmit || Date.now() - handleMouseMove.lastEmit > 100) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      socket.emit('cursorMove', {
        boardId: id,
        position,
        selection: null // Add selection tracking if needed
      });
      
      handleMouseMove.lastEmit = Date.now();
    }
  };

  const fetchColumns = async () => {
    try {
      const response = await getBoardColumns(id);
      console.log("getboardcolumn", response.data);
      
      // Fix: Extract columns array and boardTitle from the response
      const { columns: columnsData, boardTitle } = response.data;
      setBoardTitle(boardTitle);
      
      // Sort the columns by position
      const sortedColumns = columnsData.sort((a, b) => a.position - b.position);
      setColumns(sortedColumns);
      
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

  // Add these new functions for column title editing
  const handleColumnTitleClick = (columnId, currentTitle) => {
    setEditingColumnId(columnId);
    setEditedColumnTitle(currentTitle);
  };

  const handleColumnTitleChange = (e) => {
    setEditedColumnTitle(e.target.value);
  };

  const handleColumnTitleSave = async (e) => {
    e.preventDefault();
    
    if (editedColumnTitle.trim() === "") return;
    
    try {
      await updateColumnName(editingColumnId, { title: editedColumnTitle });
      
      // Update local state
      setColumns(columns.map(col => 
        col._id === editingColumnId ? { ...col, title: editedColumnTitle } : col
      ));
      
      // Emit socket event for real-time update
      if (socket) {
        socket.emit('boardContentUpdate', {
          boardId: id,
          content: { type: 'columnTitleUpdate', columnId: editingColumnId, title: editedColumnTitle },
          lastModified: new Date()
        });
      }
      
      // Reset editing state
      setEditingColumnId(null);
      setEditedColumnTitle("");
    } catch (error) {
      console.error("Error updating column title:", error);
    }
  };

  const handleColumnTitleKeyDown = (e) => {
    if (e.key === "Escape") {
      setEditingColumnId(null);
    }
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
      
      // Emit socket event for column reordering
      if (socket) {
        socket.emit('boardContentUpdate', {
          boardId: id,
          content: { 
            type: 'columnsReordered', 
            columns: updatedItems.map(col => ({ id: col._id, position: col.position }))
          },
          lastModified: new Date()
        });
      }
    } catch (error) {
      console.error("Error updating column position:", error);
      fetchColumns();
    }
  };

  const handleCardDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newTasks = { ...tasks };
    const draggedTask = newTasks[source.droppableId][source.index];
    
    newTasks[source.droppableId].splice(source.index, 1);
    newTasks[destination.droppableId].splice(destination.index, 0, draggedTask);
    
    setTasks(newTasks);
    
    try {
      const requestBody = {
        position: destination.index,
        columnId: destination.droppableId
      };
      
      await putUpdatedTask(draggableId, requestBody);
      
      // Emit socket event for task movement
      if (socket) {
        socket.emit('boardContentUpdate', {
          boardId: id,
          content: { 
            type: 'taskMoved', 
            taskId: draggableId,
            fromColumnId: source.droppableId,
            toColumnId: destination.droppableId,
            newPosition: destination.index
          },
          lastModified: new Date()
        });
      }
      
      fetchColumns();
    } catch (error) {
      console.error("Error updating card position:", error);
      fetchColumns();
    }
  };

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
      
      // Emit socket event for new column
      if (socket) {
        socket.emit('boardContentUpdate', {
          boardId: id,
          content: { type: 'columnCreated', columnData: newColumn },
          lastModified: new Date()
        });
      }
      
      setNewListTitle("");
      setAddingList(false);
    } catch (error) {
      console.error("Error creating column:", error);
    }
  };

  const handleShowAddCard = (columnId) => {
    setAddingCardToColumnId(columnId);
    setNewCardTitle("");
  };

  const handleCancelAddCard = () => {
    setAddingCardToColumnId(null);
    setNewCardTitle("");
  };

  const handleAddCard = async (e, columnId) => {
    e.preventDefault();
    
    if (newCardTitle.trim() === "") return;

    try {
      const currentColumnTasks = tasks[columnId] || [];
      const position = currentColumnTasks.length;
      
      const response = await postAddTask({
        columnId: columnId,
        title: newCardTitle,
        position: position
      });
      
      const newTask = response.data.task;

      setTasks(prevTasks => ({
        ...prevTasks,
        [columnId]: [...(prevTasks[columnId] || []), newTask]
      }));
      
      // Emit socket event for new task
      if (socket) {
        socket.emit('boardContentUpdate', {
          boardId: id,
          content: { type: 'taskCreated', columnId, taskData: newTask },
          lastModified: new Date()
        });
      }
      
      setNewCardTitle("");
      setAddingCardToColumnId(null);
      fetchColumns();
      
    } catch (error) {
      console.error("Error adding card:", error);
      alert("Failed to add card. Please try again.");
    }
  };

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
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      Object.keys(newTasks).forEach((columnId) => {
        const index = newTasks[columnId].findIndex(
          (task) => task._id === updatedTask._id
        );
        if (index !== -1) {
          newTasks[columnId][index] = updatedTask;
        }
      });
      return newTasks;
    });
    
    setSelectedTask(updatedTask);
    
    // Emit socket event for task update
    if (socket) {
      socket.emit('boardContentUpdate', {
        boardId: id,
        content: { type: 'taskUpdated', taskId: updatedTask._id, updatedData: updatedTask },
        lastModified: new Date()
      });
    }
  };

  // Render active users indicator
  const renderActiveUsers = () => {
    if (activeUsers.length === 0) return null;
    
    return (
      <div className="flex items-center gap-1 ml-auto mr-4">
        {activeUsers.slice(0, 5).map(user => (
          <div 
            key={user.userId} 
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
            title={user.userName}
          >
            {user.userName.charAt(0).toUpperCase()}
          </div>
        ))}
        {activeUsers.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium">
            +{activeUsers.length - 5}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1D2125]">
      {/* Add the style tag for webkit browsers */}
      <style>{hideScrollbarStyle}</style>
      <Header/>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
         
          <BoardHeader boardId={id} boardTitle={boardTitle}>
            {renderActiveUsers()}
          </BoardHeader>
          
          <div
            className="flex-1 p-6 bg-cover bg-center hide-scrollbar"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')",
              ...scrollbarStyles.scrollContainer,
            }}
            onMouseMove={handleMouseMove}
          >
            {/* Render remote cursors */}
            {Object.entries(userCursors).map(([userId, cursor]) => (
              <div
                key={userId}
                style={{
                  position: 'absolute',
                  left: cursor.position?.x || 0,
                  top: cursor.position?.y || 0,
                  pointerEvents: 'none',
                  zIndex: 1000,
                }}
              >
                <div className="flex flex-col items-start">
                  <div className="text-xs font-medium py-0.5 px-1.5 rounded bg-blue-500 text-white whitespace-nowrap">
                    {cursor.userName}
                  </div>
                  <div 
                    className="transform -translate-x-1/2 -translate-y-1/2 text-blue-500" 
                    style={{ marginTop: -5 }}
                  >
                    ▲
                  </div>
                </div>
              </div>
            ))}

            {loading ? (
              <p className="text-white">Loading columns...</p>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="columns" direction="horizontal" type="column">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex gap-6 items-start min-w-full" 
                    >
                      {columns.map((col, index) => (
                        <Draggable key={col._id} draggableId={col._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white/90 p-4 rounded-lg shadow-lg min-w-[250px] max-w-[250px] flex flex-col h-auto"
                            >
                              <div className="flex justify-between items-center mb-4">
                                {editingColumnId === col._id ? (
                                  <form onSubmit={handleColumnTitleSave} className="flex-1">
                                    <input
                                      type="text"
                                      value={editedColumnTitle}
                                      onChange={handleColumnTitleChange}
                                      onKeyDown={handleColumnTitleKeyDown}
                                      onBlur={handleColumnTitleSave}
                                      className="font-semibold text-lg w-full px-1 py-0.5 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                      autoFocus
                                    />
                                  </form>
                                ) : (
                                  <h3 
                                    className="font-semibold text-lg truncate cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded" 
                                    onClick={() => handleColumnTitleClick(col._id, col.title)}
                                  >
                                    {col.title}
                                  </h3>
                                )}
                                <button className="text-gray-400 hover:text-gray-600">
                                  ⋮
                                </button>
                              </div>
                              
                              <Droppable droppableId={col._id} type="task">
                                {(provided) => (
                                  <div 
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="mb-4 min-h-[50px] max-h-[calc(100vh-200px)] overflow-y-auto"
                                  >
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

                      <div className="min-w-[250px] max-w-[250px] p-4 bg-white/50 rounded-lg flex flex-col shadow-lg h-auto">
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

            {selectedTask && (
              <TaskDetailModal
                task={selectedTask}
                columnTitle={selectedColumnTitle}
                columnId={selectedColumnId}
                onClose={handleCloseTaskModal}
                onTaskUpdate={handleTaskUpdate}
                onReloadBoard={fetchColumns}
                socket={socket}
                boardId={id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBoard;