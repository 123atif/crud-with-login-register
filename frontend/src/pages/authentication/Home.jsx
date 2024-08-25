import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/buttons/Button";
const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 ">
        <h1 className="font-bold text-4xl text-center p-72 ">
          Welcome to Dashboard
          <div className="justify-center text-center text-lg mt-5">
            <Button onClick={() => navigate("/update-profile")}>
              Update Profile
            </Button>
          </div>
          <div className="justify-center text-center text-lg mt-5">
            <Button onClick={() => navigate("/dashboard")}>
              Admin Dashboard
            </Button>
          </div>
        </h1>
      </div>
    </>
  );
};

export default Home;
