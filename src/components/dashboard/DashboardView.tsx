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
  Aperture,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { termsData } from '../../data/termsData';
import { psychologyPrinciples } from '../../data/psychologyData';
import { MindfulPauseWidget } from '../mindfulness/MindfulPauseWidget';
import { OverlappingCardStack } from '../common/OverlappingCardStack';
import { DOMAIN_STACKS_DATA } from '../../data/overlappingCardsData';

export const DashboardView: React.FC = () => {
  const {
    language,
    progress,
    setActiveTab,
    setSelectedTermId,
    setSelectedSimulator,
    setIsOpeningPortalOpen,
    setIsCardStackModalOpen,
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
      {/* Luxurious Executive Hero Banner with High-Exposure Chromatic Lighting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#161a2c] via-[#1d223c] to-[#271f3b] dark:from-[#111425] dark:via-[#191d35] dark:to-[#221c34] text-white p-5 sm:p-7 md:p-9 border border-amber-400/35 dark:border-amber-400/25 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65),0_0_36px_rgba(229,184,66,0.12),inset_0_1px_1px_rgba(255,255,255,0.18)]">
        {/* Artistic Luminous Ambient Orbs & Photographic Exposure Meshes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-gradient-to-br from-amber-400/30 via-rose-500/24 to-purple-600/15 rounded-full blur-[95px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-24 w-96 h-96 bg-gradient-to-tr from-purple-600/26 via-indigo-500/24 to-cyan-400/20 rounded-full blur-[95px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-radial from-amber-300/15 via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />

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
              onClick={() => setIsOpeningPortalOpen(true)}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-amber-500/20 hover:from-amber-500/30 hover:to-purple-500/25 border border-amber-500/40 text-amber-300 font-medium text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 active:scale-95 cursor-pointer"
            >
              <Aperture className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>
                {language === 'fr'
                  ? 'Portail d’Art'
                  : language === 'zh'
                  ? '艺术封面 · 镂空开场'
                  : 'Art Portal'}
              </span>
            </button>
            <button
              onClick={() => setIsCardStackModalOpen(true)}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-400/40 text-indigo-300 font-medium text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 active:scale-95 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>
                {language === 'fr'
                  ? 'Paquet de Cartes'
                  : language === 'zh'
                  ? '重叠式卡组舱'
                  : 'Stacked Decks'}
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

        {/* Hero Micro KPI Stats with Luminous Glass Finishes */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-amber-400/20 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3 rounded-2xl bg-white/[0.08] dark:bg-white/[0.06] border border-amber-400/20 dark:border-white/10 backdrop-blur-md shadow-inner transition-transform hover:scale-[1.02]">
            <div className="fluid-stat-label text-stone-300 dark:text-stone-300 truncate font-semibold">
              Venture IQ
            </div>
            <div className="fluid-stat font-bold text-emerald-300 dark:text-emerald-400 mt-0.5 drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]">
              {progress.ventureIQ}{' '}
              <span className="text-[11px] sm:text-xs text-stone-300 font-normal">/ 180</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.08] dark:bg-white/[0.06] border border-amber-400/20 dark:border-white/10 backdrop-blur-md shadow-inner transition-transform hover:scale-[1.02]">
            <div className="fluid-stat-label text-stone-300 dark:text-stone-300 truncate font-semibold">
              {language === 'fr' ? 'Leçons Validées' : language === 'zh' ? '已通透核心课' : 'Mastered Lessons'}
            </div>
            <div className="fluid-stat font-bold text-amber-200 dark:text-amber-100 mt-0.5 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]">
              {progress.completedLessons.length}{' '}
              <span className="text-[11px] sm:text-xs text-stone-300 font-normal">/ 100</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.08] dark:bg-white/[0.06] border border-amber-400/20 dark:border-white/10 backdrop-blur-md shadow-inner transition-transform hover:scale-[1.02]">
            <div className="fluid-stat-label text-stone-300 dark:text-stone-300 truncate font-semibold">
              {language === 'fr' ? 'Score Jeux & Énigmes' : language === 'zh' ? '博弈实战得分' : 'Arena Points'}
            </div>
            <div className="fluid-stat font-bold text-amber-300 dark:text-amber-400 mt-0.5 drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]">
              {Object.values(progress.gameScores).reduce((a, b) => a + b, 0)} <span className="text-[11px] font-normal text-stone-300">pts</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.08] dark:bg-white/[0.06] border border-amber-400/20 dark:border-white/10 backdrop-blur-md shadow-inner transition-transform hover:scale-[1.02]">
            <div className="fluid-stat-label text-stone-300 dark:text-stone-300 truncate font-semibold">
              {language === 'fr' ? 'Sérénité Mentale' : language === 'zh' ? '正念抗压定力' : 'Mindful Composure'}
            </div>
            <div className="fluid-stat font-bold text-purple-300 dark:text-purple-400 mt-0.5 drop-shadow-[0_0_12px_rgba(192,132,252,0.35)]">
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
            className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border-sophisticated cursor-pointer transition-all duration-300 group relative overflow-hidden hover:border-emerald-500/50"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-inner border border-emerald-500/20">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-text-primary dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {language === 'fr' ? 'Table de Capitalisation' : language === 'zh' ? '动态股权结构表' : 'Cap Table Simulator'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1.5 leading-relaxed">
              {language === 'fr' ? 'Simulez Seed, Série A et dilution BSPCE' : language === 'zh' ? '模拟种子轮、A轮期权池洗牌与股权稀释' : 'Interactive Seed, Series A & option pool dilution'}
            </p>
          </div>

          {/* SAFE Card */}
          <div
            onClick={() => {
              setSelectedSimulator('safe');
              setActiveTab('simulators');
            }}
            className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border-sophisticated cursor-pointer transition-all duration-300 group relative overflow-hidden hover:border-cyan-500/50"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-inner border border-cyan-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-text-primary dark:text-stone-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {language === 'fr' ? 'Simulateur SAFE & Notes' : language === 'zh' ? 'SAFE / 可转债换算' : 'SAFE & Note Simulator'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1.5 leading-relaxed">
              {language === 'fr' ? 'Post-Money vs Pre-Money et décotes' : language === 'zh' ? '对比Post-Money与Pre-Money上限及折扣' : 'Post vs Pre-Money SAFE, valuation caps & discounts'}
            </p>
          </div>

          {/* Waterfall Card */}
          <div
            onClick={() => {
              setSelectedSimulator('waterfall');
              setActiveTab('simulators');
            }}
            className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border-sophisticated cursor-pointer transition-all duration-300 group relative overflow-hidden hover:border-amber-500/50"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-inner border border-amber-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-text-primary dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {language === 'fr' ? 'Cascade de Sortie' : language === 'zh' ? '清算优先权瀑布' : 'Exit Waterfall Lab'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1.5 leading-relaxed">
              {language === 'fr' ? 'Calculez les montants à 10 M$, 50 M$ et 200 M$' : language === 'zh' ? '测算不同估值下1x非参与与2x参与收益' : '1x vs 2x Participating liquidation preferences'}
            </p>
          </div>

          {/* AI Investor Showdown */}
          <div
            onClick={() => setActiveTab('negotiation')}
            className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border-sophisticated cursor-pointer transition-all duration-300 group relative overflow-hidden hover:border-rose-500/50"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-inner border border-rose-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-text-primary dark:text-stone-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {language === 'fr' ? 'Négociateur VC IA' : language === 'zh' ? 'AI投资人实战博弈' : 'AI Investor Showdown'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1.5 leading-relaxed">
              {language === 'fr' ? 'Affrontez un associé impitoyable en direct' : language === 'zh' ? '直面严苛机构合伙人，实时交锋意向书条款' : 'Real-time term sheet counter-offers and live scoring'}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Executive Course Categories Stack (重叠式卡片组件 · 课程分类) */}
      <OverlappingCardStack
        cards={DOMAIN_STACKS_DATA.courses.cards}
        title={DOMAIN_STACKS_DATA.courses.title}
        subtitle={DOMAIN_STACKS_DATA.courses.subtitle}
        domainLabel={{ en: 'Course Categories Stack', fr: 'Filières de Cours Empilées', zh: '课程分类 · 重叠式卡组' }}
        accentColor="emerald"
        direction="horizontal"
        overlapPercent={33}
        onCardAction={(card) => {
          setActiveTab('learn');
        }}
      />

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
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
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
              className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border-sophisticated cursor-pointer transition-all duration-300 flex flex-col justify-between group hover:border-amber-400/50"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-surface-muted/90 dark:bg-stone-800/90 text-stone-600 dark:text-stone-400 border border-border-main/50 dark:border-stone-700/50">
                    {term.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                    +75 XP
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-text-primary dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                  {term.canonical}
                </h3>
                <p className="text-[11px] text-text-secondary dark:text-stone-400 mb-2 font-mono">
                  {language === 'fr' ? term.fr : term.zh}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                  {term.shortDef[language]}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-border-main/60 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
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
