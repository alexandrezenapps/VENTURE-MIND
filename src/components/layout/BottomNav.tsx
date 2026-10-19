import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  Brain,
  Gamepad2,
  Sliders,
  Flame,
  FileSpreadsheet,
  GraduationCap,
  User,
  X,
  Sparkles,
  ChevronUp,
  Aperture,
  Layers,
} from 'lucide-react';
import { useApp, NavTab, SimulatorType } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedSimulator,
    language,
    progress,
    setIsOpeningPortalOpen,
    setIsCardStackModalOpen,
  } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mainTabs = [
    {
      id: 'dashboard' as NavTab,
      label: { en: 'Hub', fr: 'Accueil', zh: '主页' },
      icon: Compass,
    },
    {
      id: 'learn' as NavTab,
      label: { en: 'Terms', fr: 'Termes', zh: '词典' },
      icon: BookOpen,
      badge: '100',
    },
    {
      id: 'mindfulness' as NavTab,
      label: { en: 'Zen', fr: 'Zen', zh: '正念' },
      icon: Sparkles,
      glow: true,
      color: 'text-amber-500 dark:text-amber-300',
    },
    {
      id: 'psychology' as NavTab,
      label: { en: 'Mind', fr: 'Radar', zh: '心法' },
      icon: Brain,
    },
    {
      id: 'games' as NavTab,
      label: { en: 'Arena', fr: 'Jeux', zh: '竞技' },
      icon: Gamepad2,
    },
  ];

  const moreItems: {
    id: NavTab;
    label: { en: string; fr: string; zh: string };
    icon: React.ElementType;
    simulator?: SimulatorType;
    desc: { en: string; fr: string; zh: string };
    color: string;
  }[] = [
    {
      id: 'simulators',
      simulator: 'captable',
      label: { en: 'Cap Table & SAFEs', fr: 'Simulateurs Financiers', zh: '股权与清算沙盘' },
      desc: { en: 'Model dilution & exit waterfalls', fr: 'Modéliser la dilution', zh: '推演稀释与清算瀑布' },
      icon: Sliders,
      color: 'from-blue-500/20 to-cyan-500/20 text-cyan-600 dark:text-cyan-400',
    },
    {
      id: 'negotiation',
      label: { en: 'AI Investor Showdown', fr: 'Négociation VC IA', zh: 'AI投资人实战博弈' },
      desc: { en: 'Live battle with Marcus Vance', fr: 'Défiez le fonds Horizon', zh: '直面合伙人极限压价' },
      icon: Flame,
      color: 'from-rose-500/20 to-orange-500/20 text-rose-600 dark:text-rose-400',
    },
    {
      id: 'termsheet',
      label: { en: 'Term Sheet Analyzer', fr: 'Analyseur de Clauses', zh: '意向书排雷工作台' },
      desc: { en: 'Detect poison-pills & traps', fr: 'Détecter les clauses toxiques', zh: '识别霸王条款与红线' },
      icon: FileSpreadsheet,
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'exam',
      label: { en: '100-Question Exam', fr: 'Grand Examen (100Q)', zh: '结业百题大考' },
      desc: { en: 'Earn Academy Fellowship', fr: 'Certificat officiel', zh: '获取学院结业认证' },
      icon: GraduationCap,
      color: 'from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'profile',
      label: { en: 'Profile & Venture IQ', fr: 'Profil & Venture IQ', zh: '个人档案与能力' },
      desc: { en: `Venture IQ: ${progress.ventureIQ} • Lv.${progress.level}`, fr: `IQ: ${progress.ventureIQ}`, zh: `IQ: ${progress.ventureIQ} • 等级${progress.level}` },
      icon: User,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <>
      {/* "More" Sheet Modal for Mobile */}
      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div
            className="w-full bg-surface-main dark:bg-stone-900 rounded-t-3xl border-t border-border-main dark:border-stone-800 p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border-main dark:border-stone-800">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-text-primary dark:text-stone-100">
                  {language === 'fr' ? 'Modules Stratégiques' : language === 'zh' ? '高阶策略与工具' : 'Executive Modules'}
                </span>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 rounded-full text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Art Portal Opening Cover Button */}
              <button
                onClick={() => {
                  setIsOpeningPortalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="w-full p-3.5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-amber-500/10 text-left flex items-center space-x-3.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                  <Aperture className="w-5 h-5 animate-spin-slow" />
                </div>
                <div className="flex-1 truncate">
                  <div className="font-bold text-xs text-amber-300 flex items-center space-x-1.5">
                    <span>
                      {language === 'fr'
                        ? 'Portail d’Art & Ouverture'
                        : language === 'zh'
                        ? '镂空大标题 · 艺术主页'
                        : 'Knockout Title Art Portal'}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-stone-300 truncate mt-0.5 font-mono">
                    {language === 'zh'
                      ? 'VENTURE MIND 全屏手势缩放'
                      : 'VENTURE MIND gesture zoom & presets'}
                  </div>
                </div>
              </button>

              {/* Overlapping Stacks Deck Button */}
              <button
                onClick={() => {
                  setIsCardStackModalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="w-full p-3.5 rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-indigo-500/10 text-left flex items-center space-x-3.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/25 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1 truncate">
                  <div className="font-bold text-xs text-indigo-300 flex items-center space-x-1.5">
                    <span>
                      {language === 'fr'
                        ? 'Composant de Cartes Empilées'
                        : language === 'zh'
                        ? '重叠式卡组 · 四大场景'
                        : 'Overlapping Card Stacks'}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-300 truncate mt-0.5 font-mono">
                    {language === 'zh'
                      ? '三分之一覆盖 · 课程/收藏/词汇/资料'
                      : '1/3 Stack • Courses, Bookmarks, Vocab, Profile'}
                  </div>
                </div>
              </button>
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.simulator) setSelectedSimulator(item.simulator);
                      setActiveTab(item.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center space-x-3.5 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-purple-500/10 border-emerald-500/40 shadow-xs'
                        : 'bg-surface-muted/60 dark:bg-stone-800/60 border-border-main dark:border-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-inner`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-bold text-xs text-text-primary dark:text-stone-100">
                        {item.label[language]}
                      </div>
                      <div className="text-[11px] text-text-secondary dark:text-stone-400 truncate mt-0.5">
                        {item.desc[language]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Glass Bottom Nav */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="mx-auto max-w-md bg-[#131626]/90 dark:bg-[#0D101C]/92 backdrop-blur-2xl border border-amber-400/35 dark:border-amber-400/25 rounded-2xl shadow-[0_12px_44px_rgba(0,0,0,0.65),0_0_20px_rgba(229,184,66,0.12)] p-1.5 flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMoreMenuOpen(false);
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'text-amber-400 font-bold bg-amber-500/15 shadow-inner'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : ''}`} />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 text-[8px] font-mono px-1 rounded-full bg-amber-500 text-stone-950 font-bold leading-tight">
                      {tab.badge}
                    </span>
                  )}
                  {tab.glow && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium tracking-tight">
                  {tab.label[language]}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
                )}
              </button>
            );
          })}

          {/* "More / Lab" Trigger Button */}
          <button
            onClick={() => setIsMoreMenuOpen((prev) => !prev)}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              ['simulators', 'negotiation', 'termsheet', 'exam', 'profile'].includes(activeTab) || isMoreMenuOpen
                ? 'text-purple-400 font-bold bg-purple-500/15 shadow-inner'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="relative">
              <Sliders className="w-5 h-5" />
              <ChevronUp
                className={`w-3 h-3 absolute -top-1 -right-2 transition-transform duration-200 ${
                  isMoreMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
            <span className="text-[10px] mt-1 font-medium tracking-tight">
              {language === 'fr' ? 'Lab +' : language === 'zh' ? '更多+' : 'More+'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
