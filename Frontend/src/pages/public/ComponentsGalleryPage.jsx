import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import { Stagger, Reveal } from '../../components/motion';
import { motion } from 'framer-motion';

const ComponentsGalleryPage = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/gallery-components');
        setComponents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching components:', error);
        setLoading(false);
      }
    };
    fetchComponents();
  }, []);

  const componentsList = components.filter(c => c.category === 'Components' || !c.category);
  const solarSystemsList = components.filter(c => c.category === 'Solar Systems');

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Solar Components Gallery | SPC Solar" 
        description="Browse through our gallery of high-quality solar components, panels, inverters, and accessories."
      />

      <PageHero
        label="Gallery"
        title="ENERGY "
        highlight="ASSETS"
        subtitle="Explore our catalog of premium solar energy products and components."
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red"></div>
            </div>
          ) : components.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-heading text-gray-500">No components available at the moment.</h3>
            </div>
          ) : (
            <div className="space-y-20">
              {solarSystemsList.length > 0 && (
                <div>
                  <Reveal>
                    <h2 className="heading-accent text-3xl md:text-4xl font-heading">Solar Systems</h2>
                  </Reveal>
                  <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {solarSystemsList.map((comp) => (
                      <div key={comp._id} className="group bg-white rounded-card overflow-hidden shadow-card border border-gray-200 hover:border-red hover:shadow-card-md transition-all duration-350">
                        <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                          <motion.img
                            src={`http://localhost:5000${comp.imageUrl}`}
                            alt={comp.title}
                            className="w-full h-full object-contain"
                            whileHover={{ scale: 1.06 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="heading-accent text-xl group-hover:text-red transition-colors">{comp.title}</h3>
                          {comp.description && (
                            <p className="text-gray-500 text-sm font-body line-clamp-2">{comp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </Stagger>
                </div>
              )}

              {componentsList.length > 0 && (
                <div>
                  <Reveal>
                    <h2 className="heading-accent text-3xl md:text-4xl font-heading">Components</h2>
                  </Reveal>
                  <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {componentsList.map((comp) => (
                      <div key={comp._id} className="group bg-white rounded-card overflow-hidden shadow-card border border-gray-200 hover:border-red hover:shadow-card-md transition-all duration-350">
                        <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                          <motion.img
                            src={`http://localhost:5000${comp.imageUrl}`}
                            alt={comp.title}
                            className="w-full h-full object-contain"
                            whileHover={{ scale: 1.06 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="heading-accent text-xl group-hover:text-red transition-colors">{comp.title}</h3>
                          {comp.description && (
                            <p className="text-gray-500 text-sm font-body line-clamp-2">{comp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </Stagger>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default ComponentsGalleryPage;
