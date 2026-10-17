import React, { useState } from 'react';
import {
  X,
  Volume2,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building2,
  Calculator,
  Brain,
  MessageSquare,
  ShieldAlert,
  Link as LinkIcon,
  Sparkles,
  Scale,
} from 'lucide-react';
import { Term, Language } from '../../types';
import { useApp } from '../../context/AppContext';

export const TermDetailModal: React.FC<{
  term: Term;
  onClose: () => void;
  onSelectRelated: (termId: string) => void;
}> = ({ term, onClose, onSelectRelated }) => {
  const {
    language,
    progress,
    toggleSaveTerm,
    markLessonComplete,
    speak,
    formatMoney,
  } = useApp();

  const isSaved = progress.savedTermIds.includes(term.id);
  const isCompleted = progress.completedLessons.includes(term.id);

  // Active tab inside deep lesson
  const [activeTab, setActiveTab] = useState<'overview' | 'perspectives' | 'math' | 'negotiation'>('overview');

  // Mini calculation sandbox state
  const [calcInputA, setCalcInputA] = useState<number>(10000000); // 10M pre-money
  const [calcInputB, setCalcInputB] = useState<number>(2500000);  // 2.5M investment

  const postMoney = calcInputA + calcInputB;
  const investorDilution = postMoney > 0 ? (calcInputB / postMoney) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-surface-main dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white/10 dark:border-white/5 overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[90vh] my-0 sm:my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-border-main/70 dark:border-stone-800 flex items-center justify-between bg-surface-muted/60 dark:bg-stone-800/60 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
              #{term.id}
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
              {term.category}
            </span>
            <span className="text-[10px] font-mono capitalize px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20">
              {term.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Audio Button */}
            <button
              onClick={() => {
                const textToSpeak = `${term.canonical}. ${term.shortDef[language]}`;
                speak(textToSpeak, language);
              }}
              title="Pronounce term"
              className="p-2 rounded-xl text-text-secondary hover:text-purple-600 dark:hover:text-purple-400 hover:bg-surface-muted dark:hover:bg-stone-800 active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleSaveTerm(term.id)}
              title={isSaved ? 'Remove Bookmark' : 'Bookmark for Review'}
              className="p-2 rounded-xl text-text-secondary hover:text-amber-500 hover:bg-surface-muted dark:hover:bg-stone-800 active:scale-95 transition-all"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-muted dark:hover:bg-stone-800 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title & Trilingual Synonyms */}
        <div className="px-4 sm:px-6 pt-4 pb-2 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3">
            <h1 className="fluid-heading-1 font-serif-luxury font-medium text-text-primary dark:text-stone-100">
              {term.canonical}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-secondary dark:text-stone-400 font-mono mt-1 sm:mt-0">
              <span className="text-stone-700 dark:text-stone-300">FR: {term.fr}</span>
              <span>•</span>
              <span className="text-stone-700 dark:text-stone-300">ZH: {term.zh}</span>
            </div>
          </div>

          {/* Statutory Benchmark Banner */}
          {term.statutoryStandard && (
            <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-500/5 via-stone-500/5 to-purple-500/5 border border-border-main/70 dark:border-stone-800 text-[11px] flex flex-wrap gap-x-3 gap-y-1 text-text-secondary dark:text-stone-400 font-mono">
              <span>🇺🇸 NVCA: <strong className="text-stone-800 dark:text-stone-200">{term.statutoryStandard.nvca}</strong></span>
              <span>🇫🇷 France: <strong className="text-stone-800 dark:text-stone-200">{term.statutoryStandard.pacte}</strong></span>
              <span>🇨🇳 CN: <strong className="text-stone-800 dark:text-stone-200">{term.statutoryStandard.china}</strong></span>
            </div>
          )}
        </div>

        {/* Tab Navigation (Horizontally scrollable on mobile) */}
        <div className="px-4 sm:px-6 border-b border-border-main/70 dark:border-stone-800 flex space-x-3 sm:space-x-6 text-xs font-semibold overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            {language === 'fr' ? '1. Fondamentaux' : language === 'zh' ? '1. 概念核心' : '1. Overview'}
          </button>
          <button
            onClick={() => setActiveTab('perspectives')}
            className={`py-2.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'perspectives'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            {language === 'fr' ? '2. Fondateur vs VC' : language === 'zh' ? '2. 双重视角' : '2. Dual Views'}
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`py-2.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'math'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            {language === 'fr' ? '3. Modélisation' : language === 'zh' ? '3. 算式沙盘' : '3. Math Sandbox'}
          </button>
          <button
            onClick={() => setActiveTab('negotiation')}
            className={`py-2.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'negotiation'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            {language === 'fr' ? '4. Négociation & Red Flags' : language === 'zh' ? '4. 谈判雷区' : '4. Red Flags'}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-5">
              {/* Short Definition */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent border border-emerald-500/20">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-bold mb-1">
                  {language === 'fr' ? 'Définition Juridique & Financière' : language === 'zh' ? '标准法律与金融定义' : 'Canonical Definition'}
                </div>
                <p className="text-text-primary dark:text-stone-100 font-medium leading-relaxed">
                  {term.shortDef[language]}
                </p>
              </div>

              {/* Simple Explanation */}
              <div>
                <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-text-secondary dark:text-stone-400 mb-1.5 flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>
                    {language === 'fr' ? 'Explication en Langage Clair' : language === 'zh' ? '通俗直白解析' : 'Plain Language Breakdown'}
                  </span>
                </h3>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {term.simpleExplanation[language]}
                </p>
              </div>

              {/* Fictional Scenario */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 dark:text-blue-400 mb-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>
                    {language === 'fr' ? 'Cas Pédagogique Concret (Entreprise Fictive)' : language === 'zh' ? '虚拟实战教学案例' : 'Fictional Illustrative Scenario'}
                  </span>
                </div>
                <p className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
                  {term.fictionalExample[language]}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'perspectives' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Founder View */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold font-mono uppercase text-emerald-800 dark:text-emerald-400 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {language === 'fr' ? 'Vision Fondateur' : language === 'zh' ? '创始人核心诉求' : 'Founder Perspective'}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
                    {term.founderView[language]}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                  {language === 'fr' ? 'Priorité : Préserver souveraineté et upside' : language === 'zh' ? '核心导向：捍卫主控权与未来收益' : 'Priority: Safeguard sovereignty & upside'}
                </div>
              </div>

              {/* Investor View */}
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold font-mono uppercase text-purple-800 dark:text-purple-400 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>
                      {language === 'fr' ? 'Vision Investisseur VC' : language === 'zh' ? '风投资方深层诉求' : 'VC Investor Perspective'}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-purple-950 dark:text-purple-200 leading-relaxed">
                    {term.investorView[language]}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-200/60 dark:border-purple-900/40 text-[11px] text-purple-800 dark:text-purple-300 font-medium">
                  {language === 'fr' ? 'Priorité : Dé-risquer et retour sur fonds LP' : language === 'zh' ? '核心导向：对冲下行风险与LP收益倍数' : 'Priority: De-risk downside & LP returns'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'math' && (
            <div className="space-y-5">
              {term.calculationNote && (
                <div className="p-4 rounded-2xl bg-surface-muted dark:bg-stone-800/60 border border-border-main dark:border-stone-800">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase text-text-secondary dark:text-stone-400 mb-1">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'fr' ? 'Règle Mathématique & Formule' : language === 'zh' ? '测算公式与金融逻辑' : 'Formula & Mechanics'}</span>
                  </div>
                  <p className="text-xs md:text-sm font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    {term.calculationNote[language]}
                  </p>
                </div>
              )}

              {/* Live Interactive Calculation Sandbox */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 space-y-4">
                <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-text-primary dark:text-stone-200">
                  {language === 'fr' ? 'Bac à Sable de Calcul Instantané' : language === 'zh' ? '实时动态参数沙盘' : 'Live Interactive Calculation Sandbox'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-text-secondary dark:text-stone-400 mb-1 font-mono">
                      {language === 'fr' ? 'Valorisation Pré-Money ($)' : language === 'zh' ? '投前估值 ($)' : 'Pre-Money Valuation ($)'}
                    </label>
                    <input
                      type="number"
                      step={500000}
                      value={calcInputA}
                      onChange={(e) => setCalcInputA(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 font-mono text-text-primary dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary dark:text-stone-400 mb-1 font-mono">
                      {language === 'fr' ? 'Montant Investi ($)' : language === 'zh' ? '注资金额 ($)' : 'Investment Amount ($)'}
                    </label>
                    <input
                      type="number"
                      step={250000}
                      value={calcInputB}
                      onChange={(e) => setCalcInputB(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 font-mono text-text-primary dark:text-stone-100"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-text-secondary dark:text-stone-400 block">
                      Post-Money
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-text-primary dark:text-stone-100">
                      {formatMoney(postMoney)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-text-secondary dark:text-stone-400 block">
                      Investor Share
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {investorDilution.toFixed(2)}%
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-mono uppercase text-text-secondary dark:text-stone-400 block">
                      Founder Retention
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-stone-700 dark:text-stone-300">
                      {(100 - investorDilution).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'negotiation' && (
            <div className="space-y-4 sm:space-y-5">
              {/* Psychology Connection */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-800 dark:text-purple-300 mb-1.5">
                  <Brain className="w-4 h-4" />
                  <span>{language === 'fr' ? 'Ancrage Psychologique' : language === 'zh' ? '心理博弈锚点' : 'Psychology Connection'}</span>
                </div>
                <p className="text-xs text-purple-950 dark:text-purple-200 leading-relaxed">
                  {term.psychologyConnection[language]}
                </p>
              </div>

              {/* Questions to ask in negotiation */}
              <div>
                <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-text-secondary dark:text-stone-400 mb-2 flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'fr' ? 'Questions Stratégiques à Poser' : language === 'zh' ? '实战交锋发问清单' : 'Calibrated Strategic Questions'}
                  </span>
                </h4>
                <div className="space-y-2">
                  {term.negotiationQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-surface-muted dark:bg-stone-800/60 border border-border-main dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 flex items-start space-x-2"
                    >
                      <span className="text-emerald-600 font-mono font-bold">Q{idx + 1}.</span>
                      <p className="italic leading-relaxed">{q[language]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red flags */}
              <div>
                <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>
                    {language === 'fr' ? 'Signaux d’Alerte & Clauses Toxiques' : language === 'zh' ? '排查雷区(Red Flags)' : 'Red Flags & Extractive Traps'}
                  </span>
                </h4>
                <div className="space-y-2">
                  {term.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 flex items-start space-x-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{flag[language]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Concepts */}
          {term.relatedTermIds.length > 0 && (
            <div className="pt-3 border-t border-border-main dark:border-stone-800">
              <span className="text-[10px] font-mono uppercase text-text-secondary dark:text-stone-400 block mb-2">
                {language === 'fr' ? 'Termes Connexes' : language === 'zh' ? '关联衍生概念' : 'Related Deal Terms'}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {term.relatedTermIds.map((relId) => (
                  <button
                    key={relId}
                    onClick={() => onSelectRelated(relId)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-surface-muted dark:bg-stone-800 hover:bg-emerald-500/10 text-text-primary dark:text-stone-300 border border-border-main dark:border-stone-700 transition-all flex items-center space-x-1 active:scale-95"
                  >
                    <LinkIcon className="w-3 h-3 text-emerald-600" />
                    <span>#{relId}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Sticky on Mobile) */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border-main dark:border-stone-800 flex items-center justify-between bg-surface-main dark:bg-stone-900 backdrop-blur-md shrink-0">
          <div className="text-xs text-text-secondary dark:text-stone-400 font-mono">
            {isCompleted ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Leçon Maîtrisée (+75 XP)' : language === 'zh' ? '已掌握 (+75 XP)' : 'Mastered (+75 XP)'}</span>
                <span className="sm:hidden font-bold">+75 XP</span>
              </span>
            ) : (
              <span>+{75} XP</span>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isCompleted && (
              <button
                onClick={() => markLessonComplete(term.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md transition-all flex items-center space-x-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'fr'
                    ? 'Valider (+XP)'
                    : language === 'zh'
                    ? '完成并领XP'
                    : 'Claim XP'}
                </span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-muted dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium text-xs hover:bg-stone-300 active:scale-95 transition-all"
            >
              {language === 'fr' ? 'Fermer' : language === 'zh' ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
