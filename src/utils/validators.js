// src/utils/validators.js
const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(6, 'Min 6 chars'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const productCreateSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
});

const productUpdateSchema = productCreateSchema.partial();

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'At least 1 item'),
});

module.exports = {
  registerSchema,
  loginSchema,
  productCreateSchema,
  productUpdateSchema,
  createOrderSchema,
};
