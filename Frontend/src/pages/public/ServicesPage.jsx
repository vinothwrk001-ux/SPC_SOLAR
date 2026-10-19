import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import Button from '../../components/ui/Button';
import { Reveal, EnergyGrid } from '../../components/motion';
import api from '../../services/api';
import ReferralCard from '../../components/referral/ReferralCard';
import { 
  FiHome, FiBriefcase, FiSettings, FiActivity, FiCheckCircle, 
  FiArrowRight, FiChevronDown, FiZap, FiSun
} from 'react-icons/fi';

const STATIC_SERVICES = [
  {
    icon: FiHome,
    number: '01',
    title: 'Residential Solar (Rooftop)',
    desc: 'Transform your unused roof into a power plant. Generate your own electricity, drastically reduce monthly bills, and increase property value.',
    price: '₹65,000 / kW',
    specs: [
      { label: 'System Capacity', value: '1 kW – 10 kW' },
      { label: 'Govt. Subsidy', value: 'Up to ₹78,000 (PM Surya Ghar)' },
      { label: 'Warranty', value: '25–30 Years Panel Warranty' },
      { label: 'Payback Period', value: '3 – 4 Years' },
    ],
    benefits: [
      'Up to 100% reduction in electricity bills',
      'PM Surya Ghar subsidy up to ₹78,000',
      'Increases property value',
      'Net-metering support',
    ],
  },
  {
    icon: FiBriefcase,
    number: '02',
    title: 'Commercial Solar',
    desc: 'Empower your business with clean energy. Lock in your energy costs for the next 25 years and achieve your ESG goals.',
    price: '₹58,000 / kW',
    specs: [
      { label: 'System Capacity', value: '10 kW – 100 kW+' },
      { label: 'Tax Incentive', value: '40% Accelerated Depreciation' },
      { label: 'Tariff Protection', value: 'Fixed Cost for 25 Years' },
      { label: 'Payback Period', value: '3 – 4 Years' },
    ],
    benefits: [
      'Accelerated depreciation benefits (up to 40%)',
      'Protection against tariff hikes',
      'Quick ROI (3–4 years)',
      'Green building certifications',
    ],
  },
  {
    icon: FiSettings,
    number: '03',
    title: 'Industrial Solar (EPC)',
    desc: 'Large-scale megawatt installations designed for maximum efficiency and durability — complete Engineering, Procurement, and Construction.',
    price: '₹55,000 / kW',
    specs: [
      { label: 'System Capacity', value: '100 kW – Multi-Megawatt' },
      { label: 'Execution', value: 'Turnkey EPC (Design to Commissioning)' },
      { label: 'Grid Connection', value: 'HT / LT Substation Integration' },
      { label: 'Panels Used', value: 'Tier-1 Mono PERC / TOPCon Bifacial' },
    ],
    benefits: [
      'Significant operational cost savings',
      'Custom engineered designs',
      'High capacity plant optimization',
      'Seamless grid integration',
    ],
  },
  {
    icon: FiActivity,
    number: '04',
    title: 'AMC & Maintenance',
    desc: 'Keep your solar plant operating at peak efficiency with continuous monitoring, professional panel cleaning, and preventive maintenance.',
    price: 'Custom Quote',
    specs: [
      { label: 'Monitoring', value: '24/7 Remote Generation Tracking' },
      { label: 'Cleaning Cycle', value: 'Bi-Weekly / Monthly Cleaning' },
      { label: 'Health Checks', value: 'Thermal Drone & Inverter Audits' },
      { label: 'Response SLA', value: 'Within 24 Hours on Breakdowns' },
    ],
    benefits: [
      '24/7 remote monitoring',
      'Periodic cleaning schedules',
      'Preventive & corrective maintenance',
      'Detailed generation reports',
    ],
  },
];

const getServiceIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('residen')) return FiHome;
  if (cat.includes('commerc')) return FiBriefcase;
  if (cat.includes('industr')) return FiSettings;
  if (cat.includes('maint') || cat.includes('amc')) return FiActivity;
  if (cat.includes('stor') || cat.includes('batt')) return FiZap;
  if (cat.includes('agri') || cat.includes('pump')) return FiSun;
  return FiZap;
};

const formatImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  if (url.startsWith('/uploads')) return `${baseUrl}${url}`;
  return `${baseUrl}/uploads/${url}`;
};

