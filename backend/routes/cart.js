const express = require('express');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function buildCartResponse(db, userId) {
  const items = db.carts[userId] || [];
  const enriched = items
    .map(item => {
      const product = db.products.find(p => p.id === item.productId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        subtotal: +(product.price * item.quantity).toFixed(2),
        stock: product.stock
      };
    })
    .filter(Boolean);

  const total = +enriched.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2);
  return { items: enriched, total };
}

router.get('/', (req, res) => {
  const db = readDB();
  res.json(buildCartResponse(db, req.user.id));
});

router.post('/', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId is required.' });
  if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1.' });

  const db = readDB();
  const product = db.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  if (!db.carts[req.user.id]) db.carts[req.user.id] = [];
  const cart = db.carts[req.user.id];
  const existing = cart.find(i => i.productId === productId);

  const desiredQty = existing ? existing.quantity + quantity : quantity;
  if (desiredQty > product.stock) {
    return res.status(400).json({ error: `Only ${product.stock} in stock.` });
  }

  if (existing) {
    existing.quantity = desiredQty;
  } else {
    cart.push({ productId, quantity });
  }

  writeDB(db);
  res.status(201).json(buildCartResponse(db, req.user.id));
});

router.put('/:productId', (req, res) => {
  const { quantity } = req.body;
  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be a number of at least 1.' });
  }

  const db = readDB();
  const product = db.products.find(p => p.id === req.params.productId);
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  if (quantity > product.stock) return res.status(400).json({ error: `Only ${product.stock} in stock.` });

  const cart = db.carts[req.user.id] || [];
  const item = cart.find(i => i.productId === req.params.productId);
  if (!item) return res.status(404).json({ error: 'Item not in cart.' });

  item.quantity = quantity;
  writeDB(db);
  res.json(buildCartResponse(db, req.user.id));
});

router.delete('/:productId', (req, res) => {
  const db = readDB();
  db.carts[req.user.id] = (db.carts[req.user.id] || []).filter(
    i => i.productId !== req.params.productId
  );
  writeDB(db);
  res.json(buildCartResponse(db, req.user.id));
});

router.delete('/', (req, res) => {
  const db = readDB();
  db.carts[req.user.id] = [];
  writeDB(db);
  res.json(buildCartResponse(db, req.user.id));
});

module.exports = router;
