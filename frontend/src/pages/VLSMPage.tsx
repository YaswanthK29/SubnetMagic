import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Trash2, AlertCircle, Sparkles, CheckCircle, Activity } from 'lucide-react';
import { API_CONNECTION_ERROR, calculateVLSM, type VLSMResult } from '../services/api';
import StepTimeline from '../components/StepTimeline';
import LoadingAnimation from '../components/LoadingAnimation';

export default function VLSMPage() {
  const [network, setNetwork] = useState('192.168.1.0/24');
  const [hosts, setHosts] = useState(['110', '45', '29', '8']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [result, setResult] = useState<VLSMResult | null>(null);

  const updateHost = (index: number, value: string) => {
    const updated = [...hosts];
    updated[index] = value;
    setHosts(updated);
  };

  const addHost = () => setHosts([...hosts, '']);
  const removeHost = (index: number) => setHosts(hosts.filter((_, i) => i !== index));

  const validateNetwork = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return 'Base Network / CIDR is required';
    const parts = trimmed.split('/');
    if (parts.length !== 2) {
      return 'Format must be IP/CIDR (e.g. 192.168.1.0/24)';
    }
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(parts[0])) {
      return 'Invalid base IP address';
    }
    const cidrNum = parseInt(parts[1], 10);
    if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      return 'CIDR must be between 0 and 32';
    }
    return '';
  };

  const handleNetworkChange = (val: string) => {
    setNetwork(val);
    if (networkError) setNetworkError(validateNetwork(val));
  };

  const handleCalculate = async () => {
    setError('');
    const netErr = validateNetwork(network);
    setNetworkError(netErr);

    if (netErr) return;

    const hostNums = hosts.map((h) => parseInt(h, 10)).filter((n) => !isNaN(n) && n > 0);
    if (!hostNums.length) {
      setError('Please enter at least one valid host count requirement.');
      return;
    }

    setLoading(true);
    setResult(null);
    setShowSuccess(false);

    try {
      const { data } = await calculateVLSM(network.trim(), hostNums);
      setResult(data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || API_CONNECTION_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    'from-blue-500/10 via-blue-500/5 to-slate-900 border-blue-500/20 shadow-blue-500/5',
    'from-indigo-500/10 via-indigo-500/5 to-slate-900 border-indigo-500/20 shadow-indigo-500/5',
    'from-purple-500/10 via-purple-500/5 to-slate-900 border-purple-500/20 shadow-purple-500/5',
    'from-cyan-500/10 via-cyan-500/5 to-slate-900 border-cyan-500/20 shadow-cyan-500/5',
  ];

  return (
    <div className="bg-[#0F172A] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
            <Layers className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight">
            VLSM Allocator
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Configure Variable-Length Subnet Masking to divide IP ranges efficiently across multiple subnet sizes.
          </p>
        </motion.div>

        {/* Input Controls Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
          
          <div className="space-y-6">
            <div>
              <label htmlFor="network" className="block text-sm font-semibold text-slate-300 mb-2">
                Base Network / CIDR Block
              </label>
              <input
                id="network"
                type="text"
                value={network}
                onChange={(e) => handleNetworkChange(e.target.value)}
                placeholder="192.168.1.0/24"
                className={`input-field ${networkError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {networkError && (
                <p className="text-xs text-red-400 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {networkError}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300">
                Required Subnets & Host Counts
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence initial={false}>
                  {hosts.map((host, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-2 items-center bg-[#0F172A]/40 p-3 rounded-xl border border-slate-800/80 transition-colors focus-within:border-indigo-500/40"
                    >
                      <span className="text-xs font-bold font-mono text-slate-500 min-w-[3rem]">
                        Subnet {index + 1}
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={host}
                        onChange={(e) => updateHost(index, e.target.value)}
                        placeholder="Hosts needed"
                        className="input-field py-2 flex-1 border-none focus:ring-0 focus:shadow-none bg-transparent"
                      />
                      {hosts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHost(index)}
                          className="p-2.5 rounded-lg border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-200"
                          aria-label="Remove host requirement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={addHost}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-250" />
                  Add subnet requirement
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleCalculate}
                disabled={loading}
                className={`w-full sm:w-auto flex items-center justify-center gap-2.5 py-3 transition-all duration-300 ${
                  showSuccess ? 'btn-success px-8' : 'btn-primary'
                }`}
              >
                {loading ? (
                  <>
                    <Activity className="w-5 h-5 animate-spin" />
                    Allocating Address Spaces...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Allocated ✓
                  </>
                ) : (
                  'Calculate VLSM Allocations'
                )}
              </motion.button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-5 flex items-center gap-2.5 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </motion.div>

        {loading && <LoadingAnimation message="Allocating addresses from largest to smallest requirements..." />}

        {/* Empty State Card */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center py-14 max-w-2xl mx-auto border-dashed border-slate-800 bg-slate-900/10"
          >
            <div className="inline-flex p-4 rounded-2xl bg-indigo-500/5 text-indigo-400/80 mb-4 border border-indigo-500/10">
              <Layers className="w-8 h-8 opacity-80" />
            </div>
            <h3 className="text-lg font-bold text-slate-300">Enter subnet sizes to calculate VLSM distribution</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Define a base IP prefix block and add requirements for each subnet. VLSM allocates larger scopes first to prevent CIDR overlapping.
            </p>
          </motion.div>
        )}

        {/* Allocation Results */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">Allocation Plan</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {result.allocations.map((alloc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`card bg-gradient-to-r border ${colors[index % colors.length]}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 bg-[#0F172A]/70 px-2.5 py-1 rounded-full border border-slate-800">
                          Segment #{index + 1}
                        </span>
                        <h3 className="text-2xl font-extrabold font-mono text-white mt-2 select-all">
                          {alloc.network}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1.5">
                          Required: <strong className="text-slate-300">{alloc.hosts_required}</strong> hosts · Allocating space for <strong className="text-indigo-400">{alloc.usable_hosts}</strong> hosts
                        </p>
                      </div>

                      <div className="text-sm space-y-1.5 bg-[#0F172A]/40 p-3 rounded-xl border border-slate-800/80 min-w-[240px]">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-semibold text-xs">Subnet Mask:</span>
                          <span className="font-mono text-slate-300 select-all text-xs">{alloc.subnet_mask}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-800/60 pt-1.5 mt-1.5">
                          <span className="text-slate-500 font-semibold text-xs">Usable Range:</span>
                          <span className="font-mono text-indigo-400 select-all text-xs">{alloc.usable_range}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800/40 grid grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="bg-[#0F172A]/40 p-2.5 rounded-lg border border-slate-800/60">
                        <span className="text-slate-500 block">Network Address</span>
                        <span className="font-mono text-slate-300 block mt-0.5 select-all">{alloc.network_id}</span>
                      </div>
                      <div className="bg-[#0F172A]/40 p-2.5 rounded-lg border border-slate-800/60">
                        <span className="text-slate-500 block">Broadcast Address</span>
                        <span className="font-mono text-slate-300 block mt-0.5 select-all">{alloc.broadcast}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Steps Timeline */}
            <StepTimeline steps={result.steps} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
