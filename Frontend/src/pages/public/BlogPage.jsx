import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import { blogService } from '../../services/blogService';
import { formatDate, getImageUrl } from '../../utils/blogHelpers';
import { FiSearch, FiClock, FiX, FiChevronDown, FiCheck } from 'react-icons/fi';

const DEFAULT_CATEGORIES = [
  { _id: 'cat-1', name: 'Government Schemes' },
  { _id: 'cat-2', name: 'Solar Basics' },
  { _id: 'cat-3', name: 'Residential Solar' },
  { _id: 'cat-4', name: 'Commercial Solar' },
  { _id: 'cat-5', name: 'Solar Maintenance' },
  { _id: 'cat-6', name: 'Subsidies & Net Metering' }
];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800';

// In-memory cache for instant navigation transitions (0ms reload)
const blogCache = new Map();
let cachedCategories = null;

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Pagination & Filter States
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const cacheKey = `${pageParam}_${categoryParam}_${searchParam}`;
  const initialCache = blogCache.get(cacheKey);

  const [blogs, setBlogs] = useState(initialCache?.blogs || []);
  const [categories, setCategories] = useState(cachedCategories || DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(!initialCache);
  const [searchInput, setSearchInput] = useState(searchParam);
  const [pagination, setPagination] = useState(
    initialCache?.pagination || { page: 1, totalPages: 1, total: 0 }
  );

  // Sync search input if URL searchParam changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Load Categories once independently on mount (does not block blog grid)
  useEffect(() => {
    if (cachedCategories) return;
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const catRes = await blogService.getCategories();
        if (isMounted && Array.isArray(catRes) && catRes.length > 0) {
          cachedCategories = catRes;
          setCategories(catRes);
        }
      } catch (err) {
        console.warn('Using default category fallback:', err.message);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  // Fetch blogs when page, category, or search filters change
  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      // If we have cached results, show them immediately to eliminate perceived delay
      if (blogCache.has(cacheKey)) {
        const cached = blogCache.get(cacheKey);
        setBlogs(cached.blogs || []);
        setPagination(cached.pagination || { page: 1, totalPages: 1, total: 0 });
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        const blogRes = await blogService.getPublicBlogs({
          page: pageParam,
          limit: 9,
          category: categoryParam,
          search: searchParam
        });

        if (isMounted && blogRes) {
          const fetchedBlogs = blogRes.blogs || [];
          const fetchedPagination = blogRes.pagination || {
            page: pageParam,
            totalPages: 1,
            total: fetchedBlogs.length
          };

          // Save to cache
          blogCache.set(cacheKey, {
            blogs: fetchedBlogs,
            pagination: fetchedPagination
          });

          setBlogs(fetchedBlogs);
          setPagination(fetchedPagination);
        }
      } catch (error) {
        console.error('Error loading blogs:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlogs();
    return () => { isMounted = false; };
  }, [pageParam, categoryParam, searchParam, cacheKey]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (catName) => {
    const newParams = new URLSearchParams(searchParams);
    if (!catName || categoryParam === catName) {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

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

      <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 lg:px-8 mt-5 sm:mt-8 lg:mt-10">
        {/* Mobile & Tablet Category Dropdown Filter Only */}
        <div ref={categoryDropdownRef} className="lg:hidden mb-4 sm:mb-6 relative">
          <button
            type="button"
            onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
            className="w-full bg-white border border-gray-200 hover:border-gray-300 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center justify-between gap-3 shadow-sm text-left cursor-pointer active:scale-[0.99]"
            title="Filter by category"
            aria-haspopup="listbox"
            aria-expanded={isCategoryDropdownOpen}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-gray-400 font-normal text-[11px] sm:text-xs">Select Category:</span>
              <span className={`truncate font-bold ${categoryParam ? 'text-red' : 'text-[#1A1A1A]'}`}>
                {categoryParam || 'All Blogs'}
              </span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600">
              <FiChevronDown
                size={14}
                className={`transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-red' : ''}`}
              />
            </div>
          </button>

          {/* Floating Dropdown Menu when Down Arrow is Clicked */}
          {isCategoryDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5 border-b border-gray-50 mb-1 flex items-center justify-between">
                <span>Select Category</span>
                <span className="text-[9px] text-gray-400 font-normal">Tap to filter</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    handleCategorySelect('');
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    !categoryParam
                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>All Blogs</span>
                  {!categoryParam && <FiCheck className="text-red" size={14} />}
                </button>
                {categories.map((cat) => {
                  const catName = typeof cat === 'string' ? cat : cat.name;
                  const catId = typeof cat === 'object' && cat._id ? cat._id : catName;
                  const isSelected = categoryParam.toLowerCase() === catName.toLowerCase();
                  return (
                    <button
                      type="button"
                      key={catId}
                      onClick={() => {
                        handleCategorySelect(catName);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A1A1A] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{catName}</span>
                      {isSelected && <FiCheck className="text-red" size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar (Desktop) */}
          <div className="lg:w-1/4 flex-shrink-0">
            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="mb-4 sm:mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  className="w-full bg-white border border-gray-200 py-2.5 sm:py-3 pl-10 sm:pl-11 pr-9 sm:pr-10 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red transition-all shadow-sm"
                  placeholder="Search solar articles..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FiX size={15} />
                  </button>
                )}
              </div>
            </form>

            {/* Desktop Browse by Category */}
            <div className="hidden lg:block bg-white p-5 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
              <h3 className="font-bold text-[#1A1A1A] mb-3 text-base tracking-tight flex items-center justify-between">
                <span>Browse by Category</span>
                {categoryParam && (
                  <button
                    onClick={() => handleCategorySelect('')}
                    className="text-xs text-red font-medium hover:underline"
                  >
                    Reset
                  </button>
                )}
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                      !categoryParam
                        ? 'bg-[#1A1A1A] text-white font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>All Blogs</span>
                  </button>
                </li>
                {categories.map((cat) => {
                  const catName = typeof cat === 'string' ? cat : cat.name;
                  const catId = typeof cat === 'object' && cat._id ? cat._id : catName;
                  const isSelected = categoryParam.toLowerCase() === catName.toLowerCase();
                  return (
                    <li key={catId}>
                      <button
                        onClick={() => handleCategorySelect(catName)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-white font-medium shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="truncate">{catName}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right Content - Grid */}
          <div className="lg:w-3/4 flex-1">
            {/* Active Filters Display */}
            {(categoryParam || searchParam) && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                <span className="text-[11px] sm:text-xs text-gray-500 font-medium">Filtering by:</span>
                {categoryParam && (
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-red/10 text-red text-[11px] sm:text-xs font-semibold rounded-full">
                    Category: {categoryParam}
                    <button onClick={() => handleCategorySelect('')} className="hover:opacity-75">
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {searchParam && (
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gray-200 text-gray-800 text-[11px] sm:text-xs font-semibold rounded-full">
                    Search: "{searchParam}"
                    <button onClick={handleClearSearch} className="hover:opacity-75">
                      <FiX size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              /* High Performance Skeleton Loader Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse"
                  >
                    <div className="aspect-[16/9] md:aspect-auto md:h-[200px] w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 relative">
                      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-gray-300 w-20 sm:w-24 h-4 sm:h-5 rounded-full" />
                    </div>
                    <div className="p-3.5 sm:p-4 md:p-5 flex flex-col flex-grow">
                      <div className="h-4 sm:h-5 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mb-4 sm:mb-6" />
                      <div className="mt-auto flex items-center justify-between pt-2 sm:pt-2.5 md:pt-3 border-t border-gray-50">
                        <div className="h-3 sm:h-3.5 bg-gray-200 rounded w-16" />
                        <div className="h-3 sm:h-3.5 bg-gray-200 rounded w-20 sm:w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiSearch size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#1A1A1A]">No Articles Found</h3>
                <p className="text-gray-500 text-xs sm:text-sm mb-5 sm:mb-6 max-w-md mx-auto">
                  {searchParam || categoryParam
                    ? 'No articles match your current search or category filter. Try clearing filters or searching for something else.'
                    : 'No published articles are available at the moment. Please check back later.'}
                </p>
                {(searchParam || categoryParam) && (
                  <button
                    onClick={() => {
                      setSearchInput('');
                      setSearchParams({});
                    }}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6">
                {blogs.map((b) => (
                  <Link
                    to={`/blog/${b.slug}`}
                    key={b._id}
                    className="group flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/9] md:aspect-auto md:h-[200px] w-full overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(b.thumbnailImage?.url || b.featuredImage?.url) || DEFAULT_IMAGE}
                        alt={b.thumbnailImage?.alt || b.featuredImage?.alt || b.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_IMAGE;
                        }}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-white/95 backdrop-blur text-[#1A1A1A] text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm">
                        {b.category}
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4 md:p-5 flex flex-col flex-grow">
                      <h3 className="text-sm sm:text-base md:text-[17px] font-bold text-[#1A1A1A] leading-snug mb-2.5 sm:mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 group-hover:text-red transition-colors">
                        {b.title}
                      </h3>
                      <div className="mt-auto flex items-center text-[11px] sm:text-xs md:text-[13px] text-gray-500 font-medium pt-2 sm:pt-2.5 md:pt-3 border-t border-gray-50">
                        <span className="flex items-center">
                          <FiClock className="mr-1 sm:mr-1.5 text-gray-400 w-3 h-3 sm:w-3.5 sm:h-3.5" /> {b.readingTime || 3} Min Read
                        </span>
                        <span className="ml-auto text-[10px] sm:text-xs uppercase tracking-wide text-gray-400">
                          {formatDate(b.publishedAt || b.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-1.5 sm:space-x-2 pt-6 sm:pt-10">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      pagination.page === p
                        ? 'bg-[#1A1A1A] text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
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

