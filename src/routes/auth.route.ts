import { Router } from "express";
import authController from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
  validateProfile,
} from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.get("/profile", validateProfile, authController.profile);
router.post("/activation", authController.activate);

export default router;
