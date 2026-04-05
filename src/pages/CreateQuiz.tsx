import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Question } from '../types';
import {
  PlusCircle,
  Trash2,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle,
  X,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { cn } from '../utils/cn';



export default function CreateQuiz() {
  const { id } = useParams<{ id: string }>();
  const { addQuiz, updateQuiz, quizzes, currentUser } = useStore();
  const navigate = useNavigate();

  const isEditing = !!id;

  // ── QUIZ STATE ────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Science');
  const [customCategoryText, setCustomCategoryText] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [timeLimit, setTimeLimit] = useState<number | ''>('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q_${Date.now()}`,
      text: '',
      image: null,
      type: 'multiple-choice',
      options: ['', ''],
      correctAnswer: '',
      explanation: '',
      points: 10
    }
  ]);

  const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDragOverCover, setIsDragOverCover] = useState(false);
  const [dragOverQuestionId, setDragOverQuestionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Track initialization status as state to trigger re-renders correctly
  const [hasLoaded, setHasLoaded] = useState(false);
  const { initialized: storeInitialized } = useStore();

  // ── LOAD EXISTING QUIZ OR DRAFT ───────────────────────────────────────────
  useEffect(() => {
    // Case 1: Load Existing Quiz (for editing)
    if (isEditing && !hasLoaded) {
      if (!storeInitialized) return; // Wait for store to fetch from backend

      const quizId = id;
      const quiz = quizzes.find(q => q.id === quizId || q._id === quizId);
      
      if (quiz) {
        setTitle(quiz.title);
        setDescription(quiz.description);
        setCategory(['Science', 'Math', 'History', 'Tech'].includes(quiz.category) ? quiz.category : 'Custom');
        if (!['Science', 'Math', 'History', 'Tech'].includes(quiz.category)) {
          setCustomCategoryText(quiz.category);
        }
        setDifficulty(quiz.difficulty);
        setTimeLimit(quiz.timeLimit || '');
        setCoverImage(quiz.coverImage);
        setTags(quiz.tags.join(', '));
        setQuestions(quiz.questions);
        setIsPublic(quiz.isPublic || false);
        setHasLoaded(true);
      }
    }
  }, [id, isEditing, quizzes, storeInitialized, hasLoaded]);

  // Reset loading flags if ID changes
  useEffect(() => {
    setHasLoaded(false);
  }, [id]);


  // ── IMAGE UTILS ────────────────────────────────────────────────────────────
  const MAX_IMAGE_SIZE_MB = 20;

  const processFile = (file: File, questionId?: string) => {
    if (!file) return;

    // Size Validation (50MB)
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Image is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max limit is ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (questionId) {
        updateQuestion(questionId, { image: base64 });
      } else {
        setCoverImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent, id?: string) => {
    e.preventDefault();
    if (id) setDragOverQuestionId(id);
    else setIsDragOverCover(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCover(false);
    setDragOverQuestionId(null);
  };

  const handleDrop = (e: React.DragEvent, questionId?: string) => {
    e.preventDefault();
    setIsDragOverCover(false);
    setDragOverQuestionId(null);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file, questionId);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, questionId?: string) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, questionId);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      text: '',
      image: null,
      type: 'multiple-choice',
      options: ['', ''],
      correctAnswer: '',
      explanation: '',
      points: 10
    }]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions(qs => qs.filter(q => q.id !== id));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const handlePublish = async () => {
    try {
      setError('');
      if (!title.trim()) return setError('Title is required');
      if (!description.trim()) return setError('Description is required');
      if (category === 'Custom' && !customCategoryText.trim()) return setError('Required domain is required for custom category');

      // Validation Loop
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.text.trim()) return setError(`Question ${i + 1} text is empty`);
        if (q.type === 'multiple-choice') {
          if (q.options.some(opt => !opt.trim())) return setError(`Question ${i + 1} has empty options`);
          if (!q.correctAnswer) return setError(`Question ${i + 1} has no correct answer selected`);
        }
      }

      setIsSaving(true);
      const finalCategory = category === 'Custom' ? customCategoryText.trim() : category;

      const quizData: any = {
        title,
        description,
        category: finalCategory,
        difficulty,
        timeLimit: timeLimit ? Number(timeLimit) : null,
        coverImage,
        createdBy: currentUser?.id || 'guest',
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        questions,
        isPublic,
      };

      if (isEditing) {
        await updateQuiz(id, quizData);
        navigate(`/quiz-details/${id}`);
      } else {
        const newQuizId = await addQuiz(quizData);
        navigate(`/quiz-details/${newQuizId}`);
      }
    } catch (err: any) {
      console.error('Error publishing quiz:', err);
      if (err.name === 'QuotaExceededError' || err.message?.toLowerCase().includes('quota') || err.message?.toLowerCase().includes('storage')) {
        setError('Storage limit reached! Please remove large images from questions or the cover and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred while publishing.');
      }
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {isEditing ? 'Update your quiz details and questions.' : 'Design your quiz and share it with the world.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-brand-blue text-brand-navy hover:bg-brand-blue/90 transition-colors flex items-center justify-center gap-2 font-bold disabled:opacity-50 text-sm"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span className="whitespace-nowrap">{isEditing ? 'Update' : 'Publish'}</span>
          </button>
        </div>
      </div>


      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar scrollbar-hide">
        <button
          onClick={() => setActiveTab('details')}
          className={cn(
            "px-6 py-3 font-medium text-sm transition-colors border-b-2 shrink-0",
            activeTab === 'details' ? "border-brand-blue text-brand-blue" : "border-transparent text-slate-400 hover:text-white"
          )}
        >
          1. Quiz Details
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={cn(
            "px-6 py-3 font-medium text-sm transition-colors border-b-2 shrink-0",
            activeTab === 'questions' ? "border-brand-blue text-brand-blue" : "border-transparent text-slate-400 hover:text-white"
          )}
        >
          2. Questions ({questions.length})
        </button>
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Quiz Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Advanced React Patterns"
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-blue focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                  >
                    {['Science', 'Math', 'History', 'Tech', 'Custom'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  {category === 'Custom' && (
                    <input
                      type="text"
                      value={customCategoryText}
                      onChange={e => setCustomCategoryText(e.target.value)}
                      placeholder="Enter required domain..."
                      className="w-full bg-slate-800 border border-brand-blue/50 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-blue focus:outline-none"
                    />
                  )}
                </div>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white h-fit"
                >
                  {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div
              className={cn(
                "aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all",
                isDragOverCover ? "border-brand-blue bg-brand-blue/10 scale-[1.02]" : "border-white/20 bg-slate-800 hover:border-white/30"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => handleDragOver(e)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e)}
            >
              {coverImage ? (
                <>
                  <img src={coverImage} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverImage(null);
                      }}
                      className="p-3 bg-red-500 rounded-full text-white shadow-xl transform scale-75 group-hover:scale-100 transition-transform hover:bg-red-600"
                      title="Remove Cover Image"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                    <p className="absolute bottom-4 text-xs text-white font-medium">Click to Change or Remove</p>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-500">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-medium">Upload Cover Image</p>
                  <p className="text-xs mt-1 text-slate-400">Drag & Drop or Click (Max 20MB)</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/10 rounded-lg">
            <div>
              <label className="text-sm font-medium text-slate-300">Public Visibility</label>
              <p className="text-xs text-slate-500">Allow anyone to find and play this quiz.</p>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={cn("h-6 w-11 rounded-full transition-colors relative", isPublic ? "bg-brand-blue" : "bg-slate-700")}
            >
              <span className={cn("absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform", isPublic && "translate-x-5")} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Questions ({questions.length})
            </h2>
          </div>

          <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-6">


          <AnimatePresence>
            {questions.map((q, index) => (
              <Reorder.Item
                key={q.id}
                value={q}
                className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 relative group"
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveQuestion(index, 'up')} className="p-1.5 bg-slate-800 rounded-md"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => removeQuestion(q.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-md"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={q.text}
                    onChange={e => updateQuestion(q.id, { text: e.target.value })}
                    placeholder={`Question ${index + 1}`}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />

                  {/* Question Image UI */}
                  {q.image ? (
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-white/10 group">
                      <img src={q.image} alt="Question" className="w-full h-full object-cover" />
                      <button
                        onClick={() => updateQuestion(q.id, { image: null })}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label 
                        onDragOver={(e) => handleDragOver(e, q.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, q.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-all",
                          dragOverQuestionId === q.id 
                            ? "border-brand-blue bg-brand-blue/10 scale-[1.01]" 
                            : "bg-slate-800/30 border-white/10 hover:border-white/30 hover:bg-slate-800/50 text-slate-400 hover:text-white"
                        )}
                      >
                        <ImageIcon className="w-5 h-5" />
                        <div className="text-center">
                          <span className="text-sm font-medium">Add Image to Question</span>
                          <p className="text-[10px] text-slate-500 mt-0.5">Drag & Drop or Click (Max 20MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, q.id)}
                        />
                      </label>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex gap-2">
                          <button
                            onClick={() => updateQuestion(q.id, { correctAnswer: opt })}
                            className={cn("p-2 rounded-lg border", q.correctAnswer === opt && opt !== '' ? "bg-green-500/20 border-green-500" : "bg-slate-800 border-white/10")}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <input
                            type="text"
                            value={opt}
                            onChange={e => {
                              const newOpts = [...q.options];
                              newOpts[optIndex] = e.target.value;
                              updateQuestion(q.id, { options: newOpts });
                            }}
                            className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                            placeholder={`Option ${optIndex + 1}`}
                          />
                          {q.options.length > 2 && (
                            <button
                              onClick={() => {
                                const newOpts = q.options.filter((_, i) => i !== optIndex);
                                let newCorrect = q.correctAnswer;
                                if (q.correctAnswer === opt) newCorrect = '';
                                updateQuestion(q.id, { options: newOpts, correctAnswer: newCorrect });
                              }}
                              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                              title="Remove Option"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => updateQuestion(q.id, { options: [...q.options, ''] })}
                        className="text-xs text-brand-blue flex items-center gap-1"
                      >
                        <PlusCircle className="w-3 h-3" /> Add Option
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1 font-medium">Points</label>
                        <input
                          type="number"
                          min={1}
                          placeholder="Points"
                          value={q.points}
                          onChange={e => updateQuestion(q.id, { points: Number(e.target.value) })}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1 font-medium flex items-center gap-1">
                          ⏱ Time Limit <span className="text-slate-500">(seconds, blank = use quiz default)</span>
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={300}
                          placeholder="e.g. 30"
                          value={q.timeLimit ?? ''}
                          onChange={e => updateQuestion(q.id, { timeLimit: e.target.value === '' ? null : Number(e.target.value) })}
                          className="w-full bg-slate-800 border border-brand-blue/30 rounded-lg px-4 py-2 text-white focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1 font-medium">Explanation</label>
                        <input
                          type="text"
                          placeholder="Explain the correct answer..."
                          value={q.explanation}
                          onChange={e => updateQuestion(q.id, { explanation: e.target.value })}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
          <button onClick={addQuestion} className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl text-slate-400 flex items-center justify-center gap-2">
            <PlusCircle className="w-5 h-5" /> Add Question
          </button>
        </Reorder.Group>
      </div>
    )}
    </div>
  );
}