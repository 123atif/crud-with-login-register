import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "./Register";
import { LoginForm } from "./LoginForm";

const Login = () => {
  const [currentForm, setCurrentForm] = useState("login");
  const navigate = useNavigate();

  const toggleForm = (formName) => {
    setCurrentForm(formName);
    if (formName === "register") {
      navigate("/register");
    }
  };

  return (
    <div className="container">
      <br /> <br />
      {currentForm === "login" ? (
        <LoginForm onFormSwitch={toggleForm} />
      ) : (
        <Register onFormSwitch={toggleForm} />
      )}
    </div>
  );
};

export default Login;
