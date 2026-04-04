import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  Clock, 
  Trophy, 
  Users, 
  Star, 
  Play, 
  ArrowLeft, 
  Calendar,
  Layers,
  HelpCircle,
  BrainCircuit,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function QuizDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quizzes, users, currentUser } = useStore();

  const quiz = quizzes.find(q => q.id === id || q._id === id);
  const creator = users.find(u => u.id === quiz?.createdBy);

  if (!quiz) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Quiz not found</h2>
          <Link to="/explore" className="text-brand-blue hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const formattedDate = new Date(quiz.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Quiz Info */}
        <div className="lg:col-span-2 space-y-10">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden border border-white/10 aspect-video md:aspect-[21/9]"
          >
            {quiz.coverImage ? (
              <img 
                src={quiz.coverImage} 
                alt={quiz.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <BrainCircuit className="w-20 h-20 text-slate-800" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  quiz.difficulty === 'Easy' ? "bg-emerald-500/20 text-emerald-400" :
                  quiz.difficulty === 'Medium' ? "bg-amber-500/20 text-amber-400" :
                  "bg-red-500/20 text-red-400"
                )}>
                  {quiz.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-blue/20 text-brand-blue">
                  {quiz.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">{quiz.title}</h1>
            </div>
          </motion.div>

          {/* Description & metadata */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 rounded-3xl border border-white/10 p-8"
          >
            <h2 className="text-xl font-display font-bold text-white mb-4">About this Quiz</h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              {quiz.description || "No description provided for this quiz."}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Questions</p>
                <div className="flex items-center gap-2 text-white font-bold">
                  <HelpCircle className="w-4 h-4 text-brand-blue" />
                  {quiz.questions.length} Questions
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total Points</p>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Trophy className="w-4 h-4 text-brand-coral" />
                  {totalPoints} Pts
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Duration</p>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  {quiz.timeLimit ? `${Math.floor(quiz.timeLimit / 60)}m ${quiz.timeLimit % 60}s` : 'No Limit'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Published</p>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  {formattedDate}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Info / Rules */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-slate-900/50 rounded-3xl border border-white/10 p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">{quiz.attempts} Attempts</h3>
                <p className="text-xs text-slate-500">Join thousands of others in this challenge.</p>
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-3xl border border-white/10 p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">{quiz.rating.toFixed(1)} Rating</h3>
                <p className="text-xs text-slate-500">Based on feedback from regular players.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Sidebar / CTA */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-3xl border border-white/10 p-8 sticky top-24"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center">
                {creator?.avatar ? (
                  <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6 text-slate-600" />
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Created By</p>
                <h3 className="text-white font-bold">{creator?.name || 'Quiz Master'}</h3>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Score</span>
                <span className="text-white font-bold">{totalPoints} Points</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Time per Question</span>
                <span className="text-white font-bold">
                  {quiz.timeLimit ? `${Math.round(quiz.timeLimit / quiz.questions.length)}s` : 'Dynamic'}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link 
                to={`/quiz/${quiz._id || quiz.id}`}
                className="w-full py-4 rounded-2xl bg-brand-blue text-brand-navy font-bold text-center flex items-center justify-center gap-3 hover:bg-brand-blue/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-blue/20"
              >
                Start Quiz <Play className="w-5 h-5 fill-current" />
              </Link>
              <button 
                onClick={() => navigate('/explore')}
                className="w-full py-4 rounded-2xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all"
              >
                Back to Explore
              </button>
            </div>

            <p className="mt-6 text-[10px] text-slate-500 text-center uppercase tracking-widest leading-relaxed">
              By starting this quiz, your performance will be recorded on the global leaderboard. Good Luck!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
