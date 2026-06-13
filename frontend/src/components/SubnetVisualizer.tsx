import { motion } from 'framer-motion';
import type { SubnetBlock } from '../services/api';

interface SubnetVisualizerProps {
  blocks: SubnetBlock[];
  highlightOctet: number;
  ip: string;
  networkId: string;
  broadcast: string;
  usableRange: string;
  magicNumber: number;
}

export default function SubnetVisualizer({
  blocks,
  highlightOctet,
  ip,
  networkId,
  broadcast,
  usableRange,
  magicNumber,
}: SubnetVisualizerProps) {
  if (!blocks.length) return null;

  const ipParts = ip.split('.');
  const prefix = ipParts.slice(0, highlightOctet).join('.');

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Subnet Block Visualizer</h3>
          <p className="text-xs text-slate-400 mt-1">
            Visual boundary mapping for Octet {highlightOctet + 1}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Magic {magicNumber}
          </span>
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Octet {highlightOctet + 1}
          </span>
        </div>
      </div>

      {/* Subnet Blocks Container */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 scrollbar-premium">
        <motion.div 
          layout
          className="flex gap-3 w-full"
        >
          {blocks.map((block, index) => {
            const isActive = block.is_active;
            return (
              <motion.div
                key={block.label}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 25,
                  delay: Math.min(index * 0.02, 0.3) 
                }}
                whileHover={{ 
                  scale: isActive ? 1.02 : 1.05, 
                  y: -3,
                  boxShadow: isActive 
                    ? "0 10px 25px -5px rgba(99, 102, 241, 0.2)" 
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
                }}
                className={`relative flex-shrink-0 rounded-2xl border p-5 text-center transition-colors cursor-pointer select-none ${
                  isActive
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-slate-900/90 shadow-xl shadow-indigo-500/10 min-w-[230px]'
                    : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 hover:bg-slate-800/50 min-w-[130px]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-subnet-glow"
                    className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/40 pointer-events-none"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                
                <p
                  className={`text-sm font-bold font-mono tracking-tight transition-colors ${
                    isActive ? 'text-indigo-300' : 'text-slate-400'
                  }`}
                >
                  {isActive ? `✨ ${block.label} ACTIVE ✨` : block.label}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  {block.start} - {block.end}
                </p>
                
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="mt-4 space-y-2 rounded-xl border border-indigo-500/20 bg-slate-950/50 p-3 text-left text-[11px] font-mono leading-tight"
                  >
                    <div>
                      <span className="text-indigo-400 font-semibold text-[9px] uppercase tracking-wider block">Network ID</span>
                      <p className="text-slate-200 font-bold select-all">{networkId}</p>
                    </div>
                    <div className="border-t border-slate-800/60 pt-1.5 mt-1.5">
                      <span className="text-blue-400 font-semibold text-[9px] uppercase tracking-wider block">Usable Range</span>
                      <p className="text-slate-300 select-all text-[10px]">{usableRange}</p>
                    </div>
                    <div className="border-t border-slate-800/60 pt-1.5 mt-1.5">
                      <span className="text-purple-400 font-semibold text-[9px] uppercase tracking-wider block">Broadcast ID</span>
                      <p className="text-slate-200 font-bold select-all">{broadcast}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/20 rounded-xl p-3.5 border border-slate-800/60">
          <span className="text-xs font-semibold text-slate-400">Target IP Address</span>
          <p className="font-mono text-base font-bold text-white mt-1 select-all">{ip}</p>
        </div>
        <div className="bg-indigo-500/5 rounded-xl p-3.5 border border-indigo-500/15">
          <span className="text-xs font-semibold text-indigo-400">Calculated Network ID</span>
          <p className="font-mono text-base font-bold text-indigo-300 mt-1 select-all">{networkId}</p>
        </div>
        <div className="bg-purple-500/5 rounded-xl p-3.5 border border-purple-500/15">
          <span className="text-xs font-semibold text-purple-400">Broadcast Address</span>
          <p className="font-mono text-base font-bold text-purple-300 mt-1 select-all">{broadcast}</p>
        </div>
        <div className="bg-blue-500/5 rounded-xl p-3.5 border border-blue-500/15">
          <span className="text-xs font-semibold text-blue-300">Usable Hosts</span>
          <p className="font-mono text-sm font-bold text-blue-200 mt-1 select-all">{usableRange}</p>
        </div>
      </div>

      {prefix && (
        <p className="text-xs text-slate-500 mt-4 leading-relaxed font-sans">
          * Displaying boundary segments calculated for the{' '}
          <span className="font-mono font-semibold text-slate-400">{prefix}.x</span> subnet space.
        </p>
      )}
    </div>
  );
}
