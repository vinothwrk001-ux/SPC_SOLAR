import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { PageTransition } from '../motion';
import ErrorBoundary from '../ui/ErrorBoundary';
import ReferralFloatingWidget from '../referral/ReferralFloatingWidget';
import WhatsAppFloatingButton from './WhatsAppFloatingButton';

const PublicLayout = () => {
  const location = useLocation();
  const isQuotationPage = location.pathname.startsWith('/quotation');

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

      {/* Global Floating Action Stack: WhatsApp + Refer & Earn */}
      <div
        className={`fixed ${
          isQuotationPage ? 'bottom-16 sm:bottom-5' : 'bottom-3 sm:bottom-5'
        } right-2.5 sm:right-6 z-40 select-none flex flex-col items-end gap-2.5 sm:gap-3`}
      >
        <WhatsAppFloatingButton />
        <ReferralFloatingWidget embedded />
      </div>
    </div>
  );
};

export default PublicLayout;
