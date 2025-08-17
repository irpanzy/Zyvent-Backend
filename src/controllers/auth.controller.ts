import { Request, Response } from "express";
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

type TRegister = {
  fullName: string;
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  username: Yup.string().required("Username is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), undefined],
    "Passwords must match"
  ),
});

export default {
  register: async (req: Request, res: Response) => {
    const {
      fullName,
      username,
      phoneNumber,
      email,
      password,
      confirmPassword,
    } = req.body as TRegister;

    try {
      await registerValidateSchema.validate(req.body);

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await User.create({
        fullName,
        username,
        phoneNumber,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: "Registration successful",
        user: result,
      });
    } catch (err: any) {
      console.error("Register error:", err);
      return res.status(400).json({
        message: err?.errors?.[0] || err?.message || "Validation error",
      });
    }
  },

  login: (req: Request, res: Response) => {
    res.status(200).json({ message: "Login successful" });
  },
};
