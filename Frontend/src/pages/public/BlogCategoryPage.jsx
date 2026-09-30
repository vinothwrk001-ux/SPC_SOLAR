import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import SEOHead from '../../components/ui/SEOHead';
import Card from '../../components/ui/Card';
import { formatDate } from '../../utils/blogHelpers';
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
    <div className="bg-bg min-h-screen py-12">
      <SEOHead title={`${slug.toUpperCase()} Solar Articles | SPC Solar`} description={`Browse all articles categorized under ${slug}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-gray hover:text-red font-accent text-xs uppercase font-bold tracking-wider mb-6">
          <FiArrowLeft className="mr-2" /> Back to All Articles
        </Link>

        <div className="mb-10 border-b border-gray-light pb-6">
          <span className="text-red font-accent font-bold text-xs uppercase tracking-widest">CATEGORY</span>
          <h1 className="text-4xl font-heading uppercase text-black mt-1">{slug.replace(/-/g, ' ')}</h1>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray">Loading articles...</div>
        ) : blogs.length === 0 ? (
          <div className="py-12 text-center text-gray">No articles found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <Card key={b._id} className="flex flex-col p-0 overflow-hidden h-full border border-gray-light">
                <Link to={`/blog/${b.slug}`}>
                  <img src={b.featuredImage?.url || 'https://images.unsplash.com/photo-1509391366360-5157625bf958?w=800'} alt={b.title} className="w-full h-48 object-cover" />
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
