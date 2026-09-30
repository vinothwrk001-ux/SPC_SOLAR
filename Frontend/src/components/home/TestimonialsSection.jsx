import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { Reveal } from '../motion';

const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    role: 'Homeowner, Delhi',
    quote:
      'Installed a 5kW system. My electricity bill went from ₹6,000 to virtually zero! The team was highly professional and the installation was completed in just two days.',
    rating: 5,
    initial: 'RS',
    color: 'bg-red',
  },
  {
    name: 'Meera Reddy',
    role: 'Factory Owner, Hyderabad',
    quote:
      'SPC Solar executed our 200kW project flawlessly without disrupting our production schedule. The ROI has been better than projected — we broke even in 4 years.',
    rating: 5,
    initial: 'MR',
    color: 'bg-black-muted',
  },
  {
    name: 'Vikram Singh',
    role: 'Resident, Jaipur',
    quote:
      'They processed my PM Surya Ghar subsidy completely on my behalf. Received ₹78,000 without any hassle. Real experts in navigating government schemes.',
    rating: 5,
    initial: 'VS',
    color: 'bg-red-dark',
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? TESTIMONIALS.length - 1 : a - 1));
  const next = () => setActive((a) => (a === TESTIMONIALS.length - 1 ? 0 : a + 1));

  const t = TESTIMONIALS[active];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Diagonal red accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red/30 via-red to-red/30" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <span className="section-label">Client Stories</span>
            <h2 className="section-title">
              WHAT OUR <span className="text-red">CLIENTS SAY</span>
            </h2>
            <span className="red-line-center" />
          </div>
        </Reveal>

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="bg-gray-50 border border-gray-200 rounded-card p-10 md:p-14 text-center max-w-3xl mx-auto"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <FiStar key={i} size={18} className="text-red fill-red" style={{ fill: '#CC2222' }} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-body text-gray-700 text-lg leading-relaxed italic mb-8">
                "{t.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-heading text-sm flex-shrink-0`}>
                  {t.initial}
                </div>
                <div className="text-left">
                  <p className="font-heading text-lg text-black">{t.name}</p>
                  <p className="font-accent text-red text-xs font-bold uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-sm border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-red hover:text-red transition-all duration-250"
            >
              <FiChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === active ? 'w-6 h-2 bg-red' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-sm border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-red hover:text-red transition-all duration-250"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
