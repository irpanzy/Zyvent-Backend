import mongoose from "mongoose";

export interface User {
  fullName: string;
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
}

const userSchema = new mongoose.Schema<User>(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    profilePicture: { type: String, default: "user.jpg", required: true },
    isActive: { type: Boolean, default: true },
    activationCode: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<User>("User", userSchema);

export default User;
