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
  FiZap, 
  FiCheckCircle, 
  FiGrid, 
  FiList, 
  FiX, 
  FiCheck,
  FiRefreshCw,
  FiAlertTriangle,
  FiShield,
  FiTag,
  FiLayers
} from 'react-icons/fi';

const SERVICE_CATEGORIES = ['Residential', 'Commercial', 'Industrial', 'Maintenance', 'Storage', 'Agricultural'];



const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Residential',
    price: '',
    capacity: '',
    warranty: '',
    shortDesc: '',
    fullDesc: '',
    benefits: '',
    isActive: true,
  });

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/services');
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch services', error);
      toast.error(error.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const titleMatch = (service.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = (service.shortDesc || '').toLowerCase().includes(searchQuery.toLowerCase());
      const priceMatch = (service.price || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = titleMatch || descMatch || priceMatch;

      const matchesCat = selectedCategory === 'All' || (service.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const matchesStatus = 
        filterStatus === 'All' ||
        (filterStatus === 'Active' && service.isActive) ||
        (filterStatus === 'Inactive' && !service.isActive);

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [services, searchQuery, selectedCategory, filterStatus]);

  // Statistics Counts
  const stats = useMemo(() => {
    const total = services.length;
    const residential = services.filter(s => (s.category || '').toLowerCase() === 'residential').length;
    const commercial = services.filter(s => (s.category || '').toLowerCase() === 'commercial').length;
    const industrial = services.filter(s => (s.category || '').toLowerCase() === 'industrial').length;
    const active = services.filter(s => s.isActive).length;
    return { total, residential, commercial, industrial, active };
  }, [services]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      category: 'Residential',
      price: '',
      capacity: '',
      warranty: '25 Years Warranty',
      shortDesc: '',
      fullDesc: '',
      benefits: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      category: service.category || 'Residential',
      price: service.price || '',
      capacity: service.capacity || '',
      warranty: service.warranty || '',
      shortDesc: service.shortDesc || '',
      fullDesc: service.fullDesc || '',
      benefits: Array.isArray(service.benefits) ? service.benefits.join(', ') : (service.benefits || ''),
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
    setIsModalOpen(true);
  };

  // Submit Form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter service title');
      return;
    }

    try {
      setSaving(true);

      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('category', formData.category);
      submitData.append('price', formData.price.trim());
      submitData.append('capacity', formData.capacity.trim());
      submitData.append('warranty', formData.warranty.trim());
      submitData.append('shortDesc', formData.shortDesc.trim());
      submitData.append('fullDesc', formData.fullDesc.trim());
      submitData.append('isActive', formData.isActive);

      // Process benefits into array
      const benefitsArray = formData.benefits
        .split(',')
        .map(b => b.trim())
        .filter(Boolean);
      submitData.append('benefits', JSON.stringify(benefitsArray));


      if (editingService) {
        const { data } = await api.put(`/services/${editingService._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Service updated successfully!');
        setServices(prev => prev.map(s => s._id === editingService._id ? data : s));
      } else {
        const { data } = await api.post('/services', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('New service created successfully!');
        setServices(prev => [data, ...prev]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (service) => {
    try {
      const { data } = await api.patch(`/services/${service._id}/status`);
      toast.success(data.isActive ? `"${service.title}" is now Active` : `"${service.title}" set to Inactive`);
      setServices(prev => prev.map(s => s._id === service._id ? data : s));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Prompt Delete
  const handlePromptDelete = (service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/services/${serviceToDelete._id}`);
      toast.success('Service deleted successfully');
      setServices(prev => prev.filter(s => s._id !== serviceToDelete._id));
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(error.response?.data?.message || 'Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  // Category Badge Colors
  const getCategoryBadgeClass = (category) => {
    const c = (category || '').toLowerCase();
    if (c === 'residential') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (c === 'commercial') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (c === 'industrial') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (c === 'maintenance') return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    if (c === 'storage') return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
            <span className="font-accent text-xs font-bold uppercase tracking-wider text-red">Services Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading text-black font-bold tracking-tight">
            Solar Services Module
          </h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            Configure available solar installation offerings, tariffs, specifications, and client benefits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button
            variant="outline"
            onClick={fetchServices}
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
            <span>Add Service</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-500 font-bold">Total Services</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-black">{stats.total}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">All</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-blue-600 font-bold">Residential</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-blue-700">{stats.residential}</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">Rooftop</span>
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
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold">EPC</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-green-600 font-bold">Active Live</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-green-700">{stats.active}</span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
              <FiCheckCircle size={11} /> Published
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
              placeholder="Search by service name, category, or pricing..."
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

          {/* Right Controls: Status Filter & View Mode */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs font-accent font-semibold uppercase tracking-wider bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-black"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
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
                title="Grid view"
              >
                <FiGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-400 font-bold mr-1">Filter Type:</span>
          {['All', ...SERVICE_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-accent font-semibold tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
          {filteredServices.length !== services.length && (
            <span className="text-xs text-gray-400 font-body ml-auto">
              Showing {filteredServices.length} of {services.length}
            </span>
          )}
        </div>
      </div>

      {/* Content: Table or Grid */}
      {loading ? (
        <Card className="p-12 text-center bg-white border border-gray-200">
          <div className="inline-block animate-spin text-red mb-3">
            <FiRefreshCw size={28} />
          </div>
          <p className="text-sm font-accent uppercase tracking-wider text-gray-500">Loading solar services...</p>
        </Card>
      ) : filteredServices.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-gray-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-4">
            <FiLayers size={28} />
          </div>
          <h3 className="font-heading text-lg text-black mb-1">No Services Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-5 font-body">
            No service offerings match your filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setFilterStatus('All');
            }}
            className="text-xs font-accent uppercase tracking-wider"
          >
            Reset Filters
          </Button>
        </Card>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <Card className="p-0 overflow-hidden bg-white border border-gray-200/90 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/90 text-gray-600 border-b border-gray-200 text-xs font-accent font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Service & Overview</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Pricing</th>
                  <th className="py-3.5 px-4">Capacity Range</th>
                  <th className="py-3.5 px-4">Warranty</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-black divide-y divide-gray-100">
                {filteredServices.map((s) => {
                  return (
                    <tr key={s._id} className="hover:bg-gray-50/70 transition-colors group">

                      {/* Title & Short Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-heading font-bold text-black text-sm group-hover:text-red transition-colors line-clamp-1">
                          {s.title}
                        </div>
                        {s.shortDesc && (
                          <div className="text-xs text-gray-500 font-body line-clamp-1 mt-0.5">
                            {s.shortDesc}
                          </div>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-accent font-bold uppercase tracking-wider rounded-full border ${getCategoryBadgeClass(s.category)}`}>
                          {s.category || 'Standard'}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-3.5 px-4 font-accent font-bold text-red text-sm">
                        {s.price || 'Custom Quote'}
                      </td>

                      {/* Capacity */}
                      <td className="py-3.5 px-4 text-gray-700 font-body text-xs">
                        {s.capacity || 'All Sizes'}
                      </td>

                      {/* Warranty */}
                      <td className="py-3.5 px-4 text-xs font-body text-gray-600">
                        {s.warranty || 'Standard'}
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(s)}
                          className={`px-2.5 py-1 text-xs font-accent font-bold uppercase rounded-full border transition-all ${
                            s.isActive
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {s.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                            title="Edit Service"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => handlePromptDelete(s)}
                            className="p-1.5 text-red hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                            title="Delete Service"
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
          {filteredServices.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:border-red hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-red text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <FiZap size={14} />
                    </span>
                    <span className="text-xs font-accent font-bold uppercase tracking-wider text-gray-300">
                      {s.category}
                    </span>
                  </div>
                  <span className={`text-[10px] font-accent font-bold px-2.5 py-0.5 uppercase rounded-md shadow-sm ${
                    s.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-black mb-1 group-hover:text-red transition-colors line-clamp-1">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-body line-clamp-2 leading-relaxed mb-3">
                    {s.shortDesc}
                  </p>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <span className="block text-[10px] font-accent uppercase tracking-wider text-gray-400">Pricing</span>
                      <span className="font-accent font-bold text-red text-base">{s.price || 'Custom'}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-accent uppercase tracking-wider text-gray-400">Warranty</span>
                      <span className="font-accent font-bold text-gray-700 text-xs">{s.warranty || 'Standard'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(s)}
                  className={`text-xs font-accent font-semibold px-2.5 py-1 rounded-md border transition-colors ${
                    s.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  {s.isActive ? 'Set Inactive' : 'Set Active'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-gray-200"
                    title="Edit"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => handlePromptDelete(s)}
                    className="p-1.5 text-red hover:bg-red-50 rounded-md border border-gray-200"
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT SERVICE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !saving && setIsModalOpen(false)}
        title={editingService ? 'Edit Solar Service' : 'Add New Solar Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Service Title <span className="text-red">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Residential Solar (Rooftop), Solar Maintenance & AMC"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Category <span className="text-red">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black font-body"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Pricing / Tariff
              </label>
              <input
                type="text"
                placeholder="e.g. ₹65,000 / kW or ₹1,200 / panel/yr"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Capacity Range
              </label>
              <input
                type="text"
                placeholder="e.g. 1 kW – 10 kW or 100 kW+"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Warranty / Service SLA
              </label>
              <input
                type="text"
                placeholder="e.g. 25 Years Panel Warranty"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Short Summary Description
              </label>
              <textarea
                rows={2}
                placeholder="Brief value proposition shown on cards..."
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black resize-y font-body"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Key Benefits (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Net-metering support, PM Surya Ghar subsidy, 40% depreciation"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200/90 flex items-center justify-between">
              <div>
                <span className="font-heading font-bold text-sm text-black">Active & Published</span>
                <p className="text-xs text-gray-500 font-body">Make visible on the public Services page</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

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
                  <span>{editingService ? 'Update Service' : 'Create Service'}</span>
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
              Delete this service?
            </h4>
            <p className="text-xs text-gray-600 font-body leading-relaxed">
              Are you sure you want to remove{' '}
              <strong className="text-black font-semibold">"{serviceToDelete?.title}"</strong>?
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

export default AdminServices;
