import React from 'react';
import { FaLock, FaUser } from 'react-icons/fa';
import HomeSidebar from './HomeSidebar';

const HomePage = () => {
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
            {/* Board 1 */}
            <div className="bg-blue-600 rounded-md p-4 cursor-pointer hover:opacity-90 flex flex-col justify-end h-32">
              <h3 className="text-white text-lg font-bold">A Lead Management Pipeline by Crmble</h3>
            </div>

            

            {/* Create New Board */}
            <div className="bg-gray-800 border border-gray-600 rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-700 h-32">
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
    </div>
  );
};

export default HomePage;
