import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Reveal, Stagger } from '../motion';
import { FiArrowRight, FiZap } from 'react-icons/fi';

const PROJECTS = [
  {
    title: 'Green Valley Residence',
    capacity: '5 kW',
    type: 'Residential',
    savings: '₹72K/yr',
    image: 'https://images.unsplash.com/photo-1611365892502-8eebf8c148e3?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'TechPark Corporate',
    capacity: '150 kW',
    type: 'Commercial',
    savings: '₹18L/yr',
    image: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Apex Manufacturing',
    capacity: '500 kW',
    type: 'Industrial',
    savings: '₹60L/yr',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800',
  },
];

const ProjectsPreview = () => {
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
          {PROJECTS.map((project) => (
            <div key={project.title} className="group relative overflow-hidden rounded-card shadow-card cursor-pointer">
              {/* Image */}
              <div className="overflow-hidden h-80">
                <motion.img
                  src={project.image}
                  alt={project.title}
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
                    {project.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-2xl text-white mb-2">{project.title}</h3>

                {/* Savings — revealed on hover */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-350">
                  <FiZap size={14} className="text-red" />
                  <span className="text-white/70 font-body text-sm">Annual Savings: <strong className="text-white">{project.savings}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
};

export default ProjectsPreview;
