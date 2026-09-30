import React from 'react';
import { useForm } from 'react-hook-form';
import SEOHead from '../../components/ui/SEOHead';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/contact', data);
      toast.success("Message sent successfully. We'll get back to you soon!");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg min-h-screen pb-20">
      <SEOHead 
        title="Contact Us | SPC Solar" 
        description="Get in touch with SPC Solar for residential, commercial, or industrial solar panel installations."
      />

      <section className="bg-black py-20 text-center border-b-4 border-red text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading mb-4">CONTACT US</h1>
          <p className="text-xl text-gray-light font-body">
            We're here to answer all your questions about transitioning to solar.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <h2 className="text-3xl font-heading mb-8">Get In Touch</h2>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-red text-white p-3 rounded-full mr-4">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h4 className="font-heading text-lg">Office Address</h4>
                  <p className="text-gray text-sm">123 Solar Street, Green City, India 400001</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red text-white p-3 rounded-full mr-4">
                  <FiPhone size={24} />
                </div>
                <div>
                  <h4 className="font-heading text-lg">Phone Number</h4>
                  <p className="text-gray text-sm">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red text-white p-3 rounded-full mr-4">
                  <FiMail size={24} />
                </div>
                <div>
                  <h4 className="font-heading text-lg">Email Address</h4>
                  <p className="text-gray text-sm">info@spcsolar.com</p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface p-6 rounded-card border border-gray-light">
              <h4 className="font-heading text-lg mb-2 text-black">Business Hours</h4>
              <p className="text-gray text-sm">Monday - Saturday: 9:00 AM to 6:00 PM</p>
              <p className="text-gray text-sm">Sunday: Closed</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-card shadow-card border border-gray-light border-t-4 border-t-red">
            <h2 className="text-2xl font-heading mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input 
                label="Full Name" 
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
                error={errors.name}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Phone Number" 
                  placeholder="+91 9876543210"
                  {...register('phone', { required: 'Phone is required' })}
                  error={errors.phone}
                />
                <Input 
                  label="Email Address" 
                  type="email"
                  placeholder="john@example.com"
                  {...register('email', { required: 'Email is required' })}
                  error={errors.email}
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label className="mb-1 font-accent font-semibold text-black">Service Interested In</label>
                <select 
                  className="px-4 py-2 border border-gray-light focus:border-black outline-none rounded-btn"
                  {...register('service')}
                >
                  <option value="Residential Solar">Residential Solar</option>
                  <option value="Commercial Solar">Commercial Solar</option>
                  <option value="Industrial Solar">Industrial Solar</option>
                  <option value="AMC">AMC & Maintenance</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>
              <div className="flex flex-col w-full mb-6">
                <label className="mb-1 font-accent font-semibold text-black">Message</label>
                <textarea 
                  className="px-4 py-2 border border-gray-light focus:border-black outline-none rounded-btn h-32 resize-none"
                  placeholder="How can we help you?"
                  {...register('message', { required: 'Message is required' })}
                ></textarea>
                {errors.message && <span className="text-red text-sm mt-1">{errors.message.message}</span>}
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;
