import { Router } from "express";
import { cartsController } from "../controllers/carts.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:cid", asyncHandler(cartsController.getById));

// Solo user: agregar productos al carrito
router.post(
  "/:cid/product/:pid",
  requireAuth(),
  authorizeRoles("user"),
  asyncHandler(cartsController.addProduct)
);

// Compra (user)
router.post(
  "/:cid/purchase",
  requireAuth(),
  authorizeRoles("user"),
  asyncHandler(cartsController.purchase)
);

export default router;
