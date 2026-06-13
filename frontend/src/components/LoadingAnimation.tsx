import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingAnimationProps {
  message?: string;
}

export default function LoadingAnimation({ message = 'Calculating...' }: LoadingAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-indigo-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-spin" />
      </div>
      <p className="text-muted text-sm">{message}</p>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
