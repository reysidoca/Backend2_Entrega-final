import { Router } from "express";
import { productsController } from "../controllers/products.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", asyncHandler(productsController.list));
router.get("/:pid", asyncHandler(productsController.getById));

// Solo admin: create/update/delete
router.post("/", requireAuth(), authorizeRoles("admin"), asyncHandler(productsController.create));
router.put("/:pid", requireAuth(), authorizeRoles("admin"), asyncHandler(productsController.update));
router.delete("/:pid", requireAuth(), authorizeRoles("admin"), asyncHandler(productsController.delete));

export default router;
