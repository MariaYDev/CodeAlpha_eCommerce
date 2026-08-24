import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getProduct(id)
      .then(({ product }) => setProduct(product))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    setAdding(true);
    setError('');
    try {
      await addToCart(id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-5 py-20 text-center text-graphite-400 font-mono text-sm">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <p className="text-graphite-400 mb-4">{error || 'Product not found.'}</p>
        <Link to="/" className="btn-secondary">Back to store</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <Link to="/" className="text-sm text-graphite-400 hover:text-copper-400 font-mono">&larr; Back to store</Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <div className="card overflow-hidden aspect-square bg-graphite-800">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-copper-500">{product.category}</span>
          <h1 className="font-display font-bold text-3xl mt-2 text-graphite-100">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-graphite-400 font-mono">
            <span>★ {product.rating}</span>
            <span>&middot;</span>
            <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          </div>

          <p className="text-graphite-300 mt-5 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <h2 className="font-display text-sm font-semibold text-graphite-200 mb-2">Specifications</h2>
            <div className="card px-4">
              {product.specs.map((spec, i) => (
                <div key={i} className="spec-row last:border-b-0">
                  <span className="text-graphite-400">{`spec_0${i + 1}`}</span>
                  <span className="text-graphite-100">{spec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="trace-divider my-6" />

          <div className="flex items-center justify-between">
            <span className="font-mono text-3xl text-graphite-100">${product.price.toFixed(2)}</span>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-graphite-600 rounded-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-graphite-300 hover:text-copper-400"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-3 font-mono text-sm w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-graphite-300 hover:text-copper-400"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="btn-primary"
              >
                {product.stock === 0 ? 'Out of stock' : added ? 'Added ✓' : adding ? 'Adding...' : 'Add to cart'}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
}
