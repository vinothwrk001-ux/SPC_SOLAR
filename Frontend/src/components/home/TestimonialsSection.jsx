import React from 'react';
import Card from '../ui/Card';

const TestimonialsSection = () => {
  const testimonials = [
    { name: "Rahul Sharma", role: "Homeowner", quote: "Installed a 5kW system. My electricity bill went from ₹6000 to zero! Very professional team." },
    { name: "Meera Reddy", role: "Factory Owner", quote: "SPC Solar executed our 200kW project flawlessly without disrupting operations. Highly recommended." },
    { name: "Vikram Singh", role: "Resident", quote: "Got my subsidy processed seamlessly through them. Real experts in the field." }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">WHAT OUR CLIENTS SAY</h2>
          <div className="w-24 h-1 bg-red mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <p className="text-gray italic mb-6">"{test.quote}"</p>
              <div>
                <h4 className="font-heading text-lg">{test.name}</h4>
                <p className="text-sm font-accent text-red font-semibold">{test.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
