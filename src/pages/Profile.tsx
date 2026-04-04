import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import {
  User, Settings, Trophy, Clock, Star, BrainCircuit,
  Trash2, Edit3, Eye, X, Save, Upload, Camera, Plus, Compass,
  MessageSquare, Calendar, CloudUpload, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Quiz } from '../types';

export default function Profile() {
  const { currentUser, quizzes, scores, deleteQuiz, setUser } = useStore();
  const [activeTab, setActiveTab] = useState<'stats' | 'created' | 'history' | 'reviews'>('stats');

  // Review states
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedQuizForReviews, setSelectedQuizForReviews] = useState<Quiz | null>(null);

  // Customization States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [localDraft, setLocalDraft] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditModalOpen && currentUser) {
      setEditName(currentUser.name);
      setEditBio(currentUser.bio || '');
      setEditAvatar(currentUser.avatar);
    }
  }, [isEditModalOpen, currentUser]);

  useEffect(() => {
    const savedDraft = localStorage.getItem('adhyayan_quiz_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Only show if it has at least a title or some questions
        if (parsed.title || (parsed.questions && parsed.questions.length > 0)) {
          setLocalDraft(parsed);
        }
      } catch (e) {
        console.error("Error parsing local draft", e);
      }
    }
  }, []);

  const handleDeleteDraft = () => {
    if (window.confirm("Are you sure you want to discard this draft?")) {
      localStorage.removeItem('adhyayan_quiz_draft');
      setLocalDraft(null);
    }
  };

  if (!currentUser) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim()) return alert("Name cannot be empty");
    setIsUpdating(true);
    const updatedUser = { ...currentUser, name: editName, bio: editBio, avatar: editAvatar };

    try {
      setUser(updatedUser);
      // Backend sync logic remains same...
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMigration = async () => {
    setIsMigrating(true);
    const { migrateLocalData } = useStore.getState();
    await migrateLocalData();
    setIsMigrating(false);
  };

  const myQuizzes = quizzes.filter(q => q.createdBy === currentUser.id);
  const myScores = scores.filter(s => s.userId === currentUser.id);
  const totalScore = myScores.reduce((acc, s) => acc + s.score, 0);
  const avgScore = myScores.length > 0 ? (totalScore / myScores.reduce((acc, s) => acc + s.totalPoints, 0)) * 100 : 0;
  const bestScore = myScores.length > 0 ? Math.max(...myScores.map(s => (s.score / s.totalPoints) * 100)) : 0;

  // Aggregate all reviews across my quizzes
  const allReviews = myQuizzes.flatMap(q => (q.reviews || []).map(r => ({ ...r, quizTitle: q.title, quizId: q._id || q.id })))
    .sort((a, b) => b.date - a.date);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="bg-slate-900/50 rounded-3xl border border-white/10 p-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r from-brand-blue/20 to-brand-coral/20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 pt-12">
          <div className="relative group">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-32 h-32 rounded-full border-4 border-slate-900 bg-slate-800 object-cover" />
            <button onClick={() => setIsEditModalOpen(true)} className="absolute bottom-0 right-0 p-2 bg-brand-blue rounded-full text-brand-navy hover:bg-brand-blue/90 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-display font-bold text-white mb-1">{currentUser.name}</h1>
            <p className="text-slate-300 mb-2 italic">{currentUser.bio || "Passionate Learner 🚀"}</p>
            <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm">
              <User className="w-4 h-4" /> {currentUser.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <button onClick={() => setIsEditModalOpen(true)} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-medium flex items-center gap-2">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
            <button 
              onClick={handleMigration} 
              disabled={isMigrating}
              className="px-6 py-3 rounded-xl bg-brand-blue/10 border border-brand-blue/30 text-brand-blue hover:bg-brand-blue/20 transition-all font-medium flex items-center gap-2 disabled:opacity-50"
              title="If your quizzes or scores are missing, click this to restore them from your browser's memory."
            >
              {isMigrating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
              {isMigrating ? "Syncing..." : "Restore Data"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
        {(['stats', 'created', 'history', 'reviews'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-4 font-medium text-sm transition-colors border-b-2 whitespace-nowrap capitalize",
              activeTab === tab ? "border-brand-blue text-brand-blue" : "border-transparent text-slate-400 hover:text-white"
            )}
          >
            {tab === 'created' ? `My Quizzes (${myQuizzes.length})` : 
             tab === 'history' ? 'Attempt History' : 
             tab === 'reviews' ? `Quiz Feedback (${allReviews.length})` : 
             'Overview & Stats'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-100">
        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={<Trophy />} label="Total Score" value={totalScore} color="blue" />
              <StatCard icon={<Star />} label="Average Score" value={`${avgScore.toFixed(1)}%`} color="emerald" />
              <StatCard icon={<Trophy />} label="Best Score" value={`${bestScore.toFixed(1)}%`} color="amber" />
            </div>

            <div>
              <h3 className="text-xl font-display font-bold text-white mb-4">Badges & Achievements</h3>
              {currentUser.badges && currentUser.badges.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {currentUser.badges.map((badge, i) => (
                    <div key={i} className="bg-slate-900/50 rounded-2xl border border-white/10 p-4 flex flex-col items-center gap-3 min-w-[120px]">
                      <div className="w-12 h-12 rounded-full bg-brand-coral/10 flex items-center justify-center text-brand-coral"><Trophy className="w-6 h-6" /></div>
                      <span className="font-medium text-xs text-slate-300">{badge}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No badges earned yet.</p>
              )}
            </div>

            {/* How to Earn Badges */}
            <div className="pt-8 border-t border-white/10 mt-8">
              <h3 className="text-xl font-display font-bold text-white mb-6">How to Earn Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'First Quiz', name: 'First Quiz', desc: 'Complete your very first quiz', current: myScores.length > 0 ? 1 : 0, required: 1, icon: <Trophy className="w-5 h-5" /> },
                  { id: 'Perfect Score', name: 'Perfect Score', desc: 'Achieve 100% on any quiz', current: Math.floor(bestScore), required: 100, icon: <Star className="w-5 h-5" /> },
                  { id: 'Quiz Creator', name: 'Quiz Creator', desc: 'Create and publish 5 quizzes', current: myQuizzes.length, required: 5, icon: <BrainCircuit className="w-5 h-5" /> },
                  { id: 'Speed Demon', name: 'Speed Demon', desc: 'Finish a quiz in under 30 seconds', current: myScores.some(s => s.timeTaken < 30) ? 1 : 0, required: 1, icon: <Clock className="w-5 h-5" /> },
                  { id: 'Night Owl', name: 'Night Owl', desc: 'Complete 3 quizzes between 10 PM and 4 AM', current: myScores.filter(s => { const h = new Date(s.answeredAt).getHours(); return h >= 22 || h < 4; }).length, required: 3, icon: <Star className="w-5 h-5" /> }
                ].map((badge) => {
                  const isEarned = currentUser.badges?.includes(badge.name);
                  const progressPercentage = isEarned ? 100 : Math.min(100, Math.max(0, Math.round((badge.current / badge.required) * 100)));

                  return (
                    <div key={badge.id} className="bg-slate-900/40 rounded-2xl border border-white/5 p-5 flex gap-4">
                      <div className={cn(
                        "w-12 h-12 shrink-0 rounded-full flex items-center justify-center",
                        isEarned ? "bg-brand-coral/20 text-brand-coral shadow-[0_0_15px_rgba(255,107,107,0.2)]" : "bg-slate-800 text-slate-500"
                      )}>
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={cn("font-bold truncate", isEarned ? "text-white" : "text-slate-300")}>{badge.name}</h4>
                          <span className={cn("text-xs font-bold", isEarned ? "text-brand-coral" : "text-brand-blue")}>
                            {progressPercentage}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{badge.desc}</p>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all duration-1000", isEarned ? "bg-brand-coral" : "bg-brand-blue")}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'created' && (
          <motion.div 
            layout
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Create New Quiz Action Card */}
            <motion.div layout>
              <Link
                to="/create"
                className="group border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all gap-4 h-full min-h-[200px]"
              >
                <div className="w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-white group-hover:text-brand-blue transition-colors">Create New Quiz</span>
                  <span className="text-xs text-slate-500">Manual or AI Generation</span>
                </div>
              </Link>
            </motion.div>

            {/* Draft Quiz Card */}
            {localDraft && (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-2xl border border-brand-blue/30 overflow-hidden flex flex-col h-full relative group shadow-[0_0_20px_rgba(59,130,246,0.1)]"
              >
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-brand-blue/20 text-brand-blue text-[10px] font-bold px-2 py-1 rounded-full border border-brand-blue/30 uppercase tracking-wider">
                    Draft
                  </span>
                </div>
                <div className="p-5 flex-1 pt-10">
                  <h3 className="text-lg font-bold text-white mb-2">{localDraft.title || 'Untitled Quiz'}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{localDraft.description || 'No description'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-md border border-white/5">
                      {localDraft.questions?.length || 0} Questions
                    </span>
                    {localDraft.updatedAt && (
                      <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-md border border-white/5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {new Date(localDraft.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 border-t border-white/5 flex gap-3 items-center bg-brand-blue/5 overflow-hidden">
                  <button 
                    onClick={handleDeleteDraft} 
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Discard Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link 
                    to="/create" 
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-brand-blue text-brand-navy font-bold text-sm hover:translate-y-[-2px] transition-all shadow-lg active:translate-y-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Resume Draft
                  </Link>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {myQuizzes.map(quiz => (
                <motion.div 
                  key={quiz.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full"
                >
                  <div className="p-5 flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{quiz.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{quiz.description}</p>
                  </div>
                  <div className="p-4 border-t border-white/5 flex gap-3 items-center bg-white/5 mt-auto">
                    <button 
                      onClick={() => deleteQuiz(quiz._id || quiz.id)} 
                      className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Delete Quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link 
                      to={`/edit/${quiz._id || quiz.id}`} 
                      className="p-2 rounded-lg text-brand-blue hover:bg-brand-blue/10 transition-colors"
                      title="Edit Quiz"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    {quiz.reviews && quiz.reviews.length > 0 && (
                      <button 
                        onClick={() => {
                          setSelectedQuizForReviews(quiz);
                          setIsReviewsModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-400/10 transition-colors flex items-center gap-1"
                        title="View Feedback"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-bold">{quiz.reviews.length}</span>
                      </button>
                    )}
                    <div className="flex-1" />

                    <Link to={`/quiz-details/${quiz._id || quiz.id}`} className="text-brand-blue text-sm font-medium hover:underline px-2">View Quiz</Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}


        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {myScores.length > 0 ? (
              myScores.sort((a, b) => b.answeredAt - a.answeredAt).map(score => {
                const quiz = quizzes.find(q => q.id === score.quizId || q._id === score.quizId);
                return (
                  <div key={score.id} className="bg-slate-900 rounded-2xl border border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{quiz?.title || 'Deleted Quiz'}</h3>
                      <p className="text-xs text-slate-400">
                        {new Date(score.answeredAt).toLocaleDateString()} at {new Date(score.answeredAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Score</p>
                        <p className={cn("text-lg font-bold",
                          (score.score / score.totalPoints) >= 0.7 ? "text-emerald-400" : "text-amber-400"
                        )}>
                          {score.score} / {score.totalPoints}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Time</p>
                        <p className="text-lg font-bold text-white">
                          {Math.floor(score.timeTaken / 60)}m {score.timeTaken % 60}s
                        </p>
                      </div>
                      {quiz && (
                        <Link to={`/quiz/${quiz._id || quiz.id}`} className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10 text-sm whitespace-nowrap">
                          Play Again
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-white/5">
                <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-display font-bold text-white mb-2">No attempts yet</h3>
                <p className="text-slate-400 mb-6">You haven't played any quizzes. Go explore and test your knowledge!</p>
                <Link to="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-brand-navy font-bold rounded-xl hover:bg-brand-blue/90 transition-colors">
                  <Compass className="w-5 h-5" /> Explore Quizzes
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {allReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allReviews.map((review) => (
                  <div key={review.id} className="bg-slate-900/50 rounded-2xl border border-white/10 p-6 flex flex-col h-full group hover:border-brand-blue/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
                          {(review.userName || 'U').charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold">{review.userName || 'Anonymous User'}</p>
                          <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={cn("w-3.5 h-3.5", s <= (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-600")} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full">
                        <Calendar className="w-3 h-3" />
                        {review.date ? new Date(review.date).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                    
                    <p className="text-slate-300 italic mb-6 flex-1 text-sm bg-black/20 p-4 rounded-xl relative">
                      <MessageSquare className="absolute -top-2 -left-1 w-4 h-4 text-brand-blue/20" />
                      "{review.comment || 'No comment left'}"
                    </p>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">On Quiz</span>
                        <Link to={`/quiz-details/${review.quizId}`} className="text-brand-blue text-xs font-bold hover:underline line-clamp-1">
                          {review.quizTitle}
                        </Link>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-blue/10 transition-colors">
                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-brand-blue transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-white/5">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 text-slate-500">
                  <MessageSquare className="w-10 h-10 opacity-30" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">No feedback yet</h3>
                <p className="text-slate-400 max-w-sm mx-auto">When users rate and comment on your public quizzes, they will appear here as a feed.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Edit Modal (remains the same) */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col items-center gap-4 mb-2">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img src={editAvatar} className="w-24 h-24 rounded-full border-2 border-brand-blue object-cover group-hover:opacity-75 transition-opacity" alt="Preview" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <p className="text-xs text-slate-400">Click image to upload</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-brand-blue/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                  <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-brand-blue/50 resize-none" rows={3} />
                </div>
                <button onClick={handleUpdateProfile} disabled={isUpdating} className="w-full py-4 bg-brand-blue text-brand-navy font-bold rounded-xl hover:bg-brand-blue/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isUpdating ? "Saving..." : <><Save className="w-5 h-5" /> Save Changes</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reviews Modal */}
      <AnimatePresence>

        {isReviewsModalOpen && selectedQuizForReviews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => {
                setIsReviewsModalOpen(false);
                setSelectedQuizForReviews(null);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Quiz Feedback</h2>
                  <p className="text-slate-400 text-sm mt-1">{selectedQuizForReviews.title}</p>
                </div>
                <button onClick={() => {
                  setIsReviewsModalOpen(false);
                  setSelectedQuizForReviews(null);
                }} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 space-y-4">
                {selectedQuizForReviews.reviews?.sort((a,b) => b.date - a.date).map((review) => (
                  <div key={review.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-xs">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{review.userName}</p>
                          <div className="flex gap-0.5 mt-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600")} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-6 flex items-center gap-4">
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        color === 'blue' ? "bg-blue-500/10 text-blue-400" :
          color === 'emerald' ? "bg-emerald-500/10 text-emerald-400" :
            "bg-amber-500/10 text-amber-400"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}