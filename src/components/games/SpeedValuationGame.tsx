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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  SPEED_VALUATION_QUESTIONS,
  ValuationQuestion,
} from '../../data/speedValuationData';
import {
  addLeaderboardRecord,
  getUserPlayerName,
} from '../../utils/leaderboardStorage';
import { LeaderboardModal } from '../common/LeaderboardModal';

type GameSessionLength = 5 | 10;

// Fisher-Yates shuffle
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

  // Mode: 5 questions or 10 questions
  const [sessionLength, setSessionLength] = useState<GameSessionLength>(5);

  // Active question queue
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
  const [fastAnswerCount, setFastAnswerCount] = useState(0); // <3s responses
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Audio feedback setting
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(true);

  // Initialize and shuffle question queue
  const initGameSession = useCallback((length: GameSessionLength) => {
    const shuffled = shuffleArray(SPEED_VALUATION_QUESTIONS);
    const selected = shuffled.slice(0, length);
    // Shuffle options inside each question to prevent position memorization
    const finalized = selected.map((q) => ({
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

  // Timer interval handling
  useEffect(() => {
    if (!hasStarted || hasAnswered || isGameOver || !currentQ) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, hasAnswered, isGameOver, currentIndex]);

  // Handle timeout (hesitation penalty)
  const handleTimeout = () => {
    setIsTimedOut(true);
    setHasAnswered(true);
    setStreak(0);
    setResponseTimes((prev) => [...prev, maxTime]);

    if (audioFeedbackEnabled) {
      speak(
        language === 'fr'
          ? 'Temps écoulé ! En négociation, l’hésitation coûte cher.'
          : language === 'zh'
          ? '时间耗尽！在创投博弈中，犹豫意味着丧失定价权。'
          : 'Time out! Hesitation costs leverage in dealmaking.'
      );
    }
  };

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
    const isFast = elapsedSeconds <= 4.0;

    if (opt.isCorrect) {
      playTone(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setCorrectCount((prev) => prev + 1);

      // Score computation: base 100 pts + streak bonus + speed bonus
      const streakMultiplier = 1 + (newStreak - 1) * 0.25; // 1x, 1.25x, 1.5x...
      const speedBonus = isFast ? 30 : Math.max(0, Math.round((maxTime - elapsedSeconds) * 2));
      const pointsEarned = Math.round(100 * streakMultiplier + speedBonus);
      setScore((prev) => prev + pointsEarned);

      if (isFast) {
        setFastAnswerCount((prev) => prev + 1);
      }

      if (audioFeedbackEnabled) {
        speak(
          language === 'fr'
            ? 'Formule exacte. Réflexe de valorisation instantané.'
            : language === 'zh'
            ? '精准绝杀！秒级心算，守住估值底线。'
            : 'Spot on! Instant mental valuation reflex.'
        );
      }
    } else {
      playTone(false);
      setStreak(0);

      if (audioFeedbackEnabled) {
        speak(
          language === 'fr'
            ? 'Piège classique de dilution détecté.'
            : language === 'zh'
            ? '落入经典稀释陷阱，切记分母为投后。'
            : 'Fell into dilution trap. Denominator is post-money.'
        );
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
    const accuracy = questionQueue.length > 0 ? (correctCount / questionQueue.length) : 0;
    const finalNormalizedScore = Math.min(100, Math.round(accuracy * 100));

    recordGameScore('game_02', finalNormalizedScore);
    if (onFinish) onFinish(finalNormalizedScore);

    // Save to Leaderboard
    const modeKey = sessionLength === 5 ? '5_rounds' : '10_rounds';
    const playerName = getUserPlayerName();
    const avgSpeed = responseTimes.length > 0
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
      : '0.0';

    addLeaderboardRecord({
      gameId: 'game_02',
      sessionMode: modeKey,
      playerName: playerName || 'Mental Quant Founder',
      playerTitle: {
        en: accuracy >= 0.9 ? 'Valuation Maestro' : accuracy >= 0.7 ? 'Senior Quant' : 'Dilution Apprentice',
        fr: accuracy >= 0.9 ? 'Maître de la Valorisation' : accuracy >= 0.7 ? 'Quant Senior' : 'Apprenti Fondateur',
        zh: accuracy >= 0.9 ? '估值心算大师' : accuracy >= 0.7 ? '资深量化操盘手' : '创投新锐领航者',
      },
      score: score,
      composure: Math.min(100, Math.round(accuracy * 100)),
      leverage: Math.min(100, Math.round((fastAnswerCount / Math.max(1, questionQueue.length)) * 100 + 40)),
      valuationSaved: correctCount * 2500000,
      roundsCompleted: questionQueue.length,
      totalRounds: questionQueue.length,
      isUser: true,
      tier: accuracy >= 0.9 ? 'sovereign' : accuracy >= 0.7 ? 'alpha' : 'principal',
    });
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
    <div className="relative rounded-3xl bg-surface-main dark:bg-[#0d111c] border border-border-main dark:border-stone-800 shadow-2xl overflow-hidden text-text-primary dark:text-stone-100 p-5 sm:p-8 space-y-6">
      {/* Background ambient luxury styling */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-main dark:border-stone-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-emerald-600 dark:text-emerald-400 font-bold uppercase">
            <Zap className="w-4 h-4 text-emerald-500 fill-current" />
            <span>Game #2 · {language === 'fr' ? 'Valorisation Éclair' : language === 'zh' ? '极速估值心算' : 'Speed Valuation'}</span>
            <span className="text-stone-400 dark:text-stone-600">·</span>
            <span className="text-amber-500 font-normal">
              {language === 'fr' ? 'Armure Cognitive de Négociation' : language === 'zh' ? '谈判桌上的认知防线' : 'Negotiation Defense Armor'}
            </span>
          </div>

          <h2 className="fluid-heading-2 font-serif-luxury font-bold text-text-primary dark:text-white">
            {language === 'fr'
              ? 'Calcul Mental Éclair : L’Art de Verrouiller la Valeur'
              : language === 'zh'
              ? '极速估值心算 · 秒级破局'
              : 'Speed Valuation: The 3-Second Mental Edge'}
          </h2>

          <p className="text-xs text-text-secondary dark:text-stone-400 max-w-2xl leading-relaxed">
            {language === 'fr'
              ? 'En réunion de closing, hésiter ou sortir une calculatrice trahit l’insécurité. Calculez instantanément le Pré, le Post et les pièges de pool pour dominer l’échange.'
              : language === 'zh'
              ? '顶级谈判桌上，掏出计算器或犹豫发呆等于拱手让出定价权。以秒级心算脱口而出投后估值、稀释比例与期权池真实折价，建立坚不可摧的专业威慑。'
              : 'In high-stakes fundraising, grabbing a calculator signals hesitation. Master instant mental shortcuts to lock post-money valuations and counter dilution traps.'}
          </p>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setAudioFeedbackEnabled((v) => !v)}
            className={`p-2.5 rounded-xl border text-xs font-mono transition-colors ${
              audioFeedbackEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'bg-surface-muted dark:bg-stone-800 border-border-main dark:border-stone-700 text-stone-400'
            }`}
            title="Toggle Voice Feedback"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>{language === 'fr' ? 'Records' : language === 'zh' ? '风云榜' : 'High Scores'}</span>
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="px-3.5 py-2 rounded-xl bg-surface-muted dark:bg-stone-800/80 hover:bg-surface-elevated text-text-secondary text-xs font-mono transition-colors"
            >
              {language === 'fr' ? 'Fermer' : language === 'zh' ? '退出' : 'Exit'}
            </button>
          )}
        </div>
      </div>

      {/* VIEW A: PRE-START INTRO / MODE SELECTOR */}
      {!hasStarted && (
        <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-8 text-center">
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-0.5 shadow-xl">
            <div className="w-full h-full rounded-2xl bg-[#0f1424] flex items-center justify-center">
              <Percent className="w-10 h-10 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-text-primary dark:text-white">
              {language === 'fr' ? 'Choisissez votre Épreuve de Calcul' : language === 'zh' ? '选择心算对决规模' : 'Select Challenge Session'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
              {language === 'fr'
                ? 'Chaque question propose un contexte d’investissement réel avec ses raccourcis mentaux de 3 secondes. Testez votre sang-froid sous le compte à rebours.'
                : language === 'zh'
                ? '每道题目均来自一线创投真实交锋，附带顶级VC私藏的3秒速算心法与防坑复盘。在极速倒计时高压下淬炼你的大脑算力。'
                : 'Every scenario mirrors real venture deal points, paired with 3-second shortcut secrets. Test your cognitive precision under timer pressure.'}
            </p>
          </div>

          {/* Mode Selector Segment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div
              onClick={() => setSessionLength(5)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                sessionLength === 5
                  ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg text-emerald-950 dark:text-emerald-100'
                  : 'bg-surface-muted dark:bg-stone-900 border-border-main dark:border-stone-800 hover:border-border-focus text-text-secondary'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  {language === 'fr' ? '5 Épreuves' : language === 'zh' ? '5轮速记试炼' : '5-Round Sprint'}
                </span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xs font-semibold text-text-primary dark:text-stone-200">
                {language === 'fr' ? 'Format Sprint (~2 min)' : language === 'zh' ? '快节奏闪电破局 (~2分钟)' : 'High-tempo rapid drill (~2 min)'}
              </p>
              <p className="text-[11px] text-text-secondary dark:text-stone-400 mt-1">
                {language === 'fr' ? 'Idéal pour l’échauffement matinal' : language === 'zh' ? '专注投后与稀释核心心算' : 'Focus on pre/post & dilution basics'}
              </p>
            </div>

            <div
              onClick={() => setSessionLength(10)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                sessionLength === 10
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-lg text-amber-950 dark:text-amber-100'
                  : 'bg-surface-muted dark:bg-stone-900 border-border-main dark:border-stone-800 hover:border-border-focus text-text-secondary'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                  {language === 'fr' ? '10 Épreuves' : language === 'zh' ? '10轮全真模拟' : '10-Round Masterclass'}
                </span>
                <Brain className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs font-semibold text-text-primary dark:text-stone-200">
                {language === 'fr' ? 'Format Boardroom (~4 min)' : language === 'zh' ? '高阶复杂博弈推演 (~4分钟)' : 'Complex deal points (~4 min)'}
              </p>
              <p className="text-[11px] text-text-secondary dark:text-stone-400 mt-1">
                {language === 'fr' ? 'Intègre ESOP, SAFE et Multiples' : language === 'zh' ? '涵盖期权池、SAFE转股与退出倍数' : 'Includes ESOP pool & SAFE clash'}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => initGameSession(sessionLength)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-sm shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-3 mx-auto cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {language === 'fr'
                  ? `Démarrer le Défi (${sessionLength} Épreuves)`
                  : language === 'zh'
                  ? `开启极速心算挑战 (${sessionLength}题)`
                  : `Launch Mental Arithmetic (${sessionLength} Rounds)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW B: ACTIVE LIVE GAMEPLAY */}
      {hasStarted && !isGameOver && currentQ && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* HUD: Round counter, Timer with progress bar, Live score, Combo streak */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-surface-muted dark:bg-[#121626] border border-border-main dark:border-stone-800 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-text-secondary dark:text-stone-400">
                Round <strong className="text-text-primary dark:text-white tabular-nums">{currentIndex + 1}</strong> / {questionQueue.length}
              </span>
              <span className="text-stone-400 dark:text-stone-600">·</span>
              <span className="text-text-secondary dark:text-stone-400 uppercase">
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
              let btnStyle = 'bg-surface-main dark:bg-[#121626] border-border-main dark:border-stone-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-text-primary dark:text-stone-200';

              if (hasAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold shadow-md shadow-emerald-500/10';
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
          <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-indigo-600 p-0.5 shadow-2xl">
            <div className="w-full h-full rounded-3xl bg-[#0d111c] flex items-center justify-center">
              <Trophy className="w-12 h-12 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-emerald-500 font-bold tracking-widest">
              {language === 'fr' ? 'Épreuve Terminée' : language === 'zh' ? '极速估值对决圆满完成' : 'Challenge Completed'}
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-text-primary dark:text-white">
              {score >= 800
                ? language === 'fr'
                  ? 'Grand Maître Quant du Boardroom'
                  : language === 'zh'
                  ? '董事会顶级量化大师'
                  : 'Sovereign Boardroom Quant'
                : score >= 500
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
                ? '你的实战战报已永久归档至成就库，并同步登记至巅峰排行榜。'
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
              onClick={() => initGameSession(sessionLength)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'fr' ? 'Rejouer ce Défi' : language === 'zh' ? '再次对决挑战' : 'Play Again'}</span>
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
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-surface-muted dark:bg-stone-800 text-text-secondary text-xs font-mono hover:bg-surface-elevated transition-colors"
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
