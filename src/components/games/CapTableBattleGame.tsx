import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Crown,
  Users,
  Clock,
  Flame,
  Award,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Trophy,
  Volume2,
  DollarSign,
  Briefcase,
  Sparkles,
  BookOpen,
  Compass,
  Layers,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CapTableDefenseTier,
  CapTableQuestion,
  generateDynamicCapTableSession,
} from '../../data/capTableBattleData';
import capTableIcon from '../../assets/images/cap_table_sovereignty_icon_1793108638526.jpg';
import {
  addLeaderboardRecord,
  getUserPlayerName,
} from '../../utils/leaderboardStorage';
import { recordCapTableBattleResult } from '../../services/capTableLeaderboardService';
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

export const CapTableBattleGame: React.FC<{
  initialTier?: CapTableDefenseTier;
  onFinish?: (score: number) => void;
  onExit?: () => void;
}> = ({ initialTier = 'junior', onFinish, onExit }) => {
  const { language, speak, recordGameScore, formatMoney } = useApp();

  // Mode selection: Beginner ('junior' - 5 Qs), Intermediate ('mid' - 25 Qs), Advanced ('senior' - 50 Qs)
  const [selectedTier, setSelectedTier] = useState<CapTableDefenseTier>(initialTier);

  // Active question queue
  const [questionQueue, setQuestionQueue] = useState<CapTableQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Round game state
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(25);
  const [maxTime, setMaxTime] = useState(25);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const roundStartTimeRef = useRef<number>(Date.now());

  // Scoring & Performance metrics
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [fastAnswerCount, setFastAnswerCount] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Audio feedback setting
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(true);

  // Initialize and generate procedural non-repeating question queue
  const initGameSession = useCallback((tier: CapTableDefenseTier) => {
    const generated = generateDynamicCapTableSession(tier);
    // Shuffle options inside each question
    const finalized = generated.map((q) => ({
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
            ? 'Temps écoulé ! Au conseil, l’hésitation fait perdre la majorité.'
            : language === 'zh'
            ? '时间耗尽！在股权博弈中，犹豫不决将导致丧失防御主动权。'
            : 'Time out! Hesitation surrenders boardroom leverage.'
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
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isCorrect) {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      } else {
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.setValueAtTime(195, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
        osc.start();
        osc.stop(ctx.currentTime + 0.32);
      }
    } catch {
      // AudioContext muted/unsupported
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
    const isFast = elapsedSeconds <= 5.0;

    if (opt.isCorrect) {
      playTone(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setCorrectCount((prev) => prev + 1);

      // Score computation: base 100 pts + streak multiplier + speed bonus + tier bonus
      const streakMultiplier = 1 + (newStreak - 1) * 0.25;
      const speedBonus = isFast ? 35 : Math.max(0, Math.round((maxTime - elapsedSeconds) * 2));
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
              ? 'Riposte magistrale. Contrôle souverain préservé.'
              : language === 'zh'
              ? '宗师绝杀！识破资本陷阱，守住股权生命线。'
              : 'Masterstroke! Cap table sovereignty fortified.'
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
              ? 'Clause prédatrice acceptée. Vigilance au conseil.'
              : language === 'zh'
              ? '落入资本控制权陷阱，切记守住底线。'
              : 'Fell into dilution ambush. Check charter covenants.'
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

    const accuracy = questionQueue.length > 0 ? correctCount / questionQueue.length : 0;
    const finalNormalizedScore = Math.min(100, Math.round(accuracy * 100));

    const modeKey =
      selectedTier === 'junior'
        ? '5_rounds'
        : selectedTier === 'mid'
        ? '25_rounds'
        : '50_rounds';

    const playerName = getUserPlayerName();
    const valuePerQuestion = selectedTier === 'senior' ? 5000000 : selectedTier === 'mid' ? 3500000 : 2500000;

    recordCapTableBattleResult({
      sessionMode: modeKey,
      score: score,
      accuracyPct: accuracy * 100,
      fastAnswerCount: fastAnswerCount,
      totalQuestions: questionQueue.length,
      valuationDefended: correctCount * valuePerQuestion,
    });

    setTimeout(() => {
      recordGameScore('game_03', finalNormalizedScore);
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
    <div className="relative rounded-3xl bg-surface-main dark:bg-[#0a0e1a] border border-border-main dark:border-stone-800 shadow-2xl overflow-hidden text-text-primary dark:text-stone-100 p-5 sm:p-8 space-y-6">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-main dark:border-stone-800/80 pb-5">
        <div className="flex items-center space-x-3.5">
          <img
            src={capTableIcon}
            alt="Cap Table Defense Emblem"
            className="w-12 h-12 rounded-xl object-cover border border-amber-400/50 shadow-md shrink-0"
          />
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-amber-500 dark:text-amber-400 font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Game #3 · {language === 'fr' ? 'Bataille de Table' : language === 'zh' ? '股权结构防卫战' : 'Cap Table Defense'}</span>
              <span className="text-stone-400 dark:text-stone-600">·</span>
              <span className="text-emerald-400 font-normal">
                {language === 'fr' ? 'Souveraineté Fondateur' : language === 'zh' ? '守卫生命线' : 'War for Sovereignty'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-text-primary dark:text-white">
              {language === 'fr'
                ? 'Guerre de Capitalisation : Protéger la Destinée'
                : language === 'zh'
                ? '股权结构防卫战 · 守卫生命线'
                : 'Cap Table Defense: War for Founder Sovereignty'}
            </h2>
          </div>
        </div>

        {/* Global Controls & Exit */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          <button
            onClick={() => setAudioFeedbackEnabled(!audioFeedbackEnabled)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              audioFeedbackEnabled
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
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
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-emerald-500 to-indigo-600 shadow-[0_12px_36px_rgba(245,158,11,0.35)]">
            <img
              src={capTableIcon}
              alt="Cap Table Sovereignty Icon"
              className="w-full h-full object-cover rounded-[22px] border border-white/20"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#0d1222] border border-amber-400/80 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
              Game #3 Flagship
            </div>
          </div>

          {/* Selection Screen Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {language === 'fr'
                  ? 'Sélectionnez votre Mode de Jeu'
                  : language === 'zh'
                  ? '股权防卫战 · 关卡模式选择'
                  : 'Select Your Defense Mode'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-text-primary dark:text-white">
              {language === 'fr'
                ? 'Choisissez votre Niveau d’Épreuve'
                : language === 'zh'
                ? '选择实战等级：初级 5题 / 中级 25题 / 高级 50题'
                : 'Choose Game Mode: Beginner, Intermediate, or Advanced'}
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
              {language === 'fr'
                ? 'Chaque session puise dynamiquement dans notre banque procédurale sans aucune répétition de question.'
                : language === 'zh'
                ? '所有关卡均直接接入52+套真实风投博弈场景题库，单局内绝不重复出题，重开随机洗牌参数，边玩边学守护股权生命线。'
                : 'Each session pulls dynamically from our 52+ non-repeating scenario bank. Zero question repetition within any session.'}
            </p>
          </div>

          {/* Core Meaning Doctrine Box */}
          <div className="p-4 sm:p-5 max-w-2xl mx-auto rounded-2xl bg-surface-muted dark:bg-[#11172a] border border-amber-400/30 text-xs text-text-secondary dark:text-stone-300 leading-relaxed text-left space-y-2 shadow-lg">
            <div className="flex items-center space-x-2 font-bold text-amber-400 text-xs uppercase font-mono">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {language === 'fr'
                  ? 'Le Manifeste Fondateur : Souveraineté & Contrôle'
                  : language === 'zh'
                  ? '股权结构防卫战核心真谛 · 守护愿景掌控权'
                  : 'The Founder Doctrine: Sovereign Boardroom Control'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-200">
              {language === 'fr'
                ? 'La défense de la table de capitalisation n’est pas pour thésauriser, mais pour protéger la vision stratégique. Maîtrisez le pool ESOP, le conseil d’administration et le vote double pour ne jamais être évincé.'
                : language === 'zh'
                ? '股权结构防卫战绝不是为了守财，而是守护创始团队对公司长远愿景的绝对掌控权与生命线！在多轮融资巨浪中，若不懂期权池投前暗算、董事会席位制衡、超级表决权与反稀释护城河，创始人终将沦为打工仔甚至在董事会突袭中被踢出局！'
                : 'Cap table defense is not about hoarding wealth—it is about preserving sovereign control over your life’s vision. Defeat pre-money pool shuffles, board coups, and full ratchets.'}
            </p>
          </div>

          {/* 3 Game Modes Grid: Beginner (5 Qs) · Intermediate (25 Qs) · Advanced (50 Qs) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 text-left">
            {/* 1. BEGINNER MODE (5 Questions) */}
            <div
              onClick={() => setSelectedTier('junior')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between group ${
                selectedTier === 'junior'
                  ? 'bg-gradient-to-b from-cyan-950/40 via-[#0e172a] to-[#0c1424] border-cyan-400/90 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-2 ring-cyan-400/50 text-white'
                  : 'bg-surface-muted dark:bg-[#101424] border-border-main dark:border-stone-800 hover:border-cyan-500/40 text-text-secondary hover:text-white'
              }`}
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 fill-cyan-400/20" />
                    <span>{language === 'fr' ? 'Débutant' : language === 'zh' ? '初级模式' : 'Beginner'}</span>
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/40">
                      5 {language === 'zh' ? '题' : 'Questions'}
                    </span>
                    {selectedTier === 'junior' && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {language === 'fr'
                      ? 'Mode Débutant (5 Questions)'
                      : language === 'zh'
                      ? '初级 · 种子防御战 (5题)'
                      : 'Beginner Mode (5 Questions)'}
                  </h4>
                  <div className="text-[10px] font-mono text-cyan-400/90 mt-0.5">
                    ★☆☆ {language === 'fr' ? '25s/question • ~2 min' : language === 'zh' ? '25秒/题 • 限时约2分钟' : '25s/question • ~2 min'}
                  </div>
                </div>

                <p className="text-[11px] text-stone-300 leading-relaxed">
                  {language === 'fr'
                    ? 'Fondations SAFE Post-Money, seuil critique 50,1 %, vesting 4 ans avec cliff et exclusion des sièges d’anges.'
                    : language === 'zh'
                    ? '专注种子轮SAFE纯净架构、50.1%绝对控股安全线、4年按月成熟+1年悬崖期，以及阻击天使投资人染指董事会。'
                    : 'Master Post-Money SAFE caps, 50.1% control threshold, 4-year vesting with 1-year cliff, and angel board defense.'}
                </p>

                {/* Key topics pill badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    SAFE Cap
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    4Y Vesting
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    50.1% Veto
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                <span>{language === 'fr' ? '5 Épreuves Uniques' : language === 'zh' ? '5道精选不重复题' : '5 Unique Questions'}</span>
                <span className="font-bold">{selectedTier === 'junior' ? '✓ SELECTED' : 'SELECT'}</span>
              </div>
            </div>

            {/* 2. INTERMEDIATE MODE (25 Questions) */}
            <div
              onClick={() => setSelectedTier('mid')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between group ${
                selectedTier === 'mid'
                  ? 'bg-gradient-to-b from-amber-950/40 via-[#18192a] to-[#0e1424] border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/50 text-white'
                  : 'bg-surface-muted dark:bg-[#101424] border-border-main dark:border-stone-800 hover:border-amber-500/40 text-text-secondary hover:text-white'
              }`}
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                    <Crown className="w-4 h-4 fill-amber-400/20" />
                    <span>{language === 'fr' ? 'Intermédiaire' : language === 'zh' ? '中级模式' : 'Intermediate'}</span>
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40">
                      25 {language === 'zh' ? '题' : 'Questions'}
                    </span>
                    {selectedTier === 'mid' && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {language === 'fr'
                      ? 'Mode Intermédiaire (25 Questions)'
                      : language === 'zh'
                      ? '中级 · 董事会推演战 (25题)'
                      : 'Intermediate Mode (25 Questions)'}
                  </h4>
                  <div className="text-[10px] font-mono text-amber-400/90 mt-0.5">
                    ★★☆ {language === 'fr' ? '20s/question • ~6 min' : language === 'zh' ? '20秒/题 • 限时约6分钟' : '20s/question • ~6 min'}
                  </div>
                </div>

                <p className="text-[11px] text-stone-300 leading-relaxed">
                  {language === 'fr'
                    ? 'Désamorçage du pool ESOP en pré-money, vote double 10:1 (Zuckerberg), 1x non-participante, conseil 2-2-1 et seuil 33,4 %.'
                    : language === 'zh'
                    ? '深度剖析期权池大洗牌精算、AB双重股权10:1超级投票权、1倍非参与清算优先权、2-2-1董事会制衡与33.4%一票否决权防线。'
                    : 'Deconstruct ESOP pre-money pool shuffles, 10:1 dual-class stock, 1x non-participating, 2-2-1 boards, and 33.4% veto lines.'}
                </p>

                {/* Key topics pill badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                    ESOP Shuffle
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                    10:1 Dual Class
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                    2-2-1 Board
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                    33.4% Veto
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-amber-500/20 flex items-center justify-between text-[10px] font-mono text-amber-300">
                <span>{language === 'fr' ? '25 Épreuves Non-Répétées' : language === 'zh' ? '25道全真不重复题' : '25 Non-Repeating Questions'}</span>
                <span className="font-bold">{selectedTier === 'mid' ? '✓ SELECTED' : 'SELECT'}</span>
              </div>
            </div>

            {/* 3. ADVANCED MODE (50 Questions) */}
            <div
              onClick={() => setSelectedTier('senior')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between group ${
                selectedTier === 'senior'
                  ? 'bg-gradient-to-b from-rose-950/40 via-[#1e1326] to-[#0e1424] border-rose-400/90 shadow-[0_0_25px_rgba(244,63,94,0.25)] ring-2 ring-rose-400/50 text-white'
                  : 'bg-surface-muted dark:bg-[#101424] border-border-main dark:border-stone-800 hover:border-rose-500/40 text-text-secondary hover:text-white'
              }`}
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                    <Flame className="w-4 h-4 fill-rose-400/20" />
                    <span>{language === 'fr' ? 'Avancé' : language === 'zh' ? '高级模式' : 'Advanced'}</span>
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/40">
                      50 {language === 'zh' ? '题' : 'Questions'}
                    </span>
                    {selectedTier === 'senior' && (
                      <CheckCircle2 className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                    {language === 'fr'
                      ? 'Mode Avancé (50 Questions)'
                      : language === 'zh'
                      ? '高级 · 终局决战 (50题)'
                      : 'Advanced Mode (50 Questions)'}
                  </h4>
                  <div className="text-[10px] font-mono text-rose-400/90 mt-0.5">
                    ★★★ {language === 'fr' ? '15s/question • ~12 min' : language === 'zh' ? '15秒极限 • 限时约12分钟' : '15s/question • ~12 min'}
                  </div>
                </div>

                <p className="text-[11px] text-stone-300 leading-relaxed">
                  {language === 'fr'
                    ? 'Full-Ratchet mortel, sanctions Pay-to-Play, dividendes cumulatifs 8 %, rachat forcé à 5 ans, warrants de dette et restructurations en tour baissier.'
                    : language === 'zh'
                    ? '全棘轮毒丸死亡螺旋、Pay-to-Play寒冬统战、8%累积复利股息、5年强制回购抽贷、风险债权认股权证与下折轮重组清洗防御。'
                    : 'Full-ratchet death spirals, Pay-to-Play sanctions, 8% cumulative dividends, 5-year redemption puts, warrants, and down-round cramdowns.'}
                </p>

                {/* Key topics pill badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                    Full Ratchet
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                    Pay-to-Play
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                    8% Dividend
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                    Warrant Kickers
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-rose-500/20 flex items-center justify-between text-[10px] font-mono text-rose-300">
                <span>{language === 'fr' ? '50 Épreuves Suprêmes' : language === 'zh' ? '50道终局极限不重复题' : '50 Ultimate Questions'}</span>
                <span className="font-bold">{selectedTier === 'senior' ? '✓ SELECTED' : 'SELECT'}</span>
              </div>
            </div>
          </div>

          {/* Non-repeating Question Bank Reassurance Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e1a22] to-amber-950/30 border border-emerald-500/30 text-left flex items-start gap-3.5 shadow-md">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shrink-0 text-emerald-400 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold font-mono text-emerald-300 flex items-center gap-2">
                <span>
                  {language === 'fr'
                    ? 'Garantie de Banque Procédurale Non-Répétitive'
                    : language === 'zh'
                    ? '题库防重保障：52+真实风投情境程序化动态抽选'
                    : 'Procedural Non-Repeating Bank Guarantee'}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                  Zero Repetition
                </span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {language === 'fr'
                  ? `Chaque session génère exactement ${selectedTier === 'senior' ? 50 : selectedTier === 'mid' ? 25 : 5} questions différentes échantillonnées sans doublon parmi 52+ archétypes de gouvernance VC. Les montants, ratios et contre-propositions sont recalculés à chaque nouvelle partie.`
                  : language === 'zh'
                  ? `本局将精确调取 ${selectedTier === 'senior' ? '50道' : selectedTier === 'mid' ? '25道' : '5道'} 互不重合的实战试炼，单局绝对不重复；每次重新开局都会生成全新风投资方、估值数字、反稀释公式与干扰项，确保学无止境。`
                  : `This session generates exactly ${selectedTier === 'senior' ? 50 : selectedTier === 'mid' ? 25 : 5} distinct non-repeating questions sampled across 52+ venture governance scenarios. Valuation figures and terms refresh dynamically on every play.`}
              </p>
            </div>
          </div>

          {/* Launch Action Controls */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => initGameSession(selectedTier)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-stone-950 font-mono font-bold text-sm shadow-[0_12px_30px_rgba(245,158,11,0.3)] hover:shadow-amber-500/40 active:scale-95 transition-all flex items-center justify-center space-x-3 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 fill-current text-stone-950" />
              <span>
                {language === 'fr'
                  ? `Lancer le Mode ${selectedTier === 'senior' ? 'Avancé (50 Questions)' : selectedTier === 'mid' ? 'Intermédiaire (25 Questions)' : 'Débutant (5 Questions)'}`
                  : language === 'zh'
                  ? `开启${selectedTier === 'senior' ? '高级模式 (50题)' : selectedTier === 'mid' ? '中级模式 (25题)' : '初级模式 (5题)'}`
                  : `Launch ${selectedTier === 'senior' ? 'Advanced (50 Questions)' : selectedTier === 'mid' ? 'Intermediate (25 Questions)' : 'Beginner (5 Questions)'}`}
              </span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>

            {onExit && (
              <button
                onClick={onExit}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-xs font-mono transition-all cursor-pointer"
              >
                {language === 'fr' ? 'Retour au Hub' : language === 'zh' ? '返回游戏大厅' : 'Back to Hub'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW B: ACTIVE LIVE GAMEPLAY */}
      {hasStarted && !isGameOver && currentQ && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Dedicated Question Progress Bar (Questions Completed vs Total: 5, 25, or 50) */}
          {(() => {
            const completedCount = hasAnswered ? currentIndex + 1 : currentIndex;
            const totalCount = questionQueue.length;
            const progressPercentage = Math.round((completedCount / Math.max(1, totalCount)) * 100);

            return (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d1426] via-[#101932] to-[#0d1426] border border-amber-500/30 shadow-lg space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  {/* Left: Progress Title & Tier Mode */}
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Layers className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-bold text-white tracking-wide">
                      {language === 'fr'
                        ? 'Progression de l’Épreuve'
                        : language === 'zh'
                        ? '实战答题进度'
                        : 'Challenge Progress'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {totalCount === 50
                        ? language === 'zh' ? '高级 50题' : 'Advanced (50 Qs)'
                        : totalCount === 25
                        ? language === 'zh' ? '中级 25题' : 'Intermediate (25 Qs)'
                        : language === 'zh' ? '初级 5题' : 'Beginner (5 Qs)'}
                    </span>
                  </div>

                  {/* Right: Question Counter (e.g., 12 / 25 题) & Percentage */}
                  <div className="flex items-center space-x-2.5">
                    <span className="text-stone-300 font-mono text-xs">
                      <span className="text-stone-400">{language === 'zh' ? '已完成' : language === 'fr' ? 'Terminées' : 'Completed'}:</span>{' '}
                      <strong className="text-emerald-400 font-bold tabular-nums text-sm">
                        {completedCount}
                      </strong>{' '}
                      <span className="text-stone-500">/</span>{' '}
                      <span className="text-white font-semibold tabular-nums">{totalCount}</span>{' '}
                      <span className="text-stone-400 text-[10px]">{language === 'zh' ? '题' : 'Qs'}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono font-bold text-xs tabular-nums shadow-sm">
                      {progressPercentage}%
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar Track with Gradient Fill */}
                <div className="relative h-2.5 w-full bg-stone-900 rounded-full overflow-hidden p-0.5 border border-stone-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(
                        completedCount > 0 ? 4 : 2,
                        Math.min(100, progressPercentage)
                      )}%`,
                    }}
                  />
                </div>

                {/* Sub-track: Discrete Steps for 5 questions, or Milestones for 25 / 50 questions */}
                {totalCount === 5 ? (
                  <div className="grid grid-cols-5 gap-1.5 pt-0.5">
                    {questionQueue.map((_, qIdx) => {
                      const isDone = qIdx < completedCount;
                      const isCurrent = qIdx === currentIndex && !hasAnswered;
                      return (
                        <div
                          key={qIdx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            isDone
                              ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                              : isCurrent
                              ? 'bg-amber-400 animate-pulse'
                              : 'bg-stone-800'
                          }`}
                          title={`Question ${qIdx + 1} of 5`}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 pt-0.5 px-0.5">
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-600 inline-block" />
                      <span>Start (0)</span>
                    </span>
                    <span className="text-stone-500">25% ({Math.round(totalCount * 0.25)})</span>
                    <span className="text-amber-400/80 font-bold">50% ({Math.round(totalCount * 0.5)})</span>
                    <span className="text-stone-500">75% ({Math.round(totalCount * 0.75)})</span>
                    <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Goal ({totalCount})</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* HUD: Round counter, Tier badge, Timer bar, Live score, Streak */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-surface-muted dark:bg-[#101426] border border-border-main dark:border-stone-800 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-text-secondary dark:text-stone-400">
                Round <strong className="text-text-primary dark:text-white tabular-nums">{currentIndex + 1}</strong> / {questionQueue.length}
              </span>
              <span className="text-stone-400 dark:text-stone-600">·</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 font-bold uppercase text-[10px]">
                {selectedTier === 'senior'
                  ? language === 'zh'
                    ? '高级模式 (50题)'
                    : language === 'fr'
                    ? 'Avancé (50 Qs)'
                    : 'Advanced (50 Qs)'
                  : selectedTier === 'mid'
                  ? language === 'zh'
                    ? '中级模式 (25题)'
                    : language === 'fr'
                    ? 'Intermédiaire (25 Qs)'
                    : 'Intermediate (25 Qs)'
                  : language === 'zh'
                  ? '初级模式 (5题)'
                  : language === 'fr'
                  ? 'Débutant (5 Qs)'
                  : 'Beginner (5 Qs)'}
              </span>
              <span className="text-stone-400 dark:text-stone-600 hidden sm:inline">·</span>
              <span className="text-text-secondary dark:text-stone-400 uppercase hidden sm:inline">
                {currentQ.category.replace('_', ' ')}
              </span>
            </div>

            {/* Streak Multiplier Badge */}
            <div className="flex items-center space-x-2">
              {streak > 1 ? (
                <div className="flex items-center space-x-1 text-amber-400 font-bold animate-bounce">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>Combo ×{streak} (+{(streak - 1) * 25}%)</span>
                </div>
              ) : (
                <div className="text-text-secondary dark:text-stone-500 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Souveraineté' : language === 'zh' ? '主权固守' : 'Sovereignty'}</span>
                </div>
              )}
            </div>

            {/* Live Score */}
            <div className="text-emerald-400 font-bold tabular-nums">
              Score: <strong>{score}</strong> pts
            </div>
          </div>

          {/* Dynamic Timer Countdown Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center space-x-1.5 text-text-secondary dark:text-stone-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'fr' ? 'Compte à Rebours Stratégique' : language === 'zh' ? '思考倒计时' : 'Strategic Clock'}</span>
              </span>
              <span
                className={`font-bold tabular-nums ${
                  timeLeft <= 4
                    ? 'text-rose-500 animate-pulse text-sm'
                    : timeLeft <= 8
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
                  timeLeft <= 4
                    ? 'bg-rose-500'
                    : timeLeft <= 8
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${(timeLeft / maxTime) * 100}%` }}
              />
            </div>
          </div>

          {/* SCENARIO & BOARDROOM DIALOGUE CARD */}
          <div className="p-5 sm:p-7 rounded-3xl bg-surface-main dark:bg-[#13172b] border border-border-main dark:border-stone-700/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
                {currentQ.title[language]}
              </span>
              <span className="text-[10px] font-mono text-text-secondary dark:text-stone-400">
                Limit: {currentQ.timeLimitSeconds}s
              </span>
            </div>

            {/* Dialogue Quote */}
            <div className="p-3.5 rounded-2xl bg-surface-muted dark:bg-[#0c101d] border-l-4 border-amber-500 text-xs text-text-primary dark:text-stone-200 leading-relaxed italic">
              {currentQ.context[language]}
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

          {/* 4 SELECTABLE TACTICAL RESPONSES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOptionIndex === optIdx;
              let btnStyle =
                'bg-surface-main dark:bg-[#111526] border-border-main dark:border-stone-800 hover:border-amber-400/50 hover:bg-amber-400/5 text-text-primary dark:text-stone-200';

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
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs sm:text-sm font-medium leading-snug">
                      {opt.text}
                    </span>
                    {hasAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {hasAnswered && isSelected && !opt.isCorrect && (
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
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
                  ? 'Temps écoulé ! Hésitation au conseil : 0 point pour ce tour.'
                  : language === 'zh'
                  ? '思考超时！在股权攻防中犹豫不决，本轮得0分并重置连击。'
                  : 'Time out! Hesitation penalty: 0 points and streak reset.'}
              </span>
            </div>
          )}

          {/* BOARDROOM DEFENSE DOCTRINE (Post-Answer Learning) */}
          {hasAnswered && (
            <div className="p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 text-amber-950 dark:text-amber-200 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider text-amber-500">
                  {language === 'fr' ? 'Doctrine du Conseil' : language === 'zh' ? '董事会防卫教纲复盘' : 'Boardroom Defense Doctrine'}
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-xs font-bold text-amber-400">
                  {currentQ.tacticalDebrief.title[language]}
                </span>
              </div>

              {/* Mathematical / Legal Mechanics */}
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-100 leading-relaxed">
                <strong>{language === 'fr' ? 'Mécanique :' : language === 'zh' ? '底层算术与公司法理推演：' : 'Mechanics: '}</strong>
                {currentQ.tacticalDebrief.mechanicsExplained[language]}
              </div>

              {/* Silicon Valley Precedent */}
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-300 leading-relaxed">
                <div className="flex items-center space-x-1 font-bold text-indigo-400 font-mono text-[10px] uppercase mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{language === 'fr' ? 'Précédent Réel' : language === 'zh' ? '硅谷/华尔街真实商战判例' : 'Real Precedent'}</span>
                </div>
                {currentQ.tacticalDebrief.realWorldCase[language]}
              </div>

              {/* Golden Rule */}
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono font-medium">
                ⚡ <strong>{language === 'fr' ? 'Règle d’Or :' : language === 'zh' ? '防卫铁律：' : 'Golden Rule: '}</strong>
                {currentQ.tacticalDebrief.goldenRule[language]}
              </div>

              {/* Continue to Next Round Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-500 hover:from-amber-400 hover:to-emerald-400 text-stone-950 font-mono font-bold text-xs shadow-md active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
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
                      ? '查看终局防卫战报'
                      : 'Complete Assessment'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW C: FINAL GAME AUDIT & SCORE REPORT */}
      {isGameOver && (
        <div className="max-w-2xl mx-auto py-6 sm:py-8 space-y-6 text-center animate-in fade-in duration-300">
          <div className="relative mx-auto w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-emerald-500 to-indigo-600 shadow-2xl">
            <img
              src={capTableIcon}
              alt="Game Completed Emblem"
              className="w-full h-full object-cover rounded-[22px] border border-white/20"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-widest flex items-center justify-center space-x-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'fr'
                  ? `Campagne ${selectedTier.toUpperCase()} Terminée`
                  : language === 'zh'
                  ? `${selectedTier === 'senior' ? '高级 50题' : selectedTier === 'mid' ? '中级 25题' : '初级 5题'} · 股权防卫战圆满收官`
                  : `${selectedTier.toUpperCase()} Defense Complete`}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-text-primary dark:text-white">
              {score >= 2500 || (selectedTier === 'junior' && score >= 500)
                ? language === 'fr'
                  ? 'Visionnaire Souverain (Contrôle Absolu)'
                  : language === 'zh'
                  ? '终身掌舵者 · 传奇董事长'
                  : 'Sovereign Visionary (Unshakable Chair)'
                : score >= 1200 || (selectedTier === 'junior' && score >= 300)
                ? language === 'fr'
                  ? 'Architecte de la Citadelle Protectrice'
                  : language === 'zh'
                  ? '铁壁防御者 · 稳掌战略否决权'
                  : 'Cap Table Fortress Architect'
                : language === 'fr'
                ? 'Négociateur en Perfectionnement'
                : language === 'zh'
                ? '股权架构防卫新锐学徒'
                : 'Governance Apprentice'}
            </h3>

            <p className="text-xs text-text-secondary dark:text-stone-300 max-w-md mx-auto leading-relaxed">
              {language === 'fr'
                ? 'Vos scores ont été enregistrés dans votre profil et au classement mondial.'
                : language === 'zh'
                ? '你的股权博弈战果已永久归档至成就库，并同步登记至巅峰排行榜对应天梯赛道。'
                : 'Your equity defense record has been permanently committed to your ledger and the leaderboard.'}
            </p>
          </div>

          {/* Performance Metrics Quad */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-surface-muted dark:bg-[#121626] border border-border-main dark:border-stone-800">
              <div className="text-[10px] font-mono text-text-secondary dark:text-stone-400 uppercase">
                {language === 'fr' ? 'Score Total' : language === 'zh' ? '总积分' : 'Total Score'}
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400 tabular-nums mt-1">
                {score}
              </div>
              <div className="text-[10px] font-mono text-stone-400">pts</div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-muted dark:bg-[#121626] border border-border-main dark:border-stone-800">
              <div className="text-[10px] font-mono text-text-secondary dark:text-stone-400 uppercase">
                {language === 'fr' ? 'Précision' : language === 'zh' ? '正确率' : 'Accuracy'}
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 tabular-nums mt-1">
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
                  ? 'Rejouer ce Niveau (Nouvelles Clauses)'
                  : language === 'zh'
                  ? '换一批全新试炼 · 再战一局'
                  : 'Replay Tier (Fresh Clauses)'}
              </span>
            </button>

            <button
              onClick={() => setHasStarted(false)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>{language === 'fr' ? 'Changer de Mode (5 / 25 / 50)' : language === 'zh' ? '切换模式 (初级5/中级25/高级50题)' : 'Change Mode (5/25/50 Qs)'}</span>
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
