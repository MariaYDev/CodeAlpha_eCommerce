import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCategories().then(({ categories }) => setCategories(['All', ...categories])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;

    const timeout = setTimeout(() => {
      api
        .getProducts(params)
        .then(({ products }) => setProducts(products))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <div>
      <section className="border-b border-graphite-700 bg-graphite-900/40">
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-20">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-copper-500">
            Curated electronics, in stock now
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl mt-3 max-w-2xl leading-tight text-graphite-100">
            Gear that keeps your desk running.
          </h1>
          <p className="text-graphite-400 mt-4 max-w-lg">
            Headphones, keyboards, monitors, and the small accessories that make everything else work better.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                  category === c
                    ? 'border-copper-500 text-copper-400 bg-copper-500/10'
                    : 'border-graphite-600 text-graphite-400 hover:border-graphite-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {loading ? (
          <div className="text-center py-20 text-graphite-400 font-mono text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-graphite-400 font-mono text-sm">
            No products match your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
