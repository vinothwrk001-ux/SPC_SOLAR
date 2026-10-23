import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import SEOHead from '../../components/ui/SEOHead';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import { getBreadcrumbSchema } from '../../components/seo/schemas';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { blogService } from '../../services/blogService';
import { formatDate, sanitizeHTML, generateArticleSchema, generateFAQSchema, getImageUrl } from '../../utils/blogHelpers';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiCalendar,
  FiTag,
  FiClock,
  FiUser,
  FiShare2,
  FiCopy,
  FiList,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
  FiEye
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaTelegramPlane } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const BlogDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getPublicBlogBySlug(slug, isPreview);
        setBlog(data);
      } catch (err) {
        setError('Blog article not found or not published.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug, isPreview]);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success('Article link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="bg-bg min-h-screen pb-20 pt-36 sm:pt-40 lg:pt-44 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-[360px] md:h-[450px] bg-gray-200 rounded-2xl w-full" />
          <div className="space-y-3 pt-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-bg min-h-screen pt-36 sm:pt-40 pb-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-card border border-gray-light">
          <h2 className="text-2xl font-heading mb-4">Article Not Found</h2>
          <p className="text-gray text-sm mb-6">{error || 'The requested article could not be loaded.'}</p>
          <Link to="/blog">
            <Button variant="primary">Return to Blog Listing</Button>
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Blog', to: '/blog' },
    ...(blog.category ? [{ 
      label: blog.category.name || 'Category', 
      to: `/blog/category/${blog.category.slug || encodeURIComponent(blog.category.name || '')}` 
    }] : []),
    { label: blog.title }
  ];

  const breadcrumbSchema = getBreadcrumbSchema([
    { label: 'Blog', to: '/blog' },
    ...(blog.category ? [{ 
      label: blog.category.name || 'Category', 
      to: `/blog/category/${blog.category.slug || encodeURIComponent(blog.category.name || '')}` 
    }] : []),
    { label: blog.title, to: `/blog/${blog.slug || slug}` }
  ]);

  const articleSchema = generateArticleSchema(blog);
  const faqSchema = generateFAQSchema(blog.faq);
  const combinedSchemas = [breadcrumbSchema, articleSchema, faqSchema].filter(Boolean);

  return (
    <div className="bg-bg min-h-screen pb-20">
      <SEOHead
        title={blog.seo?.metaTitle || `${blog.title} | SPC Solar`}
        description={blog.seo?.metaDescription || blog.excerpt || blog.title}
        canonical={`/blog/${blog.slug || slug}`}
        image={getImageUrl(blog.featuredImage || blog.mainImage)}
        ogImage={getImageUrl(blog.featuredImage || blog.mainImage)}
        ogType="article"
        keywords={blog.tags && blog.tags.length > 0 ? blog.tags : ['solar energy', 'spc solar', 'solar guide']}
        article={{
          publishedTime: blog.createdAt,
          modifiedTime: blog.updatedAt,
          author: blog.author || 'SPC Solar Expert',
          tags: blog.tags
        }}
        schema={combinedSchemas}
      />

      {/* Admin Preview Mode Banner */}
      {isPreview && (
        <div className="bg-yellow-500 text-black px-4 py-2 font-accent text-xs font-bold text-center tracking-wider sticky top-0 z-50">
          ⚠️ ADMIN PREVIEW MODE — Article Status: <span className="underline">{blog.status}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto px-3.5 sm:px-6 lg:px-8 pt-36 sm:pt-40 lg:pt-44">
        {/* Visual Breadcrumb Navigation */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs items={breadcrumbItems} variant="light" />
        </div>
        {/* Category & Title Header */}
        <div className="mb-6 sm:mb-10 relative">
          {/* Back Button (On mobile: compact button above title; On desktop: absolute on the left) */}
          <div className="mb-3 sm:mb-4 lg:mb-0">
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/blog');
                }
              }}
              className="lg:absolute lg:-left-16 xl:-left-20 2xl:-left-24 lg:top-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:text-red hover:border-red hover:bg-red-50 transition-all shadow-sm flex items-center justify-center cursor-pointer group z-10"
              title="Go Back"
              aria-label="Back"
            >
              <FiArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[42px] font-bold leading-[1.3] text-[#1A1A1A] mb-3 sm:mb-4">
            {blog.title}
          </h1>

          {/* Author & Meta Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
            <div className="flex items-center flex-wrap gap-2">
              <img
                src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author?.name || 'SPC Solar')}&background=0D8ABC&color=fff`}
                alt={blog.author?.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
              />
              <span className="font-bold text-[#1A1A1A]">{blog.author?.name || 'SPC Solar Expert'}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 text-[11px] sm:text-xs">{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3.5 text-[11px] sm:text-xs text-gray-500">
              <span className="flex items-center">
                <FiEye className="mr-1 sm:mr-1.5" /> {blog.views || 0} Reads
              </span>
              <span className="flex items-center">
                <FiClock className="mr-1 sm:mr-1.5" /> {blog.readingTime || 3} mins
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left Column (Sidebar) */}
          <div className="lg:w-1/4 flex-shrink-0 order-2 lg:order-1">
            <div className="sticky top-24 space-y-5 sm:space-y-8">
              {/* Share on */}
              <div>
                <h4 className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 font-medium">Share on</h4>
                <div className="flex flex-wrap gap-2">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition" aria-label="Share on Facebook">
                    <FaFacebook size={14} />
                  </a>
                  <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + currentUrl)}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition" aria-label="Share on WhatsApp">
                    <FaWhatsapp size={14} />
                  </a>
                  <a href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center hover:bg-blue-100 transition" aria-label="Share on Telegram">
                    <FaTelegramPlane size={14} />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center hover:bg-gray-200 transition" aria-label="Share on X">
                    <FaXTwitter size={14} />
                  </a>
                  <button onClick={handleCopyLink} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition" aria-label="Copy link">
                    <FiCopy size={14} />
                  </button>
                </div>
              </div>

              {/* In this article (TOC) */}
              {blog.toc && blog.toc.length > 0 && (
                <div className="bg-[#F4F6FB] p-3.5 sm:p-5 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-sm sm:text-base text-[#1A1A1A] mb-3 sm:mb-4 flex items-center">
                    <span className="mr-2 text-red font-bold">-</span> In this article
                  </h4>
                  <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-[#1A1A1A]">
                    {blog.toc.map((item, idx) => (
                      <li key={idx} className={item.level === 3 ? 'ml-3 list-disc list-inside' : 'list-disc list-inside'}>
                        <a href={`#${item.id}`} className="hover:text-red transition-colors">
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Content) */}
          <div className="lg:w-3/4 order-1 lg:order-2">
            {/* Main Image */}
            <div className="mb-5 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
              <img
                src={getImageUrl(blog.mainImage?.url || blog.featuredImage?.url) || 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=1200'}
                alt={blog.mainImage?.alt || blog.featuredImage?.alt || blog.title}
                className="w-full h-auto object-cover max-h-[480px]"
              />
            </div>

            {/* Body Content */}
            <div
              className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-gray-700 font-sans leading-relaxed space-y-4 sm:space-y-6 prose-headings:font-bold prose-headings:text-[#1A1A1A] prose-a:text-red hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-l-4 prose-blockquote:border-red prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(blog.content) }}
            />

            {/* FAQ Section */}
            {blog.faq && blog.faq.length > 0 && (
              <div className="mt-8 sm:mt-14 pt-6 sm:pt-8 border-t border-gray-200 space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-2xl font-bold text-[#1A1A1A]">FREQUENTLY ASKED QUESTIONS</h3>
                <div className="space-y-3 sm:space-y-4">
                  {blog.faq.map((faq, index) => (
                    <Card
                      key={index}
                      className="p-3.5 sm:p-4 cursor-pointer hover:border-gray-400 transition-colors shadow-sm rounded-xl"
                      onClick={() => toggleFaq(index)}
                    >
                      <div className="flex justify-between items-center font-bold text-sm sm:text-base md:text-lg text-[#1A1A1A]">
                        <span>{faq.question}</span>
                        {openFaqIndex === index ? <FiChevronUp className="text-gray-500 flex-shrink-0 ml-2" /> : <FiChevronDown className="text-gray-500 flex-shrink-0 ml-2" />}
                      </div>
                      {openFaqIndex === index && (
                        <div className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
                          {faq.answer}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio Card */}
            <div className="p-4 sm:p-6 mt-8 sm:mt-12 bg-gray-50 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-6 rounded-xl border border-gray-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author?.name || 'SPC Solar')}&background=0D8ABC&color=fff`}
                  alt={blog.author?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-base sm:text-lg text-[#1A1A1A]">{blog.author?.name || 'SPC Solar Team'}</h4>
                <p className="text-[11px] sm:text-xs text-red font-bold uppercase mb-1">Solar Energy Specialist</p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {blog.author?.bio || 'Consultant and engineer with expertise in commercial & residential solar power installations, net metering policies, and government rooftop subsidies.'}
                </p>
              </div>
            </div>

            {/* Related Articles */}
            {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
              <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-2xl font-bold text-[#1A1A1A]">RELATED ARTICLES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6">
                  {blog.relatedBlogs.map((rel) => (
                    <Link to={`/blog/${rel.slug}`} key={rel._id} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                      {(rel.featuredImage || rel.thumbnailImage) && (
                        <img src={getImageUrl(rel.featuredImage || rel.thumbnailImage)} alt={rel.title} className="w-full h-36 sm:h-40 object-cover" />
                      )}
                      <div className="p-3.5 sm:p-4 flex flex-col flex-grow">
                        <span className="text-[10px] text-red font-bold uppercase mb-1">{rel.category}</span>
                        <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] line-clamp-2 mt-1 mb-2 group-hover:text-red transition-colors">
                          {rel.title}
                        </h4>
                        <span className="mt-auto inline-flex items-center text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Read Guide <FiArrowRight className="ml-1" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
