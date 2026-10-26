import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Reveal, Stagger } from '../motion';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import api from '../../services/api';
import { usePreload } from '../../context/PreloadContext';

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
    title: 'Gamesa Solar Park',
    capacity: '1500 kW',
    type: 'Industrial',
    savings: '₹1.8 Cr/yr',
    image: 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Nazareth Textile Mill',
    capacity: '1000 kW',
    type: 'Industrial',
    savings: '₹1.2 Cr/yr',
    image: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'JYOTI Metal Solutions',
    capacity: '350 kW',
    type: 'Industrial',
    savings: '₹42L/yr',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800',
  },
];

const TRUSTED_CLIENTS_SUMMARY = [
  { name: 'Gamesa', spec: '1500 kW Park' },
  { name: 'Nazareth Mill', spec: '1000 kW' },
  { name: 'JYOTI Metal', spec: '350 kW' },
  { name: 'G Square Group', spec: '320 Street Lights' },
  { name: 'DMS Hospital', spec: '70 kW' },
  { name: 'Jayapriya City Funds', spec: '70 kW' },
  { name: 'IndianOil', spec: '10/25 kW' },
  { name: 'Bharat Petroleum', spec: '10 kW' },
  { name: 'HPCL', spec: '10 kW' },
  { name: 'St. Joan of Arc', spec: '40 kW' },
];

const formatProjectsData = (data) => {
  if (!Array.isArray(data) || data.length === 0) return DEFAULT_PROJECTS;
  const featured = data.filter((p) => Boolean(p.isFeatured || p.isFeatures));
  return featured.length > 0 ? featured.slice(0, 3) : data.slice(0, 3);
};

const ProjectsPreview = () => {
  const { preloadedData } = usePreload();
  const [projects, setProjects] = useState(() => (preloadedData?.projects ? formatProjectsData(preloadedData.projects) : DEFAULT_PROJECTS));

  useEffect(() => {
    if (preloadedData?.projects && preloadedData.projects.length > 0) {
      setProjects(formatProjectsData(preloadedData.projects));
      return;
    }

    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        if (Array.isArray(data) && data.length > 0) {
          setProjects(formatProjectsData(data));
        }
      } catch (err) {
        console.error('Failed to load featured projects preview:', err);
      }
    };
    fetchProjects();
  }, [preloadedData?.projects]);

  return (
    <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <span className="section-label">Portfolio</span>
              <h2 className="section-title">
                FEATURED <span className="text-red">PROJECTS</span>
              </h2>
              <span className="red-line" />
              <p className="section-subtitle max-w-xl">
                A selection of our recently commissioned solar installations across India.
              </p>
            </div>
            <Link to="/projects">
              <Button variant="outline" icon={<FiArrowRight />}>
                View All Projects
              </Button>
            </Link>
          </div>
        </Reveal>

        {/* Project cards */}
        <Stagger stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => {
            const pType = project.type || project.clientType || 'Residential';
            return (
              <div key={project._id || project.title || idx} className="group relative overflow-hidden rounded-card shadow-card cursor-pointer">
                {/* Image */}
                <div className="overflow-hidden h-80 bg-gray-900">
                  <motion.img
                    src={formatImageUrl(project.image)}
                    alt={`${project.title} - ${project.capacity || ''} Solar Installation in Coimbatore Tamil Nadu by SPC Solar`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMAGE_FALLBACK;
                    }}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {/* Tags */}
                  <div className="flex gap-2 mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-350">
                    <span className="bg-red text-white text-xs font-accent font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                      {project.capacity}
                    </span>
                    <span className="bg-white/10 backdrop-blur-sm text-white text-xs font-accent px-3 py-1 rounded-sm uppercase tracking-wider border border-white/20">
                      {pType}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-2xl text-white mb-2 line-clamp-1">{project.title}</h3>

                  {/* Savings — revealed on hover */}
                  {project.savings && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-350">
                      <FiZap size={14} className="text-red" />
                      <span className="text-white/70 font-body text-sm">
                        Annual Savings: <strong className="text-white">{project.savings}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Stagger>

        {/* Trusted Partners from Corporate PDF Page 4 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <span className="text-xs font-accent font-bold uppercase tracking-wider text-gray-500">
              Trusted by Premier Industrial, Healthcare & Commercial Leaders
            </span>
            <Link to="/projects" className="text-xs font-accent font-bold text-red hover:underline flex items-center gap-1">
              View Full Portfolio <FiArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {TRUSTED_CLIENTS_SUMMARY.map((client) => (
              <div 
                key={client.name}
                className="bg-white border border-gray-200/90 rounded-lg px-2.5 sm:px-3.5 py-2 flex items-center justify-between gap-1.5 sm:gap-2 shadow-2xs hover:border-red transition-all"
              >
                <span className="font-heading font-bold text-xs sm:text-sm text-gray-900 truncate">{client.name}</span>
                <span className="text-[10px] sm:text-[11px] font-accent font-bold text-red bg-red/5 px-1.5 py-0.5 rounded border border-red/15 shrink-0 whitespace-nowrap">
                  {client.spec}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
