import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeUp, staggerContainer, staggerChild, scaleIn, slideLeft, slideRight } from '../../animations/variants';

// =============================================
// REVEAL — Animates children when they enter viewport
// =============================================
export const Reveal = ({ children, variant = 'fadeUp', delay = 0, className = '', once = true }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px 0px' });

  const variants = { fadeUp, scaleIn, slideLeft, slideRight }[variant] || fadeUp;

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// =============================================
// STAGGER — Staggered children animation
// =============================================
export const Stagger = ({ children, className = '', delay = 0, stagger = 0.08, once = true }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px 0px' });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {React.Children.map(children, (child, i) =>
        child ? (
          <motion.div variants={staggerChild} key={i}>
            {child}
          </motion.div>
        ) : null
      )}
    </motion.div>
  );
};

// =============================================
// ANIMATED COUNTER — Counts from 0 to target
// =============================================
export const AnimatedCounter = ({ target, suffix = '', prefix = '', duration = 1.8, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseFloat(target);
    if (isNaN(end)) return;
    const steps = 60;
    const increment = end / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, (duration * 1000) / steps);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
};

// =============================================
// TEXT REVEAL — Split text with staggered word reveal
// =============================================
export const TextReveal = ({ text, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * 0.04,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// =============================================
// PAGE TRANSITION — Wrapper for route changes
// =============================================
export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// =============================================
// READING PROGRESS BAR — Fixed top bar for blog
// =============================================
export const ReadingProgress = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const handler = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div
      className="reading-progress"
      style={{ transform: `scaleX(${progress / 100})` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};

// =============================================
// ENERGY GRID — SVG background graphic
// =============================================
export const EnergyGrid = ({ opacity = 0.06, color = 'currentColor' }) => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <defs>
      <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="0.8" strokeOpacity={opacity} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

// =============================================
// ENERGY LINE — Animated SVG accent
// =============================================
export const EnergyLine = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 2"
    className={`overflow-visible ${className}`}
    aria-hidden="true"
  >
    <motion.line
      x1="0" y1="1" x2="200" y2="1"
      stroke="#CC2222"
      strokeWidth="1.5"
      strokeDasharray="200"
      initial={{ strokeDashoffset: 200 }}
      animate={{ strokeDashoffset: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    />
  </svg>
);

// =============================================
// SKELETON CARD — Placeholder while loading
// =============================================
export const SkeletonCard = ({ dark = false, height = '240px' }) => (
  <div
    className={`rounded-card overflow-hidden ${dark ? 'skeleton-dark' : 'skeleton'}`}
    style={{ height }}
  />
);
