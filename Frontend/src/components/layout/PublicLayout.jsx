import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { PageTransition } from '../motion';
import ErrorBoundary from '../ui/ErrorBoundary';
import ReferralFloatingWidget from '../referral/ReferralFloatingWidget';

const PublicLayout = () => {
  const location = useLocation();

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

      {/* Global Refer & Earn Floating Action Widget */}
      <ReferralFloatingWidget />
    </div>
  );
};

export default PublicLayout;
