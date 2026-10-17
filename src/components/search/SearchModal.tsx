import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Brain, Gamepad2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { termsData } from '../../data/termsData';
import { psychologyPrinciples } from '../../data/psychologyData';
import { gamesData } from '../../data/gamesData';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    language,
    setActiveTab,
    setSelectedTermId,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return { terms: [], psychology: [], games: [] };
    const q = query.toLowerCase().trim();

    const matchedTerms = termsData
      .filter(
        (t) =>
          t.canonical.toLowerCase().includes(q) ||
          t.fr.toLowerCase().includes(q) ||
          t.zh.toLowerCase().includes(q) ||
          t.shortDef[language].toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
      .slice(0, 6);

    const matchedPsychology = psychologyPrinciples
      .filter(
        (p) =>
          p.name[language].toLowerCase().includes(q) ||
          p.definition[language].toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedGames = gamesData
      .filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.localizedTitle[language].toLowerCase().includes(q) ||
          g.objective[language].toLowerCase().includes(q)
      )
      .slice(0, 3);

    return {
      terms: matchedTerms,
      psychology: matchedPsychology,
      games: matchedGames,
    };
  }, [query, language]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-surface-main dark:bg-stone-900 rounded-2xl shadow-2xl border border-border-main dark:border-stone-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border-main dark:border-stone-800 space-x-3">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'fr'
                ? 'Rechercher un terme, une formule, un principe psychologique...'
                : language === 'zh'
                ? '搜索风投概念、测算公式、心理博弈法则...'
                : 'Search any venture term, cap table rule, psychology bias...'
            }
            className="w-full bg-transparent border-none outline-hidden text-sm md:text-base text-text-primary dark:text-stone-100 placeholder-text-secondary dark:placeholder-stone-500 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-text-secondary hover:text-text-primary dark:text-stone-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs px-2 py-1 rounded-md bg-surface-muted dark:bg-stone-800 text-text-secondary font-mono hover:text-text-primary"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className="text-center py-10 text-text-secondary dark:text-stone-400 text-xs">
              <p className="font-medium text-sm text-text-primary dark:text-stone-200 mb-1">
                {language === 'fr'
                  ? 'Recherche Globale Trilingue'
                  : language === 'zh'
                  ? '三语全局知识索引'
                  : 'Trilingual Global Academy Search'}
              </p>
              <p>
                {language === 'fr'
                  ? 'Tapez par exemple « SAFE », « Dilution », « Liquidation » ou « BATNA »'
                  : language === 'zh'
                  ? '输入如“SAFE”、“Dilution”、“清算优先权”或“BATNA”'
                  : 'Try typing "SAFE", "Liquidation", "Dilution", or "BATNA"'}
              </p>
            </div>
          )}

          {/* Matched Terms */}
          {results.terms.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-text-secondary dark:text-stone-400 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {language === 'fr'
                    ? 'Catalogue des Termes'
                    : language === 'zh'
                    ? '核心概念条目'
                    : 'Venture Catalog Terms'}
                </span>
              </div>
              <div className="space-y-1.5">
                {results.terms.map((term) => (
                  <div
                    key={term.id}
                    onClick={() => {
                      setSelectedTermId(term.id);
                      setActiveTab('learn');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800/60 hover:bg-emerald-500/10 dark:hover:bg-emerald-950/30 border border-transparent hover:border-emerald-500/30 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-text-primary dark:text-stone-100">
                          {term.canonical}
                        </span>
                        <span className="text-[11px] text-text-secondary dark:text-stone-400">
                          {language === 'fr' ? term.fr : language === 'zh' ? term.zh : ''}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                          {term.category}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary dark:text-stone-400 line-clamp-1 mt-0.5">
                        {term.shortDef[language]}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 opacity-60" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Psychology */}
          {results.psychology.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-text-secondary dark:text-stone-400 mb-2">
                <Brain className="w-3.5 h-3.5 text-purple-600" />
                <span>
                  {language === 'fr'
                    ? 'Principes Psychologiques'
                    : language === 'zh'
                    ? '谈判心理学与博弈'
                    : 'Psychology Principles'}
                </span>
              </div>
              <div className="space-y-1.5">
                {results.psychology.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveTab('psychology');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800/60 hover:bg-purple-500/10 dark:hover:bg-purple-950/30 border border-transparent hover:border-purple-500/30 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <p className="font-bold text-xs text-text-primary dark:text-stone-100">
                        {p.name[language]}
                      </p>
                      <p className="text-xs text-text-secondary dark:text-stone-400 line-clamp-1 mt-0.5">
                        {p.definition[language]}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-600 opacity-60" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Games */}
          {results.games.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-text-secondary dark:text-stone-400 mb-2">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {language === 'fr'
                    ? 'Jeux & Défis'
                    : language === 'zh'
                    ? '对决挑战游戏'
                    : 'Interactive Games'}
                </span>
              </div>
              <div className="space-y-1.5">
                {results.games.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      setActiveTab('games');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800/60 hover:bg-amber-500/10 dark:hover:bg-amber-950/30 border border-transparent hover:border-amber-500/30 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <p className="font-bold text-xs text-text-primary dark:text-stone-100">
                        {g.localizedTitle[language]}
                      </p>
                      <p className="text-xs text-text-secondary dark:text-stone-400 line-clamp-1 mt-0.5">
                        {g.objective[language]}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-600 opacity-60" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {query.trim() &&
            results.terms.length === 0 &&
            results.psychology.length === 0 &&
            results.games.length === 0 && (
              <div className="text-center py-10 text-text-secondary dark:text-stone-400 text-xs">
                {language === 'fr'
                  ? 'Aucun résultat trouvé pour cette recherche.'
                  : language === 'zh'
                  ? '未检索到相关概念或游戏。'
                  : 'No results found matching your query.'}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
