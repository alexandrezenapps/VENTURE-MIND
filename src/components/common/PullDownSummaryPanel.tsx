import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Brain,
  ShieldCheck,
  TrendingUp,
  Award,
  Sparkles,
  Sliders,
  Flame,
  Volume2,
  FileSpreadsheet,
  Zap,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PullDownSummaryPanel: React.FC = () => {
  const { language, progress, setActiveTab } = useApp();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Height configurations in px
  const COLLAPSED_HEIGHT = 48; // Single-row capsule bar height
  const EXPANDED_HEIGHT = 380; // Full statistics dashboard height
  const DRAG_THRESHOLD = 50; // Threshold px to trigger expand or collapse

  // Calculate dynamic current height during drag
  const currentHeight = isDragging
    ? isExpanded
      ? Math.max(COLLAPSED_HEIGHT, Math.min(EXPANDED_HEIGHT + 40, EXPANDED_HEIGHT + dragOffset))
      : Math.max(COLLAPSED_HEIGHT, Math.min(EXPANDED_HEIGHT, COLLAPSED_HEIGHT + dragOffset))
    : isExpanded
    ? EXPANDED_HEIGHT
    : COLLAPSED_HEIGHT;

  // Dimmness ratio from 0 to 1
  const expandProgress = Math.max(
    0,
    Math.min(1, (currentHeight - COLLAPSED_HEIGHT) / (EXPANDED_HEIGHT - COLLAPSED_HEIGHT))
  );

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = e.touches[0].clientY;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentYRef.current = e.touches[0].clientY;
    const delta = currentYRef.current - startYRef.current;
    // Apply soft damping
    setDragOffset(delta * 0.85);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!isExpanded) {
      // If was collapsed and dragged down past threshold, expand!
      if (dragOffset > DRAG_THRESHOLD) {
        setIsExpanded(true);
      }
    } else {
      // If was expanded and dragged up past threshold, collapse!
      if (dragOffset < -DRAG_THRESHOLD) {
        setIsExpanded(false);
      }
    }
    setDragOffset(0);
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    startYRef.current = e.clientY;
    currentYRef.current = e.clientY;
    setIsDragging(true);
    setDragOffset(0);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      currentYRef.current = e.clientY;
      const delta = currentYRef.current - startYRef.current;
      setDragOffset(delta * 0.85);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (!isExpanded) {
        if (dragOffset > DRAG_THRESHOLD) {
          setIsExpanded(true);
        }
      } else {
        if (dragOffset < -DRAG_THRESHOLD) {
          setIsExpanded(false);
        }
      }
      setDragOffset(0);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isExpanded, dragOffset]);

  // Aggregate telemetry
  const totalGameScore = Object.values(progress.gameScores).reduce((a, b) => a + b, 0);
  const composureRate = progress.radarCompetencies.psychology || 78;
  const termsLearnedCount = progress.completedLessons?.length || 42;

  return (
    <>
      {/* ========================================================
          1. TOP EXPANDABLE SUMMARY CONTAINER (跟手下拉展开)
          ======================================================== */}
      <div
        ref={panelRef}
        style={{
          height: `${currentHeight}px`,
          transition: isDragging ? 'none' : 'height 420ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative w-full z-40 bg-[#0E1222]/95 dark:bg-[#0A0D1A]/96 backdrop-blur-2xl border-b border-amber-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden select-none transition-colors"
      >
        {/* Subtle Ambient Radial Light */}
        <div className="absolute top-0 right-1/3 w-96 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-96 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ========================================================
            STATE A: COLLAPSED SINGLE-ROW CAPSULE (收起时为一行胶囊)
            ======================================================== */}
        <div
          onClick={() => {
            if (!isDragging) setIsExpanded((prev) => !prev);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          className={`h-12 w-full px-3 sm:px-6 flex items-center justify-between cursor-grab active:cursor-grabbing transition-opacity duration-200 ${
            expandProgress > 0.3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Left: Venture IQ & Level Capsule */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Venture IQ {progress.ventureIQ}</span>
            </div>
            <span className="hidden md:inline text-xs font-mono text-stone-300">
              Lv.{progress.level} · {language === 'zh' ? '战略掌控者' : 'Master Strategist'}
            </span>
          </div>

          {/* Center: Tactile Drag Handle Pill (跟手下拉指示器) */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-12 sm:w-16 h-1.5 rounded-full bg-amber-400/50 hover:bg-amber-400/80 transition-all shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
            <div className="flex items-center space-x-1 text-[10px] font-mono text-amber-300/80">
              <ChevronDown className="w-3 h-3 text-amber-400 animate-bounce" />
              <span className="hidden sm:inline">
                {language === 'fr'
                  ? 'Glissez vers le bas pour le panneau complet'
                  : language === 'zh'
                  ? '下拉展开完整统计面板'
                  : 'Pull down for full telemetry'}
              </span>
            </div>
          </div>

          {/* Right: Composure & Arena stats */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-mono">
            <div className="hidden sm:flex items-center space-x-1.5 text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{composureRate}% {language === 'zh' ? '定力率' : 'Composure'}</span>
            </div>
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-200">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalGameScore} pts</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            STATE B: FULL EXPANDED TELEMETRY PANEL (完整统计面板)
            ======================================================== */}
        <div
          style={{
            opacity: expandProgress,
            transform: `translateY(${(1 - expandProgress) * -15}px)`,
          }}
          className={`absolute inset-0 px-4 sm:px-8 py-4 sm:py-5 flex flex-col justify-between overflow-y-auto no-scrollbar transition-opacity duration-300 ${
            expandProgress < 0.2 ? 'pointer-events-none' : ''
          }`}
        >
          {/* Top Bar of Expanded Panel */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-white">
                    {language === 'fr'
                      ? 'Télémétrie Stratégique Exécutive'
                      : language === 'zh'
                      ? '执行官全维战略数理总览 · 实时统计面板'
                      : 'Executive Telemetry & Real-Time Intelligence'}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono font-bold">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  {language === 'fr'
                    ? 'Indicateurs de souveraineté financière, sang-froid et neuro-agilité.'
                    : language === 'zh'
                    ? '汇聚创投智商、自律神经定力、12项心智博弈积分与关键条款攻防数据。'
                    : 'Aggregated metrics across venture IQ, autonomic resilience, and deal games.'}
                </p>
              </div>
            </div>

            {/* Collapse Pill Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 hover:text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronUp className="w-4 h-4 text-amber-400" />
              <span>{language === 'zh' ? '收起胶囊' : 'Collapse'}</span>
            </button>
          </div>

          {/* Middle: 4 Key Executive Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-auto py-2">
            {/* Card 1: Venture IQ */}
            <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-amber-400/30 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                <span>Venture IQ</span>
                <Brain className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 tabular-nums">
                  {progress.ventureIQ}
                  <span className="text-xs font-normal text-stone-400 ml-1">/ 180</span>
                </div>
                <div className="mt-1 flex items-center space-x-2 text-[11px] text-stone-400 font-mono">
                  <span className="text-emerald-400 font-bold">Lv.{progress.level}</span>
                  <span>• {language === 'zh' ? '前 3% 顶尖决策' : 'Top 3% Decile'}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Composure & Autonomic Resilience */}
            <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-purple-400/30 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                <span>{language === 'zh' ? '定力抗压率' : 'Composure'}</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-300 tabular-nums">
                  {composureRate}%
                </div>
                <div className="mt-1 flex items-center space-x-2 text-[11px] text-stone-400 font-mono">
                  <span className="text-purple-400 font-bold">Vagal 4-4-4</span>
                  <span>• {language === 'zh' ? '迷走神经共振' : 'Optimal'}</span>
                </div>
              </div>
            </div>

            {/* Card 3: 12 Psychology Mind Games Score */}
            <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-emerald-400/30 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                <span>{language === 'zh' ? '12项心智挑战' : '12 Mind Games'}</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300 tabular-nums">
                  {totalGameScore}
                  <span className="text-xs font-normal text-stone-400 ml-1">pts</span>
                </div>
                <div className="mt-1 flex items-center space-x-2 text-[11px] text-stone-400 font-mono">
                  <span className="text-emerald-400 font-bold">12 / 12</span>
                  <span>• {language === 'zh' ? '科学范式已装配' : 'Paradigms Live'}</span>
                </div>
              </div>
            </div>

            {/* Card 4: Term Sheet & Cap Table Defenses */}
            <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-cyan-400/30 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                <span>{language === 'zh' ? '核心条款防御' : 'Clause Defense'}</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300 tabular-nums">
                  {termsLearnedCount}
                  <span className="text-xs font-normal text-stone-400 ml-1">/ 100</span>
                </div>
                <div className="mt-1 flex items-center space-x-2 text-[11px] text-stone-400 font-mono">
                  <span className="text-cyan-400 font-bold">1.0x Non-Part</span>
                  <span>• {language === 'zh' ? '护城河牢固' : 'Secure'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Quick Trigger Links & Drag Handle to Collapse */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => {
                  setActiveTab('psychology');
                  setIsExpanded(false);
                }}
                className="px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '进入12项心智游戏' : '12 Mind Games'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('simulators');
                  setIsExpanded(false);
                }}
                className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '股权沙盘推演' : 'Cap Table'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('negotiation');
                  setIsExpanded(false);
                }}
                className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? 'AI投资人实战博弈' : 'VC Duel'}</span>
              </button>
            </div>

            {/* Bottom drag handle cue */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              className="flex items-center space-x-1 text-[11px] text-amber-300/80 cursor-grab active:cursor-grabbing hover:text-amber-200"
            >
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'zh' ? '向上轻扫或点击即可收起' : 'Swipe up to collapse'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. BELOW CONTENT DIMMING SCRIM (下方内容下移并变暗)
          Clicking the dimmed overlay automatically collapses the panel!
          ======================================================== */}
      {expandProgress > 0 && (
        <div
          onClick={() => setIsExpanded(false)}
          style={{
            opacity: expandProgress * 0.65,
            transition: isDragging ? 'none' : 'opacity 420ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="fixed inset-x-0 bottom-0 top-16 bg-black/80 backdrop-blur-[2px] z-30 cursor-pointer"
          title={language === 'zh' ? '点击背景收起统计面板' : 'Click to collapse summary'}
        />
      )}
    </>
  );
};
