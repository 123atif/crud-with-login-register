import React, { useState, useEffect } from "react";
// import { MdOutlinePendingActions } from "react-icons/md";
import { GrTask } from "react-icons/gr";
// import { BiTask } from "react-icons/bi";
// import { IoCheckmarkDoneSharp } from "react-icons/io5";
import Sidebar from "./Sidebar";
import Header from "./Header";
import instance from "../../services/api_instance";

function HomePage() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await instance.get("task/get");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
  console.log(tasks);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  return (
    // <div className="grid-container">
    //   <Header OpenSidebar={OpenSidebar} />
    //   <Sidebar
    //     openSidebarToggle={openSidebarToggle}
    //     OpenSidebar={OpenSidebar}
    //   />
    <main className="main-container p-8 bg-slate-900 h-full">
      <div className="main-title mb-8">
        <h3 className="text-3xl font-bold">Total Tasks</h3>
      </div>

      <div className="main-cards gap-8 ">
        <div className="card bg-blue-500 p-4 text-white">
          <div className="card-inner flex justify-between items-center">
            <h3>Add Task</h3>
            <GrTask className="card_icon" />
          </div>
          <h1>{tasks?.tasks?.length}</h1>
        </div>
      </div>
    </main>
    // </div>
  );
}

export default HomePage;
