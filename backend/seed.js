// Resets data/db.json back to the default seed data (8 products, no users/orders).
const fs = require('fs');
const path = require('path');
const { DEFAULT_PRODUCTS, DB_PATH } = require('./db');

const initial = {
  products: DEFAULT_PRODUCTS,
  users: [],
  orders: [],
  carts: {}
};

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
console.log('Database seeded with', DEFAULT_PRODUCTS.length, 'products at', DB_PATH);
