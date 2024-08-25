import React, { useState, useEffect } from "react";
import { BsJustify } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import instance from "../../services/api_instance";
import { useNavigate } from "react-router-dom";
function Header({ OpenSidebar }) {
  const [userData, setUserData] = useState({});
  const [profileTooltip, setProfileTooltip] = useState(false);
  const [dummyImageLoad, setDummyImageLoad] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await instance.get("user/record");

        console.log("response----------------------------", data);
        setUserData(data.user);
        setDummyImageLoad(false);
        // console.log(user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserDetails();
    console.log("kjhfcghjhgfdfyji");
  }, []);
  console.log(userData);
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <header className="header bg-white shadow-md overflow-x-auto">
      <p className="text-3xl font-bold max-sm:ml-5">Tasks</p>
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>

      <div
        className="header-right flex items-center  cursor-pointer"
        onClick={() => setProfileTooltip(!profileTooltip)}
      >
        {dummyImageLoad ? (
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            className="size-12 rounded-full border-2"
          />
        ) : (
          <img
            src={`http://localhost:3000/images/${userData.image}`}
            className="size-12 rounded-full border-2"
          />
        )}
        {profileTooltip && (
          <div className="absolute right-8 top-16 z-20 flex flex-col gap-3 rounded-xl border border-solid border-zinc-300 bg-white px-4 text-sm font-medium shadow-2xl">
            <div>
              <p className="mt-2 text-black font-semibold ">
                Name: {userData.name}
              </p>
              <p className="mt-2 text-black font-semibold ">
                Email: {userData.email}
              </p>
              <p className=" mt-2 text-black font-semibold ">
                DOB: {userData.dateofbirth}
              </p>
            </div>
            <div className="flex cursor-pointer py-3">
              <button
                onClick={handleLogout}
                className="flex cursor-pointer gap-2"
              >
                <CiLogout className="size-4 text-black" />

                <p className=" text-black font-semibold size-4">Logout</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
export default Header;
