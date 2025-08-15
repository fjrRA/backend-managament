// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();

const { createOrder, myOrders } = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, createOrder);
router.get('/me', authenticate, myOrders);

module.exports = router;
