import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id/confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="max-w-2xl mx-auto px-5 py-24 text-center">
                <h1 className="font-display font-bold text-2xl mb-2">
                  Page not found
                </h1>
                <p className="text-graphite-400">
                  The page you're looking for doesn't exist.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="border-t border-graphite-700 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-5 text-center text-xs font-mono text-graphite-500">
          CIRCUIT — demo electronics store.
        </div>
      </footer>
    </div>
  );
}
