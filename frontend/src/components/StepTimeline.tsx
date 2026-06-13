import { motion } from 'framer-motion';

interface StepTimelineProps {
  steps: string[];
}

function parseStepText(text: string) {
  let clean = text.replace(/^Step \d+:\s*/i, '');

  if (clean.includes('→')) {
    const parts = clean.split('→');
    const label = parts[0].trim();
    const val = parts[1].trim().replace(/\.$/, '');

    let labelColor = 'text-slate-300';
    let badgeStyle = 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300';

    if (label.toLowerCase().includes('mask')) {
      labelColor = 'text-indigo-200';
      badgeStyle = 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300';
    } else if (label.toLowerCase().includes('network')) {
      labelColor = 'text-blue-200';
      badgeStyle = 'bg-blue-500/10 border-blue-500/20 text-blue-300';
    } else if (label.toLowerCase().includes('broadcast')) {
      labelColor = 'text-purple-200';
      badgeStyle = 'bg-purple-500/10 border-purple-500/20 text-purple-300';
    } else if (label.toLowerCase().includes('range') || label.toLowerCase().includes('host')) {
      labelColor = 'text-cyan-200';
      badgeStyle = 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300';
    }

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
        <span className={`${labelColor} font-semibold text-sm leading-normal`}>{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold font-mono">→</span>
          <span className={`px-3 py-1 rounded-xl border font-mono font-bold select-all text-xs tracking-tight ${badgeStyle}`}>
            {val}
          </span>
        </div>
      </div>
    );
  }

  if (clean.includes(':') && clean.includes('=')) {
    const mainParts = clean.split(':');
    const label = mainParts[0].trim();
    const formula = mainParts[1].trim().replace(/\.$/, '');

    return (
      <div className="space-y-2">
        <span className="text-slate-300 font-semibold text-sm block leading-normal">{label}:</span>
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-slate-950/40 border border-slate-800/80 font-mono text-xs text-indigo-300 select-all tracking-tight">
          {formula}
        </span>
      </div>
    );
  }

  return <span className="text-slate-300 font-medium text-sm leading-relaxed block">{clean}</span>;
}

export default function StepTimeline({ steps }: StepTimelineProps) {
  if (!steps.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="card relative overflow-hidden"
    >
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
        <h3 className="text-xl font-bold text-white tracking-tight">Calculation Breakdown</h3>
      </div>

      <div className="relative pl-1 sm:pl-4 space-y-0">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex gap-5 pb-8 last:pb-0"
          >
            {/* Timeline Vertical Connector Track with Sequential Scale Transition */}
            {index < steps.length - 1 && (
              <motion.span 
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: index * 0.18 + 0.15, ease: "easeInOut" }}
                className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/60 to-purple-500/20 origin-top pointer-events-none"
              />
            )}

            {/* Glowing Step Checkpoint Node */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: index * 0.18 }}
              className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
            >
              <span className="text-xs font-bold text-white font-mono">{index + 1}</span>
              <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping opacity-30 pointer-events-none" />
            </motion.div>

            {/* Step Content Card */}
            <motion.div 
              initial={{ opacity: 0, x: 12, y: 5 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.18 + 0.08, ease: "easeOut" }}
              className="flex-1 bg-slate-900/30 rounded-2xl p-4 border border-slate-800/80 hover:border-slate-700/60 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {parseStepText(step)}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
