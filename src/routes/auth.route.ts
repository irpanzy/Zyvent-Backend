import { Router } from "express";
import authController from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

export default router;
