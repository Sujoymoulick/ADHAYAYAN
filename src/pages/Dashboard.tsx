import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Trophy, Star, Clock, BrainCircuit, Play, 
  PlusCircle, Compass, LayoutDashboard, History,
  TrendingUp, Zap, Target
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function Dashboard() {
  const { currentUser, quizzes, scores } = useStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  if (!currentUser) return null;

  const myScores = scores.filter(s => s.userId === currentUser.id);
  const totalPoints = myScores.reduce((acc, s) => acc + s.score, 0);
  const quizzesCompleted = myScores.length;
  const avgAccuracy = quizzesCompleted > 0 
    ? Math.round((totalPoints / myScores.reduce((acc, s) => acc + s.totalPoints, 0)) * 100) 
    : 0;

  const recentAttempts = [...myScores]
    .sort((a, b) => b.answeredAt - a.answeredAt)
    .slice(0, 4);

  const recommendedQuizzes = quizzes
    .filter(q => !myScores.some(s => s.quizId === q.id || s.quizId === q._id))
    .slice(0, 3);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <header className="mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-start md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
              {greeting}, <span className="text-brand-blue">{currentUser.name}</span>!
            </h1>
            <p className="text-slate-400">Ready to continue your learning quest today?</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/create"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-blue text-brand-navy font-bold hover:bg-brand-blue/90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" /> Create Quiz
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={<Trophy className="w-6 h-6" />} 
          label="Total Score" 
          value={totalPoints} 
          subValue="Keep it up!"
          color="blue"
        />
        <StatCard 
          icon={<Zap className="w-6 h-6" />} 
          label="Quizzes Done" 
          value={quizzesCompleted} 
          subValue="Quests completed"
          color="coral"
        />
        <StatCard 
          icon={<Target className="w-6 h-6" />} 
          label="Avg. Accuracy" 
          value={`${avgAccuracy}%`} 
          subValue="Skill level"
          color="emerald"
        />
        <StatCard 
          icon={<Star className="w-6 h-6" />} 
          label="Rank" 
          value="Learner" 
          subValue="Next: Scholar"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
              <History className="w-6 h-6 text-brand-blue" /> Recent Activity
            </h2>
            <div className="space-y-4">
              {recentAttempts.length > 0 ? (
                recentAttempts.map((score, i) => {
                  const quiz = quizzes.find(q => q.id === score.quizId || q._id === score.quizId);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={score.id}
                      className="bg-slate-900/50 rounded-2xl border border-white/10 p-5 flex items-center justify-between group hover:border-brand-blue/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                          <BrainCircuit className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold mb-0.5">{quiz?.title || 'Unknown Quiz'}</h3>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                            {new Date(score.answeredAt).toLocaleDateString()} • {score.score}/{score.totalPoints} Points
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/results/${score.id}`}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-brand-blue group-hover:bg-brand-blue/10 transition-all"
                      >
                        <TrendingUp className="w-5 h-5" />
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <div className="bg-slate-900/30 rounded-3xl border border-white/5 p-12 text-center">
                  <p className="text-slate-500 mb-6">You haven't attempted any quizzes yet. Your journey starts here!</p>
                  <Link to="/explore" className="text-brand-blue font-bold px-6 py-3 rounded-xl bg-brand-blue/10 hover:bg-brand-blue/20 transition-all inline-block border border-brand-blue/30">
                    Take your first quiz
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions / Goals */}
          <div className="bg-linear-to-r from-brand-blue/20 to-brand-coral/20 rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-display font-bold text-white mb-2">The Lakshya Tracker</h2>
            <p className="text-slate-300 mb-6">Your personal roadmap to 100% mastery. Set your goals and conquer them!</p>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm font-bold flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-coral" /> Daily Goal: 3 Quizzes
              </div>
              <div className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-blue" /> Weekly Streak: 5 Days
              </div>
            </div>
          </div>
        </div>

        {/* Recommended for You */}
        <aside>
          <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
            <Compass className="w-6 h-6 text-brand-coral" /> Recommended
          </h2>
          <div className="space-y-4">
            {recommendedQuizzes.map((quiz, i) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={quiz.id}
                className="group relative bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden hover:border-brand-coral/50 transition-colors"
              >
                <div className="aspect-video w-full overflow-hidden bg-slate-800">
                  {quiz.coverImage ? (
                    <img src={quiz.coverImage} alt={quiz.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><BrainCircuit className="w-8 h-8 text-slate-700" /></div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold truncate mb-1">{quiz.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500">{quiz.category}</span>
                    <Link to={`/quiz-details/${quiz._id || quiz.id}`} className="text-brand-coral text-xs font-bold flex items-center gap-1 hover:underline">
                      Quest &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            <Link 
              to="/explore"
              className="w-full flex items-center justify-center py-4 rounded-2xl border border-white/10 bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all text-sm group"
            >
              See all quizzes <Compass className="ml-2 w-4 h-4 group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, color }: { icon: React.ReactNode, label: string, value: string | number, subValue: string, color: 'blue' | 'coral' | 'emerald' | 'amber' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 rounded-2xl border border-white/10 p-4 sm:p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-white/20 transition-all"
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
        color === 'blue' ? "bg-blue-500/10 text-blue-400" :
          color === 'coral' ? "bg-brand-coral/10 text-brand-coral" :
            color === 'emerald' ? "bg-emerald-500/10 text-emerald-400" :
              "bg-amber-500/10 text-amber-400"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">{label}</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-2xl sm:text-3xl font-display font-bold text-white">{value}</p>
          <span className="text-[10px] text-slate-500 italic truncate">{subValue}</span>
        </div>
      </div>
      {/* Decorative backdrop */}
      <div className={cn(
        "absolute -bottom-2 -right-2 w-16 h-16 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity",
        color === 'blue' ? "bg-blue-500" :
          color === 'coral' ? "bg-brand-coral" :
            color === 'emerald' ? "bg-emerald-500" :
              "bg-amber-500"
      )} />
    </motion.div>
  );
}
