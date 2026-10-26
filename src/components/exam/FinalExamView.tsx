import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  Download,
  Printer,
  Sparkles,
  Filter,
  Layers,
  Compass,
  HelpCircle,
  Check,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  PieChart,
  Scale,
  Brain,
  Users,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { examQuestions } from '../../data/quizData';
import { QuizQuestion, Category } from '../../types';

interface PillarConfig {
  id: string;
  name: { en: string; fr: string; zh: string };
  categories: Category[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const EXAM_PILLARS: PillarConfig[] = [
  {
    id: 'finance',
    name: { en: 'Finance & Valuation', fr: 'Finance & Évaluation', zh: '金融逻辑与估值精算法' },
    categories: ['economics', 'funding'],
    icon: TrendingUp,
    color: '#3B82F6',
  },
  {
    id: 'captable',
    name: { en: 'Cap Table & SAFEs', fr: 'Table de Cap & SAFEs', zh: '股权架构与可转债换算' },
    categories: ['captable', 'convertibles'],
    icon: PieChart,
    color: '#F59E0B',
  },
  {
    id: 'termsheet',
    name: { en: 'Term Sheet Clauses', fr: 'Clauses Term Sheet', zh: '意向书条款与优先权' },
    categories: ['protections'],
    icon: Scale,
    color: '#10B981',
  },
  {
    id: 'governance',
    name: { en: 'Board & Legal Governance', fr: 'Gouvernance & Conseil', zh: '董事会治理与法务规范' },
    categories: ['control', 'governance'],
    icon: ShieldCheck,
    color: '#8B5CF6',
  },
  {
    id: 'psychology',
    name: { en: 'Dealmaker Psychology', fr: 'Psychologie du Deal', zh: '博弈心理与决策防坑' },
    categories: ['process'],
    icon: Brain,
    color: '#EC4899',
  },
  {
    id: 'negotiation',
    name: { en: 'Tactical Negotiation', fr: 'Négociation Stratégique', zh: '实战谈判与红线博弈' },
    categories: ['negotiation'],
    icon: Users,
    color: '#06B6D4',
  },
];

export const FinalExamView: React.FC = () => {
  const { language, progress, recordQuizScore } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentName, setStudentName] = useState('Alexandre Zen');
  const [showMatrixDrawer, setShowMatrixDrawer] = useState(false);
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [showReviewList, setShowReviewList] = useState(false);
  const [copiedCert, setCopiedCert] = useState(false);

  const totalQuestions = examQuestions.length;
  const currentQ: QuizQuestion = examQuestions[currentIndex] || examQuestions[0];
  const answeredCount = Object.keys(selectedAnswers).length;
  const answeredPercentage = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  // Jump to next unanswered question
  const handleJumpNextUnanswered = () => {
    for (let i = 0; i < totalQuestions; i++) {
      const targetIdx = (currentIndex + 1 + i) % totalQuestions;
      if (selectedAnswers[targetIdx] === undefined) {
        setCurrentIndex(targetIdx);
        return;
      }
    }
  };

  // Score Calculations
  const calculateScore = () => {
    let correct = 0;
    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const finalScore = calculateScore();
  const scorePercent = Math.round((finalScore / totalQuestions) * 100);
  const passingScore = 75;
  const isPassed = isSubmitted && scorePercent >= passingScore;

  // Pillar Stats calculation
  const pillarStats = useMemo(() => {
    return EXAM_PILLARS.map((pillar) => {
      const questionsInPillar = examQuestions
        .map((q, idx) => ({ q, idx }))
        .filter(({ q }) => pillar.categories.includes(q.category));
      
      const total = questionsInPillar.length;
      const answered = questionsInPillar.filter(({ idx }) => selectedAnswers[idx] !== undefined).length;
      const correct = questionsInPillar.filter(({ q, idx }) => selectedAnswers[idx] === q.correctIndex).length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      const progressPct = total > 0 ? Math.round((answered / total) * 100) : 0;

      return {
        ...pillar,
        total,
        answered,
        correct,
        accuracy,
        progressPct,
      };
    });
  }, [selectedAnswers]);

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    recordQuizScore('final_exam', finalScore, totalQuestions);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setShowReviewList(false);
  };

  const copyCertToClipboard = () => {
    const text = `CERTIFICATE OF VENTURE INTELLIGENCE MASTERY\nAwarded to: ${studentName}\nVenture Mind Academy Final Exam Score: ${finalScore}/${totalQuestions} (${scorePercent}%)\nStatus: ${isPassed ? 'PASSED (Summa Cum Laude)' : 'Completed'}\nCredential Verification ID: VM-${Date.now().toString(36).toUpperCase()}`;
    navigator.clipboard?.writeText(text);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2200);
  };

