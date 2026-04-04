import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Clock, X, AlertCircle, ChevronRight, Check } from 'lucide-react';
import { cn } from '../utils/cn';

export default function QuizAttempt() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quizzes, currentUser, addScore, incrementQuizAttempts } = useStore();

  const quiz = quizzes.find(q => q.id === id || q._id === id);

  const getQuestionTimeLimit = (qIndex: number) => {
    const q = quiz?.questions[qIndex];
    if (q?.timeLimit != null) return q.timeLimit;
    return quiz?.timeLimit ?? null;
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(() => {
    if (!quiz) return null;
    const q = quiz.questions[0];
    return q?.timeLimit != null ? q.timeLimit : (quiz.timeLimit ?? null);
  });
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!quiz) {
      navigate('/explore');
      return;
    }
  }, [quiz, navigate]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNext();
    }
  }, [timeLeft]);

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex) / quiz.questions.length) * 100;

  const handleSelectOption = (option: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleSubmit = () => {
    let score = 0;
    let totalPoints = 0;

    quiz.questions.forEach(q => {
      totalPoints += q.points;
      if (q.type === 'short-answer') {
        if (answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
          score += q.points;
        }
      } else {
        if (answers[q.id] === q.correctAnswer) {
          score += q.points;
        }
      }
    });

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    if (currentUser) {
      addScore({
        userId: currentUser.id,
        quizId: quiz._id || quiz.id,
        score,
        totalPoints,
        timeTaken,
        answers
      });
      incrementQuizAttempts(quiz._id || quiz.id);
    }

    navigate(`/results/${quiz._id || quiz.id}`, { state: { score, totalPoints, timeTaken, answers } });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeLeft(getQuestionTimeLimit(nextIndex));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-navy flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 bg-slate-900/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-lg text-white truncate max-w-50 sm:max-w-md">
            {quiz.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-slate-400">
            {currentQuestionIndex + 1} / {quiz.questions.length}
          </div>
          {timeLeft !== null && (
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-colors",
              timeLeft <= 5 ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-brand-blue/10 text-brand-blue"
            )}>
              <Clock className="w-4 h-4" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-800 w-full shrink-0">
        <motion.div
          className="h-full bg-linear-to-r from-brand-blue to-brand-coral"
          initial={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
          animate={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-3xl flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-6">
                {/* Circular Timer */}
                {timeLeft !== null && (
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                        <circle
                          cx="40" cy="40" r="34"
                          fill="none"
                          stroke={timeLeft <= 5 ? '#ef4444' : '#00f0ff'}
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 34}`}
                          strokeDashoffset={`${2 * Math.PI * 34 * (1 - timeLeft / (getQuestionTimeLimit(currentQuestionIndex) || 1))}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className={cn(
                        "absolute inset-0 flex items-center justify-center font-display font-bold text-xl",
                        timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'
                      )}>
                        {timeLeft}
                      </div>
                    </div>
                  </div>
                )}
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-6">
                  {currentQuestion.text}
                </h2>

                {currentQuestion.image && (
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900 mb-8 max-h-[40vh] flex items-center justify-center">
                    <img
                      src={currentQuestion.image}
                      alt="Question"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 mt-auto">
                {currentQuestion.type === 'short-answer' ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleSelectOption(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full bg-slate-800 border-2 border-white/10 rounded-xl px-6 py-4 text-xl text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue focus:outline-none transition-all"
                    />
                  </div>
                ) : (
                  currentQuestion.options.map((option, index) => {
                    const isSelected = answers[currentQuestion.id] === option;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectOption(option)}
                        className={cn(
                          "w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all flex items-center justify-between group",
                          isSelected
                            ? "border-brand-blue bg-brand-blue/10 text-white"
                            : "border-white/10 bg-slate-900/50 text-slate-300 hover:border-white/30 hover:bg-slate-800"
                        )}
                      >
                        <span className="text-lg font-medium">{option}</span>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                          isSelected ? "border-brand-blue bg-brand-blue" : "border-slate-600 group-hover:border-slate-400"
                        )}>
                          {isSelected && <Check className="w-4 h-4 text-brand-navy" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end shrink-0">
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] && timeLeft !== 0}
              className="px-8 py-4 rounded-xl bg-brand-blue text-brand-navy font-bold text-lg hover:bg-brand-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
              {!isLastQuestion && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </main>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowExitConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-4 text-amber-400">
                <AlertCircle className="w-8 h-8" />
                <h3 className="text-xl font-display font-bold text-white">Exit Quiz?</h3>
              </div>
              <p className="text-slate-400 mb-6">
                Are you sure you want to exit? Your progress will be lost and this attempt will not be recorded.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate('/explore')}
                  className="px-4 py-2 rounded-lg font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Yes, Exit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
