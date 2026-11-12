import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = '918098744044';
const DEFAULT_MESSAGE =
  'Hello SPC Solar! I would like to know more about rooftop solar installation.';

/**
 * Floating WhatsApp quick-chat button displayed on both mobile and desktop viewports.
 */
const WhatsAppFloatingButton = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="group relative w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white shadow-xl shadow-black/70 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95"
      title="Chat with us on WhatsApp"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
      <FaWhatsapp className="relative w-5 h-5 sm:w-6 sm:h-6" />
    </motion.a>
  );
};

export default WhatsAppFloatingButton;

