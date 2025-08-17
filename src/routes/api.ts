import { Router } from "express";
import authRoutes from "./auth.route";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Zyvent API 🚀" });
});

router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

router.use("/auth", authRoutes);

export default router;
