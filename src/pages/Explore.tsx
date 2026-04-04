import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Search, Filter, Star, Users, Play, BrainCircuit, User as UserIcon, Plus } from 'lucide-react';
import { cn } from '../utils/cn';
import RatingModal from '../components/RatingModal';

export default function Explore() {
  const { quizzes, users, submitQuizRating, currentUser } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for Rating Modal
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

  const initialCategory = searchParams.get('category') || 'All';
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', 'Science', 'Math', 'History', 'Tech', 'Pop Culture', 'Custom'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredQuizzes = useMemo(() => {
    return quizzes
      .filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'All' || q.category === category;
        const matchesDifficulty = difficulty === 'All' || q.difficulty === difficulty;
        return matchesSearch && matchesCategory && matchesDifficulty;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        if (sortBy === 'popular') return b.attempts - a.attempts;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [quizzes, searchTerm, category, difficulty, sortBy]);

  const handleRatingSubmit = (rating: number, feedback: string) => {
    if (selectedQuiz) {
      submitQuizRating(selectedQuiz._id || selectedQuiz.id, rating, feedback || '', currentUser?.name || 'Guest');
    }
    console.log(`Quiz ID: ${selectedQuiz?._id || selectedQuiz?.id}, Rating: ${rating}, Feedback: ${feedback}`);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

      {/* Header Section with Create Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-display font-bold text-white mb-2">Explore Quizzes</h1>
          <p className="text-slate-400 text-lg">Discover new challenges or create your own to test the community.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/create"
            className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-brand-navy font-bold rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.2)] hover:shadow-[0_0_30px_rgba(0,210,255,0.4)] transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Create Quiz</span>
          </Link>
        </motion.div>
      </div>

      {/* Search and Quick Filters */}
      <div className="space-y-6 mb-12">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-blue text-slate-500">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 border border-white/10 rounded-2xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all backdrop-blur-sm"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setSearchParams(cat === 'All' ? {} : { category: cat });
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all border whitespace-nowrap",
                  category === cat
                    ? "bg-brand-blue text-brand-navy border-brand-blue shadow-[0_0_15px_rgba(0,210,255,0.3)] scale-105"
                    : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <div className="relative flex-1 lg:flex-none">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full lg:w-auto pl-4 pr-10 py-2.5 border border-white/10 rounded-xl bg-slate-900/50 text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none cursor-pointer"
              >
                <option value="All">All Levels</option>
                {difficulties.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative flex-1 lg:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full lg:w-auto pl-4 pr-10 py-2.5 border border-white/10 rounded-xl bg-slate-900/50 text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Attempted</option>
                <option value="rating">Top Rated</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                 <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredQuizzes.map((quiz, i) => {
            const creator = users.find(u => u.id === quiz.createdBy);
            return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: (i % 8) * 0.05,
                  duration: 0.4,
                  ease: "easeOut"
                }}
                className="group relative bg-slate-900 rounded-3xl border border-white/10 overflow-hidden hover:border-brand-blue/50 transition-all hover:translate-y-[-4px] flex flex-col shadow-lg hover:shadow-brand-blue/10"
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

                  <button
                    onClick={() => setSelectedQuiz(quiz)}
                    className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1 hover:bg-brand-blue hover:text-brand-navy transition-colors z-10"
                  >
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {quiz.rating.toFixed(1)}
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                      quiz.difficulty === 'Easy' ? "bg-emerald-400/10 text-emerald-400" :
                        quiz.difficulty === 'Medium' ? "bg-amber-400/10 text-amber-400" :
                          "bg-red-400/10 text-red-400"
                    )}>
                      {quiz.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase font-bold">
                      {quiz.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white mb-1 line-clamp-1">{quiz.title}</h3>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {creator?.avatar ? (
                        <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-2.5 h-2.5 text-slate-500" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-medium italic truncate">by {creator?.name || 'Quiz Master'}</span>
                  </div>

                  <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{quiz.description}</p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {quiz.attempts}
                      </div>
                      <button
                        onClick={() => setSelectedQuiz(quiz)}
                        className="flex items-center gap-1.5 text-yellow-500/80 hover:text-yellow-400 transition-colors"
                      >
                        <Star className="w-4 h-4 fill-current" />
                        {quiz.rating.toFixed(1)}
                      </button>
                    </div>
                    <Link
                      to={`/quiz-details/${quiz._id || quiz.id}`}
                      className="px-4 py-2 rounded-lg bg-brand-blue/10 text-brand-blue font-bold text-sm hover:bg-brand-blue hover:text-brand-navy transition-all flex items-center gap-2"
                    >
                      Play <Play className="w-3 h-3 fill-current" />
                    </Link>
                  </div>


                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4 text-slate-500">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-2">No quizzes found</h3>
          <p className="text-slate-400">Try adjusting your filters or search term.</p>
        </div>
      )}

      {/* Rating Modal Component */}
      <RatingModal
        isOpen={!!selectedQuiz}
        onClose={() => setSelectedQuiz(null)}
        quizTitle={selectedQuiz?.title || ''}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}