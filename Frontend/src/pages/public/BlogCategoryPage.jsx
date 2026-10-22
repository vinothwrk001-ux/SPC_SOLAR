import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import SEOHead from '../../components/ui/SEOHead';
import Card from '../../components/ui/Card';
import { getImageUrl } from '../../utils/blogHelpers';
import { FiArrowLeft, FiClock, FiArrowRight } from 'react-icons/fi';

const BlogCategoryPage = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getPublicBlogs({ category: slug });
        setBlogs(data.blogs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryBlogs();
  }, [slug]);

  return (
    <div className="bg-bg min-h-screen pt-36 sm:pt-40 pb-16">
      <SEOHead title={`${slug.toUpperCase()} Solar Articles | SPC Solar`} description={`Browse all articles categorized under ${slug}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-gray hover:text-red font-accent text-xs uppercase font-bold tracking-wider mb-6">
          <FiArrowLeft className="mr-2" /> Back to All Articles
        </Link>

        <div className="mb-10 border-b border-gray-light pb-6">
          <span className="text-red font-accent font-bold text-xs uppercase tracking-widest">CATEGORY</span>
          <h1 className="text-3xl sm:text-4xl font-heading uppercase text-black mt-2">{slug.replace(/-/g, ' ')}</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-light shadow-sm animate-pulse">
                <div className="w-full aspect-[16/9] md:aspect-auto md:h-48 bg-gray-200" />
                <div className="p-6 flex flex-col flex-grow space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-6 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : !blogs || blogs.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-gray-light">
            <h3 className="text-lg font-bold mb-2">No articles found in this category</h3>
            <p className="text-gray text-sm mb-4">Check back soon for new guides and updates.</p>
            <Link to="/blog" className="inline-block px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded">
              View All Articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <Card key={b._id} className="flex flex-col p-0 overflow-hidden h-full border border-gray-light hover:shadow-md transition-shadow">
                <Link to={`/blog/${b.slug}`}>
                  <img
                    src={getImageUrl(b.thumbnailImage?.url || b.featuredImage?.url) || 'https://images.unsplash.com/photo-1509391366360-5157625bf958?w=800'}
                    alt={b.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1509391366360-5157625bf958?w=800';
                    }}
                    className="w-full aspect-[16/9] md:aspect-auto md:h-48 object-cover object-top"
                  />
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs text-red font-accent font-bold uppercase mb-2">{b.category}</span>
                  <h3 className="text-xl font-heading mb-3 line-clamp-2 hover:text-red">
                    <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                  </h3>
                  <p className="text-gray text-xs mb-4 line-clamp-3">{b.excerpt}</p>
                  <div className="flex justify-between items-center border-t border-gray-light pt-4 mt-auto">
                    <span className="text-xs text-gray font-accent flex items-center">
                      <FiClock className="mr-1 text-red" /> {b.readingTime || 3} min
                    </span>
                    <Link to={`/blog/${b.slug}`} className="inline-flex items-center text-black hover:text-red font-accent font-bold text-xs uppercase">
                      Read <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCategoryPage;
