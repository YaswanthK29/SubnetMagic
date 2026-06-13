import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, Layers, Sparkles, Brain, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    icon: Sparkles,
    title: 'Magic Number Method',
    description: 'Learn the fastest way to find subnet boundaries without tedious binary conversion.',
  },
  {
    icon: Layers,
    title: 'Visual Block Boundaries',
    description: 'See subnet blocks animate into place and understand where your IP lives instantly.',
  },
  {
    icon: Calculator,
    title: 'VLSM Allocation',
    description: 'Practice variable-length subnet masking with stepwise visual allocations and logs.',
  },
  {
    icon: Brain,
    title: 'Interactive Quiz Mode',
    description: 'Test yourself with instant feedback, explanations, and saved progress.',
  },
];

export default function Home() {
  return (
    <div className="relative bg-[#0F172A] min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] mt-2 mb-4 tracking-tight">
            Everything You Need to Master Subnetting
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From basic calculations to VLSM and wildcard masks — learn the reasoning behind every network boundary design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card bg-gradient-to-r from-indigo-950/40 via-purple-950/35 to-slate-900/40 border-indigo-500/20 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Subtle light orb backgrounds */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 mb-4 tracking-wider">
              Interactive Training
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] mb-4 tracking-tight max-w-lg mx-auto">
              Ready to test your networking knowledge?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
              Jump into quiz mode and practice routing & subnet questions with detailed steps and instant explanations.
            </p>
            <Link to="/quiz" className="btn-primary inline-flex items-center gap-2">
              Start Quiz Mode
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
