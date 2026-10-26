import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { 
  FiPlus, 
  FiTrash2, 
  FiSearch, 
  FiStar, 
  FiGrid, 
  FiList, 
  FiCheckCircle, 
  FiXCircle,
  FiRefreshCw, 
  FiAlertTriangle, 
  FiMapPin, 
  FiUser, 
  FiClock, 
  FiMessageSquare,
  FiX,
  FiCheck,
  FiUpload,
  FiImage
} from 'react-icons/fi';

const formatImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  if (url.startsWith('/uploads')) return `${baseUrl}${url}`;
  return `${baseUrl}/uploads/${url}`;
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    location: 'Homeowner, Delhi',
    systemSize: '5 kW System',
    rating: 5,
    review: '',
    status: 'Approved',
    photo: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/testimonials/admin/all');
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch testimonials', error);
      toast.error(error.response?.data?.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Filtered Testimonials
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const nameMatch = (t.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const locMatch = (t.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      const revMatch = (t.review || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || locMatch || revMatch;

      const matchesStatus = statusFilter === 'All' || (t.status || '').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [testimonials, searchQuery, statusFilter]);

  // Statistics Counts
  const stats = useMemo(() => {
    const total = testimonials.length;
    const approved = testimonials.filter(t => t.status === 'Approved').length;
    const pending = testimonials.filter(t => t.status === 'Pending').length;
    const rejected = testimonials.filter(t => t.status === 'Rejected').length;
    const fiveStars = testimonials.filter(t => Number(t.rating) === 5).length;
    return { total, approved, pending, rejected, fiveStars };
  }, [testimonials]);

  // Status Update Handler
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/testimonials/admin/${id}/status`, { status: newStatus });
      toast.success(`Review ${newStatus === 'Approved' ? 'Approved & Published' : newStatus}!`);
      setTestimonials(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTestimonial(null);
    setForm({
      name: '',
      location: 'Homeowner, Delhi',
      systemSize: '5 kW System',
      rating: 5,
      review: '',
      status: 'Approved',
      photo: '',
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (PNG, JPG, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm(prev => ({ ...prev, photo: '' }));
  };

  // Submit Modal Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.review.trim()) {
      toast.error('Please enter customer name and review text');
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append('name', form.name);
      data.append('location', form.location);
      data.append('systemSize', form.systemSize);
      data.append('rating', form.rating);
      data.append('review', form.review);
      data.append('status', form.status);
      if (imageFile) {
        data.append('photo', imageFile);
      } else if (form.photo) {
        data.append('photo', form.photo);
      }

      if (editingTestimonial) {
        await api.put(`/testimonials/admin/${editingTestimonial._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Testimonial updated!');
      } else {
        await api.post('/testimonials/admin', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Testimonial created!');
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  // Prompt Delete
  const handlePromptDelete = (t) => {
    setItemToDelete(t);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/testimonials/admin/${itemToDelete._id}`);
      toast.success('Testimonial removed successfully');
      setTestimonials(prev => prev.filter(t => t._id !== itemToDelete._id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error('Failed to delete testimonial');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Approved') return 'bg-green-50 text-green-700 border-green-200';
    if (status === 'Pending') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
            <span className="font-accent text-xs font-bold uppercase tracking-wider text-red">Customer Trust & Social Proof</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading text-black font-bold tracking-tight">
            Testimonials Module
          </h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            Moderate incoming client feedback, manage verified ratings, and publish homepage testimonials.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button
            variant="outline"
            onClick={fetchTestimonials}
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
            <span>Add Testimonial</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-500 font-bold">Total Reviews</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-black">{stats.total}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">All</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-green-600 font-bold">Approved Live</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-green-700">{stats.approved}</span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-semibold">Live</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-amber-600 font-bold">Pending Review</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-amber-700">{stats.pending}</span>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-semibold">Queue</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-red font-bold">Rejected</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-red">{stats.rejected}</span>
            <span className="text-xs bg-red-50 text-red px-2 py-0.5 rounded-md font-semibold">Hidden</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-amber-500 font-bold">5-Star Ratings</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-amber-600">{stats.fiveStars}</span>
            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
              <FiStar size={10} className="fill-amber-500 text-amber-500" /> Top
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type="text"
              placeholder="Search by customer name, location, or review keyword..."
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

          <div className="flex items-center gap-2 self-end md:self-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-accent font-semibold uppercase tracking-wider bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-black"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Rejected">Rejected Only</option>
            </select>

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
                title="Cards view"
              >
                <FiGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-400 font-bold mr-1">Filter Status:</span>
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-accent font-semibold tracking-wider transition-all ${
                statusFilter === status
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
              {status === 'Pending' && stats.pending > 0 && (
                <span className="ml-1.5 bg-red text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
          {filteredTestimonials.length !== testimonials.length && (
            <span className="text-xs text-gray-400 font-body ml-auto">
              Showing {filteredTestimonials.length} of {testimonials.length}
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
          <p className="text-sm font-accent uppercase tracking-wider text-gray-500">Loading customer reviews...</p>
        </Card>
      ) : filteredTestimonials.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-gray-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-4">
            <FiMessageSquare size={28} />
          </div>
          <h3 className="font-heading text-lg text-black mb-1">No Reviews Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-5 font-body">
            No testimonials match your active filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
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
                  <th className="py-3.5 px-4 w-12 text-center">User</th>
                  <th className="py-3.5 px-4">Client Name & Details</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review Content</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-black divide-y divide-gray-100">
                {filteredTestimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/70 transition-colors group">
                    {/* User Avatar / Photo */}
                    <td className="py-3.5 px-4 text-center">
                      {t.photo ? (
                        <img
                          src={formatImageUrl(t.photo)}
                          alt={t.name}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          className="w-9 h-9 rounded-full object-cover border border-red/40 shadow-sm mx-auto"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-red text-white flex items-center justify-center font-heading font-bold text-xs uppercase shadow-sm mx-auto">
                          {(t.name || 'U').slice(0, 2)}
                        </div>
                      )}
                    </td>

                    {/* Name & Details */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-heading font-bold text-black text-sm group-hover:text-red transition-colors">
                        {t.name}
                      </div>
                      <div className="text-xs text-gray-500 font-body flex items-center gap-1 mt-0.5">
                        <FiMapPin size={11} className="text-gray-400" />
                        <span>{t.location || 'Client'}</span>
                        {t.systemSize && <span className="text-gray-400">• {t.systemSize}</span>}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex text-amber-400">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <FiStar key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </td>

                    {/* Review text */}
                    <td className="py-3.5 px-4 max-w-md">
                      <p className="text-xs text-gray-700 font-body line-clamp-2 italic">
                        "{t.review}"
                      </p>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-gray-500 font-body whitespace-nowrap">
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-accent font-bold uppercase tracking-wider rounded-full border ${getStatusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status !== 'Approved' && (
                          <button
                            onClick={() => handleStatusUpdate(t._id, 'Approved')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200"
                            title="Approve & Publish"
                          >
                            <FiCheck size={15} />
                          </button>
                        )}
                        {t.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(t._id, 'Rejected')}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                            title="Reject"
                          >
                            <FiX size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handlePromptDelete(t)}
                          className="p-1.5 text-red hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          title="Delete"
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
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-red transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {t.photo ? (
                      <img
                        src={formatImageUrl(t.photo)}
                        alt={t.name}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className="w-10 h-10 rounded-full object-cover border border-red/40 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red text-white flex items-center justify-center font-heading font-bold text-sm uppercase shrink-0">
                        {(t.name || 'U').slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-heading font-bold text-black text-base">{t.name}</h4>
                      <p className="text-xs text-gray-500 font-body flex items-center gap-1">
                        <FiMapPin size={12} className="text-gray-400" />
                        <span>{t.location}</span>
                        {t.systemSize && <span className="text-gray-400">• {t.systemSize}</span>}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-accent font-bold uppercase border ${getStatusBadge(t.status)}`}>
                    {t.status}
                  </span>
                </div>

                <div className="flex text-amber-400 mb-2">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <FiStar key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-gray-700 font-body italic bg-gray-50 p-3.5 rounded-xl border border-gray-100 leading-relaxed mb-4">
                  "{t.review}"
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-400 font-body flex items-center gap-1">
                  <FiClock size={12} /> {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent'}
                </span>

                <div className="flex items-center gap-2">
                  {t.status !== 'Approved' && (
                    <button
                      onClick={() => handleStatusUpdate(t._id, 'Approved')}
                      className="px-2.5 py-1 text-xs font-accent font-bold text-green-700 bg-green-50 hover:bg-green-100 rounded-md border border-green-200"
                    >
                      Approve
                    </button>
                  )}
                  {t.status !== 'Rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(t._id, 'Rejected')}
                      className="px-2.5 py-1 text-xs font-accent font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md border border-amber-200"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handlePromptDelete(t)}
                    className="p-1 text-red hover:bg-red-50 rounded"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !saving && setIsModalOpen(false)}
        title="Add Verified Customer Review"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
              Customer Full Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kulkarni"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Homeowner, Pune"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                System Size / Capacity
              </label>
              <input
                type="text"
                placeholder="e.g. 5 kW Rooftop"
                value={form.systemSize}
                onChange={(e) => setForm({ ...form, systemSize: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Star Rating
              </label>
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars - Great)</option>
                <option value={3}>⭐⭐⭐ (3 Stars - Good)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Approval Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
              >
                <option value="Approved">Approved (Publish Live)</option>
                <option value="Pending">Pending Review</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
              Customer Feedback / Review Message <span className="text-red">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Enter customer words and feedback..."
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black resize-y font-body"
            />
          </div>

          <div>
            <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
              Customer Photo / Solar System Image (Optional)
            </label>
            {imagePreview ? (
              <div className="relative border border-gray-200 rounded-xl p-2.5 bg-gray-50 flex items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Testimonial Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {imageFile ? imageFile.name : 'Current Image'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 text-gray-400 hover:text-red rounded-lg transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 hover:border-red rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-gray-50 hover:bg-red/5 transition-all text-xs font-medium text-gray-600">
                <FiUpload className="text-gray-400" size={15} />
                <span>Choose photo or setup image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
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
              {saving ? 'Saving...' : 'Save Testimonial'}
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
              Delete this testimonial?
            </h4>
            <p className="text-xs text-gray-600 font-body leading-relaxed">
              Are you sure you want to permanently remove review by{' '}
              <strong className="text-black font-semibold">"{itemToDelete?.name}"</strong>?
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

export default AdminTestimonials;
