import { motion } from 'framer-motion';

const nodes = [
  { cx: 10, cy: 20, delay: 0 },
  { cx: 25, cy: 60, delay: 0.5 },
  { cx: 45, cy: 30, delay: 1 },
  { cx: 65, cy: 70, delay: 0.3 },
  { cx: 80, cy: 25, delay: 0.8 },
  { cx: 90, cy: 55, delay: 1.2 },
  { cx: 55, cy: 85, delay: 0.6 },
  { cx: 15, cy: 80, delay: 1.5 },
];

const connections = [
  [0, 2], [2, 4], [4, 5], [1, 3], [3, 5], [2, 6], [0, 1], [6, 7],
];

export default function NetworkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-purple-950/10" />

      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="url(#lineGrad)"
            strokeWidth="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
          />
        ))}
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-indigo-500/60 shadow-lg shadow-indigo-500/40"
          style={{ left: `${node.cx}%`, top: `${node.cy}%` }}
          animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: node.delay }}
        />
      ))}

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" />
    </div>
  );
}
