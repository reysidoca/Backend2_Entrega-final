import { productRepository } from "../repositories/index.js";

export class ProductService {
  list() {
    return productRepository.findAll();
  }

  async getById(id) {
    const prod = await productRepository.findById(id);
    if (!prod) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
    return prod;
  }

  create(data) {
    return productRepository.create(data);
  }

  async update(id, data) {
    const updated = await productRepository.updateById(id, data);
    if (!updated) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
    return updated;
  }

  async delete(id) {
    const deleted = await productRepository.deleteById(id);
    if (!deleted) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
    return deleted;
  }
}

export const productService = new ProductService();
