import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import { MdSolarPower } from 'react-icons/md';
import Button from '../ui/Button';
import { mobileMenuVariants, mobileNavItem } from '../../animations/variants';

const LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Subsidy', path: '/subsidy' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 30);
  });

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <motion.nav
        animate={scrolled ? 'scrolled' : 'top'}
        variants={{
          top: {
            backgroundColor: 'rgba(10,10,10,0.0)',
            backdropFilter: 'blur(0px)',
            borderBottomColor: 'rgba(255,255,255,0)',
            height: '80px',
          },
          scrolled: {
            backgroundColor: 'rgba(10,10,10,0.96)',
            backdropFilter: 'blur(14px)',
            borderBottomColor: 'rgba(255,255,255,0.06)',
            height: '64px',
          },
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* ---- LOGO ---- */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
              className="text-red"
            >
              <MdSolarPower size={28} />
            </motion.div>
            <span className="font-heading text-xl font-900 tracking-widest text-white uppercase">
              SPC<span className="text-red">SOLAR</span>
            </span>
          </Link>

          {/* ---- DESKTOP LINKS ---- */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-accent font-semibold text-sm tracking-wide uppercase transition-colors duration-200 group ${
                  isActive(link.path) ? 'text-red' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
                <motion.span
                  className="absolute -bottom-1 left-0 h-px bg-red"
                  initial={false}
                  animate={{ width: isActive(link.path) ? '100%' : '0%' }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
                <span className="absolute -bottom-1 left-0 h-px bg-red/40 w-0 group-hover:w-full transition-[width] duration-300" />
              </Link>
            ))}
          </div>

          {/* ---- CTA ---- */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/quotation">
              <Button size="sm" icon={<FiArrowRight size={14} />}>
                Free Quote
              </Button>
            </Link>
          </div>

          {/* ---- HAMBURGER ---- */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-1 focus:outline-none"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <FiX size={26} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <FiMenu size={26} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ---- MOBILE MENU OVERLAY ---- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-black-DEFAULT md:hidden flex flex-col justify-center items-center"
            style={{ top: 0 }}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            {/* Red blobs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red/6 rounded-full blur-3xl pointer-events-none" />

            <nav className="relative flex flex-col items-center gap-8 w-full px-8">
              {LINKS.map((link, i) => (
                <motion.div key={link.name} variants={mobileNavItem} custom={i}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-heading text-4xl uppercase tracking-wider transition-colors ${
                      isActive(link.path) ? 'text-red' : 'text-white hover:text-red'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={mobileNavItem} custom={LINKS.length} className="mt-4">
                <Link to="/quotation" onClick={() => setIsOpen(false)}>
                  <Button size="lg" icon={<FiArrowRight />}>
                    Get Free Quote
                  </Button>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
