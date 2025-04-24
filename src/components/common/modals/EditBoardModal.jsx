import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updateBoardApi, getMyBoardApi } from '../../utils/Api';

const EditBoardModal = ({ isOpen, onClose, board, onBoardsUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('workspace');
  const [error, setError] = useState('');

  useEffect(() => {
    if (board) {
      setTitle(board.title || '');
      setDescription(board.description || '');
      setVisibility(board.visibility || 'workspace');
      setError('');
    }
  }, [board]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const boardData = {
        title,
        description,
        visibility
      };
      
      const response = await updateBoardApi(board._id, boardData);
      
      if (response.status === 200 || response.status === 201) {
        // Fetch updated boards list and notify parent component
        const boardsResponse = await getMyBoardApi();
        if (boardsResponse.status === 200 || boardsResponse.status === 201) {
          // Pass the updated boards to the parent component
          if (onBoardsUpdated) {
            onBoardsUpdated(boardsResponse.data);
          }
        }
        onClose();
      }
    } catch (error) {
      console.error("Error updating board:", error);
      setError('Failed to update board. You might not have permission to edit this board.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1D2125] rounded-lg shadow-xl z-50 w-96 max-w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-medium text-gray-200">Edit Board</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-900/50 border border-red-800 text-red-200 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#2D3439] text-gray-200 border border-gray-700 rounded p-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#2D3439] text-gray-200 border border-gray-700 rounded p-2 focus:outline-none focus:border-blue-500 h-24"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-[#2D3439] text-gray-200 border border-gray-700 rounded p-2 focus:outline-none focus:border-blue-500"
            >
              <option value="workspace">Workspace</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBoardModal;