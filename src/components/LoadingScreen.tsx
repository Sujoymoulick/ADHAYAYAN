import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-brand-navy flex flex-col items-center justify-center z-[9999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Animated Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 -m-4 rounded-full border-2 border-brand-blue/20 border-t-brand-blue"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 -m-8 rounded-full border-2 border-brand-coral/10 border-b-brand-coral/40"
        />
        
        {/* Logo Icon */}
        <div className="w-20 h-20 bg-linear-to-tr from-brand-blue to-brand-coral rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
          <BrainCircuit className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <h2 className="text-xl font-display font-bold text-white mb-2">Adhyayan</h2>
        <div className="flex items-center gap-1.5 justify-center">
          <span className="text-slate-400 text-sm">Initializing your quest</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-brand-blue"
          />
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="w-1 h-1 rounded-full bg-brand-blue"
          />
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="w-1 h-1 rounded-full bg-brand-blue"
          />
        </div>
      </motion.div>
    </div>
  );
}
