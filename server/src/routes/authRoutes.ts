import { Router } from "express";
import * as authController from "../controllers/authController";
import { authMiddleware } from "../middlewares/auth";


const router = Router();

router.post(
  "/register",
  
  authController.register
);
router.post(
  "/login",
  authController.login
);

router.post(
  "/refresh",
  authController.refresh
);

router.post(
  "/logout",
  authController.logout
);

router.get("/profile", authMiddleware, authController.getProfile);

export default router;