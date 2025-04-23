import React, { useState, useCallback, useEffect } from "react";
import { Search, ChevronDown, HelpCircle, ChevronRight, X } from "lucide-react";
import { TbBellRinging2 } from "react-icons/tb";
import { SiTrello } from "react-icons/si";
import { CgMenuGridR } from "react-icons/cg";
import { fetchUserProfile } from "../../pages/userprofile/UserProfile";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CreateBoardModal from "../../common/modals/CreateBoardModal"; 

function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoadingProfile(true);
    fetchUserProfile()
      .then((data) => setUserProfile(data))
      .catch((error) => console.error("Failed to fetch user profile:", error))
      .finally(() => setIsLoadingProfile(false));
  }, []);

  const handleProfileClick = useCallback(() => {
    setIsProfileDropdownOpen((prev) => !prev);
  }, []);

  const handleLogout = () => {
    Cookies.remove("auth_token");
    navigate("/login");
  };

  const handleOpenCreateModal = () => {
    setShowCreateBoardModal(true);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleBoardCreated = (newBoard) => {
    navigate(`/board/${newBoard._id}`);
  };

  const profileInitial = userProfile?.userName?.charAt(0) || "";

  return (
    <>
      {/* Main header - now sticky with z-index to ensure it stays on top */}
      <header className="flex items-center bg-[#1D2125] px-3 py-2 w-full sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button
            className="text-gray-400 p-1.5 hover:bg-gray-700 rounded"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <CgMenuGridR size={21} />
          </button>
          <Link to="/home">
            <div className="flex items-center ml-0.5">
              <SiTrello size={22} className="text-gray-400 mr-2" />
              <span className="text-gray-400 font-bold text-sm">Trello</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {["Workspaces", "Recent", "Starred", "Templates"].map((item) => (
              <button
                key={item}
                className="text-gray-400 font-bold px-2.5 py-1 hover:bg-gray-700 rounded flex items-center text-sm"
              >
                {item}
                <ChevronDown size={18} className="ml-1 opacity-75" />
              </button>
            ))}
          </div>

          <button 
            className="hidden md:block bg-[#579DFF] text-black px-3 py-2 rounded text-sm font-bold hover:bg-blue-500"
            onClick={handleOpenCreateModal}
          >
            Create
          </button>
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          <button className="hidden sm:flex bg-gradient-to-r from-purple-400 to-blue-400 text-black font-bold rounded px-3 py-1.5 items-center text-sm">
            Beta
            <ChevronDown size={14} className="ml-1" />
          </button>

          {isSearchFocused ? (
            <div className="flex flex-grow">
              <div className="flex items-center bg-[#22272B] border border-[#3E444C] rounded px-2 py-0.5 h-8 w-full">
                <Search size={16} className="text-gray-400" />
                <input
                  className="bg-transparent border-none outline-none text-white text-sm pl-2 w-full"
                  placeholder="Search"
                  onBlur={() => setIsSearchFocused(false)}
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center bg-[#22272B] border border-[#3E444C] rounded px-2 py-0.5 h-8">
                <Search size={16} className="text-gray-400" />
                <input
                  className="bg-transparent border-none outline-none text-white text-sm pl-2 w-20 sm:w-24 md:w-36"
                  placeholder="Search"
                  onFocus={() => setIsSearchFocused(true)}
                />
              </div>
            </div>
          )}

          {!isSearchFocused && (
            <>
              <button className="hidden sm:block text-gray-400 rounded p-1 hover:bg-gray-700">
                <TbBellRinging2 size={22} />
              </button>

              <button className="hidden sm:block text-gray-400 rounded p-1 hover:bg-gray-700">
                <HelpCircle size={20} />
              </button>

              <div
                className="bg-purple-800 text-white w-6 h-6 cursor-pointer rounded-full flex items-center justify-center font-bold text-xs"
                onClick={handleProfileClick}
              >
                {profileInitial}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile menu header - also sticky to stay below the main header */}
      <div className="md:hidden flex justify-between items-center bg-[#1D2125] px-3 py-2 border-t border-gray-700 sticky top-12 z-30">
        <button 
          className="bg-[#579DFF] text-black px-3 py-1.5 rounded text-sm font-bold"
          onClick={handleOpenCreateModal}
        >
          Create
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-gray-400 px-2 py-1 hover:bg-gray-700 rounded flex items-center text-sm"
        >
          Menu <ChevronRight size={16} className="ml-1" />
        </button>
      </div>

      {isProfileDropdownOpen && (
        <div className="absolute right-3 top-12 z-50 bg-[#1D2125] border border-gray-700 rounded-md shadow-lg w-72">
          <div className="p-3 border-b border-gray-700">
            <div className="uppercase text-xs text-gray-400 font-bold mb-3">
              ACCOUNT
            </div>
            {isLoadingProfile ? (
              <div>Loading profile...</div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="bg-purple-800 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm">
                  {profileInitial}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-200 font-medium">
                    {userProfile?.userName || ""}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {userProfile?.email || "monubawane21@gmail.com"}
                  </span>
                  {userProfile?.phone && (
                    <span className="text-gray-400 text-sm">
                      {userProfile.phone}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="p-3">
            <div
              className="text-gray-300 hover:bg-gray-700 rounded text-center py-1 px-1 cursor-pointer"
              onClick={handleLogout}
            >
              Log out
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#1D2125] flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <div className="flex items-center">
              <SiTrello size={22} className="text-gray-400 mr-2" />
              <span className="text-gray-400 font-bold text-sm">Trello</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-400 p-1.5 hover:bg-gray-700 rounded"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-4 flex flex-col space-y-3">
            <div className="flex items-center bg-[#22272B] border border-[#3E444C] rounded px-2 py-0.5 h-8">
              <Search size={16} className="text-gray-400" />
              <input
                className="bg-transparent border-none outline-none text-white text-sm pl-2 w-full"
                placeholder="Search"
              />
            </div>

            <div className="flex flex-col space-y-2 mt-2">
              {["Workspaces", "Recent", "Starred", "Templates"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-gray-300">{item}</span>
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              ))}
            </div>

            <button 
              className="bg-[#579DFF] text-black px-3 py-2 rounded text-sm font-bold mt-2"
              onClick={handleOpenCreateModal}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* CreateBoardModal integration */}
      <CreateBoardModal
        isOpen={showCreateBoardModal}
        onClose={() => setShowCreateBoardModal(false)}
        onBoardCreated={handleBoardCreated}
      />
    </>
  );
}

export default Header;