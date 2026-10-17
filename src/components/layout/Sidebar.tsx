import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Gamepad2,
  Sliders,
  Flame,
  FileSpreadsheet,
  GraduationCap,
  User,
  ShieldCheck,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';

interface NavItem {
  id: NavTab;
  label: { en: string; fr: string; zh: string };
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeTab,
    setActiveTab,
    language,
    progress,
    darkMode,
    toggleDarkMode,
    isAudioMuted,
    toggleAudioMute,
    isSpeaking,
    stopVoice,
  } = useApp();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: { en: 'Dashboard', fr: 'Tableau de bord', zh: '仪表盘' },
      icon: LayoutDashboard,
    },
    {
      id: 'learn',
      label: { en: 'Catalogue & Lessons', fr: 'Catalogue & Leçons', zh: '核心词典与精讲' },
      icon: BookOpen,
      badge: '100',
    },
    {
      id: 'mindfulness',
      label: { en: 'Mindful Sanctuary', fr: 'Sanctuaire Zen', zh: '正念定力之境' },
      icon: Sparkles,
      badge: 'Zen',
    },
    {
      id: 'psychology',
      label: { en: 'Psychology Radar', fr: 'Radar Psychologique', zh: '心理学与博弈' },
      icon: Brain,
      badge: '100',
    },
    {
      id: 'games',
      label: { en: 'Deal Games', fr: 'Jeux d’Affaires', zh: '对决游戏' },
      icon: Gamepad2,
      badge: '20',
    },
    {
      id: 'simulators',
      label: { en: 'Simulators Hub', fr: 'Simulateurs Financiers', zh: '金融沙盘推演' },
      icon: Sliders,
    },
    {
      id: 'negotiation',
      label: { en: 'AI Investor Negotiation', fr: 'Négociation VC Directe', zh: 'AI投资人实战博弈' },
      icon: Flame,
    },
    {
      id: 'termsheet',
      label: { en: 'Term Sheet Analyzer', fr: 'Analyseur de Term Sheet', zh: '意向书雷达排查' },
      icon: FileSpreadsheet,
    },
    {
      id: 'exam',
      label: { en: 'Final Exam (100Q)', fr: 'Examen Final (100Q)', zh: '结业百题大考' },
      icon: GraduationCap,
    },
    {
      id: 'profile',
      label: { en: 'Profile & Venture IQ', fr: 'Profil & Venture IQ', zh: '个人档案与能力' },
      icon: User,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-surface-main dark:bg-stone-900 border-r border-border-main dark:border-stone-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-border-main dark:border-stone-800 flex items-center justify-between">
          <div
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => {
              setActiveTab('dashboard');
              onClose();
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm tracking-tight text-text-primary dark:text-stone-100 flex items-center space-x-1.5">
                <span>VENTURE MIND</span>
              </div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-text-secondary dark:text-stone-400">
                Academy & Lab
              </p>
            </div>
          </div>
        </div>

        {/* Venture IQ Mini Badge */}
        <div className="mx-4 mt-3 p-3 rounded-xl bg-surface-muted dark:bg-stone-800/80 border border-border-main dark:border-stone-700/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-secondary dark:text-stone-400">
              Venture IQ
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              Lv. {progress.level}
            </span>
          </div>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-text-primary dark:text-stone-100">
              {progress.ventureIQ}
            </span>
            <span className="text-[11px] text-text-secondary dark:text-stone-400">
              / 180
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  (progress.currentXP / progress.targetXP) * 100
                )}%`,
              }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-text-secondary dark:text-stone-400">
            <span>{progress.currentXP} XP</span>
            <span>{progress.targetXP} XP</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'text-text-secondary dark:text-stone-400 hover:text-text-primary dark:hover:text-stone-100 hover:bg-surface-muted dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-text-secondary dark:text-stone-400 group-hover:text-text-primary dark:group-hover:text-stone-200'
                    }`}
                  />
                  <span className="truncate">{item.label[language]}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Global Controls & Guardrails Disclaimer */}
        <div className="p-3 border-t border-border-main dark:border-stone-800 space-y-2">
          {/* Audio & Theme Quick Bar */}
          <div className="flex items-center justify-between px-2 py-1 bg-surface-muted dark:bg-stone-800/60 rounded-lg text-xs">
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleAudioMute}
                title={isAudioMuted ? 'Unmute Audio Voice' : 'Mute Voice'}
                className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 text-text-secondary dark:text-stone-300"
              >
                {isAudioMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
              </button>
              {isSpeaking && (
                <button
                  onClick={stopVoice}
                  className="text-[10px] font-mono text-amber-600 dark:text-amber-400 hover:underline px-1"
                >
                  Stop
                </button>
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              title="Toggle Dark / Light Mode"
              className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 text-text-secondary dark:text-stone-300"
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Legal Notice */}
          <div className="px-2 py-1 text-[9px] text-stone-600 dark:text-stone-300 leading-tight">
            Educational simulation only. Not legal, tax, or investment advice.
          </div>
        </div>
      </aside>
    </>
  );
};
