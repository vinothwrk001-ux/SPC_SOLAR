import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiPlay, FiExternalLink } from 'react-icons/fi';

const DEFAULT_BANNER = {
  _id: 'default-1',
  mediaUrl: 'https://images.unsplash.com/photo-1508514177221-188b1c77eca2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  mediaType: 'image',
  title: 'POWER YOUR FUTURE',
  subtitle: 'SOLAR ENERGY. REDEFINED.',
  ctaText: 'REQUEST A QUOTE',
  ctaUrl: '/quotation',
};

const HeroSection = () => {
  const [banners, setBanners] = useState([DEFAULT_BANNER]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/banner');
        if (data?.banners && data.banners.length > 0) {
          setBanners(data.banners);
        } else if (data && (data.mediaUrl || data.imageUrl)) {
          setBanners([
            {
              _id: data._id || '1',
              mediaUrl: data.mediaUrl || data.imageUrl,
              mediaType: data.mediaType || 'image',
              title: data.title || '',
              subtitle: data.subtitle || '',
              ctaText: data.ctaText || '',
              ctaUrl: data.ctaUrl || '',
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to load dynamic banners, using default.');
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;

    const currentSlide = banners[currentIndex];
    // Give more time for video slides or standard 6 seconds for images
    const duration = currentSlide?.mediaType === 'video' ? 10000 : 6500;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, duration);

    return () => clearInterval(timer);
  }, [banners.length, currentIndex, isHovered]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://localhost:5000${url}`;
  };

  const currentBanner = banners[currentIndex] || DEFAULT_BANNER;
  const isVideo = currentBanner.mediaType === 'video' || /\.(mp4|webm|mov|mkv)$/i.test(currentBanner.mediaUrl || currentBanner.imageUrl || '');
  const mediaSrc = getMediaUrl(currentBanner.mediaUrl || currentBanner.imageUrl);

  const handleCtaClick = (e, url) => {
    e.stopPropagation();
    if (!url) {
      window.dispatchEvent(new CustomEvent('open-lead-modal'));
      return;
    }

    const lowerUrl = url.trim().toLowerCase();
    if (
      lowerUrl === '#quote' ||
      lowerUrl === '#request-quote' ||
      lowerUrl === '#popup' ||
      lowerUrl === 'popup' ||
      lowerUrl === '/popup' ||
      lowerUrl === '/request-quote' ||
      lowerUrl === '#modal' ||
      lowerUrl === 'modal' ||
      lowerUrl === '#lead-modal'
    ) {
      window.dispatchEvent(new CustomEvent('open-lead-modal'));
      return;
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
    }
  };

  return (
    <section 
      className="relative w-full h-[70vh] sm:h-[80vh] md:h-screen min-h-[500px] md:min-h-[640px] bg-black overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Media Slider with AnimatePresence */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`slide-${currentBanner._id || currentIndex}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {isVideo ? (
            <video
              ref={(el) => (videoRefs.current[currentBanner._id] = el)}
              src={mediaSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-10000 ease-out"
              style={{ backgroundImage: `url('${mediaSrc}')` }}
            />
          )}

          {/* Subtle dark gradient overlay only if title/subtitle exists, else minimal overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content & CTA Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 md:pb-24 pointer-events-none">
        <div className="max-w-2xl space-y-4 pointer-events-auto">
          {/* Animated Title & Subtitle (rendered if provided) */}
          {currentBanner.title && (
            <motion.h1
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-wide uppercase drop-shadow-lg"
            >
              {currentBanner.title}
            </motion.h1>
          )}

          {currentBanner.subtitle && (
            <motion.p
              key={`sub-${currentIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-body text-base sm:text-lg md:text-xl text-gray-200 drop-shadow-md font-medium"
            >
              {currentBanner.subtitle}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            key={`cta-${currentIndex}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
          >
            {currentBanner.ctaText && (
              <button
                onClick={(e) => handleCtaClick(e, currentBanner.ctaUrl || '/quotation')}
                className="group inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-heading font-bold text-sm sm:text-base uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>{currentBanner.ctaText}</span>
                <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {currentBanner.secondaryCtaText && currentBanner.secondaryCtaUrl && (
              <button
                onClick={(e) => handleCtaClick(e, currentBanner.secondaryCtaUrl)}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-heading font-bold text-sm sm:text-base uppercase tracking-wider bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 hover:border-white/40 transition-all duration-200"
              >
                <span>{currentBanner.secondaryCtaText}</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows (Rendered when more than 1 banner) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-red-600 text-white backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110 shadow-lg hidden sm:flex items-center justify-center"
          >
            <FiChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-red-600 text-white backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110 shadow-lg hidden sm:flex items-center justify-center"
          >
            <FiChevronRight size={24} />
          </button>

          {/* Bottom Slide Indicator Pills / Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            {banners.map((b, idx) => (
              <button
                key={b._id || idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-7 h-2 bg-red-500 shadow-sm shadow-red-500/50'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;
