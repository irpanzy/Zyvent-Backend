import { Request, Response } from "express";

export default {
  login: (req: Request, res: Response) => {
    res.status(200).json({ message: "Login successful" });
  },
  register: (req: Request, res: Response) => {
    res.status(201).json({ message: "User registered successfully" });
  },
};
