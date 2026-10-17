import React from 'react';
import {
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  PieChart,
  DollarSign,
  Flame,
  Brain,
  Layers,
  ChevronRight,
  Volume2,
  FileCheck2,
  Scale,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { termsData } from '../../data/termsData';
import { psychologyPrinciples } from '../../data/psychologyData';
import { MindfulPauseWidget } from '../mindfulness/MindfulPauseWidget';

export const DashboardView: React.FC = () => {
  const {
    language,
    progress,
    setActiveTab,
    setSelectedTermId,
    setSelectedSimulator,
    speak,
    formatMoney,
  } = useApp();

  const dailyTerm = termsData.find((t) => t.id === 'term_047') || termsData[0]; // Liquidation Preference
  const dailyPsychology = psychologyPrinciples[0]; // 4-second tactical pause

  const recommendedTerms = termsData
    .filter((t) => !progress.completedLessons.includes(t.id))
    .slice(0, 3);

  const t = {
    greeting: {
      en: 'Welcome, Principal & Architect',
      fr: 'Bienvenue, Associé Directeur & Fondateur',
      zh: '欢迎，主管合伙人与创业先锋',
    },
    subtitle: {
      en: 'Executive mindfulness, venture deal intelligence, live cap table modeling, and strategic negotiation composure.',
      fr: 'Pleine conscience stratégique, modélisation de capitalisation et sérénité absolue en négociation.',
      zh: '在资本博弈的风暴中保持正念定力：深度研习股权架构、推演清算瀑布并从容应对极限压价。',
    },
    dailyChallenge: {
      en: 'Term Sheet Breakdown of the Day',
      fr: 'Décryptage de Term Sheet du Jour',
      zh: '今日关键条款拆解',
    },
    psychoTip: {
      en: 'Mindful Negotiation Protocol',
      fr: 'Protocole de Sérénité & Négociation',
      zh: '正念博弈心法要略',
    },
    quickLaunch: {
      en: 'Tactical Financial Simulators',
      fr: 'Simulateurs Financiers de Précision',
      zh: '高阶金融推演沙盘',
    },
    nextLessons: {
      en: 'Recommended Learning Curve',
      fr: 'Parcours d’Excellence Recommandé',
      zh: '下一阶段精进通关',
    },
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-mobile-nav">
      {/* Luxurious Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-indigo-950 text-white p-5 sm:p-7 md:p-9 border border-white/10 dark:border-white/5 shadow-2xl">
        {/* Artistic Luminous Ambient Orbs */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-gradient-to-tr from-purple-600/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-300 bg-amber-500/15 border border-amber-400/30 px-3 py-0.5 rounded-full shadow-inner flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{progress.levelName[language]}</span>
              </span>
              <span className="text-stone-300 text-xs font-mono">
                • {progress.streakDays}{' '}
                {language === 'fr'
                  ? 'jours de sérénité consécutifs'
                  : language === 'zh'
                  ? '天连续正念研习'
                  : 'consecutive active days'}
              </span>
            </div>

            <h1 className="fluid-display-hero font-serif-luxury font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-stone-100 to-purple-200">
              {t.greeting[language]}
            </h1>

            <p className="text-stone-300 fluid-body-sm max-w-2xl leading-relaxed">
              {t.subtitle[language]}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('mindfulness')}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-purple-950/40 transition-all flex items-center space-x-2 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>
                {language === 'fr'
                  ? 'Sanctuaire Zen'
                  : language === 'zh'
                  ? '正念定力殿堂'
                  : 'Zen Sanctuary'}
              </span>
            </button>
            <button
              onClick={() => {
                setSelectedSimulator('captable');
                setActiveTab('simulators');
              }}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center space-x-2 active:scale-95 cursor-pointer"
            >
              <PieChart className="w-4 h-4" />
              <span>
                {language === 'fr'
                  ? 'Table de Cap'
                  : language === 'zh'
                  ? '股权沙盘'
                  : 'Cap Table Lab'}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-surface-muted/30 dark:bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 border border-white/10 font-medium text-xs sm:text-sm transition-all flex items-center space-x-2 active:scale-95 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'fr'
                  ? 'Examen 100Q'
                  : language === 'zh'
                  ? '结业百题考'
                  : '100Q Exam'}
              </span>
            </button>
          </div>
        </div>

        {/* Hero Micro KPI Stats */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="fluid-stat-label text-stone-400 truncate">
              Venture IQ
            </div>
            <div className="fluid-stat font-bold text-emerald-400 mt-0.5">
              {progress.ventureIQ}{' '}
              <span className="text-[11px] sm:text-xs text-stone-400 font-normal">/ 180</span>
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="fluid-stat-label text-stone-400 truncate">
              {language === 'fr' ? 'Leçons Validées' : language === 'zh' ? '已通透核心课' : 'Mastered Lessons'}
            </div>
            <div className="fluid-stat font-bold text-stone-100 mt-0.5">
              {progress.completedLessons.length}{' '}
              <span className="text-[11px] sm:text-xs text-stone-400 font-normal">/ 100</span>
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="fluid-stat-label text-stone-400 truncate">
              {language === 'fr' ? 'Score Jeux & Énigmes' : language === 'zh' ? '博弈实战得分' : 'Arena Points'}
            </div>
            <div className="fluid-stat font-bold text-amber-400 mt-0.5">
              {Object.values(progress.gameScores).reduce((a, b) => a + b, 0)} <span className="text-[11px] font-normal text-stone-400">pts</span>
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="fluid-stat-label text-stone-400 truncate">
              {language === 'fr' ? 'Sérénité Mentale' : language === 'zh' ? '正念抗压定力' : 'Mindful Composure'}
            </div>
            <div className="fluid-stat font-bold text-purple-400 mt-0.5">
              {progress.radarCompetencies.psychology}%
            </div>
          </div>
        </div>
      </div>

      {/* Mindful Pause Widget (Tactical Composure Box Breathing) */}
      <MindfulPauseWidget />

      {/* Grid: Daily Deal & Mindful Psychology of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Daily Term Card */}
        <div className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                {t.dailyChallenge[language]}
              </span>
              <span className="text-xs font-mono text-text-secondary dark:text-stone-400">
                #{dailyTerm.id}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-stone-100 font-heading">
                {dailyTerm.canonical}
              </h3>
              <button
                onClick={() => speak(`${dailyTerm.canonical}. ${dailyTerm.shortDef[language]}`)}
                className="p-2 rounded-xl text-text-secondary hover:text-emerald-600 hover:bg-surface-muted dark:hover:bg-stone-800 transition-colors"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-text-secondary dark:text-stone-400 font-mono mt-0.5">
              {language === 'fr' ? dailyTerm.fr : dailyTerm.zh}
            </p>

            <p className="text-xs text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
              {dailyTerm.shortDef[language]}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-xs">
              <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                {language === 'fr'
                  ? 'Sérénité Fondateur & Garde-Fous :'
                  : language === 'zh'
                  ? '创始人关键定力视角：'
                  : 'Founder Critical Takeaway:'}
              </span>
              <p className="text-emerald-950 dark:text-emerald-200 line-clamp-2 leading-relaxed">
                {dailyTerm.founderView[language]}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border-main/70 dark:border-stone-800 flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-text-secondary dark:text-stone-400 uppercase">
              {dailyTerm.difficulty} • {dailyTerm.category}
            </span>
            <button
              onClick={() => {
                setSelectedTermId(dailyTerm.id);
                setActiveTab('learn');
              }}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <span>{language === 'fr' ? 'Leçon approfondie' : language === 'zh' ? '完整精讲' : 'Deep Lesson'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Daily Psychology & Mindful Rule */}
        <div className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-300 font-bold bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                {t.psychoTip[language]}
              </span>
              <span className="text-xs font-mono text-text-secondary dark:text-stone-400">
                Rule #{dailyPsychology.number}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-stone-100 font-heading">
                {dailyPsychology.name[language]}
              </h3>
              <button
                onClick={() => speak(`${dailyPsychology.name[language]}. ${dailyPsychology.definition[language]}`)}
                className="p-2 rounded-xl text-text-secondary hover:text-purple-600 hover:bg-surface-muted dark:hover:bg-stone-800 transition-colors"
                title="Pronounce tactic"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
              {dailyPsychology.definition[language]}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 text-xs">
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                {language === 'fr'
                  ? 'Épreuve en Négociation :'
                  : language === 'zh'
                  ? '高压交锋实战场景：'
                  : 'Negotiation Scenario:'}
              </span>
              <p className="text-stone-700 dark:text-stone-300 italic leading-relaxed">
                "{dailyPsychology.fundraisingScenario[language]}"
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border-main dark:border-stone-800 flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
              {dailyPsychology.category}
            </span>
            <button
              onClick={() => setActiveTab('psychology')}
              className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1"
            >
              <span>{language === 'fr' ? 'Radar Psychologique' : language === 'zh' ? '进入心理雷达' : 'Psychology Radar'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tactical Simulators Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
              {t.quickLaunch[language]}
            </h2>
            <p className="text-xs text-text-secondary dark:text-stone-400">
              {language === 'fr'
                ? 'Modélisez vos tours, options BSPCE et sorties avec clarté mathématique'
                : language === 'zh'
                ? '以精准数学模型守护每一分股权：推演期权池洗牌、SAFE折价与清算瀑布'
                : 'Interactive models for valuation, option pools, liquidation preferences, and negotiation leverage'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cap Table Card */}
          <div
            onClick={() => {
              setSelectedSimulator('captable');
              setActiveTab('simulators');
            }}
            className="p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-inner">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {language === 'fr' ? 'Table de Capitalisation' : language === 'zh' ? '动态股权结构表' : 'Cap Table Simulator'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 leading-relaxed">
              {language === 'fr' ? 'Simulez Seed, Série A et dilution BSPCE' : language === 'zh' ? '模拟种子轮、A轮期权池洗牌与股权稀释' : 'Interactive Seed, Series A & option pool dilution'}
            </p>
          </div>

          {/* SAFE Card */}
          <div
            onClick={() => {
              setSelectedSimulator('safe');
              setActiveTab('simulators');
            }}
            className="p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {language === 'fr' ? 'Simulateur SAFE & Notes' : language === 'zh' ? 'SAFE / 可转债换算' : 'SAFE & Note Simulator'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 leading-relaxed">
              {language === 'fr' ? 'Post-Money vs Pre-Money et décotes' : language === 'zh' ? '对比Post-Money与Pre-Money上限及折扣' : 'Post vs Pre-Money SAFE, valuation caps & discounts'}
            </p>
          </div>

          {/* Waterfall Card */}
          <div
            onClick={() => {
              setSelectedSimulator('waterfall');
              setActiveTab('simulators');
            }}
            className="p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {language === 'fr' ? 'Cascade de Sortie' : language === 'zh' ? '清算优先权瀑布' : 'Exit Waterfall Lab'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 leading-relaxed">
              {language === 'fr' ? 'Calculez les montants à 10 M$, 50 M$ et 200 M$' : language === 'zh' ? '测算不同估值下1x非参与与2x参与收益' : '1x vs 2x Participating liquidation preferences'}
            </p>
          </div>

          {/* AI Investor Showdown */}
          <div
            onClick={() => setActiveTab('negotiation')}
            className="p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-inner">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {language === 'fr' ? 'Négociateur VC IA' : language === 'zh' ? 'AI投资人实战博弈' : 'AI Investor Showdown'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 leading-relaxed">
              {language === 'fr' ? 'Affrontez un associé impitoyable en direct' : language === 'zh' ? '直面严苛机构合伙人，实时交锋意向书条款' : 'Real-time term sheet counter-offers and live scoring'}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Curriculum */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
              {t.nextLessons[language]}
            </h2>
            <p className="text-xs text-text-secondary dark:text-stone-400">
              {language === 'fr'
                ? 'Concepts indispensables adaptés à votre niveau'
                : language === 'zh'
                ? '量身定制的下一阶段关键概念与避坑要略'
                : 'Critical curriculum tailored to your venture experience level'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('learn')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>{language === 'fr' ? 'Tout le catalogue (100)' : language === 'zh' ? '全部100条目' : 'View All 100'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedTerms.map((term) => (
            <div
              key={term.id}
              onClick={() => {
                setSelectedTermId(term.id);
                setActiveTab('learn');
              }}
              className="p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {term.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +75 XP
                  </span>
                </div>
                <h3 className="font-bold text-sm text-text-primary dark:text-stone-100">
                  {term.canonical}
                </h3>
                <p className="text-[11px] text-text-secondary dark:text-stone-400 mb-2">
                  {language === 'fr' ? term.fr : term.zh}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                  {term.shortDef[language]}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border-main dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>{language === 'fr' ? 'Démarrer la leçon' : language === 'zh' ? '开始攻坚' : 'Start Lesson'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
