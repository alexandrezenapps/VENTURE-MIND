import React from 'react';
import {
  Menu,
  Search,
  Flame,
  Globe,
  DollarSign,
  Euro,
  GraduationCap,
  Sparkles,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Layers,
  Aperture,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopBar: React.FC<{ onOpenSidebar: () => void }> = ({ onOpenSidebar }) => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    progress,
    setIsSearchModalOpen,
    activeTab,
    setActiveTab,
    darkMode,
    toggleDarkMode,
    isOpeningPortalOpen,
    setIsOpeningPortalOpen,
    isCardStackModalOpen,
    setIsCardStackModalOpen,
    isAudioMuted,
    toggleAudioMute,
    isSpeaking,
    stopVoice,
  } = useApp();

  return (
    <header className="h-16 px-3 sm:px-6 md:px-8 border-b border-border-main/70 dark:border-amber-400/15 bg-surface-main/85 dark:bg-[#111425]/85 backdrop-blur-2xl sticky top-0 z-30 flex items-center justify-between shadow-[0_4px_24px_-2px_rgba(0,0,0,0.1),0_1px_2px_rgba(229,184,66,0.06)]">
      {/* Left side: Mobile Brand & Hamburger & Search */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-muted dark:hover:bg-stone-800 active:scale-95 transition-all"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Mini Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="lg:hidden flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 via-amber-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-heading font-extrabold text-xs tracking-tight text-text-primary dark:text-stone-100 hidden sm:inline">
            VENTURE MIND
          </span>
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-muted/80 dark:bg-stone-800/80 text-text-secondary dark:text-stone-400 text-xs border border-border-main/50 dark:border-stone-700/60 hover:border-amber-500/50 transition-all w-28 sm:w-56 md:w-72"
        >
          <Search className="w-3.5 h-3.5 text-text-secondary dark:text-stone-400 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">
            {language === 'fr'
              ? 'Rechercher...'
              : language === 'zh'
              ? '全局搜索...'
              : 'Search terms, games...'}
          </span>
          <kbd className="hidden md:inline-block ml-auto text-[10px] font-mono bg-surface-main dark:bg-stone-900 px-1.5 py-0.5 rounded-md border border-border-main dark:border-stone-700 text-stone-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Audio, Theme, Trilingual Switch, Currency & Level */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5">
        {/* Quick Zen Composure Sanctuary Button */}
        <button
          onClick={() => setActiveTab('mindfulness')}
          className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs transition-all active:scale-95 cursor-pointer ${
            activeTab === 'mindfulness'
              ? 'bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/10 border-amber-400 text-amber-400 font-bold shadow-xs'
              : 'bg-surface-muted/60 dark:bg-stone-800/60 border-border-main/60 dark:border-stone-700/60 text-text-secondary dark:text-stone-300 hover:border-amber-400/50 hover:text-amber-400'
          }`}
          title="Open Mindfulness & Composure Sanctuary"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline font-medium text-[11px]">
            {language === 'fr' ? 'Sanctuaire Zen' : language === 'zh' ? '正念静心' : 'Mindful Zen'}
          </span>
        </button>

        {/* Artistic Opening Portal Button */}
        <button
          onClick={() => setIsOpeningPortalOpen(true)}
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
          title="Open Immersive Opening Art Portal (VENTURE MIND Knockout Cover)"
        >
          <Aperture className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline font-medium text-[11px]">
            {language === 'fr' ? 'Portail d’Art' : language === 'zh' ? '艺术主页' : 'Art Portal'}
          </span>
        </button>

        {/* Overlapping Stacks Deck Showcase Button */}
        <button
          onClick={() => setIsCardStackModalOpen(true)}
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
          title="Open Overlapping Stacks Deck Showcase (Courses, Bookmarks, Vocabulary, Profile)"
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline font-medium text-[11px]">
            {language === 'fr' ? 'Cartes 1/3' : language === 'zh' ? '叠放卡组' : 'Stacks'}
          </span>
        </button>

        {/* Audio Mute / Unmute Button */}
        <button
          onClick={toggleAudioMute}
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Voice Audio'}
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-muted dark:hover:bg-stone-800 active:scale-95 transition-all"
        >
          {isAudioMuted ? (
            <VolumeX className="w-4 h-4 text-stone-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
          )}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          title="Toggle Theme"
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-muted dark:hover:bg-stone-800 active:scale-95 transition-all"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-stone-600" />
          )}
        </button>

        {/* Currency Switcher (Tablet & Desktop) */}
        <div className="hidden sm:flex items-center bg-surface-muted/90 dark:bg-stone-800/90 p-0.5 rounded-xl border border-border-main dark:border-stone-700 text-xs font-mono">
          <button
            onClick={() => setCurrency('USD')}
            className={`px-2 py-1 rounded-lg transition-all ${
              currency === 'USD'
                ? 'bg-surface-main dark:bg-stone-900 text-text-primary dark:text-stone-100 font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            $
          </button>
          <button
            onClick={() => setCurrency('EUR')}
            className={`px-2 py-1 rounded-lg transition-all ${
              currency === 'EUR'
                ? 'bg-surface-main dark:bg-stone-900 text-text-primary dark:text-stone-100 font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            €
          </button>
        </div>

        {/* Trilingual Language Selector */}
        <div className="flex items-center bg-surface-muted/90 dark:bg-stone-800/90 p-0.5 rounded-xl border border-border-main dark:border-stone-700 text-xs font-mono">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-lg transition-all text-[11px] ${
              language === 'en'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('fr')}
            className={`px-2 py-1 rounded-lg transition-all text-[11px] ${
              language === 'fr'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            FR
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`px-2 py-1 rounded-lg transition-all text-[11px] ${
              language === 'zh'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            中
          </button>
        </div>

        {/* Streak Flame */}
        <div
          title={`${progress.streakDays} day dealmaking streak`}
          className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-mono font-bold"
        >
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{progress.streakDays}d</span>
        </div>

        {/* Level Avatar Pill */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center space-x-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-purple-500/10 border border-white/10 dark:border-white/5 hover:border-emerald-500/50 transition-all active:scale-95"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-[10px] font-bold font-mono shadow-xs">
            {progress.level}
          </div>
          <span className="hidden md:inline-block text-xs font-semibold text-text-primary dark:text-stone-200">
            {progress.levelName[language]}
          </span>
        </button>
      </div>
    </header>
  );
};
