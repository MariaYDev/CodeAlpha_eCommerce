const express = require('express');
const { readDB } = require('../db');

const router = express.Router();

// GET /api/products?search=&category=
router.get('/', (req, res) => {
  const db = readDB();
  let products = db.products;

  const { search, category } = req.query;

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }

  res.json({ products });
});

router.get('/categories', (req, res) => {
  const db = readDB();
  const categories = [...new Set(db.products.map(p => p.category))];
  res.json({ categories });
});

router.get('/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json({ product });
});

module.exports = router;
