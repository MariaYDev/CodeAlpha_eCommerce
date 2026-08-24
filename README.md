# CIRCUIT — Electronics Store

A full-stack e-commerce site for an electronics store (wireless headphones, mechanical
keyboard, gaming mouse, 4K monitor, laptop stand, USB-C hub, webcam, portable SSD).

- **Frontend:** React + React Router + Tailwind CSS (Vite)
- **Backend:** Express.js (Node.js) REST API with JWT authentication
- **Database:** a lightweight JSON file database (`backend/data/db.json`), auto-created
  and auto-seeded with the 8 products the first time the server runs — no external
  database server to install.

## Features

- Product listing with search and category filtering
- Product detail pages with specs, stock, and quantity selector
- User registration / login (bcrypt-hashed passwords, JWT sessions)
- Shopping cart (add, update quantity, remove) tied to the logged-in user
- Checkout / order processing (stock is decremented, cart is cleared, an order record
  is created)
- Order history and order confirmation pages

## Project structure

```
ecommerce-store/
├── backend/            Express API
│   ├── server.js
│   ├── db.js            JSON file database helper
│   ├── seed.js           resets the database to the default 8 products
│   ├── middleware/auth.js
│   ├── public
│   │   └── images
│   │
│   └── routes/           auth.js, products.js, cart.js, orders.js
└── frontend/           React app (Vite)
    └── src/
        ├── api/api.js     fetch wrapper for the backend
        ├── context/       AuthContext, CartContext
        ├── components/    Navbar, ProductCard, ProtectedRoute
        └── pages/         Home, ProductDetail, Cart, Login, Register,
                            Checkout, OrderConfirmation, Orders
```

## Running it locally

You'll need [Node.js](https://nodejs.org) 18+ installed. Open two terminals.

### 1. Backend

```bash
cd backend
cp .env.example .env      # defaults are fine for local dev
npm install
npm start                 # or: npm run dev  (auto-restarts on changes, requires nodemon)
```

The API runs at `http://localhost:5000`. On first run it creates
`backend/data/db.json` seeded with the 8 products. To wipe all users/orders/carts and
reset back to just the 8 products at any time, run `npm run seed`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api/*` requests to the backend
at `localhost:5000` (configured in `vite.config.js`), so both servers need to be
running at the same time.

Open `http://localhost:5173` in your browser.

### 3. Try it out

1. Browse products on the home page, search, or filter by category.
2. Click a product to see its detail page.
3. Sign up for an account (or log in) — this is required to use the cart.
4. Add a few products to your cart, adjust quantities.
5. Go to checkout, enter a shipping address, and place the order.
6. View your order confirmation and order history.

## Notes on the database

`backend/data/db.json` is a plain JSON file acting as the database — it stores
`products`, `users` (with hashed passwords), `orders`, and each user's `carts`. This
keeps the project dependency-free and easy to run anywhere without installing
PostgreSQL/MongoDB/etc. If you want to swap in a real database later (Postgres,
MongoDB, SQLite via an ORM), the `readDB()` / `writeDB()` functions in `backend/db.js`
are the only place that needs to change — every route just calls those two functions.

## Deploying

- **Backend:** deploy `backend/` to any Node host (Render, Railway, Fly.io, a VPS,
  etc). Set a strong `JWT_SECRET` in the environment. Note the JSON-file database
  works for demos but isn't safe for concurrent production traffic — swap in a real
  database for production use.
- **Frontend:** run `npm run build` in `frontend/` to produce a static `dist/` folder
  you can deploy to Vercel, Netlify, or any static host. Update the API base URL (or
  keep a reverse-proxy rule like the Vite dev proxy) to point `/api` at your deployed
  backend.

## Security notes

This is a demo/learning project. Before using it for anything real:

- Replace the placeholder `JWT_SECRET` with a strong secret, kept out of source control.
- Add HTTPS in front of the backend.
- Add rate limiting on `/api/auth/*`.
- Move from the JSON file database to a real database with proper transactions.
- No real payment processing is implemented — checkout only records the order.
