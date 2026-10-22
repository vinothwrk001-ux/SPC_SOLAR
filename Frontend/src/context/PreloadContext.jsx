import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Logo from '../assets/Logo.png';
import defaultHeroBanner from '../assets/hero-banner.png';

const PreloadContext = createContext(null);

const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
  const backendBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  if (url.startsWith('/uploads')) return `${backendBase}${url}`;
  return `${backendBase}/uploads/${url.startsWith('/') ? url.slice(1) : url}`;
};

const preloadImage = (src) => {
  if (!src) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = () => resolve(src);
  });
};

export const PreloadProvider = ({ children }) => {
  // Splash visibility & progress states
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(12);
  const [statusMessage, setStatusMessage] = useState('Initializing Solar Network...');

  // Preloaded data cache
  const [preloadedData, setPreloadedData] = useState({
    banners: null,
    reels: null,
    services: null,
    projects: null,
    testimonials: null,
    calculatorConfig: null,
  });

  const hasInitiated = useRef(false);

  useEffect(() => {
    if (hasInitiated.current) return;
    hasInitiated.current = true;

    // Fast check: If directly opening admin pages, skip splash
    if (window.location.pathname.startsWith('/admin')) {
      setShowSplash(false);
      setIsReady(true);
      return;
    }

    const startTime = Date.now();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const MINIMUM_SPLASH_TIME = isMobile ? 1100 : 1500; // Snappy, luxurious splash experience
    const SAFETY_TIMEOUT = 4000; // max safety timeout so user is never blocked

    let currentProgress = 15;
    const updateProgress = (target, msg) => {
      currentProgress = Math.max(currentProgress, target);
      setProgress(currentProgress);
      if (msg) setStatusMessage(msg);
    };

    // Preload logo immediately (vital for splash)
    preloadImage(Logo);
    // Defer heavy fallback hero banner to avoid blocking mobile bandwidth
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => preloadImage(defaultHeroBanner));
    } else {
      setTimeout(() => preloadImage(defaultHeroBanner), 1200);
    }

    // Warm up all core public endpoints in parallel
    const taskBanner = api.get('/banner')
      .then((res) => {
        updateProgress(35, 'Calibrating Dynamic Solar Banners...');
        const data = res.data;
        let formattedBanners = [];
        if (data?.banners && data.banners.length > 0) {
          formattedBanners = data.banners;
        } else if (data && (data.mediaUrl || data.imageUrl)) {
          formattedBanners = [
            {
              _id: data._id || '1',
              mediaUrl: data.mediaUrl || data.imageUrl,
              mobileMediaUrl: data.mobileMediaUrl || data.mobileImageUrl || '',
              mediaType: data.mediaType || 'image',
              title: data.title || '',
              subtitle: data.subtitle || '',
              ctaText: data.ctaText || '',
              ctaUrl: data.ctaUrl || '',
            },
          ];
        }
        // Preload active banner image
        if (formattedBanners.length > 0 && formattedBanners[0].mediaType !== 'video') {
          preloadImage(getMediaUrl(formattedBanners[0].mediaUrl));
        }
        return formattedBanners;
      })
      .catch((err) => {
        console.warn('Preload banner failed:', err);
        return null;
      });

    const taskReels = api.get('/reels')
      .then((res) => {
        updateProgress(55, 'Synchronizing Real Rooftop Installations...');
        const reelsList = res.data || [];
        // Preload first reel thumbnail if available
        if (reelsList.length > 0 && reelsList[0].thumbnailUrl) {
          preloadImage(getMediaUrl(reelsList[0].thumbnailUrl));
        }
        return reelsList;
      })
      .catch((err) => {
        console.warn('Preload reels failed:', err);
        return null;
      });

    const taskServices = api.get('/services')
      .then((res) => {
        updateProgress(70, 'Loading Clean Energy Services & PM Surya Ghar Subsidy...');
        return res.data || [];
      })
      .catch((err) => {
        console.warn('Preload services failed:', err);
        return null;
      });

    const taskProjects = api.get('/projects')
      .then((res) => {
        updateProgress(82, 'Retrieving Commissioned Solar Projects...');
        return res.data || [];
      })
      .catch((err) => {
        console.warn('Preload projects failed:', err);
        return null;
      });

    const taskTestimonials = api.get('/testimonials')
      .then((res) => {
        updateProgress(90, 'Loading Verified Customer Testimonials...');
        return res.data || [];
      })
      .catch((err) => {
        console.warn('Preload testimonials failed:', err);
        return null;
      });

    const taskCalcConfig = api.get('/solar-calculator/config')
      .then((res) => res.data?.config || null)
      .catch((err) => null);

    // Wait for all requests to finish or fail
    Promise.allSettled([
      taskBanner,
      taskReels,
      taskServices,
      taskProjects,
      taskTestimonials,
      taskCalcConfig,
    ]).then(([bannerRes, reelsRes, servicesRes, projectsRes, testimonialsRes, calcRes]) => {
      // Store loaded data in context cache
      setPreloadedData({
        banners: bannerRes.status === 'fulfilled' ? bannerRes.value : null,
        reels: reelsRes.status === 'fulfilled' ? reelsRes.value : null,
        services: servicesRes.status === 'fulfilled' ? servicesRes.value : null,
        projects: projectsRes.status === 'fulfilled' ? projectsRes.value : null,
        testimonials: testimonialsRes.status === 'fulfilled' ? testimonialsRes.value : null,
        calculatorConfig: calcRes.status === 'fulfilled' ? calcRes.value : null,
      });

      // Calculate remaining delay to fulfill MINIMUM_SPLASH_TIME
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MINIMUM_SPLASH_TIME - elapsed);

      // Smooth completion to 100%
      setTimeout(() => {
        updateProgress(100, 'Welcome to SPC Solar • Powering Tomorrow');
        // Swift completion before graceful fade
        setTimeout(() => {
          setIsReady(true);
        }, 200);
      }, remaining);
    });

    // Safety fallback timer
    const safetyTimer = setTimeout(() => {
      setIsReady(true);
    }, SAFETY_TIMEOUT);

    return () => clearTimeout(safetyTimer);
  }, []);

  const handleSplashExited = () => {
    setShowSplash(false);
  };

  return (
    <PreloadContext.Provider
      value={{
        isReady,
        showSplash,
        progress,
        statusMessage,
        preloadedData,
        handleSplashExited,
      }}
    >
      {children}
    </PreloadContext.Provider>
  );
};

export const usePreload = () => {
  const context = useContext(PreloadContext);
  if (!context) {
    return {
      isReady: true,
      showSplash: false,
      progress: 100,
      statusMessage: '',
      preloadedData: null,
      handleSplashExited: () => {},
    };
  }
  return context;
};

export default PreloadContext;
