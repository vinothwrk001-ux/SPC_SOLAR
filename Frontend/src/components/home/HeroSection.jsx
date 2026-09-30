import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const HeroSection = () => {
  return (
    <section className="relative bg-black text-white py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1508514177221-188b1c77eca2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl lg:text-7xl font-heading mb-6 leading-tight">
            POWER YOUR FUTURE WITH <span className="text-red">SOLAR</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-light font-body mb-8 max-w-lg">
            Transition to clean, sustainable energy. We provide top-tier solar solutions for residential, commercial, and industrial needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/quotation">
              <Button variant="primary" className="w-full sm:w-auto">Get Free Quote</Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black">Our Projects</Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-card border border-white/20">
            <h3 className="text-4xl font-accent font-bold text-red mb-2">500+</h3>
            <p className="font-heading tracking-wide uppercase text-sm">Installations</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-card border border-white/20">
            <h3 className="text-4xl font-accent font-bold text-red mb-2">12MW+</h3>
            <p className="font-heading tracking-wide uppercase text-sm">kW Installed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-card border border-white/20">
            <h3 className="text-4xl font-accent font-bold text-red mb-2">10+</h3>
            <p className="font-heading tracking-wide uppercase text-sm">States Served</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-card border border-white/20">
            <h3 className="text-4xl font-accent font-bold text-red mb-2">100%</h3>
            <p className="font-heading tracking-wide uppercase text-sm">Happy Clients</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
