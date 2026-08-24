import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-graphite-950/90 backdrop-blur border-b border-graphite-700">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg tracking-tight text-graphite-100 flex items-center gap-2">
          <span className="text-copper-500">/</span>CIRCUIT
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/cart"
            className="relative px-3 py-2 text-sm font-medium text-graphite-200 hover:text-copper-400 transition-colors"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-copper-500 text-graphite-950 text-[10px] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="px-3 py-2 text-sm font-medium text-graphite-200 hover:text-copper-400 transition-colors hidden sm:inline-block">
                Orders
              </Link>
              <span className="text-sm text-graphite-400 hidden md:inline-block font-mono">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-secondary !px-3 !py-1.5 text-xs"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm font-medium text-graphite-200 hover:text-copper-400 transition-colors">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-1.5 text-xs">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="trace-divider" />
    </header>
  );
}