  // Filtered matrix items
  const matrixQuestions = useMemo(() => {
    return examQuestions.map((q, idx) => {
      const isAnswered = selectedAnswers[idx] !== undefined;
      const isCurrent = idx === currentIndex;
      return {
        idx,
        q,
        isAnswered,
        isCurrent,
      };
    }).filter((item) => {
      if (matrixFilter === 'answered') return item.isAnswered;
      if (matrixFilter === 'unanswered') return !item.isAnswered;
      return true;
    });
  }, [currentIndex, selectedAnswers, matrixFilter]);

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-mobile-nav">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-500 font-mono text-xs uppercase tracking-wider font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>
              {language === 'fr'
                ? 'Certification & Évaluation Finale'
                : language === 'zh'
                ? '结业百题大考与合伙人认证'
                : 'Executive Certification & Comprehensive Exam'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-text-primary dark:text-stone-100 mt-1">
            {language === 'fr'
              ? 'Grand Examen Venture Mind (100 Questions)'
              : language === 'zh'
              ? 'Venture Mind 创投综合结业大考 (100题)'
              : 'Venture Mind Final Academy Exam (100Q)'}
          </h1>
          <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            {language === 'fr'
              ? 'Validez l’ensemble des modules : Finance (20), Cap Table (20), Term Sheet (20), Gouvernance (15), Psychologie (15) et Négociation (10).'
              : language === 'zh'
              ? '涵盖创投全领域实战精算：从种子轮SAFE折价到清算优先权瀑布、反稀释调整、董事会否决权与博弈心理防坑。'
              : 'Comprehensive 100-question assessment across 6 core VC pillars. Score 75% or higher to earn the Venture Mind Executive Fellow Certificate.'}
          </p>
        </div>

        {/* Global Progress Indicator */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <div className="px-3.5 py-2 rounded-2xl glass-panel border-sophisticated text-right">
            <div className="text-[10px] uppercase font-mono text-stone-400">
              {isSubmitted ? (language === 'zh' ? '最终得分' : 'Final Score') : (language === 'zh' ? '答题进度' : 'Exam Progress')}
            </div>
            <div className="text-sm font-bold font-mono text-emerald-400 flex items-center justify-end space-x-1.5">
              <span>{isSubmitted ? `${finalScore} / ${totalQuestions}` : `${answeredCount} / ${totalQuestions}`}</span>
              <span className="text-xs text-amber-400">({isSubmitted ? `${scorePercent}%` : `${answeredPercentage}%`})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Progress Dashboard Bar */}
      <div className="p-5 rounded-3xl glass-panel border-sophisticated shadow-xl space-y-4">
        {/* Top Progress Track */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-stone-300 font-medium flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {isSubmitted
                  ? (language === 'zh' ? '考卷诊断完成' : 'Exam Assessment Finished')
                  : language === 'zh'
                  ? `已完成 ${answeredCount} / ${totalQuestions} 题 (${answeredPercentage}%)`
                  : `${answeredCount} of ${totalQuestions} Questions Answered (${answeredPercentage}%)`}
              </span>
            </span>
            <span className="text-amber-400 font-bold">
              {isSubmitted
                ? (isPassed ? (language === 'zh' ? '已达到通过线 (75%)' : 'Passing Threshold Met') : (language === 'zh' ? '未达及格线' : 'Below 75% Threshold'))
                : (language === 'zh' ? `剩余 ${totalQuestions - answeredCount} 题未答` : `${totalQuestions - answeredCount} Remaining`)}
            </span>
          </div>

          <div className="relative w-full h-3 bg-stone-950 rounded-full border border-stone-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 shadow-md ${
                isSubmitted
                  ? isPassed
                    ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                    : 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400'
              }`}
              style={{ width: `${Math.max(2, isSubmitted ? scorePercent : answeredPercentage)}%` }}
            />
          </div>
        </div>

        {/* 6 Core Pillars Breakdown Progress Mini-Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {pillarStats.map((pillar) => {
            const IconComp = pillar.icon;
            const displayPct = isSubmitted ? pillar.accuracy : pillar.progressPct;
            return (
              <div
                key={pillar.id}
                className="p-2.5 rounded-2xl bg-surface-muted/50 dark:bg-stone-900/60 border border-border-main/70 dark:border-stone-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${pillar.color}25`, color: pillar.color }}
                    >
                      <IconComp className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-200 truncate">
                      {pillar.name[language]}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: pillar.color }}>
                    {displayPct}%
                  </span>
                </div>

                <div className="w-full bg-stone-950 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(3, displayPct)}%`,
                      backgroundColor: pillar.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-stone-400">
                  <span>
                    {isSubmitted ? `${pillar.correct}/${pillar.total} 正确` : `${pillar.answered}/${pillar.total} 答完`}
                  </span>
                  <span>{pillar.total}Q</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Matrix Navigator Toggle & Shortcut Buttons (Only during active exam) */}
        {!isSubmitted && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-main/50 dark:border-stone-800/80">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowMatrixDrawer(!showMatrixDrawer)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  showMatrixDrawer
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-surface-muted dark:bg-stone-800 text-stone-300 hover:text-white border border-border-main dark:border-stone-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {language === 'zh'
                    ? `100题快速矩阵导航 ${showMatrixDrawer ? '▲' : '▼'}`
                    : `Question Matrix HUD ${showMatrixDrawer ? '▲' : '▼'}`}
                </span>
              </button>

              <button
                onClick={handleJumpNextUnanswered}
                disabled={answeredCount >= totalQuestions}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'zh' ? '跳到下一道未答题目' : 'Next Unanswered Q'}
                </span>
              </button>
            </div>

            <div className="text-xs font-mono text-stone-400 flex items-center space-x-2">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>{language === 'zh' ? '已作答' : 'Answered'} ({answeredCount})</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-stone-700 inline-block" />
                <span>{language === 'zh' ? '未作答' : 'Pending'} ({totalQuestions - answeredCount})</span>
              </span>
            </div>
          </div>
        )}

        {/* Expandable 100-Question Matrix Drawer */}
        {!isSubmitted && showMatrixDrawer && (
          <div className="p-4 rounded-2xl bg-surface-muted/80 dark:bg-stone-950 border border-border-main dark:border-stone-800 space-y-3 animate-in fade-in duration-200">
            {/* Filter pills */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-stone-400 font-mono text-[11px]">
                {language === 'zh' ? '矩阵筛选：' : 'Filter:'}
              </span>
              <button
                onClick={() => setMatrixFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs cursor-pointer ${
                  matrixFilter === 'all'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-stone-800/70 text-stone-400 hover:text-stone-200'
                }`}
              >
                All ({totalQuestions})
              </button>
              <button
                onClick={() => setMatrixFilter('answered')}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs cursor-pointer ${
                  matrixFilter === 'answered'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-stone-800/70 text-stone-400 hover:text-stone-200'
                }`}
              >
                Answered ({answeredCount})
              </button>
              <button
                onClick={() => setMatrixFilter('unanswered')}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs cursor-pointer ${
                  matrixFilter === 'unanswered'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-stone-800/70 text-stone-400 hover:text-stone-200'
                }`}
              >
                Pending ({totalQuestions - answeredCount})
              </button>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {matrixQuestions.map(({ idx, isAnswered, isCurrent }) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowMatrixDrawer(false);
                    }}
                    className={`h-7 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-amber-400 bg-amber-400 text-stone-950 shadow-md scale-105'
                        : isAnswered
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-surface-muted dark:bg-stone-900 text-stone-400 hover:bg-stone-800 border border-border-main dark:border-stone-800'
                    }`}
                    title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!isSubmitted ? (
        /* Active Exam Card */
        <div className="p-6 md:p-8 rounded-3xl glass-panel border-sophisticated shadow-2xl space-y-6">
          {/* Question Nav & Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-main dark:border-stone-800 pb-4 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-400/30 font-bold">
                Question {currentIndex + 1} / {totalQuestions}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-stone-800 text-stone-300 font-medium uppercase">
                {currentQ.category}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-stone-800 text-amber-400 font-medium uppercase">
                {currentQ.difficulty}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-stone-400">
              {selectedAnswers[currentIndex] !== undefined ? (
                <span className="text-emerald-400 flex items-center space-x-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'zh' ? '本题已作答' : 'Answer Recorded'}</span>
                </span>
              ) : (
                <span className="text-amber-400/80 flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{language === 'zh' ? '待选择答案' : 'Pending Selection'}</span>
                </span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary dark:text-stone-100 leading-relaxed font-heading">
              {currentQ.question[language]}
            </h2>
          </div>

          {/* 4 Selectable Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start space-x-3.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 via-indigo-500/15 to-transparent border-2 border-amber-400 text-text-primary dark:text-stone-100 font-semibold shadow-lg'
                      : 'bg-surface-muted/50 dark:bg-stone-900/60 border-border-main dark:border-stone-800 text-text-primary dark:text-stone-200 hover:border-amber-400/50 hover:bg-surface-muted/80'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-amber-400/50'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <p className="leading-relaxed flex-1 pt-0.5">{opt[language]}</p>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-border-main dark:border-stone-800 text-xs">
            <button
              onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'fr' ? 'Précédente' : language === 'zh' ? '上一题' : 'Previous Question'}</span>
            </button>

            <div className="flex items-center space-x-3">
              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((idx) => Math.min(totalQuestions - 1, idx + 1))}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
                >
                  <span>{language === 'fr' ? 'Suivante' : language === 'zh' ? '下一题' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90 text-stone-950 font-extrabold flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {language === 'fr' ? 'Soumettre l’Examen' : language === 'zh' ? '提交结业大考' : 'Submit Final Exam'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Results & Post-Exam Achievement Showcase */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Results Summary Box with Radial Metrics */}
          <div className="p-6 md:p-8 rounded-3xl glass-panel border-sophisticated shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col items-center space-y-3">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                isPassed ? 'bg-amber-400 text-stone-950 shadow-xl' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {isPassed ? <Award className="w-9 h-9" /> : <RotateCcw className="w-9 h-9" />}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary dark:text-stone-100">
                {language === 'fr'
                  ? 'Résultat Officiel de la Certification'
                  : language === 'zh'
                  ? 'Venture Mind 创投结业大考总成绩单'
                  : 'Official Venture Intelligence Exam Results'}
              </h2>

              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
                {finalScore} <span className="text-2xl text-stone-400 font-normal">/ {totalQuestions}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm font-mono">
                <span className={`px-3 py-1 rounded-full font-bold ${
                  isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40' : 'bg-rose-500/20 text-rose-400 border border-rose-400/40'
                }`}>
                  {isPassed
                    ? (scorePercent >= 90 ? 'Summa Cum Laude (90%+)' : 'Passed with Honors (75%+)')
                    : 'Candidate Review Required (<75%)'}
                </span>
                <span className="text-stone-400">• Passing Benchmark: 75/100</span>
              </div>

              <p className="text-xs sm:text-sm text-text-secondary dark:text-stone-400 max-w-xl mx-auto leading-relaxed">
                {isPassed
                  ? (language === 'zh'
                    ? '恭喜！您已展现出对创投估值精算、反稀释调整、期权池洗牌、保护性否决权以及博弈心理学的深度掌握，荣获学院终身学术认证。'
                    : 'Congratulations! You have demonstrated institutional venture acumen across valuation mathematics, protective covenants, waterfall models, and tactical negotiation psychology.')
                  : (language === 'zh'
                    ? '本次大考总分为 75 分合格。建议您重点复习下方得分较弱的模块，并通过条目精讲与模拟器重新巩固。'
                    : 'A minimum score of 75% is required to pass. Review your category breakdown below to target your knowledge gaps before retaking.')}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '重新作答全部考题' : 'Retake Full Exam'}</span>
              </button>

              <button
                onClick={() => setShowReviewList(!showReviewList)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  {showReviewList
                    ? (language === 'zh' ? '收起题目详解' : 'Hide Question Explanations')
                    : (language === 'zh' ? '查看100题题目详解与错题' : 'Review All 100 Questions & Solutions')}
                </span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review Drawer */}
          {showReviewList && (
            <div className="p-6 rounded-3xl glass-panel border-sophisticated shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border-main dark:border-stone-800 pb-3">
                <h3 className="font-bold text-sm sm:text-base font-heading text-stone-100 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {language === 'zh' ? '100道结业大考题型深度复盘与解析' : 'Comprehensive 100-Question Solutions & Analysis'}
                  </span>
                </h3>
                <span className="text-xs font-mono text-stone-400">
                  {finalScore} Correct • {totalQuestions - finalScore} Incorrect
                </span>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {examQuestions.map((q, qIdx) => {
                  const userAns = selectedAnswers[qIdx];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                        isCorrect
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : 'bg-rose-500/5 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                              isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            Q{qIdx + 1} • {isCorrect ? 'CORRECT' : 'INCORRECT'}
                          </span>
                          <span className="text-[10px] uppercase font-mono text-stone-400">
                            {q.category}
                          </span>
                        </div>
                      </div>

                      <div className="font-bold text-stone-100 text-xs sm:text-sm">
                        {q.question[language]}
                      </div>

                      {/* Options breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isUserChoice = userAns === optIdx;
                          const isRight = optIdx === q.correctIndex;
                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start space-x-2 ${
                                isRight
                                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold'
                                  : isUserChoice && !isRight
                                  ? 'bg-rose-500/20 border-rose-500/60 text-rose-200'
                                  : 'bg-stone-900/40 border-stone-800 text-stone-400'
                              }`}
                            >
                              <span className="font-mono font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                              <span className="flex-1">{opt[language]}</span>
                              {isRight && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
                              {isUserChoice && !isRight && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Pedagogical Explanation */}
                      <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 text-[11px] text-stone-300 leading-relaxed">
                        <span className="font-bold text-amber-400">
                          {language === 'zh' ? '精算法理与解析：' : 'Pedagogical Analysis: '}
                        </span>
                        {q.explanation[language]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certificate View */}
          <div className="p-8 md:p-12 rounded-3xl bg-stone-950 text-stone-100 border-4 border-amber-500/40 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-stone-800 pb-6">
              <div className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">
                VENTURE MIND ACADEMY OF VENTURE CAPITAL
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold font-heading text-stone-100 tracking-tight">
                Certificate of Venture Intelligence Mastery
              </h3>
              <p className="text-xs text-stone-400 max-w-xl mx-auto">
                Issued for demonstrated institutional mastery in Cap Table Mathematics, Term Sheet Legal Mechanics, Governance Rights & Boardroom Negotiation Psychology
              </p>
            </div>

            {/* Student Name & Customizer */}
            <div className="text-center py-4 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Awarded To
              </div>
              <div className="flex items-center justify-center">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="text-2xl md:text-3xl font-serif font-bold text-amber-200 text-center bg-transparent border-b border-amber-400/30 focus:border-amber-400 outline-hidden max-w-md"
                  placeholder="Enter Student Name"
                />
              </div>
              <div className="text-xs font-mono text-emerald-400 pt-1">
                Score: {finalScore}/100 ({scorePercent}%) • Venture IQ: {progress.ventureIQ} • Level {progress.level} Fellow
              </div>
            </div>

            {/* Verification Bar & Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-900">
              <div className="text-[10px] font-mono text-stone-400">
                CREDENTIAL ID: VM-2026-EX-{totalQuestions}Q • {new Date().toLocaleDateString()}
              </div>

              <button
                onClick={copyCertToClipboard}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                {copiedCert ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                <span>{copiedCert ? (language === 'zh' ? '已复制证书信息！' : 'Copied Credential!') : (language === 'zh' ? '导出证书凭证' : 'Export Certificate')}</span>
              </button>
            </div>

            {/* Certificate Guardrail Disclaimer */}
            <div className="pt-4 border-t border-stone-800/80 text-[10px] text-stone-300 dark:text-stone-300 text-center leading-relaxed max-w-xl mx-auto">
              Disclaimer: This certificate reflects educational mastery within the Venture Mind simulation environment and does not constitute a formal professional qualification, legal admission, or financial advisory licensure.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
