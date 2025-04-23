import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, Users, Settings, Plus, Calendar, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCredatedBoardApi, getUserApi } from '../../utils/Api';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const [userName, setUserName] = useState("");
  const [userInitial, setUserInitial] = useState("");

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleName = async () => {
    try {
      const response = await getUserApi();
      setUserName(response.data.userName);
      setUserInitial(response.data.userName.charAt(0).toUpperCase());
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  const fetchBoards = async () => {
    try {
      const response = await getCredatedBoardApi();
      if (response.status === 200 || response.status === 201) {
        setBoards(response.data);
      }
    } catch (error) {
      console.log("Error fetching boards:", error);
    }
  };

  useEffect(() => {
    if (!isMobile) {
      document.documentElement.style.setProperty(
        '--sidebar-width', 
        collapsed ? '4rem' : '16rem'
      );
    }
    fetchBoards();
    handleName();
  }, [collapsed, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const sidebarClasses = isMobile 
    ? `fixed top-0 left-0 h-full z-30 bg-[#1D2125] transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out shadow-lg w-64`
    : `sticky top-0 h-screen bg-[#1D2125] transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`;

  const toggleButtonClasses = isMobile
    ? `fixed top-16 left-2 z-40 p-1 rounded-full bg-[#3E444C] text-gray-300 hover:bg-gray-600 ${mobileOpen ? 'hidden' : 'block'}`
    : `absolute -right-3 top-20 p-1 rounded-full bg-[#3E444C] text-gray-300 hover:bg-gray-600 z-10`;

  useEffect(() => {
    let styleElement = document.getElementById('sidebar-global-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'sidebar-global-styles';
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      :root {
        --sidebar-width: ${collapsed ? '4rem' : '16rem'};
      }
      
      @media (max-width: 768px) {
        :root {
          --sidebar-width: 0;
        }
      }
    `;

    return () => {
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [collapsed, isMobile]);

  return (
    <>
      {isMobile && !mobileOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-16 left-2 z-40 p-1 rounded-full bg-[#3E444C] text-gray-300 hover:bg-gray-600"
        >
          <ChevronRight size={18} />
        </button>
      )}

      <div className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Workspace Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-600 w-8 h-8 rounded flex items-center justify-center text-white font-semibold">
                {userInitial || "H"}
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="flex flex-col">
                  <span className="text-gray-200 font-medium text-sm">{userName || "himanshu"}'s workspace</span>
                  <span className="text-gray-400 text-xs">Free</span>
                </div>
              )}
            </div>
            {(!collapsed || mobileOpen) && (
              <button className="text-gray-400 p-1 hover:bg-gray-700 rounded">
                <ChevronLeft size={20} />
              </button>
            )}
          </div>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto px-1">
            {/* Main navigation */}
            <div className="px-1 py-2">
              <NavItem 
                icon={<Home size={18} />} 
                label="Boards" 
                collapsed={collapsed && !mobileOpen} 
                to="/home"
              />
              <NavItem 
                icon={<Users size={18} />} 
                label="Members" 
                collapsed={collapsed && !mobileOpen}
                to="/members"
                rightIcon={<Plus size={16} />}
              />
              <NavItem 
                icon={<Settings size={18} />} 
                label="Workspace settings" 
                collapsed={collapsed && !mobileOpen}
                to="/settings"
                dropdown
              />
            </div>
            
            {/* Views section */}
            <div className="mt-4 mb-2">
              {(!collapsed || mobileOpen) && (
                <span className="text-gray-400 font-medium text-sm px-3 py-1 block">Workspace views</span>
              )}
              <NavItem 
                icon={<Layout size={18} />} 
                label="Table" 
                collapsed={collapsed && !mobileOpen}
                to="/table"
              />
              <NavItem 
                icon={<Calendar size={18} />} 
                label="Calendar" 
                collapsed={collapsed && !mobileOpen}
                to="/calendar"
              />
            </div>
            
            {/* Boards section */}
            <div className="mt-4">
              {(!collapsed || mobileOpen) && (
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-gray-400 font-medium text-sm">Your boards</span>
                  <button className="text-gray-400 p-1 hover:bg-gray-700 rounded">
                    <Plus size={16} />
                  </button>
                </div>
              )}
              
              {/* Render boards from API */}
              {boards.map((board) => (
                <BoardItem 
                  key={board._id}
                  id={board._id}
                  title={board.title}
                  collapsed={collapsed && !mobileOpen}
                />
              ))}
            </div>
          </nav>
          
          {/* Toggle button (non-mobile) */}
          {!isMobile && (
            <button 
              onClick={toggleSidebar} 
              className={toggleButtonClasses}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>
      </div>
      
      {/* Backdrop for mobile */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar} 
        />
      )}
    </>
  );
};

// Helper component for navigation items
const NavItem = ({ icon, label, collapsed, to, rightIcon, dropdown }) => {
  return (
    <Link to={to || "#"} className="flex items-center px-3 py-1.5 rounded text-gray-300 hover:bg-gray-700 mb-1 group">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="mr-3 text-gray-400">{icon}</div>
          {!collapsed && <span className="text-sm">{label}</span>}
        </div>
        {!collapsed && rightIcon && <div className="text-gray-400">{rightIcon}</div>}
        {!collapsed && dropdown && <ChevronRight size={16} className="text-gray-400" />}
      </div>
      {collapsed && (
        <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded ml-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </Link>
  );
};

// Helper component for board items
const BoardItem = ({ id, title, collapsed }) => {
  // Generate a consistent color based on the board title
  const getColorClass = (title) => {
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-red-600', 'bg-purple-600'];
    const index = title.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Link to={`/board/${id}`} className="flex items-center px-3 py-1.5 rounded text-gray-300 hover:bg-gray-700 mb-1 group">
      <div className="flex items-center w-full">
        <div className={`${getColorClass(title)} w-4 h-4 rounded mr-3`}></div>
        {!collapsed && <span className="text-sm truncate">{title}</span>}
      </div>
      {collapsed && (
        <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded ml-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
          {title}
        </div>
      )}
    </Link>
  );
};

export default Sidebar;