import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  CheckCircle2,
  Volume2,
  ArrowRight,
  BookOpen,
  SlidersHorizontal,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { termsData } from '../../data/termsData';
import { Term, Category, Difficulty } from '../../types';
import { TermDetailModal } from './TermDetailModal';
import { OverlappingCardStack } from '../common/OverlappingCardStack';
import { DOMAIN_STACKS_DATA } from '../../data/overlappingCardsData';
import { CurriculumAchievementDashboard } from './CurriculumAchievementDashboard';

const CATEGORIES: { id: Category; label: { en: string; fr: string; zh: string } }[] = [
  { id: 'all', label: { en: 'All 100 Terms', fr: 'Tous les 100 termes', zh: '全部100条目' } },
  { id: 'funding', label: { en: 'Funding & Rounds', fr: 'Financement & Tours', zh: '融资与轮次' } },
  { id: 'economics', label: { en: 'Economics & Valuation', fr: 'Économie & Valo', zh: '经济条款与估值' } },
  { id: 'captable', label: { en: 'Cap Table & Dilution', fr: 'Table de Cap & Dilution', zh: '股权架构与稀释' } },
  { id: 'convertibles', label: { en: 'SAFEs & Notes', fr: 'SAFEs & Convertibles', zh: 'SAFE与可转债' } },
  { id: 'control', label: { en: 'Board & Control', fr: 'Gouvernance & Contrôle', zh: '董事会与控制权' } },
  { id: 'protections', label: { en: 'Protections & Vetoes', fr: 'Protections & Vétos', zh: '保护条款与否决' } },
  { id: 'governance', label: { en: 'Agreements & Legal', fr: 'Pactes & Droit', zh: '协议与法务规范' } },
  { id: 'process', label: { en: 'Diligence & Closing', fr: 'Diligence & Clôture', zh: '尽调与交割流程' } },
  { id: 'negotiation', label: { en: 'Negotiation Strategy', fr: 'Stratégie de Négociation', zh: '谈判博弈策略' } },
];

