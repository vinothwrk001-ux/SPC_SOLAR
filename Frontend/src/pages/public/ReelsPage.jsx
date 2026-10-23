import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShare2, FiVolume2, FiVolumeX, FiChevronUp, FiChevronDown, 
  FiPlay, FiArrowLeft, FiZap, FiMapPin, FiX
} from 'react-icons/fi';
import SEOHead from '../../components/ui/SEOHead';
import { getBreadcrumbSchema } from '../../components/seo/schemas';
import ReelShareSheet from '../../components/reels/ReelShareSheet';
import { 
  getPublicReels, 
  recordReelView, 
  recordQuoteClick 
} from '../../services/reelService';
import { usePreload } from '../../context/PreloadContext';

const CATEGORIES = ['All', 'Installation', 'Testimonial', 'Commercial', 'Subsidy Explainer', 'Products'];

const ReelsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { preloadedData } = usePreload();

  const [reels, setReels] = useState(() => preloadedData?.reels || []);
  const [loading, setLoading] = useState(() => !preloadedData?.reels);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Audio & Playback state
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('spc_reel_muted') === 'true';
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);

  const videoRefs = useRef({});
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);

  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const backendBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    if (url.startsWith('/uploads')) return `${backendBase}${url}`;
    return `${backendBase}/uploads/${url.startsWith('/') ? url.slice(1) : url}`;
  };

  // Fetch reels from API
  useEffect(() => {
    if (selectedCategory === 'All' && preloadedData?.reels && preloadedData.reels.length > 0 && reels.length > 0) {
      setLoading(false);
      const requestedId = searchParams.get('id');
      if (requestedId && reels.length > 0) {
        const idx = reels.findIndex(r => r._id === requestedId);
        if (idx !== -1) setCurrentIndex(idx);
      }
      return;
    }

    const fetchReels = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        const data = await getPublicReels(params);
        setReels(data || []);

        const requestedId = searchParams.get('id');
        if (requestedId && data.length > 0) {
          const idx = data.findIndex(r => r._id === requestedId);
          if (idx !== -1) setCurrentIndex(idx);
        }
      } catch (err) {
        console.error('Failed to load reels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, [selectedCategory]);

  // Record view on current reel index change
  useEffect(() => {
    if (reels.length > 0 && reels[currentIndex]) {
      const currentReel = reels[currentIndex];
      recordReelView(currentReel._id).catch(() => {});

      Object.keys(videoRefs.current).forEach((key) => {
        const vid = videoRefs.current[key];
        if (vid) {
          if (key === currentReel._id) {
            vid.muted = isMuted;
            vid.play().catch(() => {});
            setIsPlaying(true);
          } else {
            vid.pause();
            vid.currentTime = 0;
          }
        }
      });
    }
  }, [currentIndex, reels, isMuted]);

  // Handle Mute toggle
  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('spc_reel_muted', newMuted ? 'true' : 'false');
    if (reels[currentIndex]) {
      const vid = videoRefs.current[reels[currentIndex]._id];
      if (vid) vid.muted = newMuted;
    }
  };

  // Handle Play / Pause toggle
  const handleTogglePlay = () => {
    if (reels[currentIndex]) {
      const vid = videoRefs.current[reels[currentIndex]._id];
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

  // Navigation handlers
  const handleNextReel = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // CTA Click: Calculate Solar Savings
  const handleQuoteClick = async () => {
    const reel = reels[currentIndex];
    if (reel) {
      recordQuoteClick(reel._id).catch(() => {});
    }
    navigate('/quotation');
  };

  // Touch gestures for mobile vertical swipe navigation
  const handleTouchStart = (e) => {
    touchEndY.current = null;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null || touchEndY.current === null) return;
    const deltaY = touchStartY.current - touchEndY.current;
    if (deltaY > 50) {
      handleNextReel();
    } else if (deltaY < -50) {
      handlePrevReel();
    }
    touchStartY.current = null;
    touchEndY.current = null;
  };

  const currentReel = reels[currentIndex];

  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col justify-between overflow-hidden select-none">
      <SEOHead 
        title="Solar Installation Reels & Video Reviews | SPC Solar Coimbatore" 
        description="Watch high-definition video walkthroughs, drone footage, customer testimonials, and rooftop solar installation timelapses from SPC Solar Coimbatore."
        canonical="/reels"
        keywords={[
          'solar reels coimbatore',
          'solar installation video clips',
          'solar energy shorts tamil nadu',
          'rooftop solar walkthrough coimbatore',
          'spc solar reviews video',
          'solar customer testimonials coimbatore'
        ]}
        schema={[
          getBreadcrumbSchema([
            { label: 'Solar Reels', to: '/reels' }
          ])
        ]}
      />

      {/* TOP BAR OVERLAY */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 pt-[max(1rem,env(safe-area-inset-top))] bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 transition-colors text-xs font-accent uppercase tracking-wider"
        >
          <FiArrowLeft size={16} />
          <span>Home</span>
        </Link>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[60%] px-2 snap-x snap-mandatory touch-pan-x">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-accent font-semibold transition-all whitespace-nowrap snap-center ${
                selectedCategory === cat
                  ? 'bg-red text-white shadow-lg shadow-red/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleToggleMute}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/10 transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FiVolumeX size={18} className="text-red" /> : <FiVolume2 size={18} className="text-emerald-400" />}
        </button>
      </div>

      {/* MAIN VIDEO PLAYER VIEWPORT */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black p-2 sm:p-4 md:p-6">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-white/60">
            <div className="w-10 h-10 border-4 border-red border-t-transparent rounded-full animate-spin" />
            <p className="font-accent text-sm tracking-wide">Loading Solar Reels...</p>
          </div>
        ) : reels.length === 0 ? (
          <div className="text-center p-6 space-y-4">
            <p className="text-white/70 font-accent">No reels found in "{selectedCategory}".</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="bg-red text-white text-xs px-4 py-2 rounded-xl font-accent font-semibold"
            >
              View All Reels
            </button>
          </div>
        ) : (
          <div 
            onClick={handleTogglePlay}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-[450px] sm:max-w-[480px] md:max-w-[500px] aspect-[9/16] max-h-[calc(100dvh-4.5rem)] mx-auto rounded-3xl md:rounded-[36px] overflow-hidden bg-black flex items-center justify-center cursor-pointer shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/15 ring-1 ring-white/10"
          >
            <video
              ref={(el) => (videoRefs.current[currentReel._id] = el)}
              src={getMediaUrl(currentReel.videoUrl)}
              poster={currentReel.thumbnailUrl ? getMediaUrl(currentReel.thumbnailUrl) : undefined}
              loop
              playsInline
              webkit-playsinline="true"
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

            <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />

            {/* UNIFIED COMPACT BOTTOM OVERLAY WITH NEATLY ALIGNED SHARE BUTTON */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5 pt-12 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none">
              <div className="flex items-end justify-between gap-3">
                {/* Left: Badges, Title, Description */}
                <div className="flex-1 min-w-0 space-y-1.5 pointer-events-auto text-left">
                  {/* Badges: Only display if admin selected and provided */}
                  {((currentReel.showSystemCapacity && currentReel.systemCapacity) ||
                    currentReel.location ||
                    (currentReel.showLocation && currentReel.location) ||
                    (currentReel.showCategory && currentReel.category)) && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {currentReel.showCategory && currentReel.category && (
                        <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-accent font-semibold px-2.5 py-0.5 rounded-full capitalize border border-white/15">
                          {currentReel.category}
                        </span>
                      )}
                      {currentReel.showSystemCapacity && currentReel.systemCapacity && (
                        <span className="inline-flex items-center gap-1 bg-red text-white text-[10px] font-accent font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          <FiZap size={11} /> {currentReel.systemCapacity}
                        </span>
                      )}
                      {(currentReel.location || currentReel.showLocation) && (
                        <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-accent font-medium px-2.5 py-0.5 rounded-full border border-white/10">
                          <FiMapPin size={11} className="text-red" /> {currentReel.location || 'Coimbatore, Tamil Nadu'}
                        </span>
                      )}
                    </div>
                  )}

                  <div>
                    {currentReel.title && (
                      <h3 className="font-heading text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
                        {currentReel.title}
                      </h3>
                    )}
                    {currentReel.showDescription && currentReel.description && (
                      <p className="text-xs text-white/80 font-body line-clamp-2 mt-1 leading-relaxed drop-shadow">
                        {currentReel.description}
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
              {currentReel.showSolarSavingsBtn && (
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
        )}
      </div>

      {/* BOTTOM UP/DOWN NAVIGATION CONTROLS */}
      {reels.length > 1 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={handlePrevReel}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white disabled:opacity-30 border border-white/10 hover:bg-black/90 transition-all"
            title="Previous Reel"
          >
            <FiChevronDown className="rotate-180" size={20} />
          </button>
          <div className="text-[10px] font-accent text-center font-bold text-white/60">
            {currentIndex + 1} / {reels.length}
          </div>
          <button
            onClick={handleNextReel}
            disabled={currentIndex === reels.length - 1}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white disabled:opacity-30 border border-white/10 hover:bg-black/90 transition-all"
            title="Next Reel"
          >
            <FiChevronDown size={20} />
          </button>
        </div>
      )}

      {currentReel && (
        <ReelShareSheet
          isOpen={shareSheetOpen}
          onClose={() => setShareSheetOpen(false)}
          reel={currentReel}
        />
      )}
    </div>
  );
};

export default ReelsPage;
