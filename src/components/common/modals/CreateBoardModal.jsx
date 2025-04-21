import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createBoardApi } from "../../utils/Api";
import { useNavigate } from "react-router-dom";

const CreateBoardModal = ({ isOpen, onClose, onBoardCreated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "workspace",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await createBoardApi(formData);
      console.log("Board created:", response.data);

      setFormData({
        title: "",
        description: "",
        visibility: "workspace",
      });

      onClose();

      if (response.status === 200 || response.status === 201) {
        const boardId = response.data._id;

        if (onBoardCreated) {
          onBoardCreated(response.data);
        } else {
          navigate(`/board/${boardId}`);
        }
      }
    } catch (error) {
      console.error("Error creating board:", error);
      setError("Failed to create board. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Create new board</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-800 text-white rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Board Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter board title"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Add a description (optional)"
              rows="3"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Visibility</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="workspace">Workspace</option>
              <option value="private">Private</option>
            </select>
          </div>

          <button
            type="submit"
            className={`w-full ${
              isLoading 
                ? "bg-blue-800 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Board"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;