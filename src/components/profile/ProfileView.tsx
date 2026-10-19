import React from 'react';
import {
  User,
  Award,
  ShieldCheck,
  Globe,
  DollarSign,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  PieChart,
  Brain,
  Scale,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../types';
import { OverlappingCardStack } from '../common/OverlappingCardStack';
import { DOMAIN_STACKS_DATA } from '../../data/overlappingCardsData';

export const ProfileView: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    darkMode,
    toggleDarkMode,
    isAudioMuted,
    toggleAudioMute,
    progress,
    resetProgress,
  } = useApp();

  const badges: Badge[] = [
    {
      id: 'badge_01',
      title: { en: 'Dilution Defender', fr: 'Défenseur de Dilution', zh: '股权防稀释卫士' },
      description: {
        en: 'Preserved >60% founder equity across consecutive Seed and Series A simulations.',
        fr: 'A maintenu plus de 60 % de capital fondateur après le Seed et la Série A.',
        zh: '在种子轮与A轮连续推演中将创始人股权稳固守在60%以上。',
      },
      icon: 'ShieldCheck',
      unlocked: true,
      unlockedAt: '2026-10-15',
      nextStep: { en: 'Mastered', fr: 'Validé', zh: '已达成' },
    },
    {
      id: 'badge_02',
      title: { en: 'Term Sheet Detective', fr: 'Détective de Term Sheet', zh: '意向书排雷专家' },
      description: {
        en: 'Uncovered 5 predatory poison-pill clauses without missing a single red flag.',
        fr: 'A débusqué 5 clauses prédatrices sans aucune erreur d’inattention.',
        zh: '零失误精准揪出意向书中全部5个隐藏毒丸条款。',
      },
      icon: 'Eye',
      unlocked: true,
      unlockedAt: '2026-10-16',
      nextStep: { en: 'Mastered', fr: 'Validé', zh: '已达成' },
    },
    {
      id: 'badge_03',
      title: { en: 'Clean Waterfall Architect', fr: 'Architecte de Cascade Saine', zh: '清洁清算架构师' },
      description: {
        en: 'Successfully substituted a 2.5x Participating Preference with a clean 1.0x Non-Participating clause.',
        fr: 'A remplacé une préférence 2,5x participante par une clause 1x non-participante propre.',
        zh: '成功将2.5倍参与优先权谈判修正为标准的1倍非参与优先权。',
      },
      icon: 'TrendingUp',
      unlocked: true,
      unlockedAt: '2026-10-17',
      nextStep: { en: 'Mastered', fr: 'Validé', zh: '已达成' },
    },
    {
      id: 'badge_04',
      title: { en: 'Fellow of Negotiation Psychology', fr: 'Fellow en Psychologie VC', zh: '谈判博弈学院学者' },
      description: {
        en: 'Scored above 85% in the 100-Question Comprehensive Academy Certification Exam.',
        fr: 'A obtenu plus de 85 % au Grand Examen de Certification de l’Académie.',
        zh: '在全院100题结业综合认证大考中斩获85%以上优异成绩。',
      },
      icon: 'Award',
      unlocked: false,
      nextStep: {
        en: 'Pass Final Exam with >85% score',
        fr: 'Réussir l’Examen Final à plus de 85 %',
        zh: '结业大考达到85%以上解锁',
      },
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto pb-mobile-nav">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <User className="w-4 h-4" />
          <span>
            {language === 'fr'
              ? 'Profil Ficiaire & Compétences'
              : language === 'zh'
              ? '个人档案与能力矩阵'
              : 'Fiduciary Profile & Venture Competency'}
          </span>
        </div>
        <h1 className="fluid-heading-1 font-serif-luxury font-medium text-text-primary dark:text-stone-100 mt-1">
          {language === 'fr'
            ? 'Venture IQ & Progression Académique'
            : language === 'zh'
            ? 'Venture IQ 与全景学术档案'
            : 'Venture IQ & Learning Portfolio'}
        </h1>
      </div>

      {/* Hero Stats Card */}
      <div className="p-5 sm:p-6 md:p-8 rounded-3xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-center space-x-3.5 sm:space-x-4">
          <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl sm:text-2xl font-mono shadow-md shrink-0">
            {progress.level}
          </div>
          <div>
            <div className="fluid-stat-label text-emerald-600 dark:text-emerald-400 font-bold">
              Level {progress.level} • {progress.levelName[language]}
            </div>
            <h2 className="fluid-stat font-bold text-text-primary dark:text-stone-100 mt-0.5">
              Venture IQ: {progress.ventureIQ} <span className="text-xs text-text-secondary font-normal">/ 180</span>
            </h2>
            <p className="fluid-body-sm text-text-secondary dark:text-stone-400 mt-0.5">
              {progress.currentXP} XP accumulated • {progress.streakDays} day streak
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-3 md:pt-0 border-t md:border-t-0 border-border-main dark:border-stone-800">
          <div className="text-left md:text-right font-mono">
            <span className="fluid-stat-label text-text-secondary block">Completed Lessons</span>
            <span className="fluid-stat font-bold text-text-primary dark:text-stone-100">
              {progress.completedLessons.length} <span className="text-xs text-text-secondary font-normal">/ 100</span>
            </span>
          </div>
          <div className="h-8 w-px bg-border-main dark:bg-stone-800" />
          <div className="text-left md:text-right font-mono">
            <span className="fluid-stat-label text-text-secondary block">Arena Highscore</span>
            <span className="fluid-stat font-bold text-amber-500">
              {Object.values(progress.gameScores).reduce((a, b) => a + b, 0)} <span className="text-xs font-normal text-stone-400">pts</span>
            </span>
          </div>
        </div>
      </div>

      {/* Radar Competencies Grid */}
      <div className="p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold font-heading text-text-primary dark:text-stone-100 flex items-center space-x-2">
          <Brain className="w-4 h-4 text-emerald-600" />
          <span>
            {language === 'fr'
              ? 'Matrice des 8 Compétences Clés'
              : language === 'zh'
              ? '8项核心能力维度评估'
              : '8-Axis Competency Matrix'}
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          {[
            { label: 'Legal Standards', score: progress.radarCompetencies.knowledge },
            { label: 'Financial Modeling', score: progress.radarCompetencies.finance },
            { label: 'Cap Table Dilution', score: progress.radarCompetencies.capTable },
            { label: 'Psychology Control', score: progress.radarCompetencies.psychology },
            { label: 'Tactical Negotiation', score: progress.radarCompetencies.negotiation },
            { label: 'Calculation Speed', score: progress.radarCompetencies.speed },
            { label: 'Downside Risk', score: progress.radarCompetencies.risk },
            { label: 'Decision Quality', score: progress.radarCompetencies.decisionQuality },
          ].map((comp, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface-muted dark:bg-stone-800/60 border border-border-main dark:border-stone-700 space-y-1.5"
            >
              <div className="flex justify-between text-text-secondary dark:text-stone-400">
                <span>{comp.label}</span>
                <span className="text-emerald-600 font-bold">{comp.score}%</span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${comp.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Profile Credentials & Badges Stack (重叠式卡片组件 · 个人资料) */}
      <OverlappingCardStack
        cards={DOMAIN_STACKS_DATA.profile.cards}
        title={DOMAIN_STACKS_DATA.profile.title}
        subtitle={DOMAIN_STACKS_DATA.profile.subtitle}
        domainLabel={{ en: 'Profile Credentials Stack', fr: 'Titres & Badges Profil', zh: '个人资料 · 荣誉资质叠放卡组' }}
        accentColor="purple"
        direction="horizontal"
        overlapPercent={33}
      />

      {/* Global Application Settings */}
      <div className="p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-sm text-text-primary dark:text-stone-100">
          {language === 'fr' ? 'Préférences Système & Langue' : language === 'zh' ? '系统偏好与多语言设置' : 'System & Academy Settings'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Language */}
          <div className="p-3.5 rounded-xl bg-surface-muted dark:bg-stone-800/60 border border-border-main dark:border-stone-700 flex items-center justify-between">
            <span className="text-text-primary dark:text-stone-200 font-medium">Interface Language</span>
            <div className="flex space-x-1 font-mono">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md ${language === 'en' ? 'bg-emerald-600 text-white font-bold' : 'text-text-secondary'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1 rounded-md ${language === 'fr' ? 'bg-emerald-600 text-white font-bold' : 'text-text-secondary'}`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={`px-2.5 py-1 rounded-md ${language === 'zh' ? 'bg-emerald-600 text-white font-bold' : 'text-text-secondary'}`}
              >
                中文
              </button>
            </div>
          </div>

          {/* Currency */}
          <div className="p-3.5 rounded-xl bg-surface-muted dark:bg-stone-800/60 border border-border-main dark:border-stone-700 flex items-center justify-between">
            <span className="text-text-primary dark:text-stone-200 font-medium">Financial Currency</span>
            <div className="flex space-x-1 font-mono">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md ${currency === 'USD' ? 'bg-emerald-600 text-white font-bold' : 'text-text-secondary'}`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={`px-2.5 py-1 rounded-md ${currency === 'EUR' ? 'bg-emerald-600 text-white font-bold' : 'text-text-secondary'}`}
              >
                EUR (€)
              </button>
            </div>
          </div>
        </div>

        {/* Reset progress button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              if (window.confirm('Reset all progress and scores to default?')) {
                resetProgress();
              }
            }}
            className="text-stone-400 hover:text-rose-600 text-[11px] font-mono flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
