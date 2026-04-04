import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useStore } from '../store/useStore';
import { Trophy, Clock, RotateCcw, Compass, CheckCircle2, XCircle, Star } from 'lucide-react';
import { cn } from '../utils/cn';
import RatingModal from '../components/RatingModal';

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { quizzes, submitQuizRating, currentUser } = useStore();
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  const quiz = quizzes.find(q => q.id === id || q._id === id);
  const state = location.state as { score: number; totalPoints: number; timeTaken: number; answers: Record<string, string> };

  useEffect(() => {
    if (!quiz || !state) {
      navigate('/explore');
      return;
    }

    const percentage = (state.score / state.totalPoints) * 100;
    if (percentage >= 70) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00f0ff', '#ff4e00']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00f0ff', '#ff4e00']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [quiz, state, navigate]);

  if (!quiz || !state) return null;

  const percentage = Math.round((state.score / state.totalPoints) * 100);
  let grade = 'F';
  let gradeColor = 'text-red-400';
  if (percentage >= 90) { grade = 'A+'; gradeColor = 'text-emerald-400'; }
  else if (percentage >= 80) { grade = 'A'; gradeColor = 'text-emerald-400'; }
  else if (percentage >= 70) { grade = 'B'; gradeColor = 'text-blue-400'; }
  else if (percentage >= 60) { grade = 'C'; gradeColor = 'text-amber-400'; }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/50 rounded-3xl border border-white/10 p-8 text-center mb-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/10 to-transparent pointer-events-none" />

        <h1 className="text-3xl font-display font-bold text-white mb-2 relative z-10">Quiz Completed!</h1>
        <p className="text-slate-400 mb-8 relative z-10">{quiz.title}</p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 relative z-10">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-800"
              />
              <motion.circle
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                className={cn(
                  percentage >= 70 ? "text-brand-blue" : "text-brand-coral"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-bold text-white">{percentage}%</span>
              <span className="text-sm text-slate-400">{state.score} / {state.totalPoints} pts</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-white/5">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-2xl bg-white/5", gradeColor)}>
                {grade}
              </div>
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Final Grade</p>
                <p className="text-lg font-bold text-white">
                  {percentage >= 70 ? 'Passed' : 'Needs Improvement'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-white/5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 text-brand-blue">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Time Taken</p>
                <p className="text-lg font-bold text-white">
                  {Math.floor(state.timeTaken / 60)}m {state.timeTaken % 60}s
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link
            to={`/quiz/${quiz._id || quiz.id}`}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Retry Quiz
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-brand-blue text-brand-navy hover:bg-brand-blue/90 transition-colors flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5" /> Back to Explore
          </Link>
        </div>

        <div className="mt-6 flex justify-center relative z-10">
          <button
            onClick={() => setIsRatingOpen(true)}
            className="w-full sm:w-auto px-6 py-2 rounded-xl font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-white/5 shadow-lg"
          >
            <Star className="w-4 h-4" /> Rate this Quiz
          </button>
        </div>
      </motion.div>

      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        quizTitle={quiz.title}
        onSubmit={(rating, feedback) => {
          submitQuizRating(quiz._id || quiz.id, rating, feedback || '', currentUser?.name || 'Guest');
        }}
      />

      {/* Detailed Review */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-brand-coral" /> Detailed Review
        </h2>

        {quiz.questions.map((q, i) => {
          const userAnswer = state.answers[q.id] || '';
          const isCorrect = q.type === 'short-answer'
            ? userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
            : userAnswer === q.correctAnswer;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-6 rounded-2xl border bg-slate-900/50",
                isCorrect ? "border-emerald-500/30" : "border-red-500/30"
              )}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="mt-1 shrink-0">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-2">
                    <span className="text-slate-400 mr-2">{i + 1}.</span>
                    {q.text}
                  </h3>

                  {q.image && (
                    <div className="my-4 rounded-xl overflow-hidden border border-white/10 max-w-md">
                      <img src={q.image} alt="Question" className="w-full h-auto" />
                    </div>
                  )}

                  {q.type === 'short-answer' ? (
                    <div className="space-y-3 mt-4">
                      <div className="p-4 rounded-xl border border-white/10 bg-slate-800/50">
                        <p className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-1">Your Answer</p>
                        <p className={cn("text-lg font-medium", isCorrect ? "text-emerald-400" : "text-red-400")}>
                          {userAnswer || <span className="italic text-slate-500">No answer provided</span>}
                        </p>
                      </div>
                      {!isCorrect && (
                        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                          <p className="text-sm text-emerald-500/70 uppercase tracking-wider font-medium mb-1">Correct Answer</p>
                          <p className="text-lg font-medium text-emerald-400">{q.correctAnswer}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 mt-4">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswer === opt;
                        const isActualCorrect = q.correctAnswer === opt;

                        let optClass = "border-white/5 bg-slate-800/50 text-slate-400";
                        if (isActualCorrect) {
                          optClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-medium";
                        } else if (isSelected && !isCorrect) {
                          optClass = "border-red-500/50 bg-red-500/10 text-red-400 font-medium";
                        }

                        return (
                          <div key={optIdx} className={cn("p-3 rounded-lg border", optClass)}>
                            {opt}
                            {isActualCorrect && <span className="ml-2 text-xs uppercase tracking-wider bg-emerald-500/20 px-2 py-1 rounded-md">Correct Answer</span>}
                            {isSelected && !isCorrect && <span className="ml-2 text-xs uppercase tracking-wider bg-red-500/20 px-2 py-1 rounded-md">Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="mt-4 p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/20 text-sm text-slate-300">
                      <span className="font-bold text-brand-blue block mb-1">Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <footer className="mt-20 pb-10 text-center text-slate-500 text-sm">
        <p>Powered by <span className="font-display font-bold text-brand-blue">ADHYAYAN</span></p>
      </footer>
    </div>
  );
}
