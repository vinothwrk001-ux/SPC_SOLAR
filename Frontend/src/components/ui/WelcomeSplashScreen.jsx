import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreload } from '../../context/PreloadContext';
import Logo from '../../assets/Logo.png';
import { FiZap, FiSun, FiCheckCircle } from 'react-icons/fi';

const WelcomeSplashScreen = () => {
  const { isReady, showSplash, progress, statusMessage, handleSplashExited } = usePreload();

  // Natural atmospheric golden solar dust particles (Brownian drift - optimized for 60fps mobile)
  const solarDustMotes = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      left: `${10 + (i * 15)}%`,
      bottom: `${18 + (i % 3) * 14}%`,
      driftX: ((i % 3) - 1) * 18,
      driftY: - (35 + (i % 3) * 20),
      size: 2 + (i % 2) * 1.2,
      duration: 5 + (i % 3) * 1.2,
      delay: i * 0.4,
      maxOpacity: 0.35,
      color: i % 2 === 0 ? '#FEF08A' : '#FBBF24',
    }));
  }, []);

  if (!showSplash) return null;

  return (
    <AnimatePresence onExitComplete={handleSplashExited}>
      {!isReady && (
        <motion.div
          key="spc-welcome-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.01,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] min-h-[100dvh] max-h-[100dvh] w-full bg-[#04060A] text-white flex flex-col justify-between items-center overflow-hidden font-body select-none px-4 py-4 sm:p-6"
        >
          {/* ========================================================= */}
          {/* 1. REALISTIC SUNLIGHT, CREPUSCULAR RAYS & OPTICAL FLARE   */}
          {/* ========================================================= */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Deep Solar Ambient Light Dome (Golden Hour - Zero-overhead Radial Gradient) */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-32 -right-32 sm:-top-44 sm:-right-44 w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(254, 240, 138, 0.32) 0%, rgba(245, 158, 11, 0.16) 38%, rgba(234, 88, 12, 0.05) 58%, transparent 72%)',
                willChange: 'transform, opacity',
              }}
            />

            {/* Radiant Sun Corona */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.85, 1, 0.85],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 -right-10 sm:-top-16 sm:-right-16 w-36 h-36 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-white via-amber-200 to-amber-500 blur-xl shadow-[0_0_80px_rgba(251,191,36,0.65)]"
            />

            {/* Piercing Sun Disc Core */}
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white blur-[6px] shadow-[0_0_30px_#ffffff]" />

            {/* Anamorphic Horizontal Lens Flare Streak (Cinematic DSLR Look) */}
            <motion.div
              animate={{
                opacity: [0.55, 0.85, 0.55],
                scaleX: [0.95, 1.08, 0.95],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-6 sm:top-8 right-0 w-[300px] sm:w-[580px] h-[2px] bg-gradient-to-r from-transparent via-amber-200 via-white to-transparent blur-[1px] pointer-events-none"
            />

            {/* Volumetric Crepuscular God Rays (Radiating from the Sun Core at 920, 60) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-75"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 1000 1000"
            >
              <defs>
                {/* Ray Gradient 1 - Primary Sunlight Shaft */}
                <linearGradient id="real-sun-ray-1" x1="0.92" y1="0.06" x2="0.1" y2="0.85">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                  <stop offset="25%" stopColor="#FEF08A" stopOpacity="0.22" />
                  <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </linearGradient>

                {/* Ray Gradient 2 - Central Ground Shaft */}
                <linearGradient id="real-sun-ray-2" x1="0.92" y1="0.06" x2="0.35" y2="1">
                  <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.40" />
                  <stop offset="30%" stopColor="#FDE68A" stopOpacity="0.18" />
                  <stop offset="70%" stopColor="#EA580C" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                </linearGradient>

                {/* Ray Gradient 3 - Warm Ambient Shaft */}
                <linearGradient id="real-sun-ray-3" x1="0.92" y1="0.06" x2="0.65" y2="1">
                  <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.30" />
                  <stop offset="40%" stopColor="#FBBF24" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* God Ray 1 - Broad Diagonal Sky Ray */}
              <motion.polygon
                points="920,60 0,420 0,720"
                fill="url(#real-sun-ray-1)"
                animate={{ opacity: [0.65, 0.95, 0.65] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* God Ray 2 - Central Direct Shaft towards Solar Array */}
              <motion.polygon
                points="920,60 160,1000 340,1000"
                fill="url(#real-sun-ray-2)"
                animate={{ opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              />

              {/* God Ray 3 - Wide Ambient Floor Shaft */}
              <motion.polygon
                points="920,60 460,1000 740,1000"
                fill="url(#real-sun-ray-3)"
                animate={{ opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              />

              {/* God Ray 4 - High Horizontal Shaft */}
              <motion.polygon
                points="920,60 0,160 0,340"
                fill="url(#real-sun-ray-1)"
                animate={{ opacity: [0.45, 0.8, 0.45] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
              />
            </svg>

            {/* Optical Camera Lens Flare Ghost Ring along Light Axis */}
            <motion.div
              animate={{
                opacity: [0.15, 0.35, 0.15],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/3 right-1/3 w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-amber-300/30 bg-amber-400/5 blur-[2px] pointer-events-none"
            />

            {/* Subtle Brand Center Glow (Hardware-accelerated radial glow) */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(204, 34, 34, 0.22) 0%, rgba(245, 158, 11, 0.08) 42%, transparent 70%)',
                willChange: 'transform, opacity',
              }}
            />

            {/* Fine Atmospheric Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Horizon Subtle Spectrum Lines */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/80 via-red to-transparent opacity-70" />
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/60 via-amber-400/40 to-transparent opacity-60" />

            {/* Realistic Floating Golden Dust Motes */}
            {solarDustMotes.map((mote) => (
              <motion.div
                key={mote.id}
                initial={{ opacity: 0 }}
                animate={{
                  y: [0, mote.driftY],
                  x: [0, mote.driftX],
                  opacity: [0, mote.maxOpacity, mote.maxOpacity * 0.7, 0],
                }}
                transition={{
                  duration: mote.duration,
                  repeat: Infinity,
                  delay: mote.delay,
                  ease: 'easeInOut',
                }}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: mote.left,
                  bottom: mote.bottom,
                  width: `${mote.size}px`,
                  height: `${mote.size}px`,
                  backgroundColor: mote.color,
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                }}
              />
            ))}
          </div>

          {/* Spacer for Top Balance on Mobile */}
          <div className="w-full h-2 sm:h-4 pointer-events-none relative z-10" />

          {/* ========================================================= */}
          {/* 2. CENTRAL WELCOME CARD (PERFECT FIT MOBILE & DESKTOP)     */}
          {/* ========================================================= */}
          <div className="relative z-10 flex flex-col items-center text-center my-auto w-full max-w-sm sm:max-w-md mx-auto px-2">
            {/* Illuminated Brand Logo Container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-5 sm:mb-6"
            >
              {/* Precision Engineering Solar Rotation Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3.5 sm:-inset-4.5 rounded-3xl border border-dashed border-red/35 pointer-events-none"
              />

              {/* Pulsing Warm Halo */}
              <div className="absolute -inset-2.5 bg-gradient-to-tr from-red/40 via-orange-500/30 to-amber-400/20 rounded-2xl blur-md animate-pulse" />

              {/* Silicon Wafer Pod with Metallic Chamfer */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-white/12 via-white/5 to-black/50 border border-white/20 backdrop-blur-xl p-3 sm:p-3.5 flex items-center justify-center shadow-[0_15px_40px_rgba(204,34,34,0.3)] overflow-hidden">
                {/* Sunlight Reflection Sweep across Pod */}
                <motion.div
                  animate={{
                    x: ['-130%', '230%'],
                  }}
                  transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    repeatDelay: 2.2,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 w-3/5 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none"
                />

                <img
                  src={Logo}
                  alt="SPC Solar Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(255,255,255,0.2)] relative z-10"
                />
              </div>

              {/* Active Solar Sun Badge */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-orange-500 text-black flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.7)] border border-amber-200 z-20"
              >
                <FiSun size={13} className="text-black" />
              </motion.div>
            </motion.div>

            {/* Clean Energy Innovation Pill Badge */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-red/10 border border-red/30 text-red text-[10px] sm:text-xs font-accent font-bold uppercase tracking-[0.18em] mb-2 sm:mb-2.5 shadow-[0_0_16px_rgba(204,34,34,0.2)]"
            >
              <FiZap size={11} className="text-amber-400" />
              <span>Clean Energy Innovation</span>
            </motion.div>

            {/* Main Welcome Heading */}
            <motion.h1
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-heading font-black text-2xl xs:text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-2 leading-tight"
            >
              WELCOME TO{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red via-orange-500 to-amber-400 drop-shadow-[0_2px_14px_rgba(204,34,34,0.45)]">
                SPC SOLAR
              </span>
            </motion.h1>

            {/* Clean Tagline */}
            <motion.p
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-white/70 text-[11px] sm:text-xs md:text-sm max-w-[280px] sm:max-w-md mx-auto mb-5 sm:mb-6 font-normal leading-relaxed"
            >
              Powering homes, businesses, and industries with smart rooftop solar solutions & government subsidies.
            </motion.p>

            {/* High-Tech Solar Power Conduit Progress Bar */}
            <div className="w-full max-w-[260px] sm:max-w-xs md:max-w-sm mx-auto">
              {/* Progress Labels Header */}
              <div className="flex items-center justify-between text-xs font-accent mb-1.5 px-0.5">
                <span className="flex items-center gap-1.5 text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                  <span className="text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold">
                    {progress >= 100 ? 'System Ready' : 'Harvesting Solar Energy'}
                  </span>
                </span>
                <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm">
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="relative h-2 sm:h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/15 p-[1px] shadow-inner backdrop-blur-sm">
                {/* Glowing Progress Fill */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 via-red to-rose-600 relative"
                  style={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
                  transition={{ ease: 'easeOut', duration: 0.35 }}
                >
                  {/* Leading Spark Flare */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full blur-[1.5px] shadow-[0_0_10px_#ffffff]" />
                </motion.div>
              </div>

              {/* Dynamic Status / Activity Message */}
              <div className="mt-2.5 h-5 flex items-center justify-center">
                <motion.p
                  key={statusMessage}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] sm:text-xs text-white/60 font-accent tracking-wide flex items-center gap-1.5 truncate max-w-full"
                >
                  {progress >= 100 ? (
                    <>
                      <FiCheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-white font-medium">Solar Array Synchronized • Launching...</span>
                    </>
                  ) : (
                    <span>{statusMessage}</span>
                  )}
                </motion.p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. REALISTIC 3D PERSPECTIVE MONOCRYSTALLINE SOLAR ARRAY   */}
          {/* ========================================================= */}
          <div className="w-full h-24 sm:h-36 md:h-44 relative pointer-events-none flex items-end justify-center overflow-hidden z-10 flex-shrink-0">
            {/* Ground Ambient Reflection & Photovoltaic Luminescence */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-sky-400/15 via-amber-400/5 to-transparent blur-md" />

            {/* Aluminum Racking Rail Foundation */}
            <div className="absolute bottom-1 inset-x-4 sm:inset-x-12 h-2 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 rounded-sm border-t border-slate-500/40 opacity-80" />

            {/* Realistic Photovoltaic Array Deck with Hardware-Accelerated Perspective */}
            <div
              className="w-full max-w-[1100px] h-[170px] sm:h-[220px] md:h-[250px] origin-bottom flex gap-2 sm:gap-3 px-3 sm:px-6"
              style={{
                transform: 'perspective(600px) rotateX(46deg) translateY(8px)',
                willChange: 'transform',
              }}
            >
              {[0, 1, 2, 3, 4].map((panelIdx) => {
                const isOuter = panelIdx === 0 || panelIdx === 4;
                return (
                  <div
                    key={panelIdx}
                    className={`flex-1 h-full rounded-md sm:rounded-lg border border-slate-400/35 bg-gradient-to-b from-[#0F223D] via-[#091526] to-[#040A12] shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] p-1 flex flex-col justify-between relative overflow-hidden ${
                      isOuter ? 'hidden sm:flex' : 'flex'
                    }`}
                  >
                    {/* Anodized Aluminum Outer Frame Bevel & Top Specular Lip */}
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-slate-400 via-white/80 to-slate-400" />

                    {/* Monocrystalline Silicon Cells Grid */}
                    <div className="w-full h-full grid grid-cols-2 gap-1 p-0.5 relative z-0">
                      {[...Array(6)].map((_, cellIdx) => (
                        <div
                          key={cellIdx}
                          className="relative rounded-[2px] bg-gradient-to-br from-[#0B1A2D] via-[#071220] to-[#040910] border border-sky-400/20 overflow-hidden flex flex-col justify-between py-1"
                          style={{
                            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to right, rgba(56,189,248,0.22) 1px, transparent 1px, rgba(56,189,248,0.22) 1px, transparent 1px)',
                            backgroundSize: '100% 7px, 33.3% 100%',
                          }}
                        >
                          {/* Corner Diamond Junction Accents */}
                          <div className="absolute -top-1 -left-1 w-1.5 h-1.5 rotate-45 bg-[#03070E] border border-white/10" />
                          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rotate-45 bg-[#03070E] border border-white/10" />
                          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rotate-45 bg-[#03070E] border border-white/10" />
                          <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 rotate-45 bg-[#03070E] border border-white/10" />
                        </div>
                      ))}
                    </div>

                    {/* Sweeping Sunlight Specular Glint Across Glass */}
                    <motion.div
                      animate={{
                        x: ['-160%', '280%'],
                      }}
                      transition={{
                        duration: 3.6,
                        repeat: Infinity,
                        repeatDelay: 1.4 + panelIdx * 0.35,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="absolute inset-0 w-3/5 h-full bg-gradient-to-r from-transparent via-white/20 via-amber-200/10 to-transparent -skew-x-12 pointer-events-none z-10"
                      style={{ willChange: 'transform' }}
                    />

                    {/* Bottom Edge Junction Busbar */}
                    <div className="relative z-10 mt-0.5 h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/80 via-orange-400/70 to-transparent" />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeSplashScreen;
