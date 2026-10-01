import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiMessageSquare, FiSend } from 'react-icons/fi';
import { Reveal } from '../motion';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  // Write Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    location: '',
    systemSize: '',
    rating: 5,
    review: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApprovedTestimonials();
  }, []);

  const fetchApprovedTestimonials = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/testimonials');
      setTestimonials(data || []);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.review) {
      toast.error('Please enter your name and review');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/testimonials/submit', reviewForm);
      toast.success('Thank you for your review! It will be displayed once approved by our team.');
      setIsModalOpen(false);
      setReviewForm({ name: '', location: '', systemSize: '', rating: 5, review: '' });
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  const currentItem = testimonials[active];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Diagonal red accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red/30 via-red to-red/30" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <span className="section-label">Client Stories</span>
            <h2 className="section-title">
              WHAT OUR <span className="text-red">CLIENTS SAY</span>
            </h2>
            <span className="red-line-center" />

            <div className="mt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-accent font-bold text-red hover:text-black transition-colors"
              >
                <FiMessageSquare /> <span>Write a Review / Share Your Experience</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Testimonial Content */}
        {loading ? (
          <div className="text-center py-12 text-gray font-accent">Loading Client Stories...</div>
        ) : testimonials.length > 0 && currentItem ? (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="bg-gray-50 border border-gray-200 rounded-card p-10 md:p-14 text-center max-w-3xl mx-auto shadow-sm"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: currentItem.rating || 5 }).map((_, i) => (
                    <FiStar key={i} size={18} className="text-red fill-red" style={{ fill: '#CC2222' }} />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="font-body text-gray-700 text-lg leading-relaxed italic mb-8">
                  "{currentItem.review}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red flex items-center justify-center text-white font-heading text-sm font-bold flex-shrink-0 uppercase">
                    {currentItem.name ? currentItem.name.slice(0, 2) : 'CL'}
                  </div>
                  <div className="text-left">
                    <p className="font-heading text-lg text-black">{currentItem.name}</p>
                    <p className="font-accent text-red text-xs font-bold uppercase tracking-wider">
                      {currentItem.location} {currentItem.systemSize ? `• ${currentItem.systemSize}` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {testimonials.length > 1 && (
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
                  {testimonials.map((_, i) => (
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
            )}
          </div>
        ) : (
          /* Empty State when 0 reviews are approved */
          <div className="bg-gray-50 border border-gray-200 rounded-card p-10 text-center max-w-xl mx-auto space-y-4">
            <p className="text-gray-600 font-body text-base">No client reviews published yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-red hover:bg-black text-white px-6 py-2.5 rounded-btn font-accent font-bold text-sm transition-colors"
            >
              <FiMessageSquare /> Be the first to write a review
            </button>
          </div>
        )}
      </div>

      {/* Customer Review Submission Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="SUBMIT YOUR CLIENT REVIEW">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <Input
            label="Your Name *"
            placeholder="e.g. Rahul Sharma"
            value={reviewForm.name}
            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
            required
          />

          <Input
            label="City / Location"
            placeholder="e.g. Homeowner, Coimbatore"
            value={reviewForm.location}
            onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
          />

          <Input
            label="Installed Solar System (Optional)"
            placeholder="e.g. 5kW Rooftop Solar"
            value={reviewForm.systemSize}
            onChange={(e) => setReviewForm({ ...reviewForm, systemSize: e.target.value })}
          />

          <div>
            <label className="block text-sm font-accent font-semibold mb-1">Your Rating</label>
            <select
              className="w-full px-4 py-2 border border-gray-light rounded-btn"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars - Good)</option>
              <option value="3">⭐⭐⭐ (3 Stars - Average)</option>
              <option value="2">⭐⭐ (2 Stars - Poor)</option>
              <option value="1">⭐ (1 Star - Terrible)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-accent font-semibold mb-1">Your Review / Experience *</label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 border border-gray-light rounded-btn text-sm"
              placeholder="Tell us about your experience with SPC Solar installation and energy bill savings..."
              value={reviewForm.review}
              onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
              required
            />
          </div>

          <Button type="submit" variant="primary" disabled={submitting} className="w-full bg-red hover:bg-black text-white flex items-center justify-center gap-2">
            <FiSend /> <span>{submitting ? 'Submitting...' : 'Submit Review for Approval'}</span>
          </Button>
        </form>
      </Modal>
    </section>
  );
};

export default TestimonialsSection;
