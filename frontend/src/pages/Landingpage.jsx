import React, { useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { Button } from "../components/buttons/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
// import "..styles/LandingScreen.css"; // Import CSS file for styling
import "../styles/LandingScreen.css";
const Landingpage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const error = searchParams.get("error");
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      console.log(accessToken);
      navigate("/");
    }
  }, [accessToken, navigate]);

  let message = null;
  if (accessToken !== null) {
    message = <h2>Token = {accessToken}</h2>;
  } else if (error !== null) {
    message = <h2>Error = {error}</h2>;
  }
  return (
    <div className="landing-screen-container bg-gradient-to-r from-purple-500 to-pink-500 w-screen">
      <div className="landing-screen-content">
        <h1>{message}</h1>
        <TypeAnimation
          sequence={[
            "Welcome",
            1000,
            "To",
            1000,
            "Cherry Byte Technology",
            1000,
          ]}
          wrapper="span"
          speed={50}
          style={{
            fontSize: "2em",
            display: "inline-block",
            fontWeight: "bold",
          }}
          repeat={Infinity}
        />

        <div>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;
