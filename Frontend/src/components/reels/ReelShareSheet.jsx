import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy, FiCheck, FiShare2, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaTwitter, FaFacebook } from 'react-icons/fa';

const ReelShareSheet = ({ isOpen, onClose, reel }) => {
  const [copied, setCopied] = useState(false);

  if (!reel) return null;

  const shareUrl = `${window.location.origin}/reels?id=${reel._id}`;
  const shareTitle = `Watch "${reel.title}" on SPC Solar!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${shareTitle}\n\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`${shareTitle}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.title,
          text: reel.description || shareTitle,
          url: shareUrl
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#141414] text-white p-6 rounded-3xl border border-white/10 w-[90%] max-w-sm shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-heading text-lg">
                <FiShare2 className="text-red" />
                <span>Share Reel</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Reel summary snippet */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
              <div className="w-12 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0 relative">
                {reel.thumbnailUrl ? (
                  <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-red/20 flex items-center justify-center text-red text-xs">⚡</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-accent font-semibold text-xs text-white truncate">{reel.title}</h4>
                <p className="text-[11px] text-red font-accent font-medium mt-0.5">{reel.systemCapacity}</p>
                <p className="text-[10px] text-white/50 truncate mt-0.5">{reel.location}</p>
              </div>
            </div>

            {/* Share Grid Icons */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <button
                onClick={handleWhatsApp}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
              >
                <FaWhatsapp size={22} />
                <span className="text-[10px] font-accent font-semibold">WhatsApp</span>
              </button>
              <button
                onClick={handleTwitter}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors"
              >
                <FaTwitter size={22} />
                <span className="text-[10px] font-accent font-semibold">Twitter</span>
              </button>
              <button
                onClick={handleFacebook}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors"
              >
                <FaFacebook size={22} />
                <span className="text-[10px] font-accent font-semibold">Facebook</span>
              </button>
              {navigator.share ? (
                <button
                  onClick={handleNativeShare}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-red/10 hover:bg-red/20 text-red border border-red/20 transition-colors"
                >
                  <FiSend size={22} />
                  <span className="text-[10px] font-accent font-semibold">More</span>
                </button>
              ) : (
                <button
                  onClick={handleCopyLink}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
                >
                  {copied ? <FiCheck size={22} className="text-emerald-400" /> : <FiCopy size={22} />}
                  <span className="text-[10px] font-accent font-semibold">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>

            {/* Direct Copy Input */}
            <div className="flex items-center gap-2 bg-white/5 p-1.5 pl-3 rounded-xl border border-white/10">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-white/60 w-full focus:outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="bg-red hover:bg-red-hover text-white text-xs px-3 py-1.5 rounded-lg font-accent font-semibold transition-colors flex items-center gap-1 flex-shrink-0"
              >
                {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReelShareSheet;
