import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, CheckCircle2, XCircle, Brain, Sparkles, Layers } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface DualNBackGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

const RUNE_SYMBOLS = ['ALPHA', 'DELTA', 'OMEGA', 'SIGMA', 'THETA', 'KAPPA'];
const RUNE_GLYPHS = ['α', 'δ', 'ω', 'σ', 'θ', 'κ'];

export const DualNBackGame: React.FC<DualNBackGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [nBackLevel, setNBackLevel] = useState<1 | 2>(2);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 20;

  // History buffer
  const [positionHistory, setPositionHistory] = useState<number[]>([]);
  const [runeHistory, setRuneHistory] = useState<number[]>([]);

  // Current stimulus
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [activeRune, setActiveRune] = useState<number | null>(null);

  // Player responses for current turn
  const [respondedPosition, setRespondedPosition] = useState(false);
  const [respondedRune, setRespondedRune] = useState(false);

  // Feedback states
  const [posFeedback, setPosFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [runeFeedback, setRuneFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Stats
  const [score, setScore] = useState(0);
  const [correctHits, setCorrectHits] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);

  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setPositionHistory([]);
    setRuneHistory([]);
    setCurrentStep(0);
    setScore(0);
    setCorrectHits(0);
    setFalseAlarms(0);
    setActiveCell(null);
    setActiveRune(null);
    setRespondedPosition(false);
    setRespondedRune(false);
    setPosFeedback(null);
    setRuneFeedback(null);
    setGameState('playing');
    if (!isAudioMuted) playPsychPulse(432, 0.3);
  };

  // Next step trigger in game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (currentStep >= totalSteps) {
      setGameState('ended');
      if (!isAudioMuted) playGameVictoryFanfare();
      return;
    }

    // Determine position and rune for this turn
    // 35% probability of match with N steps back to ensure enough targets
    let nextPos = Math.floor(Math.random() * 9);
    let nextRune = Math.floor(Math.random() * RUNE_SYMBOLS.length);

    if (positionHistory.length >= nBackLevel && Math.random() < 0.4) {
      nextPos = positionHistory[positionHistory.length - nBackLevel];
    }
    if (runeHistory.length >= nBackLevel && Math.random() < 0.4) {
      nextRune = runeHistory[runeHistory.length - nBackLevel];
    }

    setActiveCell(nextPos);
    setActiveRune(nextRune);
    setRespondedPosition(false);
    setRespondedRune(false);
    setPosFeedback(null);
    setRuneFeedback(null);

    // Audio frequency based on rune
    if (!isAudioMuted) {
      const freqs = [330, 392, 440, 528, 587, 660];
      playPsychPulse(freqs[nextRune], 0.2);
    }

    // Trial lasts 2.4 seconds, then blank interval of 500ms
    stepTimerRef.current = setTimeout(() => {
      // Evaluate missed targets
      const hadPosMatch =
        positionHistory.length >= nBackLevel &&
        nextPos === positionHistory[positionHistory.length - nBackLevel];
      const hadRuneMatch =
        runeHistory.length >= nBackLevel &&
        nextRune === runeHistory[runeHistory.length - nBackLevel];

      if (hadPosMatch && !respondedPosition) {
        // Missed target
      }
      if (hadRuneMatch && !respondedRune) {
        // Missed target
      }

      setPositionHistory((prev) => [...prev, nextPos]);
      setRuneHistory((prev) => [...prev, nextRune]);
      setActiveCell(null);
      setActiveRune(null);

      // Brief inter-stimulus pause
      setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, 400);
    }, 2400);

    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [gameState, currentStep, nBackLevel, isAudioMuted]);

  const handlePositionMatch = () => {
    if (gameState !== 'playing' || respondedPosition || activeCell === null) return;
    setRespondedPosition(true);

    const isMatch =
      positionHistory.length >= nBackLevel &&
      activeCell === positionHistory[positionHistory.length - nBackLevel];

    if (isMatch) {
      setScore((s) => s + 50);
      setCorrectHits((c) => c + 1);
      setPosFeedback('correct');
      if (!isAudioMuted) playSubtleClick();
    } else {
      setScore((s) => Math.max(0, s - 20));
      setFalseAlarms((f) => f + 1);
      setPosFeedback('wrong');
      if (!isAudioMuted) playGameErrorSound();
    }
  };

  const handleRuneMatch = () => {
    if (gameState !== 'playing' || respondedRune || activeRune === null) return;
    setRespondedRune(true);

    const isMatch =
      runeHistory.length >= nBackLevel &&
      activeRune === runeHistory[runeHistory.length - nBackLevel];

    if (isMatch) {
      setScore((s) => s + 50);
      setCorrectHits((c) => c + 1);
      setRuneFeedback('correct');
      if (!isAudioMuted) playSubtleClick();
    } else {
      setScore((s) => Math.max(0, s - 20));
      setFalseAlarms((f) => f + 1);
      setRuneFeedback('wrong');
      if (!isAudioMuted) playGameErrorSound();
    }
  };

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-purple-500/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold block">
            {language === 'fr' ? 'Mémoire de Travail Neuro-Agile' : language === 'zh' ? '极限工作记忆神经重塑' : 'Dual N-Back Working Memory'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Double Traque : Position & Rune' : language === 'zh' ? '空间位置与符文双轨匹配' : 'Spatial & Symbolic Dual Stream'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          {/* Level Switcher */}
          {gameState === 'idle' && (
            <div className="flex items-center bg-surface-muted dark:bg-stone-800 p-1 rounded-xl text-xs font-mono">
              <button
                onClick={() => setNBackLevel(1)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  nBackLevel === 1 ? 'bg-purple-600 text-white font-bold' : 'text-stone-400'
                }`}
              >
                1-Back
              </button>
              <button
                onClick={() => setNBackLevel(2)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  nBackLevel === 2 ? 'bg-purple-600 text-white font-bold' : 'text-stone-400'
                }`}
              >
                2-Back
              </button>
            </div>
          )}
          <button
            onClick={onExit}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors px-2 py-1"
          >
            {language === 'fr' ? 'Quitter' : language === 'zh' ? '退出' : 'Exit'}
          </button>
        </div>
      </div>

      {gameState === 'idle' && (
        <div className="py-10 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Brain className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? `Mode ${nBackLevel}-Back : Retenez ${nBackLevel} coups en arrière`
                : language === 'zh'
                ? `【${nBackLevel}-Back 难度】：比对前第 ${nBackLevel} 步的位置与符文`
                : `${nBackLevel}-Back Mode: Recall stimuli from ${nBackLevel} step(s) ago`}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'Un carré s’allume sur la grille et une rune grecque apparaît. Appuyez sur [Position] ou [Rune] si l’élément actuel est identique à celui d’il y a 2 tours !'
                : language === 'zh'
                ? '3x3黑曜石矩阵中晶格将亮起并伴随符文。如果当前【位置】与前第2步一致，点击位置匹配；如果【符文】与前第2步一致，点击符文匹配！'
                : 'A grid cell lights up while a Greek rune flashes. Hit [Position] or [Rune] when either attribute matches the one from 2 steps ago.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Lancer l’entraînement' : language === 'zh' ? '启动心智测试 (20轮)' : 'Start Challenge (20 Turns)'}</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6 py-2">
          {/* Progress bar and metrics */}
          <div className="flex items-center justify-between text-xs font-mono text-text-secondary dark:text-stone-400">
            <span>
              {language === 'fr' ? 'Tour' : language === 'zh' ? '轮次' : 'Turn'} {currentStep + 1} / {totalSteps}
            </span>
            <div className="flex items-center space-x-4">
              <span>{language === 'fr' ? 'Score' : language === 'zh' ? '得分' : 'Score'}: <strong className="text-purple-400 text-sm">{score}</strong></span>
              <span>{language === 'fr' ? 'Succès' : language === 'zh' ? '精准命中' : 'Hits'}: <strong className="text-emerald-400">{correctHits}</strong></span>
            </div>
          </div>

          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* 3x3 Obsidian Matrix */}
          <div className="grid grid-cols-3 gap-3 max-w-[280px] sm:max-w-[320px] mx-auto p-4 rounded-3xl bg-stone-900/80 border border-white/10 shadow-2xl">
            {Array.from({ length: 9 }).map((_, idx) => {
              const isActive = activeCell === idx;
              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-200 border ${
                    isActive
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.6)] scale-105'
                      : 'bg-stone-800/60 border-white/5 shadow-inner'
                  }`}
                >
                  {isActive && activeRune !== null && (
                    <span className="text-2xl sm:text-3xl font-serif font-black text-white drop-shadow-md animate-pulse">
                      {RUNE_GLYPHS[activeRune]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Rune Announcement */}
          <div className="text-center font-mono text-xs">
            <span className="text-text-secondary dark:text-stone-400 uppercase tracking-wider">
              {language === 'fr' ? 'Rune Active' : language === 'zh' ? '当前符文' : 'Active Rune'}:{' '}
            </span>
            <span className="text-purple-400 font-bold">
              {activeRune !== null ? RUNE_SYMBOLS[activeRune] : '···'}
            </span>
          </div>

          {/* Dual Action Match Buttons */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
            <button
              onClick={handlePositionMatch}
              disabled={respondedPosition}
              className={`py-3.5 px-4 rounded-2xl border font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95 ${
                respondedPosition
                  ? posFeedback === 'correct'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-red-500/20 border-red-500 text-red-400'
                  : 'bg-stone-800 hover:bg-stone-700/80 border-purple-500/40 text-purple-300 hover:border-purple-400'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>
                {language === 'fr'
                  ? 'Position Égale'
                  : language === 'zh'
                  ? '位置匹配 (Position)'
                  : 'Position Match'}
              </span>
            </button>

            <button
              onClick={handleRuneMatch}
              disabled={respondedRune}
              className={`py-3.5 px-4 rounded-2xl border font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95 ${
                respondedRune
                  ? runeFeedback === 'correct'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-red-500/20 border-red-500 text-red-400'
                  : 'bg-stone-800 hover:bg-stone-700/80 border-indigo-500/40 text-indigo-300 hover:border-indigo-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'fr'
                  ? 'Rune Égale'
                  : language === 'zh'
                  ? '符文匹配 (Rune)'
                  : 'Rune Match'}
              </span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'Bilan Neuro-Mémoire' : language === 'zh' ? '工作记忆与流体智力评级' : 'Working Memory Quotient'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {score >= 350
                ? language === 'fr'
                  ? 'Capacité de travail exceptionnelle. Votre mémoire tampon dorsolatérale est affûtée pour la haute complexité.'
                  : language === 'zh'
                  ? '非凡的工作记忆宽带！背外侧前额叶多轨信息整合能力达到顶级水准，多任务并行从容不迫。'
                  : 'Exceptional working memory bandwidth. Your dorsolateral PFC integrates complex concurrent data seamlessly.'
                : language === 'fr'
                ? 'Bonne coordination. Continuez à pratiquer le 2-Back pour muscler la mémoire immédiate.'
                : language === 'zh'
                ? '表现优良。持续进行 2-Back 训练可显著强化大脑多重线索记忆留存深度。'
                : 'Solid foundation. Consistent 2-Back training expands short-term working memory capacity.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL SCORE</span>
              <span className="text-lg font-bold text-purple-400">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">CORRECT HITS</span>
              <span className="text-lg font-bold text-emerald-400">{correctHits}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FALSE ALARMS</span>
              <span className="text-lg font-bold text-stone-300">{falseAlarms}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={startGame}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Rejouer' : language === 'zh' ? '重新挑战' : 'Play Again'}</span>
            </button>
            <button
              onClick={() => onFinish(score)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-md hover:brightness-110 transition-all"
            >
              <span>{language === 'fr' ? 'Enregistrer & Quitter' : language === 'zh' ? '保存得分并退出' : 'Save & Close'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
