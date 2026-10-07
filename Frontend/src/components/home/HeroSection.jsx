import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
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
  { value: '1000', suffix: '+', label: 'Installations' },
  { value: '12', suffix: ' MW+', label: 'Installed' },
  { value: '10', suffix: '+', label: 'States Served' },
  { value: '100', suffix: '%', label: 'Happy Clients' },
];

const HeroSection = () => {
  const [bannerUrl, setBannerUrl] = useState(
    'https://images.unsplash.com/photo-1508514177221-188b1c77eca2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  );

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/banner');
        if (data && data.imageUrl) {
          setBannerUrl(`http://localhost:5000${data.imageUrl}`);
        }
      } catch (error) {
        console.error('Failed to load dynamic banner, using default.');
      }
    };
    fetchBanner();
  }, []);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center bg-black overflow-hidden">
      {/* ---- Background Image with parallax ---- */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 scale-110"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${bannerUrl}')`,
          }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
