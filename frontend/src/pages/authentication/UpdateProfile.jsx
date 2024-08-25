import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useFormik } from "formik";
import { updateSchema } from "../../schemas";
import { FiUser, FiMail, FiCalendar, FiMapPin, FiCamera } from "react-icons/fi";
import {
  spanStyles,
  iconStyles,
  labelStyles,
  inputField,
  addressField,
  imageStyle,
} from "../../utils/commonStyles";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import instance from "../../services/api_instance";
import { Button } from "../../components/buttons/Button";
const UpdateProfile = () => {
  const [image, setProfilePic] = useState();
  const [newImage, setNewimage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const updatepassword = () => {
    navigate("/updatepassword");
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await instance.get("user/record/");
        const userDetails = data.user;
        console.log("image-----------------------", userDetails.image);
        formik.setValues({
          newName: userDetails.name,
          newEmail: userDetails.email,
          newDateofbirth: userDetails.dateofbirth,
          newAddress: userDetails.address,
          image: userDetails.image,
        });
        console.log("data---", data);
        setProfilePic(userDetails.image);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("newEmail", values.newEmail);
      formData.append("newName", values.newName);
      formData.append("newDateofbirth", values.newDateofbirth);
      formData.append("newAddress", values.newAddress);
      formData.append("image", values.image);
      const response = await instance.put("user/update-user", formData);

      console.log("Update Successful", response.data.message);
      toast.success("Update successful");
      navigate("/");
    } catch (error) {
      console.log("Update Error", error);
      console.log(" update error-------");
      toast.error("Update Error");
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("image", file);
    setNewimage(file);
  };
  const formik = useFormik({
    initialValues: {
      newName: "",
      newEmail: "",
      newDateofbirth: "",
      newAddress: "",
      image: null,
    },
    validationSchema: updateSchema,
    onSubmit: handleSubmit,
  });
  console.log(formik);
  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white shadow-md rounded-lg px-5 py-8 max-w-screen-md w-full">
        <h2 className="text-3xl mb-6 font-bold text-center text-gray-800">
          Update Profile
        </h2>
        <form className="register-form" onSubmit={formik.handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
              <label htmlFor="newName" className={labelStyles.label}>
                <FiUser className={iconStyles.icon} />
                Full Name <span className={spanStyles.required}>*</span>
              </label>
              <input
                className={inputField.field}
                value={formik.values.newName}
                onChange={formik.handleChange}
                id="newName"
                name="newName"
                placeholder="Update Full Name"
              />
              {formik.touched.newName && formik.errors.newName ? (
                <div className="text-red-500">{formik.errors.newName}</div>
              ) : null}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="newEmail" className={labelStyles.label}>
                <FiMail className={iconStyles.icon} />
                Email <span className={spanStyles.required}>*</span>
              </label>
              <input
                className={inputField.field}
                value={formik.values.newEmail}
                onChange={formik.handleChange}
                type="email"
                id="newEmail"
                name="newEmail"
                placeholder="Update youremail@gmail.com"
              />
              {formik.touched.newEmail && formik.errors.newEmail ? (
                <div className="text-red-500">{formik.errors.newEmail}</div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="newDateofbirth" className={labelStyles.label}>
                <FiCalendar className={iconStyles.icon} />
                Date of Birth <span className={spanStyles.required}>*</span>
              </label>
              <input
                className="form-input mt-1 w-full bg-gray-100 hover:bg-blue-100 focus:bg-white px-4 py-2 rounded"
                value={formik.values.newDateofbirth}
                onChange={formik.handleChange}
                type="date"
                id="newDateofbirth"
                name="newDateofbirth"
              />
              {formik.touched.newDateofbirth && formik.errors.newDateofbirth ? (
                <div className="text-red-500">
                  {formik.errors.newDateofbirth}
                </div>
              ) : null}
            </div>
            <div className="mb-4">
              <label
                htmlFor="profilePic"
                className=" text-gray-700 flex items-center"
              >
                <FiCamera className="text-gray-500 mr-2" />
                Profile Picture
              </label>

              <input
                type="file"
                id="profilePic"
                name="profilePic"
                onChange={handleFileChange}
              />
              {newImage ? (
                <img
                  src={URL.createObjectURL(newImage)}
                  alt="image"
                  className="mt-2 rounded-full w-14 h-14 object-cover"
                />
              ) : (
                <img
                  key={image}
                  src={`http://192.168.100.175:3000/images/${image}`}
                  alt="image"
                  className="mt-2 rounded-full w-14 h-14 object-cover"
                />
              )}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="newAddress" className={labelStyles.label}>
              <FiMapPin className={iconStyles.icon} />
              Address <span className={spanStyles.required}>*</span>
            </label>
            <textarea
              className={addressField.addressStyle}
              value={formik.values.newAddress}
              onChange={formik.handleChange}
              id="newAddress"
              name="newAddress"
              rows="3"
              placeholder="Update Your address..."
            ></textarea>
            {formik.touched.newAddress && formik.errors.newAddress ? (
              <div className="text-red-500">{formik.errors.newAddress}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-[26px] font-bold rounded focus:outline-none focus:shadow-outline w-full sm:w-auto sm:ml-[18.5rem]"
          >
            Update Profile
          </button>
        </form>
        <Button
          onClick={updatepassword}
          type="submit"
          className="flex items-center justify-center sm:text-center w-full sm:w-auto sm:ml-[18.5rem] mt-4"
        >
          Update Password
        </Button>
      </div>
    </div>
  );
};

export default UpdateProfile;
