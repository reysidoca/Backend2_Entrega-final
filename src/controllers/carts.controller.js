import { cartService } from "../services/cart.service.js";

export class CartsController {
  getById = async (req, res) => {
    const cart = await cartService.getById(req.params.cid);
    res.json({ status: "success", cart });
  };

  addProduct = async (req, res) => {
    const { quantity } = req.body;
    const cart = await cartService.addProduct({
      cartId: req.params.cid,
      productId: req.params.pid,
      quantity,
    });
    res.json({ status: "success", cart });
  };

  purchase = async (req, res) => {
    // purchaser = user logueado
    const purchaserEmail = req.user.email;
    const result = await cartService.purchase({ cartId: req.params.cid, purchaserEmail });
    res.json({ status: "success", ...result });
  };
}

export const cartsController = new CartsController();
