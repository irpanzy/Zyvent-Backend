import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Zyvent API 🚀" });
});

router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
