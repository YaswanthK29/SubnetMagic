import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Network,
  Radio,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import { API_CONNECTION_ERROR, getQuizQuestion, type QuizQuestion } from '../services/api';
import LoadingAnimation from '../components/LoadingAnimation';
import ProgressTracker, {
  nextProgress,
  readProgress,
  saveProgress,
  type ProgressStats,
} from '../components/ProgressTracker';

const totalQuestions = 10;

export default function QuizPage() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [questionNum, setQuestionNum] = useState(1);
  const [progress, setProgress] = useState<ProgressStats>(() => readProgress());

  const isCorrect = submitted && selectedAnswer === question?.answer;
  const isComplete = !question && !loading && score.total > 0;
  const roundProgress = Math.min(((questionNum - 1) / totalQuestions) * 100, 100);

  const explanationRows = useMemo(() => {
    if (!question) return [];

    return [
      { label: 'Magic Number', value: question.explanation.magic_number, icon: Sparkles },
      { label: 'Network ID', value: question.explanation.network_id, icon: Network },
      { label: 'Broadcast', value: question.explanation.broadcast, icon: Radio },
      { label: 'Usable Range', value: question.explanation.usable_range, icon: Target },
    ];
  }, [question]);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    setError('');
    setSelectedAnswer('');
    setSubmitted(false);

    try {
      const { data } = await getQuizQuestion();
      setQuestion(data);
    } catch {
      setError(API_CONNECTION_ERROR);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  const handleSubmit = () => {
    if (!question || !selectedAnswer || submitted) return;

    const correct = selectedAnswer === question.answer;
    setSubmitted(true);
    setScore((current) => ({
      correct: current.correct + (correct ? 1 : 0),
      total: current.total + 1,
    }));
    setProgress((current) => {
      const updated = nextProgress(current, correct);
      saveProgress(updated);
      return updated;
    });
  };

  const handleNext = () => {
    if (questionNum >= totalQuestions) {
      setQuestion(null);
      return;
    }

    setQuestionNum((current) => current + 1);
    loadQuestion();
  };

  const handleRestart = () => {
    setScore({ correct: 0, total: 0 });
    setQuestionNum(1);
    loadQuestion();
  };

  return (
    <div className="bg-[#0F172A] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
            <Brain className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight">
            Subnetting Practice Quiz
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Practice CCNA subnet questions with answer review, magic numbers, and network boundary logic.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="space-y-6">
            {!isComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 space-y-2.5"
              >
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Question {questionNum} of {totalQuestions}</span>
                  <span>Round Score: {score.correct}/{score.total}</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${roundProgress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </motion.div>
            )}

            {error && (
              <div className="flex items-center gap-2.5 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-4 shadow-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading && <LoadingAnimation message="Loading verified CCNA subnet question..." />}

            {isComplete && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card text-center relative overflow-hidden py-10"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
                <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] mb-2 tracking-tight">
                  Practice Round Complete
                </h2>
                <p className="text-5xl font-extrabold gradient-text tracking-tight mb-4">
                  {score.correct} / {score.total}
                </p>
                <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                  Review your progress card and run another round to keep sharpening subnet boundary recognition.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleRestart}
                  className="btn-primary inline-flex items-center gap-2.5 px-8 py-3.5"
                >
                  <RotateCcw className="w-5 h-5" />
                  Start New Round
                </motion.button>
              </motion.div>
            )}

            {question && !loading && !isComplete && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  className="card relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <span className="inline-flex self-start px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/10">
                      {question.difficulty}
                    </span>
                    <span className="text-xs font-mono text-slate-500">ID: {question.id}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-7">
                    {question.question}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option, index) => {
                      const isSelected = selectedAnswer === option;
                      const isAnswer = question.answer === option;
                      const showCorrect = submitted && isAnswer;
                      const showWrong = submitted && isSelected && !isAnswer;

                      return (
                        <motion.button
                          key={option}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          whileHover={!submitted ? { y: -2, scale: 1.01 } : undefined}
                          whileTap={!submitted ? { scale: 0.99 } : undefined}
                          type="button"
                          onClick={() => !submitted && setSelectedAnswer(option)}
                          disabled={submitted}
                          className={`min-h-[72px] rounded-2xl border p-4 text-left transition-all ${
                            showCorrect
                              ? 'border-green-500 bg-green-500/10 text-green-200 shadow-lg shadow-green-500/5'
                              : showWrong
                                ? 'border-red-500 bg-red-500/10 text-red-200 shadow-lg shadow-red-500/5'
                                : isSelected
                                  ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-lg shadow-indigo-500/10'
                                  : 'border-slate-800/80 bg-slate-900/40 text-slate-200 hover:border-indigo-500/40 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950/45 font-mono text-xs font-bold text-slate-300">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="font-mono text-sm font-bold break-words">{option}</span>
                            {showCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-green-400 flex-shrink-0" />}
                            {showWrong && <XCircle className="ml-auto h-5 w-5 text-red-400 flex-shrink-0" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={submitted ? handleNext : handleSubmit}
                      disabled={!selectedAnswer}
                      className="btn-primary flex-1 inline-flex items-center justify-center gap-2.5 py-3.5"
                    >
                      {submitted ? (
                        <>
                          {questionNum >= totalQuestions ? 'Show Final Metrics' : 'Next Question'}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          <Activity className="w-5 h-5" />
                          Submit Answer
                        </>
                      )}
                    </motion.button>
                  </div>

                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-7 space-y-5"
                    >
                      <div
                        className={`rounded-2xl border p-5 ${
                          isCorrect
                            ? 'border-green-500/20 bg-green-500/10 text-green-300'
                            : 'border-red-500/20 bg-red-500/10 text-red-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                          <p className="font-extrabold">{isCorrect ? 'Correct Answer!' : 'Wrong Answer'}</p>
                        </div>
                        {!isCorrect && (
                          <p className="mt-2 text-sm text-slate-300">
                            Correct answer:{' '}
                            <span className="font-mono font-bold text-white bg-slate-950/45 px-2.5 py-1 rounded-lg border border-slate-800 ml-1 select-all">{question.answer}</span>
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {explanationRows.map(({ label, value, icon: Icon }) => (
                          <div key={label} className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-4 hover:border-slate-700/60 transition-colors">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Icon className="h-4 w-4 text-indigo-400" />
                              <span className="text-[10px] font-extrabold uppercase tracking-wider">{label}</span>
                            </div>
                            <p className="mt-2 font-mono text-sm font-bold text-slate-200 break-words select-all">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                          Magic number logic
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                          {question.explanation.note ||
                            `Use a block size of ${question.explanation.magic_number}, identify the network boundary, then use the final address in that block as the broadcast address.`}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <ProgressTracker stats={progress} />
        </div>
      </div>
    </div>
  );
}
