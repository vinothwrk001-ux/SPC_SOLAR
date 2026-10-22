import React, { useState } from 'react';
import { FiCheck, FiAlertCircle, FiMonitor, FiSmartphone, FiSearch } from 'react-icons/fi';

const GoogleSERPPreview = ({ 
  title = '', 
  description = '', 
  slug = '', 
  focusKeyword = '' 
}) => {
  const [device, setDevice] = useState('desktop');

  const displayTitle = title.trim() || 'Solar Installation in Coimbatore | SPC Solar';
  const displayDesc = description.trim() || 'Learn more about rooftop solar systems, PM Surya Ghar subsidy up to ₹78,000, and turnkey installations by SPC Solar Coimbatore.';
  const displaySlug = (slug || 'solar-article').toLowerCase().replace(/^\//, '');

  const titleLength = displayTitle.length;
  const descLength = displayDesc.length;

  const titleStatus = titleLength >= 40 && titleLength <= 60 
    ? 'optimal' 
    : titleLength > 60 
      ? 'too-long' 
      : 'too-short';

  const descStatus = descLength >= 120 && descLength <= 160 
    ? 'optimal' 
    : descLength > 160 
      ? 'too-long' 
      : 'too-short';

  const kw = focusKeyword.trim().toLowerCase();
  const kwInTitle = kw ? displayTitle.toLowerCase().includes(kw) : false;
  const kwInDesc = kw ? displayDesc.toLowerCase().includes(kw) : false;
  const kwInSlug = kw ? displaySlug.includes(kw.replace(/\s+/g, '-')) : false;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header & Device Switcher */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <FiSearch className="text-red" size={16} />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800">
            Google SERP Snippet Preview
          </h4>
        </div>

        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              device === 'desktop' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FiMonitor size={12} /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              device === 'mobile' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FiSmartphone size={12} /> Mobile
          </button>
        </div>
      </div>

      {/* Visual Google Search Result Mockup */}
      <div className={`p-4 bg-gray-50/60 rounded-xl border border-gray-100 ${device === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
        {/* Favicon & Breadcrumb URL */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-red flex items-center justify-center text-[9px] text-white font-bold">
            S
          </div>
          <div className="text-[11px] leading-tight text-[#202124] truncate">
            <span className="font-medium">SPC Solar</span>
            <span className="text-[#5f6368] mx-1">›</span>
            <span className="text-[#5f6368] truncate">blog › {displaySlug}</span>
          </div>
        </div>

        {/* Google Clickable Blue Title */}
        <h3 className="text-[#1a0dab] hover:underline font-normal text-sm sm:text-base leading-snug cursor-pointer line-clamp-2">
          {displayTitle}
        </h3>

        {/* Snippet Description */}
        <p className="text-[#4d5156] text-xs sm:text-[13px] leading-relaxed mt-1 line-clamp-3">
          {displayDesc}
        </p>
      </div>

      {/* Real-time Character Counters & Quality Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        {/* Title Meter */}
        <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 space-y-1.5">
          <div className="flex items-center justify-between font-semibold">
            <span className="text-gray-700">Meta Title Length</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
              titleStatus === 'optimal' 
                ? 'bg-emerald-100 text-emerald-800' 
                : titleStatus === 'too-long' 
                  ? 'bg-red/10 text-red' 
                  : 'bg-amber-100 text-amber-800'
            }`}>
              {titleLength} / 60 Chars
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                titleStatus === 'optimal' ? 'bg-emerald-500' : titleStatus === 'too-long' ? 'bg-red' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500">
            {titleStatus === 'optimal' && 'Optimal title length for desktop & mobile SERPs.'}
            {titleStatus === 'too-long' && 'Warning: Title may get truncated with ellipsis on Google.'}
            {titleStatus === 'too-short' && 'Title is short. Add Coimbatore solar keywords.'}
          </p>
        </div>

        {/* Description Meter */}
        <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 space-y-1.5">
          <div className="flex items-center justify-between font-semibold">
            <span className="text-gray-700">Meta Description Length</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
              descStatus === 'optimal' 
                ? 'bg-emerald-100 text-emerald-800' 
                : descStatus === 'too-long' 
                  ? 'bg-red/10 text-red' 
                  : 'bg-amber-100 text-amber-800'
            }`}>
              {descLength} / 160 Chars
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                descStatus === 'optimal' ? 'bg-emerald-500' : descStatus === 'too-long' ? 'bg-red' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500">
            {descStatus === 'optimal' && 'Optimal description length for high click-through rates.'}
            {descStatus === 'too-long' && 'Warning: May exceed Google standard snippet display.'}
            {descStatus === 'too-short' && 'Description is short. Add benefits and call-to-action.'}
          </p>
        </div>
      </div>

      {/* Focus Keyword Audit (if keyword is provided) */}
      {focusKeyword && (
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">
              Focus Keyword: <strong className="text-red">"{focusKeyword}"</strong>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className={`p-1.5 rounded flex items-center gap-1.5 font-medium ${
              kwInTitle ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {kwInTitle ? <FiCheck size={12} /> : <FiAlertCircle size={12} />} In Title
            </div>
            <div className={`p-1.5 rounded flex items-center gap-1.5 font-medium ${
              kwInDesc ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {kwInDesc ? <FiCheck size={12} /> : <FiAlertCircle size={12} />} In Description
            </div>
            <div className={`p-1.5 rounded flex items-center gap-1.5 font-medium ${
              kwInSlug ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {kwInSlug ? <FiCheck size={12} /> : <FiAlertCircle size={12} />} In URL Slug
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleSERPPreview;
