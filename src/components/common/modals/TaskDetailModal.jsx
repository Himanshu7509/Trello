import React, { useState } from "react";
import { X, Paperclip, Tag, Calendar } from "lucide-react";
import { putUpdatedTask } from "../../utils/Api";
import { format, parseISO } from "date-fns";

const TaskDetailModal = ({ task, onClose, onTaskUpdate, columnTitle, columnId, onReloadBoard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    title: task.title || "",
    description: task.description || "",
    tags: task.tags || [],
    dueDate: task.dueDate ,
    attachments: task.attachments || [],
    columnId: columnId || task.columnId,
    position: task.position
  });
  
  const [newTag, setNewTag] = useState("");
  const [newAttachment, setNewAttachment] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch (e) {
      console.warn("Date format error:", e);
      return "";
    }
  };

  // Convert date to input format
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString().slice(0, 16);
    } catch (e) {
      console.warn("Date input format error:", e);
      return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() === "") return;
    
    setUpdatedTask(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setUpdatedTask(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddAttachment = (e) => {
    e.preventDefault();
    if (newAttachment.trim() === "") return;

    setUpdatedTask(prev => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment.trim()]
    }));
    setNewAttachment("");
  };

  const handleRemoveAttachment = (indexToRemove) => {
    setUpdatedTask(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setUpdatedTask(prev => ({
      ...prev,
      dueDate: value ? new Date(value).toISOString() : null
    }));
  };

  const handleClearDate = () => {
    setUpdatedTask(prev => ({
      ...prev,
      dueDate: null
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Prepare data for API
      const taskDataForApi = {
        ...updatedTask,
        columnId: updatedTask.columnId || columnId
      };
      
      console.log("Updating task with data:", {
        taskId: task._id,
        taskData: taskDataForApi
      });
      
      const response = await putUpdatedTask(task._id, taskDataForApi);
      console.log("Task updated successfully:", response.data);
      
      if (onTaskUpdate) {
        onTaskUpdate(response.data);
      }
      setIsEditing(false);
      
      // Close the modal after successful save
      onClose();
      
      // Reload the board data to reflect changes
      if (onReloadBoard) {
        onReloadBoard();
      }
    } catch (error) {
      // error handling code...
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={updatedTask.title}
                  onChange={handleChange}
                  className="w-full text-xl font-bold p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <h2 className="text-xl font-bold">{task.title}</h2>
              )}
              <p className="text-sm text-gray-500 mt-1">
                In list <span className="font-medium">{columnTitle}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Description</h3>
              {isEditing ? (
                <textarea
                  name="description"
                  value={updatedTask.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a more detailed description..."
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded">
                  {task.description ? (
                    <p>{task.description}</p>
                  ) : (
                    <p className="text-gray-400 italic">No description provided</p>
                  )}
                </div>
              )}
            </div>

            {/* Due Date */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-gray-500" />
                <h3 className="font-medium text-gray-700">Due Date</h3>
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    value={formatDateForInput(updatedTask.dueDate)}
                    onChange={handleDateChange}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {updatedTask.dueDate && (
                    <button
                      onClick={handleClearDate}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">
                  {task.dueDate ? formatDate(task.dueDate) : "No due date set"}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag size={18} className="text-gray-500" />
                <h3 className="font-medium text-gray-700">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {updatedTask.tags && updatedTask.tags.length > 0 ? (
                  updatedTask.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center"
                    >
                      {tag}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No tags added</p>
                )}
              </div>
              {isEditing && (
                <form onSubmit={handleAddTag} className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="p-2 border border-gray-300 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Paperclip size={18} className="text-gray-500" />
                <h3 className="font-medium text-gray-700">Attachments</h3>
              </div>
              <div className="space-y-2">
                {updatedTask.attachments && updatedTask.attachments.length > 0 ? (
                  updatedTask.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <a
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {attachment.split('/').pop()}
                      </a>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No attachments</p>
                )}
                {isEditing && (
                  <form onSubmit={handleAddAttachment} className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newAttachment}
                      onChange={(e) => setNewAttachment(e.target.value)}
                      placeholder="Add attachment URL"
                      className="p-2 border border-gray-300 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setUpdatedTask({
                      title: task.title || "",
                      description: task.description || "",
                      tags: task.tags || [],
                      dueDate: task.dueDate || null,
                      attachments: task.attachments || [],
                      columnId: columnId || task.columnId,
                      position: task.position
                    });
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;