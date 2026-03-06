import { cartRepository, productRepository, ticketRepository } from "../repositories/index.js";
import { randomUUID } from "crypto";

export class CartService {
  async getById(id) {
    const cart = await cartRepository.findById(id);
    if (!cart) {
      const err = new Error("Carrito no encontrado");
      err.status = 404;
      throw err;
    }
    return cart;
  }

  async addProduct({ cartId, productId, quantity = 1 }) {
    const cart = await this.getById(cartId);
    const product = await productRepository.findById(productId);
    if (!product) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }

    const qty = Number(quantity) || 1;
    if (qty < 1) {
      const err = new Error("Cantidad inválida");
      err.status = 400;
      throw err;
    }

    const products = cart.products || [];
    const idx = products.findIndex((p) => p.product?._id?.toString?.() === productId || p.product?.toString?.() === productId);

    if (idx >= 0) {
      products[idx].quantity += qty;
    } else {
      products.push({ product: productId, quantity: qty });
    }

    const updated = await cartRepository.updateById(cartId, { products });
    return updated;
  }

  /**
   * Compra robusta:
   * - Si hay stock: descuenta stock y compra.
   * - Si no hay: queda en el carrito (compra incompleta).
   * - Genera Ticket con amount y purchaser.
   */
  async purchase({ cartId, purchaserEmail }) {
    const cart = await this.getById(cartId);

    const notPurchased = [];
    let amount = 0;

    // Re-armamos el carrito: dejamos sólo lo NO comprado
    const remaining = [];

    for (const item of cart.products || []) {
      const prod = item.product?._id ? item.product : await productRepository.findById(item.product);
      const productId = prod?._id?.toString?.() || item.product?.toString?.();
      if (!prod) {
        notPurchased.push({ product: productId, reason: "Producto inexistente" });
        continue;
      }

      if (prod.stock >= item.quantity) {
        // compra
        const newStock = prod.stock - item.quantity;
        await productRepository.updateById(productId, { stock: newStock });
        amount += prod.price * item.quantity;
      } else {
        // no hay stock suficiente
        remaining.push({ product: productId, quantity: item.quantity });
        notPurchased.push({ product: productId, reason: "Stock insuficiente" });
      }
    }

    // actualizamos carrito con lo no comprado
    await cartRepository.updateById(cartId, { products: remaining });

    const ticket = await ticketRepository.create({
      code: randomUUID(),
      purchase_datetime: new Date(),
      amount,
      purchaser: purchaserEmail,
    });

    return { ticket, notPurchased };
  }
}

export const cartService = new CartService();
