import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Trophy, Medal, Search, Award } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Leaderboard() {
  const { users, scores, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'today'>('all');

  const leaderboardData = useMemo(() => {
    // Filter scores by time
    const now = Date.now();
    const filteredScores = scores.filter(s => {
      if (timeFilter === 'all') return true;
      if (timeFilter === 'week') return now - s.answeredAt <= 7 * 24 * 60 * 60 * 1000;
      if (timeFilter === 'today') return now - s.answeredAt <= 24 * 60 * 60 * 1000;
      return true;
    });

    // Aggregate scores by user
    const userStats = new Map<string, { totalScore: number; quizzesCompleted: number }>();
    
    filteredScores.forEach(score => {
      const stats = userStats.get(score.userId) || { totalScore: 0, quizzesCompleted: 0 };
      stats.totalScore += score.score;
      stats.quizzesCompleted += 1;
      userStats.set(score.userId, stats);
    });

    // Map to user objects and sort
    return Array.from(userStats.entries())
      .map(([userId, stats]) => {
        const user = users.find(u => u.id === userId);
        return {
          user,
          ...stats
        };
      })
      .filter(entry => entry.user && entry.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [users, scores, timeFilter, searchTerm]);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center justify-center p-4 bg-brand-coral/10 rounded-full mb-4">
          <Trophy className="w-12 h-12 text-brand-coral" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Global Leaderboard</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Compete with learners worldwide. Earn points by completing quizzes and climb to the top!
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto no-scrollbar scrollbar-hide">
          {(['all', 'week', 'today'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={cn(
                "flex-1 md:flex-none px-6 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all capitalize whitespace-nowrap",
                timeFilter === filter 
                  ? "bg-brand-blue text-brand-navy shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {filter === 'all' ? 'All Time' : filter === 'week' ? 'This Week' : 'Today'}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
        </div>
      </div>

      {/* Top 3 Podium (Desktop only) */}
      {leaderboardData.length >= 3 && !searchTerm && (
        <div className="hidden md:flex items-end justify-center gap-6 mb-16 mt-10 h-64">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center relative"
          >
            <div className="absolute -top-12 flex flex-col items-center">
              <img src={leaderboardData[1].user!.avatar} alt="" className="w-16 h-16 rounded-full border-4 border-slate-300 bg-slate-800" />
              <div className="bg-slate-300 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full -mt-3 z-10">2ND</div>
            </div>
            <div className="w-32 h-32 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-2xl border-t-4 border-slate-300 flex flex-col items-center justify-end pb-4">
              <p className="text-white font-bold truncate w-full text-center px-2">{leaderboardData[1].user!.name.split(' ')[0]}</p>
              <p className="text-brand-blue font-display font-bold text-xl">{leaderboardData[1].totalScore}</p>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center relative"
          >
            <div className="absolute -top-16 flex flex-col items-center">
              <Trophy className="w-8 h-8 text-yellow-400 mb-1" />
              <img src={leaderboardData[0].user!.avatar} alt="" className="w-20 h-20 rounded-full border-4 border-yellow-400 bg-slate-800" />
              <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full -mt-3 z-10">1ST</div>
            </div>
            <div className="w-36 h-40 bg-gradient-to-t from-yellow-900/40 to-yellow-600/40 rounded-t-2xl border-t-4 border-yellow-400 flex flex-col items-center justify-end pb-4">
              <p className="text-white font-bold truncate w-full text-center px-2">{leaderboardData[0].user!.name.split(' ')[0]}</p>
              <p className="text-yellow-400 font-display font-bold text-2xl">{leaderboardData[0].totalScore}</p>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center relative"
          >
            <div className="absolute -top-12 flex flex-col items-center">
              <img src={leaderboardData[2].user!.avatar} alt="" className="w-16 h-16 rounded-full border-4 border-amber-700 bg-slate-800" />
              <div className="bg-amber-700 text-amber-100 text-xs font-bold px-2 py-0.5 rounded-full -mt-3 z-10">3RD</div>
            </div>
            <div className="w-32 h-24 bg-gradient-to-t from-slate-800 to-amber-900/30 rounded-t-2xl border-t-4 border-amber-700 flex flex-col items-center justify-end pb-4">
              <p className="text-white font-bold truncate w-full text-center px-2">{leaderboardData[2].user!.name.split(' ')[0]}</p>
              <p className="text-amber-500 font-display font-bold text-xl">{leaderboardData[2].totalScore}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* List */}
      <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-800/50 text-xs uppercase tracking-wider text-slate-400 font-medium">
                <th className="p-4 w-16 text-center">Rank</th>
                <th className="p-4">User</th>
                <th className="p-4 text-center hidden sm:table-cell">Quizzes</th>
                <th className="p-4 text-center hidden md:table-cell">Badges</th>
                <th className="p-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => {
                const isCurrentUser = currentUser?.id === entry.user!.id;
                
                return (
                  <motion.tr
                    key={entry.user!.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border-b border-white/5 hover:bg-white/5 transition-colors",
                      isCurrentUser ? "bg-brand-blue/5 border-brand-blue/20" : ""
                    )}
                  >
                    <td className="p-4 text-center">
                      {index === 0 ? <Medal className="w-6 h-6 text-yellow-400 mx-auto" /> :
                       index === 1 ? <Medal className="w-6 h-6 text-slate-300 mx-auto" /> :
                       index === 2 ? <Medal className="w-6 h-6 text-amber-700 mx-auto" /> :
                       <span className="text-slate-500 font-bold">{index + 1}</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={entry.user!.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-800" />
                        <div>
                          <p className={cn("font-bold text-sm sm:text-base", isCurrentUser ? "text-brand-blue" : "text-white")}>
                            {entry.user!.name} {isCurrentUser && "(You)"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center text-slate-300 hidden sm:table-cell">
                      {entry.quizzesCompleted}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {entry.user!.badges.slice(0, 3).map((badge, i) => (
                          <div key={i} className="group relative">
                            <Award className="w-5 h-5 text-brand-coral" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {badge}
                            </div>
                          </div>
                        ))}
                        {entry.user!.badges.length > 3 && (
                          <span className="text-xs text-slate-500">+{entry.user!.badges.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-display font-bold text-lg text-brand-blue">{entry.totalScore}</span>
                    </td>
                  </motion.tr>
                );
              })}
              
              {leaderboardData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No scores found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
