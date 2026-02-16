const express = require('express');
const Product = require('../models/product.model');

const router = express.Router();

// GET /api/products
// ?limit=&page=&sort=&query=
router.get('/', async (req, res) => {
  try {
    const {
      limit: limitQuery,
      page: pageQuery,
      sort,
      query
    } = req.query;

    const limit = parseInt(limitQuery) || 10;
    const page = parseInt(pageQuery) || 1;

    // Filtro por query: category:ropa / status:true
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
        // Si no viene con "campo:valor", lo tomamos como categoría
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

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const makeLink = (pageValue) => {
      const params = new URLSearchParams();
      params.set('page', pageValue);
      params.set('limit', limit);
      if (sort) params.set('sort', sort);
      if (query) params.set('query', query);
      return `${baseUrl}?${params.toString()}`;
    };

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? makeLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? makeLink(result.nextPage) : null
    });
  } catch (error) {
    console.error('Error en GET /api/products:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener productos'
    });
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', payload: product });
  } catch (error) {
    console.error('Error en GET /api/products/:pid', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener el producto' });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    } = req.body;

    const newProduct = await Product.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    });

    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    console.error('Error en POST /api/products', error);
    res.status(500).json({ status: 'error', message: 'Error al crear producto' });
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, {
      new: true
    }).lean();

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', payload: updated });
  } catch (error) {
    console.error('Error en PUT /api/products/:pid', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar producto' });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid).lean();
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error en DELETE /api/products/:pid', error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar producto' });
  }
});

module.exports = router;
