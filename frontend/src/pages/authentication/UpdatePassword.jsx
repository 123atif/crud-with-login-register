import React, { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import instance from "../../services/api_instance";
import { Button } from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { passwordSchema } from "../../schemas";

export const UpdatePassword = () => {
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const changePassword = async (values) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      if (values.newPassword !== values.confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }

      const response = await instance.put(
        "/updatepassword",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Old Password is not Correct");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen sm:ml-12 bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white shadow-md rounded-lg px-8 py-8 w-full max-w-md mb-14">
        <h2 className="text-3xl mb-6 font-bold text-center text-gray-800">
          Update Password
          <br />
        </h2>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={passwordSchema}
          onSubmit={(values) => changePassword(values)}
        >
          {({ errors, touched }) => (
            <Form className="mb-6 flex flex-col gap-2">
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <FiLock />
                </span>
                <Field
                  type={oldPasswordVisible ? "text" : "password"}
                  name="oldPassword"
                  placeholder="Old Password"
                  className="pl-10 pr-3 py-2 w-full border-2 rounded-md focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
                  className="absolute top-[1rem] right-1 flex items-center px-3 text-gray-600"
                >
                  {oldPasswordVisible ? <FiEyeOff /> : <FiEye />}
                </button>
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <FiLock />
                </span>
                <Field
                  type={newPasswordVisible ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password"
                  className="pl-10 pr-3 py-2 w-full border-2 rounded-md focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                  className="absolute top-[1rem] right-1 flex items-center px-3 text-gray-600"
                >
                  {newPasswordVisible ? <FiEyeOff /> : <FiEye />}
                </button>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <FiLock />
                </span>
                <Field
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="pl-10 pr-3 py-2 w-full border-2 rounded-md focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                  className="absolute top-[1rem] right-1 flex items-center px-3 text-gray-600"
                >
                  {confirmPasswordVisible ? <FiEyeOff /> : <FiEye />}
                </button>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <Button type="submit">Update</Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdatePassword;
