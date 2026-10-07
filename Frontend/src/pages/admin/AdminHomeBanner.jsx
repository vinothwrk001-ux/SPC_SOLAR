import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { 
  FiImage, 
  FiVideo, 
  FiUploadCloud, 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiEye, 
  FiEyeOff, 
  FiExternalLink, 
  FiPlay, 
  FiCheckCircle, 
  FiLayers,
  FiArrowRight,
  FiRefreshCw
} from 'react-icons/fi';

const QUICK_CTA_LINKS = [
  { label: '✨ Request Quote Popup', url: '#quote' },
  { label: 'Quotation Calculator Page', url: '/quotation' },
  { label: 'Contact Us', url: '/contact' },
  { label: 'Subsidy Guide', url: '/subsidy' },
  { label: 'Solar Services', url: '/services' },
  { label: 'Our Projects', url: '/projects' },
  { label: 'WhatsApp Chat', url: 'https://wa.me/919025462326' },
];

const AdminHomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: 'REQUEST A QUOTE',
    ctaUrl: '/quotation',
    secondaryCtaText: '',
    secondaryCtaUrl: '',
    order: 0,
    isActive: true,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState('image'); // 'image' or 'video'

  const [editingBanner, setEditingBanner] = useState(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get('/banner/admin');
      if (res.data?.banners) {
        setBanners(res.data.banners);
      } else if (Array.isArray(res.data)) {
        setBanners(res.data);
      }
    } catch (error) {
      toast.error('Failed to load home banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const isVideo = file.type.startsWith('video') || /\.(mp4|webm|mov|mkv)$/i.test(file.name);
    setFileType(isVideo ? 'video' : 'image');

    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      ctaText: 'REQUEST A QUOTE',
      ctaUrl: '/quotation',
      secondaryCtaText: '',
      secondaryCtaUrl: '',
      order: banners.length,
      isActive: true,
    });
    setSelectedFile(null);
    setFilePreview(null);
    setFileType('image');
    setEditingBanner(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      ctaText: banner.ctaText || '',
      ctaUrl: banner.ctaUrl || '',
      secondaryCtaText: banner.secondaryCtaText || '',
      secondaryCtaUrl: banner.secondaryCtaUrl || '',
      order: banner.order || 0,
      isActive: banner.isActive !== false,
    });
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(banner.mediaType || 'image');
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image or video file for the banner');
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append('media', selectedFile);
      data.append('mediaType', fileType);
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('ctaText', formData.ctaText);
      data.append('ctaUrl', formData.ctaUrl);
      data.append('secondaryCtaText', formData.secondaryCtaText);
      data.append('secondaryCtaUrl', formData.secondaryCtaUrl);
      data.append('order', formData.order);
      data.append('isActive', formData.isActive);

      await api.post('/banner', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Banner added successfully!');
      setIsAddModalOpen(false);
      resetForm();
      fetchBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingBanner) return;

    try {
      setUploading(true);
      const data = new FormData();
      if (selectedFile) {
        data.append('media', selectedFile);
        data.append('mediaType', fileType);
      }
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('ctaText', formData.ctaText);
      data.append('ctaUrl', formData.ctaUrl);
      data.append('secondaryCtaText', formData.secondaryCtaText);
      data.append('secondaryCtaUrl', formData.secondaryCtaUrl);
      data.append('order', formData.order);
      data.append('isActive', formData.isActive);

      await api.put(`/banner/${editingBanner._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Banner updated successfully!');
      setIsEditModalOpen(false);
      resetForm();
      fetchBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update banner');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/banner/${id}/toggle`);
      setBanners((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isActive: !b.isActive } : b))
      );
      toast.success('Banner status updated');
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      await api.delete(`/banner/${id}`);
      toast.success('Banner deleted');
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 flex items-center gap-2">
            <FiLayers className="text-red-500" /> Home Banners & Hero Slider
          </h2>
          <p className="text-sm text-gray-500 font-body mt-1">
            Manage multiple hero banners, videos, CTA buttons & links displayed in a row on the storefront
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchBanners} variant="outline" className="flex items-center gap-2 text-sm">
            <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
          <Button onClick={handleOpenAdd} variant="primary" className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 text-white">
            <FiPlus /> Add New Banner / Slide
          </Button>
        </div>
      </div>

      {/* Multiple Banners in a Row / Responsive Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Active Slides ({banners.filter((b) => b.isActive).length} / {banners.length} Total)
          </h3>
          <span className="text-xs text-gray-500">
            Slides will transition automatically in order on the homepage
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8">
            <FiImage className="mx-auto text-gray-300 w-16 h-16 mb-4" />
            <h4 className="text-lg font-bold text-gray-700 mb-1">No Home Banners Found</h4>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Add multiple banner images or video slides with custom CTA buttons to showcase on your homepage.
            </p>
            <Button onClick={handleOpenAdd} variant="primary">
              <FiPlus className="mr-2" /> Upload First Banner
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {banners.map((banner, index) => {
              const isVideo = banner.mediaType === 'video' || /\.(mp4|webm|mov|mkv)$/i.test(banner.mediaUrl || banner.imageUrl || '');
              const fullMediaUrl = getMediaUrl(banner.mediaUrl || banner.imageUrl);

              return (
                <div
                  key={banner._id}
                  className={`bg-white rounded-2xl overflow-hidden border transition-all hover:shadow-lg flex flex-col ${
                    banner.isActive ? 'border-gray-200 shadow-sm' : 'border-gray-300 opacity-60 bg-gray-50'
                  }`}
                >
                  {/* Media Preview Container */}
                  <div className="relative aspect-[16/9] bg-black overflow-hidden group">
                    {isVideo ? (
                      <video
                        src={fullMediaUrl}
                        className="w-full h-full object-cover"
                        controls
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={fullMediaUrl}
                        alt={banner.title || 'Banner Slide'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
                      <span className="bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                        {isVideo ? <FiVideo className="text-red-400" /> : <FiImage className="text-blue-400" />}
                        {isVideo ? 'VIDEO' : 'IMAGE'}
                      </span>
                      <span className="bg-black/70 backdrop-blur-sm text-white text-[11px] font-mono px-2 py-1 rounded-md">
                        #{banner.order ?? index + 1}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-sm ${
                          banner.isActive
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-200'
                        }`}
                      >
                        {banner.isActive ? 'Active' : 'Draft / Inactive'}
                      </span>
                    </div>

                    {/* Floating CTA preview overlay if provided */}
                    {banner.ctaText && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                        <div className="bg-red-600/95 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                          <span>{banner.ctaText}</span>
                          <FiArrowRight size={12} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-heading font-bold text-gray-900 text-base line-clamp-1">
                          {banner.title || <span className="text-gray-400 italic">Visual Slide (No Title)</span>}
                        </h4>
                        {banner.subtitle && (
                          <p className="text-xs text-gray-600 line-clamp-2 font-body mt-0.5">
                            {banner.subtitle}
                          </p>
                        )}
                      </div>

                      {/* CTA Info Pill */}
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between text-gray-500">
                          <span className="font-semibold text-gray-700">CTA Button:</span>
                          <span className="font-bold text-red-600">{banner.ctaText || 'None'}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <span className="font-semibold text-gray-700">Target URL:</span>
                          <span className="font-mono text-gray-800 truncate max-w-[180px]" title={banner.ctaUrl}>
                            {banner.ctaUrl || '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleStatus(banner._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          banner.isActive
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                            : 'bg-green-50 hover:bg-green-100 text-green-800'
                        }`}
                        title={banner.isActive ? 'Deactivate banner' : 'Activate banner'}
                      >
                        {banner.isActive ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                        {banner.isActive ? 'Deactivate' : 'Activate'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(banner)}
                          className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Banner"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Banner"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Banner Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          if (!uploading) setIsAddModalOpen(false);
        }}
        title="Add New Hero Banner / Slide"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          {/* File Upload Area */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Banner Media File (Image or Video) *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-500 transition-colors bg-gray-50/50">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full text-sm cursor-pointer"
                id="banner-file-input"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Supported: JPG, PNG, WEBP, MP4, WEBM. (Recommended: 1920×1080 / 16:9 ratio, max 50MB)
              </p>
            </div>

            {/* Preview */}
            {filePreview && (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 max-h-48 relative bg-black flex items-center justify-center">
                {fileType === 'video' ? (
                  <video src={filePreview} className="max-h-48 w-full object-contain" controls autoPlay muted />
                ) : (
                  <img src={filePreview} alt="Preview" className="max-h-48 w-full object-contain" />
                )}
                <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {fileType.toUpperCase()} PREVIEW
                </span>
              </div>
            )}
          </div>

          {/* Heading / Title */}
          <Input
            label="Banner Title / Heading (Optional)"
            name="title"
            placeholder="e.g. POWER YOUR FUTURE"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            hint="Leave blank if text is already embedded in your image/video"
          />

          {/* Subtitle */}
          <Input
            label="Subtitle / Tagline (Optional)"
            name="subtitle"
            placeholder="e.g. Clean Energy. Maximum Savings. Get up to ₹78,000 Subsidy."
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          />

          {/* CTA Button Text & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="CTA Button Text"
              name="ctaText"
              placeholder="e.g. REQUEST A QUOTE"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              hint="Text shown on the main hero button"
            />
            <Input
              label="CTA Button URL / Link"
              name="ctaUrl"
              placeholder="e.g. /quotation"
              value={formData.ctaUrl}
              onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
              hint="Page route or external link"
            />
          </div>

          {/* Quick Suggestions for CTA URL */}
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-500 block mb-1.5">
              Quick Link Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CTA_LINKS.map((item) => (
                <button
                  type="button"
                  key={item.url}
                  onClick={() => setFormData({ ...formData, ctaUrl: item.url, ctaText: item.label.toUpperCase() })}
                  className="text-xs bg-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-300 border border-gray-200 px-2.5 py-1 rounded-md transition-colors"
                >
                  {item.label} ({item.url})
                </button>
              ))}
            </div>
          </div>

          {/* Order & Active Toggle */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Input
              label="Display Order / Sequence"
              type="number"
              min="0"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              hint="Lower number shows first"
            />
            <div className="flex flex-col justify-center">
              <label className="text-xs font-bold text-gray-700 uppercase mb-2">Publish Status</label>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
                Active immediately on Storefront
              </label>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={uploading || !selectedFile}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <FiUploadCloud />
              {uploading ? 'Uploading Slide...' : 'Save & Publish Banner'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Banner Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          if (!uploading) setIsEditModalOpen(false);
        }}
        title={`Edit Banner Slide #${formData.order || 0}`}
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-5">
          {/* Replace File (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Replace Media File (Optional)
            </label>
            <div className="border border-gray-300 rounded-xl p-4 text-center hover:border-red-500 transition-colors bg-gray-50/50">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full text-xs cursor-pointer"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Leave empty to keep current {editingBanner?.mediaType || 'media'}
              </p>
            </div>

            {filePreview ? (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 max-h-40 bg-black flex items-center justify-center">
                {fileType === 'video' ? (
                  <video src={filePreview} className="max-h-40 w-full object-contain" controls autoPlay muted />
                ) : (
                  <img src={filePreview} alt="Preview" className="max-h-40 w-full object-contain" />
                )}
              </div>
            ) : editingBanner ? (
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-2 font-mono truncate">
                <span>Current file: {editingBanner.mediaUrl || editingBanner.imageUrl}</span>
              </div>
            ) : null}
          </div>

          {/* Heading / Title */}
          <Input
            label="Banner Title / Heading"
            name="title"
            placeholder="e.g. POWER YOUR FUTURE"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          {/* Subtitle */}
          <Input
            label="Subtitle / Tagline"
            name="subtitle"
            placeholder="e.g. Clean Energy. Maximum Savings."
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          />

          {/* CTA Button Text & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="CTA Button Text"
              name="ctaText"
              placeholder="e.g. REQUEST A QUOTE"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
            />
            <Input
              label="CTA Button URL / Link"
              name="ctaUrl"
              placeholder="e.g. /quotation"
              value={formData.ctaUrl}
              onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
            />
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
              Quick Link Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CTA_LINKS.map((item) => (
                <button
                  type="button"
                  key={item.url}
                  onClick={() => setFormData({ ...formData, ctaUrl: item.url, ctaText: item.label.toUpperCase() })}
                  className="text-xs bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 px-2 py-0.5 rounded transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order & Active Toggle */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Input
              label="Display Order / Sequence"
              type="number"
              min="0"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            />
            <div className="flex flex-col justify-center">
              <label className="text-xs font-bold text-gray-700 uppercase mb-2">Publish Status</label>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
                Active on Storefront
              </label>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={uploading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {uploading ? 'Saving Changes...' : 'Update Banner Slide'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminHomeBanner;
