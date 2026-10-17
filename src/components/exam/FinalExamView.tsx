import React, { useState } from 'react';
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { examQuestions } from '../../data/quizData';
import { QuizQuestion } from '../../types';

export const FinalExamView: React.FC = () => {
  const { language, progress, recordQuizScore } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentName, setStudentName] = useState('Alexandre Zen');

  const currentQ: QuizQuestion = examQuestions[currentIndex] || examQuestions[0];
  const totalQuestions = examQuestions.length;

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

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
  const passingScore = 75;
  const isPassed = isSubmitted && (finalScore / totalQuestions) * 100 >= passingScore;

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    recordQuizScore('final_exam', finalScore, totalQuestions);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto pb-mobile-nav">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>
            {language === 'fr'
              ? 'Certification & Évaluation Finale'
              : language === 'zh'
              ? '结业百题大考与学院认证'
              : 'Academy Certification & Comprehensive Exam'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-text-primary dark:text-stone-100 mt-1">
          {language === 'fr'
            ? 'Grand Examen Venture Mind (100 Questions)'
            : language === 'zh'
            ? 'Venture Mind 创投结业大考 (100题)'
            : 'Venture Mind Final Academy Exam (100Q)'}
        </h1>
        <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
          {language === 'fr'
            ? 'Validez l’ensemble des modules : Finance (20), Cap Table (20), Term Sheet (20), Gouvernance (15), Psychologie (15) et Négociation (10).'
            : language === 'zh'
            ? '全面检验创投认知：金融与融资(20题)、股权表与估值(20题)、意向书经济(20题)、治理控制(15题)、博弈心理(15题)与实战谈判(10题)。'
            : 'Comprehensive assessment across 6 core pillars. Score 75% or higher to earn the Venture Mind Executive Fellow Certificate.'}
        </p>
      </div>

      {!isSubmitted ? (
        /* Active Exam Card */
        <div className="p-6 md:p-8 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-md space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-border-main dark:border-stone-800 pb-4 text-xs font-mono">
            <span className="text-text-secondary dark:text-stone-400">
              Question {currentIndex + 1} / {totalQuestions}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
              {currentQ.category} • {currentQ.difficulty}
            </span>
            <span className="text-text-secondary dark:text-stone-400">
              {Object.keys(selectedAnswers).length} answered
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-text-primary dark:text-stone-100 leading-relaxed font-heading">
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
                  className={`p-4 rounded-xl border text-xs md:text-sm cursor-pointer transition-all flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-600 text-indigo-950 dark:text-indigo-200 font-medium shadow-xs'
                      : 'bg-surface-muted dark:bg-stone-800/60 border-border-main dark:border-stone-700 text-text-primary dark:text-stone-200 hover:border-indigo-500/40'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-stone-200 dark:bg-stone-700 text-text-secondary'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <p className="leading-relaxed flex-1">{opt[language]}</p>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-border-main dark:border-stone-800 text-xs">
            <button
              onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-surface-muted dark:bg-stone-800 text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed font-medium flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'fr' ? 'Précédente' : language === 'zh' ? '上一题' : 'Previous'}</span>
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex((idx) => Math.min(totalQuestions - 1, idx + 1))}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center space-x-1 shadow-xs"
              >
                <span>{language === 'fr' ? 'Suivante' : language === 'zh' ? '下一题' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-2 shadow-md shadow-emerald-900/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'fr' ? 'Soumettre l’Examen' : language === 'zh' ? '提交考卷' : 'Submit Final Exam'}
                </span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Certificate Showcase */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Results Summary Box */}
          <div className="p-6 md:p-8 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-md text-center space-y-4">
            <Award className="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto" />
            <h2 className="text-2xl font-bold font-heading text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? 'Résultat Officiel de l’Examen'
                : language === 'zh'
                ? '结业大考成绩单'
                : 'Official Academy Exam Results'}
            </h2>
            <div className="text-3xl font-bold font-mono text-emerald-600">
              {finalScore} / {totalQuestions}{' '}
              <span className="text-lg text-text-secondary font-normal">
                ({Math.round((finalScore / totalQuestions) * 100)}%)
              </span>
            </div>

            <p className="text-xs text-text-secondary dark:text-stone-400 max-w-lg mx-auto">
              {isPassed
                ? 'Congratulations! You have demonstrated institutional venture acumen across valuation math, legal governance, and tactical negotiation.'
                : 'You have completed the assessment. Review the answer explanations below to strengthen your grasp of liquidation waterfalls and control rights.'}
            </p>

            <button
              onClick={handleRetake}
              className="px-4 py-2 rounded-xl bg-surface-muted dark:bg-stone-800 text-text-secondary hover:text-text-primary text-xs font-mono font-medium"
            >
              Retake Exam
            </button>
          </div>

          {/* Certificate View (If Passed or Completed) */}
          <div className="p-8 md:p-12 rounded-3xl bg-stone-950 text-stone-100 border-4 border-amber-600/40 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-stone-800 pb-6">
              <div className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">
                VENTURE MIND ACADEMY OF VENTURE CAPITAL
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold font-heading text-stone-100 tracking-tight">
                Certificate of Venture Intelligence Mastery
              </h3>
              <p className="text-xs text-stone-400">
                Issued for proven mastery in Cap Table Architecture, Term Sheet Legal Mechanics & Negotiation Psychology
              </p>
            </div>

            {/* Student Name */}
            <div className="text-center py-4 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Awarded To
              </div>
              <div className="text-2xl md:text-3xl font-serif font-bold text-amber-200">
                {studentName}
              </div>
              <div className="text-xs font-mono text-emerald-400">
                Venture IQ: {progress.ventureIQ} • Level 4 Principal Fellow
              </div>
            </div>

            {/* Certificate Guardrail Disclaimer */}
            <div className="pt-6 border-t border-stone-800/80 text-[10px] text-stone-300 dark:text-stone-300 text-center leading-relaxed max-w-xl mx-auto">
              Disclaimer: This certificate reflects educational mastery within the Venture Mind simulation environment and does not constitute a formal professional qualification, legal admission, or financial advisory licensure.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
