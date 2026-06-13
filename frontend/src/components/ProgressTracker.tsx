import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Target, XCircle } from 'lucide-react';

export interface ProgressStats {
  attempted: number;
  correct: number;
  wrong: number;
  accuracy: number;
}

interface ProgressTrackerProps {
  stats: ProgressStats;
}

export const DEFAULT_PROGRESS: ProgressStats = {
  attempted: 0,
  correct: 0,
  wrong: 0,
  accuracy: 0,
};

export const PROGRESS_STORAGE_KEY = 'subnetmagic_quiz_progress';

export function readProgress(): ProgressStats {
  const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!stored) return DEFAULT_PROGRESS;

  try {
    const parsed = JSON.parse(stored) as Partial<ProgressStats>;
    const attempted = Number(parsed.attempted) || 0;
    const correct = Number(parsed.correct) || 0;
    const wrong = Number(parsed.wrong) || 0;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    return { attempted, correct, wrong, accuracy };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(stats: ProgressStats) {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(stats));
}

export function nextProgress(current: ProgressStats, isCorrect: boolean): ProgressStats {
  const attempted = current.attempted + 1;
  const correct = current.correct + (isCorrect ? 1 : 0);
  const wrong = current.wrong + (isCorrect ? 0 : 1);
  const accuracy = Math.round((correct / attempted) * 100);

  return { attempted, correct, wrong, accuracy };
}

export default function ProgressTracker({ stats }: ProgressTrackerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="card card-glow overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-500/15 p-2 text-indigo-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Subnet Progress</h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">Questions Solved: {stats.attempted}</p>
        </div>
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-right">
          <p className="text-[10px] font-bold uppercase text-indigo-300">Accuracy</p>
          <p className="font-mono text-2xl font-extrabold text-white">{stats.accuracy}%</p>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-900/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stats.accuracy}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/35 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Target className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Attempts</span>
          </div>
          <p className="mt-1 font-mono text-xl font-bold text-white">{stats.attempted}</p>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Correct</span>
          </div>
          <p className="mt-1 font-mono text-xl font-bold text-green-300">{stats.correct}</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <div className="flex items-center gap-2 text-red-400">
            <XCircle className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Wrong</span>
          </div>
          <p className="mt-1 font-mono text-xl font-bold text-red-300">{stats.wrong}</p>
        </div>
      </div>
    </motion.div>
  );
}
