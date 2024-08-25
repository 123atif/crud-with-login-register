import React from "react";
import { MdDashboardCustomize } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  return (
    <aside
      id="sidebar"
      className={`${
        openSidebarToggle ? "sidebar-responsive" : ""
      } h-screen bg-blue-800 overflow-y-auto`}
    >
      <div className="sidebar-title flex justify-between items-center px-8 pt-15 mb-8">
        <div className="sidebar-brand flex items-center text-white">
          <RiAdminFill className="icon_header" /> Admin
        </div>
        <span
          className="icon close_icon text-white text-2xl mt-10 mr-8 cursor-pointer"
          onClick={OpenSidebar}
        >
          <ImCross />
        </span>
      </div>

      <ul className="sidebar-list">
        <li
          className="sidebar-list-item"
          onClick={() => navigate("/dashboard")}
        >
          <div className="flex items-center  text-white">
            <MdDashboardCustomize className="icon text-white" /> Dashboard
          </div>
        </li>

        <li
          className="sidebar-list-item"
          onClick={() => navigate("/dashboard/tasks")}
        >
          <div className="flex items-center  text-white">
            <BiTask className="icon text-white" /> Tasks
          </div>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
