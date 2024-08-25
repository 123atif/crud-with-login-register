import { createContext, useState, useEffect } from "react";
import instance from "../services/api_instance";
import axios from "axios";
// import axios from "axios";
export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  // const controller = new AbortController();
  const fetchAllTasks = async (search) => {
    // const controller = new AbortController();

    setLoader(true);
    try {
      const response = await instance.get(`task/get/${(search = query)}`, {
        // signal: controller.signal,
      });

      setTasks(response.data.tasks);

      setLoader(false);
      setError(response.data.tasks.length === 0);
      console.log(response.data.tasks);
    } catch (error) {
      // if (axios.isCancel(error)) {
      //   console.log("Request canceled", error.message);
      // }
      setTasks([]);
      console.error(error);
      setError(true);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const filterTasks = setTimeout(() => {
      fetchAllTasks();
    }, 800);

    return () => clearTimeout(filterTasks);
  }, [query]);

  const value = {
    tasks,
    setTasks,
    fetchAllTasks,
    loader,
    error,
    setQuery,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};
