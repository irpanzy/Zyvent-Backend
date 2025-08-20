import { Router } from "express";
import authRoutes from "./auth.route";

const router = Router();

router.get("/v1", (req, res) => {
  res.json({ message: "Welcome to Zyvent API 🚀" });
});

router.get("/v1/health", (req, res) => {
  res.json({ status: "OK" });
});

router.use("/v1/auth", authRoutes);

export default router;
