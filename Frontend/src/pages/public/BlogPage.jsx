import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { blogService } from '../../services/blogService';
import { formatDate } from '../../utils/blogHelpers';
import { FiArrowRight, FiSearch, FiClock, FiTag, FiTrendingUp, FiUser } from 'react-icons/fi';

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter States
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blogRes, widgetRes, catRes] = await Promise.all([
          blogService.getPublicBlogs({
            page: pageParam,
            limit: 9,
            category: categoryParam,
            search: searchParam
          }),
          blogService.getFeaturedAndPopular(),
          blogService.getCategories()
        ]);

        setBlogs(blogRes.blogs);
        setPagination(blogRes.pagination);
        setFeatured(widgetRes.featured);
        setPopular(widgetRes.popular);
        setCategories(catRes);
      } catch (error) {
        console.error('Error loading blog page:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageParam, categoryParam, searchParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchInput, page: '1' });
  };

  const handleCategorySelect = (catName) => {
    if (categoryParam === catName) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const heroBlog = featured[0] || blogs[0];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Solar Energy Blog, Guides & Subsidy Updates | SPC Solar"
        description="Expert insights, solar installation guides, PM Surya Ghar subsidy details, and energy saving tips from SPC Solar."
      />

      <PageHero
        label="Knowledge Base & Guides"
        title="SOLAR INSIGHTS & "
        highlight="NEWS"
        subtitle="Stay updated with government subsidies, solar pricing trends, rooftop engineering, and sustainable energy tips."
      >
        <form onSubmit={handleSearchSubmit} className="mt-2 max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full bg-white/10 text-white border border-white/20 py-3 pl-10 pr-4 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red placeholder-gray-400 backdrop-blur-sm"
              placeholder="Search solar guides, subsidies, installation..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
          <Button type="submit" variant="primary" className="px-6">
            Search
          </Button>
        </form>
      </PageHero>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-light pb-6">
          <button
            onClick={() => {
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
            className={`px-4 py-2 rounded-full text-xs font-accent font-bold uppercase tracking-wider transition-colors ${
              !categoryParam ? 'bg-red text-white' : 'bg-surface border border-gray-light text-gray hover:text-black'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-4 py-2 rounded-full text-xs font-accent font-bold uppercase tracking-wider transition-colors ${
                categoryParam === cat.name ? 'bg-red text-white' : 'bg-surface border border-gray-light text-gray hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Featured Hero Article */}
        {!searchParam && !categoryParam && heroBlog && pageParam === 1 && (
          <div className="mb-12">
            <Card className="p-0 overflow-hidden border border-gray-light hover:shadow-card transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 h-64 lg:h-auto">
                  <img
                    src={heroBlog.featuredImage?.url || 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=1200'}
                    alt={heroBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:col-span-5 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-red text-white text-xs font-accent font-bold px-2.5 py-1 uppercase rounded-sm">
                        FEATURED ARTICLE
                      </span>
                      <span className="text-xs text-gray font-accent">{formatDate(heroBlog.publishedAt || heroBlog.createdAt)}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-heading mb-4 hover:text-red transition-colors">
                      <Link to={`/blog/${heroBlog.slug}`}>{heroBlog.title}</Link>
                    </h2>

                    <p className="text-gray text-sm mb-6 line-clamp-3 leading-relaxed">{heroBlog.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-light pt-4 mt-4">
                    <div className="flex items-center text-xs text-gray font-accent">
                      <FiUser className="mr-1 text-red" /> {heroBlog.author?.name || 'SPC Solar Expert'}
                      <span className="mx-2">•</span>
                      <FiClock className="mr-1 text-red" /> {heroBlog.readingTime || 4} min read
                    </div>

                    <Link
                      to={`/blog/${heroBlog.slug}`}
                      className="inline-flex items-center text-black hover:text-red font-accent font-bold uppercase text-xs tracking-wider transition-colors"
                    >
                      Read Full Guide <FiArrowRight className="ml-1.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Grid + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Grid */}
          <div className="lg:col-span-8 space-y-8">
            {loading ? (
              <div className="text-center py-16 text-gray">Loading articles...</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-card border border-gray-light p-8">
                <h3 className="text-xl font-heading mb-2">No Articles Found</h3>
                <p className="text-gray text-sm">Try searching for different keywords or categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((b) => (
                  <Card key={b._id} className="flex flex-col p-0 overflow-hidden h-full border border-gray-light hover:border-red transition-colors">
                    <Link to={`/blog/${b.slug}`}>
                      <img
                        src={b.featuredImage?.url || 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800'}
                        alt={b.title}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-3 text-xs font-accent tracking-wider text-gray">
                        <span className="text-red font-bold uppercase">{b.category}</span>
                        <span>{formatDate(b.publishedAt || b.createdAt)}</span>
                      </div>

                      <h3 className="text-xl font-heading mb-3 line-clamp-2 hover:text-red transition-colors">
                        <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                      </h3>

                      <p className="text-gray text-xs mb-6 flex-grow line-clamp-3 leading-relaxed">{b.excerpt}</p>

                      <div className="flex justify-between items-center border-t border-gray-light pt-4 mt-auto">
                        <span className="text-xs text-gray font-accent flex items-center">
                          <FiClock className="mr-1 text-red" /> {b.readingTime || 3} min
                        </span>
                        <Link
                          to={`/blog/${b.slug}`}
                          className="inline-flex items-center text-black hover:text-red font-accent font-bold uppercase text-xs tracking-wider transition-colors"
                        >
                          Read <FiArrowRight className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-6">
                <Button
                  variant="secondary"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="px-3 py-1 text-xs"
                >
                  Previous
                </Button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 rounded text-xs font-accent font-bold transition-colors ${
                      pagination.page === p ? 'bg-red text-white' : 'bg-surface text-gray hover:text-black border border-gray-light'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <Button
                  variant="secondary"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="px-3 py-1 text-xs"
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Popular Posts Widget */}
            {popular.length > 0 && (
              <Card className="p-6">
                <h3 className="font-heading text-lg mb-4 flex items-center border-b border-gray-light pb-2">
                  <FiTrendingUp className="mr-2 text-red" /> MOST READ ARTICLES
                </h3>
                <div className="space-y-4">
                  {popular.map((item, idx) => (
                    <div key={item._id} className="flex space-x-3 items-start border-b border-gray-light pb-3 last:border-0 last:pb-0">
                      <span className="font-heading text-2xl font-bold text-gray-light">{idx + 1}</span>
                      <div>
                        <Link to={`/blog/${item.slug}`} className="font-heading text-sm hover:text-red font-semibold leading-snug line-clamp-2">
                          {item.title}
                        </Link>
                        <span className="text-[11px] text-gray font-accent uppercase mt-1 block">
                          {item.category} • {formatDate(item.publishedAt || item.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Solar Quote Callout Card */}
            <Card className="p-6 bg-black text-white border-t-4 border-t-red text-center space-y-4">
              <h3 className="text-xl font-heading">Switch to Rooftop Solar Today</h3>
              <p className="text-gray-light text-xs leading-relaxed">
                Save up to 80% on monthly electricity bills with government subsidies under PM Surya Ghar.
              </p>
              <Link to="/quotation" className="block">
                <Button variant="primary" className="w-full text-xs py-2.5">
                  Calculate Instant Savings
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
