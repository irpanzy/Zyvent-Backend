import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Zyvent API 🚀" });
});

router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

router.post("/api/v1/login", authController.login);
router.post("/api/v1/register", authController.register);

export default router;
