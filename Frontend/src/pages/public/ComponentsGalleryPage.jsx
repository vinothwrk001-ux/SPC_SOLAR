import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import { Stagger, Reveal } from '../../components/motion';
import { motion } from 'framer-motion';

const ComponentsGalleryPage = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const { data } = await api.get('/gallery-components');
        setComponents(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching components:', error);
        setLoading(false);
      }
    };
    fetchComponents();
  }, []);

  // Dynamically group components by category
  const categoriesMap = {};
  components.forEach(comp => {
    const cat = comp.category?.trim() || 'Components';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(comp);
  });

  const categoryKeys = Object.keys(categoriesMap);

  const displayedCategories = activeCategory === 'ALL'
    ? categoryKeys
    : categoryKeys.filter(cat => cat === activeCategory);

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Solar Components Gallery | SPC Solar" 
        description="Browse through our gallery of high-quality solar components, panels, inverters, and accessories."
      />

      <PageHero
        label="Gallery"
        title="OUR "
        highlight="GALLERY"
        subtitle="Explore our catalog of premium solar energy products and components."
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter Tabs */}
          {!loading && categoryKeys.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all ${
                  activeCategory === 'ALL'
                    ? 'bg-red text-white shadow-md'
                    : 'bg-surface text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Assets ({components.length})
              </button>
              {categoryKeys.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all ${
                    activeCategory === cat
                      ? 'bg-red text-white shadow-md'
                      : 'bg-surface text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat} ({categoriesMap[cat].length})
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red"></div>
            </div>
          ) : components.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-heading text-gray-500">No components available at the moment.</h3>
            </div>
          ) : (
            <div className="space-y-16">
              {displayedCategories.map((cat) => {
                const list = categoriesMap[cat] || [];
                if (list.length === 0) return null;

                return (
                  <div key={cat} className="space-y-4 sm:space-y-6">
                    <Reveal>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="w-2 h-6 sm:w-2.5 sm:h-7 bg-red rounded-full flex-shrink-0"></span>
                        <h2 className="heading-accent section-heading-mobile text-xl sm:text-2xl md:text-3xl font-heading">{cat}</h2>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 font-accent uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 bg-surface rounded-full flex-shrink-0">
                          {list.length} {list.length === 1 ? 'Item' : 'Items'}
                        </span>
                      </div>
                    </Reveal>

                    <Stagger className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
                      {list.map((comp) => (
                        <div key={comp._id} className="group bg-white rounded-lg sm:rounded-card overflow-hidden shadow-card border border-gray-200 hover:border-red hover:shadow-card-md transition-all duration-350 flex flex-col justify-between">
                          <div className="relative h-36 sm:h-48 md:h-64 overflow-hidden bg-gray-50 flex items-center justify-center p-2 sm:p-3 md:p-4">
                            <motion.img
                              src={`${baseUrl}${comp.imageUrl}`}
                              alt={comp.title}
                              className="w-full h-full object-contain"
                              whileHover={{ scale: 1.06 }}
                              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                          <div className="p-2.5 sm:p-4 md:p-6">
                            <div className="flex items-center justify-between gap-2 mb-1 sm:mb-1.5 md:mb-1">
                              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red bg-red/10 px-1.5 sm:px-2 py-0.5 rounded">
                                {comp.category || 'Components'}
                              </span>
                            </div>
                            <h3 className="heading-accent mobile-clean-text text-xs sm:text-sm md:text-xl font-heading font-bold text-black group-hover:text-red transition-colors line-clamp-2 md:line-clamp-none leading-snug">
                              {comp.title}
                            </h3>
                            {comp.description && (
                              <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm font-body line-clamp-2 mt-1 md:mt-2 leading-relaxed">
                                {comp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </Stagger>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default ComponentsGalleryPage;
