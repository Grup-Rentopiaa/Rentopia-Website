import axios from 'axios';

const api = axios.create({
  // baseURL can be added here if needed, for now we use relative paths like '/api/products'
  // which works with vite proxy
});

export const getProducts = (params) => api.get('/api/products', { params });
export const getMyProducts = (params) => api.get('/api/products/my', { params });
export const getProductDetail = (id, params) => api.get(`/api/products/${id}`, { params });
export const uploadProduct = (data) => api.post('/api/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id, params) => api.delete(`/api/products/${id}`, { params });

export const getLikedProducts = (params) => api.get('/api/likes', { params });
export const toggleLike = (productId, data) => api.post(`/api/likes/${productId}`, data);

export const getProductStats = (productId, params) => api.get(`/api/stats/${productId}`, { params });

export default api;
