import { CartModel } from "../../models/Cart.js";

export class CartDAO {
  async create(data = {}) {
    const doc = await CartModel.create(data);
    return doc.toObject();
  }

  async findById(id) {
    return CartModel.findById(id).populate("products.product").lean();
  }

  async updateById(id, data) {
    return CartModel.findByIdAndUpdate(id, data, { new: true })
      .populate("products.product")
      .lean();
  }

  async deleteById(id) {
    return CartModel.findByIdAndDelete(id).lean();
  }
}
