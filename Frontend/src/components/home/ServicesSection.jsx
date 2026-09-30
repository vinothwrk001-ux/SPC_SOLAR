import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiBriefcase, FiSettings, FiActivity } from 'react-icons/fi';
import Card from '../ui/Card';

const ServicesSection = () => {
  const services = [
    { icon: <FiHome size={40} />, title: "Residential Solar", desc: "Turn your roof into a power plant and eliminate your electricity bills.", path: "/services" },
    { icon: <FiBriefcase size={40} />, title: "Commercial Solar", desc: "Reduce operational costs and achieve ESG goals for your business.", path: "/services" },
    { icon: <FiSettings size={40} />, title: "Industrial Solar", desc: "Large scale megawatt installations with maximum efficiency.", path: "/services" },
    { icon: <FiActivity size={40} />, title: "AMC & Maintenance", desc: "24/7 monitoring, cleaning, and performance optimization.", path: "/services" },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">OUR SERVICES</h2>
          <p className="text-gray max-w-2xl mx-auto font-body">
            Comprehensive end-to-end solar solutions tailored to meet your unique energy requirements.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group text-center hover:border-b-4 hover:border-b-red cursor-pointer">
              <div className="flex justify-center mb-6 text-black group-hover:text-red transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="font-heading text-2xl mb-3">{service.title}</h3>
              <p className="text-gray text-sm mb-6">{service.desc}</p>
              <Link to={service.path} className="font-accent font-bold text-red text-sm tracking-wider uppercase group-hover:text-red-dark">
                Learn More →
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
