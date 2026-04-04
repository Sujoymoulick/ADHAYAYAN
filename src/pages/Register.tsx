import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { BrainCircuit, Eye, EyeOff, UserPlus, Github, Linkedin } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, register, loginWithOAuth } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSocialAuth = async (provider: string) => {
    setLoading(true);
    if (provider === 'Google') {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
      } catch (error) {
        console.error('OAuth error:', error);
        setError('Failed to initialize Google login.');
        setLoading(false);
      }
      return;
    }
    
    // Mock other providers for now or add them later
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { success, error } = await register({
      name,
      email,
      passwordHash: password, // Raw password for Supabase signUp
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, '') || email}`,
      bio: "Passionate Learner 🚀"
    });

    if (success) {
      // Navigation is handled by the useEffect watching currentUser
    } else {
      setError(error || 'Registration failed. Email might already be in use.');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex min-h-full">
      <div className="relative hidden w-0 flex-1 lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-coral/20 to-brand-blue/20 mix-blend-multiply" />
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Students learning together"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent" />
        
        <div className="absolute bottom-20 left-20 right-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10"
          >
            <h3 className="text-3xl font-display font-bold text-white mb-4">
              Join a community of lifelong learners.
            </h3>
            <p className="text-brand-coral font-medium">Create, share, and discover knowledge.</p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-brand-coral/10 rounded-lg">
                <BrainCircuit className="w-8 h-8 text-brand-coral" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                ADHYAYAN
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-display font-bold tracking-tight text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-brand-coral hover:text-brand-coral/80">
                Sign in
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-300">Full Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white placeholder-slate-500 focus:border-brand-coral focus:outline-none focus:ring-1 focus:ring-brand-coral sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Email address</label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white placeholder-slate-500 focus:border-brand-coral focus:outline-none focus:ring-1 focus:ring-brand-coral sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white placeholder-slate-500 focus:border-brand-coral focus:outline-none focus:ring-1 focus:ring-brand-coral sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
                <div className="mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white placeholder-slate-500 focus:border-brand-coral focus:outline-none focus:ring-1 focus:ring-brand-coral sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center gap-2 rounded-lg border border-transparent bg-brand-coral py-2.5 px-4 text-sm font-bold text-white shadow-sm hover:bg-brand-coral/90 focus:outline-none focus:ring-2 focus:ring-brand-coral focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> Sign up
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-brand-navy px-2 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button onClick={() => handleSocialAuth('Google')} type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-coral focus:ring-offset-2 focus:ring-offset-slate-900 transition-all">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
    </div>
  );
}
