import * as yup from "yup";

export const RegisterSchema = yup.object({
  name: yup.string().min(2).max(30).required("Please enter your Name"),
  email: yup.string().required("Please enter your Email"),
  password: yup
    .string()
    .required("Please enter your Password")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[^\w\s]).{1,}$/,
      "Password at least 1 capital letter and 1 special character"
    ),
  dob: yup.string().required("Please enter your Date of Birth"),
  address: yup.string().required("Please enter your Address"),
  profilePic: yup.mixed().required("Please upload your profile picture"),
});

export const updateSchema = yup.object({
  newName: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be at most 30 characters")
    .required("Please enter your Name"),
  newEmail: yup
    .string()
    .email("Invalid email")
    .required("Please update your Email"),

  newDateofbirth: yup.string().required("Please update your Date of Birth"),
  newAddress: yup.string().required("Please update your Address"),
  // image: yup.mixed().required("Please update your profile picture"),
});

export const resetSchema = yup.object({
  resetPassword: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter and one lowercase letter"
    )
    .min(3, "Password must be at least 6 characters long"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email Required*"),
  password: yup.string().required("Password Required*"),
});

export const passwordSchema = yup.object({
  oldPassword: yup.string().required("Old Password is required"),
  newPassword: yup
    .string()
    .required("New Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{3,})/,
      "Password must contain at least one uppercase letter, one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});

export const addTaskSchema = yup.object({
  title: yup.string().required("Task is required*"),
  description: yup.string().required("Description is required*"),
  start_date: yup.string().required("Start date is required*"),
  end_date: yup.string().required("End date is required*"),
});

export const editTaskSchema = yup.object({
  title: yup.string().required("Task is required*"),
  description: yup.string().required("Description is required*"),
  start_date: yup.string().required("Start date is required*"),
  end_date: yup.string().required("End date is required*"),
});
