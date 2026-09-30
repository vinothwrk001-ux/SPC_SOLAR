import React, { useState } from 'react';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import { Stagger, Reveal } from '../../components/motion';
import { motion } from 'framer-motion';

const ProjectsPage = () => {
  const [filter, setFilter] = useState('All');

  const allProjects = [
    { title: "Green Valley Residence", capacity: "5 kW", type: "Residential", location: "Pune, MH", image: "https://images.unsplash.com/photo-1611365892502-8eebf8c148e3?auto=format&fit=crop&q=80&w=800" },
    { title: "TechPark Corporate", capacity: "150 kW", type: "Commercial", location: "Bangalore, KA", image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=800" },
    { title: "Apex Manufacturing", capacity: "500 kW", type: "Industrial", location: "Ahmedabad, GJ", image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800" },
    { title: "Sharma Villa", capacity: "10 kW", type: "Residential", location: "Delhi, DL", image: "https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800" },
    { title: "Sunrise Mall", capacity: "300 kW", type: "Commercial", location: "Mumbai, MH", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938cb?auto=format&fit=crop&q=80&w=800" },
    { title: "Omega Textiles", capacity: "1 MW", type: "Industrial", location: "Surat, GJ", image: "https://images.unsplash.com/photo-1548611716-3e4b3ff255b1?auto=format&fit=crop&q=80&w=800" }
  ];

  const filteredProjects = filter === 'All' ? allProjects : allProjects.filter(p => p.type === filter);

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
                    filter === cat
                      ? 'bg-red border-red text-white shadow-red-sm'
                      : 'bg-transparent border-gray-200 text-gray-500 hover:border-black hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div key={index} className="group bg-white rounded-card overflow-hidden shadow-card border border-gray-200 hover:border-red hover:shadow-card-md transition-all duration-350">
                <div className="relative h-60 overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <div className="absolute top-4 left-4 bg-black text-white text-xs font-accent font-bold px-3 py-1 uppercase rounded-sm">
                    {project.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-2xl mb-1">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 font-body">{project.location}</p>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xs font-accent text-gray-400 uppercase tracking-wider">Capacity</span>
                    <span className="font-accent font-bold text-red text-lg">{project.capacity}</span>
                  </div>
                </div>
              </div>
            ))}
          </Stagger>

        </div>
      </section>

    </div>
  );
};

export default ProjectsPage;
