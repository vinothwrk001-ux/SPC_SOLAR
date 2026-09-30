import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const CTABanner = () => {
  return (
    <section className="py-20 bg-black text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-dark opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-6xl font-heading text-white mb-6">READY TO SWITCH TO SOLAR?</h2>
        <p className="text-gray-light font-body mb-8 text-lg max-w-2xl mx-auto">
          Get a detailed quotation with ROI analysis and subsidy estimation. Take the first step towards energy independence today.
        </p>
        <Link to="/quotation">
          <Button variant="primary" className="text-lg px-8 py-4">Get Free Quotation</Button>
        </Link>
      </div>
    </section>
  );
};

export default CTABanner;
