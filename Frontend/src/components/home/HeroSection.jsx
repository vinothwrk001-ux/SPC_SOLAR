import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import Button from '../ui/Button';
import { AnimatedCounter, EnergyGrid } from '../motion';

// ---- Solar panel SVG graphic ----
const SolarPanelGraphic = () => (
  <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    {/* Sun rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <motion.line
        key={i}
        x1="320" y1="60"
        x2={320 + Math.cos((angle * Math.PI) / 180) * 35}
        y2={60 + Math.sin((angle * Math.PI) / 180) * 35}
        stroke="#CC2222" strokeWidth="2" strokeLinecap="round"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
        transition={{ duration: 2 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
        style={{ transformOrigin: '320px 60px' }}
      />
    ))}
    {/* Sun circle */}
    <motion.circle cx="320" cy="60" r="18" fill="#CC2222"
      animate={{ r: [18, 22, 18] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Panel grid */}
    {[0, 1, 2, 3].map((col) =>
      [0, 1, 2].map((row) => (
        <motion.rect
          key={`${col}-${row}`}
          x={30 + col * 82}
          y={80 + row * 70}
          width="74"
          height="62"
          rx="3"
          fill="#141414"
          stroke="#CC2222"
          strokeWidth="1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 + (col + row) * 0.08 }}
        />
      ))
    )}

    {/* Panel cell lines */}
    {[0, 1, 2, 3].map((col) =>
      [0, 1, 2].map((row) => (
        <React.Fragment key={`lines-${col}-${row}`}>
          <motion.line
            x1={30 + col * 82 + 37} y1={80 + row * 70}
            x2={30 + col * 82 + 37} y2={80 + row * 70 + 62}
            stroke="#CC2222" strokeWidth="0.5" strokeOpacity="0.4"
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + (col + row) * 0.05 }}
            style={{ transformOrigin: `${30 + col * 82 + 37}px ${80 + row * 70 + 31}px` }}
          />
          <motion.line
            x1={30 + col * 82} y1={80 + row * 70 + 31}
            x2={30 + col * 82 + 74} y2={80 + row * 70 + 31}
            stroke="#CC2222" strokeWidth="0.5" strokeOpacity="0.4"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.7 + (col + row) * 0.05 }}
            style={{ transformOrigin: `${30 + col * 82 + 37}px ${80 + row * 70 + 31}px` }}
          />
        </React.Fragment>
      ))
    )}

    {/* Energy flow arrow */}
    <motion.path
      d="M 200 310 L 200 295 L 190 305 M 200 295 L 210 305"
      stroke="#CC2222" strokeWidth="2" fill="none" strokeLinecap="round"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Connecting lines from panels */}
    <motion.path
      d="M 30 310 H 370"
      stroke="#CC2222" strokeWidth="1.5" strokeDasharray="6 4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
    />
  </svg>
);

const STATS = [
  { value: '500', suffix: '+', label: 'Installations' },
  { value: '12', suffix: ' MW+', label: 'Installed' },
  { value: '10', suffix: '+', label: 'States Served' },
  { value: '100', suffix: '%', label: 'Happy Clients' },
];

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center bg-black-DEFAULT overflow-hidden">
      {/* ---- Background Image with parallax ---- */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 scale-110"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1508514177221-188b1c77eca2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </motion.div>

      {/* ---- Grid overlay ---- */}
      <EnergyGrid opacity={0.04} color="white" />

      {/* ---- Red glow blobs ---- */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-red/6 rounded-full blur-3xl pointer-events-none" />

      {/* ---- Content ---- */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 pt-40"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-8 h-px bg-red block" />
              <span className="text-red font-accent font-bold text-xs uppercase tracking-widest">
                PM Surya Ghar Authorized Installer
              </span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="font-heading text-6xl lg:text-8xl leading-none text-white uppercase"
              >
                POWER
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                className="font-heading text-6xl lg:text-8xl leading-none text-white uppercase"
              >
                YOUR{' '}
                <span className="text-red">FUTURE</span>
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.26 }}
                className="font-heading text-6xl lg:text-8xl leading-none text-white/20 uppercase text-stroke-white"
              >
                WITH SOLAR
              </motion.h1>
            </div>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="text-gray-300 font-body text-lg max-w-md leading-relaxed mb-10"
            >
              Transition to clean, sustainable energy. We provide top-tier solar solutions 
              for residential, commercial, and industrial needs across India.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.62 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/quotation">
                <Button size="lg" icon={<FiArrowRight />}>
                  Get Free Quote
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline-white" size="lg">
                  Our Projects
                </Button>
              </Link>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="mt-10 pt-8 border-t border-white/8 flex items-center gap-6"
            >
              <span className="text-gray-500 text-xs font-accent uppercase tracking-wider">Certified by</span>
              {['MNRE', 'BIS', 'ISO 9001'].map((cert) => (
                <span key={cert} className="text-white/60 font-heading text-sm tracking-widest uppercase">
                  {cert}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Stats + Solar Graphic */}
          <div className="relative">
            {/* Solar panel SVG */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="w-full max-w-md mx-auto mb-10"
            >
              <SolarPanelGraphic />
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.6 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-card p-5 hover:border-red/40 transition-colors duration-300"
                >
                  <div className="font-heading text-4xl text-white mb-1">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={2}
                      className="text-red"
                    />
                  </div>
                  <p className="font-heading uppercase text-xs tracking-widest text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---- Scroll indicator ---- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-gray-500 font-accent text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-red to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
