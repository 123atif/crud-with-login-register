import React, { useState, useEffect } from "react";
import axios from "axios";
import instance from "../../services/api_instance";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [resetPassword, setResetPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const handleResetPasswordToken = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("resetToken", token);
        setResetToken(token);
      }
    };

    handleResetPasswordToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(resetPassword);
      const token = localStorage.getItem("resetToken");
      const response = await instance.post(
        "/resetpassword",
        { token, newpassword: resetPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      toast.success("Reset password successful");
      window.location.href = "/";
    } catch (error) {
      toast.error("Service Error");
      console.error(error);
    }
  };

  return (
    <div className="container bg-gradient-to-r from-purple-500 to-pink-500">
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Password"
          value={resetPassword}
          onChange={(e) => setResetPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
