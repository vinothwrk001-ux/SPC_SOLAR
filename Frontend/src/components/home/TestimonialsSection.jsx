import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiMessageSquare, FiSend, FiUpload, FiX, FiImage } from 'react-icons/fi';
import { Reveal } from '../motion';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { usePreload } from '../../context/PreloadContext';

const formatImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  if (url.startsWith('/uploads')) return `${baseUrl}${url}`;
  return `${baseUrl}/uploads/${url}`;
};

const TestimonialsSection = () => {
  const { preloadedData } = usePreload();
  const [testimonials, setTestimonials] = useState(() => preloadedData?.testimonials || []);
  const [loading, setLoading] = useState(() => !preloadedData?.testimonials);
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preloadedData?.testimonials) {
      setTestimonials(preloadedData.testimonials);
      setLoading(false);
      return;
    }
    fetchApprovedTestimonials();
  }, [preloadedData?.testimonials]);

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (PNG, JPG, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.review) {
      toast.error('Please enter your name and review');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', reviewForm.name);
      data.append('location', reviewForm.location);
      data.append('systemSize', reviewForm.systemSize);
      data.append('rating', reviewForm.rating);
      data.append('review', reviewForm.review);
      if (selectedFile) {
        data.append('photo', selectedFile);
      }

      await api.post('/testimonials/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Thank you for your review! It will be displayed once approved by our team.');
      setIsModalOpen(false);
      setReviewForm({ name: '', location: '', systemSize: '', rating: 5, review: '' });
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  const currentItem = testimonials[active];

  return (
    <section className="py-10 md:py-14 bg-white relative overflow-hidden">
      {/* Diagonal red accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red/30 via-red to-red/30" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-6 md:mb-8">
            <span className="section-label">Client Stories</span>
            <h2 className="section-title text-2xl sm:text-3xl">
              WHAT OUR <span className="text-red">CLIENTS SAY</span>
            </h2>
            <span className="red-line-center" />

            <div className="mt-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-accent font-bold text-red hover:text-black transition-colors"
              >
                <FiMessageSquare size={13} /> <span>Write a Review / Share Your Experience</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Testimonial Content */}
        {loading ? (
          <div className="text-center py-8 text-gray font-accent text-xs">Loading Client Stories...</div>
        ) : testimonials.length > 0 && currentItem ? (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-gray-50/90 border border-gray-200/90 rounded-2xl p-5 sm:p-6 text-center max-w-md sm:max-w-lg mx-auto shadow-sm flex flex-col justify-between items-center"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-3">
                  {Array.from({ length: currentItem.rating || 5 }).map((_, i) => (
                    <FiStar key={i} size={15} className="text-red fill-red" style={{ fill: '#CC2222' }} />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="font-body text-gray-700 text-xs sm:text-sm leading-relaxed italic mb-4 px-2 max-w-sm line-clamp-4">
                  "{currentItem.review}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-200/70 w-full">
                  {currentItem.photo ? (
                    <img
                      src={formatImageUrl(currentItem.photo)}
                      alt={currentItem.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', maxWidth: '48px', maxHeight: '48px' }}
                      className="w-12 h-12 rounded-xl object-cover border border-red/40 shadow-2xs flex-shrink-0"
                    />
                  ) : (
                    <div 
                      style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px' }}
                      className="w-12 h-12 rounded-xl bg-red flex items-center justify-center text-white font-heading text-xs font-bold flex-shrink-0 uppercase shadow-2xs"
                    >
                      {currentItem.name ? currentItem.name.slice(0, 2) : 'CL'}
                    </div>
                  )}
                  <div className="text-left min-w-0 max-w-[240px]">
                    <p className="font-heading text-sm text-black font-bold truncate">{currentItem.name}</p>
                    <p className="font-accent text-red text-[10.5px] font-bold uppercase tracking-wider truncate">
                      {currentItem.location} {currentItem.systemSize ? `• ${currentItem.systemSize}` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <div className="flex justify-center items-center gap-3 mt-5">
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-red hover:text-red transition-all duration-200 shadow-2xs cursor-pointer"
                >
                  <FiChevronLeft size={16} />
                </button>

                {/* Dots */}
                <div className="flex items-center gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`Testimonial ${i + 1}`}
                      className={`transition-all duration-200 rounded-full cursor-pointer ${
                        i === active ? 'w-5 h-1.5 bg-red' : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-red hover:text-red transition-all duration-200 shadow-2xs cursor-pointer"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State when 0 reviews are approved */
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center max-w-md mx-auto space-y-3">
            <p className="text-gray-600 font-body text-xs">No client reviews published yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-red hover:bg-black text-white px-4 py-2 rounded-lg font-accent font-bold text-xs transition-colors"
            >
              <FiMessageSquare size={13} /> Be the first to write a review
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

          {/* Photo / Solar Installation Image Upload */}
          <div>
            <label className="block text-sm font-accent font-semibold mb-1 text-gray-800">
              Photo / Installation Image <span className="text-gray-400 font-normal text-xs">(Optional)</span>
            </label>
            
            {previewUrl ? (
              <div className="relative border border-gray-200 rounded-xl p-2.5 bg-gray-50 flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Review Preview"
                  className="w-14 h-14 rounded-lg object-cover border border-gray-300 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {selectedFile ? selectedFile.name : 'Image selected'}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 text-gray-400 hover:text-red hover:bg-red/10 rounded-lg transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 hover:border-red rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-gray-50 hover:bg-red/5 transition-all text-xs font-medium text-gray-600 group">
                <FiUpload className="text-gray-400 group-hover:text-red transition-colors" size={16} />
                <span>Upload your photo or solar setup (JPG, PNG, WEBP)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
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
