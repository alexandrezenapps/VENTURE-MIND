import React, { useState } from 'react';
import {
  Layers,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Play,
  RotateCcw,
  Target,
  Brain,
  ShieldCheck,
  Award,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { PsychologyGameMeta, Language } from '../../types';
import { psychologyDomainsMeta } from '../../data/psychologyGamesData';
import { useApp } from '../../context/AppContext';

interface MindGamesOverlappingDeckProps {
  games: PsychologyGameMeta[];
  onSelectGame: (gameId: string) => void;
}

export const MindGamesOverlappingDeck: React.FC<MindGamesOverlappingDeckProps> = ({
  games,
  onSelectGame,
}) => {
  const { language, progress } = useApp();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Number of cards visible in the collapsed 1/3 overlapping stack
  const PREVIEW_COUNT = 4;
  const remainingCount = Math.max(0, games.length - PREVIEW_COUNT);

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'attention':
        return Target;
      case 'brain':
        return Brain;
      case 'resilience':
        return ShieldCheck;
      default:
        return Brain;
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#0e1224] via-[#141933] to-[#0d1020] border border-amber-400/25 p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden transition-all duration-500">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Deck Header & Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono uppercase font-bold tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {language === 'fr'
                ? 'Pile Tactique · 1/3 Chevauchement'
                : language === 'zh'
                ? '三分之一重叠卡组 · 12项高阶心智挑战'
                : '1/3 Overlap Deck · 12 Mind Challenges'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-white flex items-center space-x-2">
            <span>
              {language === 'fr'
                ? 'Deck des Défis Cérébraux d’Élite'
                : language === 'zh'
                ? '心智博弈重叠牌组 · 依次散开与收回'
                : 'Executive Mind Mastery Card Deck'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
              12 Games
            </span>
          </h2>
          <p className="text-xs text-stone-300">
            {language === 'fr'
              ? 'Cliquez pour déployer les 12 défis en cascade séquentielle avec logos et titres complets. Re-cliquez pour replier.'
              : language === 'zh'
              ? '默认1/3重叠排列并显示尾部剩余项。点击卡组或按钮依次散开展示全部名称与徽章，再次点击即可原路收回。'
              : 'Stacked with 1/3 overlap with remaining count tail. Click to cascade and fan out all 12 titles and logos; click again to retract.'}
          </p>
        </div>

        {/* Expansion / Retraction Toggle Button */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="group relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 flex items-center space-x-2 active:scale-95"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                <span>
                  {language === 'fr'
                    ? 'Replier le Deck (收回)'
                    : language === 'zh'
                    ? '再次点击收回卡组'
                    : 'Retract Deck'}
                </span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 transition-transform group-hover:scale-110 duration-300" />
                <span>
                  {language === 'fr'
                    ? 'Déployer en Cascade (散开)'
                    : language === 'zh'
                    ? '依次散开并请示名称'
                    : 'Cascade Fan-Out (12)'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Deck Container */}
      <div className="relative z-10 pt-6">
        {!isExpanded ? (
          /* ============================================================
             1. COLLAPSED MODE: 1/3 OVERLAPPING DECK (互相压住三分之一)
             Each card overlaps 1/3 of the previous one (66.6% visible, -33% overlap)
             Followed by the Tail remaining indicator (+8 项待探索)
             ============================================================ */
          <div
            onClick={() => setIsExpanded(true)}
            className="group cursor-pointer select-none py-4 px-2"
            title={language === 'zh' ? '点击依次散开全部12项心智游戏' : 'Click to fan out all 12 mind games'}
          >
            <div className="flex items-center overflow-x-auto pb-4 no-scrollbar pt-2 pl-2">
              {games.slice(0, PREVIEW_COUNT).map((game, idx) => {
                const domainMeta = psychologyDomainsMeta[game.domain];
                const DomainIcon = getDomainIcon(game.domain);
                const isHovered = hoveredIndex === idx;
                const bestScore = progress.gameScores[game.bestScoreKey] || 0;

                // 1/3 overlap mechanism:
                // For idx > 0, apply negative margin-left of -33% or -80px to create exact 1/3 overlap
                return (
                  <div
                    key={game.id}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      zIndex: idx + 1,
                      marginLeft: idx === 0 ? '0px' : '-80px',
                      transform: isHovered
                        ? 'translateY(-14px) scale(1.05) rotate(-1deg)'
                        : `translateY(${idx * 2}px) rotate(${idx * 0.5 - 1}deg)`,
                      transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                    className="relative shrink-0 w-60 sm:w-64 h-80 rounded-2xl bg-gradient-to-b from-[#1a203c] via-[#141933] to-[#0f1326] border-2 border-amber-400/30 hover:border-amber-400 shadow-[0_10px_25px_rgba(0,0,0,0.6)] p-4 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top ambient highlight on card */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

                    {/* Card Top: Number, Domain badge */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-[11px] border border-amber-400/30">
                        #{game.number < 10 ? `0${game.number}` : game.number}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1"
                        style={{
                          backgroundColor: `${domainMeta.accentColor}25`,
                          color: domainMeta.accentColor,
                        }}
                      >
                        <DomainIcon className="w-3 h-3" />
                        <span>{domainMeta.name[language]}</span>
                      </span>
                    </div>

                    {/* Logo Image in Card Center */}
                    <div className="my-auto flex flex-col items-center text-center space-y-2">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.45)] transition-all bg-black/40">
                        {game.logoUrl ? (
                          <img
                            src={game.logoUrl}
                            alt={game.title[language]}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400">
                            <DomainIcon className="w-10 h-10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Title prominently announced */}
                      <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-white tracking-wide leading-tight group-hover:text-amber-300 transition-colors line-clamp-1">
                        {game.title[language]}
                      </h3>
                      <p className="text-[10px] text-stone-300 line-clamp-1 px-1">
                        {game.subtitle[language]}
                      </p>
                    </div>

                    {/* Card Bottom: Score / Action cue */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                      {bestScore > 0 ? (
                        <span className="text-emerald-400 font-bold flex items-center space-x-1">
                          <Award className="w-3 h-3" />
                          <span>{bestScore} pts</span>
                        </span>
                      ) : (
                        <span className="text-stone-300 text-[10px]">
                          {language === 'fr' ? 'Non joué' : language === 'zh' ? '待挑战' : 'Unplayed'}
                        </span>
                      )}
                      <span className="text-amber-400/90 text-[10px] font-semibold flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>{language === 'zh' ? '点击散开' : 'Expand'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* ============================================================
                 TAIL REMAINING COUNT BADGE / CARD (未尾显示剩余数量)
                 ============================================================ */}
              <div
                style={{
                  zIndex: PREVIEW_COUNT + 2,
                  marginLeft: '-60px',
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="relative shrink-0 w-52 sm:w-60 h-80 rounded-2xl bg-gradient-to-br from-amber-500/20 via-[#181d38] to-[#12162a] border-2 border-dashed border-amber-400/60 hover:border-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.25)] hover:shadow-[0_10px_35px_rgba(245,158,11,0.4)] p-5 flex flex-col items-center justify-center text-center space-y-4 hover:scale-105 group/tail"
              >
                {/* Glowing Tail Badge with Remaining Count */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 font-black text-3xl font-mono flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.6)] group-hover/tail:scale-110 transition-transform">
                    +{remainingCount}
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-stone-900 border border-amber-400 text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-amber-300 font-serif-luxury">
                    {language === 'fr'
                      ? `+${remainingCount} Jeux en réserve`
                      : language === 'zh'
                      ? `剩余 ${remainingCount} 款心智博弈`
                      : `+${remainingCount} More Games`}
                  </h4>
                  <p className="text-[11px] text-stone-300 max-w-[180px]">
                    {language === 'fr'
                      ? 'Cliquez pour déployer l’ensemble des 12 jeux en cascade'
                      : language === 'zh'
                      ? '点击后依次散开并请示全部名称'
                      : 'Click to fan out all 12 mind training cards in sequence'}
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center space-x-1.5 group-hover/tail:bg-amber-400 group-hover/tail:text-stone-950 transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{language === 'zh' ? '依次散开卡组' : 'Fan Out All'}</span>
                </div>
              </div>
            </div>

            {/* Hint below the collapsed deck */}
            <div className="mt-2 text-center text-xs text-stone-300 flex items-center justify-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              <span>
                {language === 'fr'
                  ? 'Format de prévisualisation 1/3 superposé · Cliquez pour étendre les 12 cartes'
                  : language === 'zh'
                  ? '当前处于 1/3 重叠卡组形态（尾部显示剩余 8 款）· 点击任意处或按钮依次散开并请示名称'
                  : 'Current state: 1/3 Overlapping stack (tail shows +8) · Click to sequentially fan out all 12 cards'}
              </span>
            </div>
          </div>
        ) : (
          /* ============================================================
             2. EXPANDED MODE: SEQUENTIAL FAN-OUT GALLERY (依次散开并请示名称)
             Staggered animation displaying all 12 mind games with luxury logos and names.
             Clicking again or clicking the retract button will collapse back!
             ============================================================ */
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-300">
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">
                  {language === 'fr'
                    ? '12 cartes déployées en cascade · Cliquez à nouveau pour replier en 1/3 superposé'
                    : language === 'zh'
                    ? '已依次散开全部 12 款心智挑战 · 每一款均配备专属豪华3D徽章 · 再次点击即可原路收回'
                    : 'All 12 cards fanned out in sequence with custom 3D emblems · Click again to retract into 1/3 stack'}
                </span>
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-3 py-1 rounded-lg bg-amber-400 text-stone-950 font-bold text-[11px] hover:bg-amber-300 transition-colors flex items-center space-x-1"
              >
                <Minimize2 className="w-3 h-3" />
                <span>{language === 'zh' ? '点击收回' : 'Retract'}</span>
              </button>
            </div>

            {/* 12 Sequentially Fanned-Out Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {games.map((game, idx) => {
                const domainMeta = psychologyDomainsMeta[game.domain];
                const DomainIcon = getDomainIcon(game.domain);
                const bestScore = progress.gameScores[game.bestScoreKey] || 0;

                // Sequential stagger delay for cascading entrance
                const animationDelay = `${idx * 45}ms`;

                return (
                  <div
                    key={game.id}
                    style={{
                      animationDelay,
                      animationFillMode: 'both',
                    }}
                    className="group relative rounded-2xl bg-gradient-to-b from-[#181d38] via-[#12162a] to-[#0c0e1a] border border-amber-400/25 hover:border-amber-400 p-4 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(245,158,11,0.3)] flex flex-col justify-between animate-fadeIn"
                  >
                    {/* Top ambient gold line */}
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent group-hover:h-1 transition-all" />

                    <div className="space-y-3">
                      {/* Header with Game Number & Domain Tag */}
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="w-6 h-6 rounded-md bg-stone-800 text-amber-400 font-bold flex items-center justify-center text-[11px] border border-white/10 group-hover:border-amber-400/50">
                          #{game.number < 10 ? `0${game.number}` : game.number}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1"
                          style={{
                            backgroundColor: `${domainMeta.accentColor}20`,
                            color: domainMeta.accentColor,
                          }}
                        >
                          <DomainIcon className="w-3 h-3" />
                          <span>{domainMeta.name[language]}</span>
                        </span>
                      </div>

                      {/* Generated 3D Logo Image & Title */}
                      <div className="flex items-center space-x-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform bg-black/40">
                          {game.logoUrl ? (
                            <img
                              src={game.logoUrl}
                              alt={game.title[language]}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400">
                              <DomainIcon className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Title Prominently Announced (请示名称) */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif-luxury font-bold text-sm text-white group-hover:text-amber-300 transition-colors leading-tight line-clamp-2">
                            {game.title[language]}
                          </h3>
                          <span className="text-[10px] text-amber-400/90 font-mono block mt-0.5 truncate">
                            {game.scientificOrigin[language]}
                          </span>
                        </div>
                      </div>

                      {/* Subtitle / Core Mechanism */}
                      <p className="text-[11px] text-stone-300 leading-snug line-clamp-2">
                        {game.subtitle[language]}
                      </p>

                      {/* Target Brain Area badge */}
                      <div className="p-2 rounded-xl bg-black/30 border border-white/5 text-[10px] text-stone-300 flex items-center space-x-1.5">
                        <Brain className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="truncate">{game.targetBrainArea[language]}</span>
                      </div>
                    </div>

                    {/* Action Launch Bar */}
                    <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      {bestScore > 0 ? (
                        <div className="flex items-center space-x-1 text-emerald-400 font-bold text-xs font-mono">
                          <Award className="w-3.5 h-3.5" />
                          <span>{bestScore} pts</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-stone-300 font-mono">
                          {language === 'fr' ? 'À relever' : language === 'zh' ? '待挑战' : 'Unplayed'}
                        </span>
                      )}

                      <button
                        onClick={() => onSelectGame(game.id)}
                        className="py-1.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{language === 'zh' ? '挑战' : 'Play'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Retract Callout */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 text-stone-300 hover:text-white text-xs font-semibold transition-all shadow-md active:scale-95"
              >
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'fr'
                    ? 'Replier toutes les cartes dans le deck à 1/3 (收回)'
                    : language === 'zh'
                    ? '收回为 1/3 重叠卡组 (再次点击收回)'
                    : 'Retract back into 1/3 overlapping deck'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
