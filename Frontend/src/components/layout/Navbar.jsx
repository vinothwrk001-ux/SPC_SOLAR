import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { FiMenu, FiX, FiArrowRight, FiUser, FiLogOut } from 'react-icons/fi';
import Button from '../ui/Button';
import Logo from '../../assets/Logo.png';
import LeadCaptureModal from './LeadCaptureModal';
import { mobileMenuVariants, mobileNavItem } from '../../animations/variants';
import { useUserAuth } from '../../context/UserAuthContext';

const LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Reels', path: '/#reels' },
  { name: 'Calculator', path: '/quotation' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Subsidy', path: '/subsidy' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useUserAuth();
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

            {/* Customer Account Pill / Login */}
            {user ? (
              <div className="relative group ml-1">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-accent font-semibold transition-all"
                >
                  <span className="w-5 h-5 rounded-full bg-red flex items-center justify-center text-[10px] text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>
                </Link>

                {/* Dropdown Menu on hover */}
                <div className="absolute right-0 mt-2 w-48 bg-[#141414] border border-white/15 rounded-xl shadow-2xl py-1.5 hidden group-hover:block z-50">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-[11px] text-white/50 uppercase font-accent">Signed in as</p>
                    <p className="text-xs text-white font-semibold truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <FiUser className="text-red" /> My Dashboard
                  </Link>
                  <Link
                    to="/quotation"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <FiArrowRight className="text-red" /> New Solar Quote
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red hover:bg-red/10 text-left border-t border-white/10 transition-colors mt-1"
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-1">
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white text-xs uppercase tracking-wider font-accent font-bold transition-colors flex items-center gap-1.5"
                >
                  <FiUser className="text-red w-3.5 h-3.5" /> Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-white/40 hover:text-white text-xs uppercase tracking-wider font-accent font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

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
            className="fixed inset-0 z-40 bg-black lg:hidden flex flex-col justify-center items-center"
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

              <motion.div variants={mobileNavItem} custom={LINKS.length} className="mt-4 flex flex-col gap-3 w-full">
                <Button variant="white" size="lg" className="w-full" onClick={() => { setIsOpen(false); setIsLeadModalOpen(true); }}>
                  Request Quote
                </Button>
                <Link to="/quotation" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" size="lg" className="w-full" icon={<FiArrowRight />}>
                    Solar Calculator
                  </Button>
                </Link>

                {user ? (
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-3 px-4 bg-white/10 text-white rounded-xl font-accent font-bold uppercase text-center text-sm flex items-center justify-center gap-2"
                    >
                      <FiUser className="text-red" /> My Solar Dashboard ({user.name.split(' ')[0]})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="text-center text-red text-xs font-accent tracking-wider uppercase py-2"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 px-4 bg-red text-white rounded-xl font-accent font-bold uppercase text-center text-sm"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 px-4 bg-white/10 text-white rounded-xl font-accent font-bold uppercase text-center text-sm"
                    >
                      Register
                    </Link>
                  </div>
                )}

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
