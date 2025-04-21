import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Search } from 'lucide-react';
import { searchMember, addedBoardMembers, getAllBoardMembers } from '../../utils/Api';

const ShareBoardModal = ({ onClose, boardId }) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Member');
  const [boardMembers, setBoardMembers] = useState([]);
  const [addingMemberId, setAddingMemberId] = useState(null);

  // Fetch existing board members when modal opens
  useEffect(() => {
    fetchBoardMembers();
  }, [boardId]);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const fetchBoardMembers = async () => {
    try {
      const response = await getAllBoardMembers(boardId);
      setBoardMembers(response.data.members || []);
    } catch (error) {
      console.error('Error fetching board members:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await searchMember(searchValue);
      // Filter out users who are already members
      const existingMemberIds = boardMembers.map(member => member._id);
      const filteredResults = (response.data.users || []).filter(
        user => !existingMemberIds.includes(user._id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching for members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (user) => {
    setAddingMemberId(user._id);
    try {
      await addedBoardMembers(boardId, { memberId: user._id });
      // Refresh the board members list
      await fetchBoardMembers();
      // Remove the added user from search results
      setSearchResults(searchResults.filter(result => result._id !== user._id));
    } catch (error) {
      console.error('Error adding member:', error);
    } finally {
      setAddingMemberId(null);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Share board</h2>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Email address or name" 
            className="bg-gray-700 w-full pl-10 pr-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute w-full bg-gray-700 mt-1 rounded-md border border-gray-600 shadow-lg z-10 max-h-60 overflow-y-auto">
              {searchResults.map((user) => (
                <div 
                  key={user._id} 
                  className="p-2 hover:bg-gray-600 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {user.profilePic ? (
                      <img 
                        src={user.profilePic} 
                        alt={user.userName}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mr-2">
                        {user.userName ? user.userName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{user.userName}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <button 
                    className={`${
                      addingMemberId === user._id
                        ? 'bg-blue-600 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                    } text-white text-sm py-1 px-3 rounded-md`}
                    onClick={() => handleAddMember(user)}
                    disabled={addingMemberId === user._id}
                  >
                    {addingMemberId === user._id ? 'Adding...' : 'Add'}
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        
        {/* Board Members */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Board members</h3>
          {boardMembers.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {boardMembers.map((member) => (
                <div key={member._id} className="flex justify-between items-center p-2 bg-gray-700 rounded-md">
                  <div className="flex items-center">
                    {member.profilePic ? (
                      <img 
                        src={member.profilePic} 
                        alt={member.userName}
                        className="w-6 h-6 rounded-full mr-2 object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mr-2">
                        {member.userName ? member.userName.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="text-sm">
                      {member.userName || member.email}
                      {member.role && <span className="ml-2 text-xs text-gray-400">({member.role})</span>}
                    </div>
                  </div>
                  {/* You can add role selection or remove button here if needed */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">
              No members yet. Add members by searching above.
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center text-gray-300 mb-2">
            <LinkIcon size={18} className="mr-2 text-gray-400" />
            <span>Share this board with a link</span>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            Create link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareBoardModal;