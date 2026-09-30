import api from './api';

export const blogService = {
  // Public APIs
  getPublicBlogs: async (params) => {
    const { data } = await api.get('/blogs', { params });
    return data;
  },

  getPublicBlogBySlug: async (slug, preview = false) => {
    const { data } = await api.get(`/blogs/slug/${slug}`, {
      params: preview ? { preview: true } : {}
    });
    return data;
  },

  getFeaturedAndPopular: async () => {
    const { data } = await api.get('/blogs/widgets/featured-popular');
    return data;
  },

  // Admin APIs
  getAdminBlogs: async (params) => {
    const { data } = await api.get('/blogs/admin/all', { params });
    return data;
  },

  getBlogById: async (id) => {
    const { data } = await api.get(`/blogs/admin/${id}`);
    return data;
  },

  createBlog: async (blogData) => {
    const { data } = await api.post('/blogs/admin', blogData);
    return data;
  },

  updateBlog: async (id, blogData) => {
    const { data } = await api.put(`/blogs/admin/${id}`, blogData);
    return data;
  },

  deleteBlog: async (id) => {
    const { data } = await api.delete(`/blogs/admin/${id}`);
    return data;
  },

  publishBlog: async (id) => {
    const { data } = await api.put(`/blogs/admin/${id}/publish`);
    return data;
  },

  unpublishBlog: async (id) => {
    const { data } = await api.put(`/blogs/admin/${id}/unpublish`);
    return data;
  },

  scheduleBlog: async (id, scheduledAt) => {
    const { data } = await api.put(`/blogs/admin/${id}/schedule`, { scheduledAt });
    return data;
  },

  archiveBlog: async (id) => {
    const { data } = await api.put(`/blogs/admin/${id}/archive`);
    return data;
  },

  duplicateBlog: async (id) => {
    const { data } = await api.post(`/blogs/admin/${id}/duplicate`);
    return data;
  },

  uploadImage: async (formData) => {
    const { data } = await api.post('/blogs/admin/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  // Category APIs
  getCategories: async () => {
    const { data } = await api.get('/categories');
    return data;
  },

  createCategory: async (categoryData) => {
    const { data } = await api.post('/categories', categoryData);
    return data;
  },

  updateCategory: async (id, categoryData) => {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data;
  },

  deleteCategory: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },

  // Tag APIs
  getTags: async () => {
    const { data } = await api.get('/tags');
    return data;
  },

  createTag: async (tagData) => {
    const { data } = await api.post('/tags', tagData);
    return data;
  },

  deleteTag: async (id) => {
    const { data } = await api.delete(`/tags/${id}`);
    return data;
  }
};
