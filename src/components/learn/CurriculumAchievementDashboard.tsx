import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookOpen,
  PieChart,
  Scale,
  DollarSign,
  FileText,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { termsData } from '../../data/termsData';
import { Category } from '../../types';

interface CurriculumAchievementDashboardProps {
  onSelectCategory?: (category: Category) => void;
  onLaunchTerm?: (termId: string) => void;
}

const CATEGORY_META: {
  id: Category;
  label: { en: string; fr: string; zh: string };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  { id: 'funding', label: { en: 'Funding & Rounds', fr: 'Financement & Tours', zh: '融资与轮次' }, icon: DollarSign, color: '#3B82F6' },
  { id: 'economics', label: { en: 'Deal Economics', fr: 'Économie & Valo', zh: '经济条款与估值' }, icon: TrendingUp, color: '#10B981' },
  { id: 'captable', label: { en: 'Cap Table & Dilution', fr: 'Table de Cap & Dilution', zh: '股权架构与稀释' }, icon: PieChart, color: '#F59E0B' },
  { id: 'convertibles', label: { en: 'SAFEs & Notes', fr: 'SAFEs & Convertibles', zh: 'SAFE与可转债' }, icon: Zap, color: '#EC4899' },
  { id: 'control', label: { en: 'Board & Control', fr: 'Gouvernance & Contrôle', zh: '董事会与控制权' }, icon: ShieldCheck, color: '#8B5CF6' },
  { id: 'protections', label: { en: 'Protections & Vetoes', fr: 'Protections & Vétos', zh: '保护条款与否决' }, icon: Scale, color: '#06B6D4' },
  { id: 'governance', label: { en: 'Agreements & Legal', fr: 'Pactes & Droit', zh: '协议与法务规范' }, icon: FileText, color: '#6366F1' },
  { id: 'process', label: { en: 'Diligence & Closing', fr: 'Diligence & Clôture', zh: '尽调与交割流程' }, icon: BookOpen, color: '#14B8A6' },
  { id: 'negotiation', label: { en: 'Negotiation Strategy', fr: 'Stratégie de Négociation', zh: '谈判博弈策略' }, icon: Users, color: '#F97316' },
];

