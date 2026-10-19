import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Sliders,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Check,
  Eye,
  Maximize2,
  ChevronDown,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  OpeningConfig,
  DEFAULT_OPENING_CONFIG,
  CITY_PRESETS,
  MATTE_THEMES,
  IMAGE_FILTERS,
} from '../../types/opening';
import { OpeningCustomizerModal } from './OpeningCustomizerModal';
import { playTibetanSingingBowl } from '../../utils/soundscapes';
import { Language } from '../../types';

interface ArtisticOpeningPortalProps {
  isOpen: boolean;
  onEnterApp: () => void;
  language: Language;
}

const STORAGE_KEY = 'venture_mind_opening_config';

export const ArtisticOpeningPortal: React.FC<ArtisticOpeningPortalProps> = ({
  isOpen,
  onEnterApp,
  language,
}) => {
  // Load saved config or fallback to default
  const [config, setConfig] = useState<OpeningConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_OPENING_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not load opening config from localStorage', e);
    }
    return DEFAULT_OPENING_CONFIG;
  });

  // Animation progress: 0.0 (knockout title cover) -> 1.0 (full screen photo)
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayDirection, setAutoPlayDirection] = useState<'forward' | 'backward'>('forward');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Gesture refs
  const dragStartY = useRef(0);
  const dragStartProgress = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const hasTriggeredChime = useRef(false);

  // Save config changes to localStorage
  const handleConfigChange = (newConfig: OpeningConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Could not save opening config', e);
    }
  };

  // Current active preset or custom image
  const activePreset =
    CITY_PRESETS.find((p) => p.id === config.presetId) || CITY_PRESETS[0];
  const activeImageUrl = config.customImageDataUrl || activePreset.imageUrl;
  const currentMatte = MATTE_THEMES[config.matteTheme] || MATTE_THEMES.obsidian;
  const currentFilter = IMAGE_FILTERS[config.imageFilter] || IMAGE_FILTERS.normal;

  // Sound chime when expanding to full screen
  useEffect(() => {
    if (progress >= 0.94 && !hasTriggeredChime.current) {
      hasTriggeredChime.current = true;
      if (config.enableSoundChime) {
        playTibetanSingingBowl(324, 4.5);
      }
    } else if (progress < 0.6) {
      hasTriggeredChime.current = false;
    }
  }, [progress, config.enableSoundChime]);

  // Auto-play animation loop
  useEffect(() => {
    if (!isAutoPlaying) return;

    let lastTime = performance.now();
    const speed = 0.00045 * config.gestureSensitivity;

    const step = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      setProgress((prev) => {
        if (autoPlayDirection === 'forward') {
          const next = prev + speed * delta;
          if (next >= 1) {
            setAutoPlayDirection('backward');
            return 1;
          }
          return next;
        } else {
          const next = prev - speed * delta;
          if (next <= 0) {
            setAutoPlayDirection('forward');
            return 0;
          }
          return next;
        }
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoPlaying, autoPlayDirection, config.gestureSensitivity]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isCustomizerOpen) return;
    setIsAutoPlaying(false);
    setIsDragging(true);
    dragStartY.current = e.touches[0].clientY;
    dragStartProgress.current = progress;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = dragStartY.current - currentY; // positive = swipe UP, negative = swipe DOWN
    const height = window.innerHeight || 800;
    const deltaProgress = (deltaY / (height * 0.65)) * config.gestureSensitivity;

    const next = Math.max(0, Math.min(1, dragStartProgress.current + deltaProgress));
    setProgress(next);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (config.autoSnapToEnds) {
      // Smooth snap to 0 or 1
      const target = progress > 0.48 ? 1 : 0;
      animateToProgress(target);
    }
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCustomizerOpen) return;
    // Don't drag if clicking buttons or sliders
    if ((e.target as HTMLElement).closest('button, input, a')) return;

    setIsAutoPlaying(false);
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartProgress.current = progress;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = dragStartY.current - e.clientY;
    const height = window.innerHeight || 800;
    const deltaProgress = (deltaY / (height * 0.65)) * config.gestureSensitivity;

    const next = Math.max(0, Math.min(1, dragStartProgress.current + deltaProgress));
    setProgress(next);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (config.autoSnapToEnds) {
      const target = progress > 0.48 ? 1 : 0;
      animateToProgress(target);
    }
  };

  // Trackpad / Wheel handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (isCustomizerOpen) return;
      e.preventDefault();
      setIsAutoPlaying(false);

      const delta = e.deltaY;
      const step = (delta / 800) * config.gestureSensitivity;
      setProgress((prev) => Math.max(0, Math.min(1, prev + step)));
    },
    [isCustomizerOpen, config.gestureSensitivity]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen) return;

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, isOpen]);

  // Helper smooth animation to target
  const animateToProgress = (target: number) => {
    const start = progress;
    const duration = 450;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - t, 3);
      const val = start + (target - start) * ease;
      setProgress(val);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  if (!isOpen) return null;

  // SVG Mask Typography Calculations
  // Center coordinates for transform:
  const textCenterY = (config.textPositionY / 100) * 1000;
  // Calculate current scale from progress
  // Non-linear power curve for cinematic acceleration
  const zoomFactor = Math.pow(progress, 1.35);
  const currentScale = 1 + zoomFactor * (config.maxExpansionZoom - 1);

  // Matte opacity: stays 1.0 until 60% progress, then fades out completely by 95%
  const matteOpacity = progress < 0.6 ? 1 : Math.max(0, 1 - (progress - 0.6) / 0.35);

  // Subtle photo zoom parallax: expands slightly as camera dollies into the letters
  const currentPhotoScale =
    config.photoZoom * (1 + progress * 0.14);

  // Gold stroke outline on letters: visible at resting state, fades as portal opens
  const strokeOpacity = Math.max(0, 1 - progress * 2.8);

  const t = {
    tagline: {
      en: 'EXECUTIVE COMPOSURE & VENTURE ARCHITECTURE',
      fr: 'SÉRÉNITÉ EXÉCUTIVE & ARCHITECTURE DU CAPITAL',
      zh: '创投正念殿堂 · 沉浸艺术开场',
    },
    swipeUpHint: {
      en: 'SWIPE UP TO EXPAND INTO SANCTUARY',
      fr: 'GLISSEZ VERS LE HAUT POUR ENTRER',
      zh: '向上滑动 · 画面从字形扩展到全屏',
    },
    swipeDownHint: {
      en: 'SWIPE DOWN TO CONTRACT BACK',
      fr: 'GLISSEZ VERS LE BAS POUR REVENIR',
      zh: '向下滑动 · 画面沿原路径收回',
    },
    enterApp: {
      en: 'Enter Workspace',
      fr: 'Entrer dans l’Application',
      zh: '进入工作台',
    },
    customize: {
      en: 'Customize',
      fr: 'Personnaliser',
      zh: '自定义',
    },
    welcomeTitle: {
      en: 'The Sanctuary Unfolds',
      fr: 'Le Sanctuaire se Révèle',
      zh: '全屏沉浸视野 · 创投正念境界',
    },
    welcomeDesc: {
      en: 'Welcome to Venture Mind. Step inside to navigate high-stakes deals with unwavering composure.',
      fr: 'Bienvenue sur Venture Mind. Naviguez dans les négociations à fort enjeu avec calme et clarté.',
      zh: '欢迎步入 VENTURE MIND。以高阶从容心境，驾驭商业风云与百亿估值搏弈。',
    },
    returnCover: {
      en: 'Contract to Title',
      fr: 'Revenir au Titre',
      zh: '收回镂空封面',
    },
    enterSanctuaryBtn: {
      en: 'Enter Sanctuary',
      fr: 'Ouvrir le Sanctuaire',
      zh: '开启创投之旅',
    },
  };

  const fontFamilyClass =
    config.fontStyle === 'playfair'
      ? 'font-serif-luxury'
      : 'font-sans font-black';

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="fixed inset-0 z-50 overflow-hidden select-none touch-none bg-[#0B0E18] cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      {/* 1. Underlying Photo Layer (London, NY, Kyoto, or User Custom) with High-Luminance Exposure */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-transform duration-75"
        style={{
          transform: `translate(${config.photoPanX}%, ${config.photoPanY}%) scale(${currentPhotoScale})`,
          filter: currentFilter.cssFilter,
          transformOrigin: 'center center',
        }}
      >
        <img
          src={activeImageUrl}
          alt={activePreset.city}
          className="w-full h-full object-cover object-center pointer-events-none"
        />
        {/* Subtle cinematic golden hour vignette with luminous exposure */}
        <div
          className="absolute inset-0 bg-radial from-amber-400/5 via-transparent to-black/30 pointer-events-none"
          style={{ opacity: 0.35 + progress * 0.15 }}
        />
      </div>

      {/* 2. SVG Knockout Mask Overlay */}
      {/* The white rect is opaque; black letters in the mask cut transparent apertures revealing the photo */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="vm-opening-knockout-mask" maskUnits="userSpaceOnUse">
            {/* Base white fills everything, making the matte rect 100% visible */}
            <rect x="-2000" y="-2000" width="5000" height="5000" fill="white" />

            {/* Cutout text in pure black: scales up dynamically with user swipe */}
            <g
              transform={`translate(500, ${textCenterY}) scale(${currentScale}) translate(-500, -${textCenterY})`}
            >
              {config.textLayout === 'two_lines' ? (
                <>
                  <text
                    x="500"
                    y={textCenterY - 45}
                    textAnchor="middle"
                    fill="black"
                    fontFamily={
                      config.fontStyle === 'playfair'
                        ? 'Playfair Display, Georgia, serif'
                        : 'Plus Jakarta Sans, sans-serif'
                    }
                    fontWeight="900"
                    fontSize={145 * config.textSizeMultiplier}
                    letterSpacing={`${config.letterSpacing * 1000}px`}
                  >
                    VENTURE
                  </text>
                  <text
                    x="500"
                    y={textCenterY + 115}
                    textAnchor="middle"
                    fill="black"
                    fontFamily={
                      config.fontStyle === 'playfair'
                        ? 'Playfair Display, Georgia, serif'
                        : 'Plus Jakarta Sans, sans-serif'
                    }
                    fontWeight="900"
                    fontSize={145 * config.textSizeMultiplier}
                    letterSpacing={`${config.letterSpacing * 1000}px`}
                  >
                    MIND
                  </text>
                </>
              ) : (
                <text
                  x="500"
                  y={textCenterY + 35}
                  textAnchor="middle"
                  fill="black"
                  fontFamily={
                    config.fontStyle === 'playfair'
                      ? 'Playfair Display, Georgia, serif'
                      : 'Plus Jakarta Sans, sans-serif'
                  }
                  fontWeight="900"
                  fontSize={100 * config.textSizeMultiplier}
                  letterSpacing={`${config.letterSpacing * 1000}px`}
                >
                  VENTURE MIND
                </text>
              )}
            </g>
          </mask>
        </defs>

        {/* Matte cover with the knockout mask applied */}
        <rect
          x="-2000"
          y="-2000"
          width="5000"
          height="5000"
          fill={currentMatte.hex}
          mask="url(#vm-opening-knockout-mask)"
          opacity={matteOpacity}
        />

        {/* Delicate luxury gold foil letter stroke (visible at rest, dissolves on zoom) */}
        {strokeOpacity > 0.02 && (
          <g
            opacity={strokeOpacity}
            transform={`translate(500, ${textCenterY}) scale(${currentScale}) translate(-500, -${textCenterY})`}
          >
            {config.textLayout === 'two_lines' ? (
              <>
                <text
                  x="500"
                  y={textCenterY - 45}
                  textAnchor="middle"
                  fill="none"
                  stroke={currentMatte.goldAccent}
                  strokeWidth={1.8}
                  fontFamily={
                    config.fontStyle === 'playfair'
                      ? 'Playfair Display, Georgia, serif'
                      : 'Plus Jakarta Sans, sans-serif'
                  }
                  fontWeight="900"
                  fontSize={145 * config.textSizeMultiplier}
                  letterSpacing={`${config.letterSpacing * 1000}px`}
                >
                  VENTURE
                </text>
                <text
                  x="500"
                  y={textCenterY + 115}
                  textAnchor="middle"
                  fill="none"
                  stroke={currentMatte.goldAccent}
                  strokeWidth={1.8}
                  fontFamily={
                    config.fontStyle === 'playfair'
                      ? 'Playfair Display, Georgia, serif'
                      : 'Plus Jakarta Sans, sans-serif'
                  }
                  fontWeight="900"
                  fontSize={145 * config.textSizeMultiplier}
                  letterSpacing={`${config.letterSpacing * 1000}px`}
                >
                  MIND
                </text>
              </>
            ) : (
              <text
                x="500"
                y={textCenterY + 35}
                textAnchor="middle"
                fill="none"
                stroke={currentMatte.goldAccent}
                strokeWidth={1.8}
                fontFamily={
                  config.fontStyle === 'playfair'
                    ? 'Playfair Display, Georgia, serif'
                    : 'Plus Jakarta Sans, sans-serif'
                }
                fontWeight="900"
                fontSize={100 * config.textSizeMultiplier}
                letterSpacing={`${config.letterSpacing * 1000}px`}
              >
                VENTURE MIND
              </text>
            )}
          </g>
        )}
      </svg>

      {/* 3. Editorial Metadata & Cover Framing (Fades as progress rises) */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5 sm:p-8 md:p-12 transition-opacity duration-300"
        style={{ opacity: Math.max(0, 1 - progress * 2.2) }}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between text-xs tracking-widest uppercase font-mono text-stone-400">
          <div className="flex items-center space-x-2">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: currentMatte.goldAccent }}
            />
            <span className="text-stone-300 font-semibold">VENTURE MIND</span>
            <span className="hidden sm:inline text-stone-500">· ED. 2026</span>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-[11px] text-stone-400">
            <span>{activePreset.city}</span>
            <span>·</span>
            <span>{activePreset.coordinates}</span>
          </div>

          <div className="text-[11px] text-amber-400 font-mono">
            {Math.round(progress * 100)}% PORTAL
          </div>
        </div>

        {/* Center Tagline above or below the knockout headline */}
        {config.showTagline && (
          <div className="text-center space-y-2 pointer-events-none">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/30 text-[11px] font-mono tracking-widest text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{t.tagline[language]}</span>
            </div>
            <div className="text-[10px] tracking-wider text-stone-400 font-mono">
              {activePreset.city.toUpperCase()} · {activePreset.country.toUpperCase()}
            </div>
          </div>
        )}

        {/* Bottom Swipe Prompt */}
        <div className="flex flex-col items-center space-y-2 text-center pointer-events-none">
          <div className="flex items-center space-x-1.5 text-xs tracking-wider uppercase font-mono text-amber-400 animate-bounce">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{t.swipeUpHint[language]}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-[10px] text-stone-500 font-mono">
            {language === 'zh'
              ? '支持手势滑动、滚轮缩放、右侧进度拖拽或自动演示'
              : 'Touch swipe, scroll wheel, drag scrubber or auto demo'}
          </div>
        </div>
      </div>

      {/* 4. Interactive Floating HUD & Quick Actions (Always accessible) */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 pointer-events-auto">
        {/* Auto Play / Pause Toggle */}
        <button
          onClick={() => setIsAutoPlaying((prev) => !prev)}
          className={`p-2.5 rounded-2xl backdrop-blur-xl border text-xs transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5 ${
            isAutoPlaying
              ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-lg'
              : 'bg-black/50 hover:bg-black/75 border-white/20 text-stone-200 hover:text-white'
          }`}
          title="Auto play zoom animation"
        >
          {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="hidden sm:inline text-[11px]">
            {isAutoPlaying
              ? language === 'zh'
                ? '暂停演示'
                : 'Pause'
              : language === 'zh'
              ? '自动播放'
              : 'Auto Demo'}
          </span>
        </button>

        {/* Customization Settings Button */}
        <button
          onClick={() => setIsCustomizerOpen(true)}
          className="p-2.5 rounded-2xl bg-black/50 hover:bg-black/75 backdrop-blur-xl border border-white/20 hover:border-amber-400/60 text-stone-200 hover:text-amber-400 transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5 shadow-lg"
          title="Open Customizer (Backgrounds, Crop, Typography, Dynamics)"
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden sm:inline text-[11px] font-medium">{t.customize[language]}</span>
        </button>

        {/* Fast Enter App Button */}
        <button
          onClick={onEnterApp}
          className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5 shadow-xl"
        >
          <span>{t.enterApp[language]}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5. City Quick Presets Bottom Bar (When resting or low progress) */}
      {progress < 0.35 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 p-1.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 max-w-[95vw] overflow-x-auto no-scrollbar pointer-events-auto">
          {CITY_PRESETS.map((preset) => {
            const isSelected = config.presetId === preset.id && !config.customImageDataUrl;
            return (
              <button
                key={preset.id}
                onClick={() =>
                  handleConfigChange({
                    ...config,
                    presetId: preset.id,
                    customImageDataUrl: null,
                    matteTheme: preset.defaultMatte,
                    imageFilter: preset.defaultFilter,
                  })
                }
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {preset.city}
              </button>
            );
          })}
          {config.customImageDataUrl && (
            <span className="px-2.5 py-1.5 rounded-xl text-[11px] bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              {language === 'zh' ? '自定义照片' : 'Custom'}
            </span>
          )}
        </div>
      )}

      {/* 6. Vertical Scrubber / Interactive Scrub Gauge on Right Edge */}
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center space-y-2 pointer-events-auto">
        <span className="text-[9px] font-mono text-amber-400/80 -rotate-90 origin-center mb-1">
          {Math.round(progress * 100)}%
        </span>
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const ratio = 1 - clickY / rect.height; // top is 100%, bottom is 0%
            animateToProgress(Math.max(0, Math.min(1, ratio)));
          }}
          className="w-2.5 h-36 sm:h-48 rounded-full bg-white/15 backdrop-blur-md relative cursor-pointer overflow-hidden p-0.5 border border-white/20 shadow-lg"
          title="Drag or click to scrub animation"
        >
          <div
            className="w-full rounded-full bg-gradient-to-t from-amber-500 via-amber-400 to-amber-300 absolute bottom-0 left-0 transition-all duration-75"
            style={{ height: `${progress * 100}%` }}
          />
        </div>
        <div className="flex flex-col space-y-1 text-stone-400">
          <button
            onClick={() => animateToProgress(1)}
            title="Jump to 100% full screen"
            className="p-1 rounded-lg hover:bg-white/20 text-stone-300 hover:text-white text-[10px]"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => animateToProgress(0)}
            title="Reset to 0% title"
            className="p-1 rounded-lg hover:bg-white/20 text-stone-300 hover:text-white text-[10px]"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 7. Welcoming Card at 100% Full-Screen Expansion */}
      {progress >= 0.88 && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 pointer-events-none transition-opacity duration-500"
          style={{ opacity: (progress - 0.88) / 0.12 }}
        >
          <div className="max-w-lg w-full bg-stone-950/80 backdrop-blur-2xl border border-amber-500/40 p-6 sm:p-8 rounded-3xl text-center space-y-5 shadow-2xl pointer-events-auto">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400 mb-1">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
                {t.welcomeTitle[language]}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm mx-auto">
                {t.welcomeDesc[language]}
              </p>
            </div>

            {/* City Metadata badge */}
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {activePreset.city} · {activePreset.coordinates}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => animateToProgress(0)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
              >
                <ArrowDown className="w-4 h-4 text-amber-400" />
                <span>{t.returnCover[language]}</span>
              </button>

              <button
                onClick={onEnterApp}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-stone-950 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20"
              >
                <span>{t.enterSanctuaryBtn[language]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Swipe Down prompt reminder */}
            <div className="text-[11px] text-stone-400 font-mono flex items-center justify-center space-x-1 pt-1">
              <ArrowDown className="w-3 h-3 text-amber-400" />
              <span>{t.swipeDownHint[language]}</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. Opening Customizer Modal Drawer */}
      <OpeningCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onChangeConfig={handleConfigChange}
        language={language}
      />
    </div>
  );
};
