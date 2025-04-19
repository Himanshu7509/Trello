import React, { useState } from 'react';
import { FaLock, FaUser, FaTimes } from 'react-icons/fa';
import HomeSidebar from './HomeSidebar';
import { createBoardApi } from '../../utils/Api';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [data, setData] = useState({
    title: "",
    description: "",
    visibility: "workspace" // or private
  });
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createBoardApi(data);
      console.log(response);
      setModal(false);
      if(response.status === 200 || response.status === 201){
        navigate('/board');
      }
     
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <HomeSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Workspace Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">himanshuthakre7509's workspace</h1>
            <FaLock className="text-gray-400" />
            <span className="text-sm text-gray-400">Private</span>
          </div>
          <hr className="border-gray-700 mt-4" />
        </div>

        {/* Your Boards Section */}
        <section className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <FaUser className="text-xl" />
            <h2 className="text-xl font-semibold">Your boards</h2>
          </div>

          {/* Boards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Create New Board */}
            <div 
              className="bg-gray-800 border border-gray-600 rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-700 h-32"
              onClick={() => setModal(true)}
            >
              <h3 className="text-gray-300 text-lg">Create new board</h3>
            </div>
          </div>

          {/* View Closed Boards Button */}
          <div className="mt-6">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded">
              View closed boards
            </button>
          </div>
        </section>
      </main>

      {/* Create Board Modal */}
      {modal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create new board</h2>
              <button 
                onClick={() => setModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Board Title</label>
                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter board title"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Add a description (optional)"
                  rows="3"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Visibility</label>
                <select
                  name="visibility"
                  value={data.visibility}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="workspace">Workspace</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Board
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;