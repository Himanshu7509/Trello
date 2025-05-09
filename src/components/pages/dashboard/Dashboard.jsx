import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCredatedBoardApi, getUserApi } from "../../utils/Api";
import Header from "../../common/header/Header";
import CreateBoardModal from "../../common/modals/CreateBoardModal";
import Sidebar from "../../common/sidebar/Sidebar";


const Dashboard = () => {
  const [name, setName] = useState("");
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const bgColors = [
    "bg-gradient-to-br from-blue-900 to-gray-800",
    "bg-gradient-to-br from-purple-900 to-gray-800",
    "bg-gradient-to-br from-indigo-900 to-gray-800",
    "bg-gradient-to-br from-teal-900 to-gray-800",
    "bg-gradient-to-br from-green-900 to-gray-800",
    "bg-gradient-to-br from-red-900 to-gray-800",
  ];

  const fetchBoards = async () => {
    try {
      const response = await getCredatedBoardApi();
      if (response.status === 200 || response.status === 201) {
        setBoards(response.data);
        console.log("dashboard", response.data);
      }
    } catch (error) {
      console.log("Error fetching boards:", error);
    }
  };

  useEffect(() => {
    const handleName = async () => {
      try {
        const response = await getUserApi();
        setName(response.data.userName);
        console.log("name", response.data.userName);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    handleName();
    fetchBoards();
  }, []);

  const handleBoardCreated = (newBoard) => {
    setBoards([...boards, newBoard]);
    navigate(`/board/${newBoard._id}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header />

      {/* Main content area with sidebar and scrollable content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left - completely independent */}
        <Sidebar />

        {/* Main content - only this part scrolls */}
        <main className="flex-1 overflow-y-auto">
          {/* This div will adjust based on CSS variables set by the Sidebar */}
          <div className="p-8 transition-all duration-300 ease-in-out">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{name}'s Workspace</h1>
              </div>
              <hr className="border-gray-700 mt-4" />
            </div>

            <section className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-xl" />
                <h2 className="text-xl font-semibold">Your boards</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  className="bg-gray-800 border border-gray-600 rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-700 h-32"
                  onClick={() => setShowModal(true)}
                >
                  <h3 className="text-gray-300 text-xl font-semibold">
                    Create new board
                  </h3>
                </div>

                {boards &&
                  boards.length > 0 &&
                  boards.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(`/board/${item._id}`)}
                      className={`${
                        bgColors[index % bgColors.length]
                      } border border-gray-600 rounded-md p-4 cursor-pointer hover:opacity-90 transition-all duration-300 h-32 shadow-lg flex flex-col justify-between overflow-hidden`}
                    >
                      <div>
                        <div className="w-full flex justify-between items-center">
                        <h3 className="text-white text-2xl font-medium truncate">
                          {item.title}
                        </h3>
                        <span className="bg-gray-800 font-semibold bg-opacity-50 px-2 py-1 rounded">
                          {item.visibility}
                        </span>
                        </div>
                        {item.description && (
                          <p className="text-gray-300 text-sm mt-1 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-300 mt-2">
                        
                        {item.createdBy && item.createdBy.userName !== name && (
                          <span className="bg-gray-800 font-semibold bg-opacity-50 px-2 py-1 rounded flex items-center gap-2">
                            <FaUser/> {item.createdBy.userName}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              
            </section>
          </div>
        </main>
      </div>

      <CreateBoardModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onBoardCreated={handleBoardCreated}
      />
    </div>
  );
};

export default Dashboard;
