import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/ui/SEOHead';
import Button from '../../components/ui/Button';
import { EnergyGrid, Reveal } from '../../components/motion';
import { 
  FiHome, 
  FiSun, 
  FiDollarSign, 
  FiFileText, 
  FiPhone, 
  FiArrowRight,
  FiZap
} from 'react-icons/fi';

const HELPFUL_LINKS = [
  { name: 'Rooftop Solar Services', path: '/services', desc: 'Residential, Commercial & EPC Systems', icon: FiSun },
  { name: 'PM Surya Ghar Subsidy', path: '/subsidy', desc: 'Get up to ₹78,000 Govt Subsidy', icon: FiDollarSign },
  { name: 'Solar Cost Calculator', path: '/quotation', desc: 'Instant savings estimate in seconds', icon: FiZap },
  { name: 'Our Solar Projects', path: '/projects', desc: '500+ landmark Tamil Nadu installations', icon: FiFileText },
  { name: 'Contact Our Engineers', path: '/contact', desc: 'RS Puram, Coimbatore Office', icon: FiPhone },
];

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center relative overflow-hidden pt-28 pb-20">
      <SEOHead
        title="Page Not Found (404) | SPC Solar Coimbatore"
        description="The solar page you are looking for does not exist or has been moved. Explore our rooftop solar services, subsidy guides, and instant calculator."
        noindex={true}
      />

      {/* Background Energy Grid & Radial Glow */}
      <EnergyGrid opacity={0.06} color="white" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red/10 border border-red/30 text-red text-xs font-accent font-bold uppercase tracking-widest mb-6">
            Error 404
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading tracking-tight text-white mb-4">
            SUNLIGHT <span className="text-red">MISPLACED</span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-8 font-body leading-relaxed">
            The solar page or resource you are looking for has been moved, renamed, or is currently off the grid.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
            <Link to="/">
              <Button variant="primary" className="flex items-center gap-2">
                <FiHome size={16} /> Return to Homepage
              </Button>
            </Link>
            <Link to="/quotation">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 flex items-center gap-2">
                Calculate Solar Savings <FiArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </Reveal>

        {/* Helpful Popular Links */}
        <Reveal delay={0.15}>
          <div className="text-left bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 sm:p-6 md:p-8">
            <h3 className="text-xs sm:text-sm font-accent font-bold uppercase tracking-wider text-gray-400 mb-4">
              Explore Popular Solar Destinations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {HELPFUL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-red/10 border border-white/5 hover:border-red/30 transition-all duration-200 group flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red/20 text-red flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-red transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default NotFoundPage;
