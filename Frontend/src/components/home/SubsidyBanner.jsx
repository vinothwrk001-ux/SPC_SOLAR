import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const SubsidyBanner = () => {
  return (
    <section className="bg-red py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="mb-6 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-heading text-white mb-2">
            Get Up to ₹78,000 Subsidy
          </h2>
          <p className="text-white/90 font-body text-sm md:text-base">
            Authorized PM Surya Ghar Muft Bijli Yojana Installer. We handle the paperwork!
          </p>
        </div>
        <Link to="/subsidy">
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red">
            Know More
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default SubsidyBanner;
