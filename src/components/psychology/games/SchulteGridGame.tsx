import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Target, Timer, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface SchulteGridGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

export const SchulteGridGame: React.FC<SchulteGridGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [gridSize, setGridSize] = useState<16 | 25>(16);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentTarget, setCurrentTarget] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [clickFeedback, setClickFeedback] = useState<'correct' | 'wrong' | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const shuffleNumbers = (size: number) => {
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startGame = () => {
    const shuffled = shuffleNumbers(gridSize);
    setNumbers(shuffled);
    setCurrentTarget(1);
    setWrongClicks(0);
    setElapsedTime(0);
    setLastClickedIndex(null);
    setClickFeedback(null);
    setGameState('playing');
    startTimeRef.current = Date.now();

    if (!isAudioMuted) playPsychPulse(528, 0.2);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTimeRef.current) / 100) / 10);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCellClick = (num: number, index: number) => {
    if (gameState !== 'playing') return;

    setLastClickedIndex(index);

    if (num === currentTarget) {
      setClickFeedback('correct');
      if (!isAudioMuted) playSubtleClick();

      if (currentTarget === gridSize) {
        // Finished grid!
        if (timerRef.current) clearInterval(timerRef.current);
        const finalTime = Math.round((Date.now() - startTimeRef.current) / 100) / 10;
        setElapsedTime(finalTime);
        setGameState('ended');
        if (!isAudioMuted) playGameVictoryFanfare();
      } else {
        setCurrentTarget((t) => t + 1);
      }
    } else {
      setWrongClicks((w) => w + 1);
      setClickFeedback('wrong');
      if (!isAudioMuted) playGameErrorSound();
    }

    setTimeout(() => {
      setClickFeedback(null);
      setLastClickedIndex(null);
    }, 150);
  };

  // Calculate score based on time and errors
  // Baseline: 16 items in 15 seconds = 500 pts
  const baseTime = gridSize === 16 ? 20 : 35;
  const timeBonus = Math.max(0, Math.round((baseTime - elapsedTime) * 20));
  const penalty = wrongClicks * 25;
  const computedScore = Math.max(50, 300 + timeBonus - penalty);

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-amber-500/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-semibold block">
            {language === 'fr' ? 'Grille de Schulte Scientifique' : language === 'zh' ? '舒尔特视觉专注聚光灯' : 'Schulte Attention Matrix'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Balayage Périphérique & Focus' : language === 'zh' ? '周边视神经余光追踪' : 'Peripheral Tracking & Focus'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          {gameState === 'idle' && (
            <div className="flex items-center bg-surface-muted dark:bg-stone-800 p-1 rounded-xl text-xs font-mono">
              <button
                onClick={() => setGridSize(16)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  gridSize === 16 ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
                }`}
              >
                4x4 (16)
              </button>
              <button
                onClick={() => setGridSize(25)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  gridSize === 25 ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
                }`}
              >
                5x5 (25)
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
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Target className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? `Trouvez les nombres de 1 à ${gridSize} dans l’ordre`
                : language === 'zh'
                ? `游戏规则：按 1 至 ${gridSize} 顺序快速点击数字`
                : `Rule: Tap numbers from 1 to ${gridSize} in ascending order`}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'Fixez le centre du tableau et utilisez votre vision périphérique pour anticiper les chiffres suivants. Moins de 15 secondes = concentration de niveau pilote.'
                : language === 'zh'
                ? '保持视线注视方格中央，尽量用余光扫描外围数字。按 1、2、3... 顺序点按。用时低于15秒属于航天员级卓越专注力！'
                : 'Fixate gaze toward center and leverage peripheral vision to lock adjacent numbers. Sub-15s execution denotes elite aviation-grade attention span.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Démarrer le chronomètre' : language === 'zh' ? '开始专注计时' : 'Start Focus Matrix'}</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6 py-2">
          {/* Target Indicator Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-muted/60 dark:bg-stone-900/60 border border-border-main dark:border-white/5 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-text-secondary dark:text-stone-400 uppercase text-[10px]">
                {language === 'fr' ? 'Cible Suivante' : language === 'zh' ? '当前搜寻目标' : 'Next Target'}:
              </span>
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-sm shadow-md">
                {currentTarget}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 text-stone-200">
                <Timer className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-sm font-bold">{elapsedTime.toFixed(1)}s</span>
              </div>
              <div className="text-stone-400 text-xs">
                {language === 'fr' ? 'Erreurs' : language === 'zh' ? '误触' : 'Errors'}:{' '}
                <span className={wrongClicks > 0 ? 'text-red-400 font-bold' : 'text-stone-300'}>{wrongClicks}</span>
              </div>
            </div>
          </div>

          {/* Schulte Matrix Grid */}
          <div
            className={`grid gap-2 sm:gap-3 max-w-[340px] sm:max-w-[380px] mx-auto p-4 rounded-3xl bg-stone-900/80 border border-white/10 shadow-2xl ${
              gridSize === 16 ? 'grid-cols-4' : 'grid-cols-5'
            }`}
          >
            {numbers.map((num, idx) => {
              const isPastTarget = num < currentTarget;
              const isWrongClicked = lastClickedIndex === idx && clickFeedback === 'wrong';
              const isCorrectClicked = lastClickedIndex === idx && clickFeedback === 'correct';

              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(num, idx)}
                  disabled={isPastTarget}
                  className={`aspect-square rounded-2xl font-serif-luxury font-bold text-base sm:text-xl transition-all duration-150 border flex items-center justify-center active:scale-95 shadow-md ${
                    isPastTarget
                      ? 'bg-stone-900/40 border-stone-800 text-stone-600 opacity-40 cursor-default'
                      : isWrongClicked
                      ? 'bg-red-500/30 border-red-500 text-red-200 animate-shake'
                      : isCorrectClicked
                      ? 'bg-amber-400 border-amber-300 text-stone-950 scale-105'
                      : 'bg-surface-muted dark:bg-[#161a2e] border-white/10 text-stone-100 hover:border-amber-400/50 hover:bg-stone-800'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Peripheral Vision Tip */}
          <p className="text-center text-[11px] text-text-secondary dark:text-stone-400">
            {language === 'fr'
              ? 'Conseil : Gardez vos yeux ancrés au milieu pour élargir votre champ visuel.'
              : language === 'zh'
              ? '心理专注贴士：视线锁定在九宫格几何中心，用余光敏锐捕捉周边数字。'
              : 'Psychology Tip: Keep eye fixation near the central cross to engage maximum peripheral rod photoreceptors.'}
          </p>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'Bilan de Vitesse Visuelle' : language === 'zh' ? '视觉注意力测试报告' : 'Attentional Span Scorecard'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {elapsedTime <= 18
                ? language === 'fr'
                  ? 'Vitesse exceptionnelle ! Votre champ visuel et votre concentration continue sont au sommet.'
                  : language === 'zh'
                  ? '极其卓越的余光捕捉与视神经抗漂移能力！在复杂繁冗的信息流中具备快速锁定要害的定力。'
                  : 'Stunning visual search velocity! Your peripheral focus and gaze stability are at top executive level.'
                : language === 'fr'
                ? 'Bonne performance. Avec plus de pratique, vous réduirez les saccades oculaires superflues.'
                : language === 'zh'
                ? '表现稳健。通过多次练习可进一步减少眼动跳跃，大幅提升视神经信息处理效率。'
                : 'Solid result. Ongoing training smooths saccadic eye movement and tightens scanning discipline.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">TOTAL TIME</span>
              <span className="text-lg font-bold text-amber-400">{elapsedTime.toFixed(1)}s</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">ERRORS</span>
              <span className="text-lg font-bold text-stone-200">{wrongClicks}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">SCORE</span>
              <span className="text-lg font-bold text-emerald-400">{computedScore}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={startGame}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Recommencer' : language === 'zh' ? '再次测验' : 'Retry Matrix'}</span>
            </button>
            <button
              onClick={() => onFinish(computedScore)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-amber-500 text-stone-950 font-bold text-xs shadow-md hover:brightness-110 transition-all"
            >
              <span>{language === 'fr' ? 'Enregistrer & Quitter' : language === 'zh' ? '保存得分并退出' : 'Save & Close'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
