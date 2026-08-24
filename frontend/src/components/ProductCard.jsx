import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="card group overflow-hidden flex flex-col hover:border-copper-500 transition-colors"
    >
      <div className="aspect-square bg-graphite-800 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-copper-500">
          {product.category}
        </span>
        <h3 className="font-display font-semibold text-graphite-100 leading-snug">
          {product.name}
        </h3>
        <p className="text-sm text-graphite-400 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-mono text-lg text-graphite-100">${product.price.toFixed(2)}</span>
          <span className="text-xs font-mono text-graphite-400">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}
