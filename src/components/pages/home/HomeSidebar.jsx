import React from 'react';
import { FaTrello, FaClipboardList, FaStar, FaEye, FaUserFriends, FaCog } from 'react-icons/fa'; // using react-icons

const HomeSidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <FaTrello className="text-2xl text-blue-400" />
        <h1 className="text-xl font-bold">Trello</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
            <FaClipboardList /> Boards
          </li>
          <li className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
            <FaStar /> Templates
          </li>
          <li className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
            <FaEye /> Home
          </li>
        </ul>

        {/* Workspaces */}
        <div className="mt-8">
          <h2 className="text-gray-400 uppercase text-xs mb-4">Workspaces</h2>
          <div>
            <h3 className="font-semibold mb-2">himanshuthakre7509's workspace</h3>
            <ul className="space-y-3 ml-2">
              <li className="flex items-center gap-2 bg-blue-600 p-2 rounded cursor-pointer">
                <FaClipboardList /> Boards
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                <FaStar /> Highlights
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                <FaEye /> Views
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                <FaUserFriends /> Members
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                <FaCog /> Settings
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <p className="text-sm text-gray-400">Try Trello Premium</p>
        <p className="text-xs text-gray-500 mt-2">
          Get unlimited boards, card mirroring, unlimited automation, and more.
        </p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Start free trial
        </button>
      </div>
    </aside>
  );
};

export default HomeSidebar;
