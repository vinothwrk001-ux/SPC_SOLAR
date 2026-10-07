import React, { useState } from 'react';
import { FiX, FiCheckCircle, FiGift } from 'react-icons/fi';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LeadCaptureModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    state: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Please enter your mobile number';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Please enter your state';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericVal = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericVal }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          city: formData.city.trim(),
          state: formData.state.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
      } else {
        setServerError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setServerError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setFormData({ name: '', phone: '', city: '', state: '' });
    setErrors({});
    setServerError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 rounded-full p-1 z-10"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FiGift className="animate-pulse" /> Special Offer
          </div>
          <h2 className="text-xl font-heading font-bold uppercase tracking-wider mb-1 text-white">
            REQUEST <span className="text-red-500">QUOTATION</span>
          </h2>
          <p className="text-sm text-gray-300 font-body">
            {isSuccess ? (
              'Request Received!'
            ) : (
              <>
                Request a quote to get up to <span className="text-amber-400 font-bold">₹1,000 offer</span>
              </>
            )}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
              {serverError}
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input 
                label="Full Name" 
                name="name" 
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              <Input 
                label="Phone Number" 
                name="phone" 
                type="tel" 
                placeholder="Enter your mobile number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                error={errors.phone}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="City" 
                  name="city" 
                  placeholder="e.g. Coimbatore"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  required
                />
                <Input 
                  label="State" 
                  name="state" 
                  placeholder="e.g. Tamil Nadu"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Request Quote'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <FiCheckCircle className="mx-auto text-green-500 mb-4" size={60} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quotation Requested!</h3>
              <p className="text-gray-600 mb-6">
                Thank you, <span className="font-bold text-gray-800">{formData.name}</span>. Our team will contact you shortly with your personalized quotation and offer details.
              </p>
              <Button variant="primary" onClick={resetAndClose} className="w-full">
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
