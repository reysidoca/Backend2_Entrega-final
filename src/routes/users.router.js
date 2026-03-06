import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(usersController.list));
router.get("/:uid", asyncHandler(usersController.getById));
router.post("/", asyncHandler(usersController.create));
router.put("/:uid", asyncHandler(usersController.update));
router.delete("/:uid", asyncHandler(usersController.delete));

export default router;
