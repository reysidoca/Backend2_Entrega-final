const express = require('express');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const router = express.Router();

// Crear carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    console.error('Error en POST /api/carts', error);
    res.status(500).json({ status: 'error', message: 'Error al crear carrito' });
  }
});

// Obtener carrito por id (con populate)
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate('products.product')
      .lean();

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error en GET /api/carts/:cid', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener carrito' });
  }
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    const existingProduct = cart.products.find((p) => p.product.toString() === pid);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    res.json({ status: 'success', message: 'Producto agregado al carrito', payload: cart });
  } catch (error) {
    console.error('Error en POST /api/carts/:cid/products/:pid', error);
    res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito' });
  }
});

// DELETE api/carts/:cid/products/:pid -> eliminar producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: 'success', message: 'Producto eliminado del carrito', payload: cart });
  } catch (error) {
    console.error('Error en DELETE /api/carts/:cid/products/:pid', error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar producto del carrito' });
  }
});

// PUT api/carts/:cid -> actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: 'error',
        message: 'El cuerpo debe tener un arreglo "products"'
      });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = products.map((p) => ({
      product: p.product,
      quantity: p.quantity || 1
    }));

    await cart.save();

    res.json({ status: 'success', message: 'Carrito actualizado', payload: cart });
  } catch (error) {
    console.error('Error en PUT /api/carts/:cid', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar carrito' });
  }
});

// PUT api/carts/:cid/products/:pid -> actualizar SOLO la cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'La cantidad debe ser un número mayor o igual a 0'
      });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const productInCart = cart.products.find((p) => p.product.toString() === pid);
    if (!productInCart) {
      return res
        .status(404)
        .json({ status: 'error', message: 'El producto no existe en el carrito' });
    }

    if (quantity === 0) {
      cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    } else {
      productInCart.quantity = quantity;
    }

    await cart.save();

    res.json({
      status: 'success',
      message: 'Cantidad de producto actualizada',
      payload: cart
    });
  } catch (error) {
    console.error('Error en PUT /api/carts/:cid/products/:pid', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar cantidad del producto' });
  }
});

// DELETE api/carts/:cid -> eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = [];
    await cart.save();

    res.json({ status: 'success', message: 'Carrito vaciado', payload: cart });
  } catch (error) {
    console.error('Error en DELETE /api/carts/:cid', error);
    res.status(500).json({ status: 'error', message: 'Error al vaciar carrito' });
  }
});

module.exports = router;
