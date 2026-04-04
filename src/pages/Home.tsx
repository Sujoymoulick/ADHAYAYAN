import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { BrainCircuit, Compass, Trophy, PlusCircle, Star, Users, Play, Clock, BarChart, History } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Home() {
  const { quizzes, users, currentUser, scores } = useStore();

  const trendingQuizzes = [...quizzes]
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 3);

  const categories = [
    { name: 'Science', icon: BrainCircuit, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Math', icon: BarChart, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'History', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Tech', icon: Compass, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  const recommendedQuizzes = currentUser
    ? quizzes
      .filter(q => !scores.some(s => s.userId === currentUser.id && (s.quizId === q.id || s.quizId === q._id)))
      .sort((a, b) => {
        const aMatch = currentUser.interestedCategories?.some(c => c.toLowerCase() === a.category.toLowerCase()) ? 1 : 0;
        const bMatch = currentUser.interestedCategories?.some(c => c.toLowerCase() === b.category.toLowerCase()) ? 1 : 0;
        if (aMatch !== bMatch) {
          return bMatch - aMatch;
        }
        return b.attempts - a.attempts;
      })
      .slice(0, 3)
    : [];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(0,240,255,0.1) 0%, transparent 60%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
              Master Your Knowledge with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-blue to-brand-coral">
                ADHYAYAN
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300 mb-10">
              The ultimate platform to create, share, and conquer quizzes.
              Challenge yourself, climb the leaderboard, and embrace the joy of learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/explore"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold bg-brand-blue text-brand-navy hover:bg-brand-blue/90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5" /> Explore Quizzes
              </Link>
              <Link
                to={currentUser ? "/create" : "/login"}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Create a Quiz
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-brand-blue/20 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-brand-coral/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
      </section>

      {/* Stats Banner */}
      <section className="border-y border-white/10 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-4xl font-display font-bold text-brand-blue mb-2">{quizzes.length}</div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Total Quizzes</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-4xl font-display font-bold text-brand-coral mb-2">
                {users.filter(u => !u.id.startsWith('user-')).length}
              </div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Active Learners</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-4xl font-display font-bold text-emerald-400 mb-2">
                {quizzes.reduce((acc, q) => acc + q.questions.length, 0)}
              </div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Questions Asked</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-transparent border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/explore?category=${cat.name}`}
                className="group p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 flex flex-col items-center text-center gap-4"
              >
                <div className={cn("p-4 rounded-xl transition-colors", cat.bg, "group-hover:bg-white/10")}>
                  <cat.icon className={cn("w-8 h-8", cat.color)} />
                </div>
                <span className="font-display font-bold text-lg text-white">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Quizzes */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {currentUser && recommendedQuizzes.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                <History className="w-6 h-6 text-brand-blue" /> Recommended for You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedQuizzes.map((quiz, i) => (
                <Link
                  key={quiz.id}
                  to={`/quiz-details/${quiz._id || quiz.id}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-white/10 hover:border-brand-blue/50 transition-colors"
                >

                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    {quiz.coverImage ? (
                      <img src={quiz.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><BrainCircuit className="w-6 h-6 text-slate-500" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">{quiz.title}</h3>
                    <p className="text-sm text-slate-400 truncate">{quiz.category} • {quiz.difficulty}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-brand-navy transition-colors shrink-0">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                </Link>

              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-brand-coral" /> Trending Now
          </h2>
          <Link to="/explore" className="text-brand-blue hover:text-brand-blue/80 font-medium flex items-center gap-1">
            View all <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingQuizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden hover:border-brand-blue/50 transition-colors flex flex-col"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-800 relative">
                {quiz.coverImage ? (
                  <img
                    src={quiz.coverImage}
                    alt={quiz.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <BrainCircuit className="w-12 h-12 text-slate-600" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {quiz.rating.toFixed(1)}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                    quiz.difficulty === 'Easy' ? "bg-emerald-400/10 text-emerald-400" :
                      quiz.difficulty === 'Medium' ? "bg-amber-400/10 text-amber-400" :
                        "bg-red-400/10 text-red-400"
                  )}>
                    {quiz.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-md">
                    {quiz.category}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-2 line-clamp-1">{quiz.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{quiz.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Users className="w-4 h-4" />
                    {quiz.attempts} attempts
                  </div>
                  <Link
                    to={`/quiz-details/${quiz._id || quiz.id}`}
                    className="flex items-center gap-2 text-brand-blue font-medium hover:text-brand-blue/80 transition-colors"
                  >
                    Start <Play className="w-4 h-4" />
                  </Link>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-20 mb-8 flex flex-col items-center gap-4">
        <p className="text-slate-500 text-sm font-medium tracking-wide">
          Crafted  by <span className="text-white font-semibold">Sujoy</span> &amp; <span className="text-white font-semibold">Arnab</span>
        </p>
        <div className="flex items-center gap-3">
          {/* Sujoy */}
          <span className="text-xs text-slate-500 font-medium">Sujoy</span>
          <a
            href="https://www.linkedin.com/in/sujoy-moulick"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all text-xs font-semibold"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            LinkedIn
          </a>
          <a
            href="https://github.com/sujoymoulick"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-semibold"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
            GitHub
          </a>
          <span className="text-slate-600">|</span>
          {/* Arnab */}
          <span className="text-xs text-slate-500 font-medium">Arnab</span>
          <a
            href="https://www.linkedin.com/in/arnab"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all text-xs font-semibold"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            LinkedIn
          </a>
          <a
            href="https://github.com/arnab"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-semibold"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
