import React from 'react';
import SEOHead from '../../components/ui/SEOHead';
import { FiCheckCircle } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="bg-bg">
      <SEOHead 
        title="About Us | SPC Solar" 
        description="Learn more about SPC Solar, our mission, vision, and our journey in providing clean and sustainable energy solutions."
      />
      
      {/* Hero */}
      <section className="bg-black py-20 text-center border-b-4 border-red text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading mb-4">ABOUT SPC SOLAR</h1>
          <p className="text-xl text-gray-light font-body">
            Empowering the nation with clean, sustainable, and affordable solar energy solutions.
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading mb-6">Our Journey</h2>
            <p className="text-gray mb-6 leading-relaxed">
              Founded with a vision to make solar energy accessible to every household and business, SPC Solar has grown into a trusted name in the renewable energy sector. We believe that the transition to green energy should be seamless, profitable, and uncompromising in quality.
            </p>
            <p className="text-gray mb-6 leading-relaxed">
              As an authorized installer for the PM Surya Ghar scheme and an MNRE-approved vendor, we adhere strictly to government guidelines to bring you the best subsidies and the highest quality Tier-1 solar systems.
            </p>
          </div>
          <div>
            <div className="bg-surface p-8 rounded-card border border-gray-light">
              <h3 className="text-2xl font-heading mb-4 text-red">Our Mission</h3>
              <p className="text-black mb-8 italic">"To accelerate the adoption of solar energy by providing innovative, high-performance, and cost-effective solutions while ensuring an exceptional customer experience."</p>
              
              <h3 className="text-2xl font-heading mb-4 text-red">Our Core Values</h3>
              <ul className="space-y-3">
                {['Integrity & Transparency', 'Engineering Excellence', 'Customer-Centric Approach', 'Sustainable Future'].map((val, i) => (
                  <li key={i} className="flex items-center text-black">
                    <FiCheckCircle className="text-red mr-3" /> {val}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-red text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-5xl font-accent font-bold mb-2">10+</h3>
            <p className="font-heading tracking-wide uppercase text-sm">Years Experience</p>
          </div>
          <div>
            <h3 className="text-5xl font-accent font-bold mb-2">500+</h3>
            <p className="font-heading tracking-wide uppercase text-sm">Projects Delivered</p>
          </div>
          <div>
            <h3 className="text-5xl font-accent font-bold mb-2">12MW</h3>
            <p className="font-heading tracking-wide uppercase text-sm">Installed Capacity</p>
          </div>
          <div>
            <h3 className="text-5xl font-accent font-bold mb-2">100%</h3>
            <p className="font-heading tracking-wide uppercase text-sm">Client Satisfaction</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
