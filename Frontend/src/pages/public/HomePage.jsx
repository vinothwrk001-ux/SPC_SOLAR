import React, { useMemo } from 'react';
import SEOHead from '../../components/seo/SEOHead';
import { getLocalBusinessSchema, getWebSiteSchema, getOrganizationSchema } from '../../components/seo/schemas';
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
  const homeSchema = useMemo(() => [
    getLocalBusinessSchema(),
    getWebSiteSchema(),
    getOrganizationSchema()
  ], []);

  return (
    <div className="bg-bg">
      <SEOHead 
        title="SPC Solar | Best Solar in Coimbatore — Rooftop, Commercial & PM Surya Ghar Subsidy" 
        description="SPC Solar is Coimbatore’s #1 rated solar company. Expert rooftop solar installations, PM Surya Ghar subsidy up to ₹78,000, on-grid & hybrid solar solutions with 25-year panel warranty across Tamil Nadu."
        canonical="/"
        keywords={[
          'best solar in coimbatore',
          'solar company in coimbatore',
          'solar panel installation coimbatore',
          'rooftop solar coimbatore',
          'solar panel price coimbatore',
          'pm surya ghar subsidy coimbatore',
          'pm surya ghar muft bijli yojana tamil nadu',
          'tangedco net metering coimbatore',
          'commercial solar power coimbatore',
          'industrial solar epc coimbatore',
          'on-grid solar system coimbatore',
          'spc solar coimbatore'
        ]}
        schema={homeSchema}
      />
      <HeroSection />
      <StatsBar />
      <SubsidyBanner />
      <ServicesSection />
      <ProjectsPreview />
      <WhyChooseUs />
      <ErrorBoundary fallback={null}>
        <ReelCarousel />
      </ErrorBoundary>
      <TestimonialsSection />
      <CTABanner />
    </div>
  );
};

export default HomePage;
