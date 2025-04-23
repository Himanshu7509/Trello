import React from 'react';
import {
  FaListUl, FaArchive, FaCog, FaImage, FaFolderOpen,
  FaRobot, FaRocket, FaTags, FaSmile, FaEye, FaEnvelope,
  FaCopy, FaPrint, FaSignOutAlt, FaTimes
} from 'react-icons/fa';

const BoardMenu = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-72 bg-gray-800 text-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <FaTimes />
        </button>
      </div>
      <ul className="p-4 space-y-4 text-sm">
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaListUl /> Activity</li>
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaArchive /> Archived items</li>
        <hr className="border-gray-600" />
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaCog /> Settings</li>
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaImage /> Change background</li>
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaFolderOpen /> Custom Fields</li>
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaRobot /> Automation</li>
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaRocket /> Power-Ups</li>
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaTags /> Labels</li>
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaSmile /> Stickers</li>
        <hr className="border-gray-600" />
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaEye /> Watch</li>
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaEnvelope /> Email-to-board</li>
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaCopy /> Copy board</li>
        <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"><FaPrint /> Print, export, and share</li>
        <li className="flex items-center gap-2 hover:text-red-500 cursor-pointer"><FaSignOutAlt /> Leave board</li>
      </ul>
    </div>
  );
};

export default BoardMenu;