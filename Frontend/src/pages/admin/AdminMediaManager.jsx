import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FiFolder, FiImage, FiVideo, FiUploadCloud, FiTrash2, FiSearch,
  FiStar, FiCheck, FiX, FiPlay, FiCopy, FiCheckCircle, FiAlertTriangle,
  FiPlus, FiRefreshCw, FiExternalLink, FiHardDrive, FiLayers, FiInfo
} from 'react-icons/fi';
import {
  getMediaAssets, uploadMediaAssets, deleteMediaAsset, toggleMediaFavorite,
  bulkMediaAction, getMediaMetrics, getMediaAlbums, createMediaAlbum, deleteMediaAlbum
} from '../../services/mediaService';
import toast from 'react-hot-toast';

const getDisplayUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  return `${backendBase}${url.startsWith('/') ? url : `/${url}`}`;
};

const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const AdminMediaManager = () => {
  // State
  const [assets, setAssets] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Filters
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [resourceType, setResourceType] = useState('all'); // all, image, video
  const [search, setSearch] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showOrphanedOnly, setShowOrphanedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selection & Bulk
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);

  // Inspector & Preview Modal
  const [activeAsset, setActiveAsset] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // New Album Modal
  const [isNewAlbumModalOpen, setIsNewAlbumModalOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch Data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 30,
        search: search.trim() || undefined,
        resourceType: resourceType !== 'all' ? resourceType : undefined,
        albumId: selectedAlbum !== 'all' && selectedAlbum !== 'favorites' && selectedAlbum !== 'orphaned' ? selectedAlbum : undefined,
        isFavorite: selectedAlbum === 'favorites' || showFavoritesOnly ? true : undefined,
        status: selectedAlbum === 'orphaned' || showOrphanedOnly ? 'ORPHANED' : undefined,
      };

      const [assetsRes, metricsRes, albumsRes] = await Promise.all([
        getMediaAssets(params),
        getMediaMetrics(),
        getMediaAlbums(),
      ]);

      setAssets(assetsRes.assets || []);
      setTotalPages(assetsRes.pages || 1);
      setMetrics(metricsRes.metrics || null);
      setAlbums(albumsRes.albums || []);
    } catch (err) {
      console.error('Failed to load media manager data:', err);
      toast.error('Could not load media library');
    } finally {
      setLoading(false);
    }
  }, [page, search, resourceType, selectedAlbum, showFavoritesOnly, showOrphanedOnly]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Multi-file Upload
  const handleUploadFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Set folder according to current album or selection
    formData.append('folder', resourceType === 'video' ? 'reels' : 'general');

    try {
      const res = await uploadMediaAssets(formData, (percent) => setUploadProgress(percent));
      toast.success(res.message || 'Files uploaded successfully');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload files');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (e, assetId) => {
    e.stopPropagation();
    try {
      const res = await toggleMediaFavorite(assetId);
      setAssets((prev) =>
        prev.map((a) => (a._id === assetId ? { ...a, isFavorite: res.asset.isFavorite } : a))
      );
      if (activeAsset && activeAsset._id === assetId) {
        setActiveAsset((prev) => ({ ...prev, isFavorite: res.asset.isFavorite }));
      }
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  // Safe Delete Asset
  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm('Are you sure you want to delete this media asset?')) return;
    try {
      const res = await deleteMediaAsset(assetId);
      if (res.success) {
        toast.success('Asset deleted successfully');
        setIsInspectorOpen(false);
        setActiveAsset(null);
        await loadData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete asset';
      toast.error(msg, { duration: 5000 });
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (!selectedIds.size) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected assets? Active referenced assets will be protected.`)) return;

    try {
      const res = await bulkMediaAction('delete', Array.from(selectedIds));
      toast.success(`Deleted ${res.result.deletedCount} asset(s). ${res.result.failedCount ? `(${res.result.failedCount} protected in use)` : ''}`);
      setSelectedIds(new Set());
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk delete failed');
    }
  };

  // Bulk Add to Album
  const handleBulkAddToAlbum = async (albumId) => {
    if (!selectedIds.size || !albumId) return;
    try {
      await bulkMediaAction('addToAlbum', Array.from(selectedIds), albumId);
      toast.success('Added to album');
      setSelectedIds(new Set());
      await loadData();
    } catch {
      toast.error('Failed to update album');
    }
  };

  // Create Album
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;

    try {
      await createMediaAlbum({ name: newAlbumName.trim(), description: newAlbumDesc.trim() });
      toast.success('Album created');
      setNewAlbumName('');
      setNewAlbumDesc('');
      setIsNewAlbumModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create album');
    }
  };

  // Delete Album
  const handleDeleteAlbum = async (albumId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this album? The media assets will remain intact.')) return;
    try {
      await deleteMediaAlbum(albumId);
      toast.success('Album deleted');
      if (selectedAlbum === albumId) setSelectedAlbum('all');
      await loadData();
    } catch {
      toast.error('Failed to delete album');
    }
  };

  // Copy helper
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Toggle selection
  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-light px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-heading text-black flex items-center gap-2.5">
            <FiHardDrive className="text-red" /> Media Manager & Reels Registry
          </h1>
          <p className="text-xs text-gray font-body mt-0.5">
            Content-Addressable storage with SHA-256 deduplication and reference tracking for Solar Reels & Assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleUploadFiles(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-red text-white px-4 py-2.5 rounded-xl font-accent text-sm font-semibold hover:bg-red-dark transition shadow-sm disabled:opacity-50"
          >
            <FiUploadCloud size={18} />
            <span>{uploading ? `Uploading (${uploadProgress}%)...` : 'Upload Media & Reels'}</span>
          </button>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-200 h-1.5 overflow-hidden">
          <div
            className="bg-red h-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Metrics Row */}
      <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-light grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-xl border border-gray-light shadow-xs">
          <span className="text-[11px] text-gray uppercase tracking-wider font-semibold">Total Assets</span>
          <p className="text-lg font-bold text-black font-heading mt-0.5">{metrics?.totalAssets || 0}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-light shadow-xs border-l-4 border-l-red">
          <span className="text-[11px] text-gray uppercase tracking-wider font-semibold flex items-center gap-1">
            <FiVideo size={12} className="text-red" /> Solar Reels / Videos
          </span>
          <p className="text-lg font-bold text-black font-heading mt-0.5">{metrics?.videoAssets || 0}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-light shadow-xs border-l-4 border-l-blue-500">
          <span className="text-[11px] text-gray uppercase tracking-wider font-semibold flex items-center gap-1">
            <FiImage size={12} className="text-blue-500" /> Images
          </span>
          <p className="text-lg font-bold text-black font-heading mt-0.5">{metrics?.imageAssets || 0}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-light shadow-xs">
          <span className="text-[11px] text-gray uppercase tracking-wider font-semibold">Storage Used</span>
          <p className="text-lg font-bold text-black font-heading mt-0.5">{formatBytes(metrics?.totalStorageBytes)}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-light shadow-xs">
          <span className="text-[11px] text-gray uppercase tracking-wider font-semibold text-green-600">Ready</span>
          <p className="text-lg font-bold text-green-600 font-heading mt-0.5">{metrics?.readyAssets || 0}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-light shadow-xs">
          <span className="text-[11px] text-gray uppercase tracking-wider font-semibold text-amber-600">Orphaned</span>
          <p className="text-lg font-bold text-amber-600 font-heading mt-0.5">{metrics?.orphanedAssets || 0}</p>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Albums & Taxonomy */}
        <aside className="w-64 border-r border-gray-light bg-white flex flex-col h-full overflow-y-auto p-4 shrink-0">
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-xs uppercase font-bold text-gray tracking-wider font-accent">Albums & Folders</h2>
            <button
              onClick={() => setIsNewAlbumModalOpen(true)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray hover:text-red transition"
              title="Create Album"
            >
              <FiPlus size={16} />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => { setSelectedAlbum('all'); setShowFavoritesOnly(false); setShowOrphanedOnly(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold font-accent transition ${
                selectedAlbum === 'all' && !showFavoritesOnly && !showOrphanedOnly
                  ? 'bg-red text-white'
                  : 'text-gray-dark hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2"><FiLayers size={14} /> All Media</span>
              <span className="text-[11px] opacity-80">{metrics?.totalAssets || 0}</span>
            </button>

            <button
              onClick={() => { setSelectedAlbum('favorites'); setShowFavoritesOnly(true); setShowOrphanedOnly(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold font-accent transition ${
                showFavoritesOnly
                  ? 'bg-red text-white'
                  : 'text-gray-dark hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2"><FiStar size={14} className="text-amber-400" /> Favorites</span>
            </button>

            <button
              onClick={() => { setSelectedAlbum('orphaned'); setShowOrphanedOnly(true); setShowFavoritesOnly(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold font-accent transition ${
                showOrphanedOnly
                  ? 'bg-red text-white'
                  : 'text-gray-dark hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2"><FiAlertTriangle size={14} className="text-amber-500" /> Orphaned (Unused)</span>
              <span className="text-[11px] opacity-80">{metrics?.orphanedAssets || 0}</span>
            </button>
          </div>

          <div className="my-3 border-t border-gray-light" />

          {/* User & Default Albums List */}
          <div className="space-y-1">
            {albums.map((album) => {
              const isSelected = selectedAlbum === album._id;
              const isReelsAlbum = album.name.toLowerCase().includes('reel');

              return (
                <div
                  key={album._id}
                  onClick={() => { setSelectedAlbum(album._id); setShowFavoritesOnly(false); setShowOrphanedOnly(false); }}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold font-accent cursor-pointer transition ${
                    isSelected
                      ? 'bg-red text-white'
                      : 'text-gray-dark hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {isReelsAlbum ? <FiVideo size={14} className={isSelected ? 'text-white' : 'text-red'} /> : <FiFolder size={14} />}
                    <span className="truncate">{album.name}</span>
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] opacity-80">{album.assetCount || 0}</span>
                    {album.createdBy !== 'system' && (
                      <button
                        onClick={(e) => handleDeleteAlbum(album._id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-300 transition"
                        title="Delete album"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center: Search, Filter & Gallery Grid */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-surface">
          {/* Action Toolbar */}
          <div className="px-6 py-3 border-b border-gray-light bg-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <div className="relative w-full max-w-md">
                <FiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                <input
                  type="text"
                  placeholder="Search by filename, hash, or folder..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-light rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red"
                />
              </div>

              {/* Resource Type Filter Pills */}
              <div className="inline-flex rounded-xl bg-gray-100 p-1 text-xs font-accent font-semibold">
                <button
                  onClick={() => setResourceType('all')}
                  className={`px-3 py-1 rounded-lg transition ${
                    resourceType === 'all' ? 'bg-white text-black shadow-xs' : 'text-gray hover:text-black'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setResourceType('image')}
                  className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                    resourceType === 'image' ? 'bg-white text-black shadow-xs' : 'text-gray hover:text-black'
                  }`}
                >
                  <FiImage size={12} /> Images
                </button>
                <button
                  onClick={() => setResourceType('video')}
                  className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                    resourceType === 'video' ? 'bg-white text-black shadow-xs' : 'text-gray hover:text-black'
                  }`}
                >
                  <FiVideo size={12} className="text-red" /> Reels
                </button>
              </div>
            </div>

            {/* Multi-Select & Batch Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsBulkMode(!isBulkMode);
                  if (isBulkMode) setSelectedIds(new Set());
                }}
                className={`px-3 py-2 rounded-xl text-xs font-accent font-semibold transition border ${
                  isBulkMode ? 'bg-black text-white border-black' : 'bg-white text-gray-dark border-gray-light hover:bg-gray-50'
                }`}
              >
                {isBulkMode ? 'Cancel Selection' : 'Multi-Select'}
              </button>

              {isBulkMode && selectedIds.size > 0 && (
                <div className="flex items-center gap-2 animate-fadeIn">
                  <span className="text-xs font-bold text-black">{selectedIds.size} selected</span>

                  {/* Album dropdown */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleBulkAddToAlbum(e.target.value);
                      e.target.value = '';
                    }}
                    className="px-2.5 py-1.5 border border-gray-light rounded-xl text-xs bg-white text-gray-dark"
                  >
                    <option value="">Move to Album...</option>
                    {albums.map((a) => (
                      <option key={a._id} value={a._id}>📁 {a.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center gap-1 bg-red/10 text-red hover:bg-red hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              )}

              <button
                onClick={loadData}
                className="p-2 text-gray hover:text-black hover:bg-gray-100 rounded-xl transition"
                title="Refresh"
              >
                <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Media Grid / Dropzone */}
          <div
            className={`flex-1 overflow-y-auto p-6 relative ${isDragging ? 'bg-red/5 ring-4 ring-red/30' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleUploadFiles(e.dataTransfer.files);
            }}
          >
            {isDragging && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs border-2 border-dashed border-red rounded-2xl m-4 pointer-events-none">
                <FiUploadCloud className="w-16 h-16 text-red animate-bounce" />
                <h3 className="text-lg font-bold text-black mt-3">Drop files to upload</h3>
                <p className="text-xs text-gray mt-1">Automatic SHA-256 deduplication will be applied</p>
              </div>
            )}

            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-gray gap-2">
                <FiRefreshCw className="w-8 h-8 animate-spin text-red" />
                <p className="text-xs font-accent">Loading media registry...</p>
              </div>
            ) : assets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center text-gray mb-4">
                  {resourceType === 'video' ? <FiVideo size={36} className="text-red" /> : <FiImage size={36} />}
                </div>
                <h3 className="text-base font-bold text-black font-heading">No media assets found</h3>
                <p className="text-xs text-gray max-w-sm mt-1 mb-4 font-body">
                  Drag and drop files here or click the upload button to add images and video reels.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-red text-white px-5 py-2.5 rounded-xl text-xs font-accent font-semibold hover:bg-red-dark transition"
                >
                  <FiUploadCloud size={16} /> Upload Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {assets.map((asset) => {
                  const isVideo = asset.resourceType === 'video';
                  const isSelected = selectedIds.has(asset._id);
                  const isOrphaned = asset.status === 'ORPHANED';
                  const usageCount = asset.usageCount || (asset.references?.length || 0);
                  const fileUrl = getDisplayUrl(asset.secureUrl);

                  return (
                    <div
                      key={asset._id}
                      onClick={() => {
                        if (isBulkMode) toggleSelect(asset._id);
                        else {
                          setActiveAsset(asset);
                          setIsInspectorOpen(true);
                        }
                      }}
                      className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-white border-2 transition-all shadow-xs ${
                        isSelected
                          ? 'border-red ring-3 ring-red/20 scale-[0.98]'
                          : 'border-gray-light hover:border-red/40 hover:shadow-lg'
                      }`}
                    >
                      {/* Media Thumbnail */}
                      {isVideo ? (
                        <div className="w-full h-full relative bg-gray-950 flex items-center justify-center">
                          <video
                            src={fileUrl}
                            className="w-full h-full object-cover pointer-events-none opacity-85 group-hover:opacity-100 transition"
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition">
                            <div className="w-10 h-10 rounded-full bg-red text-white flex items-center justify-center shadow-xl transform group-hover:scale-115 transition">
                              <FiPlay size={16} className="ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                            <FiVideo size={11} className="text-red" /> REEL
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

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                        {isOrphaned && (
                          <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs" title="Unlinked asset">
                            ORPHAN
                          </span>
                        )}
                        {usageCount > 0 && (
                          <span className="bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs" title={`${usageCount} active references`}>
                            {usageCount} refs
                          </span>
                        )}
                      </div>

                      {/* Top Right Controls */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                        <button
                          onClick={(e) => handleToggleFavorite(e, asset._id)}
                          className={`p-1.5 rounded-full backdrop-blur-xs transition ${
                            asset.isFavorite ? 'bg-amber-400 text-white' : 'bg-black/40 text-white hover:bg-amber-400 opacity-0 group-hover:opacity-100'
                          }`}
                          title="Favorite"
                        >
                          <FiStar size={12} fill={asset.isFavorite ? 'currentColor' : 'none'} />
                        </button>

                        {isBulkMode && (
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition ${
                            isSelected ? 'bg-red border-red text-white' : 'border-white bg-black/40'
                          }`}>
                            {isSelected && <FiCheck size={14} className="stroke-[3]" />}
                          </div>
                        )}
                      </div>

                      {/* Bottom Overlay Info */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 text-white opacity-0 group-hover:opacity-100 transition duration-200">
                        <p className="text-[11px] font-semibold truncate">{asset.originalFilename || 'Media Asset'}</p>
                        <div className="flex items-center justify-between text-[10px] text-gray-300 mt-0.5">
                          <span>{formatBytes(asset.fileSize)}</span>
                          <span className="uppercase">{asset.format || asset.resourceType}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Asset Inspector & Video Player Modal */}
      {isInspectorOpen && activeAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden border border-gray-light">
            {/* Left Preview Section */}
            <div className="md:w-3/5 bg-gray-950 flex flex-col items-center justify-center relative p-4 min-h-[300px]">
              {activeAsset.resourceType === 'video' ? (
                <video
                  src={getDisplayUrl(activeAsset.secureUrl)}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-full rounded-xl object-contain shadow-2xl"
                />
              ) : (
                <img
                  src={getDisplayUrl(activeAsset.secureUrl)}
                  alt={activeAsset.originalFilename}
                  className="max-h-[70vh] w-full object-contain rounded-xl"
                />
              )}
            </div>

            {/* Right Details Section */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-white">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-accent uppercase bg-red/10 text-red mb-1">
                      {activeAsset.resourceType === 'video' ? '🎬 Solar Reel' : '🖼️ Image Asset'}
                    </span>
                    <h3 className="text-base font-bold text-black truncate max-w-[240px] font-heading">
                      {activeAsset.originalFilename || 'Asset Details'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsInspectorOpen(false)}
                    className="p-1.5 text-gray hover:text-black rounded-xl hover:bg-gray-100 transition"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <div className="space-y-3 text-xs font-body">
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-light">
                    <span className="text-gray">Status:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      activeAsset.status === 'READY' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {activeAsset.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-light">
                    <span className="text-gray">File Size:</span>
                    <span className="font-semibold text-black">{formatBytes(activeAsset.fileSize)}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-light">
                    <span className="text-gray">Storage:</span>
                    <span className="font-semibold uppercase text-black">{activeAsset.storageProvider || 'Local'}</span>
                  </div>

                  {activeAsset.width && activeAsset.height && (
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-light">
                      <span className="text-gray">Dimensions:</span>
                      <span className="font-semibold text-black">{activeAsset.width} × {activeAsset.height}</span>
                    </div>
                  )}

                  {/* Content Hash (CAS) */}
                  <div className="py-2 border-b border-gray-light">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray font-semibold flex items-center gap-1">
                        <FiCheckCircle size={12} className="text-green-600" /> SHA-256 Hash
                      </span>
                      <button
                        onClick={() => handleCopy(activeAsset.contentHash, 'SHA-256 Hash')}
                        className="text-red hover:underline text-[11px] font-accent flex items-center gap-1"
                      >
                        <FiCopy size={11} /> Copy
                      </button>
                    </div>
                    <p className="font-mono text-[10px] text-gray break-all bg-gray-50 p-2 rounded-lg border border-gray-light">
                      {activeAsset.contentHash}
                    </p>
                  </div>

                  {/* Active References Tracking */}
                  <div className="py-2">
                    <span className="text-gray font-semibold block mb-1.5">
                      Active References ({activeAsset.references?.length || 0})
                    </span>
                    {activeAsset.references && activeAsset.references.length > 0 ? (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {activeAsset.references.map((ref, idx) => (
                          <div key={idx} className="bg-gray-50 p-2 rounded-lg border border-gray-light flex items-center justify-between">
                            <div>
                              <span className="font-bold text-black font-accent">{ref.entityType}</span>
                              <span className="text-gray text-[10px] block truncate max-w-[160px]">ID: {ref.entityId} ({ref.field || 'media'})</span>
                            </div>
                            <span className="text-[10px] bg-red/10 text-red px-1.5 py-0.5 rounded font-semibold">Active</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 text-[11px] flex items-center gap-2">
                        <FiAlertTriangle size={14} className="shrink-0" />
                        <span>No active references. This asset is marked as ORPHANED and can be safely deleted.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions in Inspector */}
              <div className="pt-4 border-t border-gray-light flex items-center gap-2">
                <button
                  onClick={() => handleCopy(getDisplayUrl(activeAsset.secureUrl), 'Media URL')}
                  className="flex-1 py-2 rounded-xl border border-gray-light text-black hover:bg-gray-50 text-xs font-accent font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <FiCopy size={14} /> Copy URL
                </button>
                <button
                  onClick={() => handleDeleteAsset(activeAsset._id)}
                  className="py-2 px-3 rounded-xl bg-red/10 text-red hover:bg-red hover:text-white text-xs font-accent font-semibold transition flex items-center gap-1"
                  title="Safe Delete"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Album Modal */}
      {isNewAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-light">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-black font-heading flex items-center gap-2">
                <FiFolder className="text-red" /> Create New Album
              </h3>
              <button onClick={() => setIsNewAlbumModalOpen(false)} className="text-gray hover:text-black">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div>
                <label className="block text-xs font-accent font-bold text-black mb-1">Album Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Commercial Projects"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-light rounded-xl text-xs font-body focus:ring-2 focus:ring-red/20 focus:border-red"
                />
              </div>

              <div>
                <label className="block text-xs font-accent font-bold text-black mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional description"
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-light rounded-xl text-xs font-body focus:ring-2 focus:ring-red/20 focus:border-red"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewAlbumModalOpen(false)}
                  className="px-4 py-2 text-xs font-accent font-semibold text-gray hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-accent font-bold bg-red text-white hover:bg-red-dark rounded-xl transition"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMediaManager;
