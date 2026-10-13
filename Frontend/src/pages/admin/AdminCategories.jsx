import React, { useState, useEffect, useMemo } from 'react';
import { blogService } from '../../services/blogService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFolder, 
  FiSearch, 
  FiRefreshCw, 
  FiAlertTriangle,
  FiX,
  FiFileText,
  FiCheck
} from 'react-icons/fi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    seoTitle: '',
    seoDescription: ''
  });

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await blogService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
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
        name: category.name || '',
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
    if (!formData.name.trim()) {
      toast.error('Please enter category name');
      return;
    }

    try {
      setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const handlePromptDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      await blogService.deleteCategory(categoryToDelete._id);
      toast.success('Category deleted');
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const nameMatch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = (c.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch || descMatch;
    });
  }, [categories, searchQuery]);

  const stats = useMemo(() => {
    const total = categories.length;
    const withDesc = categories.filter(c => Boolean(c.description)).length;
    const withSeo = categories.filter(c => Boolean(c.seoTitle || c.seoDescription)).length;
    return { total, withDesc, withSeo };
  }, [categories]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
            <span className="font-accent text-xs font-bold uppercase tracking-wider text-red">Content Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading text-black font-bold tracking-tight">
            Blog Categories Module
          </h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            Manage thematic topics, article tags, and SEO taxonomies for the SPC Solar blog.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button
            variant="outline"
            onClick={fetchCategories}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-3 py-2.5"
            title="Refresh list"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => openModal()}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-4 py-2.5 shadow-md hover:shadow-lg"
          >
            <FiPlus size={16} />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-500 font-bold">Total Categories</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-black">{stats.total}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">All</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-blue-600 font-bold">Documented</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-blue-700">{stats.withDesc}</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">With Desc</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-green-600 font-bold">SEO Optimized</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-green-700">{stats.withSeo}</span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-semibold">SEO Meta</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input
            type="text"
            placeholder="Search by category name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-black transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <FiX size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <Card className="p-12 text-center bg-white border border-gray-200">
          <div className="inline-block animate-spin text-red mb-3">
            <FiRefreshCw size={28} />
          </div>
          <p className="text-sm font-accent uppercase tracking-wider text-gray-500">Loading blog categories...</p>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-gray-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-4">
            <FiFolder size={28} />
          </div>
          <h3 className="font-heading text-lg text-black mb-1">No Categories Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-5 font-body">
            No categories match your search.
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery('')}
            className="text-xs font-accent uppercase tracking-wider"
          >
            Clear Search
          </Button>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden bg-white border border-gray-200/90 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/90 text-gray-600 border-b border-gray-200 text-xs font-accent font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">Icon</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Slug Identifier</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">SEO Title</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-black divide-y divide-gray-100">
                {filteredCategories.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="py-3.5 px-4 text-center">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red flex items-center justify-center mx-auto">
                        <FiFolder size={15} />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-heading font-bold text-black text-sm group-hover:text-red transition-colors whitespace-nowrap">
                      {c.name}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                      /{c.slug || c.name?.toLowerCase().replace(/\s+/g, '-')}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-600 font-body max-w-xs">
                      {c.description ? (
                        <p className="line-clamp-1">{c.description}</p>
                      ) : (
                        <span className="text-gray-400 italic">No description</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-500 font-body max-w-xs">
                      {c.seoTitle || <span className="text-gray-400">—</span>}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openModal(c)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                          title="Edit Category"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handlePromptDelete(c)}
                          className="p-1.5 text-red hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          title="Delete Category"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !saving && setIsModalOpen(false)}
        title={editingCategory ? 'Edit Blog Category' : 'Add Blog Category'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
              Category Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Solar Subsidies, Maintenance Tips"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of articles in this topic..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black resize-y font-body"
            />
          </div>

          <div>
            <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
              SEO Title (Optional)
            </label>
            <input
              type="text"
              placeholder="Solar News & Government Subsidies | SPC Solar"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
              SEO Meta Description
            </label>
            <textarea
              rows={2}
              placeholder="Meta description for search engine results..."
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black resize-y font-body"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
              className="text-xs font-accent uppercase tracking-wider px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="text-xs font-accent uppercase tracking-wider px-5 py-2"
            >
              {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title="Confirm Removal"
        size="sm"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red mx-auto flex items-center justify-center">
            <FiAlertTriangle size={24} />
          </div>
          <div className="text-center">
            <h4 className="font-heading font-bold text-base text-black mb-1">
              Delete this category?
            </h4>
            <p className="text-xs text-gray-600 font-body leading-relaxed">
              Are you sure you want to remove category{' '}
              <strong className="text-black font-semibold">"{categoryToDelete?.name}"</strong>?
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="text-xs font-accent uppercase tracking-wider px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="text-xs font-accent uppercase tracking-wider px-5 py-2 bg-red hover:bg-red-700 flex items-center gap-1.5"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategories;
