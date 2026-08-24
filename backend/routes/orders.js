const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// POST /api/orders - checkout: turns current cart into an order
router.post('/', (req, res) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress || !shippingAddress.trim()) {
    return res.status(400).json({ error: 'A shipping address is required.' });
  }

  const db = readDB();
  const cart = db.carts[req.user.id] || [];
  if (cart.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty.' });
  }

  const items = [];
  for (const item of cart) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) continue;
    if (item.quantity > product.stock) {
      return res.status(400).json({ error: `${product.name} only has ${product.stock} in stock.` });
    }
    items.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: item.quantity,
      subtotal: +(product.price * item.quantity).toFixed(2)
    });
  }

  // Decrement stock
  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  }

  const total = +items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2);

  const order = {
    id: uuidv4(),
    userId: req.user.id,
    items,
    total,
    shippingAddress: shippingAddress.trim(),
    status: 'processing',
    createdAt: new Date().toISOString()
  };

  db.orders.push(order);
  db.carts[req.user.id] = []; // clear cart after checkout
  writeDB(db);

  res.status(201).json({ order });
});

// GET /api/orders - list current user's orders
router.get('/', (req, res) => {
  const db = readDB();
  const orders = db.orders
    .filter(o => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders });
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json({ order });
});

module.exports = router;
