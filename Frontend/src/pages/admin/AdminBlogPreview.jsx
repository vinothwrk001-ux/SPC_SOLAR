import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import { formatDate, sanitizeHTML } from '../../utils/blogHelpers';
import SEOHead from '../../components/ui/SEOHead';
import { FiArrowLeft, FiTag, FiClock, FiUser } from 'react-icons/fi';

const AdminBlogPreview = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogService.getBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-gray">Loading preview...</div>;
  if (!blog) return <div className="p-12 text-center text-gray">Blog article not found</div>;

  return (
    <div className="bg-bg min-h-screen pb-20">
      <SEOHead title={`PREVIEW: ${blog.title}`} description="Admin preview mode" />

      {/* Admin Warning Bar */}
      <div className="bg-yellow-500 text-black px-4 py-2 font-accent text-xs font-bold text-center tracking-wider sticky top-0 z-50">
        ⚠️ ADMIN PREVIEW MODE — Status: <span className="underline">{blog.status}</span> (Not publicly visible unless published)
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/admin/blogs"
          className="inline-flex items-center text-gray hover:text-red font-accent font-semibold text-sm mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Admin Dashboard
        </Link>

        <span className="bg-red text-white text-xs font-accent font-bold px-3 py-1 uppercase tracking-wider rounded-sm inline-block mb-4">
          {blog.category}
        </span>

        <h1 className="text-4xl md:text-5xl font-heading mb-4 leading-tight">{blog.title}</h1>
        {blog.subtitle && <p className="text-xl text-gray mb-6 font-body">{blog.subtitle}</p>}

        <div className="flex flex-wrap items-center space-x-6 text-sm text-gray font-accent mb-8 border-b border-gray-light pb-4">
          <div className="flex items-center"><FiUser className="mr-1.5 text-red" /> {blog.author?.name || 'SPC Solar Expert'}</div>
          <div className="flex items-center"><FiClock className="mr-1.5 text-red" /> {blog.readingTime || 3} min read</div>
          <div>{formatDate(blog.publishedAt || blog.createdAt)}</div>
        </div>

        {blog.featuredImage?.url && (
          <img
            src={blog.featuredImage.url}
            alt={blog.featuredImage.alt || blog.title}
            className="w-full h-[400px] object-cover rounded-card mb-10 border border-gray-light"
          />
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-black font-body leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(blog.content) }}
        />
      </div>
    </div>
  );
};

export default AdminBlogPreview;
