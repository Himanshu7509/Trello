import React from "react";
import Logo from "../../../../assets/icons8-trello-48.png";
import { Link } from "react-router-dom";

const HomeHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Trello Logo" className="h-8 w-auto" />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-800">
            <div className="relative group">
              <button className="flex items-center gap-1">
                Features <span>▼</span>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1">
                Solutions <span>▼</span>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1">
                Plans <span>▼</span>
              </button>
            </div>
            <a href="#" className="hover:underline">
              Pricing
            </a>
            <div className="relative group">
              <button className="flex items-center gap-1">
                Resources <span>▼</span>
              </button>
            </div>
          </nav>
        </div>

    
        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="text-sm font-medium text-gray-800 hover:underline">
              Log in
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-700 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
