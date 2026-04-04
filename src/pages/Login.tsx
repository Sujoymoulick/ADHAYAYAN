import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { BrainCircuit, Eye, EyeOff, LogIn, Mail, ShieldCheck, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';

type View = 'LOGIN' | 'FORGOT_PASSWORD' | 'OTP_VERIFY' | 'RESET_PASSWORD';

export default function Login() {
  const [view, setView] = useState<View>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const { currentUser, login, loginWithOAuth, continueAsGuest, resetPassword, users } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSocialAuth = async (provider: string) => {
    if (!supabase || supabase.auth.getSession === undefined) {
      setError('⚠️ Authentication service is disconnected. Please check environment variables.');
      return;
    }
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
        console.error('Login error:', error);
        setError('Failed to initialize Google login.');
        setLoading(false);
      }
      return;
    }
    setLoading(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { success, error } = await login(email, password);
    if (success) { 
      // Navigation is handled by the useEffect watching currentUser
    } else { 
      setError(error || 'Invalid email or password'); 
    }
    setLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const userExists = users.find(u => u.email === forgotEmail && u.passwordHash !== 'oauth_user');
    if (!userExists) {
      setError('No account found with this email, or this account uses Google sign-in.');
      setLoading(false);
      return;
    }
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(otp);
    setLoading(false);
    setOtpInputs(['', '', '', '']);
    alert(`🔐 Your Adhyayan OTP: ${otp}`);
    setView('OTP_VERIFY');
  };

  const handleOtpInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otpInputs];
    updated[index] = value.slice(-1);
    setOtpInputs(updated);
    if (value && index < 3) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const enteredOtp = otpInputs.join('');
    if (enteredOtp === generatedOtp) {
      setView('RESET_PASSWORD');
    } else {
      setError('Incorrect OTP. Please try again.');
      setOtpInputs(['', '', '', '']);
      otpRefs[0].current?.focus();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmNewPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const success = resetPassword(forgotEmail, newPassword);
    setLoading(false);
    if (success) {
      setView('LOGIN');
      setSuccess('Password reset successfully! Please log in with your new password.');
      setForgotEmail('');
      setGeneratedOtp('');
      setOtpInputs(['', '', '', '']);
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  const sidePanel = (
    <div className="relative hidden w-0 flex-1 lg:block overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-coral/20 mix-blend-multiply" />
      <img className="absolute inset-0 h-full w-full object-cover opacity-30" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Abstract learning background" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent" />
      <div className="absolute bottom-20 left-20 right-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-8 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10">
          <h3 className="text-3xl font-display font-bold text-white mb-4">"Education is not the learning of facts, but the training of the mind to think."</h3>
          <p className="text-brand-blue font-medium">— Albert Einstein</p>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex min-h-full">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-brand-blue/10 rounded-lg"><BrainCircuit className="w-8 h-8 text-brand-blue" /></div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">ADHYAYAN</span>
          </div>

          <AnimatePresence mode="wait">
            {/* ── LOGIN VIEW ── */}
            {view === 'LOGIN' && (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="mt-6 text-3xl font-display font-bold tracking-tight text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-400">Or <Link to="/register" className="font-medium text-brand-blue hover:text-brand-blue/80">create a new account</Link></p>
                <div className="mt-8">
                  {success && (<div className="mb-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 shrink-0" />{success}</div>)}
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Email address</label>
                      <div className="mt-1"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full appearance-none rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white placeholder-slate-500 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue sm:text-sm" /></div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Password</label>
                      <div className="mt-1 relative">
                        <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full appearance-none rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white placeholder-slate-500 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue sm:text-sm pr-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-white/10 bg-slate-900 text-brand-blue focus:ring-brand-blue" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">Remember me</label>
                      </div>
                      <button type="button" onClick={() => { setError(''); setSuccess(''); setView('FORGOT_PASSWORD'); }} className="text-sm font-medium text-brand-blue hover:text-brand-blue/80">Forgot password?</button>
                    </div>
                    <button type="submit" disabled={loading} className="flex w-full justify-center items-center gap-2 rounded-lg border border-transparent bg-brand-blue py-2.5 px-4 text-sm font-bold text-brand-navy shadow-sm hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      {loading ? <div className="w-5 h-5 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" /> : <><LogIn className="w-4 h-4" /> Sign in</>}
                    </button>
                  </form>
                  <div className="mt-6">
                    <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center text-sm"><span className="bg-brand-navy px-2 text-slate-400">Or continue with</span></div></div>
                    <div className="mt-6 grid grid-cols-1 gap-3">
                      <button onClick={() => handleSocialAuth('Google')} type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/5 transition-all">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        <span>Continue with Google</span>
                      </button>
                    </div>
                    <div className="mt-3"><button onClick={() => { continueAsGuest(); navigate('/'); }} className="flex w-full justify-center items-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-white/10 transition-all">Continue without account</button></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── FORGOT PASSWORD VIEW ── */}
            {view === 'FORGOT_PASSWORD' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => { setError(''); setView('LOGIN'); }} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to login</button>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-blue/10 mb-4"><Mail className="w-6 h-6 text-brand-blue" /></div>
                <h2 className="text-2xl font-display font-bold text-white mb-1">Forgot your password?</h2>
                <p className="text-slate-400 text-sm mb-8">Enter your account email and we'll send you a one-time verification code.</p>
                <form onSubmit={handleSendOtp} className="space-y-5">
                  {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
                    <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="your@email.com" className="block w-full appearance-none rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white placeholder-slate-500 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue sm:text-sm" />
                  </div>
                  <button type="submit" disabled={loading} className="flex w-full justify-center items-center gap-2 rounded-lg bg-brand-blue py-2.5 px-4 text-sm font-bold text-brand-navy hover:bg-brand-blue/90 disabled:opacity-50 transition-all">
                    {loading ? <div className="w-5 h-5 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" /> : <><Mail className="w-4 h-4" /> Send OTP</>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── OTP VERIFY VIEW ── */}
            {view === 'OTP_VERIFY' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => { setError(''); setView('FORGOT_PASSWORD'); }} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 mb-4"><ShieldCheck className="w-6 h-6 text-emerald-400" /></div>
                <h2 className="text-2xl font-display font-bold text-white mb-1">Verify your identity</h2>
                <p className="text-slate-400 text-sm mb-8">Enter the 4-digit OTP code sent to <span className="text-white font-medium">{forgotEmail}</span>.</p>
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
                  <div className="flex justify-between gap-3">
                    {otpInputs.map((val, i) => (
                      <input key={i} ref={otpRefs[i]} type="text" inputMode="numeric" maxLength={1} value={val} onChange={(e) => handleOtpInput(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)} className="w-full text-center text-3xl font-display font-bold rounded-xl border border-white/10 bg-slate-900/50 py-4 text-white focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all" />
                    ))}
                  </div>
                  <button type="submit" disabled={otpInputs.some(v => !v)} className="flex w-full justify-center items-center gap-2 rounded-lg bg-emerald-500 py-2.5 px-4 text-sm font-bold text-white hover:bg-emerald-500/90 disabled:opacity-50 transition-all">
                    <ShieldCheck className="w-4 h-4" /> Verify OTP
                  </button>
                  <button type="button" onClick={() => { setOtpInputs(['', '', '', '']); handleSendOtp({ preventDefault: () => { } } as React.FormEvent); }} className="w-full text-sm text-brand-blue hover:text-brand-blue/80 transition-colors">Resend OTP</button>
                </form>
              </motion.div>
            )}

            {/* ── RESET PASSWORD VIEW ── */}
            {view === 'RESET_PASSWORD' && (
              <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-coral/10 mb-4"><KeyRound className="w-6 h-6 text-brand-coral" /></div>
                <h2 className="text-2xl font-display font-bold text-white mb-1">Create new password</h2>
                <p className="text-slate-400 text-sm mb-8">Your identity is verified. Set a strong new password for your account.</p>
                <form onSubmit={handleResetPassword} className="space-y-5">
                  {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                    <div className="relative">
                      <input type={showNewPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" className="block w-full appearance-none rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white placeholder-slate-500 focus:border-brand-coral focus:outline-none focus:ring-1 focus:ring-brand-coral sm:text-sm pr-10" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white">{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
                    <input type={showNewPassword ? "text" : "password"} required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="block w-full appearance-none rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white placeholder-slate-500 focus:border-brand-coral focus:outline-none focus:ring-1 focus:ring-brand-coral sm:text-sm" />
                  </div>
                  <button type="submit" disabled={loading} className="flex w-full justify-center items-center gap-2 rounded-lg bg-brand-coral py-2.5 px-4 text-sm font-bold text-white hover:bg-brand-coral/90 disabled:opacity-50 transition-all">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><KeyRound className="w-4 h-4" /> Reset Password</>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {sidePanel}

    </div>
  );
}
