import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const ProjectsPreview = () => {
  const projects = [
    { title: "Green Valley Residence", capacity: "5 kW", image: "https://images.unsplash.com/photo-1611365892502-8eebf8c148e3?auto=format&fit=crop&q=80&w=800" },
    { title: "TechPark Corporate", capacity: "150 kW", image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=800" },
    { title: "Apex Manufacturing", capacity: "500 kW", image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading mb-4">FEATURED PROJECTS</h2>
            <p className="text-gray font-body max-w-xl">
              Take a look at some of our recently commissioned solar installations across the country.
            </p>
          </div>
          <Link to="/projects" className="mt-6 md:mt-0">
            <Button variant="primary">View All Projects</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="group relative overflow-hidden rounded-card shadow-card">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="bg-red text-white text-xs font-accent font-bold px-3 py-1 rounded-sm w-fit mb-2">
                  {project.capacity}
                </span>
                <h3 className="text-white font-heading text-2xl">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
