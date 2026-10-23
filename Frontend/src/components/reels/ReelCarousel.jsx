import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft, FiChevronRight, FiPlay, FiZap, FiMapPin, FiEye,
  FiX, FiVolume2, FiVolumeX, FiShare2, FiArrowRight
} from 'react-icons/fi';
import {
  getPublicReels,
  recordReelView,
  recordQuoteClick
} from '../../services/reelService';
import ReelShareSheet from './ReelShareSheet';
import { Link, useNavigate } from 'react-router-dom';
import { Reveal, EnergyGrid } from '../motion';
import Button from '../ui/Button';
import { usePreload } from '../../context/PreloadContext';

const ReelCarousel = () => {
  const { preloadedData } = usePreload();
  const [reels, setReels] = useState(() => preloadedData?.reels || []);
  const [loading, setLoading] = useState(() => !preloadedData?.reels);
  const [startIndex, setStartIndex] = useState(0);

  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const backendBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    if (url.startsWith('/uploads')) return `${backendBase}${url}`;
    return `${backendBase}/uploads/${url.startsWith('/') ? url.slice(1) : url}`;
  };

  // In-Page Fullscreen Modal State
  const [activeReelIndex, setActiveReelIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('spc_reel_muted') === 'true');
  const [shareSheetOpen, setShareSheetOpen] = useState(false);

  // Mobile View State
  const [mobileIndex, setMobileIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  // Refs
  const videoRefs = useRef({});
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);

  const navigate = useNavigate();

  // Prevent background scrolling when fullscreen reel modal is active
  useEffect(() => {
    if (activeReelIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeReelIndex]);

  useEffect(() => {
    if (preloadedData?.reels) {
      setReels(preloadedData.reels);
      setLoading(false);
      return;
    }

    const loadReels = async () => {
      try {
        const data = await getPublicReels();
        setReels(data || []);
      } catch (err) {
        console.error('Failed to load reels:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReels();
  }, [preloadedData?.reels]);

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, reels.length - itemsPerPage);

  const handleNextSlide = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Open Modal Viewer for clicked reel
  const handleOpenReel = (index) => {
    setActiveReelIndex(index);
    const reel = reels[index];
    if (reel) {
      recordReelView(reel._id).catch(() => { });
    }
  };

  const handleCloseReel = () => {
    setActiveReelIndex(null);
    setShareSheetOpen(false);
  };

  // Sound toggle
  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('spc_reel_muted', newMuted ? 'true' : 'false');
    if (activeReelIndex !== null && reels[activeReelIndex]) {
      const vid = videoRefs.current[reels[activeReelIndex]._id];
      if (vid) vid.muted = newMuted;
    }
  };

  // Play/Pause toggle
  const handleTogglePlay = () => {
    if (activeReelIndex !== null && reels[activeReelIndex]) {
      const vid = videoRefs.current[reels[activeReelIndex]._id];
      if (vid) {
        if (vid.paused) {
          vid.play();
          setIsPlaying(true);
        } else {
          vid.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  const handleNextModal = (e) => {
    e?.stopPropagation();
    if (activeReelIndex !== null && activeReelIndex < reels.length - 1) {
      setActiveReelIndex((prev) => prev + 1);
    }
  };

  const handlePrevModal = (e) => {
    e?.stopPropagation();
    if (activeReelIndex !== null && activeReelIndex > 0) {
      setActiveReelIndex((prev) => prev - 1);
    }
  };

  // CTA Click
  const handleQuoteClick = () => {
    if (activeReelIndex !== null && reels[activeReelIndex]) {
      recordQuoteClick(reels[activeReelIndex]._id).catch(() => { });
    }
    handleCloseReel();
    navigate('/quotation');
  };

  const visibleReels = reels.slice(startIndex, startIndex + itemsPerPage);
  const activeReel = activeReelIndex !== null && reels[activeReelIndex] ? reels[activeReelIndex] : null;

  const safeMobileIndex = reels.length > 0 ? ((mobileIndex % reels.length) + reels.length) % reels.length : 0;
  const currentMobileReel = reels.length > 0 ? reels[safeMobileIndex] : null;

  const handlePrev = () => {
    handlePrevSlide();
    setSlideDirection(-1);
    setMobileIndex((prev) => (prev <= 0 ? (reels.length > 0 ? reels.length - 1 : 0) : prev - 1));
  };

  const handleNext = () => {
    handleNextSlide();
    setSlideDirection(1);
    setMobileIndex((prev) => (prev >= reels.length - 1 ? 0 : prev + 1));
  };

  // Touch swipe support for mobile (Filtered to prevent vertical scroll jitter)
  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchEndY.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null ||
      touchStartY.current === null ||
      touchEndY.current === null
    ) {
      return;
    }
    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;

    // Only swipe if horizontal movement clearly dominates vertical movement (preventing scroll flicker)
    if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > 40) {
      if (distanceX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
  };

  // If loading is done and there are no reels, return null safely after all hooks are executed
  if (!loading && reels.length === 0) {
    return null;
  }

  const renderReelCard = (reel, globalIdx) => (
    <motion.div
      key={reel._id}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => handleOpenReel(globalIdx)}
      className="group relative aspect-[9/16] bg-[#141414] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-800 hover:border-red/60 shadow-[0_16px_36px_rgba(0,0,0,0.2)] hover:shadow-[0_24px_50px_rgba(204,34,34,0.22)] cursor-pointer w-full transition-all duration-300"
    >
      {/* Video / Thumbnail */}
      {reel.thumbnailUrl ? (
        <img
          src={getMediaUrl(reel.thumbnailUrl)}
          alt={reel.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <video
          src={getMediaUrl(reel.videoUrl)}
          muted
          loop
          playsInline
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:via-black/40 transition-colors" />

      {/* Play Button Icon */}
      <div className="absolute inset-0 m-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-red text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-dark transition-all duration-300">
        <FiPlay size={22} className="ml-1" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
        {reel.showSystemCapacity && reel.systemCapacity ? (
          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-accent font-semibold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 shadow-sm">
            <FiZap size={11} className="text-amber-400" /> {reel.systemCapacity}
          </span>
        ) : <span />}
        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-accent font-semibold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 shadow-sm">
          <FiEye size={11} className="text-red" /> {reel.viewsCount || 0}
        </span>
      </div>

      {/* Bottom Details Overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-left space-y-1 z-10 pointer-events-none">
        {(reel.location || reel.showLocation) && (
          <div className="flex items-center gap-1 text-[11px] text-red font-accent font-semibold">
            <FiMapPin size={12} className="flex-shrink-0" /> <span className="truncate">{reel.location || 'Coimbatore, Tamil Nadu'}</span>
          </div>
        )}
        <h3 className="font-heading font-bold text-white text-sm sm:text-base leading-tight line-clamp-2 drop-shadow">
          {reel.title}
        </h3>
        {reel.showCategory && reel.category && (
          <div className="flex items-center justify-between text-[11px] text-white/60 font-accent pt-1">
            <span className="truncate">{reel.category}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <section id="reels" className="py-16 md:py-24 bg-[#FAFAFA] relative overflow-hidden font-body select-none border-t border-gray-200">
      {/* Background Energy Grid matching Services & Projects */}
      <EnergyGrid opacity={0.035} color="black" />

      {/* Subtle ambient light glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-red/[0.035] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-gray-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top and Bottom Accent Lines */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* TOP HEADER MATCHING WEBSITE DESIGN SYSTEM */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <span className="section-label">Behind The Scenes</span>
            <h2 className="section-title">
              Connecting Our Passion <span className="text-red">to Your Life</span>
            </h2>
            <span className="red-line-center" />
            <p className="section-subtitle mx-auto">
              Experience our real rooftop solar panel installations, customer success stories, and subsidy guidance in high-definition video reels.
            </p>
          </div>
        </Reveal>

        {/* CARDS CAROUSEL */}
        <div className="w-full flex items-center justify-between gap-3 sm:gap-4 md:gap-6">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            disabled={reels.length <= 1}
            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full bg-white text-gray-900 flex items-center justify-center border border-gray-200 shadow-card hover:shadow-card-md hover:bg-red hover:text-white hover:border-red transition-all duration-250 z-20 flex-shrink-0 ${reels.length <= 1
                ? 'opacity-30 cursor-not-allowed'
                : 'cursor-pointer hover:scale-105 active:scale-95'
              }`}
            aria-label="Previous Reels"
          >
            <FiChevronLeft size={22} className="md:w-6 md:h-6" />
          </button>

          {/* Mobile View: Single Reel with horizontal slide transition */}
          <div
            className="flex-1 flex md:hidden items-center justify-center min-w-0"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="w-full max-w-[240px] xs:max-w-[255px] sm:max-w-[270px] overflow-hidden rounded-2xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
              <AnimatePresence mode="wait" custom={slideDirection}>
                {loading ? (
                  <div className="aspect-[9/16] bg-gray-200 rounded-2xl animate-pulse border border-gray-300 w-full" />
                ) : currentMobileReel ? (
                  <motion.div
                    key={currentMobileReel._id || safeMobileIndex}
                    custom={slideDirection}
                    variants={{
                      enter: (dir) => ({
                        x: dir > 0 ? 60 : -60,
                        opacity: 0,
                        scale: 0.98
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                      },
                      exit: (dir) => ({
                        x: dir > 0 ? -60 : 60,
                        opacity: 0,
                        scale: 0.98,
                        transition: { duration: 0.18, ease: [0.7, 0, 0.84, 0] }
                      })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full"
                  >
                    {renderReelCard(currentMobileReel, safeMobileIndex)}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop View: Centered 4-Column Grid */}
          <div className={`hidden md:grid flex-1 gap-6 justify-center items-center ${visibleReels.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
              visibleReels.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
                visibleReels.length === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto' :
                  'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[9/16] bg-gray-200 rounded-2xl animate-pulse border border-gray-300" />
              ))
            ) : (
              visibleReels.map((reel, idx) => {
                const globalIdx = startIndex + idx;
                return renderReelCard(reel, globalIdx);
              })
            )}
          </div>

          {/* Right Slider Arrow */}
          <button
            onClick={handleNext}
            disabled={reels.length <= 1}
            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full bg-white text-gray-900 flex items-center justify-center border border-gray-200 shadow-card hover:shadow-card-md hover:bg-red hover:text-white hover:border-red transition-all duration-250 z-20 flex-shrink-0 ${reels.length <= 1
                ? 'opacity-30 cursor-not-allowed'
                : 'cursor-pointer hover:scale-105 active:scale-95'
              }`}
            aria-label="Next Reels"
          >
            <FiChevronRight size={22} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Mobile View Indicators (Dots) */}
        {!loading && reels.length > 1 && (
          <div className="flex md:hidden items-center justify-center gap-1.5 mt-6 z-20">
            {reels.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSlideDirection(idx > safeMobileIndex ? 1 : -1);
                  setMobileIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === safeMobileIndex ? 'w-6 bg-red shadow-sm shadow-red/40' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to reel ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA to view all reels */}
        <Reveal delay={0.2}>
          <div className="mt-12 md:mt-16 text-center">
            <Link to="/reels">
              <Button variant="outline" icon={<FiArrowRight />}>
                View All Reels
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>

      {/* IN-PAGE FULL-SCREEN REEL VIEWER MODAL */}
      <AnimatePresence>
        {activeReelIndex !== null && activeReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col overflow-hidden"
          >
            {/* Top Bar Header */}
            <div className="relative flex-shrink-0 w-full z-30 px-4 py-2.5 sm:px-6 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent">
              <button
                onClick={handleCloseReel}
                className="flex items-center gap-2 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 transition-colors text-xs font-accent uppercase tracking-wider cursor-pointer z-10"
              >
                <FiX size={18} />
                <span>Close</span>
              </button>

              {/* Exact Dead-Center Aligned Reel Index Counter (1/2, 2/2) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-accent font-semibold text-white/90 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/15 shadow-md">
                {activeReelIndex + 1} / {reels.length}
              </div>

              <button
                onClick={handleToggleMute}
                className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/15 transition-colors cursor-pointer z-10"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <FiVolumeX size={18} className="text-red" /> : <FiVolume2 size={18} className="text-emerald-400" />}
              </button>
            </div>

            {/* Main Video Area with increased height and width */}
            <div className="relative flex-1 min-h-0 w-full flex items-center justify-center px-2 sm:px-4 pt-1 pb-2 sm:pb-3">
              {/* Left/Right Navigation Buttons (Outside Video) */}
              {activeReelIndex > 0 && (
                <button
                  onClick={handlePrevModal}
                  className="absolute left-3 md:left-10 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Previous reel"
                >
                  <FiChevronLeft size={26} />
                </button>
              )}
              {activeReelIndex < reels.length - 1 && (
                <button
                  onClick={handleNextModal}
                  className="absolute right-3 md:right-10 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Next reel"
                >
                  <FiChevronRight size={26} />
                </button>
              )}

              <div
                onClick={handleTogglePlay}
                className="relative h-full max-h-full aspect-[9/16] w-full max-w-[450px] sm:max-w-[480px] md:max-w-[500px] mx-auto rounded-3xl md:rounded-[36px] overflow-hidden bg-black flex items-center justify-center cursor-pointer shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/15 ring-1 ring-white/10"
              >
                <video
                  ref={(el) => (videoRefs.current[activeReel._id] = el)}
                  src={getMediaUrl(activeReel.videoUrl)}
                  poster={activeReel.thumbnailUrl ? getMediaUrl(activeReel.thumbnailUrl) : undefined}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover rounded-3xl md:rounded-[36px]"
                />

                {/* Play/Pause Center Indicator */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.9 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white pointer-events-none z-20 border border-white/20"
                    >
                      <FiPlay size={32} className="ml-1" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Gradient Shadow Bottom */}
                <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />

                {/* UNIFIED COMPACT BOTTOM OVERLAY WITH NEATLY ALIGNED SHARE BUTTON */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5 pt-12 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none">
                  <div className="flex items-end justify-between gap-3">
                    {/* Left: Badges, Title, Description */}
                    <div className="flex-1 min-w-0 space-y-1.5 pointer-events-auto text-left">
                      {((activeReel.showSystemCapacity && activeReel.systemCapacity) ||
                        activeReel.location ||
                        (activeReel.showLocation && activeReel.location) ||
                        (activeReel.showCategory && activeReel.category)) && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {activeReel.showCategory && activeReel.category && (
                            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-accent font-semibold px-2.5 py-0.5 rounded-full capitalize border border-white/15">
                              {activeReel.category}
                            </span>
                          )}
                          {activeReel.showSystemCapacity && activeReel.systemCapacity && (
                            <span className="inline-flex items-center gap-1 bg-red text-white text-[10px] font-accent font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              <FiZap size={11} /> {activeReel.systemCapacity}
                            </span>
                          )}
                          {(activeReel.location || activeReel.showLocation) && (
                            <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-accent font-medium px-2.5 py-0.5 rounded-full border border-white/10">
                              <FiMapPin size={11} className="text-red" /> {activeReel.location || 'Coimbatore, Tamil Nadu'}
                            </span>
                          )}
                        </div>
                      )}

                      <div>
                        {activeReel.title && (
                          <h3 className="font-heading text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
                            {activeReel.title}
                          </h3>
                        )}
                        {activeReel.showDescription && activeReel.description && (
                          <p className="text-xs text-white/80 font-body line-clamp-2 mt-1 leading-relaxed drop-shadow">
                            {activeReel.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Compact, Neatly Aligned Share Button */}
                    <div className="shrink-0 pointer-events-auto pb-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareSheetOpen(true);
                        }}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                        aria-label="Share reel"
                      >
                        <div className="w-11 h-11 rounded-full bg-white/15 hover:bg-red backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-active:scale-95 shadow-lg">
                          <FiShare2 size={20} />
                        </div>
                        <span className="text-[10px] font-accent font-semibold text-white/90 drop-shadow">
                          Share
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Solar Savings CTA (if enabled by admin) */}
                  {activeReel.showSolarSavingsBtn && (
                    <div className="mt-3 pointer-events-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuoteClick();
                        }}
                        className="w-full bg-gradient-to-r from-red to-red-hover text-white text-xs font-accent font-bold uppercase tracking-wider py-2.5 px-4 rounded-2xl shadow-lg shadow-red/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                      >
                        <FiZap size={15} className="text-amber-300 animate-pulse" />
                        <span>Calculate Solar Savings</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Share Sheet Modal */}
            <ReelShareSheet
              isOpen={shareSheetOpen}
              onClose={() => setShareSheetOpen(false)}
              reel={activeReel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReelCarousel;
