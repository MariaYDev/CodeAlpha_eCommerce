import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const { token } = useAuth();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order) return;
    api
      .getOrder(token, id)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, order, token]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-5 py-20 text-center text-graphite-400 font-mono text-sm">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <p className="text-graphite-400 mb-5">{error || 'Order not found.'}</p>
        <Link to="/" className="btn-secondary">Back to store</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-copper-500/10 border border-copper-500 flex items-center justify-center mx-auto mb-5">
        <span className="text-copper-400 text-2xl">✓</span>
      </div>
      <h1 className="font-display font-bold text-2xl mb-2">Order confirmed</h1>
      <p className="text-graphite-400 mb-8 font-mono text-sm">Order #{order.id.slice(0, 8)}</p>

      <div className="card p-5 text-left">
        <div className="space-y-2 font-mono text-sm mb-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-graphite-300">
              <span>{item.name} × {item.quantity}</span>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="trace-divider mb-4" />
        <div className="flex justify-between font-mono text-lg mb-4">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        <div className="text-sm">
          <span className="text-graphite-400 font-mono">Shipping to:</span>
          <p className="text-graphite-200 mt-1">{order.shippingAddress}</p>
        </div>
      </div>

      <div className="flex gap-3 justify-center mt-8">
        <Link to="/" className="btn-secondary">Continue shopping</Link>
        <Link to="/orders" className="btn-primary">View my orders</Link>
      </div>
    </div>
  );
}
