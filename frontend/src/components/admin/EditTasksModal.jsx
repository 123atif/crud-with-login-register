import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { fieldStyle, dateStyle } from "../../utils/commonStyles";
import { Button } from "../buttons/Button";
import StatusDropDown from "./StatusDropDown";
import { FaEdit } from "react-icons/fa";
import instance from "../../services/api_instance";
import { editTaskSchema } from "../../schemas";
import { TasksContext } from "../../contexts/TaskContext";
import { toast } from "react-hot-toast";

const statusData = [
  { type: "Pending" },
  { type: "In Progress" },
  { type: "Done" },
];

const EditTasksModal = ({ task, selectedTask, setSelectedTask }) => {
  const [status, setStatus] = useState(statusData[0]);
  const [isOpen, setIsOpen] = useState(false);
  const { fetchAllTasks } = useContext(TasksContext);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await instance.put(
        `task/update/${selectedTask._id}`,
        values
      );
      if (response.status !== 200) {
        throw new Error("Failed to update task");
      }
      toast.success("Task updated successfully");
      fetchAllTasks();
      setIsOpen(false);
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      setIsOpen(false);
    }
  };
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setSelectedTask(task);
        }}
        className="size-9 rounded-lg bg-blue-500 text-base text-white transition duration-300 ease-in-out transform hover:-translate-y-[2px] hover:scale-110 hover:bg-blue-900 flex items-center justify-center"
      >
        <FaEdit />
      </button>
      {selectedTask && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10 hello"
            onClose={handleCloseModal}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/95" />
            </Transition.Child>

            {
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Formik
                        initialValues={selectedTask}
                        validationSchema={editTaskSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting }) => (
                          <Form className="flex flex-col gap-3 p-7">
                            <span className={dateStyle.date}>
                              Select Status
                            </span>
                            <div className="flex justify-center">
                              <StatusDropDown
                                statusData={statusData}
                                status={status}
                                setStatus={setStatus}
                              />
                            </div>
                            <span className={dateStyle.date}>Enter Title</span>
                            <Field
                              name="title"
                              type="text"
                              placeholder="Enter Title"
                              className={fieldStyle.input}
                            />
                            <ErrorMessage
                              name="title"
                              component="div"
                              className="text-red-500"
                            />

                            <span className={dateStyle.date}>
                              Enter Description
                            </span>
                            <Field
                              name="description"
                              type="text"
                              placeholder="Enter Description"
                              className={fieldStyle.input}
                              as="textarea"
                            />
                            <ErrorMessage
                              name="description"
                              component="div"
                              className="text-red-500"
                            />

                            <span className={dateStyle.date}>Start Date</span>
                            <Field
                              name="start_date"
                              type="date"
                              className={fieldStyle.input}
                              min={today.toISOString().split("T")[0]}
                            />
                            <ErrorMessage
                              name="start_date"
                              component="div"
                              className="text-red-500"
                            />

                            <span className={dateStyle.date}>End Date</span>
                            <Field
                              name="end_date"
                              type="date"
                              className={fieldStyle.input}
                              min={today.toISOString().split("T")[0]}
                            />
                            <ErrorMessage
                              name="end_date"
                              component="div"
                              className="text-red-500"
                            />

                            <div className="flex justify-center">
                              <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-500 w-36 hover:bg-blue-600 py-2 rounded font-bold text-black"
                              >
                                {isSubmitting ? "Updating..." : "Update Task"}
                              </Button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            }
          </Dialog>
        </Transition>
      )}
    </>
  );
};

export default EditTasksModal;
