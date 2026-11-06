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
        className="w-full max-w-4xl bg-[#0C0F1D]/98 rounded-t-3xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] border border-amber-400/40 overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[90vh] my-0 sm:my-auto backdrop-blur-2xl text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 sm:px-7 py-4 border-b border-amber-400/25 flex items-center justify-between bg-[#13172C]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-xs sm:text-sm font-mono uppercase px-2.5 py-1 rounded-md bg-stone-800 text-stone-200 font-bold border border-stone-700">
              #{term.id}
            </span>
            <span className="text-xs sm:text-sm font-mono uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40">
              {term.category}
            </span>
            <span className="text-xs sm:text-sm font-mono capitalize px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40">
              {term.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Audio Button */}
            <button
              onClick={() => {
                const textToSpeak = `${term.canonical}. ${term.shortDef[language]}`;
                speak(textToSpeak, language);
              }}
              title="Pronounce term"
              className="p-2.5 rounded-xl text-stone-300 hover:text-amber-300 hover:bg-stone-800 active:scale-95 transition-all"
            >
              <Volume2 className="w-5 h-5 text-amber-300" />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleSaveTerm(term.id)}
              title={isSaved ? 'Remove Bookmark' : 'Bookmark for Review'}
              className="p-2.5 rounded-xl text-stone-300 hover:text-amber-400 hover:bg-stone-800 active:scale-95 transition-all"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 active:scale-95 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Title & Trilingual Synonyms */}
        <div className="px-5 sm:px-7 pt-5 pb-3 shrink-0 bg-[#0C0F1D]/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury font-bold text-white tracking-wide drop-shadow-sm">
              {term.canonical}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-amber-200 font-mono font-medium mt-1.5 sm:mt-0">
              <span className="text-amber-200">FR: {term.fr}</span>
              <span className="text-amber-400/60">•</span>
              <span className="text-amber-200">ZH: {term.zh}</span>
            </div>
          </div>

          {/* Statutory Benchmark Banner */}
          {term.statutoryStandard && (
            <div className="mt-3.5 p-3 rounded-xl bg-black/40 border border-amber-400/30 text-xs sm:text-sm flex flex-wrap gap-x-4 gap-y-1.5 text-stone-200 font-mono">
              <span>🇺🇸 NVCA: <strong className="text-amber-300 font-bold">{term.statutoryStandard.nvca}</strong></span>
              <span>🇫🇷 France: <strong className="text-amber-300 font-bold">{term.statutoryStandard.pacte}</strong></span>
              <span>🇨🇳 CN: <strong className="text-amber-300 font-bold">{term.statutoryStandard.china}</strong></span>
            </div>
          )}
        </div>

        {/* Tab Navigation (Horizontally scrollable on mobile) */}
        <div className="px-5 sm:px-7 border-b border-amber-400/20 flex space-x-4 sm:space-x-8 text-sm sm:text-base font-serif-luxury font-semibold overflow-x-auto no-scrollbar shrink-0 bg-[#0E1222]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                : 'border-transparent text-stone-300 hover:text-white'
            }`}
          >
            {language === 'fr' ? '1. Fondamentaux' : language === 'zh' ? '1. 概念核心' : '1. Overview'}
          </button>
          <button
            onClick={() => setActiveTab('perspectives')}
            className={`py-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'perspectives'
                ? 'border-amber-400 text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                : 'border-transparent text-stone-300 hover:text-white'
            }`}
          >
            {language === 'fr' ? '2. Fondateur vs VC' : language === 'zh' ? '2. 双重视角' : '2. Dual Views'}
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`py-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'math'
                ? 'border-amber-400 text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                : 'border-transparent text-stone-300 hover:text-white'
            }`}
          >
            {language === 'fr' ? '3. Modélisation' : language === 'zh' ? '3. 算式沙盘' : '3. Math Sandbox'}
          </button>
          <button
            onClick={() => setActiveTab('negotiation')}
            className={`py-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'negotiation'
                ? 'border-amber-400 text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                : 'border-transparent text-stone-300 hover:text-white'
            }`}
          >
            {language === 'fr' ? '4. Négociation & Red Flags' : language === 'zh' ? '4. 谈判雷区' : '4. Red Flags'}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm sm:text-base">
          {activeTab === 'overview' && (
            <div className="space-y-5 sm:space-y-6">
              {/* Short Definition */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-[#10192A] to-[#0A0D18] border border-emerald-400/40 shadow-xl">
                <div className="text-xs sm:text-sm font-mono uppercase tracking-wider text-amber-300 font-bold mb-2">
                  {language === 'fr' ? 'Définition Juridique & Financière' : language === 'zh' ? '标准法律与金融定义' : 'Canonical Definition'}
                </div>
                <p className="text-base sm:text-lg md:text-xl font-serif-luxury font-medium text-white leading-relaxed">
                  {term.shortDef[language]}
                </p>
              </div>

              {/* Simple Explanation */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#151A2E] to-[#0D101C] border border-amber-400/25 shadow-lg">
                <h3 className="font-bold text-sm sm:text-base uppercase font-mono tracking-wider text-amber-300 mb-2.5 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span>
                    {language === 'fr' ? 'Explication en Langage Clair' : language === 'zh' ? '通俗直白解析' : 'Plain Language Breakdown'}
                  </span>
                </h3>
                <p className="text-base sm:text-lg text-stone-100 leading-relaxed font-normal">
                  {term.simpleExplanation[language]}
                </p>
              </div>

              {/* Fictional Scenario */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-950/50 via-[#131D33] to-[#0B101D] border border-sky-400/35 shadow-lg">
                <div className="flex items-center space-x-2.5 text-sm sm:text-base font-bold text-sky-200 mb-2.5">
                  <Building2 className="w-5 h-5 text-sky-400" />
                  <span>
                    {language === 'fr' ? 'Cas Pédagogique Concret (Entreprise Fictive)' : language === 'zh' ? '虚拟实战教学案例' : 'Fictional Illustrative Scenario'}
                  </span>
                </div>
                <p className="text-base sm:text-lg text-sky-100 leading-relaxed">
                  {term.fictionalExample[language]}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'perspectives' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
              {/* Founder View */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-[#132225] to-[#0B1417] border border-emerald-400/40 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-sm sm:text-base font-bold font-serif-luxury uppercase text-emerald-300 mb-3">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span>
                      {language === 'fr' ? 'Vision Fondateur' : language === 'zh' ? '创始人核心诉求' : 'Founder Perspective'}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-emerald-100 leading-relaxed font-medium">
                    {term.founderView[language]}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-emerald-400/30 text-xs sm:text-sm text-emerald-300 font-semibold font-mono">
                  {language === 'fr' ? 'Priorité : Préserver souveraineté et upside' : language === 'zh' ? '核心导向：捍卫主控权与未来收益' : 'Priority: Safeguard sovereignty & upside'}
                </div>
              </div>

              {/* Investor View */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-950/50 via-[#1E1631] to-[#100D1C] border border-purple-400/40 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-sm sm:text-base font-bold font-serif-luxury uppercase text-purple-300 mb-3">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    <span>
                      {language === 'fr' ? 'Vision Investisseur VC' : language === 'zh' ? '风投资方深层诉求' : 'VC Investor Perspective'}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-purple-100 leading-relaxed font-medium">
                    {term.investorView[language]}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-purple-400/30 text-xs sm:text-sm text-purple-300 font-semibold font-mono">
                  {language === 'fr' ? 'Priorité : Dé-risquer et retour sur fonds LP' : language === 'zh' ? '核心导向：对冲下行风险与LP收益倍数' : 'Priority: De-risk downside & LP returns'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'math' && (
            <div className="space-y-6">
              {term.calculationNote && (
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#161B30] to-[#0E1120] border border-amber-400/35 shadow-lg">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono uppercase text-amber-300 mb-2">
                    <Calculator className="w-5 h-5 text-amber-400" />
                    <span>{language === 'fr' ? 'Règle Mathématique & Formule' : language === 'zh' ? '测算公式与金融逻辑' : 'Formula & Mechanics'}</span>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl font-mono text-amber-300 font-bold leading-relaxed">
                    {term.calculationNote[language]}
                  </p>
                </div>
              )}

              {/* Live Interactive Calculation Sandbox */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0F1325] border border-amber-400/30 shadow-xl space-y-5">
                <h4 className="font-bold text-sm sm:text-base font-mono uppercase tracking-wider text-amber-200">
                  {language === 'fr' ? 'Bac à Sable de Calcul Instantané' : language === 'zh' ? '实时动态参数沙盘' : 'Live Interactive Calculation Sandbox'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-stone-200 mb-1.5 font-mono font-medium">
                      {language === 'fr' ? 'Valorisation Pré-Money ($)' : language === 'zh' ? '投前估值 ($)' : 'Pre-Money Valuation ($)'}
                    </label>
                    <input
                      type="number"
                      step={500000}
                      value={calcInputA}
                      onChange={(e) => setCalcInputA(Number(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-amber-400/40 font-mono text-base sm:text-lg text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-200 mb-1.5 font-mono font-medium">
                      {language === 'fr' ? 'Montant Investi ($)' : language === 'zh' ? '注资金额 ($)' : 'Investment Amount ($)'}
                    </label>
                    <input
                      type="number"
                      step={250000}
                      value={calcInputB}
                      onChange={(e) => setCalcInputB(Number(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-amber-400/40 font-mono text-base sm:text-lg text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-amber-400/25 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-xs font-mono uppercase text-stone-300 block mb-1">
                      Post-Money
                    </span>
                    <span className="text-base sm:text-xl font-bold font-mono text-amber-300">
                      {formatMoney(postMoney)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-stone-300 block mb-1">
                      Investor Share
                    </span>
                    <span className="text-base sm:text-xl font-bold font-mono text-emerald-400">
                      {investorDilution.toFixed(2)}%
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-xs font-mono uppercase text-stone-300 block mb-1">
                      Founder Retention
                    </span>
                    <span className="text-base sm:text-xl font-bold font-mono text-amber-200">
                      {(100 - investorDilution).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'negotiation' && (
            <div className="space-y-5 sm:space-y-6">
              {/* Psychology Connection */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-950/50 via-[#1C162E] to-[#0E0C18] border border-purple-400/35 shadow-lg">
                <div className="flex items-center space-x-2 text-sm sm:text-base font-bold text-purple-300 mb-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>{language === 'fr' ? 'Ancrage Psychologique' : language === 'zh' ? '心理博弈锚点' : 'Psychology Connection'}</span>
                </div>
                <p className="text-base sm:text-lg text-purple-100 leading-relaxed font-medium">
                  {term.psychologyConnection[language]}
                </p>
              </div>

              {/* Questions to ask in negotiation */}
              <div>
                <h4 className="font-bold text-sm sm:text-base font-mono uppercase tracking-wider text-amber-300 mb-3 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <span>
                    {language === 'fr' ? 'Questions Stratégiques à Poser' : language === 'zh' ? '实战交锋发问清单' : 'Calibrated Strategic Questions'}
                  </span>
                </h4>
                <div className="space-y-3">
                  {term.negotiationQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#11162B] border border-amber-400/25 text-sm sm:text-base text-stone-100 flex items-start space-x-3 shadow-md"
                    >
                      <span className="text-amber-400 font-mono font-bold shrink-0">Q{idx + 1}.</span>
                      <p className="leading-relaxed font-medium">{q[language]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red flags */}
              <div>
                <h4 className="font-bold text-sm sm:text-base font-mono uppercase tracking-wider text-rose-300 mb-3 flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>
                    {language === 'fr' ? 'Signaux d’Alerte & Clauses Toxiques' : language === 'zh' ? '排查雷区(Red Flags)' : 'Red Flags & Extractive Traps'}
                  </span>
                </h4>
                <div className="space-y-3">
                  {term.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-gradient-to-r from-rose-950/50 via-[#261017] to-[#180A0F] border border-rose-500/40 text-sm sm:text-base text-rose-100 flex items-start space-x-3 shadow-md"
                    >
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed font-medium">{flag[language]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Concepts */}
          {term.relatedTermIds.length > 0 && (
            <div className="pt-4 border-t border-amber-400/20">
              <span className="text-xs sm:text-sm font-mono uppercase text-amber-300 block mb-2.5 font-bold">
                {language === 'fr' ? 'Termes Connexes' : language === 'zh' ? '关联衍生概念' : 'Related Deal Terms'}:
              </span>
              <div className="flex flex-wrap gap-2">
                {term.relatedTermIds.map((relId) => (
                  <button
                    key={relId}
                    onClick={() => onSelectRelated(relId)}
                    className="text-xs sm:text-sm px-3.5 py-1.5 rounded-xl bg-[#151930] hover:bg-amber-500/20 text-amber-200 border border-amber-400/30 transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer font-medium"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>#{relId}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Sticky on Mobile) */}
        <div className="px-5 sm:px-7 py-4 border-t border-amber-400/25 flex items-center justify-between bg-[#0C0F1D] backdrop-blur-md shrink-0">
          <div className="text-xs sm:text-sm text-stone-200 font-mono">
            {isCompleted ? (
              <span className="text-emerald-400 font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Leçon Maîtrisée (+75 XP)' : language === 'zh' ? '已掌握 (+75 XP)' : 'Mastered (+75 XP)'}</span>
                <span className="sm:hidden font-bold">+75 XP</span>
              </span>
            ) : (
              <span className="text-amber-300 font-bold font-mono">+{75} XP</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {!isCompleted && (
              <button
                onClick={() => markLessonComplete(term.id)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg transition-all flex items-center space-x-2 active:scale-95 cursor-pointer"
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
              className="px-5 py-2.5 rounded-xl bg-[#1C2138] border border-amber-400/30 text-stone-100 font-medium text-sm hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
            >
              {language === 'fr' ? 'Fermer' : language === 'zh' ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
