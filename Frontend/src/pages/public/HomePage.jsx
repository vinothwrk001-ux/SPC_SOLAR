import React from 'react';
import SEOHead from '../../components/ui/SEOHead';
import HeroSection from '../../components/home/HeroSection';
import StatsBar from '../../components/home/StatsBar';
import ServicesSection from '../../components/home/ServicesSection';
import ProjectsPreview from '../../components/home/ProjectsPreview';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import SubsidyBanner from '../../components/home/SubsidyBanner';
import ReelCarousel from '../../components/reels/ReelCarousel';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import CTABanner from '../../components/home/CTABanner';
import ErrorBoundary from '../../components/ui/ErrorBoundary';

const HomePage = () => {
  return (
    <div className="bg-bg">
      <SEOHead 
        title="SPC Solar | Best Solar Panel Installation" 
        description="SPC Solar offers residential, commercial & industrial solar panel installation. Get up to ₹78,000 government subsidy. Free quotation." 
      />
      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <ProjectsPreview />
      <WhyChooseUs />
      <ErrorBoundary fallback={null}>
        <ReelCarousel />
      </ErrorBoundary>
      <SubsidyBanner />
      <TestimonialsSection />
      <CTABanner />
    </div>
  );
};

export default HomePage;
