import { Request, Response } from "express";
import { TLogin, TRegister } from "../validators/auth.schema";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import "dotenv/config";

export default {
  register: async (req: Request, res: Response) => {
    const { fullName, username, phoneNumber, email, password, role } =
      req.body as TRegister;

    try {
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
        role: role || "user",
      });

      return res.status(201).json({
        message: "Registration successful",
        user: result,
      });
    } catch (err: any) {
      console.error("Register error:", err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },

  login: async (req: Request, res: Response) => {
    const { identifier, password } = req.body as TLogin;

    try {
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid email/username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Invalid email/username or password" });
      }

      // 👉 nanti bisa tambahkan JWT token di sini
      return res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (err: any) {
      console.error("Login error:", err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
};
