import React from 'react';
import { FiShield, FiTrendingUp, FiTool, FiSun, FiAward, FiUsers } from 'react-icons/fi';
import { Reveal, Stagger, EnergyGrid } from '../motion';

const REASONS = [
  { icon: FiShield, title: 'Premium Quality', desc: 'Tier-1 panels & inverters with 30-year performance warranty guaranteed.' },
  { icon: FiTrendingUp, title: 'High ROI', desc: 'System designed for maximum generation — payback in 3–5 years.' },
  { icon: FiSun, title: 'Govt Subsidy', desc: 'End-to-end support for PM Surya Ghar scheme — up to ₹78,000.' },
  { icon: FiTool, title: 'Expert Installation', desc: 'Installed by MNRE-certified and experienced engineers.' },
  { icon: FiUsers, title: 'Dedicated Support', desc: '24/7 customer service and quick grievance resolution.' },
  { icon: FiAward, title: 'MNRE Approved', desc: 'Authorized vendor ensuring compliance, safety, and quality.' },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 bg-black relative overflow-hidden">
      <EnergyGrid opacity={0.05} color="white" />

      {/* Red glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-red/4 rounded-full blur-3xl pointer-events-none" />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-12 md:mb-20">
            <span className="section-label">Our Advantage</span>
            <h2 className="section-title">
              WHY CHOOSE{' '}
              <span className="text-red">SPC SOLAR</span>
            </h2>
            <span className="red-line-center" />
            <p className="section-subtitle text-gray-400 mx-auto">
              We deliver uncompromising quality and seamless execution from site audit to net-metering.
            </p>
          </div>
        </Reveal>

        {/* Reasons grid */}
        <Stagger stagger={0.09} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="group relative bg-white/3 border border-white/8 rounded-card p-3.5 sm:p-5 md:p-7 hover:border-red/30 hover:bg-white/5 transition-all duration-350 overflow-hidden flex flex-col justify-between h-full"
              >
                {/* Index */}
                <span className="absolute top-2 right-3 md:top-4 md:right-5 font-heading text-3xl sm:text-4xl md:text-5xl text-white/5 select-none pointer-events-none">
                  0{index + 1}
                </span>

                <div>
                  {/* Icon */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-sm bg-red/10 border border-red/20 flex items-center justify-center text-red mb-3 md:mb-5 group-hover:bg-red group-hover:border-red group-hover:text-white transition-all duration-350">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-sm sm:text-lg md:text-xl text-red mb-1.5 md:mb-2 leading-snug">
                    {reason.title}
                  </h3>
                  <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm font-body leading-relaxed">
                    {reason.desc}
                  </p>
                </div>

                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-red group-hover:w-full transition-[width] duration-500 ease-out" />
              </div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
};

export default WhyChooseUs;
