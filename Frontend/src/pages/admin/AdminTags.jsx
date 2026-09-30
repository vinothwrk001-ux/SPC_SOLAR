import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiTag } from 'react-icons/fi';

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await blogService.getTags();
      setTags(data);
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
    if (!newTagName.trim()) return;

    try {
      await blogService.createTag({ name: newTagName });
      toast.success('Tag created');
      setNewTagName('');
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create tag');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tag?')) return;
    try {
      await blogService.deleteTag(id);
      toast.success('Tag removed');
      fetchTags();
    } catch (error) {
      toast.error('Failed to delete tag');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-heading flex items-center">
          <FiTag className="mr-3 text-red" /> Tag Management
        </h2>
        <p className="text-gray text-sm">Create and organize keywords for blog articles</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              label="New Tag Name"
              required
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="e.g. net-metering, solar-inverter"
            />
          </div>
          <Button type="submit" variant="primary" className="flex items-center h-[42px]">
            <FiPlus className="mr-2" /> Add Tag
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="font-heading text-xl mb-4">All Active Tags ({tags.length})</h3>
        {loading ? (
          <p className="text-gray">Loading tags...</p>
        ) : tags.length === 0 ? (
          <p className="text-gray">No tags created yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((t) => (
              <span
                key={t._id}
                className="bg-surface border border-gray-light text-black font-accent text-sm px-3.5 py-1.5 rounded-full flex items-center space-x-2 shadow-xs"
              >
                <span>#{t.name}</span>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-gray hover:text-red transition-colors ml-2 font-bold"
                  title="Delete tag"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminTags;
