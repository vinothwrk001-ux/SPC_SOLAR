import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiChevronRight } from 'react-icons/fi';

/**
 * Accessible & SEO-Optimized Breadcrumbs Component
 * Includes HTML5 microdata and Schema.org BreadcrumbList markup
 * Supports variant="dark" (for PageHero/black banners) or variant="light" (for white sections)
 */
export const Breadcrumbs = ({ items = [], variant = 'dark', className = '' }) => {
  const isDark = variant === 'dark';
  const allItems = [{ label: 'Home', to: '/' }, ...items];

  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-2 px-2 sm:px-4 max-w-7xl mx-auto ${className}`}
    >
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className={`flex items-center flex-wrap justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-accent ${
          isDark ? 'text-white/60' : 'text-gray-500'
        }`}
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const position = index + 1;

          return (
            <li
              key={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1.5 sm:gap-2"
            >
              {index > 0 && (
                <FiChevronRight
                  size={11}
                  className={`${isDark ? 'text-white/30' : 'text-gray-400'} shrink-0 select-none`}
                  aria-hidden="true"
                />
              )}

              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  itemProp="item"
                  className={`flex items-center gap-1 transition-colors duration-150 max-w-[130px] sm:max-w-[200px] truncate ${
                    isDark ? 'text-white/70 hover:text-red' : 'text-gray-600 hover:text-red'
                  }`}
                >
                  {index === 0 && <FiHome size={12} className="shrink-0 -mt-0.5" />}
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  itemProp="name"
                  aria-current={isLast ? 'page' : undefined}
                  className={`font-semibold max-w-[170px] sm:max-w-[260px] md:max-w-md truncate ${
                    isDark
                      ? isLast ? 'text-white' : 'text-white/70'
                      : isLast ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </span>
              )}

              <meta itemProp="position" content={String(position)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
