import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../api/api';

export default function Checkout() {
  const { token } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <p className="text-graphite-400 mb-5">Your cart is empty — nothing to check out.</p>
        <Link to="/" className="btn-secondary">Browse products</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { order } = await api.checkout(token, address);
      await clearCart();
      navigate(`/orders/${order.id}/confirmation`, { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl mb-8">Checkout</h1>

      <div className="card p-5 mb-6">
        <h2 className="font-display font-semibold text-sm text-graphite-200 mb-3">Order summary</h2>
        <div className="space-y-2 font-mono text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-graphite-300">
              <span>{item.name} × {item.quantity}</span>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="trace-divider my-3" />
        <div className="flex justify-between font-mono text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        <h2 className="font-display font-semibold text-sm text-graphite-200">Shipping address</h2>
        <textarea
          required
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St, Springfield, ST 12345"
          className="input-field resize-none"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <p className="text-xs text-graphite-500 font-mono">
          This is a demo store — no real payment is collected.
        </p>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Placing order...' : `Place order — $${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
