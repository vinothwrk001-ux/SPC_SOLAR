import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiFolder } from 'react-icons/fi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    seoTitle: '',
    seoDescription: ''
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await blogService.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        seoTitle: category.seoTitle || '',
        seoDescription: category.seoDescription || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', seoTitle: '', seoDescription: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await blogService.updateCategory(editingCategory._id, formData);
        toast.success('Category updated successfully');
      } else {
        await blogService.createCategory(formData);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await blogService.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading flex items-center">
            <FiFolder className="mr-3 text-red" /> Category Management
          </h2>
          <p className="text-gray text-sm">Manage solar blog categories and SEO structure</p>
        </div>
        <Button variant="primary" onClick={() => openModal()} className="flex items-center text-sm">
          <FiPlus className="mr-2" /> Add New Category
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-4 px-6 font-accent text-sm uppercase">Category Name</th>
                <th className="py-4 px-6 font-accent text-sm uppercase">Slug</th>
                <th className="py-4 px-6 font-accent text-sm uppercase">Description</th>
                <th className="py-4 px-6 font-accent text-sm uppercase">Status</th>
                <th className="py-4 px-6 font-accent text-sm uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-light">
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray">Loading categories...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray">No categories created yet</td></tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-surface transition-colors">
                    <td className="py-4 px-6 font-bold text-black">{cat.name}</td>
                    <td className="py-4 px-6 font-mono text-xs text-gray">{cat.slug}</td>
                    <td className="py-4 px-6 text-gray max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="py-4 px-6">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded">
                        {cat.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button onClick={() => openModal(cat)} className="text-blue-600 hover:text-blue-800 font-bold">
                        <FiEdit2 className="inline mr-1" /> Edit
                      </button>
                      <button onClick={() => handleDelete(cat._id)} className="text-red hover:text-red-700 font-bold">
                        <FiTrash2 className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-card p-6 space-y-4 border border-gray-light">
            <h3 className="text-xl font-heading">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Category Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Residential Solar"
              />
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-light p-2.5 rounded focus:outline-none focus:border-red"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category overview..."
                />
              </div>
              <Input
                label="SEO Meta Title"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="Meta title for Google..."
              />
              <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
