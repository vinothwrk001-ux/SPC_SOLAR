import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiSearch, FiUploadCloud, FiX, FiCheck, FiVideo, FiImage, 
  FiFolder, FiPlay, FiRefreshCw, FiAlertCircle 
} from 'react-icons/fi';
import { getMediaAssets, uploadMediaAssets, getMediaAlbums } from '../../services/mediaService';

const getDisplayUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  return `${backendBase}${url.startsWith('/') ? url : `/${url}`}`;
};

export const MediaPickerModal = ({
  isOpen,
  onClose,
  onSelect,
  maxSelect = 1,
  resourceType: initialResourceType = 'all',
  title = 'Media Library',
  folder = 'general',
}) => {
  const [assets, setAssets] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [resourceType, setResourceType] = useState(initialResourceType);
  const [uploadError, setUploadError] = useState('');

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        limit: 48,
        search: search.trim() || undefined,
        albumId: selectedAlbum || undefined,
        resourceType: resourceType !== 'all' ? resourceType : undefined,
      };
      const res = await getMediaAssets(params);
      setAssets(res.assets || []);
    } catch (err) {
      console.error('Failed to fetch media assets:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedAlbum, resourceType]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set());
      setResourceType(initialResourceType);
      fetchAssets();
      getMediaAlbums()
        .then((res) => setAlbums(res.albums || []))
        .catch(() => {});
    }
  }, [isOpen, initialResourceType, fetchAssets]);

  const toggleSelect = (asset) => {
    const next = new Set(selectedIds);
    if (next.has(asset._id)) {
      next.delete(asset._id);
    } else {
      if (maxSelect === 1) next.clear();
      else if (next.size >= maxSelect) return;
      next.add(asset._id);
    }
    setSelectedIds(next);
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError('');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('folder', folder);

    try {
      const res = await uploadMediaAssets(formData, (percent) => setUploadProgress(percent));
      await fetchAssets();
      // If single selection, auto-select the first newly uploaded asset
      if (maxSelect === 1 && res.assets?.[0]?._id) {
        setSelectedIds(new Set([res.assets[0]._id]));
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleConfirm = () => {
    const selected = assets.filter((a) => selectedIds.has(a._id));
    if (selected.length > 0) {
      onSelect(maxSelect === 1 ? selected[0] : selected);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red/10 text-red flex items-center justify-center font-bold">
              {resourceType === 'video' ? <FiVideo size={20} /> : <FiImage size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-500">
                {resourceType === 'video' ? 'Select or upload video reels (.mp4, .webm, .mov)' : 'Select or upload media assets'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 bg-red text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red/90 transition shadow-sm disabled:opacity-50">
              <FiUploadCloud size={16} />
              <span>{uploading ? `Uploading (${uploadProgress}%)...` : 'Upload New'}</span>
              <input
                type="file"
                multiple={maxSelect > 1}
                accept={resourceType === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/*,video/*'}
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Upload Progress Bar & Error Alert */}
        {uploading && (
          <div className="w-full bg-gray-200 h-1.5 overflow-hidden">
            <div
              className="bg-red h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        {uploadError && (
          <div className="px-6 py-2.5 bg-red/10 border-b border-red/20 text-red text-xs flex items-center gap-2">
            <FiAlertCircle size={16} />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 min-w-[220px]">
            <FiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search filename or hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Resource Type Filter */}
            <div className="inline-flex rounded-xl bg-gray-100 p-1 text-xs">
              <button
                onClick={() => setResourceType('all')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  resourceType === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setResourceType('image')}
                className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                  resourceType === 'image' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <FiImage size={12} /> Images
              </button>
              <button
                onClick={() => setResourceType('video')}
                className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                  resourceType === 'video' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <FiVideo size={12} /> Reels
              </button>
            </div>

            {/* Album selector */}
            <select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red/20"
            >
              <option value="">All Albums</option>
              {albums.map((album) => (
                <option key={album._id} value={album._id}>
                  📁 {album.name} ({album.assetCount || 0})
                </option>
              ))}
            </select>

            <button
              onClick={fetchAssets}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
              title="Refresh"
            >
              <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <FiRefreshCw className="w-8 h-8 animate-spin text-red" />
              <p className="text-xs">Loading media assets...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                {resourceType === 'video' ? <FiVideo size={28} /> : <FiFolder size={28} />}
              </div>
              <h3 className="text-sm font-bold text-gray-800">No media assets found</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1">
                {search ? 'Try clearing your search query' : 'Upload your first image or video reel using the button above.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {assets.map((asset) => {
                const isSelected = selectedIds.has(asset._id);
                const isVideo = asset.resourceType === 'video';
                const fileUrl = getDisplayUrl(asset.secureUrl);

                return (
                  <div
                    key={asset._id}
                    onClick={() => toggleSelect(asset)}
                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-white shadow-xs ${
                      isSelected
                        ? 'border-red ring-2 ring-red/30 scale-[0.98]'
                        : 'border-gray-200 hover:border-red/50 hover:shadow-md'
                    }`}
                  >
                    {isVideo ? (
                      <div className="w-full h-full relative bg-gray-900 flex items-center justify-center">
                        <video
                          src={fileUrl}
                          className="w-full h-full object-cover pointer-events-none opacity-80 group-hover:opacity-100 transition"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition">
                          <div className="w-8 h-8 rounded-full bg-red text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                            <FiPlay size={14} className="ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <FiVideo size={10} /> REEL
                        </span>
                      </div>
                    ) : (
                      <img
                        src={fileUrl}
                        alt={asset.originalFilename}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    )}

                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-red text-white rounded-full p-1 shadow-md">
                        <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Filename & size overlay on hover */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition duration-200">
                      <p className="text-[11px] font-medium truncate">{asset.originalFilename || 'Media'}</p>
                      <p className="text-[9px] text-gray-300">
                        {asset.fileSize ? `${(asset.fileSize / (1024 * 1024)).toFixed(1)} MB` : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <div className="text-xs text-gray-500 font-medium">
            <span className="font-bold text-gray-900">{selectedIds.size}</span> of {maxSelect} asset(s) selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedIds.size === 0}
              className="px-6 py-2 text-xs font-bold bg-red text-white rounded-xl hover:bg-red/90 disabled:opacity-40 transition shadow-sm flex items-center gap-1.5"
            >
              <FiCheck size={14} /> Insert Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