export const CurriculumAchievementDashboard: React.FC<CurriculumAchievementDashboardProps> = ({
  onSelectCategory,
  onLaunchTerm,
}) => {
  const { language, progress } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'achievements'>('categories');

  const totalTerms = termsData.length; // 100
  const completedCount = progress.completedLessons.length;
  const overallPercentage = Math.round((completedCount / totalTerms) * 100);

  // Next uncompleted lesson to recommend
  const nextLesson = useMemo(() => {
    return termsData.find((t) => !progress.completedLessons.includes(t.id)) || termsData[0];
  }, [progress.completedLessons]);

  // Breakdown by category
  const categoryStats = useMemo(() => {
    return CATEGORY_META.map((cat) => {
      const categoryTerms = termsData.filter((t) => t.category === cat.id);
      const doneInCategory = categoryTerms.filter((t) => progress.completedLessons.includes(t.id)).length;
      const total = categoryTerms.length;
      const pct = total > 0 ? Math.round((doneInCategory / total) * 100) : 0;
      return {
        ...cat,
        total,
        done: doneInCategory,
        percentage: pct,
      };
    });
  }, [progress.completedLessons]);

  // Milestone Tiers
  const milestones = [
    {
      id: 'tier_1',
      title: { en: 'Associate Foundations', fr: 'Fondations Associé', zh: '初级分析师筑基' },
      range: '1 - 25',
      required: 25,
      isUnlocked: completedCount >= 25,
      icon: '🥉',
    },
    {
      id: 'tier_2',
      title: { en: 'Principal Dealmaker', fr: 'Négociateur Principal', zh: '资深投资人精进' },
      range: '26 - 50',
      required: 50,
      isUnlocked: completedCount >= 50,
      icon: '🥈',
    },
    {
      id: 'tier_3',
      title: { en: 'Managing Director', fr: 'Directeur Général', zh: '管理合伙人实战' },
      range: '51 - 75',
      required: 75,
      isUnlocked: completedCount >= 75,
      icon: '🥇',
    },
    {
      id: 'tier_4',
      title: { en: 'General Partner Centurion', fr: 'General Partner Centurion', zh: 'GP合伙人百题殿堂' },
      range: '76 - 100',
      required: 100,
      isUnlocked: completedCount >= 100,
      icon: '💎',
    },
  ];

  // Specific Venture Achievements
  const achievements = useMemo(() => {
    const isSafeDone = termsData
      .filter((t) => t.category === 'convertibles')
      .every((t) => progress.completedLessons.includes(t.id));
    const isControlDone = termsData
      .filter((t) => t.category === 'control' || t.category === 'protections')
      .every((t) => progress.completedLessons.includes(t.id));
    const isCapTableDone = termsData
      .filter((t) => t.category === 'captable')
      .every((t) => progress.completedLessons.includes(t.id));

    return [
      {
        id: 'first_deal',
        name: { en: 'First Ink', fr: 'Première Signature', zh: '初试锋芒' },
        desc: { en: 'Complete your first venture term lesson.', fr: 'Terminer votre première leçon VC.', zh: '完成首个创投核心条目研习' },
        icon: Sparkles,
        unlocked: completedCount >= 1,
        progressText: `${Math.min(completedCount, 1)} / 1`,
      },
      {
        id: 'safe_architect',
        name: { en: 'SAFE Architect', fr: 'Architecte SAFE', zh: 'SAFE协议架构师' },
        desc: { en: 'Master all SAFE & convertible note mechanics.', fr: 'Maîtriser tous les mécanismes de convertibles.', zh: '通盘掌握全套SAFE与可转债估值顶/折价机制' },
        icon: Zap,
        unlocked: isSafeDone,
        progressText: `${categoryStats.find((c) => c.id === 'convertibles')?.done || 0} / ${categoryStats.find((c) => c.id === 'convertibles')?.total || 0}`,
      },
      {
        id: 'boardroom_guardian',
        name: { en: 'Boardroom Guardian', fr: 'Gardien du Conseil', zh: '董事会席位守门人' },
        desc: { en: 'Complete all Board & Veto control rights.', fr: 'Compléter tous les droits de véto et de contrôle.', zh: '攻克全部保护性否决权与董事会席位分配法则' },
        icon: ShieldCheck,
        unlocked: isControlDone,
        progressText: `${(categoryStats.find((c) => c.id === 'control')?.done || 0) + (categoryStats.find((c) => c.id === 'protections')?.done || 0)} / ${(categoryStats.find((c) => c.id === 'control')?.total || 0) + (categoryStats.find((c) => c.id === 'protections')?.total || 0)}`,
      },
      {
        id: 'cap_table_master',
        name: { en: 'Cap Table Quant', fr: 'Maître Table de Cap', zh: '股权架构精算师' },
        desc: { en: 'Master all cap table and dilution formulas.', fr: 'Maîtriser la dilution et les pools d’options.', zh: '精通多轮股权稀释与期权池洗牌推演' },
        icon: PieChart,
        unlocked: isCapTableDone,
        progressText: `${categoryStats.find((c) => c.id === 'captable')?.done || 0} / ${categoryStats.find((c) => c.id === 'captable')?.total || 0}`,
      },
      {
        id: 'century_fellow',
        name: { en: 'Centurion Master', fr: 'Centurion Master', zh: '百强VC学者' },
        desc: { en: 'Complete all 100 curriculum terms.', fr: 'Terminer l’intégralité des 100 leçons.', zh: '通关全部100个风投核心条目' },
        icon: Trophy,
        unlocked: completedCount >= 100,
        progressText: `${completedCount} / 100`,
      },
    ];
  }, [completedCount, categoryStats, progress.completedLessons]);

  return (
    <div className="rounded-3xl glass-panel border-sophisticated p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-400/30">
              {language === 'fr'
                ? 'Tableau de Bord Pédagogique'
                : language === 'zh'
                ? '创投研习成就看板'
                : 'Curriculum Mastery Dashboard'}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Level {progress.level} • {progress.levelName[language]}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-text-primary dark:text-stone-100 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>
              {language === 'fr'
                ? 'Progression du Cursus & Jalons Exécutifs'
                : language === 'zh'
                ? '风投学术大纲研习进度与荣誉殿堂'
                : 'VC Curriculum Progress & Executive Milestones'}
            </span>
          </h2>
        </div>

        {/* Global Progress Pill & Expand Toggle */}
        <div className="flex items-center space-x-3 self-start sm:self-center">
          <div className="px-3.5 py-2 rounded-2xl bg-surface-muted/80 dark:bg-stone-900 border border-border-main dark:border-stone-800 text-right">
            <div className="text-[10px] uppercase font-mono text-stone-400">
              {language === 'zh' ? '总研习完成度' : 'Overall Completion'}
            </div>
            <div className="text-sm font-bold font-mono text-emerald-400 flex items-center justify-end space-x-1.5">
              <span>{completedCount} / {totalTerms}</span>
              <span className="text-xs text-amber-400">({overallPercentage}%)</span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-surface-muted/60 dark:bg-stone-800 hover:bg-stone-700/60 text-stone-300 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Dashboard' : 'Expand Dashboard'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Master Visual Progress Bar */}
      <div className="mt-5 space-y-2 relative z-10">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-stone-300 font-medium">
            {language === 'fr'
              ? 'Parcours des 100 Termes & Clauses Clés'
              : language === 'zh'
              ? '100条风投契约与治理全图谱里程碑'
              : '100 Canonical Clauses & Mechanics Roadmap'}
          </span>
          <span className="text-amber-400 font-bold">
            {totalTerms - completedCount}{' '}
            {language === 'zh' ? '条待研习' : 'Remaining'}
          </span>
        </div>

        {/* High-visibility multi-stage progress track */}
        <div className="relative w-full h-3.5 bg-stone-950/80 rounded-full border border-stone-800 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-indigo-500 transition-all duration-700 shadow-md relative"
            style={{ width: `${Math.max(2, overallPercentage)}%` }}
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Milestone Steps Markers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {milestones.map((m) => {
            const isCurrent = completedCount < m.required && (m.required === 25 || completedCount >= m.required - 25);
            return (
              <div
                key={m.id}
                className={`p-2.5 rounded-2xl border transition-all text-xs ${
                  m.isUnlocked
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-md'
                    : 'bg-stone-900/40 border-stone-800/80 text-stone-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{m.icon}</span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-stone-800/70">
                    {m.range}
                  </span>
                </div>
                <div className="font-bold truncate mt-1 text-text-primary dark:text-stone-200">
                  {m.title[language]}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-stone-400">
                  <span>{m.isUnlocked ? (language === 'zh' ? '已达成' : 'Unlocked') : isCurrent ? (language === 'zh' ? '进行中' : 'In Progress') : (language === 'zh' ? '未解锁' : 'Locked')}</span>
                  <span>{Math.min(completedCount, m.required)}/{m.required}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Tabs: Category Progress & Unlocked VC Badges */}
      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-border-main/50 dark:border-stone-800/80 space-y-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* View Switcher: Categories vs Badges */}
            <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-surface-muted/90 dark:bg-stone-900 border border-border-main dark:border-stone-800 text-xs">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {language === 'fr'
                    ? 'Progression par Thématique (9 Domaines)'
                    : language === 'zh'
                    ? '九大创投模块研习进度'
                    : 'Category Breakdown (9 Domains)'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>
                  {language === 'fr'
                    ? 'Trophées & Badges VC'
                    : language === 'zh'
                    ? '荣誉徽章与成就'
                    : 'VC Mastery Badges'}
                </span>
              </button>
            </div>

            {/* Direct Continue Learning Next Lesson Button */}
            {nextLesson && (
              <button
                onClick={() => onLaunchTerm?.(nextLesson.id)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'zh'
                    ? `研习下一讲：${nextLesson.zh}`
                    : `Continue: ${nextLesson.canonical}`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tab 1: 9 Category Progress Grid */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryStats.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => onSelectCategory?.(cat.id)}
                    className="p-3 rounded-2xl bg-surface-muted/50 dark:bg-stone-900/50 border border-border-main/70 dark:border-stone-800/80 hover:border-amber-400/50 hover:bg-amber-500/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-xs text-text-primary dark:text-stone-200 group-hover:text-amber-400 transition-colors">
                          {cat.label[language]}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold" style={{ color: cat.color }}>
                        {cat.percentage}%
                      </span>
                    </div>

                    {/* Progress Mini Bar */}
                    <div className="w-full bg-stone-950 h-1.5 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(2, cat.percentage)}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                      <span>{cat.done} / {cat.total} {language === 'zh' ? '条目完成' : 'mastered'}</span>
                      <span className="text-stone-500 group-hover:text-stone-300 transition-colors">
                        {language === 'zh' ? '点击筛选 →' : 'Filter →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Achievements & Trophy Shelf */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {achievements.map((ach) => {
                const IconComp = ach.icon;
                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      ach.unlocked
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                        : 'bg-surface-muted/40 dark:bg-stone-900/30 border-border-main/60 dark:border-stone-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          ach.unlocked
                            ? 'bg-amber-400 text-stone-950 font-bold'
                            : 'bg-stone-800 text-stone-500'
                        }`}
                      >
                        {ach.unlocked ? <IconComp className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-text-primary dark:text-stone-100 truncate">
                            {ach.name[language]}
                          </h4>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              ach.unlocked
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            {ach.progressText}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary dark:text-stone-400 leading-snug">
                          {ach.desc[language]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
