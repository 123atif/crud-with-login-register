import React, { children, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Layout from "../layouts/Layout";
import HomePage from "./HomePage";
const AdminDashboard = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <>
      {/* <Layout> */}
      <div className="grid-container">
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <HomePage />
        {children}
      </div>
      {/* </Layout> */}
    </>
  );
};

export default AdminDashboard;
