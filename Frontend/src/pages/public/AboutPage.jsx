import React from 'react';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import { Reveal, Stagger, AnimatedCounter, EnergyGrid } from '../../components/motion';
import { 
  FiCheckCircle, 
  FiSun, 
  FiShield, 
  FiDollarSign, 
  FiAward, 
  FiZap, 
  FiClock, 
  FiUsers, 
  FiGlobe 
} from 'react-icons/fi';

const LEADERSHIP = [
  {
    name: 'Benny Wilson',
    role: 'Managing Director',
    image: '/uploads/benny-wilson.png',
    fallbackImage: 'http://localhost:5000/uploads/17221315-5e57-4946-bcf8-32b2bbd4328d.png',
  },
  {
    name: 'Pavan Karthik',
    role: 'Managing Director',
    image: '/uploads/pavan-karthik.png',
    fallbackImage: 'http://localhost:5000/uploads/Professional%20Studio%20Portrait%20in%20Suit.png',
  },
];

const MISSION_PILLARS = [
  {
    icon: FiSun,
    title: 'Clean Energy Transition',
    desc: 'Empowering residential, commercial, and industrial clients with high-efficiency rooftop solar systems that drastically reduce carbon footprints.',
  },
  {
    icon: FiShield,
    title: 'Engineering Excellence',
    desc: 'Built using Tier-1 monocrystalline panels, top-brand string inverters, and heavy-duty galvanized mounting structures rated for 150+ km/h winds.',
  },
  {
    icon: FiDollarSign,
    title: 'Maximized Subsidies & ROI',
    desc: 'Direct DBT subsidy assistance up to ₹78,000 under PM Surya Ghar Muft Bijli Yojana, cutting power bills up to 90% with a rapid 3-year payback.',
  },
  {
    icon: FiAward,
    title: 'Tier-1 Certified Quality',
    desc: 'Government MNRE-approved channel partner and authorized vendor with exclusive Tier-1 manufacturer partnerships backed by 25-year performance warranties.',
  },
  {
    icon: FiZap,
    title: 'Seamless Net-Metering',
    desc: 'Turnkey end-to-end execution—we manage site engineering, state discom liaison, meter testing, and bidirectional net-meter grid synchronization.',
  },
  {
    icon: FiClock,
    title: '24/7 Monitoring & AMC',
    desc: 'Real-time solar generation tracking via mobile app, active performance diagnostics, preventive panel maintenance, and rapid technician dispatch.',
  },
  {
    icon: FiUsers,
    title: 'Transparent & Customer First',
    desc: 'Dedicated single point-of-contact project managers, transparent fixed pricing without hidden fees, and lifetime advisory on energy optimization.',
  },
  {
    icon: FiGlobe,
    title: 'Sustainable Green Future',
    desc: 'Committed to India’s green energy revolution by offsetting thousands of tons of CO2 emissions annually for a resilient, eco-friendly tomorrow.',
  },
];

const STATS = [
  { value: '2010', suffix: '', label: 'Since' },
  { value: '1000', suffix: '+', label: 'Projects Completed' },
  { value: '12', suffix: ' MW', label: 'Installed Capacity' },
  { value: '100', suffix: '%', label: 'Client Satisfaction' },
];

