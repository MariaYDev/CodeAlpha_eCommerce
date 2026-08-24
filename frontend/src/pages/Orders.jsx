import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getOrders(token)
      .then(({ orders }) => setOrders(orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl mb-8">Order history</h1>

      {loading ? (
        <p className="text-graphite-400 font-mono text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-graphite-400 mb-5">You haven't placed any orders yet.</p>
          <Link to="/" className="btn-secondary">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}/confirmation`}
              className="card p-5 flex items-center justify-between hover:border-copper-500 transition-colors block"
            >
              <div>
                <p className="font-mono text-sm text-graphite-200">#{order.id.slice(0, 8)}</p>
                <p className="text-xs text-graphite-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                  {' · '}
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg text-graphite-100">${order.total.toFixed(2)}</p>
                <span className="text-xs font-mono uppercase tracking-wide text-signal-500">{order.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
