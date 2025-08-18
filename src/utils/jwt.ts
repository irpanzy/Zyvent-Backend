import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import "dotenv/config";

export interface IUserToken
  extends Omit<
    User,
    | "fullName"
    | "username"
    | "phoneNumber"
    | "email"
    | "password"
    | "activationCode"
    | "profilePicture"
    | "isActive"
  > {
  id?: Types.ObjectId;
}
export const generateToken = (user: IUserToken) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN;

  const payload = {
    id: user.id,
    role: user.role,
  };

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const getUserData = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as IUserToken;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