const AboutPage = () => {
  return (
    <div>
      <SEOHead
        title="About Us | SPC Solar"
        description="Learn more about SPC Solar, our mission, vision, and journey in providing clean and sustainable energy solutions across India."
      />

      <PageHero
        label="Our Story"
        title="ABOUT SPC "
        highlight="SOLAR"
        subtitle="Empowering the nation with clean, sustainable, and affordable solar energy solutions."
      />

      {/* 1. Leadership Photos (Left) & Our Journey (Right) — Side by Side */}
      <section className="py-10 sm:py-14 md:py-20 bg-white relative overflow-hidden">
        <EnergyGrid opacity={0.025} color="black" />

        {/* Dynamic Color Gradients in Empty Space */}
        <div className="absolute top-1/2 -left-20 sm:-left-32 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-red-500/15 via-rose-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 sm:-right-32 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-bl from-amber-500/15 via-orange-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: 2 Managing Directors Photos Side-by-Side */}
            <div className="lg:col-span-5">
              <div className="mb-4">
                <span className="section-label">Executive Leadership</span>
                <h3 className="text-xl sm:text-2xl font-heading tracking-wide uppercase text-black">
                  MANAGING <span className="text-red">DIRECTORS</span>
                </h3>
                <span className="red-line mb-4" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {LEADERSHIP.map((leader) => (
                  <div
                    key={leader.name}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 flex flex-col hover:-translate-y-1"
                  >
                    {/* Portrait Container */}
                    <div className="relative aspect-[1103/1350] w-full bg-white overflow-hidden flex items-center justify-center p-2 border-b border-gray-100">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        onError={(e) => {
                          if (leader.fallbackImage && e.currentTarget.src !== leader.fallbackImage) {
                            e.currentTarget.src = leader.fallbackImage;
                          }
                        }}
                        className="w-full h-full object-contain object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3 text-center bg-white">
                      <span className="inline-block bg-red-50 text-red-600 border border-red-200/80 font-accent font-bold text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                        {leader.role}
                      </span>
                      <h4 className="font-heading text-sm sm:text-base text-black font-bold tracking-tight line-clamp-1">
                        {leader.name}
                      </h4>
                      <p className="text-gray-500 font-accent text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5">
                        SPC Solar
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Our Journey */}
            <div className="lg:col-span-7">
              <Reveal variant="slideRight">
                <div>
                  <span className="section-label">Who We Are</span>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading tracking-wide uppercase leading-tight md:leading-none text-black mb-3 md:mb-4">
                    Our <span className="text-red">Journey</span>
                  </h2>
                  <span className="red-line mb-4" />
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 font-body leading-relaxed mb-4">
                    Founded with a vision to make solar energy accessible to every household and business,
                    SPC Solar has grown into a trusted name in the renewable energy sector since 2010. Led by Managing Directors Benny Wilson and Pavan Karthik, we believe that the transition to green energy should be seamless, profitable, and uncompromising in quality.
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 font-body leading-relaxed mb-6">
                    As an authorized installer for the PM Surya Ghar scheme and an MNRE-approved vendor,
                    we adhere strictly to government guidelines to bring you the best subsidies and highest-quality
                    Tier-1 solar systems. We also hold an exclusive tie-up with Adani for premium components.
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <FiCheckCircle className="text-red flex-shrink-0" size={18} />
                      <span className="text-xs font-semibold text-gray-800">MNRE & PM Surya Ghar Approved</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <FiCheckCircle className="text-red flex-shrink-0" size={18} />
                      <span className="text-xs font-semibold text-gray-800">Direct Adani Solar Tie-Up</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <FiCheckCircle className="text-red flex-shrink-0" size={18} />
                      <span className="text-xs font-semibold text-gray-800">1000+ Commissioned Plants</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <FiCheckCircle className="text-red flex-shrink-0" size={18} />
                      <span className="text-xs font-semibold text-gray-800">25-Year Performance Warranty</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Our Mission (Full Width with Rich Details — Matching User Sketch) */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 border-t border-b border-gray-200/80 relative overflow-hidden">
        <EnergyGrid opacity={0.02} color="black" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-10 sm:mb-14">
              <span className="section-label">Vision & Strategic Purpose</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading tracking-wide uppercase text-black">
                OUR <span className="text-red">MISSION</span>
              </h2>
              <span className="red-line-center" />
              <div className="max-w-3xl mx-auto bg-white p-5 sm:p-7 rounded-2xl border border-gray-200 shadow-sm mt-4">
                <p className="text-sm sm:text-base md:text-lg text-gray-800 font-body italic leading-relaxed text-center">
                  "To accelerate India’s clean energy transition by delivering high-performance, cost-effective, and Tier-1 certified rooftop solar solutions—empowering every home and enterprise with total energy independence and uncompromising execution quality."
                </p>
              </div>
            </div>
          </Reveal>

          {/* 8 Detailed Mission Pillars (2 in a Row on Mobile, 4 in a Row on Desktop) */}
          <Stagger className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {MISSION_PILLARS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="h-full bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-5 md:p-6 border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-red/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-red-50 text-red flex items-center justify-center mb-2 sm:mb-4">
                      <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                    </div>
                    <h3 className="font-heading text-xs sm:text-base md:text-lg text-black font-bold mb-1.5 sm:mb-2 line-clamp-2 leading-tight sm:leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[10.5px] sm:text-xs md:text-sm text-gray-600 font-body leading-snug sm:leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-12 md:py-16 bg-red relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.8'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <Stagger className="grid grid-cols-4 gap-1.5 sm:gap-4 md:gap-8 text-center text-white">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-0.5">
                <div className="font-heading text-xl sm:text-3xl md:text-5xl lg:text-6xl mb-1 md:mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="font-heading uppercase tracking-wider text-[9px] sm:text-xs md:text-sm text-white/80 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
