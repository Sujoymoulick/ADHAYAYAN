import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Sparkles, Briefcase, Compass, CheckCircle2, ChevronRight, UserCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Onboarding() {
    const navigate = useNavigate();
    const { currentUser, completeOnboarding } = useStore();

    const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean | null>(null);
    const [profession, setProfession] = useState<string>('');
    const [interestedCategories, setInterestedCategories] = useState<string[]>([]);

    const [customCategory, setCustomCategory] = useState('');

    const professions = ['Student', 'Teacher/Educator', 'Professional / Corporate', 'Hobbyist / Lifelong Learner', 'Other'];
    const categoriesList = ['Tech', 'Science', 'Math', 'History', 'Pop Culture', 'Geography', 'Arts', 'Coding'];

    if (!currentUser) return null;

    const toggleCategory = (cat: string) => {
        setInterestedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleAddCustomCategory = () => {
        if (customCategory.trim() && !interestedCategories.includes(customCategory.trim())) {
            setInterestedCategories(prev => [...prev, customCategory.trim()]);
            setCustomCategory('');
        }
    };

    const handleComplete = () => {
        if (isFirstTimeUser === null || !profession || interestedCategories.length === 0) {
            alert("Please complete all sections to continue.");
            return;
        }

        completeOnboarding({
            isFirstTimeUser,
            profession,
            interestedCategories
        });

        navigate('/');
    };

    return (
        <div className="flex-1 min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 z-10 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-coral p-1 mb-6 shadow-xl">
                        <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-transparent bg-clip-text bg-gradient-to-br from-brand-blue to-brand-coral z-10 absolute" />
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Welcome to Adhyayan!</h1>
                    <p className="text-slate-400 text-lg">Let's customize your experience before you dive in.</p>
                </div>

                <div className="space-y-10">
                    {/* Question 1 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <UserCircle2 className="w-5 h-5 text-brand-blue" />
                            Is this your first time using Adhyayan?
                        </h3>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsFirstTimeUser(true)}
                                className={cn(
                                    "flex-1 py-4 rounded-xl border-2 font-bold transition-all",
                                    isFirstTimeUser === true
                                        ? "border-brand-blue bg-brand-blue/10 text-white"
                                        : "border-white/10 bg-slate-800 text-slate-400 hover:border-white/20 hover:text-white"
                                )}
                            >
                                Yes, it's my first time
                            </button>
                            <button
                                onClick={() => setIsFirstTimeUser(false)}
                                className={cn(
                                    "flex-1 py-4 rounded-xl border-2 font-bold transition-all",
                                    isFirstTimeUser === false
                                        ? "border-brand-blue bg-brand-blue/10 text-white"
                                        : "border-white/10 bg-slate-800 text-slate-400 hover:border-white/20 hover:text-white"
                                )}
                            >
                                No, I've used it before
                            </button>
                        </div>
                    </div>

                    {/* Question 2 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-emerald-400" />
                            What describes your profession best?
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {professions.map(prof => (
                                <button
                                    key={prof}
                                    onClick={() => setProfession(prof)}
                                    className={cn(
                                        "px-4 py-3 rounded-xl border text-left font-medium transition-all",
                                        profession === prof
                                            ? "border-emerald-400 bg-emerald-400/10 text-white"
                                            : "border-white/5 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    {prof}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question 3 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Compass className="w-5 h-5 text-brand-coral" />
                            What topics are you most interested in?
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-3">
                                {categoriesList.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className={cn(
                                            "px-5 py-2.5 rounded-full border font-bold transition-all flex items-center gap-2 text-sm",
                                            interestedCategories.includes(cat)
                                                ? "border-brand-coral bg-brand-coral text-white shadow-[0_0_15px_rgba(255,107,107,0.3)]"
                                                : "border-white/10 bg-slate-800 text-slate-400 hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {interestedCategories.includes(cat) && <CheckCircle2 className="w-4 h-4" />}
                                        {cat}
                                    </button>
                                ))}
                                {interestedCategories.filter(cat => !categoriesList.includes(cat)).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className="px-5 py-2.5 rounded-full border border-brand-coral bg-brand-coral text-white shadow-[0_0_15px_rgba(255,107,107,0.3)] font-bold transition-all flex items-center gap-2 text-sm"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-2 w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Add custom category..."
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCustomCategory();
                                        }
                                    }}
                                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white placeholder-slate-500 focus:border-brand-coral focus:outline-none focus:ring-1 focus:ring-brand-coral text-sm w-full max-w-[200px]"
                                />
                                <button
                                    onClick={handleAddCustomCategory}
                                    type="button"
                                    className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all text-sm"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex justify-end">
                    <button
                        onClick={handleComplete}
                        disabled={isFirstTimeUser === null || !profession || interestedCategories.length === 0}
                        className="px-8 py-4 rounded-xl font-bold bg-brand-blue text-brand-navy hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        Get Started <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
