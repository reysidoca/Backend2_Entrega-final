const express = require('express');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

const router = express.Router();

// Redirigir a /products
router.get('/', (req, res) => {
  res.redirect('/products');
});

// Vista de productos con paginación
router.get('/products', async (req, res) => {
  try {
    const {
      limit: limitQuery,
      page: pageQuery,
      sort,
      query
    } = req.query;

    const limit = parseInt(limitQuery) || 10;
    const page = parseInt(pageQuery) || 1;

    let filter = {};
    if (query) {
      const [field, rawValue] = query.split(':');
      if (field && rawValue) {
        if (field === 'status' || field === 'available') {
          filter.status = rawValue === 'true';
        } else {
          filter[field] = rawValue;
        }
      } else {
        filter.category = query;
      }
    }

    let sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;

    const options = {
      page,
      limit,
      lean: true
    };

    if (sortOption.price) {
      options.sort = sortOption;
    }

    const result = await Product.paginate(filter, options);

    const buildLink = (pageValue) => {
      const params = new URLSearchParams();
      params.set('page', pageValue);
      params.set('limit', limit);
      if (sort) params.set('sort', sort);
      if (query) params.set('query', query);
      return `/products?${params.toString()}`;
    };

    res.render('index', {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
      page: result.page,
      totalPages: result.totalPages
    });
  } catch (error) {
    console.error('Error en vista /products', error);
    res.status(500).send('Error al cargar productos');
  }
});

// Vista de carrito específico
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate('products.product')
      .lean();

    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    let total = 0;
    cart.products.forEach((item) => {
      if (item.product && item.product.price) {
        total += item.product.price * item.quantity;
      }
    });

    res.render('cart', { cart, total });
  } catch (error) {
    console.error('Error en vista /carts/:cid', error);
    res.status(500).send('Error al cargar carrito');
  }
});

module.exports = router;
