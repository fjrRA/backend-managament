// src/controllers/productController.js
const prisma = require('../config/db');
const { productCreateSchema, productUpdateSchema } = require('../utils/validators');

// LIST (public) + pagination ?page=&limit=
exports.getAllProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.product.findMany({ skip, take: limit }),
      prisma.product.count(),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// DETAIL (public)
exports.getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id_product: req.params.id }, // UUID string
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// CREATE (admin)
exports.createProduct = async (req, res, next) => {
  try {
    const data = productCreateSchema.parse(req.body);
    const created = await prisma.product.create({ data });
    res.status(201).json({ message: 'Product created', product: created });
  } catch (err) {
    next(err);
  }
};

// UPDATE (admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const data = productUpdateSchema.parse(req.body);
    const updated = await prisma.product.update({
      where: { id_product: req.params.id },
      data,
    });
    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE (admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id_product: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
