import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Reveal, Stagger, EnergyGrid } from '../motion';
import Logo from '../../assets/Logo.png';

const SOCIAL = [
  { icon: <FiFacebook size={18} />, href: '#', label: 'Facebook' },
  { icon: <FiInstagram size={18} />, href: 'https://instagram.com/spc_coimbatore', label: 'Instagram' },
];

const QUICK_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Gallery', path: '/components' },
  { name: 'Solar Reels', path: '/#reels' },
  { name: 'Solar Calculator', path: '/quotation' },
  { name: 'About Us', path: '/about' },
  { name: 'Our Projects', path: '/projects' },
  { name: 'PM Surya Ghar Subsidy', path: '/subsidy' },
  { name: 'Blog', path: '/blog' },
];

const SERVICES = [
  'Residential Solar',
  'Commercial Solar',
  'Industrial Solar',
  'Maintenance & AMC',
  'Net Metering',
];

const Footer = () => {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Grid overlay */}
      <EnergyGrid opacity={0.05} color="white" />

      {/* Top red accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red to-transparent" />

      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-red/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---- Main Grid ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 pb-12">
          {/* Column 1 — Brand */}
          <Reveal>
            <div>
              <Link to="/" className="flex items-center mb-5 group w-fit">
                <img src={Logo} alt="SPC Solar Logo" className="h-12 w-auto object-contain" />
              </Link>
              <p className="text-gray-400 font-body text-sm leading-relaxed mb-6 max-w-xs">
                Powering India's future with sustainable, certified solar energy solutions for residential, commercial, and industrial needs.
              </p>

              {/* PM badge */}
              <div className="inline-flex items-center gap-2 bg-red/10 border border-red/20 px-3 py-1.5 rounded-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-red animate-pulse flex-shrink-0" />
                <span className="text-red font-accent font-bold text-xs uppercase tracking-wider">
                  PM Surya Ghar Authorized
                </span>
              </div>

              {/* Social */}
              <div className="flex gap-3">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-sm border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-red hover:bg-red/10 transition-all duration-250"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Column 2 — Quick Links */}
          <Reveal delay={0.08}>
            <div>
              <h4 className="font-heading text-sm uppercase tracking-widest text-white mb-5 after:block after:w-8 after:h-px after:bg-red after:mt-2">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {QUICK_LINKS.map((l) => (
                  <li key={l.name}>
                    <Link
                      to={l.path}
                      className="text-gray-400 hover:text-white text-sm font-body flex items-center gap-2 group transition-colors duration-200"
                    >
                      <span className="w-0 h-px bg-red transition-[width] duration-300 group-hover:w-4" />
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Column 3 — Services */}
          <Reveal delay={0.14}>
            <div>
              <h4 className="font-heading text-sm uppercase tracking-widest text-white mb-5 after:block after:w-8 after:h-px after:bg-red after:mt-2">
                Services
              </h4>
              <ul className="space-y-3">
                {SERVICES.map((s) => (
                  <li key={s}>
                    <Link
                      to="/services"
                      className="text-gray-400 hover:text-white text-sm font-body flex items-center gap-2 group transition-colors duration-200"
                    >
                      <span className="w-0 h-px bg-red transition-[width] duration-300 group-hover:w-4" />
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Column 4 — Contact */}
          <Reveal delay={0.2}>
            <div>
              <h4 className="font-heading text-sm uppercase tracking-widest text-white mb-5 after:block after:w-8 after:h-px after:bg-red after:mt-2">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400 text-sm font-body">
                  <FiMapPin size={16} className="text-red flex-shrink-0 mt-0.5" />
                  <span>No-115-117, Easwari Towers, Devanga High School Road, RS Puram, Coimbatore - 641002.</span>
                </li>
                <li>
                  <a
                    href="mailto:spctechnologycoimbatore@gmail.com"
                    className="flex items-center gap-3 text-gray-400 hover:text-white text-sm font-body transition-colors duration-200"
                  >
                    <FiMail size={16} className="text-red flex-shrink-0" />
                    spctechnologycoimbatore@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+918489644044"
                    className="flex items-center gap-3 text-gray-400 hover:text-white text-sm font-body transition-colors duration-200"
                  >
                    <FiPhone size={16} className="text-red flex-shrink-0" />
                    +91 84896 44044
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+918489744044"
                    className="flex items-center gap-3 text-gray-400 hover:text-white text-sm font-body transition-colors duration-200"
                  >
                    <FiPhone size={16} className="text-red flex-shrink-0" />
                    +91 84897 44044
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+918098744044"
                    className="flex items-center gap-3 text-gray-400 hover:text-white text-sm font-body transition-colors duration-200"
                  >
                    <FiPhone size={16} className="text-red flex-shrink-0" />
                    +91 80987 44044 (Office)
                  </a>
                </li>
              </ul>

              <a
                href="https://wa.me/918489644044"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white px-4 py-2.5 rounded-btn font-accent font-bold text-sm transition-colors duration-250"
              >
                <FaWhatsapp size={18} />
                Chat on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        {/* ---- Bottom Bar ---- */}
        <div className="border-t border-white/8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p className="font-body">© {new Date().getFullYear()} SPC Solar. All rights reserved.</p>
          <div className="flex gap-6 font-body">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
