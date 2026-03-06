import { productService } from "../services/product.service.js";

export class ProductsController {
  list = async (req, res) => {
    const products = await productService.list();
    res.json({ status: "success", products });
  };

  getById = async (req, res) => {
    const product = await productService.getById(req.params.pid);
    res.json({ status: "success", product });
  };

  create = async (req, res) => {
    const { title, code, price, stock } = req.body;
    if (!title || !code || price == null || stock == null) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const product = await productService.create(req.body);
    res.status(201).json({ status: "success", product });
  };

  update = async (req, res) => {
    const product = await productService.update(req.params.pid, req.body);
    res.json({ status: "success", product });
  };

  delete = async (req, res) => {
    const product = await productService.delete(req.params.pid);
    res.json({ status: "success", product });
  };
}

export const productsController = new ProductsController();
