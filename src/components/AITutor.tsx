import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, User, MinusCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AITutor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Greetings, Learner! I am your Adhyayan AI Tutor. Ready to level up your CSE knowledge today? Ask me anything!' }
  ]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          userName: currentUser?.name
        })
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Apologies, my neural circuits are a bit fuzzy. Could you try questing for that answer again?' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-brand-coral text-white shadow-lg hover:shadow-brand-coral/40 transition-all hover:scale-110 active:scale-95"
          >
            <Bot className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-brand-navy animte-pulse" />
            
            {/* Tooltip */}
            <div className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Need help with your quest?
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className={cn(
              "flex flex-col rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300",
              isMinimized ? "w-72 h-16" : "w-96 h-[500px]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-brand-coral/10 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-coral/20 rounded-xl">
                  <Bot className="w-5 h-5 text-brand-coral" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Adhyayan AI Tutor</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Ready to Help</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <MinusCircle className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {messages.map((m, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className={cn(
                        "flex gap-3 max-w-[85%]",
                        m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border",
                        m.role === 'user' ? "bg-brand-blue/10 border-brand-blue/20" : "bg-brand-coral/10 border-brand-coral/20"
                      )}>
                        {m.role === 'user' ? <User className="w-4 h-4 text-brand-blue" /> : <Sparkles className="w-4 h-4 text-brand-coral" />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed",
                        m.role === 'user' 
                          ? "bg-brand-blue text-brand-navy font-medium rounded-tr-none" 
                          : "bg-white/5 text-slate-300 border border-white/5 rounded-tl-none"
                      )}>
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex gap-3 mr-auto max-w-[85%]">
                      <div className="w-8 h-8 rounded-lg bg-brand-coral/10 border border-brand-coral/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-brand-coral animate-pulse" />
                      </div>
                      <div className="bg-white/5 text-slate-400 p-3 rounded-2xl flex gap-1 items-center rounded-tl-none">
                        <div className="w-1.5 h-1.5 bg-brand-coral/40 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-brand-coral/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-brand-coral/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/5 border-t border-white/5">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask your tutor about CSE or Lakshya..."
                      className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-coral focus:ring-1 focus:ring-brand-coral transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-coral text-white rounded-xl shadow-lg hover:shadow-brand-coral/40 disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-center text-slate-500 font-medium">
                    Powered by Adhyayan AI • Aim high with Lakshya
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
