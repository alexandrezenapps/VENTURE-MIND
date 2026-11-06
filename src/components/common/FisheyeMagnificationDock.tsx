import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Compass,
  BookOpen,
  Sparkles,
  Brain,
  Sliders,
  Flame,
  FileSpreadsheet,
  GraduationCap,
  User,
  Aperture,
  Layers,
  LucideIcon,
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';

export interface DockItemConfig {
  id: string;
  tabId?: NavTab;
  label: { en: string; fr: string; zh: string };
  badge?: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  action?: () => void;
}

interface FisheyeMagnificationDockProps {
  items?: DockItemConfig[];
  onSelect?: (itemId: string) => void;
  className?: string;
}

export const FisheyeMagnificationDock: React.FC<FisheyeMagnificationDockProps> = ({
  items: customItems,
  onSelect,
  className = '',
}) => {
  const {
    activeTab,
    setActiveTab,
    language,
    setIsOpeningPortalOpen,
    setIsCardStackModalOpen,
  } = useApp();

  const dockRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Cursor or touch pointer X position relative to container
  const [pointerX, setPointerX] = useState<number | null>(null);
  const [activeItemKey, setActiveItemKey] = useState<string | null>(null);
  const [bouncingKey, setBouncingKey] = useState<string | null>(null);

  const defaultItems: DockItemConfig[] = [
    {
      id: 'dashboard',
      tabId: 'dashboard',
      label: { en: 'Hub', fr: 'Accueil', zh: '仪表主页' },
      icon: Compass,
      color: 'text-amber-400',
      gradient: 'from-amber-500/20 to-amber-600/30',
    },
    {
      id: 'learn',
      tabId: 'learn',
      label: { en: 'Terms', fr: 'Termes', zh: '核心词典' },
      badge: '100',
      icon: BookOpen,
      color: 'text-blue-400',
      gradient: 'from-blue-500/20 to-cyan-500/30',
    },
    {
      id: 'mindfulness',
      tabId: 'mindfulness',
      label: { en: 'Sanctuary', fr: 'Zen', zh: '正念殿堂' },
      icon: Sparkles,
      color: 'text-emerald-400',
      gradient: 'from-emerald-500/20 to-teal-500/30',
    },
    {
      id: 'psychology',
      tabId: 'psychology',
      label: { en: '12 Games', fr: 'Jeux Psy', zh: '心智挑战' },
      badge: '12',
      icon: Brain,
      color: 'text-purple-400',
      gradient: 'from-purple-500/20 to-indigo-500/30',
    },
    {
      id: 'simulators',
      tabId: 'simulators',
      label: { en: 'Cap Table', fr: 'Simulateurs', zh: '股权沙盘' },
      icon: Sliders,
      color: 'text-cyan-400',
      gradient: 'from-cyan-500/20 to-blue-500/30',
    },
    {
      id: 'negotiation',
      tabId: 'negotiation',
      label: { en: 'VC Duel', fr: 'Négociation', zh: '投资人对决' },
      icon: Flame,
      color: 'text-rose-400',
      gradient: 'from-rose-500/20 to-orange-500/30',
    },
    {
      id: 'termsheet',
      tabId: 'termsheet',
      label: { en: 'Term Sheet', fr: 'Clauses', zh: '意向书雷达' },
      icon: FileSpreadsheet,
      color: 'text-yellow-400',
      gradient: 'from-yellow-500/20 to-amber-500/30',
    },
    {
      id: 'exam',
      tabId: 'exam',
      label: { en: '100Q Exam', fr: 'Examen', zh: '百题大考' },
      badge: 'Pro',
      icon: GraduationCap,
      color: 'text-indigo-400',
      gradient: 'from-indigo-500/20 to-purple-500/30',
    },
    {
      id: 'profile',
      tabId: 'profile',
      label: { en: 'Profile', fr: 'Profil', zh: '能力档案' },
      icon: User,
      color: 'text-teal-400',
      gradient: 'from-teal-500/20 to-emerald-500/30',
    },
    {
      id: 'portal',
      label: { en: 'Art Cover', fr: 'Portail Art', zh: '艺术封面' },
      icon: Aperture,
      color: 'text-amber-300',
      gradient: 'from-amber-400/25 to-purple-500/25',
      action: () => setIsOpeningPortalOpen(true),
    },
    {
      id: 'cardstack',
      label: { en: 'Card Decks', fr: 'Cartes', zh: '重叠卡组' },
      icon: Layers,
      color: 'text-purple-300',
      gradient: 'from-purple-400/25 to-indigo-500/25',
      action: () => setIsCardStackModalOpen(true),
    },
  ];

  const items = customItems || defaultItems;

  // Maximum magnification parameters
  const BASE_WIDTH = 48; // Base width in px for each icon item
  const MAX_SCALE = 1.75; // Peak scale when finger is directly on top
  const INTERACTION_RADIUS = 110; // Pixel radius of influence for smooth gaussian/cosine drop-off

  // Calculate distance-based scale and horizontal space reservation
  const getItemTransform = (itemKey: string) => {
    if (pointerX === null || !dockRef.current) {
      return {
        scale: 1,
        translateY: 0,
        extraWidth: 0,
        isClosest: false,
      };
    }

    const btn = itemRefs.current.get(itemKey);
    if (!btn) {
      return { scale: 1, translateY: 0, extraWidth: 0, isClosest: false };
    }

    const containerRect = dockRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Center X of this item relative to container
    const itemCenterX = btnRect.left - containerRect.left + btnRect.width / 2;
    const distance = Math.abs(pointerX - itemCenterX);

    if (distance > INTERACTION_RADIUS) {
      return { scale: 1, translateY: 0, extraWidth: 0, isClosest: false };
    }

    // Cosine ease-out curve for smooth magnetic fisheye effect
    const intensity = Math.cos((distance / INTERACTION_RADIUS) * (Math.PI / 2));
    const scale = 1 + (MAX_SCALE - 1) * Math.pow(intensity, 1.4);
    const translateY = -intensity * 18; // Elevates up towards the finger
    const extraWidth = (scale - 1) * BASE_WIDTH * 0.85; // Adjacent icons make room ("相邻图标同步让位")

    const isClosest = distance < BASE_WIDTH * 0.6;

    return {
      scale,
      translateY,
      extraWidth,
      isClosest,
    };
  };

  // Find and select the item under finger/pointer upon release
  const handlePointerRelease = () => {
    if (pointerX === null || !dockRef.current) {
      setPointerX(null);
      return;
    }

    const containerRect = dockRef.current.getBoundingClientRect();
    let closestItem: DockItemConfig | null = null;
    let minDistance = Infinity;

    items.forEach((item) => {
      const btn = itemRefs.current.get(item.id);
      if (btn) {
        const btnRect = btn.getBoundingClientRect();
        const itemCenterX = btnRect.left - containerRect.left + btnRect.width / 2;
        const dist = Math.abs(pointerX - itemCenterX);
        if (dist < minDistance) {
          minDistance = dist;
          closestItem = item;
        }
      }
    });

    if (closestItem && minDistance < INTERACTION_RADIUS * 1.2) {
      const selected = closestItem as DockItemConfig;
      setBouncingKey(selected.id);
      setTimeout(() => setBouncingKey(null), 600);

      if (selected.action) {
        selected.action();
      } else if (selected.tabId) {
        setActiveTab(selected.tabId);
      }

      if (onSelect) {
        onSelect(selected.id);
      }
    }

    setPointerX(null);
  };

  // Track pointer movements
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    setPointerX(e.clientX - rect.left);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dockRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = dockRef.current.getBoundingClientRect();
    setPointerX(touch.clientX - rect.left);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dockRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = dockRef.current.getBoundingClientRect();
    setPointerX(touch.clientX - rect.left);
  };

  // Identify currently closest hovered/focused item for floating tooltip
  useEffect(() => {
    if (pointerX === null || !dockRef.current) {
      setActiveItemKey(null);
      return;
    }

    const containerRect = dockRef.current.getBoundingClientRect();
    let closestKey: string | null = null;
    let minDistance = Infinity;

    items.forEach((item) => {
      const btn = itemRefs.current.get(item.id);
      if (btn) {
        const btnRect = btn.getBoundingClientRect();
        const itemCenterX = btnRect.left - containerRect.left + btnRect.width / 2;
        const dist = Math.abs(pointerX - itemCenterX);
        if (dist < minDistance) {
          minDistance = dist;
          closestKey = item.id;
        }
      }
    });

    if (closestKey && minDistance < BASE_WIDTH * 1.2) {
      setActiveItemKey(closestKey);
    } else {
      setActiveItemKey(null);
    }
  }, [pointerX, items]);

  const activeItem = items.find((i) => i.id === activeItemKey);

  return (
    <div className={`relative w-full flex flex-col items-center select-none py-3 ${className}`}>
      {/* Floating Name Tooltip above hovered icon */}
      <div
        className={`h-8 mb-2 flex items-center justify-center transition-all duration-200 pointer-events-none ${
          activeItem ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-90'
        }`}
      >
        {activeItem && (
          <div className="px-3.5 py-1.5 rounded-full bg-[#0A0D18]/92 backdrop-blur-xl border border-amber-400/40 text-white text-xs font-mono font-bold flex items-center space-x-2 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
            <span className="text-amber-200 font-serif-luxury font-medium tracking-wide text-sm">{activeItem.label[language]}</span>
            {activeItem.badge && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {activeItem.badge}
              </span>
            )}
            <span className="text-[10px] text-stone-400 font-mono tracking-tight">
              {language === 'zh' ? '· 松手选中' : '· Release'}
            </span>
          </div>
        )}
      </div>

      {/* Main Glass Magnetic Fisheye Dock Container */}
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setPointerX(null)}
        onMouseUp={handlePointerRelease}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handlePointerRelease}
        onTouchCancel={() => setPointerX(null)}
        className="relative max-w-full overflow-x-auto no-scrollbar py-3.5 px-5 rounded-3xl bg-gradient-to-b from-[#181B2B]/95 via-[#0E111E]/95 to-[#070912]/98 backdrop-blur-2xl border border-amber-400/30 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85),0_0_24px_rgba(217,119,6,0.12),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.6)] flex items-end justify-center gap-2 cursor-pointer transition-colors duration-300"
      >
        {/* Subtle top specular hairline highlight */}
        <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/40 to-transparent pointer-events-none" />

        {/* Subtle ambient bottom glow */}
        <div className="absolute inset-x-16 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent blur-xs pointer-events-none" />

        {items.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.tabId;
          const isBouncing = bouncingKey === item.id;
          const transform = getItemTransform(item.id);

          return (
            <div
              key={item.id}
              style={{
                width: `${BASE_WIDTH + transform.extraWidth}px`,
                transition: pointerX === null ? 'all 320ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              }}
              className="flex flex-col items-center justify-end shrink-0"
            >
              <button
                ref={(el) => {
                  if (el) itemRefs.current.set(item.id, el);
                  else itemRefs.current.delete(item.id);
                }}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.tabId) {
                    setActiveTab(item.tabId);
                  }
                  if (onSelect) onSelect(item.id);
                }}
                style={{
                  transform: `translate3d(0, ${transform.translateY}px, 0) scale(${transform.scale})`,
                  transformOrigin: 'bottom center',
                  transition: pointerX === null ? 'all 320ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                }}
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
                  isBouncing ? 'animate-bounce' : ''
                } ${
                  isSelected
                    ? 'border border-amber-400/80 bg-gradient-to-b from-amber-400/30 via-amber-500/20 to-amber-700/30 shadow-[0_0_24px_rgba(245,158,11,0.35),0_6px_20px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                    : 'border border-white/15 dark:border-white/[0.08] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.01] dark:from-[#1E2235]/70 dark:via-[#131625]/85 dark:to-[#0A0D17]/95 shadow-[0_4px_14px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-amber-400/50 hover:shadow-[0_6px_20px_rgba(217,119,6,0.22)]'
                }`}
              >
                {/* Micro gradient backdrop */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-50 pointer-events-none`}
                />

                {/* Icon */}
                <Icon
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 relative z-10 transition-transform ${
                    item.color
                  } ${transform.scale > 1.2 ? 'drop-shadow-[0_2px_8px_rgba(255,255,255,0.45)]' : ''}`}
                />

                {/* Badge if present */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold leading-tight z-20 shadow-xs border border-amber-200">
                    {item.badge}
                  </span>
                )}

                {/* Active indicator bottom dash */}
                <span
                  className={`absolute -bottom-1.5 w-3.5 h-1 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 opacity-100 scale-100 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                      : 'opacity-0 scale-50'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Touch Interaction Prompt */}
      <div className="mt-2.5 text-center text-[11px] font-mono text-stone-400/90 flex items-center justify-center space-x-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        <span>
          {language === 'fr'
            ? 'Glissez le doigt pour agrandir par proximité, les voisins s’écartent, relâchez pour sélectionner'
            : language === 'zh'
            ? '高定微动微距律动 · 手指/光标滑过平滑放大，相邻图标智能让位，松手即刻选中'
            : 'Slide finger to magnify with neighbor wave, release to select and activate'}
        </span>
      </div>
    </div>
  );
};
