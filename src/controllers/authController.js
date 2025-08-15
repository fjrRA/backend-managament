// src/controllers/authController.js
const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../utils/validators');

const signToken = (user) => {
  // sub = subject (id user), juga taruh role biar gampang authorize
  return jwt.sign({ sub: user.id_user, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ message: 'Email sudah terdaftar' });

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed, role: 'customer' },
    });

    res.status(201).json({
      id_user: user.id_user,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      id_user: user.id_user,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user),
    });
  } catch (err) {
    next(err);
  }
};
