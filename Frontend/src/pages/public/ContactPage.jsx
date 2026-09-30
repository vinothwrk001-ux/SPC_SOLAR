import React from 'react';
import { useForm } from 'react-hook-form';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Reveal } from '../../components/motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CONTACT_INFO = [
  { icon: FiMapPin, label: 'Office Address', value: '123 Solar Street, Green City, India 400001' },
  { icon: FiPhone, label: 'Phone Number', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: FiMail, label: 'Email Address', value: 'info@spcsolar.com', href: 'mailto:info@spcsolar.com' },
];

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/contact', data);
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <SEOHead
        title="Contact Us | SPC Solar"
        description="Get in touch with SPC Solar for residential, commercial, or industrial solar panel installations."
      />

      <PageHero
        label="Get In Touch"
        title="CONTACT "
        highlight="US"
        subtitle="We're here to answer all your questions about transitioning to solar energy."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left — Contact Info */}
            <Reveal variant="slideLeft">
              <div>
                <span className="section-label">Reach Us</span>
                <h2 className="section-title mb-4">Talk to Our<br /><span className="text-red">Solar Experts</span></h2>
                <span className="red-line" />

                <div className="space-y-6 mb-8">
                  {CONTACT_INFO.map((info) => {
                    const Icon = info.icon;
                    const content = (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-sm bg-red-light flex items-center justify-center text-red flex-shrink-0">
                          <Icon size={20} />
                        </div>
                        <div>
                          <h4 className="font-heading text-base text-black mb-0.5">{info.label}</h4>
                          <p className="text-gray-500 font-body text-sm">{info.value}</p>
                        </div>
                      </div>
                    );
                    return info.href ? (
                      <a key={info.label} href={info.href} className="block hover:opacity-80 transition-opacity">
                        {content}
                      </a>
                    ) : (
                      <div key={info.label}>{content}</div>
                    );
                  })}
                </div>

                {/* Hours */}
                <div className="bg-gray-50 border border-gray-200 rounded-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FiClock size={18} className="text-red" />
                    <h4 className="font-heading text-base text-black">Business Hours</h4>
                  </div>
                  <div className="space-y-1 text-gray-500 text-sm font-body pl-7">
                    <p>Monday – Saturday: 9:00 AM – 6:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right — Form */}
            <Reveal variant="slideRight" delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-card shadow-card-md overflow-hidden">
                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-red to-red-dark" />
                <div className="p-8">
                  <h2 className="font-heading text-2xl mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
                    <Input
                      label="Full Name"
                      placeholder="Rahul Sharma"
                      {...register('name', { required: 'Name is required' })}
                      error={errors.name}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <Input
                        label="Phone Number"
                        placeholder="+91 9876543210"
                        {...register('phone', { required: 'Phone is required' })}
                        error={errors.phone}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="rahul@example.com"
                        {...register('email', { required: 'Email is required' })}
                        error={errors.email}
                      />
                    </div>

                    <div className="flex flex-col w-full mb-4">
                      <label className="mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                        Service Interested In
                      </label>
                      <select
                        className="w-full px-4 py-3 text-sm font-body border border-gray-light hover:border-gray-400 focus:border-black outline-none rounded-btn transition-colors duration-250"
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
                      <label className="mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                        Message
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-light hover:border-gray-400 focus:border-black outline-none rounded-btn h-32 resize-none text-sm font-body transition-colors duration-250"
                        placeholder="How can we help you?"
                        {...register('message', { required: 'Message is required' })}
                      />
                      {errors.message && (
                        <span className="text-red text-xs mt-1 font-accent font-semibold">
                          {errors.message.message}
                        </span>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                      icon={<FiSend size={16} />}
                    >
                      {isLoading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
