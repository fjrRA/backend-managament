// src/controllers/orderController.js
const prisma = require('../config/db');
const { createOrderSchema } = require('../utils/validators');

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items } = createOrderSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      // validasi stok
      for (const it of items) {
        const p = await tx.product.findUnique({ where: { id_product: it.productId } });
        if (!p) throw Object.assign(new Error('Product not found'), { status: 404 });
        if (p.stock < it.quantity) {
          throw Object.assign(new Error(`Insufficient stock for ${p.name}`), { status: 400 });
        }
      }

      // buat order
      const order = await tx.order.create({ data: { userId: req.user.id_user } });

      // buat item + kurangi stok
      for (const it of items) {
        const updated = await tx.product.update({
          where: { id_product: it.productId },
          data: { stock: { decrement: it.quantity } },
        });

        await tx.orderItem.create({
          data: {
            orderId: order.id_order,
            productId: updated.id_product,
            quantity: it.quantity,
            price: updated.price,
          },
        });
      }

      return order;
    });

    const full = await prisma.order.findUnique({
      where: { id_order: result.id_order },
      include: { items: { include: { product: true } } },
    });

    res.status(201).json(full);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/me
exports.myOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id_user },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
