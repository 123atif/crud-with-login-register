import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import AddTaskModale from "../../../components/admin/AddTaskModal";
import EditTasksModal from "../../../components/admin/EditTasksModal";
import DeleteTaskModal from "../../../components/admin/DeleteTaskModal";
import "../../../styles/SpinnerLoader.css";
import { truncateDescription } from "../../../utils/TruncateDescription";
import instance from "../../../services/api_instance";
import { TasksContext } from "../../../contexts/TaskContext";
import Layout from "../../../components/layouts/Layout";
const Tasks = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { tasks, setTasks, loader, error } = useContext(TasksContext);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const colorChangeStatus = (status) => {
    if (status === 0) {
      return { backgroundColor: "#ba1500" };
    } else if (status === 1) {
      return { backgroundColor: "#ffbf00" };
    } else if (status === 2) {
      return { backgroundColor: "#48ba00" };
    }
  };

  const colorExpiryStatus = (expiry_status) => {
    if (expiry_status === true) {
      return { backgroundColor: "#ba1500" };
    } else if (expiry_status === false) {
      return { backgroundColor: "#48ba00" };
    }
  };

  const deleteTask = async (_id) => {
    try {
      const response = await instance.delete(`task/delete/${_id}`);
      if (response.status === 200) {
        toast.success("Deleted successfully");

        setTasks((prev) => prev.filter((task) => task._id !== _id));
      } else {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex mt-10 w-full flex-col gap-5 lg:w-[60rem] mx-auto">
      <AddTaskModale setTasks={setTasks} />

      <div
        className={`shadow-lg rounded-lg border-2 ${
          loader && "flex justify-center items-center h-[400px]"
        }`}
      >
        {loader ? (
          <div className="loader"></div>
        ) : (
          <>
            <div className="grid grid-cols-5 items-center gap-8 border-b-2 py-2 text-sm font-bold bg-slate-100">
              <p className="col-span-1 text-black text-center">Title</p>
              <p className="col-span-1 text-black text-center">Description</p>
              <p className="col-span-1 text-black text-center">Status</p>
              <p className="col-span-1 text-black text-center">Expiry</p>
              <p className="col-span-1 text-black text-center w-16 m-auto">
                Actions
              </p>
            </div>
            {tasks.length === 0 ? (
              <h1 className="text-center font-bold sm:mt-12 min-h-[20rem] ">
                <div className="text-3xl pt-[7rem]"> No Data Found</div>
              </h1>
            ) : (
              <div className="h-[25rem] overflow-y-scroll">
                {tasks.map(
                  (task, index) =>
                    task && (
                      <div
                        key={index}
                        className="grid grid-cols-5 items-center gap-5 border-b-2 py-2 text-sm"
                      >
                        <p className="text-black text-center">{task.title}</p>

                        <p className="text-black text-center">
                          {truncateDescription(task.description)}
                        </p>
                        <p
                          className="text-white text-center rounded-lg px-3 py-2 w-fit mx-auto max-sm:w-16 max-sm:flex justify-center"
                          style={colorChangeStatus(task.status)}
                        >
                          {task.status === 0 && "Pending"}
                          {task.status === 1 && "Inprogress"}
                          {task.status === 2 && "Done"}
                        </p>
                        <p
                          className="text-white text-center rounded-lg px-3 py-2 w-fit mx-auto"
                          style={colorExpiryStatus(task.expiry_status)}
                        >
                          {task.expiry_status === true
                            ? "Expired"
                            : "Not Expired"}
                        </p>

                        <div className="col-span-1 flex justify-center items-center gap-2">
                          <EditTasksModal
                            setTasks={setTasks}
                            task={task}
                            selectedTask={selectedTask}
                            setSelectedTask={setSelectedTask}
                          />
                          <button
                            type="button"
                            className="size-9 rounded-lg bg-red-700 text-base text-white transition duration-300 ease-in-out transform hover:-translate-y-[2px] hover:scale-110 hover:bg-red-900 flex items-center justify-center"
                          >
                            <DeleteTaskModal
                              deleteTask={deleteTask}
                              taskId={task._id}
                            />
                          </button>
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tasks;