const buildSpecs = (item) => {
  if (Array.isArray(item.specs) && item.specs.length > 0) return item.specs;
  const specs = [];
  if (item.capacity) {
    specs.push({ label: 'System Capacity', value: item.capacity });
  }
  if (item.warranty) {
    specs.push({ label: 'Warranty', value: item.warranty });
  }
  if (item.category) {
    specs.push({ label: 'Category', value: item.category });
  }
  const cat = (item.category || '').toLowerCase();
  if (cat.includes('residen')) {
    specs.push({ label: 'Govt. Subsidy', value: 'Up to ₹78,000 (PM Surya Ghar)' });
  } else if (cat.includes('commerc') || cat.includes('industr')) {
    specs.push({ label: 'Tax Incentive', value: '40% Accelerated Depreciation' });
  } else if (cat.includes('agri')) {
    specs.push({ label: 'Govt. Scheme', value: 'PM-KUSUM Subsidy Support' });
  } else {
    specs.push({ label: 'Execution', value: 'Turnkey Installation' });
  }
  return specs;
};

const buildBenefits = (item) => {
  if (Array.isArray(item.benefits) && item.benefits.length > 0) {
    return item.benefits;
  }
  return [
    'Engineered for maximum annual solar yield',
    'Tier-1 certified solar equipment and inverters',
    'Full installation warranty and support SLA',
    'Free site assessment and technical consultation'
  ];
};

