import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  CheckCircle2,
  Volume2,
  ArrowRight,
  BookOpen,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { termsData } from '../../data/termsData';
import { Term, Category, Difficulty } from '../../types';
import { TermDetailModal } from './TermDetailModal';

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

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-secondary dark:text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 placeholder-text-secondary dark:placeholder-stone-500 focus:outline-emerald-500"
            />
          </div>

          {/* Quick Toggles: Bookmarked & Completed */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterSavedOnly((prev) => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1.5 ${
                filterSavedOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-surface-muted dark:bg-stone-800 text-text-secondary dark:text-stone-400 border-border-main dark:border-stone-700 hover:text-text-primary'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${filterSavedOnly ? 'fill-white' : ''}`} />
              <span>
                {language === 'fr' ? 'Favoris' : language === 'zh' ? '收藏夹' : 'Saved'} ({progress.savedTermIds.length})
              </span>
            </button>

            <button
              onClick={() => setFilterCompletedOnly((prev) => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1.5 ${
                filterCompletedOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-surface-muted dark:bg-stone-800 text-text-secondary dark:text-stone-400 border-border-main dark:border-stone-700 hover:text-text-primary'
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
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-surface-muted dark:bg-stone-800/80 text-text-secondary dark:text-stone-400 hover:text-text-primary hover:bg-stone-200 dark:hover:bg-stone-700'
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
              className={`p-5 rounded-3xl glass-panel glass-panel-hover cursor-pointer flex flex-col justify-between group ${
                isCompleted
                  ? 'border-emerald-500/40 dark:border-emerald-800/50'
                  : ''
              }`}
            >
              <div>
                {/* Micro Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-text-secondary dark:text-stone-400">
                      #{term.id}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {term.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => speak(`${term.canonical}. ${term.shortDef[language]}`, language)}
                      className="p-1 rounded-md text-text-secondary hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title="Pronounce"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleSaveTerm(term.id)}
                      className="p-1 rounded-md text-text-secondary hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title="Bookmark"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Canonical & Translation */}
                <h3 className="font-bold text-base text-text-primary dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {term.canonical}
                </h3>
                <p className="text-xs text-text-secondary dark:text-stone-400 font-mono mt-0.5 mb-2">
                  {language === 'fr' ? term.fr : term.zh}
                </p>

                {/* Short definition */}
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                  {term.shortDef[language]}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-border-main dark:border-stone-800 flex items-center justify-between text-xs">
                {isCompleted ? (
                  <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Validé' : language === 'zh' ? '已研习' : 'Mastered'}</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-text-secondary dark:text-stone-400">
                    +{75} XP
                  </span>
                )}

                <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>{language === 'fr' ? 'Leçon' : language === 'zh' ? '精讲' : 'Deep Lesson'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
