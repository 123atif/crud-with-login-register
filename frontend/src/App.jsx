import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// import ParticleBackground from "./components/ParticleBackground/ParticleBackground";
import Register from "./pages/authentication/Register";
import Home from "./pages/authentication/Home";
import UpdateProfile from "./pages/authentication/UpdateProfile";
import ForgotPassword from "./pages/authentication/ForgetPassword";
import ResetPassword from "./pages/authentication/ResetPassword";
import UpdatePassword from "./pages/authentication/UpdatePassword";
import Page404 from "./pages/authentication/PageError";
import Landingpage from "./pages/Landingpage";
import HomePage from "./components/admin/HomePage";
import { LoginForm } from "./pages/authentication/LoginForm";
import { Protected } from "./pages/authentication/Protected";
import "/src/styles/dashboard.css";
import Tasks from "./pages/admin-panel/task/Tasks";
import Layout from "./components/layouts/Layout";

function App() {
  return (
    <div className="container">
      {/* <ParticleBackground /> */}
      <Toaster />
      <Routes>
        <Route path="/*" element={<Page404 />} />
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Protected Component={Home} />} />

        <Route
          path="/update-profile"
          element={<Protected Component={UpdateProfile} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/resetpassword"
          element={<Protected Component={ResetPassword} />}
        />
        {/* <Route path="/dashboard" element={<ResetPassword />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Protected Component={HomePage} />} />
          <Route path="tasks" element={<Protected Component={Tasks} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
