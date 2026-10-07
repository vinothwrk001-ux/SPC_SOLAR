import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { FiMenu, FiX, FiArrowRight, FiUser, FiLogOut } from 'react-icons/fi';
import Button from '../ui/Button';
import Logo from '../../assets/Logo.png';
import LeadCaptureModal from './LeadCaptureModal';
import { mobileMenuVariants, mobileNavItem } from '../../animations/variants';

const LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Reels', path: '/#reels' },
  { name: 'Calculator', path: '/quotation' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Subsidy', path: '/subsidy' },
  { name: 'Blog', path: '/blog' },
  { name: 'Gallery', path: '/components' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
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

  // Global event listener for triggering lead quotation modal from any CTA button
  useEffect(() => {
    const handleOpenModal = () => setIsLeadModalOpen(true);
    window.addEventListener('open-lead-modal', handleOpenModal);
    return () => window.removeEventListener('open-lead-modal', handleOpenModal);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLinkClick = (link) => {
    if (link.path.includes('#reels')) {
      if (location.pathname === '/') {
        const el = document.getElementById('reels');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setIsOpen(false);
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <motion.nav
        animate={scrolled ? 'scrolled' : 'top'}
        variants={{
          top: {
            backgroundColor: '#0a0a0a',
            backdropFilter: 'none',
            borderBottomColor: 'rgba(255,255,255,0.1)',
            height: '80px',
          },
          scrolled: {
            backgroundColor: '#0a0a0a',
            backdropFilter: 'none',
            borderBottomColor: 'rgba(255,255,255,0.1)',
            height: '64px',
          },
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-full flex items-center justify-between">
          {/* ---- LOGO ---- */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img src={Logo} alt="SPC Solar Logo" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          {/* ---- DESKTOP LINKS ---- */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleLinkClick(link)}
                className={`relative font-accent font-semibold text-sm tracking-wide uppercase transition-colors duration-200 group flex items-center gap-1.5 ${
                  isActive(link.path) ? 'text-red' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
                {link.isNew && (
                  <span className="bg-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    NEW
                  </span>
                )}
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
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <Button variant="outline-white" size="sm" onClick={() => setIsLeadModalOpen(true)} className="whitespace-nowrap">
              Request Quote
            </Button>
            <Link to="/quotation">
              <Button size="sm" icon={<FiArrowRight size={14} />} className="whitespace-nowrap">
                Solar Calculator
              </Button>
            </Link>

            <Link to="/admin/login" className="text-white/30 hover:text-white text-[10px] uppercase tracking-widest ml-1 font-accent font-bold transition-colors" title="Admin Portal">
              Admin
            </Link>
          </div>

          {/* ---- HAMBURGER ---- */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-1 focus:outline-none"
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
            className="fixed inset-0 z-40 bg-black lg:hidden flex flex-col overflow-y-auto no-scrollbar"
            style={{ top: 0 }}
          >
            {/* Background elements */}
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            {/* Red blobs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red/6 rounded-full blur-3xl pointer-events-none" />

            <nav className="relative flex flex-col items-center gap-5 sm:gap-6 w-full px-6 min-h-full pt-28 pb-12">
              {LINKS.map((link, i) => (
                <motion.div key={link.name} variants={mobileNavItem} custom={i}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-heading text-2xl sm:text-3xl uppercase tracking-wider transition-colors ${
                      isActive(link.path) ? 'text-red' : 'text-white hover:text-red'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={mobileNavItem} custom={LINKS.length} className="mt-6 flex flex-col gap-3 w-full max-w-sm mx-auto">
                <Button variant="white" size="lg" className="w-full" onClick={() => { setIsOpen(false); setIsLeadModalOpen(true); }}>
                  Request Quote
                </Button>
                <Link to="/quotation" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" size="lg" className="w-full" icon={<FiArrowRight />}>
                    Solar Calculator
                  </Button>
                </Link>

                <Link to="/admin/login" onClick={() => setIsOpen(false)} className="text-center text-white/30 mt-2 text-xs font-accent tracking-widest uppercase">
                  Admin Login
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </>
  );
};

export default Navbar;
