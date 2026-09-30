import React from 'react';
import SEOHead from '../../components/ui/SEOHead';
import Card from '../../components/ui/Card';
import { FiHome, FiBriefcase, FiSettings, FiActivity } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const services = [
    {
      icon: <FiHome size={48} />,
      title: "Residential Solar (Rooftop)",
      desc: "Transform your unused roof into a power plant. Generate your own electricity, drastically reduce your monthly bills, and increase the value of your property.",
      benefits: ["Up to 100% reduction in electricity bills", "PM Surya Ghar subsidy up to ₹78,000", "Increases property value", "Net-metering support"],
      startingPrice: "₹65,000 / kW"
    },
    {
      icon: <FiBriefcase size={48} />,
      title: "Commercial Solar",
      desc: "Empower your business with clean energy. Lock in your energy costs for the next 25 years and achieve your ESG (Environmental, Social, and Governance) goals.",
      benefits: ["Accelerated depreciation benefits (up to 40%)", "Protection against tariff hikes", "Quick ROI (3-4 years)", "Green building certifications"],
      startingPrice: "₹58,000 / kW"
    },
    {
      icon: <FiSettings size={48} />,
      title: "Industrial Solar",
      desc: "Large scale megawatt installations designed for maximum efficiency and durability. We handle complex engineering, procurement, and construction (EPC).",
      benefits: ["Significant operational cost savings", "Custom engineered designs", "High capacity plant optimization", "Seamless grid integration"],
      startingPrice: "₹55,000 / kW"
    },
    {
      icon: <FiActivity size={48} />,
      title: "AMC & Maintenance",
      desc: "Keep your solar plant operating at peak efficiency. We offer continuous monitoring, professional panel cleaning, and preventive maintenance.",
      benefits: ["24/7 remote monitoring", "Periodic cleaning schedules", "Preventive & corrective maintenance", "Detailed generation reports"],
      startingPrice: "Custom Quote"
    }
  ];

  return (
    <div className="bg-bg">
      <SEOHead 
        title="Our Solar Services | SPC Solar" 
        description="Explore our residential, commercial, and industrial solar panel installation services. Comprehensive EPC and AMC solutions by SPC Solar."
      />
      
      <section className="bg-black py-20 text-center border-b-4 border-red text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading mb-4">OUR SERVICES</h1>
          <p className="text-xl text-gray-light font-body">
            End-to-end solar solutions tailored for every energy requirement.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.map((service, index) => (
            <div key={index} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/2">
                <Card className="h-full bg-surface border-none shadow-none text-center py-16">
                  <div className="text-red flex justify-center mb-6">{service.icon}</div>
                  <h3 className="text-3xl font-heading mb-2">{service.title}</h3>
                  <div className="inline-block bg-white px-4 py-2 mt-4 font-accent font-bold border border-gray-light rounded-sm">
                    Starting from: <span className="text-red">{service.startingPrice}</span>
                  </div>
                </Card>
              </div>
              
              <div className="w-full md:w-1/2">
                <h3 className="text-3xl font-heading mb-4">{service.title} Details</h3>
                <p className="text-gray mb-6 leading-relaxed">{service.desc}</p>
                
                <h4 className="text-lg font-heading mb-4 text-black">Key Benefits</h4>
                <ul className="space-y-2 mb-8">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-red mr-3">•</span>
                      <span className="text-gray">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/quotation">
                  <Button variant="outline">Get a Quote for this</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
