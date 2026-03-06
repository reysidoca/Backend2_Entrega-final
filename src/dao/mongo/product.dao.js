import { ProductModel } from "../../models/Product.js";

export class ProductDAO {
  async create(data) {
    const doc = await ProductModel.create(data);
    return doc.toObject();
  }

  async findById(id) {
    return ProductModel.findById(id).lean();
  }

  async findAll() {
    return ProductModel.find().lean();
  }

  async updateById(id, data) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async deleteById(id) {
    return ProductModel.findByIdAndDelete(id).lean();
  }
}
