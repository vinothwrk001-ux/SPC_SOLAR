import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import SEOHead from '../../components/ui/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { blogService } from '../../services/blogService';
import { formatDate, sanitizeHTML, generateArticleSchema, generateFAQSchema } from '../../utils/blogHelpers';
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
  FiArrowRight
} from 'react-icons/fi';
import { FaWhatsapp, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa';

const BlogDetailPage = () => {
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
      <div className="bg-bg min-h-screen py-20 text-center text-gray">
        Loading article details...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-bg min-h-screen py-20 text-center">
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

  const articleSchema = generateArticleSchema(blog);
  const faqSchema = generateFAQSchema(blog.faq);

  return (
    <div className="bg-bg min-h-screen pb-20">
      <SEOHead
        title={blog.seo?.metaTitle || `${blog.title} | SPC Solar`}
        description={blog.seo?.metaDescription || blog.excerpt || blog.title}
      />

      {/* Structured Data JSON-LD */}
      {articleSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      )}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* Admin Preview Mode Banner */}
      {isPreview && (
        <div className="bg-yellow-500 text-black px-4 py-2 font-accent text-xs font-bold text-center tracking-wider sticky top-0 z-50">
          ⚠️ ADMIN PREVIEW MODE — Article Status: <span className="underline">{blog.status}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-accent text-gray mb-6 flex-wrap">
          <Link to="/" className="hover:text-red">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-red">Blog</Link>
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-xs">{blog.title}</span>
        </nav>

        {/* Category & Title Header */}
        <div className="space-y-4 mb-6">
          <span className="bg-red text-white text-xs font-accent font-bold px-3 py-1 uppercase tracking-wider rounded-sm inline-block">
            {blog.category}
          </span>

          <h1 className="text-3xl md:text-5xl font-heading leading-tight text-black">{blog.title}</h1>
          {blog.subtitle && <p className="text-xl text-gray font-body">{blog.subtitle}</p>}

          {/* Author & Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray font-accent border-y border-gray-light py-3 my-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center font-semibold text-black">
                <FiUser className="mr-1.5 text-red" /> {blog.author?.name || 'SPC Solar Expert'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <FiCalendar className="mr-1.5 text-red" /> {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <FiClock className="mr-1.5 text-red" /> {blog.readingTime || 3} min read
              </span>
            </div>

            {/* Social Share Icons */}
            <div className="flex items-center space-x-3 text-black">
              <span className="text-xs font-accent font-bold text-gray uppercase">Share:</span>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 hover:scale-110 transition-transform"
                title="Share on WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:scale-110 transition-transform"
                title="Share on Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:scale-110 transition-transform"
                title="Share on LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <button onClick={handleCopyLink} className="text-gray hover:text-black" title="Copy Article Link">
                <FiCopy size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featuredImage?.url && (
          <div className="mb-10">
            <img
              src={blog.featuredImage.url}
              alt={blog.featuredImage.alt || blog.title}
              className="w-full h-[420px] object-cover rounded-card shadow-card border border-gray-light"
            />
          </div>
        )}

        {/* Table of Contents (TOC) */}
        {blog.toc && blog.toc.length > 0 && (
          <Card className="p-6 mb-10 bg-surface border-l-4 border-l-red">
            <h3 className="font-heading text-lg mb-3 flex items-center text-black">
              <FiList className="mr-2 text-red" /> TABLE OF CONTENTS
            </h3>
            <ul className="space-y-2 text-sm font-body text-gray">
              {blog.toc.map((item, idx) => (
                <li key={idx} className={item.level === 3 ? 'ml-4' : ''}>
                  <a
                    href={`#${item.id}`}
                    className="hover:text-red hover:underline transition-colors block"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Main Body Content */}
        <div
          className="prose prose-lg max-w-none text-black font-body leading-relaxed space-y-6 prose-headings:font-heading prose-headings:text-black prose-a:text-red prose-blockquote:border-l-4 prose-blockquote:border-red prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(blog.content) }}
        />

        {/* FAQ Section */}
        {blog.faq && blog.faq.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-light space-y-6">
            <h3 className="text-2xl font-heading text-black">FREQUENTLY ASKED QUESTIONS</h3>
            <div className="space-y-4">
              {blog.faq.map((faq, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer hover:border-red transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex justify-between items-center font-heading text-lg text-black">
                    <span>{faq.question}</span>
                    {openFaqIndex === index ? <FiChevronUp className="text-red" /> : <FiChevronDown />}
                  </div>
                  {openFaqIndex === index && (
                    <div className="mt-3 text-sm text-gray font-body leading-relaxed pt-2 border-t border-gray-light">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Card */}
        <Card className="p-6 mt-12 bg-surface flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-16 h-16 rounded-full bg-red text-white flex items-center justify-center font-heading text-2xl font-bold flex-shrink-0">
            {blog.author?.name ? blog.author.name.charAt(0) : 'S'}
          </div>
          <div>
            <h4 className="font-heading text-lg text-black">{blog.author?.name || 'SPC Solar Team'}</h4>
            <p className="text-xs text-red font-accent font-bold uppercase mb-1">Solar Energy Specialist</p>
            <p className="text-xs text-gray font-body leading-relaxed">
              {blog.author?.bio || 'Consultant and engineer with expertise in commercial & residential solar power installations, net metering policies, and government rooftop subsidies.'}
            </p>
          </div>
        </Card>

        {/* Related Articles */}
        {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-light space-y-6">
            <h3 className="text-2xl font-heading text-black">RELATED ARTICLES</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blog.relatedBlogs.map((rel) => (
                <Card key={rel._id} className="p-0 overflow-hidden flex flex-col h-full border border-gray-light hover:border-red">
                  {rel.featuredImage?.url && (
                    <img src={rel.featuredImage.url} alt={rel.title} className="w-full h-36 object-cover" />
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-[10px] text-red font-accent font-bold uppercase">{rel.category}</span>
                    <h4 className="font-heading text-sm font-bold line-clamp-2 mt-1 mb-2">
                      <Link to={`/blog/${rel.slug}`} className="hover:text-red">
                        {rel.title}
                      </Link>
                    </h4>
                    <Link
                      to={`/blog/${rel.slug}`}
                      className="mt-auto inline-flex items-center text-xs font-accent font-bold text-black hover:text-red uppercase tracking-wider"
                    >
                      Read Guide <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 p-8 bg-black text-white rounded-card text-center space-y-4 border-b-4 border-b-red shadow-card">
          <h3 className="text-2xl font-heading">Ready to Switch to Solar Energy?</h3>
          <p className="text-gray-light text-sm max-w-xl mx-auto">
            Get an instant customized quote for your home or business with maximum government subsidy benefits.
          </p>
          <Link to="/quotation" className="inline-block">
            <Button variant="primary" className="px-8 py-3 text-sm">
              Calculate Solar Savings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
