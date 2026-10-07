import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiImage, FiEdit2 } from 'react-icons/fi';

const AdminGalleryComponents = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Components');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/gallery-components', { withCredentials: true });
      setComponents(data);
    } catch (error) {
      toast.error('Failed to load gallery components');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const openModal = (comp = null) => {
    if (comp) {
      setEditingId(comp._id);
      setTitle(comp.title);
      setDescription(comp.description || '');
      setCategory(comp.category || 'Components');
      setImage(null);
    } else {
      setEditingId(null);
      setTitle('');
      setDescription('');
      setCategory('Components');
      setImage(null);
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || (!image && !editingId)) {
      toast.error('Title and Image are required');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      // We use axios directly since there's no service wrapper for it yet, but make sure to pass the auth token.
      const token = localStorage.getItem('adminToken'); // Assuming standard token storage
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/gallery-components/${editingId}`, formData, config);
        toast.success('Gallery component updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/gallery-components', formData, config);
        toast.success('Gallery component uploaded successfully');
      }
      
      setIsModalOpen(false);
      fetchComponents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this component image?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      };
      await axios.delete(`http://localhost:5000/api/gallery-components/${id}`, config);
      toast.success('Component deleted');
      fetchComponents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete component');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading flex items-center">
            <FiImage className="mr-3 text-red" /> Components Gallery
          </h2>
          <p className="text-gray text-sm">Manage component images shown on the storefront</p>
        </div>
        <Button variant="primary" onClick={() => openModal()} className="flex items-center text-sm">
          <FiPlus className="mr-2" /> Add New Image
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-4 px-6 font-accent text-sm uppercase">Image</th>
                <th className="py-4 px-6 font-accent text-sm uppercase">Category</th>
                <th className="py-4 px-6 font-accent text-sm uppercase">Title</th>
                <th className="py-4 px-6 font-accent text-sm uppercase">Description</th>
                <th className="py-4 px-6 font-accent text-sm uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-light">
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray">Loading components...</td></tr>
              ) : components.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray">No component images uploaded yet</td></tr>
              ) : (
                components.map((comp) => (
                  <tr key={comp._id} className="hover:bg-surface transition-colors">
                    <td className="py-4 px-6">
                      <img 
                        src={`http://localhost:5000${comp.imageUrl}`} 
                        alt={comp.title} 
                        className="h-16 w-16 object-cover rounded shadow-sm border border-gray-200"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${comp.category === 'Solar Systems' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                        {comp.category || 'Components'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-black">{comp.title}</td>
                    <td className="py-4 px-6 text-gray max-w-xs truncate">{comp.description || '—'}</td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button onClick={() => openModal(comp)} className="text-blue-600 hover:text-blue-800 font-bold">
                        <FiEdit2 className="inline mr-1" /> Edit
                      </button>
                      <button onClick={() => handleDelete(comp._id)} className="text-red hover:text-red-700 font-bold">
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-card p-6 space-y-4 border border-gray-light">
            <h3 className="text-xl font-heading">{editingId ? 'Edit Gallery Image' : 'Add Gallery Image'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Solar Panel 500W"
              />
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-light p-2.5 rounded focus:outline-none focus:border-red"
                >
                  <option value="Components">Components</option>
                  <option value="Solar Systems">Solar Systems</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description (Optional)</label>
                <textarea
                  className="w-full border border-gray-light p-2.5 rounded focus:outline-none focus:border-red"
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image File {editingId && <span className="text-gray-400 font-normal">(Leave empty to keep current image)</span>}</label>
                <input 
                  type="file" 
                  accept="image/*"
                  required={!editingId}
                  onChange={handleFileChange}
                  className="w-full border border-gray-light p-2 rounded text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={uploading}>
                  {uploading ? 'Saving...' : (editingId ? 'Update Image' : 'Upload Image')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryComponents;
