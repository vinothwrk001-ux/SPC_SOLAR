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
  { icon: FiMapPin, label: 'Office Address', value: 'No-115-117, Easwari Towers, Devanga High School Road, RS Puram, Coimbatore - 641002.' },
  { icon: FiPhone, label: 'Phone Number 1', value: '+91 84896 44044', href: 'tel:+918489644044' },
  { icon: FiPhone, label: 'Phone Number 2', value: '+91 84897 44044', href: 'tel:+918489744044' },
  { icon: FiPhone, label: 'Office Number', value: '+91 80987 44044', href: 'tel:+918098744044' },
  { icon: FiMail, label: 'Email Address', value: 'spctechnologycoimbatore@gmail.com', href: 'mailto:spctechnologycoimbatore@gmail.com' },
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

      <section className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left — Contact Info */}
            <Reveal variant="slideLeft">
              <div>
                <span className="section-label">Reach Us</span>
                <h2 className="section-title mb-2 sm:mb-4">Talk to Our<br /><span className="text-red">Solar Experts</span></h2>
                <span className="red-line" />

                {/* Desktop View: Exact original vertical list */}
                <div className="hidden lg:block">
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

                {/* Mobile View: 2 in a Row Cards */}
                <div className="lg:hidden grid grid-cols-2 gap-2.5 sm:gap-3 mb-6 sm:mb-8 items-stretch">
                  {/* Card 1: Office Address */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-3.5 flex flex-col justify-start">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-light flex items-center justify-center text-red mb-2 shrink-0">
                      <FiMapPin size={15} />
                    </div>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-black mb-1">Office Address</h4>
                    <p className="text-gray-600 font-body text-[10.5px] sm:text-xs leading-snug">
                      No-115-117, Easwari Towers, Devanga High School Rd, RS Puram, Coimbatore - 641002.
                    </p>
                  </div>

                  {/* Card 2: Business Hours */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-3.5 flex flex-col justify-start">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-light flex items-center justify-center text-red mb-2 shrink-0">
                      <FiClock size={15} />
                    </div>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-black mb-1">Business Hours</h4>
                    <p className="text-gray-600 font-body text-[10.5px] sm:text-xs leading-snug">
                      Mon – Sat: 9AM – 6PM<br />
                      <span className="text-red font-semibold">Sunday: Closed</span>
                    </p>
                  </div>

                  {/* Card 3: Phone Number 1 */}
                  <a
                    href="tel:+918489644044"
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-3.5 flex flex-col justify-start hover:border-red transition-all active:scale-[0.99]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-light flex items-center justify-center text-red mb-2 shrink-0">
                      <FiPhone size={15} />
                    </div>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-black mb-1">Phone Number 1</h4>
                    <p className="text-gray-800 font-body font-semibold text-[11px] sm:text-xs leading-tight">
                      +91 84896 44044
                    </p>
                  </a>

                  {/* Card 4: Phone Number 2 */}
                  <a
                    href="tel:+918489744044"
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-3.5 flex flex-col justify-start hover:border-red transition-all active:scale-[0.99]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-light flex items-center justify-center text-red mb-2 shrink-0">
                      <FiPhone size={15} />
                    </div>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-black mb-1">Phone Number 2</h4>
                    <p className="text-gray-800 font-body font-semibold text-[11px] sm:text-xs leading-tight">
                      +91 84897 44044
                    </p>
                  </a>

                  {/* Card 5: Office Number */}
                  <a
                    href="tel:+918098744044"
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-3.5 flex flex-col justify-start hover:border-red transition-all active:scale-[0.99]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-light flex items-center justify-center text-red mb-2 shrink-0">
                      <FiPhone size={15} />
                    </div>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-black mb-1">Office Number</h4>
                    <p className="text-gray-800 font-body font-semibold text-[11px] sm:text-xs leading-tight">
                      +91 80987 44044
                    </p>
                  </a>

                  {/* Card 6: Email Address */}
                  <a
                    href="mailto:spctechnologycoimbatore@gmail.com"
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-3.5 flex flex-col justify-start hover:border-red transition-all active:scale-[0.99]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-light flex items-center justify-center text-red mb-2 shrink-0">
                      <FiMail size={15} />
                    </div>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-black mb-1">Email Address</h4>
                    <p className="text-gray-800 font-body text-[10px] sm:text-[11px] leading-tight break-all">
                      spctechnologycoimbatore@gmail.com
                    </p>
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Right — Form */}
            <Reveal variant="slideRight" delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-card shadow-card-md overflow-hidden">
                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-red to-red-dark" />
                <div className="p-3.5 sm:p-6 md:p-8">
                  <h2 className="font-heading text-base sm:text-xl md:text-2xl mb-2.5 md:mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
                    <Input
                      label="Full Name"
                      placeholder="Rahul Sharma"
                      className="!mb-2 md:!mb-4"
                      labelClassName="!mb-1 md:!mb-1.5 !text-[11px] md:!text-xs"
                      inputClassName="!px-3 !py-2 md:!px-4 md:!py-3 !text-xs md:!text-sm"
                      {...register('name', { required: 'Name is required' })}
                      error={errors.name}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <Input
                        label="Phone Number"
                        placeholder="+91 9876543210"
                        className="!mb-2 md:!mb-4"
                        labelClassName="!mb-1 md:!mb-1.5 !text-[11px] md:!text-xs"
                        inputClassName="!px-3 !py-2 md:!px-4 md:!py-3 !text-xs md:!text-sm"
                        {...register('phone', { required: 'Phone is required' })}
                        error={errors.phone}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="rahul@example.com"
                        className="!mb-2 md:!mb-4"
                        labelClassName="!mb-1 md:!mb-1.5 !text-[11px] md:!text-xs"
                        inputClassName="!px-3 !py-2 md:!px-4 md:!py-3 !text-xs md:!text-sm"
                        {...register('email', { required: 'Email is required' })}
                        error={errors.email}
                      />
                    </div>

                    <div className="flex flex-col w-full mb-2 md:mb-4">
                      <label className="mb-1 md:mb-1.5 font-accent font-semibold text-[11px] md:text-xs uppercase tracking-wider text-gray-700">
                        Service Interested In
                      </label>
                      <select
                        className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-body border border-gray-light hover:border-gray-400 focus:border-black outline-none rounded-btn transition-colors duration-250"
                        {...register('service')}
                      >
                        <option value="Residential Solar">Residential Solar</option>
                        <option value="Commercial Solar">Commercial Solar</option>
                        <option value="Industrial Solar">Industrial Solar</option>
                        <option value="AMC">AMC & Maintenance</option>
                        <option value="Other">Other Query</option>
                      </select>
                    </div>

                    <div className="flex flex-col w-full mb-2.5 md:mb-6">
                      <label className="mb-1 md:mb-1.5 font-accent font-semibold text-[11px] md:text-xs uppercase tracking-wider text-gray-700">
                        Message
                      </label>
                      <textarea
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-light hover:border-gray-400 focus:border-black outline-none rounded-btn h-20 sm:h-24 md:h-32 resize-none text-xs md:text-sm font-body transition-colors duration-250"
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
                      className="w-full !py-2.5 sm:!py-3 md:!py-4 !text-xs sm:!text-sm md:!text-base !tracking-wider"
                      disabled={isLoading}
                      icon={<FiSend className="w-3.5 h-3.5 md:w-4 md:h-4" />}
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
