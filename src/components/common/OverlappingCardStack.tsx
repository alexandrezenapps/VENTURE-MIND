import React, { useState, useCallback } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  ArrowRight,
  Maximize2,
  CheckCircle2,
  ShieldCheck,
  Eye,
  TrendingUp,
  Scale,
  Globe,
  FileText,
  Brain,
  Calculator,
  Briefcase,
  AlertTriangle,
  Award,
  Crown,
  Zap,
  Bookmark,
  GraduationCap,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { StackCardItem, StackDirection } from '../../types/overlappingStack';
import { useApp } from '../../context/AppContext';

// Map icon names to Lucide icon components
const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  ShieldCheck,
  Eye,
  TrendingUp,
  Scale,
  Globe,
  FileText,
  Brain,
  Calculator,
  Briefcase,
  AlertTriangle,
  Award,
  Crown,
  Zap,
  Bookmark,
  GraduationCap,
  Layers,
};

interface OverlappingCardStackProps {
  cards: StackCardItem[];
  title?: { en: string; fr: string; zh: string };
  subtitle?: { en: string; fr: string; zh: string };
  domainLabel?: { en: string; fr: string; zh: string };
  accentColor?: 'amber' | 'emerald' | 'indigo' | 'purple' | 'rose' | 'cyan';
  direction?: StackDirection;
  overlapPercent?: number; // Default 33 (约三分之一)
  onCardAction?: (card: StackCardItem) => void;
  className?: string;
  defaultExpanded?: boolean;
}

