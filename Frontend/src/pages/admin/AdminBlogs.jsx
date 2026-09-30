import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { FiFileText as FiBlogIcon, FiPlus as PlusIcon, FiEye as EyeIcon, FiEdit2 as EditIcon, FiTrash2 as TrashIcon, FiCopy as CopyIcon, FiCalendar as CalendarIcon, FiArchive as ArchiveIcon, FiCheckCircle as CheckIcon, FiSearch as SearchIcon, FiClock as ClockIcon, FiTrendingUp as ViewsIcon } from 'react-icons/fi';
import { formatDate } from '../../utils/blogHelpers';

const AdminBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    scheduled: 0,
    archived: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Schedule Modal
  const [schedulingBlogId, setSchedulingBlogId] = useState(null);
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAdminBlogs({
        status: activeTab,
        search: searchQuery,
        page,
        limit: 10
      });
      setBlogs(data.blogs);
      if (data.stats) setStats(data.stats);
      if (data.pagination) setTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [activeTab, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  const handlePublish = async (id) => {
    try {
      await blogService.publishBlog(id);
      toast.success('Blog published!');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to publish');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await blogService.unpublishBlog(id);
      toast.success('Blog reverted to draft');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to unpublish');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await blogService.duplicateBlog(id);
      toast.success('Blog duplicated as a new draft!');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to duplicate blog');
    }
  };

  const handleArchive = async (id) => {
    try {
      await blogService.archiveBlog(id);
      toast.success('Blog archived');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to archive blog');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this blog?')) return;
    try {
      await blogService.deleteBlog(id);
      toast.success('Blog deleted permanently');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledDateTime) return;
    try {
      await blogService.scheduleBlog(schedulingBlogId, scheduledDateTime);
      toast.success('Blog publishing scheduled!');
      setSchedulingBlogId(null);
      setScheduledDateTime('');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to schedule blog');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded">PUBLISHED</span>;
      case 'DRAFT':
        return <span className="bg-gray-200 text-gray-800 text-xs font-bold px-2.5 py-1 rounded">DRAFT</span>;
      case 'SCHEDULED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded">SCHEDULED</span>;
      case 'ARCHIVED':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded">ARCHIVED</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading flex items-center">
            <FiBlogIcon className="mr-3 text-red" /> Blog Management System
          </h2>
          <p className="text-gray text-sm">Create, schedule, edit and publish solar energy articles</p>
        </div>
        <Link to="/admin/blogs/create">
          <Button variant="primary" className="flex items-center text-sm px-5 py-2.5">
            <PlusIcon className="mr-2" /> Write New Article
          </Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 text-center border-l-4 border-l-black">
          <div className="text-2xl font-heading font-bold">{stats.total}</div>
          <div className="text-xs text-gray uppercase tracking-wider font-accent mt-1">Total Blogs</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-green-600">
          <div className="text-2xl font-heading font-bold text-green-600">{stats.published}</div>
          <div className="text-xs text-gray uppercase tracking-wider font-accent mt-1">Published</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-gray-400">
          <div className="text-2xl font-heading font-bold text-gray">{stats.drafts}</div>
          <div className="text-xs text-gray uppercase tracking-wider font-accent mt-1">Drafts</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-blue-600">
          <div className="text-2xl font-heading font-bold text-blue-600">{stats.scheduled}</div>
          <div className="text-xs text-gray uppercase tracking-wider font-accent mt-1">Scheduled</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-yellow-600">
          <div className="text-2xl font-heading font-bold text-yellow-600">{stats.archived}</div>
          <div className="text-xs text-gray uppercase tracking-wider font-accent mt-1">Archived</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-red">
          <div className="text-2xl font-heading font-bold text-red">{stats.totalViews}</div>
          <div className="text-xs text-gray uppercase tracking-wider font-accent mt-1">Total Views</div>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED', 'ARCHIVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`px-4 py-2 text-xs font-accent font-bold uppercase tracking-wider rounded transition-colors ${
                activeTab === tab
                  ? 'bg-black text-white'
                  : 'bg-surface text-gray hover:text-black hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-72">
          <input
            type="text"
            className="w-full border border-gray-light text-sm p-2 rounded focus:outline-none focus:border-red"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="secondary" className="px-3">
            <SearchIcon />
          </Button>
        </form>
      </Card>

      {/* Blog Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-4 px-4 font-accent text-xs uppercase">Thumbnail</th>
                <th className="py-4 px-4 font-accent text-xs uppercase">Article Title</th>
                <th className="py-4 px-4 font-accent text-xs uppercase">Category</th>
                <th className="py-4 px-4 font-accent text-xs uppercase">Status</th>
                <th className="py-4 px-4 font-accent text-xs uppercase">Date</th>
                <th className="py-4 px-4 font-accent text-xs uppercase">Views</th>
                <th className="py-4 px-4 font-accent text-xs uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-light">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray">
                    Loading articles...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray">
                    No blog articles found
                  </td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-surface transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <img
                        src={b.featuredImage?.url || 'https://images.unsplash.com/photo-1509391366360-5157625bf958?w=150'}
                        alt={b.title}
                        className="w-14 h-10 object-cover rounded border border-gray-light"
                      />
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4 font-bold text-black max-w-xs truncate">
                      <div className="truncate">{b.title}</div>
                      <div className="text-xs font-mono text-gray font-normal">/{b.slug}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-xs bg-gray-100 font-accent px-2 py-0.5 rounded border border-gray-200">
                        {b.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">{getStatusBadge(b.status)}</td>

                    {/* Date */}
                    <td className="py-3 px-4 text-xs text-gray">
                      {b.status === 'SCHEDULED' && b.scheduledAt ? (
                        <span className="text-blue-600 font-semibold flex items-center">
                          <ClockIcon className="mr-1 inline" /> {formatDate(b.scheduledAt)}
                        </span>
                      ) : (
                        formatDate(b.publishedAt || b.createdAt)
                      )}
                    </td>

                    {/* Views */}
                    <td className="py-3 px-4 font-mono text-xs font-semibold">
                      <ViewsIcon className="inline mr-1 text-gray" /> {b.views || 0}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-2">
                      {/* Preview */}
                      <Link
                        to={`/admin/blogs/${b._id}/preview`}
                        className="p-1.5 inline-block text-gray hover:text-black"
                        title="Preview"
                      >
                        <EyeIcon size={16} />
                      </Link>

                      {/* Edit */}
                      <Link
                        to={`/admin/blogs/${b._id}/edit`}
                        className="p-1.5 inline-block text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <EditIcon size={16} />
                      </Link>

                      {/* Publish / Unpublish */}
                      {b.status === 'PUBLISHED' ? (
                        <button
                          onClick={() => handleUnpublish(b._id)}
                          className="p-1.5 text-yellow-600 hover:text-yellow-800"
                          title="Unpublish (Save as Draft)"
                        >
                          <ArchiveIcon size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(b._id)}
                          className="p-1.5 text-green-600 hover:text-green-800"
                          title="Publish Now"
                        >
                          <CheckIcon size={16} />
                        </button>
                      )}

                      {/* Schedule */}
                      <button
                        onClick={() => setSchedulingBlogId(b._id)}
                        className="p-1.5 text-blue-600 hover:text-blue-800"
                        title="Schedule Publication"
                      >
                        <CalendarIcon size={16} />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(b._id)}
                        className="p-1.5 text-purple-600 hover:text-purple-800"
                        title="Duplicate"
                      >
                        <CopyIcon size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-1.5 text-red hover:text-red-700"
                        title="Delete Permanently"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Schedule Modal */}
      {schedulingBlogId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-sm w-full rounded-card p-6 space-y-4 border border-gray-light">
            <h3 className="text-xl font-heading flex items-center">
              <CalendarIcon className="mr-2 text-red" /> Schedule Publication
            </h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full border border-gray-light p-2.5 rounded focus:outline-none focus:border-red"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setSchedulingBlogId(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Confirm Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
