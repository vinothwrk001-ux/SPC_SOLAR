import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiImage, FiEdit2, FiCheck, FiX, FiLayers, FiUploadCloud } from 'react-icons/fi';

const AdminGalleryComponents = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Single edit state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Components');
  const [singleImage, setSingleImage] = useState(null);
  
  // Multiple images state for batch upload
  const [selectedBatchFiles, setSelectedBatchFiles] = useState([]);
  const [commonTitle, setCommonTitle] = useState('');
  const [commonDescription, setCommonDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  // Dynamic category state
  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('spc_gallery_categories');
      return saved ? JSON.parse(saved) : ['Components', 'Solar Systems'];
    } catch {
      return ['Components', 'Solar Systems'];
    }
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

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

  // Compute all unique categories combining defaults, custom, and existing in DB
  const allCategories = Array.from(
    new Set([
      'Components',
      'Solar Systems',
      ...customCategories,
      ...components.map(c => c.category).filter(Boolean)
    ])
  );

  const handleAddCategory = (e) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error('Please enter a category name');
      return;
    }

    if (!allCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...customCategories, trimmed];
      setCustomCategories(updated);
      try {
        localStorage.setItem('spc_gallery_categories', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save category to storage', err);
      }
    }
    
    setCategory(trimmed);
    setIsAddingCategory(false);
    setNewCategoryName('');
    toast.success(`Category "${trimmed}" added & selected!`);
  };

  const openModal = (comp = null) => {
    setIsAddingCategory(false);
    setNewCategoryName('');
    if (comp) {
      setEditingId(comp._id);
      setTitle(comp.title);
      setDescription(comp.description || '');
      setCategory(comp.category || 'Components');
      setSingleImage(null);
      setSelectedBatchFiles([]);
    } else {
      setEditingId(null);
      setTitle('');
      setDescription('');
      setCommonTitle('');
      setCommonDescription('');
      setCategory(allCategories[0] || 'Components');
      setSingleImage(null);
      setSelectedBatchFiles([]);
    }
    setIsModalOpen(true);
  };

  // Helper to format clean title from file name
  const formatTitleFromFileName = (fileName) => {
    if (!fileName) return '';
    return fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .trim();
  };

  const handleBatchFileSelection = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems = files.map((file, idx) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${idx}`,
      file,
      preview: URL.createObjectURL(file),
      title: commonTitle ? `${commonTitle} - ${selectedBatchFiles.length + idx + 1}` : formatTitleFromFileName(file.name),
      description: commonDescription || '',
    }));

    setSelectedBatchFiles((prev) => [...prev, ...newItems]);
    e.target.value = ''; // Reset input to allow adding more of same file if desired
  };

  const handleRemoveBatchFile = (idToRemove) => {
    setSelectedBatchFiles((prev) => {
      const target = prev.find(item => item.id === idToRemove);
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter(item => item.id !== idToRemove);
    });
  };

  const handleBatchItemTitleChange = (id, newTitle) => {
    setSelectedBatchFiles(prev =>
      prev.map(item => item.id === id ? { ...item, title: newTitle } : item)
    );
  };

  const handleBatchItemDescriptionChange = (id, newDesc) => {
    setSelectedBatchFiles(prev =>
      prev.map(item => item.id === id ? { ...item, description: newDesc } : item)
    );
  };

  const handleApplyCommonTitleToAll = () => {
    if (!commonTitle.trim()) {
      toast.error('Please enter a base title first');
      return;
    }
    setSelectedBatchFiles(prev =>
      prev.map((item, idx) => ({
        ...item,
        title: prev.length > 1 ? `${commonTitle.trim()} - ${idx + 1}` : commonTitle.trim()
      }))
    );
    toast.success('Applied base title to all selected images');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('adminToken');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    };

    // Mode 1: Edit existing component
    if (editingId) {
      if (!title.trim()) {
        toast.error('Title is required');
        return;
      }
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description);
        formData.append('category', category);
        if (singleImage) {
          formData.append('image', singleImage);
        }

        await axios.put(`http://localhost:5000/api/gallery-components/${editingId}`, formData, config);
        toast.success('Gallery component updated successfully');
        setIsModalOpen(false);
        fetchComponents();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Update failed');
      } finally {
        setUploading(false);
      }
      return;
    }

    // Mode 2: Multi-image / Batch Upload
    if (selectedBatchFiles.length === 0) {
      toast.error('Please select at least one image file');
      return;
    }

    // Validate that every selected item has a title
    const missingTitle = selectedBatchFiles.some(item => !item.title || !item.title.trim());
    if (missingTitle) {
      toast.error('Please provide a title for all selected images');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('category', category);

      // Metadata array for batch
      const itemsMeta = selectedBatchFiles.map(item => ({
        title: item.title.trim(),
        description: item.description?.trim() || '',
        category: category
      }));

      formData.append('items', JSON.stringify(itemsMeta));

      // Append all file objects under 'images'
      selectedBatchFiles.forEach(item => {
        formData.append('images', item.file);
      });

      const response = await axios.post('http://localhost:5000/api/gallery-components/batch', formData, config);
      
      // Cleanup object URLs
      selectedBatchFiles.forEach(item => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });

      toast.success(response.data?.message || `Successfully uploaded ${selectedBatchFiles.length} images!`);
      setIsModalOpen(false);
      setSelectedBatchFiles([]);
      fetchComponents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Batch upload failed');
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

  // Filter components
  const filteredComponents = selectedFilter === 'ALL'
    ? components
    : components.filter(c => (c.category || 'Components') === selectedFilter);

  // Category badge colors
  const getBadgeColor = (catName) => {
    const palette = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-rose-100 text-rose-800 border-rose-200',
      'bg-cyan-100 text-cyan-800 border-cyan-200',
    ];
    let hash = 0;
    for (let i = 0; i < (catName || '').length; i++) {
      hash = catName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % palette.length;
    return palette[index];
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 flex items-center">
            <FiImage className="mr-3 text-red-600" /> Components Gallery
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage and dynamically categorize component images shown on the storefront</p>
        </div>
        <Button variant="primary" onClick={() => openModal()} className="flex items-center text-sm bg-red-600 hover:bg-red-700 text-white shadow-md">
          <FiPlus className="mr-2" size={16} /> Add Gallery Images
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mr-2 uppercase tracking-wider">
          <FiLayers /> Filter:
        </div>
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedFilter === 'ALL'
              ? 'bg-black text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({components.length})
        </button>
        {allCategories.map((cat) => {
          const count = components.filter(c => (c.category || 'Components') === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedFilter === cat
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Main Table */}
      <Card className="p-0 overflow-hidden shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-4 px-6 font-accent text-xs uppercase tracking-wider">Image</th>
                <th className="py-4 px-6 font-accent text-xs uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 font-accent text-xs uppercase tracking-wider">Title</th>
                <th className="py-4 px-6 font-accent text-xs uppercase tracking-wider">Description</th>
                <th className="py-4 px-6 font-accent text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="py-12 text-center text-gray-500 font-medium">Loading gallery components...</td></tr>
              ) : filteredComponents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    <p className="font-bold text-base text-gray-700">No images found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedFilter !== 'ALL' 
                        ? `No items found under "${selectedFilter}" category.` 
                        : 'Click "Add New Image" above to upload your first gallery component.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredComponents.map((comp) => (
                  <tr key={comp._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <img 
                        src={`http://localhost:5000${comp.imageUrl}`} 
                        alt={comp.title} 
                        className="h-16 w-16 object-cover rounded-xl shadow-sm border border-gray-200"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getBadgeColor(comp.category || 'Components')}`}>
                        {comp.category || 'Components'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">{comp.title}</td>
                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{comp.description || '—'}</td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button onClick={() => openModal(comp)} className="text-blue-600 hover:text-blue-800 font-bold text-xs inline-flex items-center gap-1">
                        <FiEdit2 size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(comp._id)} className="text-red-600 hover:text-red-800 font-bold text-xs inline-flex items-center gap-1">
                        <FiTrash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upload & Edit Modal with Dynamic Category Support & Multi-Image Batch Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`bg-white w-full ${editingId ? 'max-w-md' : 'max-w-2xl'} rounded-2xl p-6 space-y-5 border border-gray-200 shadow-2xl animate-fade-in my-8 max-h-[90vh] flex flex-col`}>
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  {editingId ? <FiEdit2 size={16} /> : <FiUploadCloud size={18} />}
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-gray-900">
                    {editingId ? 'Edit Gallery Image' : 'Add Gallery Images'}
                  </h3>
                  {!editingId && (
                    <p className="text-xs text-gray-500">Upload one or multiple images simultaneously</p>
                  )}
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  selectedBatchFiles.forEach(item => {
                    if (item.preview) URL.revokeObjectURL(item.preview);
                  });
                  setIsModalOpen(false);
                }}
                className="text-gray-400 hover:text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Category Selector (Common for single or multiple) */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Category <span className="text-red-600">*</span>
                  </label>
                  {!isAddingCategory && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(true)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-md bg-white hover:bg-red-50 border border-red-200 shadow-xs"
                    >
                      <FiPlus size={13} /> Add Category
                    </button>
                  )}
                </div>

                {/* Inline New Category Creation Box */}
                {isAddingCategory ? (
                  <div className="bg-white p-2.5 rounded-lg border border-red-300 space-y-2 animate-fade-in shadow-sm">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-red-700">
                      New Category Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. Inverters, Batteries, Mounting..."
                        className="flex-1 text-sm border border-gray-300 px-3 py-1.5 rounded-lg outline-none focus:border-red-500 bg-white shadow-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCategory(e);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                      >
                        <FiCheck size={14} /> Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCategory(false);
                          setNewCategoryName('');
                        }}
                        className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:outline-none focus:border-red-600 bg-white cursor-pointer shadow-xs font-medium"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* SINGLE EDIT MODE */}
              {editingId ? (
                <div className="space-y-4">
                  <Input
                    label="Title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Solar Panel 500W"
                  />

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-800">Description (Optional)</label>
                    <textarea
                      className="w-full border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:border-red-600 text-sm shadow-sm"
                      rows="2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Short description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-800">
                      Replace Image <span className="text-gray-400 font-normal text-xs">(Leave empty to keep existing)</span>
                    </label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setSingleImage(e.target.files[0])}
                      className="w-full border border-gray-300 p-2 rounded-xl text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer shadow-sm"
                    />
                  </div>
                </div>
              ) : (
                /* MULTI-IMAGE BATCH UPLOAD MODE */
                <div className="space-y-4">
                  {/* Common / Base Title helper */}
                  <div className="bg-gray-50/60 p-3 rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                      Base / Common Title (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commonTitle}
                        onChange={(e) => setCommonTitle(e.target.value)}
                        placeholder="e.g. Mono PERC Half-cut Panel"
                        className="flex-1 text-sm border border-gray-300 px-3 py-2 rounded-lg outline-none focus:border-red-500 bg-white"
                      />
                      {selectedBatchFiles.length > 0 && (
                        <button
                          type="button"
                          onClick={handleApplyCommonTitleToAll}
                          className="px-3 py-2 bg-gray-800 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
                        >
                          Apply to All ({selectedBatchFiles.length})
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      You can set a base title for all images or edit each individual image title below.
                    </p>
                  </div>

                  {/* Multi-file Dropzone / Selector */}
                  <div className="border-2 border-dashed border-gray-300 hover:border-red-500 rounded-xl p-5 text-center bg-gray-50/40 hover:bg-red-50/20 transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleBatchFileSelection}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="multiImageInput"
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <FiUploadCloud size={24} />
                      </div>
                      <p className="text-sm font-bold text-gray-800">
                        Click or drag & drop images here
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Select multiple images in a row (PNG, JPG, WEBP)
                      </p>
                    </div>
                  </div>

                  {/* Selected Images Row / List */}
                  {selectedBatchFiles.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                          <FiImage className="text-red-600" />
                          Selected Images in Row ({selectedBatchFiles.length})
                        </span>
                        <label 
                          htmlFor="multiImageInput"
                          className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer bg-red-50 px-2.5 py-1 rounded-md border border-red-200"
                        >
                          <FiPlus size={13} /> Add More Files
                        </label>
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-2.5 p-1 divide-y divide-gray-100 border border-gray-200 rounded-xl bg-gray-50/30">
                        {selectedBatchFiles.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="pt-2.5 first:pt-0 flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200/80 shadow-xs hover:border-gray-300 transition-all"
                          >
                            {/* Thumbnail */}
                            <div className="relative flex-shrink-0">
                              <img 
                                src={item.preview} 
                                alt={item.title} 
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-xs"
                              />
                              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                                {index + 1}
                              </span>
                            </div>

                            {/* Info & Editable Title */}
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-mono text-gray-400 truncate max-w-[180px]">
                                  {item.file.name} ({(item.file.size / 1024).toFixed(0)} KB)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveBatchFile(item.id)}
                                  className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                                  title="Remove image"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => handleBatchItemTitleChange(item.id, e.target.value)}
                                    placeholder="Image Title *"
                                    className="w-full text-xs font-semibold border border-gray-300 px-2.5 py-1.5 rounded-lg outline-none focus:border-red-600 bg-white"
                                    required
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleBatchItemDescriptionChange(item.id, e.target.value)}
                                    placeholder="Description (Optional)"
                                    className="w-full text-xs border border-gray-300 px-2.5 py-1.5 rounded-lg outline-none focus:border-red-600 bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100 flex-shrink-0">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => {
                    selectedBatchFiles.forEach(item => {
                      if (item.preview) URL.revokeObjectURL(item.preview);
                    });
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={uploading || (!editingId && selectedBatchFiles.length === 0)} 
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : editingId ? (
                    'Update Image'
                  ) : (
                    `Upload ${selectedBatchFiles.length > 0 ? `${selectedBatchFiles.length} ` : ''}Images`
                  )}
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
