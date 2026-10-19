import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { PageTransition } from '../motion';
import ErrorBoundary from '../ui/ErrorBoundary';
import ReferralModal from '../referral/ReferralModal';
import ReferralFloatingWidget from '../referral/ReferralFloatingWidget';

const PublicLayout = () => {
  const location = useLocation();
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsReferralOpen(true);
    window.addEventListener('open-referral-modal', handleOpen);
    return () => window.removeEventListener('open-referral-modal', handleOpen);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ErrorBoundary>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </ErrorBoundary>
      </main>
      <Footer />

      {/* Global Refer & Earn Floating Action Widget & Modal */}
      <ReferralFloatingWidget onOpenModal={() => setIsReferralOpen(true)} />
      <ReferralModal isOpen={isReferralOpen} onClose={() => setIsReferralOpen(false)} />
    </div>
  );
};

export default PublicLayout;
