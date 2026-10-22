import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Reveal, EnergyGrid } from '../motion';
import Logo from '../../assets/Logo.png';

const SOCIAL = [
  { icon: <FiFacebook size={16} />, href: '#', label: 'Facebook' },
  { icon: <FiInstagram size={16} />, href: 'https://instagram.com/spc_coimbatore', label: 'Instagram' },
];

const QUICK_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Refer & Earn (₹2k/kW)', path: '/services#referral-program', isSpecial: true },
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
      <EnergyGrid opacity={0.04} color="white" />

      {/* Top red accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red to-transparent" />

      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-red/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---- Main Grid ---- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-8 md:gap-8 lg:gap-10 pt-7 pb-6 md:pt-10 md:pb-8">
          {/* Column 1 — Brand */}
          <Reveal className="col-span-2 lg:col-span-1">
            <div>
              <Link to="/" className="flex items-center mb-3 sm:mb-4 group w-fit">
                <img src={Logo} alt="SPC Solar Logo" className="h-9 sm:h-10 w-auto object-contain" />
              </Link>
              <p className="text-gray-400 font-body text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-xs">
                Powering India's future with sustainable, certified solar energy solutions for residential, commercial, and industrial needs.
              </p>

              {/* PM badge */}
              <div className="inline-flex items-center gap-2 bg-red/10 border border-red/20 px-2.5 py-1 rounded-sm mb-3 sm:mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse flex-shrink-0" />
                <span className="text-red font-accent font-bold text-[11px] uppercase tracking-wider">
                  PM Surya Ghar Authorized
                </span>
              </div>

              {/* Social */}
              <div className="flex gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 rounded-sm border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-red hover:bg-red/10 transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Column 2 — Quick Links */}
          <Reveal delay={0.06} className="col-span-1">
            <div>
              <h4 className="font-heading text-xs sm:text-sm uppercase tracking-widest text-white mb-3 sm:mb-4 after:block after:w-6 after:h-px after:bg-red after:mt-1.5">
                Quick Links
              </h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {QUICK_LINKS.map((l) => (
                  <li key={l.name}>
                    {l.isSpecial ? (
                      <Link
                        to={l.path}
                        className="text-amber-400 hover:text-amber-300 font-bold text-xs sm:text-sm font-body flex items-center gap-1.5 group transition-colors duration-200 text-left"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                        <span>{l.name}</span>
                      </Link>
                    ) : (
                      <Link
                        to={l.path}
                        className="text-gray-400 hover:text-white text-xs sm:text-sm font-body flex items-center gap-1.5 group transition-colors duration-200"
                      >
                        <span className="w-0 h-px bg-red transition-[width] duration-300 group-hover:w-3 flex-shrink-0" />
                        <span>{l.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Column 3 — Services */}
          <Reveal delay={0.1} className="col-span-1">
            <div>
              <h4 className="font-heading text-xs sm:text-sm uppercase tracking-widest text-white mb-3 sm:mb-4 after:block after:w-6 after:h-px after:bg-red after:mt-1.5">
                Services
              </h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {SERVICES.map((s) => (
                  <li key={s}>
                    <Link
                      to="/services"
                      className="text-gray-400 hover:text-white text-xs sm:text-sm font-body flex items-center gap-1.5 group transition-colors duration-200"
                    >
                      <span className="w-0 h-px bg-red transition-[width] duration-300 group-hover:w-3 flex-shrink-0" />
                      <span>{s}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Column 4 — Contact */}
          <Reveal delay={0.14} className="col-span-2 lg:col-span-1">
            <div>
              <h4 className="font-heading text-xs sm:text-sm uppercase tracking-widest text-white mb-3 sm:mb-4 after:block after:w-6 after:h-px after:bg-red after:mt-1.5">
                Contact
              </h4>
              <ul className="space-y-2 sm:space-y-2.5">
                <li className="flex items-start gap-2.5 text-gray-400 text-xs sm:text-sm font-body leading-relaxed">
                  <FiMapPin size={15} className="text-red flex-shrink-0 mt-0.5" />
                  <span>No-115-117, Easwari Towers, Devanga High School Road, RS Puram, Coimbatore - 641002.</span>
                </li>
                <li>
                  <a
                    href="mailto:spctechnologycoimbatore@gmail.com"
                    className="flex items-center gap-2.5 text-gray-400 hover:text-white text-xs sm:text-sm font-body transition-colors duration-200"
                  >
                    <FiMail size={15} className="text-red flex-shrink-0" />
                    <span className="truncate">spctechnologycoimbatore@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+918098744044"
                    className="flex items-center gap-2.5 text-gray-400 hover:text-white text-xs sm:text-sm font-body transition-colors duration-200"
                  >
                    <FiPhone size={15} className="text-red flex-shrink-0" />
                    <span>+91 80987 44044 (Office)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+918489644044"
                    className="flex items-center gap-2.5 text-gray-400 hover:text-white text-xs sm:text-sm font-body transition-colors duration-200"
                  >
                    <FiPhone size={15} className="text-red flex-shrink-0" />
                    <span>+91 84896 44044</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+918489744044"
                    className="flex items-center gap-2.5 text-gray-400 hover:text-white text-xs sm:text-sm font-body transition-colors duration-200"
                  >
                    <FiPhone size={15} className="text-red flex-shrink-0" />
                    <span>+91 84897 44044</span>
                  </a>
                </li>
              </ul>

              <a
                href="https://wa.me/918098744044"
                target="_blank"
                rel="noreferrer"
                className="mt-3.5 sm:mt-4 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white px-3.5 py-2 rounded-lg font-accent font-bold text-xs sm:text-sm transition-colors duration-200"
              >
                <FaWhatsapp size={16} />
                Chat on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        {/* ---- Bottom Bar ---- */}
        <div className="border-t border-white/8 py-3.5 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-gray-500">
          <p className="font-body">© {new Date().getFullYear()} SPC Solar. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6 font-body">
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
