import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

export const productService = {
  getAll: () => api.get('/products'),
  getHotDeals: () => api.get('/products/hot-deals'),
};

export const wishlistService = {
  toggle: (user_id, product_id, action) =>
    api.post('/wishlist', { user_id, product_id, action }),
};

export default api;
