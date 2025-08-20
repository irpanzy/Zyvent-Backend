import { Request, Response } from "express";
import { TLogin, TRegister } from "../validators/auth.schema";
import { generateToken } from "../utils/jwt";
import { Types } from "mongoose";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { renderMailTemplate, sendMail } from "../utils/mail/mail";
import crypto from "crypto";
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
      
      const activationCode = crypto.randomBytes(32).toString('hex');

      const user = await User.create({
        fullName,
        username,
        phoneNumber,
        email,
        password: hashedPassword,
        role: "user",
        activationCode,
      });

      // Send welcome email with activation link
      try {
        const contentMail = await renderMailTemplate("registration-success", {
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt?.toISOString().split('T')[0], 
          activationLink: `${process.env.CLIENT_HOST}/auth/activation/${user.activationCode}`,
        }) as string;

        await sendMail({
          from: process.env.EMAIL_SMTP_USER,
          to: user.email,
          subject: "Selamat Datang di Zyvent - Aktivasi Akun",
          html: contentMail,
        });

        console.log(`Welcome email sent to: ${user.email}`);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail registration if email fails
      }

      return res.status(201).json({
        message: "Registration successful. Please check your email to activate your account.",
        user: {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
        },
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

  activate: async (req: Request, res: Response) => {
    /*
      #swagger.summary = 'Activate user account'
      #swagger.tags = ['Auth']
      #swagger.parameters['activationCode'] = {
        in: 'path',
        description: 'Activation code from email',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Account activated successfully'
      }
      #swagger.responses[400] = { description: 'Invalid or expired activation code' }
      #swagger.responses[500] = { description: 'Server Error' }
    */
    const { activationCode } = req.params;

    try {
      const user = await User.findOne({ activationCode });
      if (!user) {
        return res.status(400).json({ 
          message: "Invalid or expired activation code" 
        });
      }

      if (user.isActive) {
        return res.status(400).json({ 
          message: "Account is already activated" 
        });
      }

      // Activate the user
      user.isActive = true;
      user.activationCode = "";
      await user.save();

      return res.status(200).json({
        message: "Account activated successfully! You can now login.",
        user: {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          isActive: user.isActive,
        },
      });
    } catch (err: any) {
      console.error("Activation error:", err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
};
