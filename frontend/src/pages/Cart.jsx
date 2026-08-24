import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { token } = useAuth();
  const { items, total, loading, error, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h1 className="font-display font-bold text-2xl mb-3">Your cart</h1>
        <p className="text-graphite-400 mb-6">Log in to view your cart and start adding products.</p>
        <Link to="/login" className="btn-primary">Log in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl mb-8">Your cart</h1>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-graphite-400 font-mono text-sm">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-graphite-400 mb-5">Your cart is empty.</p>
          <Link to="/" className="btn-secondary">Browse products</Link>
        </div>
      ) : (
        <>
          <div className="card divide-y divide-graphite-700">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 p-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-sm bg-graphite-800" />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.productId}`} className="font-display font-semibold hover:text-copper-400 transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-sm text-graphite-400 font-mono mt-1">${item.price.toFixed(2)} each</p>
                </div>

                <div className="flex items-center border border-graphite-600 rounded-sm">
                  <button
                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    className="px-2.5 py-1.5 text-graphite-300 hover:text-copper-400"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-2.5 font-mono text-sm w-7 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                    className="px-2.5 py-1.5 text-graphite-300 hover:text-copper-400"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <span className="font-mono w-20 text-right">${item.subtotal.toFixed(2)}</span>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-graphite-500 hover:text-red-400 text-sm px-2"
                  aria-label={`Remove ${item.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 card p-5">
            <span className="font-display font-semibold text-lg">Total</span>
            <span className="font-mono text-2xl">${total.toFixed(2)}</span>
          </div>

          <div className="flex justify-end mt-5">
            <button onClick={() => navigate('/checkout')} className="btn-primary">
              Proceed to checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
