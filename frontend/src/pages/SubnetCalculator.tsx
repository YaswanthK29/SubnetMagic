import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Network,
  Radio,
  Users,
  Hash,
  Sparkles,
  AlertCircle,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { API_CONNECTION_ERROR, calculateSubnet, type SubnetResult } from '../services/api';
import ResultCard from '../components/ResultCard';
import StepTimeline from '../components/StepTimeline';
import SubnetVisualizer from '../components/SubnetVisualizer';
import LoadingAnimation from '../components/LoadingAnimation';

export default function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.5.57');
  const [cidr, setCidr] = useState('27');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ipError, setIpError] = useState('');
  const [cidrError, setCidrError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [result, setResult] = useState<SubnetResult | null>(null);

  const validateIp = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return 'IP Address is required';
    const regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!regex.test(trimmed)) {
      return 'Invalid IPv4 address format (e.g. 192.168.5.57)';
    }
    return '';
  };

  const validateCidr = (value: string) => {
    if (!value) return 'CIDR prefix is required';
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0 || num > 32) {
      return 'CIDR must be between 0 and 32';
    }
    return '';
  };

  const handleIpChange = (val: string) => {
    setIp(val);
    if (ipError) setIpError(validateIp(val));
  };

  const handleCidrChange = (val: string) => {
    setCidr(val);
    if (cidrError) setCidrError(validateCidr(val));
  };

  const handleCalculate = async () => {
    setError('');
    const ipErr = validateIp(ip);
    const cidrErr = validateCidr(cidr);
    setIpError(ipErr);
    setCidrError(cidrErr);

    if (ipErr || cidrErr) {
      return;
    }

    setLoading(true);
    setResult(null);
    setShowSuccess(false);

    try {
      const { data } = await calculateSubnet(ip.trim(), parseInt(cidr, 10));
      setResult(data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    } catch {
      setError(API_CONNECTION_ERROR);
    } finally {
      setLoading(false);
    }
  };

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
            <Calculator className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight">
            Subnet Calculator
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Enter an IP and CIDR to inspect subnet metrics with instant magic number breakdown and visual block mappings.
          </p>
        </motion.div>

        {/* Centered Calculator Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
        >
          {/* Top subtle accent gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
            <div className="sm:col-span-2 space-y-2">
              <label htmlFor="ip" className="block text-sm font-semibold text-slate-300">
                IP Address
              </label>
              <div className="relative">
                <input
                  id="ip"
                  type="text"
                  value={ip}
                  onChange={(e) => handleIpChange(e.target.value)}
                  placeholder="192.168.5.57"
                  className={`input-field ${ipError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
              </div>
              {ipError && (
                <p className="text-xs text-red-400 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {ipError}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="cidr" className="block text-sm font-semibold text-slate-300">
                CIDR Prefix
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold">/</span>
                <input
                  id="cidr"
                  type="number"
                  min={0}
                  max={32}
                  value={cidr}
                  onChange={(e) => handleCidrChange(e.target.value)}
                  placeholder="27"
                  className={`input-field pl-8 ${cidrError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
              </div>
              {cidrError && (
                <p className="text-xs text-red-400 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {cidrError}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={handleCalculate}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 transition-all duration-300 ${
                showSuccess 
                  ? 'btn-success' 
                  : 'btn-primary'
              }`}
            >
              {loading ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  Calculating subnet boundaries...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Calculated ✓
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Calculate Subnet Parameters
                </>
              )}
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-5 flex items-center gap-2.5 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Unable to calculate: {error}</span>
            </motion.div>
          )}
        </motion.div>

        {loading && <LoadingAnimation message="Calculating subnet boundaries..." />}

        {/* Empty State Card */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center py-14 max-w-2xl mx-auto border-dashed border-slate-800 bg-slate-900/10"
          >
            <div className="inline-flex p-4 rounded-2xl bg-indigo-500/5 text-indigo-400/80 mb-4 border border-indigo-500/10">
              <Network className="w-8 h-8 opacity-80" />
            </div>
            <h3 className="text-lg font-bold text-slate-300">Enter IP and CIDR to visualize subnetting</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Unlock a visual mapping of subnet blocks, magic number formulas, and detailed address metrics for your configuration.
            </p>
          </motion.div>
        )}

        {/* Results Container */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ResultCard label="Subnet Mask" value={result.subnet_mask} icon={Network} delay={0} />
              <ResultCard label="Magic Number" value={result.magic_number} icon={Sparkles} delay={0.05} highlight />
              <ResultCard label="Network ID" value={result.network_id} icon={Hash} delay={0.1} highlight />
              <ResultCard label="Broadcast Address" value={result.broadcast} icon={Radio} delay={0.15} />
              <ResultCard label="Host Count" value={result.host_count.toLocaleString()} icon={Users} delay={0.2} />
              <ResultCard label="Usable Range" value={result.usable_range} icon={Calculator} delay={0.25} />
            </div>

            {/* Subnet Blocks Visualizer */}
            <SubnetVisualizer
              blocks={result.blocks}
              highlightOctet={result.highlight_octet}
              ip={result.ip}
              networkId={result.network_id}
              broadcast={result.broadcast}
              usableRange={result.usable_range}
              magicNumber={result.magic_number}
            />

            {/* Steps Vertical Timeline */}
            <StepTimeline steps={result.steps} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
