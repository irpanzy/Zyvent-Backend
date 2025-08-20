import { Request, Response, NextFunction } from "express";
import {
  loginValidateSchema,
  registerValidateSchema,
} from "../validators/auth.schema";
import { getUserData } from "../utils/jwt";
import { Types } from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    id: Types.ObjectId;
    role: string;
  };
}

export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await registerValidateSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors,
    });
  }
};

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await loginValidateSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors,
    });
  }
};

export const validateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token required" });
    }

    const token = authHeader.substring(7);

    const userData = getUserData(token);

    if (!userData.id || !userData.role) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = {
      id: userData.id,
      role: userData.role,
    };

    next();
  } catch (err: any) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
