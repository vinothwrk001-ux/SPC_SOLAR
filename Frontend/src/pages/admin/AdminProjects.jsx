import React, { useState, useEffect, useMemo, useRef } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiMapPin, 
  FiZap, 
  FiStar, 
  FiGrid, 
  FiList, 
  FiUploadCloud, 
  FiImage, 
  FiX, 
  FiCheck,
  FiRefreshCw,
  FiAlertTriangle,
  FiDollarSign,
  FiLayers
} from 'react-icons/fi';

const CLIENT_TYPES = ['Residential', 'Commercial', 'Industrial', 'Institutional', 'Utility Scale'];

const DEFAULT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800';

const formatImageUrl = (url) => {
  if (!url) return DEFAULT_IMAGE_FALLBACK;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  if (url.startsWith('/uploads')) return `${baseUrl}${url}`;
  return `${baseUrl}/uploads/${url}`;
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [filterFeatured, setFilterFeatured] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    clientType: 'Residential',
    capacity: '',
    location: '',
    savings: '',
    description: '',
    isFeatured: false,
    image: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects');
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch projects', error);
      toast.error(error.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const titleMatch = (project.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      const locationMatch = (project.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      const capacityMatch = (project.capacity || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = titleMatch || locationMatch || capacityMatch;

      const projectType = project.clientType || project.type || 'Residential';
      const matchesType = selectedType === 'All' || projectType.toLowerCase() === selectedType.toLowerCase();

      const isFeatured = Boolean(project.isFeatured || project.isFeatures);
      const matchesFeatured = 
        filterFeatured === 'All' ||
        (filterFeatured === 'Featured' && isFeatured) ||
        (filterFeatured === 'Standard' && !isFeatured);

      return matchesSearch && matchesType && matchesFeatured;
    });
  }, [projects, searchQuery, selectedType, filterFeatured]);

  // Statistics Counts
  const stats = useMemo(() => {
    const total = projects.length;
    const residential = projects.filter(p => (p.clientType || p.type || '').toLowerCase() === 'residential').length;
    const commercial = projects.filter(p => (p.clientType || p.type || '').toLowerCase() === 'commercial').length;
    const industrial = projects.filter(p => (p.clientType || p.type || '').toLowerCase() === 'industrial').length;
    const featured = projects.filter(p => Boolean(p.isFeatured || p.isFeatures)).length;
    return { total, residential, commercial, industrial, featured };
  }, [projects]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      clientType: 'Residential',
      capacity: '',
      location: '',
      savings: '',
      description: '',
      isFeatured: false,
      image: '',
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      clientType: project.clientType || project.type || 'Residential',
      capacity: project.capacity || '',
      location: project.location || '',
      savings: project.savings || '',
      description: project.description || '',
      isFeatured: Boolean(project.isFeatured || project.isFeatures),
      image: project.image || '',
    });
    setImageFile(null);
    setImagePreview(project.image ? formatImageUrl(project.image) : '');
    setIsModalOpen(true);
  };

  // Handle Image File Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error('File size must be under 15MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a project title');
      return;
    }
    if (!formData.capacity.trim()) {
      toast.error('Please enter project capacity (e.g., 5 kW or 150 kW)');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Please enter project location (e.g., Pune, MH)');
      return;
    }

    try {
      setSaving(true);

      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('clientType', formData.clientType);
      submitData.append('type', formData.clientType);
      submitData.append('capacity', formData.capacity.trim());
      submitData.append('location', formData.location.trim());
      submitData.append('savings', formData.savings.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('isFeatured', formData.isFeatured);

      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (formData.image) {
        submitData.append('image', formData.image.trim());
      }

      if (editingProject) {
        const { data } = await api.put(`/projects/${editingProject._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project updated successfully!');
        setProjects(prev => prev.map(p => p._id === editingProject._id ? data : p));
      } else {
        const { data } = await api.post('/projects', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('New project created successfully!');
        setProjects(prev => [data, ...prev]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (project) => {
    try {
      const { data } = await api.patch(`/projects/${project._id}/feature`);
      toast.success(
        data.isFeatured 
          ? `"${project.title}" marked as Featured!` 
          : `"${project.title}" removed from Featured.`
      );
      setProjects(prev => prev.map(p => p._id === project._id ? data : p));
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  // Open Delete Confirmation
  const handlePromptDelete = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/projects/${projectToDelete._id}`);
      toast.success('Project deleted successfully');
      setProjects(prev => prev.filter(p => p._id !== projectToDelete._id));
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.response?.data?.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  // Client Type Badge Colors
  const getTypeBadgeClass = (type) => {
    const t = (type || '').toLowerCase();
    if (t === 'residential') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (t === 'commercial') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (t === 'industrial') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (t === 'institutional') return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
            <span className="font-accent text-xs font-bold uppercase tracking-wider text-red">Portfolio Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading text-black font-bold tracking-tight">
            Solar Projects Module
          </h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            Add, update, or remove completed solar installations displayed on the public website.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button
            variant="outline"
            onClick={fetchProjects}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-3 py-2.5"
            title="Refresh list"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-4 py-2.5 shadow-md hover:shadow-lg"
          >
            <FiPlus size={16} />
            <span>Add Project</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-500 font-bold">Total Projects</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-black">{stats.total}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">All</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-blue-600 font-bold">Residential</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-blue-700">{stats.residential}</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">Home</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-amber-600 font-bold">Commercial</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-amber-700">{stats.commercial}</span>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-semibold">Biz</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-emerald-600 font-bold">Industrial</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-emerald-700">{stats.industrial}</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold">Plant</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-red font-bold">Featured Home</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-red">{stats.featured}</span>
            <span className="text-xs bg-red-50 text-red px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
              <FiStar size={10} className="fill-red" /> Live
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Category Filter, and View Mode */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type="text"
              placeholder="Search by title, location (e.g. Pune), or capacity (e.g. 150 kW)..."
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

          {/* Right Controls: Featured Filter & View Mode */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Featured Filter */}
            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value)}
              className="px-3 py-2 text-xs font-accent font-semibold uppercase tracking-wider bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-black"
            >
              <option value="All">All Statuses</option>
              <option value="Featured">Featured Only</option>
              <option value="Standard">Standard Only</option>
            </select>

            {/* View Mode Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'
                }`}
                title="Table view"
              >
                <FiList size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'
                }`}
                title="Grid cards view"
              >
                <FiGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-400 font-bold mr-1">Filter Type:</span>
          {['All', 'Residential', 'Commercial', 'Industrial'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-xs font-accent font-semibold tracking-wider transition-all ${
                selectedType === type
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
          {filteredProjects.length !== projects.length && (
            <span className="text-xs text-gray-400 font-body ml-auto">
              Showing {filteredProjects.length} of {projects.length}
            </span>
          )}
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {loading ? (
        <Card className="p-12 text-center bg-white border border-gray-200">
          <div className="inline-block animate-spin text-red mb-3">
            <FiRefreshCw size={28} />
          </div>
          <p className="text-sm font-accent uppercase tracking-wider text-gray-500">Loading solar projects...</p>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-gray-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-4">
            <FiLayers size={28} />
          </div>
          <h3 className="font-heading text-lg text-black mb-1">No Projects Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-5 font-body">
            {searchQuery || selectedType !== 'All' || filterFeatured !== 'All'
              ? 'No projects match your active search and filter criteria. Try clearing filters.'
              : 'There are currently no projects in the database. Click "Add Project" to create your first portfolio entry.'}
          </p>
          {(searchQuery || selectedType !== 'All' || filterFeatured !== 'All') ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setFilterFeatured('All');
              }}
              className="text-xs font-accent uppercase tracking-wider"
            >
              Reset Filters
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              className="text-xs font-accent uppercase tracking-wider inline-flex items-center gap-1.5"
            >
              <FiPlus size={15} /> Create First Project
            </Button>
          )}
        </Card>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <Card className="p-0 overflow-hidden bg-white border border-gray-200/90 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/90 text-gray-600 border-b border-gray-200 text-xs font-accent font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16 text-center">Image</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Savings</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-black divide-y divide-gray-100">
                {filteredProjects.map((p) => {
                  const pType = p.clientType || p.type || 'Residential';
                  const isFeatured = Boolean(p.isFeatured || p.isFeatures);
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/70 transition-colors group">
                      {/* Image Thumbnail */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="w-14 h-11 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 mx-auto relative group-hover:shadow-sm">
                          <img
                            src={formatImageUrl(p.image)}
                            alt={p.title}
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_IMAGE_FALLBACK;
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-heading font-bold text-black text-sm group-hover:text-red transition-colors line-clamp-1">
                          {p.title}
                        </div>
                        {p.description && (
                          <div className="text-xs text-gray-500 font-body line-clamp-1 mt-0.5">
                            {p.description}
                          </div>
                        )}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-accent font-bold uppercase tracking-wider rounded-full border ${getTypeBadgeClass(pType)}`}>
                          {pType}
                        </span>
                      </td>

                      {/* Capacity */}
                      <td className="py-3.5 px-4 font-accent font-bold text-red text-sm">
                        {p.capacity}
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-gray-700 font-body text-xs">
                        <div className="flex items-center gap-1.5">
                          <FiMapPin className="text-gray-400 flex-shrink-0" size={13} />
                          <span>{p.location}</span>
                        </div>
                      </td>

                      {/* Savings */}
                      <td className="py-3.5 px-4 text-xs font-accent text-gray-700">
                        {p.savings ? (
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {p.savings}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          title={isFeatured ? 'Featured on home page (Click to remove)' : 'Standard (Click to feature)'}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isFeatured
                              ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100 shadow-sm'
                              : 'bg-gray-50 border-gray-200 text-gray-300 hover:text-amber-500 hover:bg-gray-100'
                          }`}
                        >
                          <FiStar size={16} className={isFeatured ? 'fill-amber-400' : ''} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                            title="Edit Project"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => handlePromptDelete(p)}
                            className="p-1.5 text-red hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                            title="Delete Project"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => {
            const pType = p.clientType || p.type || 'Residential';
            const isFeatured = Boolean(p.isFeatured || p.isFeatures);
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:border-red hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={formatImageUrl(p.image)}
                      alt={p.title}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE_FALLBACK;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-sm text-white text-[11px] font-accent font-bold px-2.5 py-1 uppercase rounded-md shadow-sm">
                      {pType}
                    </div>

                    {/* Featured Star Badge */}
                    {isFeatured && (
                      <div className="absolute top-3 right-3 bg-amber-400 text-black text-[10px] font-accent font-bold px-2 py-0.5 uppercase rounded-md shadow-sm flex items-center gap-1">
                        <FiStar size={11} className="fill-black" /> Featured
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-bold text-black mb-1 group-hover:text-red transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 font-body">
                      <FiMapPin size={13} className="text-gray-400" />
                      <span>{p.location}</span>
                    </div>

                    {p.description && (
                      <p className="text-xs text-gray-600 font-body line-clamp-2 leading-relaxed mb-4">
                        {p.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div>
                        <span className="block text-[10px] font-accent uppercase tracking-wider text-gray-400">Capacity</span>
                        <span className="font-accent font-bold text-red text-base">{p.capacity}</span>
                      </div>
                      {p.savings && (
                        <div className="text-right">
                          <span className="block text-[10px] font-accent uppercase tracking-wider text-gray-400">Annual Savings</span>
                          <span className="font-accent font-bold text-emerald-600 text-sm">{p.savings}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(p)}
                    className={`text-xs font-accent font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1 transition-colors ${
                      isFeatured
                        ? 'bg-amber-100/70 border-amber-300 text-amber-800'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <FiStar size={12} className={isFeatured ? 'fill-amber-500 text-amber-500' : ''} />
                    {isFeatured ? 'Featured' : 'Make Featured'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-gray-200 hover:border-blue-200 transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handlePromptDelete(p)}
                      className="p-1.5 text-red hover:bg-red-50 rounded-md border border-gray-200 hover:border-red-200 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT PROJECT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !saving && setIsModalOpen(false)}
        title={editingProject ? 'Edit Solar Project' : 'Add New Solar Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Project Title <span className="text-red">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Green Valley Residence, TechPark Corporate"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Client Type / Category */}
            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Client Category / Type <span className="text-red">*</span>
              </label>
              <select
                value={formData.clientType}
                onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black transition-colors font-body"
              >
                {CLIENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                System Capacity <span className="text-red">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 5 kW, 150 kW, 1 MW"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Location <span className="text-red">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pune, MH or Bangalore, KA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Annual Savings */}
            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Estimated Annual Savings
              </label>
              <input
                type="text"
                placeholder="e.g. ₹72K/yr or ₹18L/yr"
                value={formData.savings}
                onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Project Description & Highlights
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of panel specifications, inverter capacity, client impact..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black transition-colors resize-y font-body"
              />
            </div>

            {/* Featured on Homepage Toggle */}
            <div className="md:col-span-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200/90 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FiStar className="text-amber-500 fill-amber-500" size={16} />
                  <span className="font-heading font-bold text-sm text-black">Feature on Homepage</span>
                </div>
                <p className="text-xs text-gray-500 font-body mt-0.5">
                  Display this project in the "Featured Projects" showcase on the home page.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red"></div>
              </label>
            </div>

            {/* Project Image Section */}
            <div className="md:col-span-2 space-y-2">
              <label className="block font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Project Image
              </label>

              {/* Image Preview Box */}
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-48 w-full group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-black text-xs font-accent font-bold uppercase rounded-btn hover:bg-gray-100 flex items-center gap-1.5"
                    >
                      <FiUploadCloud size={14} /> Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1.5 bg-red text-white text-xs font-accent font-bold uppercase rounded-btn hover:bg-red-700 flex items-center gap-1.5"
                    >
                      <FiTrash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                /* Drag & Drop Upload Zone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-red rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-red-50/20"
                >
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red mx-auto flex items-center justify-center mb-2">
                    <FiUploadCloud size={24} />
                  </div>
                  <p className="text-sm font-heading font-bold text-black mb-0.5">
                    Click to upload project photo
                  </p>
                  <p className="text-xs text-gray-500 font-body">
                    Supports JPG, PNG, WEBP (Max 15MB)
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Or Paste Direct Image URL */}
              <div className="pt-2">
                <span className="text-[11px] font-accent uppercase tracking-wider text-gray-400 font-bold block mb-1">
                  Or enter external image URL:
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      if (!imageFile) setImagePreview(e.target.value);
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black font-mono"
                  />
                  {formData.image && !imageFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image: '' });
                        setImagePreview('');
                      }}
                      className="px-2.5 py-1 text-xs text-gray-500 hover:text-red border border-gray-200 rounded-btn"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
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
              className="text-xs font-accent uppercase tracking-wider px-5 py-2 flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <FiRefreshCw className="animate-spin" size={14} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red mx-auto flex items-center justify-center">
            <FiAlertTriangle size={24} />
          </div>
          <div className="text-center">
            <h4 className="font-heading font-bold text-base text-black mb-1">
              Delete this project?
            </h4>
            <p className="text-xs text-gray-600 font-body leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-black font-semibold">"{projectToDelete?.title}"</strong>?
              This action cannot be undone.
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
              {deleting ? (
                <>
                  <FiRefreshCw className="animate-spin" size={14} />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <FiTrash2 size={14} />
                  <span>Yes, Delete</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProjects;
