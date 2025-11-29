import { Router } from "express";
import {
  register,
  login,
  logout,
  verifyAuth
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/verify", authMiddleware, verifyAuth);

export default router;