export const LearnView: React.FC = () => {
  const {
    language,
    progress,
    selectedTermId,
    setSelectedTermId,
    toggleSaveTerm,
    speak,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [filterCompletedOnly, setFilterCompletedOnly] = useState(false);
  const [activeLearnStack, setActiveLearnStack] = useState<'courses' | 'bookmarks' | 'vocabulary'>('courses');

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return termsData.filter((term) => {
      // Category filter
      if (selectedCategory !== 'all' && term.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && term.difficulty !== selectedDifficulty) {
        return false;
      }

      // Saved filter
      if (filterSavedOnly && !progress.savedTermIds.includes(term.id)) {
        return false;
      }

      // Completed filter
      if (filterCompletedOnly && !progress.completedLessons.includes(term.id)) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesCanonical = term.canonical.toLowerCase().includes(q);
        const matchesFr = term.fr.toLowerCase().includes(q);
        const matchesZh = term.zh.toLowerCase().includes(q);
        const matchesDef = term.shortDef[language].toLowerCase().includes(q);
        const matchesId = term.id.toLowerCase().includes(q);
        return matchesCanonical || matchesFr || matchesZh || matchesDef || matchesId;
      }

      return true;
    });
  }, [
    selectedCategory,
    selectedDifficulty,
    filterSavedOnly,
    filterCompletedOnly,
    search,
    language,
    progress.savedTermIds,
    progress.completedLessons,
  ]);

  const activeModalTerm = useMemo(() => {
    if (!selectedTermId) return null;
    return termsData.find((t) => t.id === selectedTermId) || null;
  }, [selectedTermId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-mobile-nav">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-text-primary dark:text-stone-100 flex items-center space-x-2">
            <span>
              {language === 'fr'
                ? 'Catalogue des 100 Termes & 70 Leçons Clés'
                : language === 'zh'
                ? '风投100核心条目与70深度精讲'
                : '100 Venture Terms & 70 Deep Lessons'}
            </span>
          </h1>
          <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 max-w-2xl">
            {language === 'fr'
              ? 'Le corpus exhaustif des clauses, métriques de dilution, gouvernance et psychologie des deals VC.'
              : language === 'zh'
              ? '覆盖风投全生命周期：从种子轮SAFE到A轮定价、反稀释、清算瀑布与董事会治理的完整知识母库。'
              : 'Complete canonical catalogue of venture clauses, cap table mechanics, NVCA standards, and boardroom negotiation.'}
          </p>
        </div>

        {/* Progress pill */}
        <div className="flex items-center space-x-2 text-xs font-mono bg-surface-muted dark:bg-stone-800 p-2 rounded-xl border border-border-main dark:border-stone-700">
          <span className="text-text-secondary dark:text-stone-400">
            {language === 'fr' ? 'Progression :' : language === 'zh' ? '研习进度：' : 'Mastery:'}
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {progress.completedLessons.length} / 100
          </span>
          <div className="w-16 bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all"
              style={{
                width: `${(progress.completedLessons.length / 100) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Visual Progress Bar & Executive Achievement Dashboard */}
      <CurriculumAchievementDashboard
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onLaunchTerm={(termId) => setSelectedTermId(termId)}
      />

      {/* Interactive Overlapping Stacks: 课程分类 / 学习收藏 / 词汇集 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-surface-muted/90 dark:bg-stone-900 border border-border-main/70 dark:border-stone-800 text-xs">
            <button
              onClick={() => setActiveLearnStack('courses')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeLearnStack === 'courses'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>
                {language === 'fr' ? 'Filières de Cours' : language === 'zh' ? '课程分类叠放' : 'Course Tracks'}
              </span>
            </button>

            <button
              onClick={() => setActiveLearnStack('bookmarks')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeLearnStack === 'bookmarks'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>
                {language === 'fr' ? 'Favoris & Clauses' : language === 'zh' ? '学习收藏精选' : 'Bookmarks'}
              </span>
            </button>

            <button
              onClick={() => setActiveLearnStack('vocabulary')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeLearnStack === 'vocabulary'
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {language === 'fr' ? 'Packs Vocabulaire' : language === 'zh' ? '词汇集叠放' : 'Vocab Sets'}
              </span>
            </button>
          </div>
        </div>

        <OverlappingCardStack
          key={activeLearnStack}
          cards={DOMAIN_STACKS_DATA[activeLearnStack].cards}
          title={DOMAIN_STACKS_DATA[activeLearnStack].title}
          subtitle={DOMAIN_STACKS_DATA[activeLearnStack].subtitle}
          domainLabel={DOMAIN_STACKS_DATA[activeLearnStack].title}
          accentColor={DOMAIN_STACKS_DATA[activeLearnStack].accent}
          direction="horizontal"
          overlapPercent={33}
          onCardAction={(card) => {
            // If user clicks a bookmarked clause, can also search for it
            if (activeLearnStack === 'bookmarks' && card.title) {
              setSearch(card.title.en);
            }
          }}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel border-sophisticated p-4 sm:p-5 rounded-3xl space-y-3.5 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-secondary dark:text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                language === 'fr'
                  ? 'Rechercher par nom, équivalent français, ID ou mot-clé...'
                  : language === 'zh'
                  ? '按英文术语、中文名称、ID或关键词检索...'
                  : 'Search by canonical term, translation, ID or keyword...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-muted/90 dark:bg-stone-900/90 border border-border-main/80 dark:border-stone-700/80 text-xs text-text-primary dark:text-stone-100 placeholder-text-secondary dark:placeholder-stone-500 focus:outline-none focus:border-amber-400/80 transition-colors shadow-inner"
            />
          </div>

          {/* Quick Toggles: Bookmarked & Completed */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterSavedOnly((prev) => !prev)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-medium border transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95 ${
                filterSavedOnly
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-950/20'
                  : 'glass-panel border-sophisticated text-text-secondary dark:text-stone-300 hover:text-amber-500 hover:border-amber-400/50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${filterSavedOnly ? 'fill-stone-950' : ''}`} />
              <span>
                {language === 'fr' ? 'Favoris' : language === 'zh' ? '收藏夹' : 'Saved'} ({progress.savedTermIds.length})
              </span>
            </button>

            <button
              onClick={() => setFilterCompletedOnly((prev) => !prev)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-medium border transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95 ${
                filterCompletedOnly
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold border-emerald-400 shadow-md shadow-emerald-950/20'
                  : 'glass-panel border-sophisticated text-text-secondary dark:text-stone-300 hover:text-emerald-500 hover:border-emerald-400/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {language === 'fr' ? 'Maîtrisés' : language === 'zh' ? '已掌握' : 'Done'} ({progress.completedLessons.length})
              </span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-xs'
                  : 'bg-surface-muted/60 dark:bg-stone-800/60 border border-border-main/50 dark:border-stone-700/50 text-text-secondary dark:text-stone-400 hover:text-text-primary hover:border-amber-400/30'
              }`}
            >
              {cat.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-text-secondary dark:text-stone-400 font-mono px-1">
        <span>
          {filteredTerms.length}{' '}
          {language === 'fr' ? 'termes répertoriés' : language === 'zh' ? '个条目' : 'terms matching filters'}
        </span>
      </div>

      {/* Grid of 100 Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((term) => {
          const isCompleted = progress.completedLessons.includes(term.id);
          const isSaved = progress.savedTermIds.includes(term.id);

          return (
            <div
              key={term.id}
              onClick={() => setSelectedTermId(term.id)}
              className={`p-6 sm:p-7 rounded-3xl cursor-pointer flex flex-col justify-between group transition-all duration-300 relative overflow-hidden bg-gradient-to-b from-[#161A2E]/95 via-[#0F1325]/95 to-[#090C1A]/98 border border-white/15 hover:border-amber-400/60 shadow-[0_12px_36px_rgba(0,0,0,0.7)] hover:shadow-[0_16px_44px_rgba(217,119,6,0.22)] ${
                isCompleted
                  ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-[#0E1624]/95 to-[#080D18]'
                  : isSaved
                  ? 'border-amber-400/60 bg-gradient-to-br from-amber-950/40 via-[#161324]/95 to-[#0D0B18]'
                  : ''
              }`}
            >
              {/* Subtle top-right golden accent light */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-400/15 to-transparent rounded-bl-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Micro Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      #{term.id}
                    </span>
                    <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/[0.08] text-stone-200 border border-white/15 font-semibold">
                      {term.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => speak(`${term.canonical}. ${term.shortDef[language]}`, language)}
                      className="p-2 rounded-xl text-stone-300 hover:text-amber-300 hover:bg-white/10 transition-colors"
                      title="Pronounce"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleSaveTerm(term.id)}
                      className="p-2 rounded-xl text-stone-300 hover:text-amber-300 hover:bg-white/10 transition-colors"
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Canonical & Translation */}
                <h3 className="font-serif-luxury font-bold text-lg sm:text-xl md:text-2xl text-white group-hover:text-amber-200 transition-colors tracking-tight leading-snug">
                  {term.canonical}
                </h3>
                <p className="text-sm sm:text-base text-amber-300 font-mono font-semibold mt-1 mb-3">
                  {language === 'fr' ? term.fr : term.zh}
                </p>

                {/* Short definition */}
                <p className="text-sm sm:text-base text-stone-100 leading-relaxed font-medium line-clamp-3">
                  {term.shortDef[language]}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs sm:text-sm">
                {isCompleted ? (
                  <span className="flex items-center space-x-1.5 text-emerald-300 font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'fr' ? 'Validé' : language === 'zh' ? '已掌握' : 'Mastered'}</span>
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm font-mono font-bold text-amber-200">
                    +{75} XP
                  </span>
                )}

                <div className="flex items-center space-x-1.5 text-amber-300 font-bold group-hover:translate-x-1.5 transition-transform">
                  <span>{language === 'fr' ? 'Leçon' : language === 'zh' ? '精讲' : 'Deep Lesson'}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal View for Deep Lesson */}
      {activeModalTerm && (
        <TermDetailModal
          term={activeModalTerm}
          onClose={() => setSelectedTermId(null)}
          onSelectRelated={(relatedId) => setSelectedTermId(relatedId)}
        />
      )}
    </div>
  );
};
