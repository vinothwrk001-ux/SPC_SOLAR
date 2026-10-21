import api from './api';

export const getMediaAssets = async (params = {}) => {
  const response = await api.get('/media', { params });
  return response.data;
};

export const uploadMediaAssets = async (formData, onProgress) => {
  const response = await api.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return response.data;
};

export const deleteMediaAsset = async (id) => {
  const response = await api.delete(`/media/${id}`);
  return response.data;
};

export const toggleMediaFavorite = async (id) => {
  const response = await api.put(`/media/${id}/favorite`);
  return response.data;
};

export const bulkMediaAction = async (action, assetIds, targetAlbumId = null) => {
  const response = await api.post('/media/bulk-action', {
    action,
    assetIds,
    targetAlbumId,
  });
  return response.data;
};

export const getMediaMetrics = async () => {
  const response = await api.get('/media/metrics');
  return response.data;
};

export const getMediaAlbums = async () => {
  const response = await api.get('/media/albums');
  return response.data;
};

export const createMediaAlbum = async (data) => {
  const response = await api.post('/media/albums', data);
  return response.data;
};

export const deleteMediaAlbum = async (id) => {
  const response = await api.delete(`/media/albums/${id}`);
  return response.data;
};
