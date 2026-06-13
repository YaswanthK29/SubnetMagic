import { Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-700/50 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold gradient-text">SubnetMagic</span>
          </div>
          <p className="text-sm text-muted text-center">
            CCNA subnetting made visual — magic number method, VLSM, and practice quizzes.
          </p>
          <div className="flex gap-4 text-sm text-muted">
            <Link to="/calculator" className="hover:text-indigo-400 transition-colors">
              Calculator
            </Link>
            <Link to="/quiz" className="hover:text-indigo-400 transition-colors">
              Quiz
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-muted/60 mt-6">
          © {new Date().getFullYear()} SubnetMagic. Built for learners.
        </p>
      </div>
    </footer>
  );
}
