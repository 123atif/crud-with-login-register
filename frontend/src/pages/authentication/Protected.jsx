import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
export const Protected = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const login = localStorage.getItem("accessToken");
  const resetpassword = localStorage.getItem("resetToken");

  useEffect(() => {
    if (
      (location.pathname === "/" ||
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/tasks" ||
        location.pathname === "/update-profile") &&
      !login
    ) {
      toast.error("Please Login First to access this page");
      navigate("/login");
    }
    if (location.pathname === "/resetpassword" && !resetpassword) {
      toast.error("Please Forget Password First");
      navigate("/login");
    }
  }, [navigate, login, resetpassword, location.pathname]);

  return <div>{Component && <Component />}</div>;
};
