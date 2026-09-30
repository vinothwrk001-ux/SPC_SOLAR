// =============================================
// SPC SOLAR — CENTRALIZED MOTION VARIANTS
// =============================================

// Easing presets
export const EASING = {
  expo: [0.16, 1, 0.3, 1],
  smooth: [0.4, 0, 0.2, 1],
  bounce: [0.34, 1.56, 0.64, 1],
  in: [0.7, 0, 0.84, 0],
};

// Duration presets
export const DURATION = {
  fast: 0.22,
  normal: 0.45,
  slow: 0.75,
  xslow: 1.1,
};

// ---- Page Transitions ----
export const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASING.expo } },
  exit: { opacity: 0, y: -10, transition: { duration: DURATION.fast, ease: EASING.smooth } },
};

// ---- Fade Up (general reveal) ----
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASING.expo, delay },
  }),
};

// ---- Fade In ----
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASING.smooth, delay },
  }),
};

// ---- Stagger Container ----
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

// ---- Stagger Child ----
export const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASING.expo } },
};

// ---- Scale In ----
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASING.expo, delay },
  }),
};

// ---- Slide from left ----
export const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASING.expo, delay },
  }),
};

// ---- Slide from right ----
export const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASING.expo, delay },
  }),
};

// ---- Hero Word reveal ----
export const heroWord = {
  hidden: { opacity: 0, y: '110%' },
  visible: (delay = 0) => ({
    opacity: 1,
    y: '0%',
    transition: { duration: DURATION.xslow, ease: EASING.expo, delay },
  }),
};

// ---- Red line draw ----
export const lineDraw = {
  hidden: { scaleX: 0, originX: 0 },
  visible: (delay = 0) => ({
    scaleX: 1,
    transition: { duration: DURATION.slow, ease: EASING.expo, delay },
  }),
};

// ---- Card hover ----
export const cardHover = {
  rest: { y: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  hover: {
    y: -4,
    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
    transition: { duration: DURATION.fast, ease: EASING.smooth },
  },
};

// ---- Button hover ----
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.015, transition: { duration: DURATION.fast, ease: EASING.smooth } },
  tap: { scale: 0.975, transition: { duration: 0.1 } },
};

// ---- Navbar ----
export const navbarVariants = {
  top: {
    backgroundColor: 'rgba(10,10,10,0)',
    backdropFilter: 'blur(0px)',
    boxShadow: 'none',
    height: '80px',
    transition: { duration: 0.4, ease: EASING.smooth },
  },
  scrolled: {
    backgroundColor: 'rgba(10,10,10,0.97)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
    height: '64px',
    transition: { duration: 0.4, ease: EASING.smooth },
  },
};

// ---- Mobile Menu ----
export const mobileMenuVariants = {
  closed: {
    opacity: 0,
    clipPath: 'inset(0% 0% 100% 0%)',
    transition: { duration: DURATION.normal, ease: EASING.smooth },
  },
  open: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: DURATION.slow, ease: EASING.expo },
  },
};

export const mobileNavItem = {
  closed: { opacity: 0, x: -20 },
  open: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.06, duration: DURATION.normal, ease: EASING.expo },
  }),
};

// ---- Counter ----
export const counterVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASING.bounce, delay },
  }),
};
