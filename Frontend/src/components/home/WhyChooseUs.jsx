import React from 'react';
import { FiShield, FiTrendingUp, FiTool, FiSun, FiAward, FiUsers } from 'react-icons/fi';

const WhyChooseUs = () => {
  const reasons = [
    { icon: <FiShield size={32} />, title: "Premium Quality", desc: "Tier-1 panels & inverters with 25-year warranty." },
    { icon: <FiTrendingUp size={32} />, title: "High ROI", desc: "System designed for maximum generation and savings." },
    { icon: <FiSun size={32} />, title: "Govt Subsidy", desc: "End-to-end support for PM Surya Ghar scheme up to ₹78k." },
    { icon: <FiTool size={32} />, title: "Expert Installation", desc: "Installed by certified and experienced engineers." },
    { icon: <FiUsers size={32} />, title: "Dedicated Support", desc: "24/7 customer service and quick grievance resolution." },
    { icon: <FiAward size={32} />, title: "MNRE Approved", desc: "Authorized vendor ensuring compliance and quality." },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">WHY CHOOSE SPC SOLAR</h2>
          <p className="text-gray max-w-2xl mx-auto font-body">
            We deliver uncompromising quality and seamless execution from site audit to net-metering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-start">
              <div className="bg-red-light text-red p-4 rounded-card mr-6">
                {reason.icon}
              </div>
              <div>
                <h3 className="font-heading text-xl mb-2">{reason.title}</h3>
                <p className="text-gray text-sm">{reason.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
