import React from 'react';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import { Reveal, Stagger, AnimatedCounter, EnergyGrid } from '../../components/motion';
import { FiCheckCircle } from 'react-icons/fi';

const CORE_VALUES = [
  'Integrity & Transparency',
  'Engineering Excellence',
  'Customer-Centric Approach',
  'Sustainable Future',
];

const STATS = [
  { value: '10', suffix: '+', label: 'Years Experience' },
  { value: '500', suffix: '+', label: 'Projects Delivered' },
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

      {/* Story & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <Reveal variant="slideLeft">
            <div>
              <span className="section-label">Who We Are</span>
              <h2 className="section-title mb-4">Our Journey</h2>
              <span className="red-line" />
              <p className="text-gray-500 font-body leading-relaxed mb-5">
                Founded with a vision to make solar energy accessible to every household and business,
                SPC Solar has grown into a trusted name in the renewable energy sector. We believe that
                the transition to green energy should be seamless, profitable, and uncompromising in quality.
              </p>
              <p className="text-gray-500 font-body leading-relaxed">
                As an authorized installer for the PM Surya Ghar scheme and an MNRE-approved vendor,
                we adhere strictly to government guidelines to bring you the best subsidies and highest-quality
                Tier-1 solar systems.
              </p>
            </div>
          </Reveal>

          <Reveal variant="slideRight" delay={0.1}>
            <div className="bg-gray-50 border border-gray-200 rounded-card p-8">
              <h3 className="font-heading text-2xl mb-2 text-red">Our Mission</h3>
              <span className="block w-8 h-px bg-red mb-5" />
              <p className="text-gray-600 font-body italic leading-relaxed mb-8">
                "To accelerate the adoption of solar energy by providing innovative, high-performance,
                and cost-effective solutions while ensuring an exceptional customer experience."
              </p>

              <h3 className="font-heading text-xl mb-4 text-black">Our Core Values</h3>
              <ul className="space-y-3">
                {CORE_VALUES.map((val) => (
                  <li key={val} className="flex items-center gap-3 text-gray-700 font-body text-sm">
                    <FiCheckCircle className="text-red flex-shrink-0" size={16} />
                    {val}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-red relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.8'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-5xl md:text-6xl mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="font-heading uppercase tracking-wider text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
