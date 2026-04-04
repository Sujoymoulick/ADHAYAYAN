import 'dotenv/config'

import { supabaseAdmin as supabase } from './src/lib/supabase'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import http from 'http'
import { Server } from 'socket.io'
import fs from 'fs'


// Helper to convert snake_case (DB) to camelCase (Frontend)
const snakeToCamel = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) return obj;
  
  return Object.keys(obj).reduce((acc: any, key) => {
    const camelKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {});
};

// Helper to convert camelCase (Frontend) to snake_case (DB)
const camelToSnake = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) return obj;

  return Object.keys(obj).reduce((acc: any, key) => {
    const snakeKey = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};

async function seedDatabase() {
  try {
    const { data: countData } = await supabase.from('quizzes').select('*', { count: 'exact', head: true });
    if (!countData || (countData as any).length === 0) {
      const { seedQuizzes } = await import('./src/utils/seedData');
      
      const preparedQuizzes = seedQuizzes.map(q => {
        const snakeQuiz = camelToSnake(q);
        return {
          ...snakeQuiz,
          created_at: new Date().toISOString()
        };
      });

      const { error } = await supabase.from('quizzes').insert(preparedQuizzes);
      if (error) throw error;
      console.log('🌱 Database seeded with initial quizzes!');
    }
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

// Initialize database
seedDatabase();

export const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const PORT = 3000;

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  socket.on('disconnect', () => console.log('🔌 Client disconnected:', socket.id));
});

  // 2. Middleware
  app.use(express.json());

  console.log('🔍 Server running with Supabase Auth integration.');
  console.log('   - SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Present' : '❌ MISSING');


  // 3. API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // AI Question Generation (Gemini)
  app.post('/api/generate-questions', async (req, res) => {
    const { topic, difficulty, count } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    const numQuestions = Math.min(Math.max(parseInt(count) || 5, 1), 10);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured' });

    const prompt = `Generate exactly ${numQuestions} multiple-choice quiz questions about "${topic}" at ${difficulty || 'Medium'} difficulty.

Return ONLY a valid JSON array (no markdown, no extra text) in this exact format:
[
  {
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation of why this is correct.",
    "points": 10
  }
]

Rules:
- Each question must have exactly 4 options
- correctAnswer must exactly match one of the options
- Keep explanations concise (1-2 sentences)
- Make questions educational and accurate`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
          })
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error('Gemini API error:', data);
        return res.status(500).json({ error: data.error?.message || 'Gemini API error' });
      }

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      // Strip markdown code fences if present
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const questions = JSON.parse(cleaned);

      res.json({ questions });
    } catch (err: any) {
      console.error('Generate questions error:', err);
      res.status(500).json({ error: 'Failed to generate questions. Please try again.' });
    }
  });
  
  // AI Tutor Chatbot 
  app.post('/api/chat', async (req, res) => {
    const { messages, userName } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured' });
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages are required' });

    const systemPrompt = `You are the official AI tutor for Adhyayan, a gamified learning platform. Your goal is to help students understand complex topics in Computer Science and Engineering. 
    
    Guidelines:
    1. Be encouraging and inspiring.
    2. Use academic but accessible language.
    3. Occasionally use gaming metaphors like "leveling up", "unlocking knowledge", or "completing a quest".
    4. If a student (${userName || 'the student'}) asks about their notes, progress, or quizzes, remind them to check the "Lakshya" tracker for their daily goals.
    5. Keep responses concise and focused on learning.
    6. If the user asks something completely unrelated to education or CSE, politely redirect them back to their "learning quest".`;

    try {
      const chatHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Insert system prompt as the first message or use it in the generateContent
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: systemPrompt }] },
              { role: 'model', parts: [{ text: "Understood. I am the Adhyayan AI Tutor, ready to help students level up their CSE knowledge! How can I assist you on your learning quest today?" }] },
              ...chatHistory
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
          })
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error('Gemini Chat API error:', data);
        return res.status(500).json({ error: data.error?.message || 'Gemini API error' });
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      res.json({ reply });
    } catch (err: any) {
      console.error('Chat error:', err);
      res.status(500).json({ error: 'Failed to connect to the AI Tutor.' });
    }
  });


  app.get('/api/quizzes', async (req, res) => {
    try {
      const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedQuizzes = quizzes?.map(q => {
        const camelQuiz = snakeToCamel(q);
        return {
          ...camelQuiz,
          createdAt: new Date(q.created_at).getTime(),
          reviews: camelQuiz.reviews?.map((r: any) => ({ ...r, date: new Date(r.date).getTime() }))
        };
      });

      res.json(mappedQuizzes);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
  });

  app.post('/api/quizzes', async (req, res) => {
    try {
      const quizData = req.body;
      const snakeData = camelToSnake(quizData);

      const { data: newQuiz, error } = await supabase
        .from('quizzes')
        .insert([{
          ...snakeData,
          created_at: new Date().toISOString(),
          attempts: 0,
          rating: 0,
          rating_count: 0,
          reviews: []
        }])
        .select()
        .single();

      if (error) throw error;
      
      const mappedQuiz = {
        ...snakeToCamel(newQuiz),
        createdAt: new Date(newQuiz.created_at).getTime()
      };
      
      // Real-time broadcast
      io.emit('new_quiz', mappedQuiz);
      
      res.json(mappedQuiz);
    } catch (err) {
      console.error('Create quiz error:', err);
      res.status(500).json({ error: 'Failed to create quiz' });
    }
  });

  app.post('/api/quizzes/:id/rate', async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment, userName } = req.body;
      
      const { data: quiz, error: fetchError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !quiz) return res.status(404).json({ error: 'Quiz not found' });

      const count = quiz.rating_count || 0;
      const currentAvg = quiz.rating || 0;
      const newAvg = ((Number(currentAvg) * count) + rating) / (count + 1);

      const newReview = {
        id: `rev_${Date.now()}`,
        userName,
        rating,
        comment,
        date: Date.now()
      };

      const updatedReviews = [...(quiz.reviews || []), newReview];

      const { data: updatedQuiz, error: updateError } = await supabase
        .from('quizzes')
        .update({
          rating: Number(newAvg.toFixed(1)),
          rating_count: count + 1,
          reviews: updatedReviews
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      const mappedQuiz = {
        ...snakeToCamel(updatedQuiz),
        createdAt: new Date(updatedQuiz.created_at).getTime(),
        reviews: updatedQuiz.reviews?.map((r: any) => ({ ...r, date: new Date(r.date).getTime() }))
      };

      // Real-time broadcast
      io.emit('new_review', { 
        quizId: id, 
        review: newReview, 
        rating: mappedQuiz.rating, 
        ratingCount: mappedQuiz.ratingCount 
      });

      res.json({ success: true, quiz: mappedQuiz });
    } catch (err) {
      console.error('Rate quiz error:', err);
      res.status(500).json({ error: 'Failed to submit rating' });
    }
  });

  app.get('/api/scores', async (req, res) => {
    try {
      const { data: scores, error } = await supabase
        .from('scores')
        .select('*')
        .order('answered_at', { ascending: false });

      if (error) throw error;
      
      const mappedScores = scores?.map(s => {
        const camelScore = snakeToCamel(s);
        return {
          ...camelScore,
          answeredAt: new Date(s.answered_at).getTime()
        };
      });

      res.json(mappedScores);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch scores' });
    }
  });

  app.post('/api/scores', async (req, res) => {
    try {
      const scoreData = req.body;
      const snakeData = camelToSnake(scoreData);

      const { data: newScore, error } = await supabase
        .from('scores')
        .insert([{
          ...snakeData,
          answered_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      const mappedScore = {
        ...snakeToCamel(newScore),
        answeredAt: new Date(newScore.answered_at).getTime()
      };

      // Real-time broadcast for leaderboards etc
      io.emit('new_score', mappedScore);

      res.json(mappedScore);
    } catch (err) {
      console.error('Save score error:', err);
      res.status(500).json({ error: 'Failed to save score' });
    }
  });

  app.patch('/api/user/update', async (req, res) => {
    try {
      const { email, name, bio, avatar } = req.body;
      if (!email) return res.status(400).json({ error: 'User email is required' });

      const { data: updatedUser, error } = await supabase
        .from('profiles')
        .update({ name, bio, avatar: avatar })
        .eq('email', email)
        .select()
        .single();

      if (error || !updatedUser) return res.status(404).json({ error: 'User not found' });
      
      const mappedUser = {
        ...snakeToCamel(updatedUser),
        createdAt: new Date(updatedUser.created_at).getTime()
      };

      res.json({ success: true, user: mappedUser });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Sync User Profile (Upsert)
  app.post('/api/user/sync', async (req, res) => {
    try {
      const { id, email, name, avatar } = req.body;
      if (!id || !email) return res.status(400).json({ error: 'User ID and email are required' });

      const { data: profile, error } = await supabase
        .from('profiles')
        .upsert({
          id,
          email,
          name: name || email.split('@')[0],
          avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          last_login: new Date().toISOString()
        }, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        user: {
          ...snakeToCamel(profile),
          createdAt: new Date(profile.created_at).getTime()
        }
      });
    } catch (err) {
      console.error('User sync error:', err);
      res.status(500).json({ error: 'Failed to sync user profile' });
    }
  });



  // 6. Vite / Static Files (MUST BE LAST)
// Only start the local server if not deployed as a Serverless Function on Vercel
if (!process.env.VERCEL) {
  async function startViteServer() {

    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
      });
      app.use(vite.middlewares);
      
      app.get('*', async (req, res, next) => {
        const url = req.originalUrl;
        if (url.startsWith('/api') || url.startsWith('/socket.io')) return next();
        
        try {
          let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e: any) {
          vite.ssrFixStacktrace(e);
          next(e);
        }
      });
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
    }

    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }
  startViteServer();
}

export default app;