import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, FiChevronRight, FiPlay, FiZap, FiMapPin, FiEye, 
  FiX, FiVolume2, FiVolumeX, FiShare2
} from 'react-icons/fi';
import { 
  getPublicReels, 
  recordReelView, 
  recordQuoteClick 
} from '../../services/reelService';
import ReelShareSheet from './ReelShareSheet';
import { useNavigate } from 'react-router-dom';

const ReelCarousel = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  // In-Page Fullscreen Modal State
  const [activeReelIndex, setActiveReelIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('spc_reel_muted') === 'true');
  const [shareSheetOpen, setShareSheetOpen] = useState(false);

  const videoRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

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
      recordReelView(reel._id).catch(() => {});
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

  // CTA Click
  const handleQuoteClick = () => {
    if (activeReelIndex !== null && reels[activeReelIndex]) {
      recordQuoteClick(reels[activeReelIndex]._id).catch(() => {});
    }
    handleCloseReel();
    navigate('/quotation');
  };

  const visibleReels = reels.slice(startIndex, startIndex + itemsPerPage);
  const activeReel = activeReelIndex !== null ? reels[activeReelIndex] : null;

  if (!loading && reels.length === 0) return null;

  return (
    <section id="reels" className="relative font-body select-none overflow-hidden">
      {/* 50/50 PERFECT SPLIT BACKGROUND */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        {/* TOP HALF: PURE WHITE (50% HEIGHT) */}
        <div className="bg-white h-[45%] md:h-[50%] w-full" />
        
        {/* BOTTOM HALF: DARK DIAGONAL STRIPED TEXTURE (50% HEIGHT) */}
        <div 
          className="h-[55%] md:h-[50%] w-full border-b border-white/10"
          style={{
            backgroundColor: '#0e0e0e',
            backgroundImage: 'repeating-linear-gradient(-45deg, #181818, #181818 2px, #0e0e0e 2px, #0e0e0e 12px)'
          }}
        />
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 pt-16 md:pt-20 pb-20 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* TOP HEADER IN WHITE SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <div className="inline-block border border-red/40 rounded-full px-6 py-1.5 text-xs font-accent font-bold tracking-widest text-red uppercase mb-4 shadow-sm bg-white">
            BEHIND THE SCENES
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-black">
            From Our Hands to Yours
          </h2>
          <p className="text-gray-600 text-sm md:text-base font-body mt-3 max-w-xl mx-auto">
            Experience our real rooftop solar panel installations, customer success stories, and subsidy guidance in high-definition video reels.
          </p>
        </div>

        {/* CARDS GRID STRADDLING THE 50/50 SPLIT LINE */}
        <div className="w-full flex items-center justify-between gap-3 md:gap-6">
          {/* Left Arrow (Dark Button) */}
          <button
            onClick={handlePrevSlide}
            disabled={reels.length <= itemsPerPage}
            className={`w-12 h-12 rounded-full bg-[#444444] text-white flex items-center justify-center border border-white/20 z-20 flex-shrink-0 transition-all ${
              reels.length <= itemsPerPage 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-red hover:border-red shadow-2xl cursor-pointer'
            }`}
            aria-label="Previous Reels"
          >
            <FiChevronLeft size={24} />
          </button>

          {/* Cards Grid Centered */}
          <div className={`flex-1 grid gap-6 justify-center items-center ${
            visibleReels.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            visibleReels.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
            visibleReels.length === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto' :
            'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[9/16] bg-white/5 rounded-3xl animate-pulse border border-white/10" />
              ))
            ) : (
              visibleReels.map((reel, idx) => {
                const globalIdx = startIndex + idx;
                return (
                  <motion.div
                    key={reel._id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleOpenReel(globalIdx)}
                    className="group relative aspect-[9/16] bg-[#141414] rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] cursor-pointer"
                  >
                    {/* Video / Thumbnail */}
                    {reel.thumbnailUrl ? (
                      <img
                        src={reel.thumbnailUrl}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <video
                        src={reel.videoUrl}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:via-black/40 transition-colors" />

                    {/* Play Button Icon */}
                    <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-red/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <FiPlay size={24} className="ml-1" />
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-accent font-semibold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                        <FiZap size={11} className="text-amber-400" /> {reel.systemCapacity}
                      </span>
                      <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-accent font-semibold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                        <FiEye size={11} className="text-red" /> {reel.viewsCount || 0}
                      </span>
                    </div>

                    {/* Bottom Details Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-left space-y-1 z-10">
                      <div className="flex items-center gap-1 text-[11px] text-red font-accent font-semibold">
                        <FiMapPin size={12} /> {reel.location}
                      </div>
                      <h3 className="font-heading font-bold text-white text-base leading-tight line-clamp-2 drop-shadow">
                        {reel.title}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] text-white/60 font-accent pt-1">
                        <span>{reel.category}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Right Slider Arrow (White Button) */}
          <button
            onClick={handleNextSlide}
            disabled={reels.length <= itemsPerPage}
            className={`w-12 h-12 rounded-full bg-white text-black flex items-center justify-center border border-white/20 z-20 flex-shrink-0 transition-all ${
              reels.length <= itemsPerPage 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-red hover:text-white shadow-2xl cursor-pointer'
            }`}
            aria-label="Next Reels"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* IN-PAGE FULL-SCREEN REEL VIEWER MODAL */}
      <AnimatePresence>
        {activeReelIndex !== null && activeReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between overflow-hidden"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
              <button
                onClick={handleCloseReel}
                className="flex items-center gap-2 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 transition-colors text-xs font-accent uppercase tracking-wider"
              >
                <FiX size={18} />
                <span>Close</span>
              </button>

              <div className="text-xs font-accent font-semibold text-white/80 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                {activeReelIndex + 1} / {reels.length}
              </div>

              <button
                onClick={handleToggleMute}
                className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/15 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <FiVolumeX size={18} className="text-red" /> : <FiVolume2 size={18} className="text-emerald-400" />}
              </button>
            </div>

            {/* Main Video Area */}
            <div className="relative flex-1 w-full h-full flex items-center justify-center">
              <div 
                onClick={handleTogglePlay}
                className="relative w-full h-full max-w-md mx-auto overflow-hidden bg-black flex items-center justify-center cursor-pointer"
              >
                <video
                  ref={(el) => (videoRefs.current[activeReel._id] = el)}
                  src={activeReel.videoUrl}
                  poster={activeReel.thumbnailUrl}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
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
                <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />

                {/* Right Side Floating Button - SHARE ONLY */}
                <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareSheetOpen(true);
                    }}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="p-3.5 rounded-full bg-black/50 hover:bg-red backdrop-blur-md border border-white/20 text-white group-hover:scale-110 transition-all shadow-xl">
                      <FiShare2 size={24} />
                    </div>
                    <span className="text-[11px] font-accent font-semibold text-white drop-shadow">
                      Share
                    </span>
                  </button>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute left-4 right-20 bottom-6 z-20 space-y-3 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-red/90 text-white text-[10px] font-accent font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                      <FiZap size={11} /> {activeReel.systemCapacity || 'Solar System'}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-accent font-medium px-2.5 py-0.5 rounded-full">
                      <FiMapPin size={11} className="text-red" /> {activeReel.location || 'Tamil Nadu'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold text-white line-clamp-1 leading-snug drop-shadow-md">
                      {activeReel.title}
                    </h3>
                    {activeReel.description && (
                      <p className="text-xs text-white/80 font-body line-clamp-2 mt-1 leading-relaxed drop-shadow">
                        {activeReel.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuoteClick();
                    }}
                    className="w-full bg-gradient-to-r from-red to-red-hover text-white text-xs font-accent font-bold uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg shadow-red/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <FiZap size={16} className="text-amber-300 animate-pulse" />
                    <span>Calculate Solar Savings</span>
                  </button>
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
