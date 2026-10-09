import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { blogService } from '../../services/blogService';
import { formatDate, getImageUrl } from '../../utils/blogHelpers';
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
        const fallbackCategories = [
          { _id: 'cat-1', name: 'Government Schemes' },
          { _id: 'cat-2', name: 'Solar Basics' },
          { _id: 'cat-3', name: 'Residential Solar' },
          { _id: 'cat-4', name: 'Commercial Solar' },
          { _id: 'cat-5', name: 'Solar Maintenance' },
          { _id: 'cat-6', name: 'Subsidies & Net Metering' }
        ];
        setCategories(Array.isArray(catRes) && catRes.length > 0 ? catRes : fallbackCategories);
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
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20">
      <SEOHead
        title="Solar Energy Blog, Guides & Subsidy Updates | SPC Solar"
        description="Expert insights, solar installation guides, PM Surya Ghar subsidy details, and energy saving tips from SPC Solar."
      />

      <PageHero
        label="Resources"
        title="OUR "
        highlight="BLOGS"
        subtitle="Expert insights, solar installation guides, PM Surya Ghar subsidy details, and energy saving tips."
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-1/4 flex-shrink-0">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="mb-8">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  className="w-full bg-white border border-gray-200 py-3 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="Search an Article"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </form>

            {/* Browse by Category */}
            <div className="bg-transparent">
              <h3 className="font-bold text-[#1A1A1A] mb-4 text-base">Browse by Category</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      searchParams.delete('category');
                      setSearchParams(searchParams);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors rounded-sm ${
                      !categoryParam ? 'bg-[#F4F6FB] border-l-2 border-[#1A1A1A] font-medium text-[#1A1A1A]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Blogs
                  </button>
                </li>
                {categories.map((cat) => {
                  const catName = typeof cat === 'string' ? cat : cat.name;
                  const catId = typeof cat === 'object' && cat._id ? cat._id : catName;
                  return (
                    <li key={catId}>
                      <button
                        onClick={() => handleCategorySelect(catName)}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors rounded-sm ${
                          categoryParam === catName ? 'bg-[#F4F6FB] border-l-2 border-[#1A1A1A] font-medium text-[#1A1A1A]' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {catName}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right Content - Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-16 text-gray-500">Loading articles...</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200 p-8">
                <h3 className="text-xl font-bold mb-2">No Articles Found</h3>
                <p className="text-gray-500 text-sm">Try searching for different keywords or categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((b) => (
                  <Link to={`/blog/${b.slug}`} key={b._id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-[200px] w-full overflow-hidden">
                      <img
                        src={getImageUrl(b.thumbnailImage?.url || b.featuredImage?.url) || 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800'}
                        alt={b.thumbnailImage?.alt || b.featuredImage?.alt || b.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-[#1A1A1A] text-xs font-medium px-3 py-1 rounded-full">
                        {b.category}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-[17px] font-bold text-[#1A1A1A] leading-snug mb-4 line-clamp-3 group-hover:text-blue-600 transition-colors">
                        {b.title}
                      </h3>
                      <div className="mt-auto flex items-center text-[13px] text-gray-500 font-medium">
                        <FiClock className="mr-1.5" /> {b.readingTime || 3} Min
                        <span className="ml-3 uppercase tracking-wide">{formatDate(b.publishedAt || b.createdAt).toUpperCase()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-10">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === p ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
