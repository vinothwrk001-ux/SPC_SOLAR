import React, { useState, useEffect } from 'react';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import { Stagger, Reveal } from '../../components/motion';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { FiMapPin } from 'react-icons/fi';

const DEFAULT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800';

const formatImageUrl = (url) => {
  if (!url) return DEFAULT_IMAGE_FALLBACK;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  if (url.startsWith('/uploads')) return `${baseUrl}${url}`;
  return `${baseUrl}/uploads/${url}`;
};

const DEFAULT_PROJECTS = [
  { 
    title: "Green Valley Residence", 
    capacity: "5 kW", 
    type: "Residential", 
    location: "Pune, MH", 
    image: "https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    title: "TechPark Corporate", 
    capacity: "150 kW", 
    type: "Commercial", 
    location: "Bangalore, KA", 
    image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    title: "Apex Manufacturing", 
    capacity: "500 kW", 
    type: "Industrial", 
    location: "Ahmedabad, GJ", 
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    title: "Sharma Villa", 
    capacity: "10 kW", 
    type: "Residential", 
    location: "Delhi, DL", 
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    title: "Sunrise Mall", 
    capacity: "300 kW", 
    type: "Commercial", 
    location: "Mumbai, MH", 
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    title: "Omega Textiles", 
    capacity: "1 MW", 
    type: "Industrial", 
    location: "Surat, GJ", 
    image: "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&q=80&w=800" 
  }
];

const ProjectsPage = () => {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.error('Failed to load projects from API, using defaults:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => (p.type || p.clientType || '').toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Our Solar Projects | SPC Solar" 
        description="Browse through our portfolio of successful residential, commercial, and industrial solar installations."
      />

      <PageHero
        label="Portfolio"
        title="OUR "
        highlight="PROJECTS"
        subtitle="Explore our footprint of successfully commissioned solar power plants across India."
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['All', 'Residential', 'Commercial', 'Industrial'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2.5 font-accent font-bold text-sm tracking-widest uppercase rounded-btn border-2 transition-all duration-250 ${
                    filter.toLowerCase() === cat.toLowerCase()
                      ? 'bg-red border-red text-white shadow-red-sm'
                      : 'bg-transparent border-gray-200 text-gray-500 hover:border-black hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-red border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500 font-accent uppercase text-xs tracking-wider">Loading portfolio projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="font-heading text-xl text-black mb-2">No Projects Found</h3>
              <p className="text-gray-500 text-sm font-body">There are currently no projects listed under {filter}.</p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => {
                const projectType = project.type || project.clientType || 'Residential';
                return (
                  <div key={project._id || index} className="group bg-white rounded-card overflow-hidden shadow-card border border-gray-200 hover:border-red hover:shadow-card-md transition-all duration-350">
                    <div className="relative h-60 overflow-hidden bg-gray-100">
                      <motion.img
                        src={formatImageUrl(project.image)}
                        alt={project.title}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_IMAGE_FALLBACK;
                        }}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <div className="absolute top-4 left-4 bg-black text-white text-xs font-accent font-bold px-3 py-1 uppercase rounded-sm">
                        {projectType}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-2xl mb-1 line-clamp-1">{project.title}</h3>
                      <p className="text-gray-500 text-sm mb-4 font-body flex items-center gap-1.5">
                        <FiMapPin size={14} className="text-gray-400" />
                        <span>{project.location}</span>
                      </p>

                      {project.description && (
                        <p className="text-xs text-gray-600 font-body line-clamp-2 leading-relaxed mb-4">
                          {project.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-xs font-accent text-gray-400 uppercase tracking-wider">Capacity</span>
                        <span className="font-accent font-bold text-red text-lg">{project.capacity}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Stagger>
          )}

        </div>
      </section>

    </div>
  );
};

export default ProjectsPage;
