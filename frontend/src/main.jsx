import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { TasksProvider } from "./contexts/TaskContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TasksProvider>
      <App />
    </TasksProvider>
  </BrowserRouter>
);
