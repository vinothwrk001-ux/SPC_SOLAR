import api from './api';

export const getPublicReels = async (params = {}) => {
  const response = await api.get('/reels', { params });
  return response.data;
};

export const getReelById = async (id) => {
  const response = await api.get(`/reels/${id}`);
  return response.data;
};

export const recordReelView = async (id) => {
  const response = await api.post(`/reels/${id}/view`);
  return response.data;
};

export const toggleReelLike = async (id, sessionId = 'guest') => {
  const response = await api.post(`/reels/${id}/like`, { sessionId });
  return response.data;
};

export const toggleReelSave = async (id, sessionId = 'guest') => {
  const response = await api.post(`/reels/${id}/save`, { sessionId });
  return response.data;
};

export const addReelComment = async (id, commentData) => {
  const response = await api.post(`/reels/${id}/comment`, commentData);
  return response.data;
};

export const recordQuoteClick = async (id) => {
  const response = await api.post(`/reels/${id}/quote-click`);
  return response.data;
};

// Admin endpoints
export const getAdminReels = async () => {
  const response = await api.get('/reels/admin/all');
  return response.data;
};

export const createReel = async (formData) => {
  const response = await api.post('/reels/admin', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateReel = async (id, formData) => {
  const response = await api.put(`/reels/admin/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteReel = async (id) => {
  const response = await api.delete(`/reels/admin/${id}`);
  return response.data;
};
