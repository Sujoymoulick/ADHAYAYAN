export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Mocked
  avatar: string;
  createdAt: number;
  badges: string[];
  // --- ADD THIS LINE ---
  bio?: string;
  isFirstTimeUser?: boolean;
  profession?: string;
  interestedCategories?: string[];
  isOnboarded?: boolean;
  totalScore?: number;
}

export interface Question {
  id: string;
  text: string;
  image?: string | null; // Optional Base64
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  timeLimit?: number | null; // seconds per question, overrides quiz-level if set
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: number;
}

export interface Quiz {
  _id?: string;
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number | null; // seconds per question, null if no limit
  coverImage: string | null;
  createdBy: string; // User ID
  createdAt: number;
  attempts: number;
  rating: number; // Avg rating
  ratingCount?: number;
  reviews?: Review[];
  tags: string[];
  questions: Question[];
  isPublic?: boolean;
}


export interface Score {
  _id?: string;
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalPoints: number;
  timeTaken: number; // seconds
  answeredAt: number;
  answers: Record<string, string>; // questionId -> answer
}