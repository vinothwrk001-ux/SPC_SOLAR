import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Button from '../ui/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Subsidy', path: '/subsidy' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-heading text-2xl font-bold tracking-widest text-black">
                SPC<span className="text-red">SOLAR</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-accent font-semibold tracking-wide hover:text-red transition-colors ${location.pathname === link.path ? 'text-red' : 'text-black'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/quotation">
              <Button>Get Free Quote</Button>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black hover:text-red focus:outline-none"
            >
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-black z-40 flex flex-col items-center pt-10 space-y-6">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-white font-heading text-2xl hover:text-red transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link to="/quotation" onClick={() => setIsOpen(false)}>
            <Button>Get Free Quote</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
