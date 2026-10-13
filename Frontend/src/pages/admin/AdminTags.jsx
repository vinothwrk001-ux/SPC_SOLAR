import React, { useState, useEffect, useMemo } from 'react';
import { blogService } from '../../services/blogService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { 
  FiPlus, 
  FiTrash2, 
  FiTag, 
  FiSearch, 
  FiRefreshCw, 
  FiAlertTriangle,
  FiX
} from 'react-icons/fi';

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await blogService.getTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      toast.error('Please enter tag name');
      return;
    }

    try {
      setSaving(true);
      await blogService.createTag({ name: newTagName.trim() });
      toast.success('Tag created successfully');
      setNewTagName('');
      setIsModalOpen(false);
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create tag');
    } finally {
      setSaving(false);
    }
  };

  const handlePromptDelete = (tag) => {
    setTagToDelete(tag);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tagToDelete) return;
    try {
      setDeleting(true);
      await blogService.deleteTag(tagToDelete._id);
      toast.success('Tag removed');
      setDeleteModalOpen(false);
      setTagToDelete(null);
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete tag');
    } finally {
      setDeleting(false);
    }
  };

  const filteredTags = useMemo(() => {
    return tags.filter((t) =>
      (t.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tags, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
            <span className="font-accent text-xs font-bold uppercase tracking-wider text-red">Metadata & Taxonomies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading text-black font-bold tracking-tight">
            Blog Tags Module
          </h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            Create and organize article keywords, topic tags, and search index labels.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button
            variant="outline"
            onClick={fetchTags}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-3 py-2.5"
            title="Refresh list"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              setNewTagName('');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-4 py-2.5 shadow-md hover:shadow-lg"
          >
            <FiPlus size={16} />
            <span>Add Tag</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-500 font-bold">Total Keywords</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-black">{tags.length}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">Tags</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-blue-600 font-bold">Active in Use</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-blue-700">{tags.length}</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">Indexed</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-green-600 font-bold">System Status</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-green-700">Ready</span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-semibold">Online</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input
            type="text"
            placeholder="Search keywords and tags..."
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
          <p className="text-sm font-accent uppercase tracking-wider text-gray-500">Loading tags...</p>
        </Card>
      ) : filteredTags.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-gray-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-4">
            <FiTag size={28} />
          </div>
          <h3 className="font-heading text-lg text-black mb-1">No Tags Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-5 font-body">
            No tags match your search. Click "Add Tag" to create a new one.
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setNewTagName('');
              setIsModalOpen(true);
            }}
            className="text-xs font-accent uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <FiPlus size={15} /> Create First Tag
          </Button>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden bg-white border border-gray-200/90 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/90 text-gray-600 border-b border-gray-200 text-xs font-accent font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">Tag</th>
                  <th className="py-3.5 px-4">Tag Keyword</th>
                  <th className="py-3.5 px-4">Slug Identifier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-black divide-y divide-gray-100">
                {filteredTags.map((tag) => (
                  <tr key={tag._id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="py-3.5 px-4 text-center">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red flex items-center justify-center mx-auto">
                        <FiTag size={14} />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-heading font-bold text-black text-sm group-hover:text-red transition-colors whitespace-nowrap">
                      #{tag.name}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                      /{tag.slug || tag.name?.toLowerCase().replace(/\s+/g, '-')}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handlePromptDelete(tag)}
                        className="p-1.5 text-red hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                        title="Delete Tag"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !saving && setIsModalOpen(false)}
        title="Add Blog Tag"
        size="sm"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
              Tag Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SolarSubsidies, RooftopSolar"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
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
              {saving ? 'Creating...' : 'Create Tag'}
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
              Delete this tag?
            </h4>
            <p className="text-xs text-gray-600 font-body leading-relaxed">
              Are you sure you want to remove tag{' '}
              <strong className="text-black font-semibold">"#{tagToDelete?.name}"</strong>?
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

export default AdminTags;
