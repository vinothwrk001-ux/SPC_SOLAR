import React from 'react';

const StatsBar = () => {
  return (
    <div className="bg-red py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center space-y-4 md:space-y-0 text-white">
          <div>
            <h4 className="font-accent text-3xl font-bold">25 Yrs</h4>
            <p className="font-heading uppercase tracking-wider text-sm mt-1">Performance Warranty</p>
          </div>
          <div className="hidden md:block w-px h-10 bg-white/30"></div>
          <div>
            <h4 className="font-accent text-3xl font-bold">Tier 1</h4>
            <p className="font-heading uppercase tracking-wider text-sm mt-1">Solar Panels</p>
          </div>
          <div className="hidden md:block w-px h-10 bg-white/30"></div>
          <div>
            <h4 className="font-accent text-3xl font-bold">24/7</h4>
            <p className="font-heading uppercase tracking-wider text-sm mt-1">Maintenance Support</p>
          </div>
          <div className="hidden md:block w-px h-10 bg-white/30"></div>
          <div>
            <h4 className="font-accent text-3xl font-bold">₹78,000</h4>
            <p className="font-heading uppercase tracking-wider text-sm mt-1">Max Gov Subsidy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
