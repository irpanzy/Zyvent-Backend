import * as Yup from "yup";

export const registerValidateSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  username: Yup.string().required("Username is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), undefined],
    "Passwords must match"
  ),
  role: Yup.string().optional(),
});

export const loginValidateSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export type TRegister = Yup.InferType<typeof registerValidateSchema>;
export type TLogin = Yup.InferType<typeof loginValidateSchema>;
