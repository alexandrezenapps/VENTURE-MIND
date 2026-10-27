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
  onFinish?: (score: number) => void;
  onExit?: () => void;
}> = ({ onFinish, onExit }) => {
  const { language, speak, recordGameScore, formatMoney } = useApp();

  // Tier selection: 初级 (5题), 中级 (25题), 高级 (50题)
  const [selectedTier, setSelectedTier] = useState<CapTableDefenseTier>('junior');

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

    addLeaderboardRecord({
      gameId: 'game_03',
      sessionMode: modeKey,
      playerName: playerName || 'Cap Table Defender',
      playerTitle: {
        en:
          accuracy >= 0.9
            ? 'Sovereign Visionary (Unshakable Chair)'
            : accuracy >= 0.7
            ? 'Cap Table Fortress Architect'
            : 'Boardroom Governance Apprentice',
        fr:
          accuracy >= 0.9
            ? 'Président Souverain Inamovible'
            : accuracy >= 0.7
            ? 'Architecte de la Citadelle'
            : 'Apprenti au Conseil',
        zh:
          accuracy >= 0.9
            ? '终身掌舵者 · 传奇董事长'
            : accuracy >= 0.7
            ? '股权铁壁防御架构师'
            : '公司治理新锐学徒',
      },
      score: score,
      composure: Math.min(100, Math.round(accuracy * 100)),
      leverage: Math.min(100, Math.round((fastAnswerCount / Math.max(1, questionQueue.length)) * 100 + 45)),
      valuationSaved: correctCount * valuePerQuestion,
      roundsCompleted: questionQueue.length,
      totalRounds: questionQueue.length,
      isUser: true,
      tier: accuracy >= 0.9 ? 'sovereign' : accuracy >= 0.7 ? 'alpha' : 'principal',
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

          {/* Theme & Core Meaning Manifesto */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-text-primary dark:text-white">
              {language === 'fr'
                ? 'Choisissez votre Niveau de Défense de Capitalisation'
                : language === 'zh'
                ? '选择你的股权结构防卫战实战等级'
                : 'Select Your Cap Table Defense Tier'}
            </h3>

            <div className="p-4 max-w-xl mx-auto rounded-2xl bg-surface-muted dark:bg-[#12162a] border border-amber-400/30 text-xs text-text-secondary dark:text-stone-300 leading-relaxed text-left space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-amber-400 text-[11px] uppercase font-mono">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>
                  {language === 'fr'
                    ? 'Le Manifeste Fondateur'
                    : language === 'zh'
                    ? '股权结构防卫战核心真谛 · 守护掌控权'
                    : 'The Founder Doctrine of Sovereignty'}
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
                  <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center space-x-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Niveau Débutant' : language === 'zh' ? '初级 · 种子防御' : 'Junior Sprint'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                    5 题
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary dark:text-white">
                  {language === 'fr' ? '5 Épreuves · 25s/tour' : language === 'zh' ? '5道经典题 · 25秒限时' : '5 Rounds · 25s Limit'}
                </h4>
                <p className="text-[11px] text-text-secondary dark:text-stone-300 leading-relaxed">
                  {language === 'fr'
                    ? 'Post-Money SAFE, seuil de majorité 50,1 %, vesting 4 ans et rejet des sièges d’anges.'
                    : language === 'zh'
                    ? '专注种子轮SAFE纯净架构、50.1%绝对控股安全线、4年成熟与天使董事席位防范。'
                    : 'Master Post-Money SAFE, 50.1% majority threshold, 4-year vesting, and angel board defense.'}
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                {language === 'fr' ? 'Épreuve rapide (~2 min)' : language === 'zh' ? '基础底线 · 建立主权认知 (~2分钟)' : 'Rapid drill (~2 min)'}
              </div>
            </div>

            {/* 2. 中级 Mid (25 Questions) */}
            <div
              onClick={() => setSelectedTier('mid')}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                selectedTier === 'mid'
                  ? 'bg-amber-500/10 border-amber-500/80 shadow-[0_8px_24px_rgba(245,158,11,0.18)] ring-1 ring-amber-500 text-amber-950 dark:text-amber-100'
                  : 'bg-surface-muted dark:bg-[#101424] border-border-main dark:border-stone-800 hover:border-amber-500/40 text-text-secondary'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center space-x-1">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Niveau Intermédiaire' : language === 'zh' ? '中级 · 董事会全真' : 'Mid Boardroom'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                    25 题
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary dark:text-white">
                  {language === 'fr' ? '25 Épreuves · 20s/tour' : language === 'zh' ? '25道全真题 · 20秒限时' : '25 Rounds · 20s Limit'}
                </h4>
                <p className="text-[11px] text-text-secondary dark:text-stone-300 leading-relaxed">
                  {language === 'fr'
                    ? 'Option Pool Shuffle, vote double 10:1 (Zuckerberg), 1x non-participante et conseil 2-2-1.'
                    : language === 'zh'
                    ? '深度剖析期权池大洗牌精算、AB股10:1超级表决权、1倍非参与清算与2-2-1制衡董事会。'
                    : 'Deconstruct ESOP pre-money shuffle, 10:1 dual-class voting, 1x non-participating, and 2-2-1 boards.'}
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-400">
                {language === 'fr' ? 'Simulation complète (~6 min)' : language === 'zh' ? '实战博弈 · 深度攻防推演 (~6分钟)' : 'Full simulation (~6 min)'}
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
                  <span className="text-xs font-mono font-bold uppercase text-rose-400 flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{language === 'fr' ? 'Niveau Expert' : language === 'zh' ? '高级 · 终局决战' : 'Senior Grandmaster'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                    50 题
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary dark:text-white">
                  {language === 'fr' ? '50 Épreuves · 15s/tour' : language === 'zh' ? '50道终局题 · 15秒极限' : '50 Rounds · 15s Limit'}
                </h4>
                <p className="text-[11px] text-text-secondary dark:text-stone-300 leading-relaxed">
                  {language === 'fr'
                    ? 'Spirale Full-Ratchet, Pay-to-Play en crise, dividende cumulatif 8 % et minorité 33,4 %.'
                    : language === 'zh'
                    ? '全棘轮毒丸死亡螺旋、Pay-to-Play寒冬统战、8%累积复利股息与33.4%否决权生死红线。'
                    : 'Full-ratchet death spirals, Pay-to-Play crisis sanctions, 8% cumulative dividends, and 33.4% veto defenses.'}
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-rose-500/20 text-[10px] font-mono text-rose-400">
                {language === 'fr' ? 'Épreuve d’endurance (~10 min)' : language === 'zh' ? '极限高压 · 登顶风投天梯榜 (~10分钟)' : 'Endurance trial (~10 min)'}
              </div>
            </div>
          </div>

          {/* Random / Non-repeating Question Engine Assurance */}
          <div className="flex items-center justify-center space-x-2 text-[11px] font-mono text-stone-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'fr'
                ? 'Moteur Procédural Dynamique : Toutes les questions et clauses sont générées à la volée sans répétition.'
                : language === 'zh'
                ? '程序化动态题库引擎：每次进入游戏随机实时出题，情境与参数完全不重复，确保边玩边学的极致探索感。'
                : 'Procedural Cap Table Engine: infinite dynamic non-repeating parameters on every replay.'}
            </span>
          </div>

          {/* Launch Button */}
          <div className="pt-2">
            <button
              onClick={() => initGameSession(selectedTier)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-500 hover:from-amber-400 hover:to-emerald-500 text-stone-950 font-mono font-bold text-sm shadow-[0_12px_30px_rgba(245,158,11,0.3)] hover:shadow-amber-500/40 active:scale-95 transition-all flex items-center justify-center space-x-3 mx-auto cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 fill-current text-stone-950" />
              <span>
                {language === 'fr'
                  ? `Démarrer l’Épreuve (${selectedTier === 'senior' ? 50 : selectedTier === 'mid' ? 25 : 5} Questions)`
                  : language === 'zh'
                  ? `开启股权防卫战 (${selectedTier === 'senior' ? '高级 50题' : selectedTier === 'mid' ? '中级 25题' : '初级 5题'})`
                  : `Launch Cap Table Defense (${selectedTier === 'senior' ? 50 : selectedTier === 'mid' ? 25 : 5} Rounds)`}
              </span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW B: ACTIVE LIVE GAMEPLAY */}
      {hasStarted && !isGameOver && currentQ && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* HUD: Round counter, Tier badge, Timer bar, Live score, Streak */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-surface-muted dark:bg-[#101426] border border-border-main dark:border-stone-800 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-text-secondary dark:text-stone-400">
                Round <strong className="text-text-primary dark:text-white tabular-nums">{currentIndex + 1}</strong> / {questionQueue.length}
              </span>
              <span className="text-stone-400 dark:text-stone-600">·</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 font-bold uppercase text-[10px]">
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
