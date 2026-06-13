import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, Activity, CheckCircle } from 'lucide-react';
import { API_CONNECTION_ERROR, calculateWildcard, type WildcardResult } from '../services/api';
import ResultCard from '../components/ResultCard';
import StepTimeline from '../components/StepTimeline';
import LoadingAnimation from '../components/LoadingAnimation';

export default function WildcardPage() {
  const [mask, setMask] = useState('255.255.255.224');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maskError, setMaskError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [result, setResult] = useState<WildcardResult | null>(null);

  const validateMask = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return 'Subnet mask is required';
    const regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!regex.test(trimmed)) {
      return 'Invalid subnet mask format (e.g. 255.255.255.0)';
    }
    return '';
  };

  const handleMaskChange = (val: string) => {
    setMask(val);
    if (maskError) setMaskError(validateMask(val));
  };

  const handleCalculate = async () => {
    setError('');
    const mErr = validateMask(mask);
    setMaskError(mErr);

    if (mErr) return;

    setLoading(true);
    setResult(null);
    setShowSuccess(false);

    try {
      const { data } = await calculateWildcard(mask.trim());
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
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight">
            Wildcard Mask Calculator
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Convert regular subnet masks to their wildcard representations, critical for Cisco ACL access lists and OSPF configuration.
          </p>
        </motion.div>

        {/* Input Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card max-w-2xl mx-auto relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
          
          <div className="space-y-4">
            <div>
              <label htmlFor="mask" className="block text-sm font-semibold text-slate-300 mb-2">
                Subnet Mask
              </label>
              <input
                id="mask"
                type="text"
                value={mask}
                onChange={(e) => handleMaskChange(e.target.value)}
                placeholder="255.255.255.224"
                className={`input-field ${maskError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {maskError && (
                <p className="text-xs text-red-400 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {maskError}
                </p>
              )}
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleCalculate}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 transition-all duration-300 ${
                  showSuccess ? 'btn-success' : 'btn-primary'
                }`}
              >
                {loading ? (
                  <>
                    <Activity className="w-5 h-5 animate-spin" />
                    Calculating wildcard inversion...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Inverted ✓
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Calculate Wildcard Mask
                  </>
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

        {loading && <LoadingAnimation message="Calculating wildcard mask..." />}

        {/* Empty State Card */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center py-14 max-w-2xl mx-auto border-dashed border-slate-800 bg-slate-900/10"
          >
            <div className="inline-flex p-4 rounded-2xl bg-indigo-500/5 text-indigo-400/80 mb-4 border border-indigo-500/10">
              <Shield className="w-8 h-8 opacity-80" />
            </div>
            <h3 className="text-lg font-bold text-slate-300">Enter subnet mask to calculate wildcard inversion</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Wildcard masks specify which bits of an IP address to match in routing configuration. It is the bitwise NOT operation of a standard mask.
            </p>
          </motion.div>
        )}

        {/* Results Metrics */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ResultCard label="Input Subnet Mask" value={result.subnet_mask} icon={Shield} />
              <ResultCard label="Output Wildcard Mask" value={result.wildcard} icon={Shield} highlight />
            </div>

            <StepTimeline steps={result.steps} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
