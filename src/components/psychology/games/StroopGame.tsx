import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, CheckCircle2, XCircle, Timer, Zap, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface StroopGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

const COLOR_PALETTE = [
  { id: 'red', name: { en: 'RED', fr: 'ROUGE', zh: '红' }, hex: '#EF4444', borderHex: 'border-red-500/40 text-red-500 bg-red-500/10' },
  { id: 'blue', name: { en: 'BLUE', fr: 'BLEU', zh: '蓝' }, hex: '#3B82F6', borderHex: 'border-blue-500/40 text-blue-500 bg-blue-500/10' },
  { id: 'green', name: { en: 'GREEN', fr: 'VERT', zh: '绿' }, hex: '#10B981', borderHex: 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10' },
  { id: 'yellow', name: { en: 'GOLD', fr: 'JAUNE', zh: '金' }, hex: '#F59E0B', borderHex: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'purple', name: { en: 'PURPLE', fr: 'VIOLET', zh: '紫' }, hex: '#A855F7', borderHex: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { id: 'white', name: { en: 'SILVER', fr: 'ARGENT', zh: '白' }, hex: '#F8FAFC', borderHex: 'border-stone-400/40 text-stone-200 bg-stone-500/10' },
];

export const StroopGame: React.FC<StroopGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalTrials, setTotalTrials] = useState(0);
  const [correctTrials, setCorrectTrials] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInkIndex, setCurrentInkIndex] = useState(1);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const trialStartTime = useRef<number>(Date.now());

  const generateTrial = () => {
    const wordIdx = Math.floor(Math.random() * COLOR_PALETTE.length);
    let inkIdx = Math.floor(Math.random() * COLOR_PALETTE.length);
    // 80% chance of mismatch for true Stroop interference friction
    if (Math.random() < 0.8 && inkIdx === wordIdx) {
      inkIdx = (inkIdx + 1) % COLOR_PALETTE.length;
    }
    setCurrentWordIndex(wordIdx);
    setCurrentInkIndex(inkIdx);
    trialStartTime.current = Date.now();
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalTrials(0);
    setCorrectTrials(0);
    setReactionTimes([]);
    setTimeLeft(30);
    setFeedback(null);
    setGameState('playing');
    generateTrial();
    if (!isAudioMuted) playPsychPulse(528, 0.2);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setGameState('ended');
            if (!isAudioMuted) playGameVictoryFanfare();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isAudioMuted]);

  const handleChoice = (colorId: string) => {
    if (gameState !== 'playing') return;

    const rt = Date.now() - trialStartTime.current;
    setReactionTimes((prev) => [...prev, rt]);
    setTotalTrials((prev) => prev + 1);

    const correctColorId = COLOR_PALETTE[currentInkIndex].id;

    if (colorId === correctColorId) {
      const latencyBonus = Math.max(10, Math.round((1200 - Math.min(1200, rt)) / 25));
      const addedPoints = 20 + latencyBonus + streak * 3;
      setScore((s) => s + addedPoints);
      setStreak((s) => {
        const next = s + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      setCorrectTrials((c) => c + 1);
      setFeedback('correct');
      if (!isAudioMuted) playSubtleClick();
    } else {
      setStreak(0);
      setScore((s) => Math.max(0, s - 15));
      setFeedback('wrong');
      if (!isAudioMuted) playGameErrorSound();
    }

    setTimeout(() => {
      setFeedback(null);
      generateTrial();
    }, 180);
  };

  const avgReactionTime = reactionTimes.length
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;
  const accuracy = totalTrials ? Math.round((correctTrials / totalTrials) * 100) : 0;

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-amber-400/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-semibold block">
            {language === 'fr' ? 'Interférence de Stroop' : language === 'zh' ? '斯特鲁普前额叶抑制' : 'Stroop Inhibitory Control'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Défi Sélectif Mot vs Encre' : language === 'zh' ? '辨色克字抗干扰' : 'Word-Ink Cognitive Friction'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-surface-muted dark:bg-stone-800/80 border border-border-main dark:border-stone-700 text-xs font-mono">
            <Timer className="w-3.5 h-3.5 text-amber-500" />
            <span className={timeLeft <= 5 ? 'text-red-400 font-bold animate-pulse' : 'text-stone-200'}>
              {timeLeft}s
            </span>
          </div>
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
            <Zap className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? 'Règle : Choisissez la COULEUR, pas le MOT'
                : language === 'zh'
                ? '游戏规则：点击【墨水颜色】，忽略【文字内容】'
                : 'Rule: Select the INK COLOR, ignore the WORD'}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'Votre cerveau veut lire automatiquement le texte. Forcez votre cortex cingulaire à supprimer cette impulsion et à ne cibler que la couleur visible.'
                : language === 'zh'
                ? '人脑对文字有自动阅读强冲动。当文字“绿”以【红色墨水】呈现时，你必须迅速点击【红】。考验毫秒级神经刹车力！'
                : 'Your brain automatically decodes semantics. Force your anterior cingulate cortex to override this reflex and select the physical pigment color.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Commencer le test' : language === 'zh' ? '开始测试 (30秒)' : 'Start Challenge (30s)'}</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-8 py-4">
          {/* Real-time Telemetry Stats */}
          <div className="flex items-center justify-around p-3 rounded-2xl bg-surface-muted/60 dark:bg-stone-900/60 border border-border-main dark:border-white/5 text-xs font-mono">
            <div>
              <span className="text-text-secondary dark:text-stone-400 block text-[10px] uppercase">
                {language === 'fr' ? 'Score' : language === 'zh' ? '得分' : 'Score'}
              </span>
              <span className="text-base font-bold text-amber-400">{score}</span>
            </div>
            <div>
              <span className="text-text-secondary dark:text-stone-400 block text-[10px] uppercase">
                {language === 'fr' ? 'Série' : language === 'zh' ? '连击' : 'Streak'}
              </span>
              <span className="text-base font-bold text-emerald-400">{streak}x</span>
            </div>
            <div>
              <span className="text-text-secondary dark:text-stone-400 block text-[10px] uppercase">
                {language === 'fr' ? 'Précision' : language === 'zh' ? '准确率' : 'Accuracy'}
              </span>
              <span className="text-base font-bold text-stone-200">{accuracy}%</span>
            </div>
            <div>
              <span className="text-text-secondary dark:text-stone-400 block text-[10px] uppercase">
                {language === 'fr' ? 'Vitesse' : language === 'zh' ? '均速' : 'Avg Latency'}
              </span>
              <span className="text-base font-bold text-purple-400">{avgReactionTime}ms</span>
            </div>
          </div>

          {/* Stimulus Word Arena */}
          <div
            className={`py-12 sm:py-16 rounded-3xl text-center transition-all duration-150 border ${
              feedback === 'correct'
                ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : feedback === 'wrong'
                ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                : 'bg-stone-900/40 border-white/5 shadow-inner'
            }`}
          >
            <span
              className="text-4xl sm:text-6xl font-serif-luxury font-black tracking-widest select-none transition-transform active:scale-95 inline-block"
              style={{ color: COLOR_PALETTE[currentInkIndex].hex }}
            >
              {COLOR_PALETTE[currentWordIndex].name[language]}
            </span>
            <div className="mt-3 text-xs text-text-secondary dark:text-stone-400 font-mono">
              {language === 'fr' ? 'Quelle est la COULEUR de l’encre ?' : language === 'zh' ? '文字的【墨水颜色】是什么？' : 'What is the physical INK COLOR?'}
            </div>
          </div>

          {/* Color Selection Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.id}
                onClick={() => handleChoice(color.id)}
                className={`py-3.5 px-3 rounded-2xl border font-bold text-xs sm:text-sm transition-all hover:brightness-125 active:scale-95 shadow-md flex items-center justify-center space-x-2 ${color.borderHex}`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.hex }} />
                <span>{color.name[language]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'Bilan de Contrôle Inhibiteur' : language === 'zh' ? '前额叶抑制测验报告' : 'Inhibitory Control Diagnostics'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {score >= 250
                ? language === 'fr'
                  ? 'Excellente maîtrise préfrontale. Votre résistance aux biais automatiques est au niveau élite.'
                  : language === 'zh'
                  ? '卓越的前额叶抑制定力！面对诱导性信息时具备极强的冷静反思与动作刹车能力。'
                  : 'Elite prefrontal mastery. Extraordinary resilience against subconscious cognitive biases.'
                : language === 'fr'
                ? 'Bonne réactivité. Entraînez-vous encore pour réduire la latence de conflit sémantique.'
                : language === 'zh'
                ? '表现稳健。建议定期训练以进一步压缩面对语义冲突时的思考延迟。'
                : 'Solid baseline. Regular conditioning will compress interference latency in high-stakes talks.'}
            </p>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL SCORE</span>
              <span className="text-lg font-bold text-amber-400">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">MAX STREAK</span>
              <span className="text-lg font-bold text-emerald-400">{maxStreak}x</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">ACCURACY</span>
              <span className="text-lg font-bold text-stone-100">{accuracy}%</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">AVG LATENCY</span>
              <span className="text-lg font-bold text-purple-400">{avgReactionTime}ms</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={startGame}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Recommencer' : language === 'zh' ? '再试一次' : 'Retry'}</span>
            </button>
            <button
              onClick={() => onFinish(score)}
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
