import { Request, Response } from "express";
import { TLogin, TRegister } from "../validators/auth.schema";
import { generateToken } from "../utils/jwt";
import { Types } from "mongoose";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import "dotenv/config";

interface AuthenticatedRequest extends Request {
  user?: {
    id: Types.ObjectId;
    role: string;
  };
}

export default {
  register: async (req: Request, res: Response) => {
    /*
      #swagger.summary = 'Register a new user'
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/RegisterInput" }
      }
      #swagger.responses[201] = {
        description: 'User registered successfully',
        schema: { $ref: "#/components/schemas/RegisterResponse" }
      }
      #swagger.responses[400] = { description: 'Bad Request' }
      #swagger.responses[500] = { description: 'Server Error' }
    */
    const { fullName, username, phoneNumber, email, password } =
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
        role: "user",
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
    /*
      #swagger.summary = 'Login with email/username & password'
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/LoginInput" }
      }
      #swagger.responses[200] = {
        description: 'Login successful',
        schema: { $ref: "#/components/schemas/LoginResponse" }
      }
      #swagger.responses[400] = { description: 'Invalid credentials' }
      #swagger.responses[500] = { description: 'Server Error' }
    */
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

      const token = generateToken({
        id: user._id,
        role: user.role,
      });

      return res.status(200).json({
        message: "Login successful",
        token, 
      });
    } catch (err: any) {
      console.error("Login error:", err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },

  profile: async (req: AuthenticatedRequest, res: Response) => {
    /*
      #swagger.summary = 'Get logged in user profile'
      #swagger.tags = ['Auth']
      #swagger.security = [{
        bearerAuth: []
      }]
      #swagger.responses[200] = {
        description: 'Profile retrieved successfully',
        schema: { $ref: "#/components/schemas/ProfileResponse" }
      }
      #swagger.responses[404] = { description: 'User not found' }
      #swagger.responses[500] = { description: 'Server Error' }
    */
    const userId = req.user?.id;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Profile retrieved successfully",
        user,
      });
    } catch (err: any) {
      console.error("Profile error:", err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
};
