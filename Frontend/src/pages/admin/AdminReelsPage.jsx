import React, { useState, useEffect } from 'react';
import { 
  FiVideo, FiPlus, FiTrash2, FiEdit2, FiEye, 
  FiZap, FiUpload, FiX, FiCheckCircle, FiPlay, FiSearch, FiGlobe, FiEyeOff
} from 'react-icons/fi';
import { 
  getAdminReels, 
  createReel, 
  updateReel, 
  deleteReel 
} from '../../services/reelService';

const CATEGORIES = ['Installation', 'Testimonial', 'Commercial', 'Subsidy Explainer', 'Products'];

const AdminReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'Installation',
    tags: '',
    systemCapacity: '5 kW System',
    location: 'Coimbatore, Tamil Nadu',
    status: 'Published',
    showOnStorefront: true,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch admin reels
  const fetchReels = async () => {
    try {
      setLoading(true);
      const data = await getAdminReels();
      setReels(data || []);
    } catch (err) {
      console.error('Failed to fetch admin reels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingReel(null);
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: 'Installation',
      tags: '',
      systemCapacity: '5 kW System',
      location: 'Coimbatore, Tamil Nadu',
      status: 'Published',
      showOnStorefront: true,
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (reel) => {
    setEditingReel(reel);
    setFormData({
      title: reel.title || '',
      description: reel.description || '',
      videoUrl: reel.videoUrl || '',
      thumbnailUrl: reel.thumbnailUrl || '',
      category: reel.category || 'Installation',
      tags: Array.isArray(reel.tags) ? reel.tags.join(', ') : '',
      systemCapacity: reel.systemCapacity || '5 kW System',
      location: reel.location || 'Coimbatore, Tamil Nadu',
      status: reel.status || 'Published',
      showOnStorefront: reel.showOnStorefront !== undefined ? reel.showOnStorefront : true,
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('systemCapacity', formData.systemCapacity);
      data.append('location', formData.location);
      data.append('status', formData.status);
      data.append('showOnStorefront', formData.showOnStorefront);
      data.append('tags', formData.tags);

      if (videoFile) {
        data.append('videoFile', videoFile);
      } else if (formData.videoUrl) {
        data.append('videoUrl', formData.videoUrl);
      }

      if (thumbnailFile) {
        data.append('thumbnailFile', thumbnailFile);
      } else if (formData.thumbnailUrl) {
        data.append('thumbnailUrl', formData.thumbnailUrl);
      }

      if (editingReel) {
        await updateReel(editingReel._id, data);
        setSuccess('Reel updated successfully!');
      } else {
        await createReel(data);
        setSuccess('Reel created successfully!');
      }

      setTimeout(() => {
        setIsModalOpen(false);
        fetchReels();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save reel');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Reel
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this solar reel?')) return;
    try {
      await deleteReel(id);
      fetchReels();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete reel');
    }
  };

  // Toggle Storefront Visibility
  const handleToggleStorefront = async (reel) => {
    try {
      const data = new FormData();
      data.append('showOnStorefront', !reel.showOnStorefront);
      await updateReel(reel._id, data);
      fetchReels();
    } catch (err) {
      console.error('Failed to toggle storefront:', err);
    }
  };

  // Filtered Reels list
  const filteredReels = reels.filter((r) => {
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.systemCapacity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Metrics
  const totalViews = reels.reduce((acc, r) => acc + (r.viewsCount || 0), 0);
  const totalQuoteClicks = reels.reduce((acc, r) => acc + (r.quoteClicksCount || 0), 0);

  return (
    <div className="space-y-8 p-2 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-black flex items-center gap-2">
            <FiVideo className="text-red" /> Solar Reels Manager
          </h1>
          <p className="text-sm text-gray font-body mt-1">
            Manage short-form video reels, installation timelapses & quote CTR performance.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-red hover:bg-red-hover text-white px-5 py-2.5 rounded-xl font-accent font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red/20 transition-colors"
        >
          <FiPlus size={18} /> Upload New Reel
        </button>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-light shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red/10 text-red rounded-xl">
            <FiVideo size={24} />
          </div>
          <div>
            <p className="text-xs font-accent text-gray uppercase tracking-wider font-semibold">Total Reels</p>
            <h3 className="font-heading text-2xl font-bold text-black">{reels.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-light shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
            <FiEye size={24} />
          </div>
          <div>
            <p className="text-xs font-accent text-gray uppercase tracking-wider font-semibold">Total Views</p>
            <h3 className="font-heading text-2xl font-bold text-black">{totalViews.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-light shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <FiZap size={24} />
          </div>
          <div>
            <p className="text-xs font-accent text-gray uppercase tracking-wider font-semibold">Quote Clicks</p>
            <h3 className="font-heading text-2xl font-bold text-black">{totalQuoteClicks.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-light shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
          <input
            type="text"
            placeholder="Search by title, location, capacity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-light rounded-xl focus:outline-none focus:border-red"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-accent font-semibold transition-colors ${
              categoryFilter === 'All' ? 'bg-black text-white' : 'bg-surface text-gray hover:text-black'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-accent font-semibold transition-colors whitespace-nowrap ${
                categoryFilter === cat ? 'bg-black text-white' : 'bg-surface text-gray hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* REELS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-light shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray font-accent">Loading Reels Data...</div>
        ) : filteredReels.length === 0 ? (
          <div className="p-12 text-center text-gray font-accent">No reels found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface text-xs font-accent uppercase text-gray border-b border-gray-light">
                  <th className="p-4">Reel Preview</th>
                  <th className="p-4">Category & Capacity</th>
                  <th className="p-4">Total Views</th>
                  <th className="p-4">Quote Clicks</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light text-sm font-body">
                {filteredReels.map((reel) => (
                  <tr key={reel._id} className="hover:bg-surface/50 transition-colors">
                    {/* Reel Preview */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => setPreviewVideoUrl(reel.videoUrl)}
                          className="w-14 h-20 bg-black rounded-lg overflow-hidden relative group cursor-pointer flex-shrink-0"
                        >
                          {reel.thumbnailUrl ? (
                            <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-red/10 flex items-center justify-center text-red">
                              <FiVideo size={20} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiPlay className="text-white" size={20} />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-black line-clamp-1">{reel.title}</h4>
                          <p className="text-xs text-gray">{reel.location}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Capacity */}
                    <td className="p-4">
                      <span className="inline-block bg-surface px-2.5 py-1 rounded-lg text-xs font-accent font-semibold text-black mb-1">
                        {reel.category}
                      </span>
                      <p className="text-xs font-accent text-red font-semibold">{reel.systemCapacity}</p>
                    </td>

                    {/* Views */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-accent font-semibold text-gray-700">
                        <FiEye className="text-red" /> {reel.viewsCount || 0} Views
                      </div>
                    </td>

                    {/* Quote Clicks */}
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-accent font-bold text-xs">
                        <FiZap /> {reel.quoteClicksCount || 0} Clicks
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-accent font-semibold uppercase ${
                          reel.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-800'
                        }`}>
                          {reel.status}
                        </span>
                        <button
                          onClick={() => handleToggleStorefront(reel)}
                          className={`flex items-center gap-1 text-[11px] font-accent font-medium ${
                            reel.showOnStorefront ? 'text-emerald-600 hover:text-emerald-700' : 'text-gray hover:text-black'
                          }`}
                        >
                          {reel.showOnStorefront ? <FiGlobe size={12} /> : <FiEyeOff size={12} />}
                          <span>{reel.showOnStorefront ? 'Storefront Visible' : 'Hidden'}</span>
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(reel)}
                          className="p-2 text-gray hover:text-black hover:bg-surface rounded-lg transition-colors"
                          title="Edit Reel"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(reel._id)}
                          className="p-2 text-gray hover:text-red hover:bg-red/10 rounded-lg transition-colors"
                          title="Delete Reel"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-gray-light pb-4">
              <h3 className="font-heading text-xl font-bold text-black flex items-center gap-2">
                <FiVideo className="text-red" />
                {editingReel ? 'Edit Solar Reel' : 'Upload New Solar Reel'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray hover:text-black">
                <FiX size={20} />
              </button>
            </div>

            {error && <div className="bg-red/10 text-red p-3 rounded-xl text-xs font-accent">{error}</div>}
            {success && <div className="bg-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-accent">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-accent font-semibold text-black mb-1">Reel Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 5kW Rooftop Solar Installation"
                    className="w-full px-3 py-2 text-sm border border-gray-light rounded-xl focus:outline-none focus:border-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-accent font-semibold text-black mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-light rounded-xl focus:outline-none focus:border-red"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-accent font-semibold text-black mb-1">System Capacity</label>
                  <input
                    type="text"
                    value={formData.systemCapacity}
                    onChange={(e) => setFormData({ ...formData, systemCapacity: e.target.value })}
                    placeholder="e.g. 5 kW System or 10 kW On-Grid"
                    className="w-full px-3 py-2 text-sm border border-gray-light rounded-xl focus:outline-none focus:border-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-accent font-semibold text-black mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Coimbatore, Tamil Nadu"
                    className="w-full px-3 py-2 text-sm border border-gray-light rounded-xl focus:outline-none focus:border-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-accent font-semibold text-black mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short caption describing the solar installation..."
                  className="w-full px-3 py-2 text-sm border border-gray-light rounded-xl focus:outline-none focus:border-red"
                />
              </div>

              {/* Video Source Upload / URL */}
              <div className="space-y-2 border-t border-b border-gray-light py-3">
                <label className="block text-xs font-accent font-semibold text-black">Video Source</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-gray block mb-1">Upload Video File (MP4, WEBM up to 50MB)</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      className="text-xs text-gray file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red/10 file:text-red hover:file:bg-red/20"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray block mb-1">Or Direct Video URL</span>
                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://.../video.mp4"
                      className="w-full px-3 py-1.5 text-sm border border-gray-light rounded-xl focus:outline-none focus:border-red"
                    />
                  </div>
                </div>
              </div>

              {/* Thumbnail Source Upload / URL */}
              <div className="space-y-2 border-b border-gray-light pb-3">
                <label className="block text-xs font-accent font-semibold text-black">Thumbnail Image</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-gray block mb-1">Upload Thumbnail File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                      className="text-xs text-gray file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-black"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray block mb-1">Or Thumbnail Image URL</span>
                    <input
                      type="text"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="https://.../thumbnail.jpg"
                      className="w-full px-3 py-1.5 text-sm border border-gray-light rounded-xl focus:outline-none focus:border-red"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-accent font-semibold text-black mb-1">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-light rounded-xl focus:outline-none focus:border-red"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-accent font-semibold text-black">
                    <input
                      type="checkbox"
                      checked={formData.showOnStorefront}
                      onChange={(e) => setFormData({ ...formData, showOnStorefront: e.target.checked })}
                      className="rounded text-red focus:ring-red"
                    />
                    <span>Visible on Website Storefront</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-light">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-accent font-semibold text-gray hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-red hover:bg-red-hover text-white px-6 py-2 rounded-xl text-xs font-accent font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingReel ? 'Update Reel' : 'Publish Reel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black"
            >
              <FiX size={18} />
            </button>
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              className="w-full aspect-[9/16] object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReelsPage;