const ServicesPage = () => {
  const [services, setServices] = useState(STATIC_SERVICES);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const activeOnly = data.filter((s) => s.isActive !== false);
          if (activeOnly.length > 0) {
            const formatted = activeOnly.map((item, idx) => ({
              id: item._id || idx,
              number: String(idx + 1).padStart(2, '0'),
              title: item.title,
              category: item.category || 'Solar',
              desc: item.shortDesc || item.fullDesc || item.desc || 'High-performance solar solution engineered for maximum efficiency.',
              price: item.price || 'Custom Quote',
              image: item.image,
              icon: getServiceIcon(item.category),
              specs: buildSpecs(item),
              benefits: buildBenefits(item),
            }));
            setServices(formatted);
          }
        }
      } catch (err) {
        console.warn('Could not load services from API, using default list:', err);
      }
    };
    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <SEOHead
        title="Our Solar Services | SPC Solar"
        description="Explore residential, commercial, and industrial solar panel installation services. Comprehensive EPC and AMC solutions by SPC Solar."
      />

      <PageHero
        label="Comprehensive Solar Solutions"
        title="OUR "
        highlight="SERVICES"
        subtitle="Hover over or tap each service to view technical specifications, subsidies, and benefits."
      />

      <section className="py-8 sm:py-12 lg:py-16 bg-white text-black relative overflow-hidden border-b border-gray-100">
        {/* Background Energy Grid */}
        <EnergyGrid opacity={0.03} color="black" />

        {/* Ambient Red Glow */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-red/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-red/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* DYNAMIC SERVICES DISPLAYED VERTICALLY */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {services.map((service, index) => {
              const Icon = service.icon || FiZap;
              const isActive = activeServiceIndex === index;

              return (
                <div
                  key={service.id || service.number || index}
                  onMouseEnter={() => setActiveServiceIndex(index)}
                  onClick={() => setActiveServiceIndex(index)}
                  className={`relative rounded-xl sm:rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer border ${
                    isActive
                      ? 'bg-white border-red shadow-[0_12px_40px_rgba(204,34,34,0.12)] ring-1 ring-red/30'
                      : 'bg-gray-50/80 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md'
                  }`}
                >
                  {/* Subtle red accent line at the left */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1 sm:w-1.5 transition-all duration-300 ${
                    isActive ? 'bg-red shadow-[0_0_12px_#CC2222]' : 'bg-transparent'
                  }`} />

                  {/* Header Bar (Always visible) */}
                  <div className="p-3 sm:p-5 md:p-6 flex items-center justify-between gap-2.5 sm:gap-4">
                    <div className="flex items-center gap-2.5 sm:gap-5 min-w-0">
                      {/* Number */}
                      <span className={`font-heading text-lg sm:text-2xl md:text-3xl font-bold transition-colors ${
                        isActive ? 'text-red' : 'text-black'
                      }`}>
                        {service.number}
                      </span>

                      {/* Icon */}
                      <div className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                        isActive
                          ? 'bg-red text-white shadow-lg shadow-red/30 scale-105'
                          : 'bg-white border border-gray-200 text-gray-700 shadow-sm'
                      }`}>
                        <Icon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </div>

                      {/* Title & Category */}
                      <div className="min-w-0">
                        <span className="text-[9px] font-accent font-semibold tracking-wider uppercase text-gray-500 block sm:hidden">
                          {service.category || `Service ${service.number}`}
                        </span>
                        <h3 className={`font-heading text-xs sm:text-lg md:text-2xl font-bold truncate transition-colors ${
                          isActive ? 'text-black' : 'text-gray-800'
                        }`}>
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {/* Right side: Starting Price badge + Expand indicator */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div className="bg-white border border-gray-200 shadow-sm px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-right">
                        <p className="text-[8px] sm:text-[10px] text-gray-500 font-body leading-none mb-0.5">From</p>
                        <p className="text-[11px] sm:text-sm text-red font-accent font-bold leading-none">{service.price}</p>
                      </div>

                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                        isActive ? 'bg-red text-white rotate-180 shadow-md shadow-red/20' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <FiChevronDown size={14} className="sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Specifications Area */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="px-3 pb-4 sm:px-6 sm:pb-6 md:px-7 md:pb-7 pt-1 border-t border-gray-100"
                    >
                      {/* Optional Service Image */}
                      {service.image && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-gray-200/80 bg-gray-50 shadow-inner">
                          <img
                            src={formatImageUrl(service.image)}
                            alt={service.title}
                            className="w-full h-44 sm:h-56 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-gray-600 font-body text-[11px] sm:text-sm leading-relaxed mb-3.5 sm:mb-5 max-w-3xl">
                        {service.desc}
                      </p>

                      {/* Specifications & Benefits Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4 mb-4 sm:mb-6">
                        {/* Technical Specifications */}
                        <div className="bg-gray-50/90 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-1.5 border-b border-gray-200">
                            <FiZap size={13} className="text-amber-500" />
                            <h4 className="text-[10px] sm:text-xs font-accent font-bold uppercase tracking-wider text-gray-900">
                              Technical Specifications
                            </h4>
                          </div>
                          <div className="space-y-1 sm:space-y-2">
                            {service.specs.map((spec, sIdx) => (
                              <div key={sIdx} className="flex items-center justify-between text-[11px] sm:text-xs py-0.5 sm:py-1 border-b border-gray-200/60 last:border-0">
                                <span className="text-gray-500 font-body">{spec.label}</span>
                                <span className="text-gray-900 font-accent font-semibold text-right">{spec.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Benefits */}
                        <div className="bg-gray-50/90 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-1.5 border-b border-gray-200">
                            <FiCheckCircle size={13} className="text-red" />
                            <h4 className="text-[10px] sm:text-xs font-accent font-bold uppercase tracking-wider text-gray-900">
                              Key Benefits & Guarantees
                            </h4>
                          </div>
                          <ul className="space-y-1.5 sm:space-y-2">
                            {service.benefits.map((benefit, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2 text-[11px] sm:text-xs text-gray-700 font-body">
                                <FiCheckCircle size={13} className="text-red flex-shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                        <Link to="/quotation" className="block sm:inline-block">
                          <Button
                            variant="primary"
                            size="md"
                            className="w-full sm:w-auto justify-center !py-2 sm:!py-3 !px-4 sm:!px-6 !text-[11px] sm:!text-sm shadow-md shadow-red/20"
                            icon={<FiArrowRight size={13} />}
                          >
                            Get Free Quote for {service.title}
                          </Button>
                        </Link>
                        <span className="text-[10px] sm:text-xs text-gray-500 font-body text-center sm:text-right">
                          Free Site Survey & ROI Calculation Included
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complete Package Details */}
      <section className="py-8 sm:py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-10 md:mb-16">
             <span className="section-label text-red font-accent font-bold text-[10px] sm:text-xs uppercase tracking-widest block mb-1.5">
               Our Offerings
             </span>
             <h2 className="font-heading text-lg sm:text-2xl md:text-4xl text-black mb-2 sm:mb-4 mt-1">
               Comprehensive Installation Package
             </h2>
             <span className="block w-12 sm:w-16 h-px bg-red mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-12">
             <Reveal variant="slideLeft">
               <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-card shadow-sm border border-gray-100 h-full">
                  <h3 className="font-heading text-lg sm:text-xl md:text-2xl mb-3 sm:mb-5 md:mb-6 text-black">
                    Panel Building Components
                  </h3>
                  <ul className="space-y-2.5 sm:space-y-3.5 md:space-y-4">
                    <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-700 leading-snug">
                      <FiCheckCircle className="text-red flex-shrink-0 mt-0.5 w-4 h-4" />
                      <span><strong>Solar Panel:</strong> Premium Bifacial Tropicane Panels with 30-year warranty</span>
                    </li>
                    <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-700 leading-snug">
                      <FiCheckCircle className="text-red flex-shrink-0 mt-0.5 w-4 h-4" />
                      <span><strong>Battery:</strong> High-efficiency storage (for Hybrid/Off-grid)</span>
                    </li>
                    <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-700 leading-snug">
                      <FiCheckCircle className="text-red flex-shrink-0 mt-0.5 w-4 h-4" />
                      <span><strong>Inverter:</strong> Tier-1 smart inverters</span>
                    </li>
                    <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-700 leading-snug">
                      <FiCheckCircle className="text-red flex-shrink-0 mt-0.5 w-4 h-4" />
                      <span><strong>ACDB and DCDB box:</strong> Advanced safety enclosures</span>
                    </li>
                    <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-700 leading-snug">
                      <FiCheckCircle className="text-red flex-shrink-0 mt-0.5 w-4 h-4" />
                      <span><strong>Cables:</strong> Industrial-grade UV-protected wiring</span>
                    </li>
                  </ul>
               </div>
             </Reveal>
             
             <Reveal variant="slideRight">
               <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-card shadow-sm border border-gray-100 h-full">
                  <h3 className="font-heading text-lg sm:text-xl md:text-2xl mb-3 sm:mb-5 md:mb-6 text-black">
                    System Types
                  </h3>
                  <div className="space-y-2.5 sm:space-y-3.5 md:space-y-6">
                    <div className="p-3 sm:p-3.5 md:p-4 bg-gray-50 hover:bg-red/5 rounded-lg border border-gray-200 transition-colors">
                      <h4 className="font-heading text-sm sm:text-base md:text-lg text-black font-semibold">
                        On Grid (Grid-Tied)
                      </h4>
                      <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 font-body mt-0.5">
                        EB needed • <span className="text-green-600 font-bold">Subsidy Applicable</span>
                      </p>
                    </div>
                    <div className="p-3 sm:p-3.5 md:p-4 bg-gray-50 hover:bg-red/5 rounded-lg border border-gray-200 transition-colors">
                      <h4 className="font-heading text-sm sm:text-base md:text-lg text-black font-semibold">
                        Off Grid (Stand-Alone)
                      </h4>
                      <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 font-body mt-0.5">
                        EB not needed • No Subsidy
                      </p>
                    </div>
                    <div className="p-3 sm:p-3.5 md:p-4 bg-gray-50 hover:bg-red/5 rounded-lg border border-gray-200 transition-colors">
                      <h4 className="font-heading text-sm sm:text-base md:text-lg text-black font-semibold">
                        Hybrid
                      </h4>
                      <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 font-body mt-0.5">
                        Mixed capabilities • <span className="text-green-600 font-bold">Subsidy Applicable</span>
                      </p>
                    </div>
                  </div>
               </div>
             </Reveal>
          </div>
          
          {/* 3 Distinct Value & Service Cards */}
          <div className="mt-6 sm:mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6">
            {/* Card 1: Pricing & Charges */}
            <div className="relative bg-[#0d0d0d] text-white p-5 sm:p-6 md:p-8 rounded-2xl border border-white/10 hover:border-red/40 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-red/5 flex flex-col items-center text-center overflow-hidden group">
              <EnergyGrid opacity={0.07} color="white" />
              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-red/10 border border-red/20 group-hover:bg-red text-red group-hover:text-white flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300">
                  <FiActivity size={22} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h4 className="font-heading text-base sm:text-lg md:text-xl font-bold text-white mb-2">
                  Pricing & Charges
                </h4>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-gray-300">
                    Transportation: <strong className="text-white font-bold">Free</strong>
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400">
                    Extra Height: Additional Charges Apply
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Service Areas */}
            <div className="relative bg-[#0d0d0d] text-white p-5 sm:p-6 md:p-8 rounded-2xl border border-white/10 hover:border-red/40 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-red/5 flex flex-col items-center text-center overflow-hidden group">
              <EnergyGrid opacity={0.07} color="white" />
              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-red/10 border border-red/20 group-hover:bg-red text-red group-hover:text-white flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300">
                  <FiHome size={22} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h4 className="font-heading text-base sm:text-lg md:text-xl font-bold text-white mb-2">
                  Service Areas
                </h4>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-gray-300 font-medium">
                    Inside Tamil Nadu
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400">
                    Andaman & Nicobar Islands
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Value Adds */}
            <div className="relative bg-[#0d0d0d] text-white p-5 sm:p-6 md:p-8 rounded-2xl border border-white/10 hover:border-red/40 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-red/5 flex flex-col items-center text-center overflow-hidden group">
              <EnergyGrid opacity={0.07} color="white" />
              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-red/10 border border-red/20 group-hover:bg-red text-red group-hover:text-white flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300">
                  <FiBriefcase size={22} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h4 className="font-heading text-base sm:text-lg md:text-xl font-bold text-white mb-2">
                  Value Adds
                </h4>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-white font-semibold">
                    1 Year Free Services
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-300">
                    Onsite Free Consultation
                  </p>
                  <p className="text-[11px] sm:text-xs text-red font-bold pt-0.5">
                    Loans from all national banks available
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <ReferralCard className="mt-8 sm:mt-12 md:mt-16" />
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
