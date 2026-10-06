import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import Button from '../../components/ui/Button';
import { Reveal, EnergyGrid } from '../../components/motion';
import { FiHome, FiBriefcase, FiSettings, FiActivity, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const SERVICES = [
  {
    icon: FiHome,
    number: '01',
    title: 'Residential Solar (Rooftop)',
    desc: 'Transform your unused roof into a power plant. Generate your own electricity, drastically reduce monthly bills, and increase property value.',
    benefits: [
      'Up to 100% reduction in electricity bills',
      'PM Surya Ghar subsidy up to ₹78,000',
      'Increases property value',
      'Net-metering support',
    ],
    price: '₹65,000 / kW',
  },
  {
    icon: FiBriefcase,
    number: '02',
    title: 'Commercial Solar',
    desc: 'Empower your business with clean energy. Lock in your energy costs for the next 25 years and achieve your ESG goals.',
    benefits: [
      'Accelerated depreciation benefits (up to 40%)',
      'Protection against tariff hikes',
      'Quick ROI (3–4 years)',
      'Green building certifications',
    ],
    price: '₹58,000 / kW',
  },
  {
    icon: FiSettings,
    number: '03',
    title: 'Industrial Solar (EPC)',
    desc: 'Large-scale megawatt installations designed for maximum efficiency and durability — complete Engineering, Procurement, and Construction.',
    benefits: [
      'Significant operational cost savings',
      'Custom engineered designs',
      'High capacity plant optimization',
      'Seamless grid integration',
    ],
    price: '₹55,000 / kW',
  },
  {
    icon: FiActivity,
    number: '04',
    title: 'AMC & Maintenance',
    desc: 'Keep your solar plant operating at peak efficiency with continuous monitoring, professional panel cleaning, and preventive maintenance.',
    benefits: [
      '24/7 remote monitoring',
      'Periodic cleaning schedules',
      'Preventive & corrective maintenance',
      'Detailed generation reports',
    ],
    price: 'Custom Quote',
  },
];

const ServicesPage = () => {
  return (
    <div>
      <SEOHead
        title="Our Solar Services | SPC Solar"
        description="Explore residential, commercial, and industrial solar panel installation services. Comprehensive EPC and AMC solutions by SPC Solar."
      />

      <PageHero
        label="What We Offer"
        title="OUR "
        highlight="SERVICES"
        subtitle="End-to-end solar solutions tailored for every energy requirement — from rooftop to industrial scale."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const isReversed = index % 2 !== 0;

            return (
              <Reveal key={service.number} variant={isReversed ? 'slideRight' : 'slideLeft'}>
                <div className={`flex flex-col lg:flex-row gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Visual card */}
                  <div className="w-full lg:w-5/12 flex-shrink-0">
                    <div className="relative bg-black rounded-card p-12 text-center overflow-hidden">
                      <EnergyGrid opacity={0.06} color="white" />
                      <div className="relative">
                        {/* Number */}
                        <span className="absolute -top-4 -left-2 font-heading text-8xl text-white/4 leading-none select-none">
                          {service.number}
                        </span>
                        {/* Icon */}
                        <div className="w-20 h-20 bg-red/10 border border-red/20 rounded-sm flex items-center justify-center text-red mx-auto mb-6">
                          <Icon size={36} />
                        </div>
                        <h3 className="font-heading text-2xl text-white mb-4">{service.title}</h3>
                        {/* Price badge */}
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-sm">
                          <span className="text-gray-400 font-body text-xs">Starting from</span>
                          <span className="text-red font-accent font-bold text-sm">{service.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-7/12">
                    <span className="text-red font-accent font-bold text-xs uppercase tracking-widest mb-2 block">
                      Service {service.number}
                    </span>
                    <h2 className="font-heading text-4xl text-black mb-4">{service.title}</h2>
                    <span className="block w-10 h-px bg-red mb-5" />
                    <p className="text-gray-500 font-body leading-relaxed mb-8">{service.desc}</p>

                    <h4 className="font-heading text-base text-black mb-4 uppercase tracking-wider">Key Benefits</h4>
                    <ul className="space-y-3 mb-8">
                      {service.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <FiCheckCircle size={16} className="text-red flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 font-body text-sm">{b}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/quotation">
                      <Button variant="outline" icon={<FiArrowRight />}>
                        Get a Quote
                      </Button>
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Complete Package Details */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <span className="section-label text-red font-accent font-bold text-xs uppercase tracking-widest block mb-2">Our Offerings</span>
             <h2 className="font-heading text-4xl text-black mb-4 mt-2">Comprehensive Installation Package</h2>
             <span className="block w-16 h-px bg-red mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <Reveal variant="slideLeft">
               <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100">
                  <h3 className="font-heading text-2xl mb-6">Panel Building Components</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-red flex-shrink-0" /> <strong>Solar Panel:</strong> Premium Bifacial Tropicane Panels with 30-year warranty</li>
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-red flex-shrink-0" /> <strong>Battery:</strong> High-efficiency storage (for Hybrid/Off-grid)</li>
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-red flex-shrink-0" /> <strong>Inverter:</strong> Tier-1 smart inverters</li>
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-red flex-shrink-0" /> <strong>ACDB and DCDB box:</strong> Advanced safety enclosures</li>
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-red flex-shrink-0" /> <strong>Cables:</strong> Industrial-grade UV-protected wiring</li>
                  </ul>
               </div>
             </Reveal>
             
             <Reveal variant="slideRight">
               <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100">
                  <h3 className="font-heading text-2xl mb-6">System Types</h3>
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-heading text-lg">On Grid (Grid-Tied)</h4>
                      <p className="text-sm text-gray-500 font-body">EB needed • <span className="text-green-600 font-bold">Subsidy Applicable</span></p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-heading text-lg">Off Grid (Stand-Alone)</h4>
                      <p className="text-sm text-gray-500 font-body">EB not needed • No Subsidy</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-heading text-lg">Hybrid</h4>
                      <p className="text-sm text-gray-500 font-body">Mixed capabilities • <span className="text-green-600 font-bold">Subsidy Applicable</span></p>
                    </div>
                  </div>
               </div>
             </Reveal>
          </div>
          
          <div className="mt-16 bg-black text-white p-10 rounded-card grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative overflow-hidden">
             <EnergyGrid opacity={0.1} color="white" />
             <div className="relative z-10 space-y-2">
                <FiActivity size={32} className="text-red mx-auto mb-4" />
                <h4 className="font-heading text-xl">Pricing & Charges</h4>
                <p className="text-sm text-gray-400">Transportation: <strong>Free</strong></p>
                <p className="text-sm text-gray-400">Extra Height: Additional Charges Apply</p>
             </div>
             <div className="relative z-10 space-y-2">
                <FiHome size={32} className="text-red mx-auto mb-4" />
                <h4 className="font-heading text-xl">Service Areas</h4>
                <p className="text-sm text-gray-400">Inside Tamil Nadu</p>
                <p className="text-sm text-gray-400">Andaman & Nicobar Islands</p>
             </div>
             <div className="relative z-10 space-y-2">
                <FiBriefcase size={32} className="text-red mx-auto mb-4" />
                <h4 className="font-heading text-xl">Value Adds</h4>
                <p className="text-sm text-gray-400"><strong>1 Year Free Services</strong></p>
                <p className="text-sm text-gray-400">Onsite Free Consultation</p>
                <p className="text-sm text-red font-bold mt-2">Loans from all national banks available</p>
             </div>
          </div>
          
          <div className="mt-8 bg-green-50 border border-green-200 p-6 rounded-card text-center">
             <h4 className="font-heading text-xl text-green-800 mb-2">Refer & Earn Program!</h4>
             <p className="text-green-700 font-body">Earn <strong>₹2000 per 1kW</strong> for every successful referral (credited after getting full payment from the client).</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
