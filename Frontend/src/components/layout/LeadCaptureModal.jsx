import React, { useState } from 'react';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LeadCaptureModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
    city: '',
    state: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) {
      setError('Phone number and password are required.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStep(3); // Success step
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setFormData({ phone: '', password: '', name: '', city: '', state: '' });
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 rounded-full p-1"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 text-center">
          <h2 className="text-xl font-heading font-bold uppercase tracking-wider mb-1 text-red-500">
            Request Quotation
          </h2>
          <p className="text-sm text-gray-300 font-body">
            {step === 1 ? 'Login to get up to ₹1000 OFF Coupon Code!' : step === 2 ? 'Almost there! Tell us about yourself.' : 'Request Received!'}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <Input 
                label="Phone Number" 
                name="phone" 
                type="tel" 
                placeholder="Enter your mobile number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <Input 
                label="Password" 
                name="password" 
                type="password" 
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button type="submit" variant="primary" className="w-full mt-6">
                Login & Continue
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                label="Full Name" 
                name="name" 
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="City" 
                  name="city" 
                  placeholder="e.g. Coimbatore"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <Input 
                  label="State" 
                  name="state" 
                  placeholder="e.g. Tamil Nadu"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">
                  Back
                </Button>
                <Button type="submit" variant="primary" className="w-2/3" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <FiCheckCircle className="mx-auto text-green-500 mb-4" size={60} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quotation Requested!</h3>
              <p className="text-gray-600 mb-6">
                Thank you, <span className="font-bold text-gray-800">{formData.name}</span>. Our team will contact you shortly with your personalized quotation and your ₹1000 OFF Coupon.
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
