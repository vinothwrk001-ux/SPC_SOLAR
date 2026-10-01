import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiMessageSquare, FiUser } from 'react-icons/fi';
import { addReelComment } from '../../services/reelService';

const ReelCommentDrawer = ({ isOpen, onClose, reelId, comments = [], onCommentAdded }) => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    try {
      setSubmitting(true);
      const res = await addReelComment(reelId, {
        name: name.trim() || 'Solar Client',
        text: text.trim()
      });
      setText('');
      if (onCommentAdded && res.comments) {
        onCommentAdded(res.comments);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Slide-Up Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] text-white rounded-t-3xl border-t border-white/10 max-w-md mx-auto h-[70vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-heading text-lg">
                <FiMessageSquare className="text-red" />
                <span>Comments ({comments.length})</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-white/50 space-y-2">
                  <FiMessageSquare size={40} className="stroke-1 text-white/30" />
                  <p className="font-accent text-sm">No comments yet. Be the first to share your thoughts on Solar!</p>
                </div>
              ) : (
                comments.map((item, idx) => (
                  <div key={item._id || idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-red/20 border border-red/40 flex items-center justify-center text-red font-bold text-xs flex-shrink-0">
                      {(item.name || 'S')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-accent font-semibold text-xs text-white/90 truncate">{item.name || 'Solar Client'}</h4>
                        <span className="text-[10px] text-white/40">{formatDate(item.createdAt)}</span>
                      </div>
                      <p className="text-xs text-white/80 font-body mt-1 leading-relaxed break-words">{item.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-[#181818]">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs" />
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 text-xs text-white placeholder-white/40 pl-8 pr-3 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-red transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 bg-white/5 text-xs text-white placeholder-white/40 px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-red transition-colors"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || submitting}
                  className="bg-red hover:bg-red-hover disabled:opacity-50 text-white p-2.5 rounded-xl transition-all font-semibold flex items-center justify-center flex-shrink-0"
                >
                  <FiSend size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReelCommentDrawer;
