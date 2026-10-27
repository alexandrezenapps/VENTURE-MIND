import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Zap,
  Clock,
  Flame,
  Award,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Trophy,
  Brain,
  ShieldCheck,
  Percent,
  Sparkles,
  Layers,
  Target,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  SpeedValuationTier,
  generateDynamicValuationSession,
  ValuationQuestion,
} from '../../data/speedValuationData';
import speedValuationIcon from '../../assets/images/speed_valuation_icon_1793106944524.jpg';
import {
  addLeaderboardRecord,
  getUserPlayerName,
} from '../../utils/leaderboardStorage';
import { LeaderboardModal } from '../common/LeaderboardModal';

// Fisher-Yates array shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const SpeedValuationGame: React.FC<{
  onFinish?: (score: number) => void;
  onExit?: () => void;
}> = ({ onFinish, onExit }) => {
  const { language, speak, recordGameScore, formatMoney } = useApp();

  // Tier selection: 初级 (5题), 中级 (25题), 高级 (50题)
  const [selectedTier, setSelectedTier] = useState<SpeedValuationTier>('junior');

  // Active procedural question queue
  const [questionQueue, setQuestionQueue] = useState<ValuationQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Round game state
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(15);
  const [maxTime, setMaxTime] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const roundStartTimeRef = useRef<number>(Date.now());

  // Scoring & Performance metrics
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [fastAnswerCount, setFastAnswerCount] = useState(0); // <3.5s rapid responses
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Audio feedback setting
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(true);

  // Initialize and generate procedural non-repeating question queue
  const initGameSession = useCallback((tier: SpeedValuationTier) => {
    // Generate fresh non-repeating procedural questions based on tier
    const generatedQuestions = generateDynamicValuationSession(tier);
    // Shuffle options inside each question to prevent position memorization
    const finalized = generatedQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    setQuestionQueue(finalized);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setFastAnswerCount(0);
    setResponseTimes([]);
    setSelectedOptionIndex(null);
    setHasAnswered(false);
    setIsTimedOut(false);
    setIsGameOver(false);
    setHasStarted(true);

    if (finalized.length > 0) {
      const firstQ = finalized[0];
      setTimeLeft(firstQ.timeLimitSeconds);
      setMaxTime(firstQ.timeLimitSeconds);
      roundStartTimeRef.current = Date.now();
    }
  }, []);

  const currentQ = questionQueue[currentIndex];

  // Handle timeout (hesitation penalty)
  const handleTimeout = useCallback(() => {
    setIsTimedOut(true);
    setHasAnswered(true);
    setStreak(0);
    setResponseTimes((prev) => [...prev, maxTime]);

    if (audioFeedbackEnabled) {
      setTimeout(() => {
        speak(
          language === 'fr'
            ? 'Temps écoulé ! En négociation, l’hésitation coûte cher.'
            : language === 'zh'
            ? '时间耗尽！在创投博弈中，犹豫意味着丧失定价权。'
            : 'Time out! Hesitation costs leverage in dealmaking.'
        );
      }, 0);
    }
  }, [audioFeedbackEnabled, language, maxTime, speak]);

  // Timer interval handling
  useEffect(() => {
    if (!hasStarted || hasAnswered || isGameOver || !currentQ) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, hasAnswered, isGameOver, currentQ, currentIndex]);

  // Handle timeout safely when timeLeft reaches 0
  useEffect(() => {
    if (hasStarted && !hasAnswered && !isGameOver && timeLeft === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      handleTimeout();
    }
  }, [timeLeft, hasStarted, hasAnswered, isGameOver, handleTimeout]);

  // Play haptic audio tone
  const playTone = (isCorrect: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isCorrect) {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  // Handle Option Selection
  const handleSelectOption = (idx: number) => {
    if (hasAnswered || isGameOver || !currentQ) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const elapsedSeconds = Math.max(0.5, (Date.now() - roundStartTimeRef.current) / 1000);
    setResponseTimes((prev) => [...prev, elapsedSeconds]);

    setSelectedOptionIndex(idx);
    setHasAnswered(true);

    const opt = currentQ.options[idx];
    const isFast = elapsedSeconds <= 3.5;

    if (opt.isCorrect) {
      playTone(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setCorrectCount((prev) => prev + 1);

      // Score computation: base 100 pts + streak bonus + speed bonus
      const streakMultiplier = 1 + (newStreak - 1) * 0.25; // 1x, 1.25x, 1.5x...
      const speedBonus = isFast ? 40 : Math.max(0, Math.round((maxTime - elapsedSeconds) * 2));
      const tierBonus = selectedTier === 'senior' ? 30 : selectedTier === 'mid' ? 15 : 0;
      const pointsEarned = Math.round(100 * streakMultiplier + speedBonus + tierBonus);
      setScore((prev) => prev + pointsEarned);

      if (isFast) {
        setFastAnswerCount((prev) => prev + 1);
      }

      if (audioFeedbackEnabled) {
        setTimeout(() => {
          speak(
            language === 'fr'
              ? 'Formule exacte. Réflexe de valorisation instantané.'
              : language === 'zh'
              ? '精准绝杀！秒级心算，守住估值底线。'
              : 'Spot on! Instant mental valuation reflex.'
          );
        }, 0);
      }
    } else {
      playTone(false);
      setStreak(0);

      if (audioFeedbackEnabled) {
        setTimeout(() => {
          speak(
            language === 'fr'
              ? 'Piège classique de dilution détecté.'
              : language === 'zh'
              ? '落入经典稀释陷阱，切记分母为投后。'
              : 'Fell into dilution trap. Denominator is post-money.'
          );
        }, 0);
      }
    }
  };

  // Advance to next question or conclude game
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questionQueue.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextQ = questionQueue[nextIdx];
      setSelectedOptionIndex(null);
      setHasAnswered(false);
      setIsTimedOut(false);
      setTimeLeft(nextQ.timeLimitSeconds);
      setMaxTime(nextQ.timeLimitSeconds);
      roundStartTimeRef.current = Date.now();
    } else {
      finishGame();
    }
  };

  // Finish Game & Record Score
  const finishGame = () => {
    setIsGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Normalize final score for App progress (0 - 100 scaled)
    const accuracy = questionQueue.length > 0 ? correctCount / questionQueue.length : 0;
    const finalNormalizedScore = Math.min(100, Math.round(accuracy * 100));

    // Save to Leaderboard with modeKey
    const modeKey =
      selectedTier === 'junior'
        ? '5_rounds'
        : selectedTier === 'mid'
        ? '25_rounds'
        : '50_rounds';

    const playerName = getUserPlayerName();
    const valuePerQuestion = selectedTier === 'senior' ? 3000000 : selectedTier === 'mid' ? 2500000 : 2000000;

    addLeaderboardRecord({
      gameId: 'game_02',
      sessionMode: modeKey,
      playerName: playerName || 'Mental Quant Founder',
      playerTitle: {
        en:
          accuracy >= 0.9
            ? 'Grandmaster Quant Titan'
            : accuracy >= 0.7
            ? 'Valuation Architect'
            : 'Dilution Defense Apprentice',
        fr:
          accuracy >= 0.9
            ? 'Maître Suprême de la Valorisation'
            : accuracy >= 0.7
            ? 'Architecte de Valorisation'
            : 'Apprenti Négociateur',
        zh:
          accuracy >= 0.9
            ? '董事会顶级量化神算'
            : accuracy >= 0.7
            ? '资深估值博弈架构师'
            : '创投心算新锐学徒',
      },
      score: score,
      composure: Math.min(100, Math.round(accuracy * 100)),
      leverage: Math.min(100, Math.round((fastAnswerCount / Math.max(1, questionQueue.length)) * 100 + 40)),
      valuationSaved: correctCount * valuePerQuestion,
      roundsCompleted: questionQueue.length,
      totalRounds: questionQueue.length,
      isUser: true,
      tier: accuracy >= 0.9 ? 'sovereign' : accuracy >= 0.7 ? 'alpha' : 'principal',
    });

    // Safely update App progress and notify caller outside the active render turn
    setTimeout(() => {
      recordGameScore('game_02', finalNormalizedScore);
      if (onFinish) onFinish(finalNormalizedScore);
    }, 0);
  };

  // Compute stats
  const averageResponseTime = useMemo(() => {
    if (responseTimes.length === 0) return '0.0';
    const sum = responseTimes.reduce((acc, t) => acc + t, 0);
    return (sum / responseTimes.length).toFixed(1);
  }, [responseTimes]);

  const accuracyPercent = useMemo(() => {
    if (questionQueue.length === 0) return 0;
    return Math.round((correctCount / questionQueue.length) * 100);
  }, [correctCount, questionQueue.length]);

  return (
    <div className="relative rounded-3xl bg-surface-main dark:bg-[#0b0f1a] border border-border-main dark:border-stone-800 shadow-2xl overflow-hidden text-text-primary dark:text-stone-100 p-5 sm:p-8 space-y-6">
      {/* Background ambient luxury styling */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-main dark:border-stone-800/80 pb-5">
        <div className="flex items-center space-x-3.5">
          <img
            src={speedValuationIcon}
            alt="Speed Valuation Game Emblem"
            className="w-12 h-12 rounded-xl object-cover border border-emerald-400/50 shadow-md shrink-0"
          />
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-emerald-600 dark:text-emerald-400 font-bold uppercase">
              <Zap className="w-3.5 h-3.5 text-emerald-500 fill-current" />
              <span>Game #2 · {language === 'fr' ? 'Valorisation Éclair' : language === 'zh' ? '极速估值心算' : 'Speed Valuation'}</span>
              <span className="text-stone-400 dark:text-stone-600">·</span>
              <span className="text-amber-500 font-normal">
                {language === 'fr' ? 'Armure Cognitive' : language === 'zh' ? '谈判桌认知防线' : 'Boardroom Armor'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-text-primary dark:text-white">
              {language === 'fr'
                ? 'Calcul Mental Éclair : L’Art de Verrouiller la Valeur'
                : language === 'zh'
                ? '极速估值心算 · 秒级破局'
                : 'Speed Valuation: The 3-Second Mental Edge'}
            </h2>
          </div>
        </div>

        {/* Global Controls & Exit */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          <button
            onClick={() => setAudioFeedbackEnabled(!audioFeedbackEnabled)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              audioFeedbackEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-surface-muted dark:bg-stone-800 border-border-main dark:border-stone-700 text-stone-400'
            }`}
            title="Audio commentary"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 hover:bg-amber-500/25 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Classement' : language === 'zh' ? '巅峰榜' : 'High Scores'}</span>
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="px-3.5 py-2 rounded-xl bg-surface-muted dark:bg-stone-800/80 hover:bg-surface-elevated text-text-secondary text-xs font-mono transition-colors cursor-pointer"
            >
              {language === 'fr' ? 'Fermer' : language === 'zh' ? '退出' : 'Exit'}
            </button>
          )}
        </div>
      </div>

      {/* VIEW A: PRE-START INTRO / DIFFICULTY TIER SELECTOR */}
      {!hasStarted && (
        <div className="max-w-3xl mx-auto py-4 sm:py-6 space-y-7 text-center">
          {/* Hero Branding with Generated Game Emblem */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-emerald-500 via-amber-400 to-teal-400 shadow-[0_12px_36px_rgba(16,185,129,0.35)]">
            <img
              src={speedValuationIcon}
              alt="Speed Valuation Game Icon"
              className="w-full h-full object-cover rounded-[22px] border border-white/20"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-400/80 text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
              Game #2 Flagship
            </div>
          </div>

          {/* Theme & Core Meaning Manifesto */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-text-primary dark:text-white">
              {language === 'fr'
                ? 'Choisissez votre Niveau d’Épreuve Mentale'
                : language === 'zh'
                ? '选择你的估值心算实战等级'
                : 'Select Your Boardroom Mental Tier'}
            </h3>
            <div className="p-3.5 max-w-xl mx-auto rounded-2xl bg-surface-muted dark:bg-[#121629] border border-amber-400/20 text-xs text-text-secondary dark:text-stone-300 leading-relaxed text-left space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-amber-500 text-[11px] uppercase font-mono">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>
                  {language === 'fr'
                    ? 'Le Principe Fondamental'
                    : language === 'zh'
                    ? '创投心算法则 · 创始人的认知铠甲'
                    : 'The Core Founder Doctrine'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {language === 'fr'
                  ? 'En négociation, attraper une calculatrice trahit l’insécurité et fait chuter votre levier. Un calcul mental en 3 secondes signale une maîtrise souveraine de la table.'
                  : language === 'zh'
                  ? '估值心算不是冷冰冰的数字算术，而是创始人在谈判桌上的认知防线。低头拿计算器是怯场的信号；3秒心算绝杀，才能在董事会博弈中牢牢锁死主动权与股权底线！'
                  : 'Grabbing a calculator in the boardroom projects insecurity and surrenders leverage. Executing instant 3-second mental math locks post-money and commands peer respect.'}
              </p>
            </div>
          </div>

          {/* 3 Difficulty Tiers: 初级(5题) · 中级(25题) · 高级(50题) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* 1. 初级 Junior (5 Questions) */}
            <div
              onClick={() => setSelectedTier('junior')}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                selectedTier === 'junior'
                  ? 'bg-cyan-500/10 border-cyan-500/80 shadow-[0_8px_24px_rgba(6,182,212,0.18)] ring-1 ring-cyan-500 text-cyan-950 dark:text-cyan-100'
                  : 'bg-surface-muted dark:bg-[#101424] border-border-main dark:border-stone-800 hover:border-cyan-500/40 text-text-secondary'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-500 flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{language === 'fr' ? 'Niveau Débutant' : language === 'zh' ? '初级 · 闪电破局' : 'Junior Sprint'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                    5 题
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary dark:text-white">
                  {language === 'fr' ? '5 Épreuves · 15s/tour' : language === 'zh' ? '5道精选题 · 15秒限时' : '5 Rounds · 15s Limit'}
                </h4>
                <p className="text-[11px] text-text-secondary dark:text-stone-300 leading-relaxed">
                  {language === 'fr'
                    ? 'Addition Pré/Post, règle du 20% inversé et dilution de base.'
                    : language === 'zh'
                    ? '专注投后估值加法原理、20%黄金倒数与基础出资稀释。'
                    : 'Master Post-money addition, 20% golden inversion, and seed dilution.'}
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                {language === 'fr' ? 'Échauffement rapide (~1.5 min)' : language === 'zh' ? '高频速战 · 建立敏感度 (~1.5分钟)' : 'Rapid warm-up (~1.5 min)'}
              </div>
            </div>

            {/* 2. 中级 Mid (25 Questions) */}
            <div
              onClick={() => setSelectedTier('mid')}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                selectedTier === 'mid'
                  ? 'bg-emerald-500/10 border-emerald-500/80 shadow-[0_8px_24px_rgba(16,185,129,0.18)] ring-1 ring-emerald-500 text-emerald-950 dark:text-emerald-100'
                  : 'bg-surface-muted dark:bg-[#101424] border-border-main dark:border-stone-800 hover:border-emerald-500/40 text-text-secondary'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-500 flex items-center space-x-1">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Niveau Intermédiaire' : language === 'zh' ? '中级 · 董事会全真' : 'Mid Boardroom'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    25 题
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary dark:text-white">
                  {language === 'fr' ? '25 Épreuves · 12s/tour' : language === 'zh' ? '25道全真题 · 12秒限时' : '25 Rounds · 12s Limit'}
                </h4>
                <p className="text-[11px] text-text-secondary dark:text-stone-300 leading-relaxed">
                  {language === 'fr'
                    ? 'Pool ESOP avant/après, fractions 1/6 & 1/8, SAFE discount et prix par action.'
                    : language === 'zh'
                    ? '深度剖析期权池前置折价、16.7%与12.5%特殊倒数、每股价格与SAFE折扣。'
                    : 'Deconstruct ESOP pre-money shuffle, 1/6 & 1/8 shortcuts, and SAFE cap discount.'}
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                {language === 'fr' ? 'Simulation complète (~5 min)' : language === 'zh' ? '全景攻防 · 深度实操 (~5分钟)' : 'Full simulation (~5 min)'}
              </div>
            </div>

            {/* 3. 高级 Senior (50 Questions) */}
            <div
              onClick={() => setSelectedTier('senior')}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                selectedTier === 'senior'
                  ? 'bg-rose-500/10 border-rose-500/80 shadow-[0_8px_24px_rgba(244,63,94,0.18)] ring-1 ring-rose-500 text-rose-950 dark:text-rose-100'
                  : 'bg-surface-muted dark:bg-[#101424] border-border-main dark:border-stone-800 hover:border-rose-500/40 text-text-secondary'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-rose-500 flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{language === 'fr' ? 'Niveau Expert' : language === 'zh' ? '高级 · 巅峰决战' : 'Senior Grandmaster'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                    50 题
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary dark:text-white">
                  {language === 'fr' ? '50 Épreuves · 10s/tour' : language === 'zh' ? '50道巅峰题 · 10秒极限' : '50 Rounds · 10s Limit'}
                </h4>
                <p className="text-[11px] text-text-secondary dark:text-stone-300 leading-relaxed">
                  {language === 'fr'
                    ? 'Cadence infernale, haircuts de Down-rounds, Step-up multiples et contrôle fondateur.'
                    : language === 'zh'
                    ? '全题型极限连击，降轮Haircut折价、估值跳升倍数(Step-up)与创始人保留权底线。'
                    : 'Extreme tempo, Down-round haircuts, step-up multiples, and founder control defense.'}
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-rose-500/20 text-[10px] font-mono text-rose-400">
                {language === 'fr' ? 'Épreuve d’endurance (~8 min)' : language === 'zh' ? '极限耐力 · 登顶天梯榜 (~8分钟)' : 'Endurance trial (~8 min)'}
              </div>
            </div>
          </div>

          {/* Random / Non-repeating Question Engine Assurance */}
          <div className="flex items-center justify-center space-x-2 text-[11px] font-mono text-stone-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'fr'
                ? 'Générateur Procédural Dynamique : Toutes les questions et nombres sont générés à la volée sans répétition.'
                : language === 'zh'
                ? '程序化动态题库引擎：每次进入游戏随机实时出题，参数完全不重复，确保边玩边学的极致神秘感与新鲜感。'
                : 'Procedural Valuation Engine: dynamic infinite non-repeating parameters on every run.'}
            </span>
          </div>

          {/* Launch Button */}
          <div className="pt-2">
            <button
              onClick={() => initGameSession(selectedTier)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono font-bold text-sm shadow-[0_12px_30px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/40 active:scale-95 transition-all flex items-center justify-center space-x-3 mx-auto cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {language === 'fr'
                  ? `Démarrer le Défi (${selectedTier === 'senior' ? 50 : selectedTier === 'mid' ? 25 : 5} Épreuves)`
                  : language === 'zh'
                  ? `开启极速心算对决 (${selectedTier === 'senior' ? '高级 50题' : selectedTier === 'mid' ? '中级 25题' : '初级 5题'})`
                  : `Launch Valuation Challenge (${selectedTier === 'senior' ? 50 : selectedTier === 'mid' ? 25 : 5} Rounds)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW B: ACTIVE LIVE GAMEPLAY */}
      {hasStarted && !isGameOver && currentQ && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* HUD: Round counter, Tier badge, Timer with progress bar, Live score, Combo streak */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-surface-muted dark:bg-[#121626] border border-border-main dark:border-stone-800 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-text-secondary dark:text-stone-400">
                Round <strong className="text-text-primary dark:text-white tabular-nums">{currentIndex + 1}</strong> / {questionQueue.length}
              </span>
              <span className="text-stone-400 dark:text-stone-600">·</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-bold uppercase text-[10px]">
                {selectedTier === 'senior' ? '高级 50题' : selectedTier === 'mid' ? '中级 25题' : '初级 5题'}
              </span>
              <span className="text-stone-400 dark:text-stone-600 hidden sm:inline">·</span>
              <span className="text-text-secondary dark:text-stone-400 uppercase hidden sm:inline">
                {currentQ.category.replace('_', ' ')}
              </span>
            </div>

            {/* Streak Multiplier Badge */}
            <div className="flex items-center space-x-2">
              {streak > 1 ? (
                <div className="flex items-center space-x-1 text-amber-500 font-bold animate-bounce">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>Combo ×{streak} (+{(streak - 1) * 25}%)</span>
                </div>
              ) : (
                <div className="text-text-secondary dark:text-stone-500 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Concentration' : language === 'zh' ? '定力蓄积' : 'Composure'}</span>
                </div>
              )}
            </div>

            {/* Live Score */}
            <div className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
              Score: <strong>{score}</strong> pts
            </div>
          </div>

          {/* Dynamic Timer Countdown Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center space-x-1.5 text-text-secondary dark:text-stone-400">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'fr' ? 'Compte à Rebours' : language === 'zh' ? '本轮思考倒计时' : 'Speed Clock'}</span>
              </span>
              <span
                className={`font-bold tabular-nums ${
                  timeLeft <= 3
                    ? 'text-rose-500 animate-pulse text-sm'
                    : timeLeft <= 6
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                }`}
              >
                {timeLeft}s
              </span>
            </div>

            <div className="h-2 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  timeLeft <= 3
                    ? 'bg-rose-500'
                    : timeLeft <= 6
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${(timeLeft / maxTime) * 100}%` }}
              />
            </div>
          </div>

          {/* DEAL CONTEXT & QUESTION CARD */}
          <div className="p-5 sm:p-7 rounded-3xl bg-surface-main dark:bg-[#151a2e] border border-border-main dark:border-stone-700/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-amber-600 dark:text-amber-400 font-semibold tracking-wider">
                {currentQ.title[language]}
              </span>
              <span className="text-[10px] font-mono text-text-secondary dark:text-stone-400">
                Limit: {currentQ.timeLimitSeconds}s
              </span>
            </div>

            {/* Story/Negotiation Context Quote */}
            <div className="p-3.5 rounded-2xl bg-surface-muted dark:bg-[#0e1220] border-l-4 border-amber-500 text-xs text-text-primary dark:text-stone-200 leading-relaxed italic">
              "{currentQ.context[language]}"
            </div>

            {/* Given Facts Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {currentQ.givenFacts.map((fact, fIdx) => (
                <div
                  key={fIdx}
                  className="p-3 rounded-xl bg-surface-muted dark:bg-stone-900 border border-border-main dark:border-stone-800"
                >
                  <div className="text-[10px] font-mono text-text-secondary dark:text-stone-400 truncate">
                    {fact.label[language]}
                  </div>
                  <div className="text-sm font-mono font-bold text-text-primary dark:text-stone-100 tabular-nums mt-0.5">
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Target Question */}
            <div className="pt-2">
              <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-white">
                {currentQ.question[language]}
              </h3>
            </div>
          </div>

          {/* 4 SELECTABLE CHOICES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOptionIndex === optIdx;
              let btnStyle =
                'bg-surface-main dark:bg-[#121626] border-border-main dark:border-stone-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-text-primary dark:text-stone-200';

              if (hasAnswered) {
                if (opt.isCorrect) {
                  btnStyle =
                    'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold shadow-md shadow-emerald-500/10';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-950 dark:text-rose-200 font-bold';
                } else {
                  btnStyle = 'opacity-40 border-border-main dark:border-stone-800 text-stone-500';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group active:scale-[0.98] cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-mono font-bold tabular-nums tracking-tight">
                      {opt.text}
                    </span>
                    {hasAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !opt.isCorrect && (
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </div>

                  {hasAnswered && (isSelected || opt.isCorrect) && (
                    <p className="text-[11px] font-sans mt-2 pt-2 border-t border-current/20 leading-relaxed">
                      {opt.trapNote[language]}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* TIMEOUT NOTIFICATION */}
          {isTimedOut && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500 text-rose-950 dark:text-rose-200 text-xs font-mono text-center flex items-center justify-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>
                {language === 'fr'
                  ? 'Temps écoulé ! Hésitation sanctionnée : 0 point pour ce tour.'
                  : language === 'zh'
                  ? '时间耗尽！谈判桌上犹豫不决，本轮得0分并重置连击。'
                  : 'Time out! Hesitation penalty: 0 points and streak reset.'}
              </span>
            </div>
          )}

          {/* MENTAL SHORTCUT REVEAL (Post-Answer Learning) */}
          {hasAnswered && (
            <div className="p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 text-amber-950 dark:text-amber-200 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                  {language === 'fr' ? 'Le Secret de Calcul Éclair' : language === 'zh' ? 'VC私藏 · 3秒心算心法' : 'VC 3-Second Shortcut Secret'}
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-xs font-bold text-amber-500">
                  {currentQ.mentalShortcut.formulaName[language]}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 font-mono text-xs font-bold text-amber-900 dark:text-amber-100">
                {currentQ.mentalShortcut.ruleOfThumb[language]}
              </div>

              <p className="text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
                {currentQ.mentalShortcut.explanation[language]}
              </p>

              {/* Continue to Next Round Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-md active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < questionQueue.length
                      ? language === 'fr'
                        ? 'Question Suivante'
                        : language === 'zh'
                        ? '进入下一题'
                        : 'Next Round'
                      : language === 'fr'
                      ? 'Voir le Bilan Final'
                      : language === 'zh'
                      ? '查看最终战报'
                      : 'Complete Assessment'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW C: FINAL GAME AUDIT & SCORE REPORT */}
      {isGameOver && (
        <div className="max-w-2xl mx-auto py-6 sm:py-8 space-y-6 text-center animate-in fade-in duration-300">
          <div className="relative mx-auto w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-amber-500 via-emerald-500 to-indigo-600 shadow-2xl">
            <img
              src={speedValuationIcon}
              alt="Game Completed Emblem"
              className="w-full h-full object-cover rounded-[22px] border border-white/20"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-emerald-500 font-bold tracking-widest flex items-center justify-center space-x-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>
                {language === 'fr'
                  ? `Épreuve ${selectedTier.toUpperCase()} Terminée`
                  : language === 'zh'
                  ? `${selectedTier === 'senior' ? '高级 50题' : selectedTier === 'mid' ? '中级 25题' : '初级 5题'} · 估值心算对决圆满完成`
                  : `${selectedTier.toUpperCase()} Session Completed`}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-text-primary dark:text-white">
              {score >= 2500 || (selectedTier === 'junior' && score >= 500)
                ? language === 'fr'
                  ? 'Grand Maître Quant du Boardroom'
                  : language === 'zh'
                  ? '董事会顶级量化大师'
                  : 'Sovereign Boardroom Quant'
                : score >= 1200 || (selectedTier === 'junior' && score >= 300)
                ? language === 'fr'
                  ? 'Négociateur Émérite'
                  : language === 'zh'
                  ? '资深创投博弈行家'
                  : 'Senior Valuation Architect'
                : language === 'fr'
                ? 'Praticien en Perfectionnement'
                : language === 'zh'
                ? '估值防线新锐学徒'
                : 'Dilution Defense Apprentice'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 max-w-md mx-auto leading-relaxed">
              {language === 'fr'
                ? 'Vos scores ont été enregistrés dans votre profil et au classement mondial.'
                : language === 'zh'
                ? '你的实战战报已永久归档至成就库，并同步登记至巅峰排行榜对应天梯赛道。'
                : 'Your mental performance audit has been permanently committed to your ledger and the leaderboard.'}
            </p>
          </div>

          {/* Performance Metrics Quad */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-surface-muted dark:bg-[#121626] border border-border-main dark:border-stone-800">
              <div className="text-[10px] font-mono text-text-secondary dark:text-stone-400 uppercase">
                {language === 'fr' ? 'Score Total' : language === 'zh' ? '总积分' : 'Total Score'}
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-amber-500 tabular-nums mt-1">
                {score}
              </div>
              <div className="text-[10px] font-mono text-stone-400">pts</div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-muted dark:bg-[#121626] border border-border-main dark:border-stone-800">
              <div className="text-[10px] font-mono text-text-secondary dark:text-stone-400 uppercase">
                {language === 'fr' ? 'Précision' : language === 'zh' ? '正确率' : 'Accuracy'}
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-500 tabular-nums mt-1">
                {accuracyPercent}%
              </div>
              <div className="text-[10px] font-mono text-stone-400">
                {correctCount} / {questionQueue.length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-muted dark:bg-[#121626] border border-border-main dark:border-stone-800">
              <div className="text-[10px] font-mono text-text-secondary dark:text-stone-400 uppercase">
                {language === 'fr' ? 'Vitesse Moyenne' : language === 'zh' ? '平均答题速度' : 'Avg Reaction'}
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-blue-400 tabular-nums mt-1">
                {averageResponseTime}s
              </div>
              <div className="text-[10px] font-mono text-stone-400">
                {fastAnswerCount} {language === 'fr' ? 'éclairs' : language === 'zh' ? '次秒答' : 'fast'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-muted dark:bg-[#121626] border border-border-main dark:border-stone-800">
              <div className="text-[10px] font-mono text-text-secondary dark:text-stone-400 uppercase">
                {language === 'fr' ? 'Meilleur Combo' : language === 'zh' ? '最高连击' : 'Max Streak'}
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-purple-400 tabular-nums mt-1">
                ×{maxStreak}
              </div>
              <div className="text-[10px] font-mono text-stone-400">streak</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => initGameSession(selectedTier)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {language === 'fr'
                  ? 'Rejouer ce Niveau (Nouveaux Chiffres)'
                  : language === 'zh'
                  ? '换一批全新题目 · 再战一局'
                  : 'Replay Tier (Fresh Numbers)'}
              </span>
            </button>

            <button
              onClick={() => setHasStarted(false)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>{language === 'fr' ? 'Changer de Niveau' : language === 'zh' ? '切换等级' : 'Change Tier'}</span>
            </button>

            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-500 font-mono font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>{language === 'fr' ? 'Consulter le Leaderboard' : language === 'zh' ? '查看巅峰排行榜' : 'View Leaderboard'}</span>
            </button>

            {onExit && (
              <button
                onClick={onExit}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-surface-muted dark:bg-stone-800 text-text-secondary text-xs font-mono hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                {language === 'fr' ? 'Retour au Hub' : language === 'zh' ? '返回游戏大厅' : 'Back to Hub'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Global Leaderboard Modal Integration */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
};
