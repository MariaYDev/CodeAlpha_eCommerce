const BASE_URL = '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no JSON body
  }

  if (!res.ok) {
    const message = data?.error || 'Something went wrong. Please try again.';
    throw new Error(message);
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),

  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getCategories: () => request('/products/categories'),
  getProduct: (id) => request(`/products/${id}`),

  // Cart
  getCart: (token) => request('/cart', { token }),
  addToCart: (token, productId, quantity = 1) =>
    request('/cart', { method: 'POST', token, body: { productId, quantity } }),
  updateCartItem: (token, productId, quantity) =>
    request(`/cart/${productId}`, { method: 'PUT', token, body: { quantity } }),
  removeCartItem: (token, productId) =>
    request(`/cart/${productId}`, { method: 'DELETE', token }),
  clearCart: (token) => request('/cart', { method: 'DELETE', token }),

  // Orders
  checkout: (token, shippingAddress) =>
    request('/orders', { method: 'POST', token, body: { shippingAddress } }),
  getOrders: (token) => request('/orders', { token }),
  getOrder: (token, id) => request(`/orders/${id}`, { token })
};
