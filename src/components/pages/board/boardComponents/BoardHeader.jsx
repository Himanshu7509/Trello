import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';
import BoardMenu from './BoardMenu';
import ShareBoardModal from '../../../common/modals/ShareBoardModal';
import { getAllBoardMembers } from '../../../utils/Api';

const getInitials = (userName) => {
  if (!userName) return '';
  const names = userName.split(/\s+/);
  if (names.length === 1) {
    return (names[0].substring(0, 2)).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const generateColor = (userName) => {
  const colors = [
    'bg-green-500', 'bg-orange-500', 'bg-blue-500', 'bg-purple-500',
    'bg-green-600', 'bg-red-500', 'bg-indigo-500', 'bg-slate-800'
  ];
 
  const hash = userName.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return colors[hash % colors.length];
};

const BoardHeader = ({boardId}) => {
  const id = boardId;
  const [showMenu, setShowMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleModal = () => setModal(true);
  const closeModal = () => setModal(false);

  useEffect(() => {
    const showMembers = async() => {
      try {
        const response = await getAllBoardMembers(id);
        console.log("show member", response.data);
        if (response.data && response.data.members) {
          setMembers(response.data.members);
        }
      } catch (error) {
        console.error("Error fetching board members:", error);
      } finally {
        setLoading(false);
      }
    };
    showMembers();
  }, [id]);

  const MAX_DISPLAY = 4;
  
  return (
    <>
      {/* Header (Always full width) */}
      <div className="w-full z-10 px-4 py-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Task Group</h1>
        </div>
        
        {/* Right */}
        <div className="flex items-center space-x-4">

          <div className="flex -space-x-2">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
            ) : (
              <>
                {members.slice(0, MAX_DISPLAY).map((member, index) => (
                  <div 
                    key={member._id || index} 
                    className={`w-8 h-8 rounded-full ${generateColor(member.userName)} text-white text-xs flex items-center justify-center ring-2 ring-white`}
                    title={member.userName}
                  >
                    {getInitials(member.userName)}
                  </div>
                ))}
                {members.length > MAX_DISPLAY && (
                  <div className="w-8 h-8 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center ring-2 ring-white">
                    +{members.length - MAX_DISPLAY}
                  </div>
                )}
                {members.length === 0 && (
                  <div className="w-8 h-8 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center ring-2 ring-white">
                    0
                  </div>
                )}
              </>
            )}
          </div>
          
          <button onClick={handleModal} className="flex items-center px-3 font-semibold py-1 bg-blue-900 text-white rounded text-sm">
            <HiOutlineUserGroup className="mr-1" />
            Share
          </button>
          
          <button onClick={() => setShowMenu(true)} className="text-gray-600 dark:text-white">
            <BsThreeDots />
          </button>
        </div>
      </div>
      
      {modal && <ShareBoardModal onClose={closeModal} boardId={id} />}
      <div className="relative">
        <BoardMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
      </div>
    </>
  );
};

export default BoardHeader;