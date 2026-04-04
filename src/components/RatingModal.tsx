import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
  onSubmit: (rating: number, feedback: string) => void;
}

export default function RatingModal({ isOpen, onClose, quizTitle, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, feedback);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setFeedback('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={cn(
              "relative bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden",
              "w-full max-w-lg", // Increased max-width for desktop
              "mx-auto my-auto"
            )}
          >
            <div className="p-6 sm:p-10"> {/* Adaptive padding: smaller on mobile, larger on desktop */}
              {!isSubmitted ? (
                <>
                  <div className="flex justify-between items-start mb-8">
                    <div className="pr-8">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white font-display leading-tight">
                        Rate Quiz
                      </h2>
                      <p className="text-slate-400 text-sm sm:text-base mt-2 line-clamp-2">
                        {quizTitle}
                      </p>
                    </div>
                    <button 
                      onClick={onClose} 
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Star Rating Section */}
                  <div className="flex justify-center gap-3 sm:gap-4 mb-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-90"
                      >
                        <Star 
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200", // Larger stars on desktop
                            (hover || rating) >= star 
                              ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" 
                              : "text-slate-700"
                          )} 
                        />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">
                        Your Feedback
                      </label>
                      <textarea 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="What did you think of the questions?"
                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all resize-none text-sm sm:text-base placeholder:text-slate-600"
                        rows={4}
                      />
                    </div>

                    <button 
                      onClick={handleSubmit}
                      disabled={rating === 0}
                      className={cn(
                        "w-full py-4 sm:py-5 rounded-2xl font-bold text-brand-navy transition-all flex items-center justify-center gap-3 shadow-xl",
                        rating > 0 
                          ? "bg-brand-blue hover:bg-brand-blue/90 hover:scale-[1.02] active:scale-[0.98]" 
                          : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                      )}
                    >
                      Submit Review 
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">Thank You!</h2>
                  <p className="text-slate-400 text-lg">Your feedback has been submitted successfully.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}