import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshCart = useCallback(async () => {
    if (!token) {
      setItems([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getCart(token);
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    setError('');
    const data = await api.addToCart(token, productId, quantity);
    setItems(data.items);
    setTotal(data.total);
  };

  const updateQuantity = async (productId, quantity) => {
    setError('');
    const data = await api.updateCartItem(token, productId, quantity);
    setItems(data.items);
    setTotal(data.total);
  };

  const removeItem = async (productId) => {
    const data = await api.removeCartItem(token, productId);
    setItems(data.items);
    setTotal(data.total);
  };

  const clearCart = async () => {
    setItems([]);
    setTotal(0);
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, total, itemCount, loading, error, addToCart, updateQuantity, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
