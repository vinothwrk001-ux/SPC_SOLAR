import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, size = 'md', children }) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}
          >
            <div className={`bg-white rounded-card shadow-card-lg w-full ${sizes[size]} pointer-events-auto overflow-hidden relative`}>
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red to-transparent" />

              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h3 className="font-heading text-xl text-black">{title}</h3>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="w-8 h-8 flex items-center justify-center rounded-sm text-gray-400 hover:text-red hover:bg-red-light transition-all duration-200"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
