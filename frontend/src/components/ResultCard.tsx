import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ResultCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
  highlight?: boolean;
}

export default function ResultCard({ label, value, icon: Icon, delay = 0, highlight = false }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.015 }}
      className={`card card-glow group relative overflow-hidden ${
        highlight
          ? 'border-indigo-500/35 bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-purple-950/20 shadow-indigo-500/5'
          : 'border-slate-800/80 bg-slate-900/40'
      }`}
    >
      {/* Dynamic hover glass reflection accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10">
        <div
          className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
            highlight
              ? 'bg-indigo-500/15 text-indigo-400 group-hover:bg-indigo-500/25 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]'
              : 'bg-slate-800/80 text-slate-400 group-hover:bg-slate-800 group-hover:text-indigo-400'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
            {label}
          </p>
          <p className={`font-bold font-mono tracking-tight truncate select-all ${
            highlight ? 'text-indigo-300 text-xl' : 'text-slate-100 text-lg'
          }`}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
