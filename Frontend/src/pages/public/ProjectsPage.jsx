import React, { useState, useEffect } from 'react';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import { Stagger, Reveal } from '../../components/motion';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { 
  FiMapPin, 
  FiZap, 
  FiSun, 
  FiCheckCircle, 
  FiHome, 
  FiBriefcase, 
  FiLayers, 
  FiCpu, 
  FiPhone, 
  FiArrowRight 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const DEFAULT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800';

const formatImageUrl = (url) => {
  if (!url) return DEFAULT_IMAGE_FALLBACK;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  if (url.startsWith('/uploads')) return `${baseUrl}${url}`;
  return `${baseUrl}/uploads/${url}`;
};

// Authentic Projects sourced directly from SPC Solar Corporate Portfolio PDF
const DEFAULT_PROJECTS = [
  {
    title: "Gamesa Solar Park",
    client: "Gamesa",
    capacity: "1500 kW",
    type: "Industrial",
    clientType: "Industrial",
    location: "Tamil Nadu",
    savings: "₹1.8 Cr/yr",
    description: "1,500 kW (1.5 MW) high-capacity utility-scale solar park commissioned for Gamesa, generating clean renewable power with high-voltage grid export.",
    image: "https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=1200",
    isFeatured: true
  },
  {
    title: "Nazareth Textile Mill",
    client: "Nazareth Textile Mill",
    capacity: "1000 kW",
    type: "Industrial",
    clientType: "Industrial",
    location: "Nazareth, Tamil Nadu",
    savings: "₹1.2 Cr/yr",
    description: "1,000 kW (1 MW) megawatt-scale textile mill solar power installation equipped with high-efficiency bi-facial panels and automated monitoring.",
    image: "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&q=80&w=1200",
    isFeatured: true
  },
  {
    title: "JYOTI Metal Solutions",
    client: "JYOTI - Total Metal Solution",
    capacity: "350 kW",
    type: "Industrial",
    clientType: "Industrial",
    location: "Tamil Nadu",
    savings: "₹42 L/yr",
    description: "350 kW industrial rooftop solar power plant designed for heavy fabrication and metal tooling operations.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200",
    isFeatured: true
  },
  {
    title: "G Square Group",
    client: "G Square Group",
    capacity: "320 Street Lights",
    type: "Infrastructure",
    clientType: "Infrastructure",
    location: "Tamil Nadu",
    savings: "₹15 L/yr",
    description: "320 standalone intelligent dusk-to-dawn solar street light installations across premium gated community townships for G Square Group.",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&q=80&w=1200",
    isFeatured: true
  },
  {
    title: "DMS Hospital",
    client: "DMS Hospital",
    capacity: "70 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Tamil Nadu",
    savings: "₹8.5 L/yr",
    description: "70 kW commercial rooftop solar setup providing 24/7 clean, dependable power to vital healthcare equipment and patient wards.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false
  },
  {
    title: "Jayapriya City Funds",
    client: "Jayapriya Constructions Pvt Ltd",
    capacity: "70 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Tamil Nadu",
    savings: "₹8.4 L/yr",
    description: "70 kW rooftop solar project for Jayapriya Constructions corporate office, eliminating peak commercial power tariffs.",
    image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false
  },
  {
    title: "St. Joan of Arc",
    client: "St. Joan of Arc Campus",
    capacity: "40 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Tamil Nadu",
    savings: "₹4.8 L/yr",
    description: "40 kW institutional solar installation powering classrooms, computer labs, and campus infrastructure.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false
  },
  {
    title: "IndianOil (Sholavur & Shanthi Plant)",
    client: "IndianOil",
    capacity: "25 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Sholavur, Tamil Nadu",
    savings: "₹3.2 L/yr",
    description: "Dual solar deployment for IndianOil Sholavur FIIT Station and Shanthi Water Plant facility.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false
  },
  {
    title: "Bharat Petroleum (Rajai Fuel Station)",
    client: "Bharat Petroleum (BPCL)",
    capacity: "10 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Chennai, Tamil Nadu",
    savings: "₹1.2 L/yr",
    description: "10 kW commercial solar canopy installation for BPCL Rajai Fuel Station in Chennai, supporting round-the-clock fuel operations.",
    image: "https://images.unsplash.com/photo-1527018606412-a613d017b271?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false
  },
  {
    title: "Hindustan Petroleum (Praba Agency)",
    client: "HP (Hindustan Petroleum)",
    capacity: "10 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Trichy, Tamil Nadu",
    savings: "₹1.2 L/yr",
    description: "10 kW commercial rooftop solar installation for HP Praba Agency in Trichy, lowering operational electricity expenditures.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false
  },
  {
    title: "Institutional Campus Solar Lights",
    client: "Educational Institution Campus",
    capacity: "100 Street Lights",
    type: "Infrastructure",
    clientType: "Infrastructure",
    location: "Tamil Nadu",
    savings: "₹5.0 L/yr",
    description: "100 automated solar street lights installed across institutional roadways, providing eco-friendly perimeter security illumination.",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false
  },
  {
    title: "Coimbatore Smart Villa Solar",
    client: "Residential Villa",
    capacity: "10 kW",
    type: "Residential",
    clientType: "Residential",
    location: "RS Puram, Coimbatore",
    savings: "₹1.1 L/yr",
    description: "10 kW premium on-grid rooftop solar system with bi-directional net-metering and PM Surya Ghar subsidy benefit.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false
  },
  {
    title: "Eco Green Residence",
    client: "Residential Homeowner",
    capacity: "5 kW",
    type: "Residential",
    clientType: "Residential",
    location: "Trichy, Tamil Nadu",
    savings: "₹65 K/yr",
    description: "5 kW rooftop solar plant reducing home electricity tariff by up to 90% with Tier-1 mono PERC panels.",
    image: "https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false
  },
  {
    title: "Agri-Solar Irrigation Farm",
    client: "Agro Farm Enterprise",
    capacity: "25 kW",
    type: "Industrial",
    clientType: "Industrial",
    location: "Thanjavur, Tamil Nadu",
    savings: "₹2.8 L/yr",
    description: "25 kW solar-powered agricultural pumping and drip irrigation array ensuring reliable daytime irrigation without grid outages.",
    image: "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false
  }
];

// Applications from Page 5 of Corporate PDF
const APPLICATION_DOMAINS = [
  {
    title: "Residential Solar",
    tagline: "Cleaner Homes, Brighter Living",
    icon: FiHome,
    desc: "Engineered rooftop solar panel systems designed for independent houses, villas, and apartments with PM Surya Ghar central subsidy up to ₹78,000.",
    badge: "PM Surya Ghar Eligible"
  },
  {
    title: "Commercial Solar",
    tagline: "Smart Energy, Stronger Growth",
    icon: FiBriefcase,
    desc: "Captive rooftop systems for corporate buildings, hospitals, educational campuses, and fuel stations slashing commercial grid tariff by up to 80%.",
    badge: "Accelerated Depreciation"
  },
  {
    title: "Industrial Megawatts",
    tagline: "Reliable Power, Higher Efficiency",
    icon: FiZap,
    desc: "Megawatt-scale ground-mounted and industrial shed solar installations for textile mills, metal plants, and manufacturing units with HT net metering.",
    badge: "MW Scale & HT Metering"
  },
  {
    title: "Infrastructure & Street Lighting",
    tagline: "Dusk-to-Dawn Intelligent Illumination",
    icon: FiSun,
    desc: "Over 420+ intelligent all-in-one solar street light systems installed across G Square townships, institutional campuses, and roadways.",
    badge: "Standalone Solar Lights"
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
    : projects.filter(p => {
        const pType = (p.type || p.clientType || '').toLowerCase();
        const f = filter.toLowerCase();
        if (f === 'infrastructure') {
          return pType.includes('infra') || (p.capacity && p.capacity.toLowerCase().includes('street light')) || p.title.toLowerCase().includes('street light');
        }
        return pType.includes(f) || (p.clientType && p.clientType.toLowerCase().includes(f));
      });

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead 
        title="Our Solar Projects & Client Portfolio | SPC Solar" 
        description="Browse landmark solar installations by SPC Solar across Tamil Nadu: Gamesa 1500 kW, Nazareth Mill 1000 kW, Jyoti 350 kW, IndianOil, G Square 320 Street Lights, and more."
      />

      <PageHero
        label="Official Portfolio"
        title="OUR "
        highlight="PROJECTS"
        subtitle="Explore our footprint of successfully commissioned utility-scale, commercial, industrial, residential, and infrastructure solar installations since 2010."
      />

      {/* ======================================================== */}
      {/* COMMISSIONED PROJECTS GALLERY GRID WITH IMAGES */}
      {/* ======================================================== */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
              <span className="section-label">Field Installations Since 2010</span>
              <h2 className="section-title">
                COMMISSIONED <span className="text-red">PROJECTS & CLIENTS</span>
              </h2>
              <span className="red-line mx-auto" />
              <p className="section-subtitle mx-auto">
                <strong className="text-black">Growing Together for a Brighter Tomorrow</strong> — Explore our landmark utility-scale, commercial, industrial, residential, and infrastructure solar projects across South India.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 md:gap-3 mb-8 sm:mb-12">
              {['All', 'Industrial', 'Commercial', 'Residential', 'Infrastructure'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 font-accent font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    filter.toLowerCase() === cat.toLowerCase()
                      ? 'bg-red border-red text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-black hover:text-black'
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
            <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
              <h3 className="font-heading text-xl text-black mb-2">No Projects Found</h3>
              <p className="text-gray-500 text-sm font-body">There are currently no projects listed under {filter}.</p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredProjects.map((project, index) => {
                const projectType = project.type || project.clientType || 'Residential';
                return (
                  <div key={project._id || index} className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-card border border-gray-200 hover:border-red hover:shadow-card-md transition-all duration-300 flex flex-col justify-between">
                    <div className="relative h-36 sm:h-48 md:h-60 overflow-hidden bg-gray-900 flex-shrink-0">
                      <motion.img
                        src={formatImageUrl(project.image)}
                        alt={project.title}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_IMAGE_FALLBACK;
                        }}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1.5 flex-wrap max-w-[85%]">
                        <span className="bg-black/80 backdrop-blur-sm text-white text-[9px] sm:text-[10px] md:text-xs font-accent font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 uppercase rounded-md border border-white/20">
                          {projectType}
                        </span>
                        {project.client && (
                          <span className="hidden sm:inline-block bg-red/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-accent font-bold px-2 py-0.5 rounded-md">
                            {project.client}
                          </span>
                        )}
                      </div>

                      {/* Savings Pill */}
                      {project.savings && (
                        <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-sm text-amber-300 border border-amber-300/30 text-[9px] sm:text-[10px] md:text-xs font-accent font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md flex items-center gap-1">
                          <FiZap size={11} className="text-amber-400" /> {project.savings}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 sm:p-4 md:p-5 flex flex-col justify-between flex-1">
                      <div>
                        {/* Client on mobile */}
                        {project.client && (
                          <span className="text-[10px] sm:text-xs font-accent font-bold text-red uppercase tracking-wider block mb-0.5 line-clamp-1">
                            {project.client}
                          </span>
                        )}

                        <h3 className="font-heading font-extrabold text-sm sm:text-base md:text-xl mb-1 text-gray-900 group-hover:text-red transition-colors line-clamp-1">
                          {project.title}
                        </h3>

                        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm mb-2 font-body flex items-center gap-1">
                          <FiMapPin className="text-gray-400 flex-shrink-0 w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span className="truncate">{project.location}</span>
                        </p>

                        {project.description && (
                          <p className="text-[10px] sm:text-xs text-gray-600 font-body line-clamp-2 leading-relaxed mb-3">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2.5 border-t border-gray-100 mt-auto">
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-accent text-gray-400 uppercase tracking-wider font-semibold">
                          System Size
                        </span>
                        <span className="font-accent font-black text-red text-xs sm:text-sm md:text-base bg-red/5 px-2 py-0.5 rounded border border-red/20">
                          {project.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Stagger>
          )}

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: APPLICATIONS & PRODUCT SOLUTIONS (From Page 5) */}
      {/* ======================================================== */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="section-label">Tailored Engineering</span>
              <h2 className="section-title">
                APPLICATIONS & <span className="text-red">SOLUTIONS</span>
              </h2>
              <span className="red-line mx-auto" />
              <p className="section-subtitle mx-auto">
                Comprehensive solar architecture customized for homes, commercial hubs, mega industries, and community infrastructure.
              </p>
            </div>
          </Reveal>

          {/* 4 Application Domains */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {APPLICATION_DOMAINS.map((domain, i) => {
              const Icon = domain.icon;
              return (
                <div 
                  key={domain.title} 
                  className="bg-gray-50 hover:bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 hover:border-red transition-all shadow-xs hover:shadow-card-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-red/10 text-red flex items-center justify-center mb-4">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-accent font-bold uppercase tracking-wider text-red bg-red/5 px-2 py-0.5 rounded-md border border-red/15 inline-block mb-2">
                      {domain.badge}
                    </span>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-gray-900 mb-1">
                      {domain.title}
                    </h3>
                    <p className="text-xs text-red font-semibold mb-2">
                      {domain.tagline}
                    </p>
                    <p className="text-xs text-gray-600 font-body leading-relaxed mb-4">
                      {domain.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Products & Technology Hardware Strip */}
          <div className="bg-linear-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-6 sm:p-8 text-white border border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-accent font-bold uppercase tracking-widest text-red">Hardware Excellence</span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold mt-1">Our Products & Technology Stack</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-body max-w-xl mt-1">
                  Tier-1 Mono PERC Bi-facial Panels • On-Grid & Hybrid Inverters • Heavy Duty Hot-Dip Galvanized Structures • Lithium-Ion Storage • All-in-One Inverter Solutions
                </p>
              </div>

              <Link to="/quotation" className="shrink-0">
                <Button size="md" icon={<FiArrowRight />}>
                  Calculate Your Savings
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: OUR REGIONAL BRANCHES (From Page 6 of PDF) */}
      {/* ======================================================== */}
      <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="section-label">Local Presence Across Tamil Nadu</span>
            <h2 className="section-title">
              OUR <span className="text-red">BRANCHES</span>
            </h2>
            <span className="red-line mx-auto" />
            <p className="section-subtitle mx-auto">
              Headquartered in Coimbatore with dedicated field installation and service hubs across Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Coimbatore HQ */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin className="text-red shrink-0" size={18} />
                  <h4 className="font-heading font-bold text-gray-900 text-sm sm:text-base">Coimbatore (HQ)</h4>
                </div>
                <p className="text-xs text-gray-600 font-body leading-relaxed mb-3">
                  NO: 115-117, Easwari Towers, Devanga High School Road, RS Puram, Coimbatore - 641002.
                </p>
              </div>
              <div className="pt-2 border-t border-gray-100 text-[11px] font-semibold text-gray-800">
                📞 <a href="tel:+918098744044" className="hover:text-red">+91 80987 44044 (Office)</a>
              </div>
            </div>

            {/* Trichy Branch */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin className="text-red shrink-0" size={18} />
                  <h4 className="font-heading font-bold text-gray-900 text-sm sm:text-base">Trichy Branch</h4>
                </div>
                <p className="text-xs text-gray-600 font-body leading-relaxed mb-3">
                  No: 175, Sri Ramadevi Building, 10th Cross West Extension, Thillai Nagar, Trichy - 620018.
                </p>
              </div>
              <div className="pt-2 border-t border-gray-100 text-[11px] font-semibold text-gray-800">
                📞 <a href="tel:+918489644044" className="hover:text-red">+91 84896 44044</a>
              </div>
            </div>

            {/* Thanjavur Hub */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin className="text-red shrink-0" size={18} />
                  <h4 className="font-heading font-bold text-gray-900 text-sm sm:text-base">Thanjavur Service Hub</h4>
                </div>
                <p className="text-xs text-gray-600 font-body leading-relaxed mb-3">
                  Dedicated regional field engineering team handling Delta & Cauvery basin installations.
                </p>
              </div>
              <div className="pt-2 border-t border-gray-100 text-[11px] font-semibold text-gray-800">
                📞 <a href="tel:+918489744044" className="hover:text-red">+91 84897 44044</a>
              </div>
            </div>

            {/* Chennai Hub */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin className="text-red shrink-0" size={18} />
                  <h4 className="font-heading font-bold text-gray-900 text-sm sm:text-base">Chennai Service Hub</h4>
                </div>
                <p className="text-xs text-gray-600 font-body leading-relaxed mb-3">
                  Commercial & industrial project engineering desk covering Greater Chennai & coastal corridors.
                </p>
              </div>
              <div className="pt-2 border-t border-gray-100 text-[11px] font-semibold text-gray-800">
                📞 <a href="tel:+918098744044" className="hover:text-red">+91 80987 44044</a>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ProjectsPage;
