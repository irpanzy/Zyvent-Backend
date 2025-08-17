import { Request, Response, NextFunction } from "express";
import {
  loginValidateSchema,
  registerValidateSchema,
} from "../validators/auth.schema";

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
