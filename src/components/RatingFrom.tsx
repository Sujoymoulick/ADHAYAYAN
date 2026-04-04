import { useState } from 'react';
import { Star, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import { useStore } from '../store/useStore';

export default function RatingForm({ quizId, onClear }: { quizId: string, onClear: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { submitQuizRating, currentUser } = useStore();

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a rating!");
    
    submitQuizRating(quizId, rating, comment, currentUser?.name || 'Anonymous');
    setSubmitted(true);

    setTimeout(onClear, 2000); // Close after 2 seconds
  };


  return (
    <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm">
      {!submitted ? (
        <>
          <h3 className="text-xl font-bold text-white mb-2">Rate this Quiz</h3>
          <p className="text-slate-400 text-sm mb-4">How was your experience?</p>
          
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110"
              >
                <Star 
                  className={cn(
                    "w-8 h-8 transition-colors",
                    (hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                  )} 
                />
              </button>
            ))}
          </div>

          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a quick feedback..."
            className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white text-sm mb-4 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
            rows={3}
          />

          <button 
            onClick={handleSubmit}
            className="w-full py-3 bg-brand-blue text-brand-navy font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-blue/90 transition-all"
          >
            Submit Review <Send className="w-4 h-4" />
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6" /> {/* Used a checkmark icon here */}
          </div>
          <p className="text-white font-bold">Thank you for your feedback!</p>
        </div>
      )}
    </div>
  );
}