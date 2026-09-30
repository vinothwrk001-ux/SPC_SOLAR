import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <span className="font-heading text-2xl font-bold tracking-widest text-white block mb-4">
              SPC<span className="text-red">SOLAR</span>
            </span>
            <p className="text-gray-light font-body text-sm mb-4">
              Powering your future with sustainable solar energy solutions for residential, commercial, and industrial needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-red transition-colors"><FiFacebook size={20} /></a>
              <a href="#" className="text-white hover:text-red transition-colors"><FiTwitter size={20} /></a>
              <a href="#" className="text-white hover:text-red transition-colors"><FiInstagram size={20} /></a>
              <a href="#" className="text-white hover:text-red transition-colors"><FiLinkedin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-light hover:text-white text-sm">Home</Link></li>
              <li><Link to="/about" className="text-gray-light hover:text-white text-sm">About Us</Link></li>
              <li><Link to="/projects" className="text-gray-light hover:text-white text-sm">Our Projects</Link></li>
              <li><Link to="/subsidy" className="text-gray-light hover:text-white text-sm">PM Surya Ghar Subsidy</Link></li>
              <li><Link to="/blog" className="text-gray-light hover:text-white text-sm">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-light hover:text-white text-sm">Residential Solar</Link></li>
              <li><Link to="/services" className="text-gray-light hover:text-white text-sm">Commercial Solar</Link></li>
              <li><Link to="/services" className="text-gray-light hover:text-white text-sm">Industrial Solar</Link></li>
              <li><Link to="/services" className="text-gray-light hover:text-white text-sm">Maintenance & Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4 text-white">Contact Info</h4>
            <p className="text-gray-light text-sm mb-2">123 Solar Street, Green City, India</p>
            <p className="text-gray-light text-sm mb-2">Email: info@spcsolar.com</p>
            <p className="text-gray-light text-sm mb-4">Phone: +91 98765 43210</p>
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-btn font-accent transition-colors"
            >
              <FaWhatsapp size={20} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-light border-opacity-20 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-light">
          <p>© 2025 SPC Solar. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-accent text-red-light font-semibold">PM Surya Ghar Authorized Installer</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
