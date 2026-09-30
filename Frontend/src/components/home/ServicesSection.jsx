import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiBriefcase, FiSettings, FiActivity, FiArrowRight } from 'react-icons/fi';
import { Stagger, EnergyGrid, Reveal } from '../motion';

const SERVICES = [
  {
    icon: FiHome,
    number: '01',
    title: 'Residential Solar',
    desc: 'Turn your roof into a power plant and eliminate electricity bills entirely with our custom home solutions.',
    path: '/services',
  },
  {
    icon: FiBriefcase,
    number: '02',
    title: 'Commercial Solar',
    desc: 'Reduce operational costs and meet ESG goals with scalable commercial solar installations.',
    path: '/services',
  },
  {
    icon: FiSettings,
    number: '03',
    title: 'Industrial Solar',
    desc: 'Large-scale megawatt installations engineered for maximum efficiency and ROI.',
    path: '/services',
  },
  {
    icon: FiActivity,
    number: '04',
    title: 'AMC & Maintenance',
    desc: '24/7 monitoring, preventive cleaning, and performance optimization for peak output.',
    path: '/services',
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <EnergyGrid opacity={0.04} color="black" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="mb-20">
            <span className="section-label">What We Offer</span>
            <h2 className="section-title">
              OUR <span className="text-red">SERVICES</span>
            </h2>
            <span className="red-line" />
            <p className="section-subtitle">
              Comprehensive end-to-end solar solutions tailored to meet your unique energy requirements.
            </p>
          </div>
        </Reveal>

        {/* Cards grid */}
        <Stagger stagger={0.1}>
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link to={service.path} key={service.number} className="block group">
                <div className="relative bg-white border border-gray-200 rounded-card p-8 overflow-hidden transition-all duration-350 hover:border-red hover:shadow-card-md">
                  {/* Number watermark */}
                  <span className="absolute top-4 right-5 font-heading text-7xl text-gray-100 leading-none select-none pointer-events-none transition-colors duration-300 group-hover:text-red/8">
                    {service.number}
                  </span>

                  {/* Red accent line on hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-red"
                    initial={{ width: '0%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-sm bg-red-light flex items-center justify-center text-red mb-6 transition-all duration-300 group-hover:bg-red group-hover:text-white">
                    <Icon size={26} />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-2xl mb-3 group-hover:text-red transition-colors duration-250">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 font-body">{service.desc}</p>

                  {/* CTA */}
                  <span className="inline-flex items-center gap-2 font-accent font-bold text-xs uppercase tracking-widest text-red transition-all duration-250 group-hover:gap-3">
                    Learn More
                    <FiArrowRight size={14} className="transition-transform duration-250 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
};

export default ServicesSection;
