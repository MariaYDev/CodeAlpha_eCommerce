const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    category: 'Audio',
    price: 89.99,
    image: 'https://placehold.co/500x500?text=Wireless+Headphones',
    description: 'Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cups for all-day comfort.',
    specs: ['Bluetooth 5.3', '30hr battery life', 'Active Noise Cancellation', 'Built-in mic'],
    stock: 42,
    rating: 4.6
  },
  {
    id: 'p2',
    name: 'Mechanical Keyboard',
    category: 'Peripherals',
    price: 74.99,
    image: 'https://placehold.co/500x500?text=Mechanical+Keyboard',
    description: 'Full-size mechanical keyboard with hot-swappable switches, per-key RGB backlighting, and a durable aluminum top plate.',
    specs: ['Hot-swappable switches', 'RGB backlight', 'Aluminum frame', 'USB-C detachable cable'],
    stock: 35,
    rating: 4.7
  },
  {
    id: 'p3',
    name: 'Gaming Mouse',
    category: 'Peripherals',
    price: 49.99,
    image: 'https://placehold.co/500x500?text=Gaming+Mouse',
    description: 'Lightweight gaming mouse with a 26,000 DPI optical sensor, six programmable buttons, and up to 70 hours of battery life.',
    specs: ['26,000 DPI sensor', '6 programmable buttons', '70hr battery', 'Ultra-lightweight 63g'],
    stock: 58,
    rating: 4.5
  },
  {
    id: 'p4',
    name: '4K Monitor',
    category: 'Displays',
    price: 329.99,
    image: 'https://placehold.co/500x500?text=4K+Monitor',
    description: '27-inch 4K UHD IPS monitor with 99% sRGB color accuracy, HDR10 support, and a 144Hz refresh rate for work and play.',
    specs: ['27" 4K UHD IPS', '144Hz refresh rate', 'HDR10', '99% sRGB'],
    stock: 20,
    rating: 4.8
  },
  {
    id: 'p5',
    name: 'Laptop Stand',
    category: 'Accessories',
    price: 34.99,
    image: 'https://placehold.co/500x500?text=Laptop+Stand',
    description: 'Adjustable aluminum laptop stand that improves posture and airflow, foldable for travel and compatible with 10-17" laptops.',
    specs: ['Aluminum alloy build', 'Adjustable height & angle', 'Foldable/portable', 'Fits 10-17" laptops'],
    stock: 60,
    rating: 4.4
  },
  {
    id: 'p6',
    name: 'USB-C Hub',
    category: 'Accessories',
    price: 39.99,
    image: 'https://placehold.co/500x500?text=USB-C+Hub',
    description: '8-in-1 USB-C hub with HDMI 4K output, 100W power delivery passthrough, SD/microSD card readers, and 3 USB-A ports.',
    specs: ['8-in-1 ports', 'HDMI 4K@30Hz', '100W PD passthrough', 'SD/microSD reader'],
    stock: 75,
    rating: 4.3
  },
  {
    id: 'p7',
    name: 'Webcam',
    category: 'Peripherals',
    price: 59.99,
    image: 'https://placehold.co/500x500?text=Webcam',
    description: '1080p HD webcam with autofocus, built-in dual noise-cancelling microphones, and a privacy shutter for video calls and streaming.',
    specs: ['1080p 60fps', 'Autofocus', 'Dual noise-cancelling mics', 'Privacy shutter'],
    stock: 47,
    rating: 4.2
  },
  {
    id: 'p8',
    name: 'Portable SSD',
    category: 'Storage',
    price: 109.99,
    image: 'https://placehold.co/500x500?text=Portable+SSD',
    description: '1TB portable SSD with read speeds up to 1050MB/s, shock-resistant aluminum housing, and USB-C connectivity.',
    specs: ['1TB capacity', 'Up to 1050MB/s read', 'USB 3.2 Gen 2 / USB-C', 'Shock-resistant'],
    stock: 30,
    rating: 4.7
  }
];

function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const initial = {
      products: DEFAULT_PRODUCTS,
      users: [],
      orders: [],
      carts: {}
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
}

function readDB() {
  ensureDB();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB, ensureDB, DEFAULT_PRODUCTS, DB_PATH };
