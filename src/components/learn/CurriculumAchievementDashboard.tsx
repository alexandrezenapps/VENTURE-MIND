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
    <div className="rounded-3xl bg-gradient-to-br from-[#0F1326] via-[#14182E] to-[#0A0D1A] border border-amber-400/35 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden transition-all duration-300 text-stone-100">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
              {language === 'fr'
                ? 'Tableau de Bord Pédagogique'
                : language === 'zh'
                ? '创投研习成就看板'
                : 'Curriculum Mastery Dashboard'}
            </span>
            <span className="text-sm sm:text-base text-stone-200 font-mono font-medium">
              Level {progress.level} • {progress.levelName[language]}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif-luxury text-white flex items-center space-x-3 drop-shadow-sm">
            <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
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
          <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-amber-400/30 text-right shadow-md">
            <div className="text-xs uppercase font-mono text-stone-300 font-medium">
              {language === 'zh' ? '总研习完成度' : 'Overall Completion'}
            </div>
            <div className="text-base sm:text-lg md:text-xl font-bold font-mono text-amber-300 flex items-center justify-end space-x-2">
              <span>{completedCount} / {totalTerms}</span>
              <span className="text-sm sm:text-base text-emerald-400 font-bold">({overallPercentage}%)</span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-amber-400/20 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Dashboard' : 'Expand Dashboard'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-300" /> : <ChevronDown className="w-5 h-5 text-amber-300" />}
          </button>
        </div>
      </div>

      {/* Main Master Visual Progress Bar */}
      <div className="mt-6 space-y-2.5 relative z-10">
        <div className="flex justify-between items-center text-sm sm:text-base font-serif-luxury font-medium">
          <span className="text-stone-100">
            {language === 'fr'
              ? 'Parcours des 100 Termes & Clauses Clés'
              : language === 'zh'
              ? '100条风投契约与治理全图谱里程碑'
              : '100 Canonical Clauses & Mechanics Roadmap'}
          </span>
          <span className="text-amber-300 font-mono font-bold text-sm sm:text-base">
            {totalTerms - completedCount}{' '}
            {language === 'zh' ? '条待研习' : 'Remaining'}
          </span>
        </div>

        {/* High-visibility multi-stage progress track */}
        <div className="relative w-full h-4 bg-stone-950 rounded-full border border-amber-400/30 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-indigo-500 transition-all duration-700 shadow-md relative"
            style={{ width: `${Math.max(2, overallPercentage)}%` }}
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 bg-white/25 animate-pulse" />
          </div>
        </div>

        {/* Milestone Steps Markers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2.5">
          {milestones.map((m) => {
            const isCurrent = completedCount < m.required && (m.required === 25 || completedCount >= m.required - 25);
            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition-all text-xs sm:text-sm ${
                  m.isUnlocked
                    ? 'bg-gradient-to-b from-[#152B24] to-[#0D1B16] border-emerald-400/50 text-emerald-300 shadow-lg'
                    : isCurrent
                    ? 'bg-gradient-to-b from-[#2E2413] to-[#1A140B] border-amber-400/60 text-amber-300 shadow-xl'
                    : 'bg-black/40 border-stone-800 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-amber-200 border border-amber-400/20">
                    {m.range}
                  </span>
                </div>
                <div className="font-bold truncate mt-2 text-sm sm:text-base font-serif-luxury text-white">
                  {m.title[language]}
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono mt-1.5 text-stone-200 font-medium">
                  <span>{m.isUnlocked ? (language === 'zh' ? '已达成' : 'Unlocked') : isCurrent ? (language === 'zh' ? '进行中' : 'In Progress') : (language === 'zh' ? '未解锁' : 'Locked')}</span>
                  <span className="text-amber-300 font-bold">{Math.min(completedCount, m.required)}/{m.required}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Tabs: Category Progress & Unlocked VC Badges */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-amber-400/20 space-y-5 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* View Switcher: Categories vs Badges */}
            <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-black/60 border border-amber-400/30 text-xs sm:text-sm">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 rounded-xl font-bold font-serif-luxury transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
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
                className={`px-4 py-2 rounded-xl font-bold font-serif-luxury transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
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
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm font-serif-luxury flex items-center space-x-2 transition-all self-start sm:self-auto cursor-pointer shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {language === 'zh'
                    ? `研习下一讲：${nextLesson.zh}`
                    : `Continue: ${nextLesson.canonical}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tab 1: 9 Category Progress Grid */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {categoryStats.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => onSelectCategory?.(cat.id)}
                    className="p-4 rounded-2xl bg-[#12162A]/90 border border-amber-400/25 hover:border-amber-400/60 hover:bg-[#181D35] transition-all cursor-pointer group shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-sm sm:text-base font-serif-luxury text-white group-hover:text-amber-300 transition-colors">
                          {cat.label[language]}
                        </div>
                      </div>
                      <span className="text-sm sm:text-base font-mono font-bold" style={{ color: cat.color }}>
                        {cat.percentage}%
                      </span>
                    </div>

                    {/* Progress Mini Bar */}
                    <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden mb-2 border border-stone-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(2, cat.percentage)}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-stone-200">
                      <span>{cat.done} / {cat.total} {language === 'zh' ? '条目完成' : 'mastered'}</span>
                      <span className="text-amber-300 font-bold group-hover:translate-x-1 transition-transform">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((ach) => {
                const IconComp = ach.icon;
                return (
                  <div
                    key={ach.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-[#1C1A35] via-[#241E3A] to-[#141226] border-2 border-amber-400/60 shadow-[0_10px_30px_rgba(245,158,11,0.22)]'
                        : 'bg-gradient-to-br from-[#121528]/95 to-[#0A0D18]/95 border border-amber-400/20 opacity-90'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                          ach.unlocked
                            ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_0_16px_rgba(251,191,36,0.5)]'
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                        }`}
                      >
                        {ach.unlocked ? <IconComp className="w-6 h-6 text-stone-950" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-base sm:text-lg font-serif-luxury text-white truncate">
                            {ach.name[language]}
                          </h4>
                          <span
                            className={`text-xs sm:text-sm font-mono font-bold px-2 py-0.5 rounded-md ${
                              ach.unlocked
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                : 'bg-stone-800 text-stone-300 border border-stone-700'
                            }`}
                          >
                            {ach.progressText}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-stone-100 leading-relaxed font-medium">
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
