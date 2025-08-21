import * as Yup from "yup";

export const registerValidateSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Full name must contain only letters and spaces")
    .test(
      "no-multiple-spaces",
      "Full name cannot have multiple consecutive spaces",
      (value) => {
        if (!value) {
          return false;
        }
        return !value.includes("  ");
      }
    )
    .test(
      "no-leading-trailing-spaces",
      "Full name cannot start or end with spaces",
      (value) => {
        if (!value) {
          return false;
        }
        return value === value.trim();
      }
    ),
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .matches(/^[a-zA-Z]/, "Username must start with a letter")
    .test(
      "no-consecutive-underscores",
      "Username cannot have consecutive underscores",
      (value) => {
        if (!value) {
          return false;
        }
        return !value.includes("__");
      }
    ),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^08/, "Phone number must start with 08")
    .min(9, "Phone number must be at least 9 characters")
    .max(14, "Phone number must not exceed 14 characters")
    .matches(/^[0-9]+$/, "Phone number must contain only numbers"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
    .test(
      "password-strength",
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      (value) => {
        if (!value) {
          return false;
        }
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(value);
      }
    ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), undefined],
    "Passwords must match"
  ),
  role: Yup.string().optional(),
});

export const loginValidateSchema = Yup.object({
  identifier: Yup.string().required("Email or username is required"),
  password: Yup.string().required("Password is required"),
});

export type TRegister = Yup.InferType<typeof registerValidateSchema>;
export type TLogin = Yup.InferType<typeof loginValidateSchema>;
