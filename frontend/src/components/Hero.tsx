import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, BookOpen } from 'lucide-react';
import NetworkBackground from './NetworkBackground';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#0F172A]">
      <NetworkBackground />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-6"
        >
          <BookOpen className="w-4 h-4" />
          CCNA Subnetting Learning Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#f8fafc] leading-tight mb-6 tracking-tight max-w-4xl"
        >
          Master Subnetting <span className="gradient-text font-extrabold">the Smart Way</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl text-[#94a3b8] leading-relaxed mb-10 max-w-2xl"
        >
          Stepwise explanations, magic number method, and visual subnet boundaries. Real networking understanding, made intuitive.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/quiz" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4">
            Start Learning
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/calculator" className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4">
            <Calculator className="w-5 h-5" />
            Try Calculator
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