export const OverlappingCardStack: React.FC<OverlappingCardStackProps> = ({
  cards,
  title,
  subtitle,
  domainLabel,
  accentColor = 'amber',
  direction = 'horizontal',
  overlapPercent = 33, // 约三分之一覆盖
  onCardAction,
  className = '',
  defaultExpanded = false,
}) => {
  const { language, isAudioMuted } = useApp();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Remaining cards count when collapsed (only top 3 visible)
  const remainingCount = Math.max(0, cards.length - 3);

  // Play a soft high-fidelity tactile chime on state change
  const playTactileAudio = useCallback(
    (type: 'expand' | 'collapse' | 'card') => {
      if (isAudioMuted || typeof window === 'undefined') return;
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        if (type === 'expand') {
          // Ascending two-tone chime for expansion
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        } else if (type === 'collapse') {
          // Descending soft chime for retraction
          osc.frequency.setValueAtTime(660, now);
          osc.frequency.exponentialRampToValueAtTime(330, now + 0.14);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
        } else {
          // Subtle click/tick on card interaction
          osc.frequency.setValueAtTime(720, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        }

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } catch {
        // Audio policy or unsupported fallback
      }
    },
    [isAudioMuted]
  );

  const toggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    playTactileAudio(next ? 'expand' : 'collapse');
  };

  const handleCardClick = (card: StackCardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpanded) {
      // If collapsed, clicking any card triggers sequential expansion
      setIsExpanded(true);
      setSelectedCardId(card.id);
      playTactileAudio('expand');
    } else {
      // If already expanded, select this card or trigger action
      setSelectedCardId(card.id === selectedCardId ? null : card.id);
      playTactileAudio('card');
      if (onCardAction) {
        onCardAction(card);
      }
    }
  };

  // Accent styling mappings
  const accentClasses = {
    amber: {
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      borderGlow: 'hover:border-amber-400/50',
      activeBorder: 'border-amber-400',
      gradient: 'from-amber-500/10 via-stone-900/40 to-stone-950',
      highlight: 'text-amber-400',
      counter: 'bg-amber-500 text-stone-950',
      progress: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    },
    emerald: {
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      borderGlow: 'hover:border-emerald-400/50',
      activeBorder: 'border-emerald-400',
      gradient: 'from-emerald-500/10 via-stone-900/40 to-stone-950',
      highlight: 'text-emerald-400',
      counter: 'bg-emerald-500 text-stone-950',
      progress: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    },
    indigo: {
      badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      borderGlow: 'hover:border-indigo-400/50',
      activeBorder: 'border-indigo-400',
      gradient: 'from-indigo-500/10 via-stone-900/40 to-stone-950',
      highlight: 'text-indigo-400',
      counter: 'bg-indigo-500 text-white',
      progress: 'bg-gradient-to-r from-indigo-500 to-blue-400',
    },
    purple: {
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      borderGlow: 'hover:border-purple-400/50',
      activeBorder: 'border-purple-400',
      gradient: 'from-purple-500/10 via-stone-900/40 to-stone-950',
      highlight: 'text-purple-400',
      counter: 'bg-purple-500 text-white',
      progress: 'bg-gradient-to-r from-purple-500 to-fuchsia-400',
    },
    rose: {
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      borderGlow: 'hover:border-rose-400/50',
      activeBorder: 'border-rose-400',
      gradient: 'from-rose-500/10 via-stone-900/40 to-stone-950',
      highlight: 'text-rose-400',
      counter: 'bg-rose-500 text-white',
      progress: 'bg-gradient-to-r from-rose-500 to-pink-400',
    },
    cyan: {
      badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      borderGlow: 'hover:border-cyan-400/50',
      activeBorder: 'border-cyan-400',
      gradient: 'from-cyan-500/10 via-stone-900/40 to-stone-950',
      highlight: 'text-cyan-400',
      counter: 'bg-cyan-500 text-stone-950',
      progress: 'bg-gradient-to-r from-cyan-500 to-teal-400',
    },
  }[accentColor];

  // In collapsed mode:
  // - Exactly the first 3 cards are displayed
  // - Each covers approximately one-third (33%) of the next
  // - Angle rotation gives a natural tactile physical card stack appearance (-2.5deg, 0deg, 2.5deg)
  const collapsedDisplayCards = isExpanded ? cards : cards.slice(0, 3);

  return (
    <div
      className={`glass-panel border-sophisticated rounded-3xl p-5 sm:p-6 transition-all duration-500 relative overflow-hidden shadow-2xl ${className}`}
    >
      {/* Subtle Background Glow Mesh */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 bg-gradient-to-br ${accentClasses.gradient}`}
      />

      {/* Header Bar with Interactive Expand / Retract Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10 border-b border-border-main/60 dark:border-stone-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${accentClasses.badge}`}
            >
              {domainLabel
                ? domainLabel[language]
                : language === 'fr'
                ? 'Composant de Cartes Empilées'
                : language === 'zh'
                ? '重叠式卡片组件 · 1/3覆盖'
                : 'Overlapping Stack Deck'}
            </span>
            <span className="text-xs text-text-secondary dark:text-stone-400 font-mono">
              • {cards.length}{' '}
              {language === 'fr' ? 'cartes' : language === 'zh' ? '张卡片' : 'cards'}
            </span>
            {!isExpanded && remainingCount > 0 && (
              <span
                className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-md ${accentClasses.counter} shadow-xs animate-pulse`}
              >
                +{remainingCount}{' '}
                {language === 'fr' ? 'restants' : language === 'zh' ? '剩余' : 'more'}
              </span>
            )}
          </div>

          {title && (
            <h3 className="text-lg sm:text-xl font-bold font-heading text-text-primary dark:text-stone-100 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>{title[language]}</span>
            </h3>
          )}

          {subtitle && (
            <p className="text-xs text-text-secondary dark:text-stone-400 max-w-xl">
              {subtitle[language]}
            </p>
          )}
        </div>

        {/* Action Toggle Button */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            onClick={toggleExpand}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center space-x-2 cursor-pointer active:scale-95 shadow-md ${
              isExpanded
                ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-amber-950/20'
                : 'glass-panel border-sophisticated text-text-primary dark:text-stone-200 hover:border-amber-400/50'
            }`}
            title={
              isExpanded
                ? language === 'zh'
                  ? '再次点击，卡片平滑收回'
                  : 'Click again to smoothly retract'
                : language === 'zh'
                ? '点击卡片依次展开并显示名称'
                : 'Click to expand sequentially'
            }
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>
                  {language === 'fr'
                    ? 'Replier le paquet'
                    : language === 'zh'
                    ? '平滑收回卡片'
                    : 'Smoothly Retract'}
                </span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>
                  {language === 'fr'
                    ? 'Déployer les cartes'
                    : language === 'zh'
                    ? '依次展开卡片'
                    : 'Expand Sequentially'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Card Arena: Click anywhere on collapsed container to expand */}
      <div
        onClick={!isExpanded ? toggleExpand : undefined}
        className={`relative z-10 transition-all duration-500 ${
          !isExpanded ? 'cursor-pointer group select-none' : ''
        }`}
      >
        {/* COLLAPSED STATE (1/3 OVERLAPPING DECK SHOWING TOP 3 CARDS + REMAINING BADGE) */}
        {!isExpanded ? (
          <div className="relative py-4 px-2 sm:px-6">
            {/* Visual Guide Hint Pill */}
            <div className="flex items-center justify-between text-[11px] text-text-secondary dark:text-stone-400 font-mono mb-3">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping" />
                <span>
                  {language === 'fr'
                    ? 'Vue empilée (recouvrement 1/3) • Cliquez pour déployer'
                    : language === 'zh'
                    ? '叠放态：相互覆盖约三分之一 · 点击依次展开'
                    : 'Stacked: 1/3 Overlapping • Click anywhere to expand'}
                </span>
              </span>
              {remainingCount > 0 && (
                <span className="text-amber-500 dark:text-amber-400 font-bold">
                  {language === 'fr'
                    ? `Affichage des 3 premières cartes (+${remainingCount} masquées)`
                    : language === 'zh'
                    ? `显示前 3 张，已收起 +${remainingCount} 张`
                    : `Showing first 3 cards (+${remainingCount} in deck)`}
                </span>
              )}
            </div>

            {/* Overlapping Deck Container */}
            <div
              className={`relative flex items-center justify-start min-h-[220px] sm:min-h-[240px] overflow-visible pb-4 pt-2 ${
                direction === 'horizontal' ? 'flex-row' : 'flex-col justify-center'
              }`}
            >
              {collapsedDisplayCards.map((card, index) => {
                const IconComponent =
                  (card.iconName && ICON_MAP[card.iconName]) || Sparkles;

                // Rotations and 1/3 offsets for the top 3 cards:
                // Card 0: 0px left, slight -2deg tilt
                // Card 1: 33% offset, 0deg tilt, z-index lower
                // Card 2: 66% offset, +2.5deg tilt, z-index lowest of the 3
                const angles = [-2.5, 0.5, 3];
                const angle = angles[index] || 0;

                // Exact 1/3 overlap calculation:
                // Card width is 260px on mobile, 310px on desktop.
                // 1/3 overlap means each subsequent card shifts by (1 - 0.33) * width = ~67% width
                // OR shifts by 33% width so 67% overlaps.
                // To clearly show 3 overlapping cards covering ~1/3 each:
                // Horizontal shift: index * 140px on desktop, index * 105px on mobile.
                const horizontalShiftPx = index * 135;
                const verticalShiftPx = index * 24;

                const zIndex = 30 - index * 5;

                return (
                  <div
                    key={card.id}
                    onClick={(e) => handleCardClick(card, e)}
                    style={{
                      transform:
                        direction === 'horizontal'
                          ? `translateX(${horizontalShiftPx}px) rotate(${angle}deg)`
                          : `translateY(${verticalShiftPx}px) rotate(${angle}deg)`,
                      zIndex,
                      transition:
                        'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 400ms ease',
                    }}
                    onMouseEnter={() => setHoveredCardId(card.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    className={`absolute left-0 top-0 w-[240px] sm:w-[290px] md:w-[320px] rounded-2xl p-4 sm:p-5 border transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer ${
                      index === 0
                        ? 'bg-gradient-to-br from-[#1E223D] via-[#26203D] to-[#1B1930] dark:from-[#171B33] dark:via-[#221C38] dark:to-[#18162B] border-2 border-amber-400/65 text-stone-100 shadow-[0_20px_42px_-6px_rgba(0,0,0,0.65),0_0_28px_rgba(251,191,36,0.22),inset_0_1px_1px_rgba(255,255,255,0.22)]'
                        : index === 1
                        ? 'bg-gradient-to-br from-[#182635] via-[#1B273D] to-[#151D2A] dark:from-[#13202E] dark:via-[#182337] dark:to-[#111A26] border border-teal-400/50 text-stone-200 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.55),0_0_22px_rgba(45,212,191,0.18),inset_0_1px_1px_rgba(255,255,255,0.15)]'
                        : 'bg-gradient-to-br from-[#251D37] via-[#241E3D] to-[#1B182C] dark:from-[#1F1730] dark:via-[#201934] dark:to-[#171426] border border-purple-400/45 text-stone-300 shadow-[0_14px_30px_-6px_rgba(0,0,0,0.5),0_0_18px_rgba(168,85,247,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)]'
                    } group-hover:hover:scale-105 group-hover:hover:-translate-y-2`}
                  >
                    {/* Top Layer Index & Accent Tag */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-5 h-5 rounded-lg bg-surface-muted/90 dark:bg-stone-800 flex items-center justify-center font-mono text-[10px] text-text-secondary dark:text-stone-300 font-bold border border-border-main dark:border-stone-700">
                          0{index + 1}
                        </span>
                        {card.categoryLabel && (
                          <span className="text-[10px] font-mono text-amber-400/90 tracking-wide uppercase">
                            {card.categoryLabel[language]}
                          </span>
                        )}
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card Title (名称) */}
                    <h4 className="text-sm sm:text-base font-bold font-heading line-clamp-1 text-stone-100 group-hover:text-amber-400 transition-colors">
                      {card.title[language]}
                    </h4>

                    {/* Subtitle preview */}
                    {card.subtitle && (
                      <p className="text-[11px] text-stone-400 line-clamp-2 mt-1 leading-snug">
                        {card.subtitle[language]}
                      </p>
                    )}

                    {/* Progress bar or metric if available */}
                    {typeof card.progress === 'number' && (
                      <div className="mt-3 pt-2 border-t border-white/5 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-stone-400">
                          <span>
                            {language === 'fr'
                              ? 'Maîtrise'
                              : language === 'zh'
                              ? '达成进度'
                              : 'Progress'}
                          </span>
                          <span className="font-bold text-emerald-400">{card.progress}%</span>
                        </div>
                        <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={accentClasses.progress + ' h-full rounded-full'}
                            style={{ width: `${card.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* REMAINING CARDS INDICATOR (+N 剩余数量) */}
              {remainingCount > 0 && (
                <div
                  style={{
                    transform:
                      direction === 'horizontal'
                        ? `translateX(${3 * 135 + 20}px) translateY(8px)`
                        : `translateY(${3 * 24 + 16}px)`,
                    zIndex: 10,
                  }}
                  className="absolute left-0 top-0 flex flex-col items-center justify-center w-28 sm:w-36 h-[170px] sm:h-[190px] rounded-2xl border-2 border-dashed border-amber-400/60 bg-gradient-to-br from-amber-500/22 via-[#221C3A]/85 to-[#121424]/90 backdrop-blur-md shadow-[0_0_24px_rgba(245,158,11,0.24)] text-center p-3 cursor-pointer hover:border-amber-300 hover:scale-105 transition-all duration-300"
                  onClick={toggleExpand}
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/25 border border-amber-400/50 flex items-center justify-center text-amber-300 mb-2 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                    <Layers className="w-5 h-5 animate-bounce" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 tracking-tight drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                    +{remainingCount}
                  </div>
                  <div className="text-[10px] font-mono text-stone-300 uppercase tracking-wider mt-0.5">
                    {language === 'fr'
                      ? 'Restants'
                      : language === 'zh'
                      ? '更多卡片'
                      : 'Remaining'}
                  </div>
                  <span className="text-[9px] text-amber-400/80 mt-1 underline">
                    {language === 'fr' ? 'Déplier' : language === 'zh' ? '点击展开' : 'Tap to expand'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* EXPANDED STATE (SEQUENTIALLY UNFOLDED CARDS, DISPLAYING NAME & DETAILS) */
          <div className="space-y-4 pt-2">
            {/* Expanded Header Banner */}
            <div className="flex items-center justify-between text-xs text-text-secondary dark:text-stone-400 font-mono pb-2 border-b border-border-main/40 dark:border-stone-800">
              <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {language === 'fr'
                    ? `Toutes les ${cards.length} cartes sont déployées avec leurs dénominations`
                    : language === 'zh'
                    ? `已依次展开全部 ${cards.length} 张卡片并显示完整名称`
                    : `All ${cards.length} cards sequentially expanded showing full titles`}
                </span>
              </span>
              <button
                onClick={toggleExpand}
                className="text-[11px] text-amber-500 hover:text-amber-400 underline cursor-pointer"
              >
                {language === 'fr'
                  ? 'Replier en paquet 1/3'
                  : language === 'zh'
                  ? '再次点击平滑收回'
                  : 'Click again to smoothly retract'}
              </button>
            </div>

            {/* Grid of Expanded Cards with Staggered Fade & Slide In Animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card, index) => {
                const IconComponent =
                  (card.iconName && ICON_MAP[card.iconName]) || Sparkles;
                const isSelected = selectedCardId === card.id;

                // Staggered sequential animation delay
                const delayMs = index * 55;

                return (
                  <div
                    key={card.id}
                    onClick={(e) => handleCardClick(card, e)}
                    style={{
                      animationDelay: `${delayMs}ms`,
                      transitionDelay: `${delayMs}ms`,
                    }}
                    className={`rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer group shadow-xl ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500/25 via-[#231E3D] to-[#15192C] border-2 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_16px_40px_-4px_rgba(245,158,11,0.25)] scale-[1.01]'
                        : 'bg-surface-main dark:bg-gradient-to-br dark:from-[#15192B] dark:via-[#191D33] dark:to-[#121524] border-border-main dark:border-amber-400/20 hover:border-amber-400/60 hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.45),0_0_24px_rgba(229,184,66,0.18)] hover:-translate-y-1'
                    }`}
                  >
                    {/* Top Row: Index Badge, Category Label, Status */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-lg bg-surface-muted dark:bg-stone-800 flex items-center justify-center font-mono text-xs text-text-secondary dark:text-stone-300 font-bold border border-border-main dark:border-stone-700">
                            0{index + 1}
                          </span>
                          {card.categoryLabel && (
                            <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-border-main/50 dark:border-stone-700">
                              {card.categoryLabel[language]}
                            </span>
                          )}
                        </div>

                        {card.badge && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            {card.badge[language]}
                          </span>
                        )}
                      </div>

                      {/* Explicit Name / Title (显示名称) */}
                      <div className="flex items-start space-x-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold font-heading text-text-primary dark:text-stone-100 group-hover:text-amber-500 transition-colors">
                            {card.title[language]}
                          </h4>
                          {card.subtitle && (
                            <p className="text-xs text-text-secondary dark:text-stone-400 mt-0.5">
                              {card.subtitle[language]}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Detailed Description */}
                      {card.description && (
                        <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed mt-2.5 bg-surface-muted/60 dark:bg-stone-950/40 p-3 rounded-xl border border-border-main/40 dark:border-stone-800/60">
                          {card.description[language]}
                        </p>
                      )}

                      {/* Tags */}
                      {card.tags && card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {card.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-muted dark:bg-stone-800/70 text-text-secondary dark:text-stone-300 border border-border-main/50 dark:border-stone-700/60"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Metrics Key-Values */}
                      {card.metrics && card.metrics.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-border-main/40 dark:border-stone-800/80 text-xs font-mono">
                          {card.metrics.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="bg-surface-muted/50 dark:bg-stone-800/40 p-2 rounded-lg"
                            >
                              <div className="text-[10px] text-text-secondary dark:text-stone-400">
                                {m.label[language]}
                              </div>
                              <div className="font-bold text-amber-500 dark:text-amber-400">
                                {m.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-border-main/50 dark:border-stone-800/80 flex items-center justify-between">
                      {/* Progress Bar */}
                      {typeof card.progress === 'number' && (
                        <div className="flex-1 mr-3">
                          <div className="flex justify-between text-[10px] font-mono mb-1">
                            <span className="text-text-secondary dark:text-stone-400">
                              {language === 'fr'
                                ? 'Progression'
                                : language === 'zh'
                                ? '研习进度'
                                : 'Mastery'}
                            </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {card.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${card.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playTactileAudio('card');
                          if (onCardAction) onCardAction(card);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-stone-950 text-amber-500 dark:text-amber-400 font-medium text-xs border border-amber-400/30 transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                      >
                        <span>
                          {card.actionText
                            ? card.actionText[language]
                            : language === 'fr'
                            ? 'Consulter'
                            : language === 'zh'
                            ? '研习详情'
                            : 'Explore'}
                        </span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
