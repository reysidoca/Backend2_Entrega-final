import { Router } from "express";
import { sessionsController } from "../controllers/sessions.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", asyncHandler(sessionsController.register));
router.post("/login", sessionsController.login);
router.get("/current", requireAuth(), asyncHandler(sessionsController.current));
router.post("/logout", asyncHandler(sessionsController.logout));

// Password recovery
router.post("/forgot-password", asyncHandler(sessionsController.forgotPassword));
router.post("/reset-password", asyncHandler(sessionsController.resetPassword));

export default router;
