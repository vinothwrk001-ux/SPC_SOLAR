import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiBriefcase, FiSettings, FiActivity, FiArrowRight, FiZap, FiSun } from 'react-icons/fi';
import { Stagger, EnergyGrid, Reveal } from '../motion';
import api from '../../services/api';

const STATIC_SERVICES = [
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

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('residen')) return FiHome;
  if (cat.includes('commerc')) return FiBriefcase;
  if (cat.includes('industr')) return FiSettings;
  if (cat.includes('maint') || cat.includes('amc')) return FiActivity;
  if (cat.includes('stor') || cat.includes('batt')) return FiZap;
  if (cat.includes('agri') || cat.includes('pump')) return FiSun;
  return FiZap;
};

const ServicesSection = () => {
  const [services, setServices] = useState(STATIC_SERVICES);

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const activeOnly = data.filter((s) => s.isActive !== false);
          if (activeOnly.length > 0) {
            const formatted = activeOnly.slice(0, 4).map((item, idx) => ({
              id: item._id || idx,
              icon: getCategoryIcon(item.category),
              number: String(idx + 1).padStart(2, '0'),
              title: item.title,
              desc: item.shortDesc || item.fullDesc || item.desc || 'Comprehensive clean energy solutions tailored to your power needs.',
              path: '/services',
            }));
            setServices(formatted);
          }
        }
      } catch (err) {
        console.warn('Could not load services for homepage section:', err);
      }
    };
    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <EnergyGrid opacity={0.04} color="black" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="mb-12 md:mb-20">
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
        <Stagger stagger={0.1} className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link to={service.path} key={service.number} className="block group h-full">
                <div className="relative bg-white border border-gray-200 rounded-card p-3.5 sm:p-6 md:p-8 overflow-hidden transition-all duration-350 hover:border-red hover:shadow-card-md flex flex-col justify-between h-full">
                  {/* Number watermark */}
                  <span className="absolute top-2 right-3 md:top-4 md:right-5 font-heading text-3xl sm:text-5xl md:text-7xl text-gray-100 leading-none select-none pointer-events-none transition-colors duration-300 group-hover:text-red/8">
                    {service.number}
                  </span>

                  {/* Red accent line on hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-red"
                    initial={{ width: '0%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />

                  <div>
                    {/* Icon */}
                    <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-sm bg-red-light flex items-center justify-center text-red mb-3 sm:mb-4 md:mb-6 transition-all duration-300 group-hover:bg-red group-hover:text-white">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-[26px] md:h-[26px]" />
                    </div>

                    {/* Content */}
                    <h3 className="font-heading text-sm sm:text-xl md:text-2xl mb-1.5 sm:mb-2 md:mb-3 group-hover:text-red transition-colors duration-250 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm leading-relaxed mb-3 sm:mb-4 md:mb-6 font-body">
                      {service.desc}
                    </p>
                  </div>

                  {/* CTA */}
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 font-accent font-bold text-[10px] sm:text-xs uppercase tracking-wider md:tracking-widest text-red transition-all duration-250 group-hover:gap-3 mt-auto">
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
