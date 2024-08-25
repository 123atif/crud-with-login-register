import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useContext } from "react";
import { dateStyle, fieldStyle } from "../../utils/commonStyles";
import { Button } from "../buttons/Button";
import StatusDropDown from "./StatusDropDown";
import instance from "../../services/api_instance";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { addTaskSchema } from "../../schemas";
import { TasksContext } from "../../contexts/TaskContext";
import SearchBar from "../searchfield/SearchBar";

const statusData = [
  { type: "Pending", value: 0 },
  { type: "Inprogress", value: 1 },
  { type: "Done", value: 2 },
];

// setTasks prop
const AddTaskModale = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(statusData[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fetchAllTasks } = useContext(TasksContext);

  const handleSubmit = async (values) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      const data = {
        title: values.title,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        status: status.value,
      };
      const response = await instance.post("task/add", data);

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      toast.success(response.data.message);
      fetchAllTasks(); // for updating the task list
      setIsOpen(false); // for closing the modal
      formik.resetForm(); // to reset the form after submission
    } catch (error) {
      toast.error(error);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const initialValues = {
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: addTaskSchema,
    onSubmit: handleSubmit,
  });

  // formik.resetForm();
  const today = new Date();
  today.setDate(today.getDate() + 1);

  return (
    <>
      <SearchBar />
      <button
        className="bg-blue-500 hover:bg-blue-900 self-end text-white font-bold py-2 px-4 rounded"
        onClick={() => setIsOpen(true)}
      >
        Add task
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
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
                  <form
                    className="flex flex-col gap-3 p-7"
                    onSubmit={formik.handleSubmit}
                  >
                    <span className={dateStyle.date}>Select Status</span>
                    <div className="flex justify-center">
                      <StatusDropDown
                        statusData={statusData}
                        status={status}
                        setStatus={setStatus}
                      />
                    </div>
                    <span className={dateStyle.date}>Enter Title</span>
                    <input
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Enter Title"
                      className={fieldStyle.input}
                    />
                    {formik.touched.title && formik.errors.title ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.title}
                      </div>
                    ) : null}
                    <span className={dateStyle.date}>Enter Description</span>
                    <textarea
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      type="text"
                      id="description"
                      placeholder="Enter Description"
                      className={fieldStyle.input}
                      name="description"
                    />
                    {formik.touched.description && formik.errors.description ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.description}
                      </div>
                    ) : null}
                    <span className={dateStyle.date}>Start Date</span>
                    <input
                      value={formik.values.start_date}
                      onChange={formik.handleChange}
                      type="date"
                      id="start_date"
                      name="start_date"
                      className={fieldStyle.input}
                      min={today.toISOString().split("T")[0]} // Set the minimum date to today
                    />
                    {formik.touched.start_date && formik.errors.start_date ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.start_date}
                      </div>
                    ) : null}
                    <span className={dateStyle.date}>End Date</span>
                    <input
                      value={formik.values.end_date}
                      onChange={formik.handleChange}
                      id="end_date"
                      type="date"
                      name="end_date"
                      className={fieldStyle.input}
                      min={today.toISOString().split("T")[0]}
                    />
                    {formik.touched.end_date && formik.errors.end_date ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.end_date}
                      </div>
                    ) : null}
                    <div className="flex items-center justify-center">
                      <div className="flex justify-center">
                        <Button
                          type="submit"
                          className={`bg-blue-500 w-36 ${
                            isSubmitting
                              ? "cursor-not-allowed"
                              : "hover:bg-blue-600"
                          }`}
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default AddTaskModale;
