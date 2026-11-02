import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ChevronRight,
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
    isOpeningPortalOpen,
    setIsOpeningPortalOpen,
    isCardStackModalOpen,
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
      label: { en: 'Mind Games', fr: 'Jeux Psy', zh: '心智' },
      icon: Brain,
    },
    {
      id: 'games' as NavTab,
      label: { en: 'Arena', fr: 'Jeux', zh: '竞技' },
      icon: Gamepad2,
    },
  ];

  // Sliding active highlight block state & refs
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  const activeKey = mainTabs.some((t) => t.id === activeTab) ? activeTab : 'more';
  const currentKey = hoveredKey || activeKey;

  const updateIndicator = useCallback((keyToTarget?: string) => {
    const targetKey = keyToTarget ?? currentKey;
    const container = navContainerRef.current;
    const btn = tabRefs.current.get(targetKey);
    if (!container || !btn) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    if (containerRect.width === 0 || btnRect.width === 0) {
      return;
    }

    setIndicatorStyle({
      left: Math.round(btnRect.left - containerRect.left),
      top: Math.round(btnRect.top - containerRect.top),
      width: Math.round(btnRect.width),
      height: Math.round(btnRect.height),
      opacity: 1,
    });
  }, [currentKey]);

  useEffect(() => {
    let rId1: number;
    let rId2: number;

    const run = () => {
      updateIndicator();
    };

    run();
    rId1 = requestAnimationFrame(() => {
      run();
      rId2 = requestAnimationFrame(run);
    });

    return () => {
      cancelAnimationFrame(rId1);
      cancelAnimationFrame(rId2);
    };
  }, [updateIndicator, activeTab, currentKey, language, isMoreMenuOpen]);

  useEffect(() => {
    const container = navContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      updateIndicator();
    });
    observer.observe(container);

    tabRefs.current.forEach((btn) => {
      if (btn) observer.observe(btn);
    });

    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [updateIndicator]);

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

  // Sliding active highlight block state & refs for "More" (更多) menu
  const moreContainerRef = useRef<HTMLDivElement | null>(null);
  const moreItemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [hoveredMoreKey, setHoveredMoreKey] = useState<string | null>(null);
  const [moreIndicatorStyle, setMoreIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  const activeMoreKey = ['simulators', 'negotiation', 'termsheet', 'exam', 'profile'].includes(activeTab)
    ? activeTab
    : 'simulators';
  const currentMoreKey = hoveredMoreKey || activeMoreKey;

  const updateMoreIndicator = useCallback((keyToTarget?: string) => {
    const targetKey = keyToTarget ?? currentMoreKey;
    const container = moreContainerRef.current;
    const btn = moreItemRefs.current.get(targetKey);
    if (!container || !btn) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    if (containerRect.width === 0 || btnRect.width === 0) {
      return;
    }

    setMoreIndicatorStyle({
      left: Math.round(btnRect.left - containerRect.left),
      top: Math.round(btnRect.top - containerRect.top),
      width: Math.round(btnRect.width),
      height: Math.round(btnRect.height),
      opacity: 1,
    });
  }, [currentMoreKey]);

  useEffect(() => {
    if (!isMoreMenuOpen) {
      setHoveredMoreKey(null);
      return;
    }

    let rId1: number;
    let rId2: number;

    const run = () => {
      updateMoreIndicator();
    };

    run();
    rId1 = requestAnimationFrame(() => {
      run();
      rId2 = requestAnimationFrame(run);
    });

    return () => {
      cancelAnimationFrame(rId1);
      cancelAnimationFrame(rId2);
    };
  }, [isMoreMenuOpen, updateMoreIndicator, activeTab, currentMoreKey, language]);

  useEffect(() => {
    if (!isMoreMenuOpen) return;
    const container = moreContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      updateMoreIndicator();
    });
    observer.observe(container);

    moreItemRefs.current.forEach((btn) => {
      if (btn) observer.observe(btn);
    });

    const handleResize = () => updateMoreIndicator();
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [isMoreMenuOpen, updateMoreIndicator]);

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

            <div
              ref={moreContainerRef}
              onMouseLeave={() => {
                setHoveredMoreKey(null);
                updateMoreIndicator(activeMoreKey);
              }}
              onPointerLeave={() => {
                setHoveredMoreKey(null);
                updateMoreIndicator(activeMoreKey);
              }}
              className="grid grid-cols-1 gap-2.5 relative isolate"
            >
              {/* Sliding rounded highlight block with spring rebound */}
              <div
                className={`pointer-events-none absolute top-0 left-0 rounded-2xl border-2 transition-colors duration-300 ${
                  currentMoreKey === 'portal'
                    ? 'border-amber-400/80 bg-gradient-to-r from-amber-500/25 via-purple-500/20 to-amber-500/15 shadow-[0_4px_24px_rgba(245,158,11,0.28)]'
                    : currentMoreKey === 'cardstack'
                    ? 'border-indigo-400/80 bg-gradient-to-r from-indigo-500/25 via-purple-500/20 to-indigo-500/15 shadow-[0_4px_24px_rgba(99,102,241,0.28)]'
                    : currentMoreKey === 'negotiation'
                    ? 'border-rose-400/80 bg-gradient-to-r from-rose-500/25 via-orange-500/20 to-rose-500/15 shadow-[0_4px_24px_rgba(244,63,94,0.28)]'
                    : currentMoreKey === 'exam'
                    ? 'border-indigo-400/80 bg-gradient-to-r from-indigo-500/25 via-purple-500/20 to-indigo-500/15 shadow-[0_4px_24px_rgba(99,102,241,0.28)]'
                    : currentMoreKey === 'profile'
                    ? 'border-emerald-400/80 bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-emerald-500/15 shadow-[0_4px_24px_rgba(16,185,129,0.28)]'
                    : 'border-amber-400/80 bg-gradient-to-r from-amber-500/25 via-cyan-500/20 to-amber-500/15 shadow-[0_4px_24px_rgba(245,158,11,0.28)]'
                } z-0`}
                style={{
                  transform: `translate3d(${moreIndicatorStyle.left}px, ${moreIndicatorStyle.top}px, 0)`,
                  width: `${moreIndicatorStyle.width}px`,
                  height: `${moreIndicatorStyle.height}px`,
                  opacity: moreIndicatorStyle.opacity,
                  transition:
                    'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1), width 420ms cubic-bezier(0.34, 1.56, 0.64, 1), height 420ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 180ms ease, border-color 300ms ease, background-color 300ms ease, box-shadow 300ms ease',
                }}
              >
                {/* Visual tactile glint for prestigious feedback */}
                <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400/70 blur-[1px] animate-pulse" />
              </div>

              {/* Art Portal Opening Cover Button */}
              {(() => {
                const isSelected = isOpeningPortalOpen;
                const isItemCurrent = currentMoreKey === 'portal';
                return (
                  <button
                    ref={(el) => {
                      if (el) moreItemRefs.current.set('portal', el);
                      else moreItemRefs.current.delete('portal');
                    }}
                    onMouseEnter={() => {
                      setHoveredMoreKey('portal');
                      updateMoreIndicator('portal');
                    }}
                    onPointerEnter={() => {
                      setHoveredMoreKey('portal');
                      updateMoreIndicator('portal');
                    }}
                    onTouchStart={() => {
                      setHoveredMoreKey('portal');
                      updateMoreIndicator('portal');
                    }}
                    onFocus={() => {
                      setHoveredMoreKey('portal');
                      updateMoreIndicator('portal');
                    }}
                    onClick={() => {
                      setHoveredMoreKey('portal');
                      updateMoreIndicator('portal');
                      setIsOpeningPortalOpen(true);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`relative z-10 w-full p-3.5 rounded-2xl border text-left flex items-center justify-between space-x-3.5 shadow-sm active:scale-95 transition-all duration-200 cursor-pointer ${
                      isItemCurrent
                        ? 'border-transparent bg-transparent scale-[1.01]'
                        : isSelected
                        ? 'border-amber-400/40 bg-surface-muted/50 dark:bg-stone-800/50 shadow-xs'
                        : 'border-border-main/50 dark:border-stone-800/80 bg-surface-muted/60 dark:bg-stone-800/60 hover:border-amber-400/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 transition-transform duration-200 ${isItemCurrent ? 'scale-105' : 'scale-100'}`}>
                        <Aperture className="w-5 h-5 animate-spin-slow" />
                      </div>
                      <div className="flex-1 truncate">
                        <div className={`font-bold text-xs flex items-center space-x-1.5 transition-colors duration-200 ${
                          isItemCurrent ? 'text-amber-300' : isSelected ? 'text-amber-400' : 'text-text-primary dark:text-stone-100'
                        }`}>
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
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 pl-1">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 opacity-100 scale-100'
                            : 'opacity-0 scale-75 pointer-events-none'
                        }`}
                      >
                        {language === 'zh' ? '当前' : language === 'fr' ? 'Actif' : 'Active'}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full bg-amber-400 transition-all duration-300 ${
                          isSelected
                            ? 'opacity-100 scale-100 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                            : isItemCurrent
                            ? 'opacity-40 scale-75'
                            : 'opacity-0 scale-50'
                        }`}
                      />
                      <ChevronRight
                        className={`w-4 h-4 transition-all duration-200 ${
                          isItemCurrent
                            ? 'text-amber-400 translate-x-0.5 opacity-100'
                            : 'text-stone-500 opacity-40'
                        }`}
                      />
                    </div>
                  </button>
                );
              })()}

              {/* Overlapping Stacks Deck Button */}
              {(() => {
                const isSelected = isCardStackModalOpen;
                const isItemCurrent = currentMoreKey === 'cardstack';
                return (
                  <button
                    ref={(el) => {
                      if (el) moreItemRefs.current.set('cardstack', el);
                      else moreItemRefs.current.delete('cardstack');
                    }}
                    onMouseEnter={() => {
                      setHoveredMoreKey('cardstack');
                      updateMoreIndicator('cardstack');
                    }}
                    onPointerEnter={() => {
                      setHoveredMoreKey('cardstack');
                      updateMoreIndicator('cardstack');
                    }}
                    onTouchStart={() => {
                      setHoveredMoreKey('cardstack');
                      updateMoreIndicator('cardstack');
                    }}
                    onFocus={() => {
                      setHoveredMoreKey('cardstack');
                      updateMoreIndicator('cardstack');
                    }}
                    onClick={() => {
                      setHoveredMoreKey('cardstack');
                      updateMoreIndicator('cardstack');
                      setIsCardStackModalOpen(true);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`relative z-10 w-full p-3.5 rounded-2xl border text-left flex items-center justify-between space-x-3.5 shadow-sm active:scale-95 transition-all duration-200 cursor-pointer ${
                      isItemCurrent
                        ? 'border-transparent bg-transparent scale-[1.01]'
                        : isSelected
                        ? 'border-indigo-400/40 bg-surface-muted/50 dark:bg-stone-800/50 shadow-xs'
                        : 'border-border-main/50 dark:border-stone-800/80 bg-surface-muted/60 dark:bg-stone-800/60 hover:border-indigo-400/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-xl bg-indigo-500/25 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400 transition-transform duration-200 ${isItemCurrent ? 'scale-105' : 'scale-100'}`}>
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="flex-1 truncate">
                        <div className={`font-bold text-xs flex items-center space-x-1.5 transition-colors duration-200 ${
                          isItemCurrent ? 'text-indigo-300' : isSelected ? 'text-indigo-400' : 'text-text-primary dark:text-stone-100'
                        }`}>
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
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 pl-1">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/40 opacity-100 scale-100'
                            : 'opacity-0 scale-75 pointer-events-none'
                        }`}
                      >
                        {language === 'zh' ? '当前' : language === 'fr' ? 'Actif' : 'Active'}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full bg-indigo-400 transition-all duration-300 ${
                          isSelected
                            ? 'opacity-100 scale-100 shadow-[0_0_8px_rgba(99,102,241,0.9)]'
                            : isItemCurrent
                            ? 'opacity-40 scale-75'
                            : 'opacity-0 scale-50'
                        }`}
                      />
                      <ChevronRight
                        className={`w-4 h-4 transition-all duration-200 ${
                          isItemCurrent
                            ? 'text-indigo-400 translate-x-0.5 opacity-100'
                            : 'text-stone-500 opacity-40'
                        }`}
                      />
                    </div>
                  </button>
                );
              })()}

              {moreItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                const isItemCurrent = currentMoreKey === item.id;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      if (el) moreItemRefs.current.set(item.id, el);
                      else moreItemRefs.current.delete(item.id);
                    }}
                    onMouseEnter={() => {
                      setHoveredMoreKey(item.id);
                      updateMoreIndicator(item.id);
                    }}
                    onPointerEnter={() => {
                      setHoveredMoreKey(item.id);
                      updateMoreIndicator(item.id);
                    }}
                    onTouchStart={() => {
                      setHoveredMoreKey(item.id);
                      updateMoreIndicator(item.id);
                    }}
                    onFocus={() => {
                      setHoveredMoreKey(item.id);
                      updateMoreIndicator(item.id);
                    }}
                    onClick={() => {
                      setHoveredMoreKey(item.id);
                      updateMoreIndicator(item.id);
                      if (item.simulator) setSelectedSimulator(item.simulator);
                      setActiveTab(item.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`relative z-10 w-full p-3.5 rounded-2xl border text-left flex items-center justify-between space-x-3.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                      isItemCurrent
                        ? 'border-transparent bg-transparent scale-[1.01]'
                        : isSelected
                        ? 'border-amber-400/40 bg-surface-muted/50 dark:bg-stone-800/50 shadow-xs'
                        : 'border-border-main/50 dark:border-stone-800/80 bg-surface-muted/60 dark:bg-stone-800/60 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-inner transition-transform duration-200 ${
                          isItemCurrent ? 'scale-105' : 'scale-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 truncate">
                        <div className={`font-bold text-xs transition-colors duration-200 ${
                          isItemCurrent
                            ? 'text-amber-300 dark:text-amber-300'
                            : isSelected
                            ? 'text-amber-400 dark:text-amber-400'
                            : 'text-text-primary dark:text-stone-100'
                        }`}>
                          {item.label[language]}
                        </div>
                        <div className="text-[11px] text-text-secondary dark:text-stone-400 truncate mt-0.5 transition-colors duration-200">
                          {item.desc[language]}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 pl-1">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 opacity-100 scale-100'
                            : 'opacity-0 scale-75 pointer-events-none'
                        }`}
                      >
                        {language === 'zh' ? '当前' : language === 'fr' ? 'Actif' : 'Active'}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full bg-amber-400 transition-all duration-300 ${
                          isSelected
                            ? 'opacity-100 scale-100 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                            : isItemCurrent
                            ? 'opacity-40 scale-75'
                            : 'opacity-0 scale-50'
                        }`}
                      />
                      <ChevronRight
                        className={`w-4 h-4 transition-all duration-200 ${
                          isItemCurrent
                            ? 'text-amber-400 translate-x-0.5 opacity-100'
                            : 'text-stone-500 opacity-40'
                        }`}
                      />
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
        <div
          ref={navContainerRef}
          onMouseLeave={() => {
            setHoveredKey(null);
            updateIndicator(activeKey);
          }}
          onPointerLeave={() => {
            setHoveredKey(null);
            updateIndicator(activeKey);
          }}
          className="mx-auto max-w-md bg-[#131626]/90 dark:bg-[#0D101C]/92 backdrop-blur-2xl border border-amber-400/35 dark:border-amber-400/25 rounded-2xl shadow-[0_12px_44px_rgba(0,0,0,0.65),0_0_20px_rgba(229,184,66,0.12)] p-1.5 flex items-center justify-around relative isolate"
        >
          {/* Sliding rounded highlight block with spring rebound */}
          <div
            className={`pointer-events-none absolute top-0 left-0 rounded-xl border transition-colors ${
              currentKey === 'more'
                ? 'bg-purple-500/25 border-purple-400/50 shadow-[0_2px_14px_rgba(168,85,247,0.3)]'
                : 'bg-gradient-to-tr from-amber-500/25 via-amber-400/20 to-purple-500/20 border-amber-400/50 shadow-[0_2px_14px_rgba(245,158,11,0.28)]'
            } z-0`}
            style={{
              transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
              width: `${indicatorStyle.width}px`,
              height: `${indicatorStyle.height}px`,
              opacity: indicatorStyle.opacity,
              transition:
                'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1), width 420ms cubic-bezier(0.34, 1.56, 0.64, 1), height 420ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 180ms ease',
            }}
          />

          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isHighlighted = currentKey === tab.id;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.id, el);
                  else tabRefs.current.delete(tab.id);
                }}
                onMouseEnter={() => {
                  setHoveredKey(tab.id);
                  updateIndicator(tab.id);
                }}
                onPointerEnter={() => {
                  setHoveredKey(tab.id);
                  updateIndicator(tab.id);
                }}
                onTouchStart={() => {
                  setHoveredKey(tab.id);
                  updateIndicator(tab.id);
                }}
                onFocus={() => {
                  setHoveredKey(tab.id);
                  updateIndicator(tab.id);
                }}
                onClick={() => {
                  setActiveTab(tab.id);
                  setHoveredKey(tab.id);
                  setIsMoreMenuOpen(false);
                }}
                className={`relative z-10 flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
                  isHighlighted
                    ? 'text-amber-300 font-bold scale-[1.02]'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isHighlighted ? 'text-amber-300 scale-105' : 'text-stone-400'
                    }`}
                  />
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
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 transition-all duration-200 ${
                    isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                />
              </button>
            );
          })}

          {/* "More / Lab" Trigger Button */}
          <button
            ref={(el) => {
              if (el) tabRefs.current.set('more', el);
              else tabRefs.current.delete('more');
            }}
            onMouseEnter={() => {
              setHoveredKey('more');
              updateIndicator('more');
            }}
            onPointerEnter={() => {
              setHoveredKey('more');
              updateIndicator('more');
            }}
            onTouchStart={() => {
              setHoveredKey('more');
              updateIndicator('more');
            }}
            onFocus={() => {
              setHoveredKey('more');
              updateIndicator('more');
            }}
            onClick={() => setIsMoreMenuOpen((prev) => !prev)}
            className={`relative z-10 flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              currentKey === 'more' || isMoreMenuOpen
                ? 'text-purple-300 font-bold scale-[1.02]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="relative">
              <Sliders
                className={`w-5 h-5 transition-transform duration-200 ${
                  currentKey === 'more' || isMoreMenuOpen
                    ? 'text-purple-300 scale-105'
                    : 'text-stone-400'
                }`}
              />
              <ChevronUp
                className={`w-3 h-3 absolute -top-1 -right-2 transition-transform duration-200 ${
                  isMoreMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
            <span className="text-[10px] mt-1 font-medium tracking-tight">
              {language === 'fr' ? 'Lab +' : language === 'zh' ? '更多+' : 'More+'}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full bg-purple-400 mt-0.5 transition-all duration-200 ${
                activeKey === 'more' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
            />
          </button>
        </div>
      </nav>
    </>
  );
};
