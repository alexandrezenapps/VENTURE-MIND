import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Brain,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Eye,
  Scale,
  Sparkles,
  Quote,
  Clock,
  Layers,
  Shuffle,
  Dice5,
  Sliders,
  Trophy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  TWENTY_GAME_ENCOUNTERS,
  GameEncounter,
  DecisionOption,
} from '../../data/facingGameRoundsData';
import {
  addLeaderboardRecord,
  getUserPlayerName,
} from '../../utils/leaderboardStorage';
import { LeaderboardModal } from '../common/LeaderboardModal';

const ADVERSARY_IMAGE = '/src/assets/images/game_adversary_partner_1793030978874.jpg';

type SessionLength = 5 | 10 | 20;

// Utility to shuffle an array using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const FacingTheGame: React.FC<{
  onFinish?: (score: number) => void;
  onExit?: () => void;
}> = ({ onFinish, onExit }) => {
  const { language, speak, recordGameScore, formatMoney } = useApp();

  // Session length mode: 5 rounds, 10 rounds, or all 20 rounds
  const [sessionLength, setSessionLength] = useState<SessionLength>(5);

  // Active game session encounter queue (randomly sampled & shuffled from all 20)
  const [activeQueue, setActiveQueue] = useState<GameEncounter[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);

  // Gauges
  const [composure, setComposure] = useState(70);
  const [leverage, setLeverage] = useState(40);
  const [retainedValuation, setRetainedValuation] = useState(12000000);

  // Round states
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showXRay, setShowXRay] = useState(false);
  const [movesHistory, setMovesHistory] = useState<DecisionOption[]>([]);

  // Random seed tracker to give users visual feedback of dynamic deck generation
  const [deckSeed, setDeckSeed] = useState(() => Math.floor(1000 + Math.random() * 9000));

  // Leaderboard state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [highlightRecordId, setHighlightRecordId] = useState<string | null>(null);

  // Initialize and generate randomized encounter queue
  const initializeRandomSession = useCallback((length: SessionLength) => {
    // 1. Shuffle all 20 encounters
    const fullShuffled = shuffleArray(TWENTY_GAME_ENCOUNTERS);
    // 2. Sample the requested number (5, 10, or 20)
    const sampled = fullShuffled.slice(0, length);
    // 3. For each encounter, also shuffle its 3 options so answer positions are unpredictable
    const randomizedEncounters = sampled.map((enc) => ({
      ...enc,
      options: shuffleArray(enc.options),
    }));

    setActiveQueue(randomizedEncounters);
    setCurrentRoundIdx(0);
    setComposure(70);
    setLeverage(40);
    setRetainedValuation(12000000);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setIsGameOver(false);
    setShowXRay(false);
    setMovesHistory([]);
    setDeckSeed(Math.floor(1000 + Math.random() * 9000));
  }, []);

  // Run initial session creation on mount
  useEffect(() => {
    initializeRandomSession(sessionLength);
  }, [initializeRandomSession, sessionLength]);

  const currentEncounter = activeQueue[currentRoundIdx];

  const handleSelectOption = (optId: string) => {
    if (!hasSubmitted) {
      setSelectedOptionId(optId);
    }
  };

  const handleSubmitDecision = () => {
    if (!selectedOptionId || !currentEncounter) return;
    const opt = currentEncounter.options.find((o) => o.id === selectedOptionId);
    if (!opt) return;

    setHasSubmitted(true);
    setMovesHistory((prev) => [...prev, opt]);

    // Update gauges dynamically
    setComposure((prev) => Math.min(100, Math.max(0, prev + opt.impact.composure)));
    setLeverage((prev) => Math.min(100, Math.max(0, prev + opt.impact.leverage)));
    setRetainedValuation((prev) => Math.max(3000000, prev + opt.impact.valuationDiff));
  };

  const handleNextRound = () => {
    if (currentRoundIdx < activeQueue.length - 1) {
      setCurrentRoundIdx((r) => r + 1);
      setSelectedOptionId(null);
      setHasSubmitted(false);
      setShowXRay(false);
    } else {
      // Calculate final score out of 100
      const masteryCount = movesHistory.filter((m) => m.type === 'mastery').length;
      const masteryRatio = masteryCount / activeQueue.length;
      const finalScore = Math.min(
        100,
        Math.round(composure * 0.35 + leverage * 0.35 + masteryRatio * 30)
      );

      // Save high score to Leaderboard
      const sessionModeKey =
        sessionLength === 5 ? '5_rounds' : sessionLength === 10 ? '10_rounds' : '20_rounds';
      const createdRecord = addLeaderboardRecord({
        gameId: 'game_01',
        sessionMode: sessionModeKey,
        playerName: getUserPlayerName(),
        playerTitle: {
          en: 'Principal Architect',
          fr: 'Architecte Principal',
          zh: '风投主理人',
        },
        score: finalScore,
        composure,
        leverage,
        valuationSaved: retainedValuation,
        roundsCompleted: activeQueue.length,
        totalRounds: activeQueue.length,
        isUser: true,
        tier:
          finalScore >= 95
            ? 'sovereign'
            : finalScore >= 85
            ? 'alpha'
            : finalScore >= 75
            ? 'principal'
            : 'associate',
      });

      setHighlightRecordId(createdRecord.id);
      setIsGameOver(true);
      recordGameScore('game_01', finalScore);
      if (onFinish) onFinish(finalScore);
    }
  };

  const handleReshuffleAndRestart = () => {
    initializeRandomSession(sessionLength);
  };

  const playAdversaryVoice = () => {
    if (currentEncounter) {
      speak(currentEncounter.adversaryDialogue[language]);
    }
  };

  const t = {
    title: {
      en: 'Facing the Game · Composure & Tactical Leverage',
      fr: 'Face au Duel · Sérénité & Maîtrise Stratégique',
      zh: '面对博弈 · 定力与破局',
    },
    subtitle: {
      en: '20 Masterclass Deal Encounters. Every session dynamically draws a unique, unpredictable sequence of high-stakes traps.',
      fr: '20 Épreuves Magistrales. Chaque partie génère une séquence aléatoire et imprévisible de pièges de haute finance.',
      zh: '全景20重资本博弈实战死局。每次启动均采用随机抽牌机制，体验千变万化的极限试炼。',
    },
    modes: {
      quick5: { en: '5-Round Quick Duel', fr: 'Épreuve Rapide 5 Manches', zh: '5 回合速测' },
      deep10: { en: '10-Round Masterclass', fr: 'Masterclass 10 Manches', zh: '10 回合深测' },
      grand20: { en: '20-Round Grand Slam', fr: 'Grand Chelem 20 Manches', zh: '20 回合全景试炼' },
    },
    composureLabel: {
      en: 'Composure',
      fr: 'Sérénité Mentale',
      zh: '心智定力指数',
    },
    leverageLabel: {
      en: 'Leverage',
      fr: 'Maîtrise du Deal',
      zh: '谈判掌控力',
    },
    valuationLabel: {
      en: 'Founder Retained Value',
      fr: 'Valeur Fondateur Préservée',
      zh: '守住权益估值',
    },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto rounded-3xl bg-surface-main dark:bg-[#0D101D] border border-amber-400/35 p-5 sm:p-7 md:p-8 shadow-2xl text-text-primary dark:text-stone-100">
      {/* Game Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-main dark:border-stone-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Game #1 · {language === 'fr' ? 'Épreuve Reine' : language === 'zh' ? '风投首战 · 面对博弈' : 'Flagship Duel'}</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-400 font-normal">20 {language === 'fr' ? 'épreuves' : language === 'zh' ? '重实战牌池' : 'Encounters'}</span>
          </div>
          <h1 className="fluid-heading-2 font-serif-luxury font-bold text-text-primary dark:text-stone-100 mt-1">
            {t.title[language]}
          </h1>
          <p className="text-xs text-text-secondary dark:text-stone-400 max-w-xl mt-0.5 leading-relaxed">
            {t.subtitle[language]}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 border border-amber-400/40 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Open Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'fr' ? 'Classement' : language === 'zh' ? '巅峰天梯榜' : 'Leaderboard'}</span>
          </button>
          <button
            onClick={handleReshuffleAndRestart}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-400/30 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Reshuffle deck and restart"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Rebrasser' : language === 'zh' ? '随机洗牌' : 'Reshuffle'}</span>
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1.5 rounded-xl bg-surface-muted dark:bg-stone-800 text-xs font-mono text-text-secondary dark:text-stone-300 hover:text-text-primary cursor-pointer"
            >
              {language === 'fr' ? 'Quitter' : language === 'zh' ? '退出' : 'Exit'}
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector & Seed Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-surface-muted/80 dark:bg-stone-900/80 rounded-2xl border border-border-main/70 dark:border-stone-800">
          <button
            onClick={() => setSessionLength(5)}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              sessionLength === 5
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            {t.modes.quick5[language]}
          </button>
          <button
            onClick={() => setSessionLength(10)}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              sessionLength === 10
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            {t.modes.deep10[language]}
          </button>
          <button
            onClick={() => setSessionLength(20)}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              sessionLength === 20
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            {t.modes.grand20[language]}
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
          <Dice5 className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {language === 'fr' ? 'Tirage Aléatoire #' : language === 'zh' ? '牌局随机码 #' : 'Random Deck Seed #'}
            <strong className="text-amber-400">{deckSeed}</strong>
          </span>
          <span>·</span>
          <span>
            {language === 'fr' ? 'Ordre Imprévisible' : language === 'zh' ? '无序盲测' : 'Blind Order'}
          </span>
        </div>
      </div>

      {/* Real-time Dynamic Gauge HUD (Composure & Leverage & Retained Equity) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-surface-muted/60 dark:bg-stone-900/60 border border-border-main dark:border-stone-800">
        {/* Gauge 1: Composure */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              {t.composureLabel[language]}
            </span>
            <span className={`font-bold tabular-nums ${composure > 60 ? 'text-purple-400' : 'text-rose-400'}`}>
              {composure}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div
              style={{ width: `${composure}%` }}
              className={`h-full transition-all duration-500 ${
                composure > 60 ? 'bg-gradient-to-r from-purple-600 to-amber-500' : 'bg-rose-500'
              }`}
            />
          </div>
        </div>

        {/* Gauge 2: Leverage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              {t.leverageLabel[language]}
            </span>
            <span className="font-bold text-cyan-400 tabular-nums">{leverage}%</span>
          </div>
          <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div
              style={{ width: `${leverage}%` }}
              className="h-full bg-gradient-to-r from-cyan-600 to-teal-400 transition-all duration-500"
            />
          </div>
        </div>

        {/* Gauge 3: Value Protection */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              {t.valuationLabel[language]}
            </span>
            <span className="font-bold text-emerald-400 tabular-nums">
              {formatMoney(retainedValuation)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (retainedValuation / 20000000) * 100)}%` }}
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-300 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {!isGameOver && currentEncounter ? (
        <div className="space-y-6">
          {/* Round Indicator with Progress Dots */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-text-secondary dark:text-stone-400 gap-2">
            <div className="flex items-center space-x-2">
              <span>
                {language === 'fr' ? 'Épreuve' : language === 'zh' ? '博弈回合' : 'Round'}{' '}
                <strong className="text-amber-500 text-sm">{currentRoundIdx + 1}</strong> / {activeQueue.length}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold truncate">
                {currentEncounter.phaseTitle[language]}
              </span>
            </div>

            {/* Mini Progress Tracker */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {activeQueue.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentRoundIdx
                      ? 'w-6 bg-amber-400'
                      : idx < currentRoundIdx
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-stone-300 dark:bg-stone-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Adversary Arena Stage */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#12162B]/95 via-[#161B35]/95 to-[#1E1732]/98 border border-amber-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col md:flex-row items-center gap-6">
            {/* Imposing Partner Portrait */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400/40 shadow-xl group">
              <img
                src={ADVERSARY_IMAGE}
                alt="Venture Capital Lead Partner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <span className="absolute bottom-2 left-2.5 text-xs font-mono text-amber-200 font-bold tracking-tight">
                Alexander Vance
              </span>
            </div>

            {/* Adversary Dialogue Bubble */}
            <div className="space-y-4 flex-1 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-stone-200 font-semibold">
                  {language === 'fr' ? 'Posture de l’Investisseur' : language === 'zh' ? '对手施压招数' : 'Adversary Move'} :{' '}
                  <strong className="text-amber-300 font-bold ml-1">{currentEncounter.adversaryTactic[language]}</strong>
                </span>
                <button
                  onClick={playAdversaryVoice}
                  className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition-colors cursor-pointer"
                  title="Listen to dialogue"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <blockquote className="text-base sm:text-lg md:text-xl font-serif-luxury font-medium leading-relaxed text-amber-50 bg-[#080B18]/85 p-5 sm:p-6 rounded-2xl border border-amber-400/30 shadow-inner">
                "{currentEncounter.adversaryDialogue[language]}"
              </blockquote>

              {/* Psychological X-Ray Button (潜台词探测) */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={() => setShowXRay((prev) => !prev)}
                  className="text-xs sm:text-sm font-mono font-semibold text-amber-300 hover:text-amber-200 underline flex items-center space-x-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>
                    {showXRay
                      ? language === 'fr'
                        ? 'Masquer le rayon X psychologique'
                        : language === 'zh'
                        ? '收起潜台词洞察'
                        : 'Hide Psychological X-Ray'
                      : language === 'fr'
                        ? 'Activer le Rayon-X Psychologique (Lire dans son jeu)'
                        : language === 'zh'
                        ? '开启「潜台词探测」· 洞悉对手恐惧与底层动机'
                        : 'Activate Psychological X-Ray (Read Intent)'}
                  </span>
                </button>
              </div>

              {showXRay && (
                <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-400/40 text-sm sm:text-base font-medium text-purple-100 leading-relaxed shadow-lg animate-fadeIn">
                  {currentEncounter.hiddenPsychology[language]}
                </div>
              )}
            </div>
          </div>

          {/* Player Strategic Choices (Shuffled Unpredictably) */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-mono uppercase tracking-wider text-stone-200 font-bold flex items-center justify-between">
              <span>
                {language === 'fr'
                  ? 'Choisissez votre posture de négociation :'
                  : language === 'zh'
                  ? '面对博弈，亮出你的破局手牌：'
                  : 'Select your strategic stance:'}
              </span>
              <span className="text-xs text-amber-300/80 font-normal">
                {language === 'fr' ? 'Ordre des options aléatoire' : language === 'zh' ? '选项位置随机混编' : 'Randomized order'}
              </span>
            </h3>

            {currentEncounter.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-b from-amber-500/25 via-[#1D1728]/95 to-[#120E1C] shadow-[0_12px_36px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/60'
                      : 'border-white/15 dark:border-white/10 hover:border-amber-400/60 bg-gradient-to-b from-[#161A2E]/90 via-[#0F1325]/95 to-[#090C1A]/98 hover:shadow-[0_8px_24px_rgba(217,119,6,0.18)]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 font-bold text-xs ${
                        isSelected
                          ? 'border-amber-400 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md'
                          : 'border-stone-400 text-transparent'
                      }`}
                    >
                      ✓
                    </div>

                    <div className="space-y-3 flex-1">
                      <p className="text-base sm:text-lg md:text-xl font-serif-luxury font-semibold leading-relaxed text-white">
                        {opt.label[language]}
                      </p>

                      {/* Submitted Feedback Box */}
                      {hasSubmitted && isSelected && (
                        <div className="mt-4 pt-4 border-t border-white/15 space-y-3 animate-fadeIn">
                          <div
                            className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed font-medium shadow-md ${
                              opt.type === 'mastery'
                                ? 'bg-emerald-950/60 text-emerald-100 border border-emerald-400/50'
                                : opt.type === 'confrontation'
                                ? 'bg-rose-950/60 text-rose-100 border border-rose-400/50'
                                : 'bg-amber-950/60 text-amber-100 border border-amber-400/50'
                            }`}
                          >
                            <span className="font-bold text-base block mb-1.5 font-serif-luxury">
                              {opt.type === 'mastery'
                                ? language === 'fr'
                                  ? '🌟 Coup de Maître (Sérénité & Clarté)'
                                  : language === 'zh'
                                  ? '🌟 破局之道 · 气度非凡'
                                  : '🌟 Mastery Move (High Composure)'
                                : opt.type === 'confrontation'
                                ? language === 'fr'
                                  ? '⚠️ Faillite Émotionnelle (Égo Infligé)'
                                  : language === 'zh'
                                  ? '⚠️ 情绪化对抗 · 输了牌品'
                                  : '⚠️ Emotional Friction (Lost Composure)'
                                : language === 'fr'
                                ? '⚠️ Capitulation Passive (Perte de Valeur)'
                                : language === 'zh'
                                ? '⚠️ 被动妥协 · 筹码流失'
                                : '⚠️ Passive Concession'}
                            </span>
                            {opt.feedback[language]}
                          </div>

                          <div className="p-4 rounded-2xl bg-[#090C18]/90 border border-amber-400/30 text-xs sm:text-sm font-mono text-stone-200">
                            <span className="font-bold text-amber-300 block mb-1">
                              {language === 'fr' ? 'Loi de Maîtrise :' : language === 'zh' ? '博弈心法复盘：' : 'Mindful Deal Law:'}
                            </span>
                            {opt.mindfulRule[language]}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-text-secondary dark:text-stone-400 font-mono">
              {language === 'fr'
                ? 'Apprenez à négocier avec dignité et méthode'
                : language === 'zh'
                ? '边玩边学 · 真正的高手在静默中掌控博弈'
                : 'Learn by playing · Masters win through composure'}
            </span>

            {!hasSubmitted ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleSubmitDecision}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
              >
                {language === 'fr' ? 'Valider ma posture' : language === 'zh' ? '决断落子' : 'Execute Move'}
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer"
              >
                <span>
                  {currentRoundIdx < activeQueue.length - 1
                    ? language === 'fr'
                      ? 'Manche suivante'
                      : language === 'zh'
                      ? '迎战下一回合'
                      : 'Next Encounter'
                    : language === 'fr'
                    ? 'Consulter le Débriefing Final'
                    : language === 'zh'
                    ? '查看终局总评与定力勋章'
                    : 'Final Strategic Debrief'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : isGameOver ? (
        /* GAME OVER / COMPREHENSIVE STRATEGIC DEBRIEF */
        <div className="space-y-6 text-center py-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-purple-600 to-emerald-500 p-0.5 mx-auto shadow-2xl">
            <div className="w-full h-full rounded-3xl bg-[#0D101D] flex items-center justify-center text-amber-400">
              <Award className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              {language === 'fr' ? 'Épreuve Terminée' : language === 'zh' ? '面对博弈 · 试炼通关' : 'Duel Completed'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {composure >= 70 && leverage >= 60
                ? language === 'fr'
                  ? 'Souveraineté Stratégique Absolue'
                  : language === 'zh'
                  ? '泰山崩于前而色不变 · 破局之师'
                  : 'Sovereign Composure Master'
                : language === 'fr'
                ? 'Apprenti Négociateur Émérite'
                : language === 'zh'
                ? '临场渐入佳境 · 定力日进'
                : 'Developing Deal Negotiator'}
            </h2>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? `Vous avez traversé les ${activeQueue.length} épreuves sans céder à la panique ni brader vos droits.`
                : language === 'zh'
                ? `你在本次随机牌局中历经了全部 ${activeQueue.length} 重博弈死局，面对一线合伙人步步紧逼，用定力赢得全场敬重，守住了核心控股权！`
                : `You navigated all ${activeQueue.length} tactical traps, balancing emotional equanimity and cap table defense.`}
            </p>
          </div>

          {/* Final Metrics Recap */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto p-5 rounded-2xl bg-surface-muted/60 dark:bg-stone-900/60 border border-border-main dark:border-stone-800 text-left">
            <div>
              <span className="text-[10px] uppercase font-mono text-stone-400 block">
                {t.composureLabel[language]}
              </span>
              <span className="text-xl font-bold font-mono text-purple-400">{composure}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-stone-400 block">
                {t.leverageLabel[language]}
              </span>
              <span className="text-xl font-bold font-mono text-cyan-400">{leverage}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-stone-400 block">
                {t.valuationLabel[language]}
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {formatMoney(retainedValuation)}
              </span>
            </div>
          </div>

          {/* Golden Takeaway of the Game */}
          <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 text-left space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 font-bold uppercase">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'fr' ? 'Leçon d’Or de la Négociation' : language === 'zh' ? '面对博弈 · 核心灵魂精粹' : 'Golden Rule of Strategic Duel'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-serif-luxury italic">
              {language === 'fr'
                ? '« La véritable victoire en négociation ne consiste pas à humilier l’autre, mais à instaurer un calme si absolu que la seule issue rationnelle pour lui soit de s’aligner sur vos termes. »'
                : language === 'zh'
                ? '“博弈的至高境界，绝不是剑拔弩张与击垮对手；而是以深不可测的定力与对人性的洞悉，在风暴中主导节奏，让对手在不知不觉中心悦诚服地接受你开出的公道底线。”'
                : '"True victory in negotiation is not destroying the other side, but embodying such unwavering composure that the only rational conclusion for them is to align with your clean terms."'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer flex items-center space-x-1.5 active:scale-95"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'fr' ? 'Consulter le Classement & Rangs' : language === 'zh' ? '查看本次在巅峰榜的排名' : 'View Global Leaderboard Rank'}</span>
            </button>
            <button
              onClick={handleReshuffleAndRestart}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Nouvelle Manche Aléatoire' : language === 'zh' ? '开启全新随机博弈局' : 'Play Fresh Random Session'}</span>
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="px-6 py-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition-all cursor-pointer"
              >
                {language === 'fr' ? 'Retour aux Défis' : language === 'zh' ? '返回竞技场' : 'Return to Arena'}
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        highlightRecordId={highlightRecordId}
        defaultMode={
          sessionLength === 5
            ? '5_rounds'
            : sessionLength === 10
            ? '10_rounds'
            : '20_rounds'
        }
      />
    </div>
  );
};
