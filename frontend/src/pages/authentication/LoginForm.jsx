import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { SiGoogle } from "react-icons/si";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../components/buttons/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../../schemas";
import instance from "../../services/api_instance";
export const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [googleLink, setGoogleLink] = useState(null);

  const navigate = useNavigate();
  const handleForgotPasswordClick = () => {
    navigate("/forgotpassword");
  };

  const handleLogin = async (values, navigate, setSubmitting) => {
    try {
      console.log();
      const response = await instance.post("user/login", {
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    const getUrl = async () => {
      try {
        const response = await instance.get("/googleurl");
        setGoogleLink(response.data.authUrl);
        if (token) {
          localStorage.setItem("token", token);
          console.log(token);
          navigate("/");
        }
        console.log("Link--------------------", googleLink);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUrl();
  }, [googleLink]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 w-screen">
        <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
          <h2 className="text-3xl mb-6 font-bold text-center text-gray-800">
            Welcome Back!
            <br />
          </h2>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleLogin(values, navigate, setSubmitting);
            }}
          >
            <Form>
              <div className="mb-6">
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <FiMail />
                  </span>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="pl-10 pr-3 py-2 w-full border-2 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              <div className="mb-6">
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <FiLock />
                  </span>
                  <Field
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-3 py-2 w-full border-2 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute top-[1rem] right-1 flex items-center px-3 text-gray-600"
                  >
                    {passwordVisible ? <FiEyeOff /> : <FiEye />}
                  </button>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              <div className="mb-6">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Log In
                </button>
              </div>
              <div className="text-center flex flex-col">
                <button
                  className="text-blue-500 hover:text-blue-700 text-sm focus:outline-none"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot password?
                </button>
                <button
                  className="text-black text-sm mt-4 focus:outline-none"
                  onClick={() => navigate("/register")}
                >
                  Don't have an account? Register here.
                </button>
                <div className="mt-4 flex justify-center">
                  <a href={googleLink}>
                    <Button
                      type="button"
                      className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full sm:w-auto sm:ml-3"
                    >
                      <SiGoogle className="text-white mr-3" />
                      Continue with Google
                    </Button>
                  </a>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};
