import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Zap, Timer, AlertOctagon, CheckCircle2, Shield } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface GoNoGoGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

interface TrialConfig {
  type: 'go' | 'nogo';
  centerSymbol: string;
  flankers: string;
  targetDirection: 'left' | 'right' | 'freeze';
}

export const GoNoGoGame: React.FC<GoNoGoGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [gameState, setGameState] = useState<'idle' | 'running' | 'ended'>('idle');
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const totalTrials = 20;

  const [currentStimulus, setCurrentStimulus] = useState<TrialConfig | null>(null);
  const [stimulusVisible, setStimulusVisible] = useState(false);
  const [userResponded, setUserResponded] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  // Scores & Telemetry
  const [score, setScore] = useState(0);
  const [commissionErrors, setCommissionErrors] = useState(0); // Tapped on NO-GO
  const [omissionErrors, setOmissionErrors] = useState(0); // Missed GO
  const [successfulGos, setSuccessfulGos] = useState(0);
  const [successfulStops, setSuccessfulStops] = useState(0);

  const trialTimerRef = useRef<NodeJS.Timeout | null>(null);
  const trialStartTimeRef = useRef<number>(0);

  const runTrial = (index: number) => {
    if (index >= totalTrials) {
      setGameState('ended');
      if (!isAudioMuted) playGameVictoryFanfare();
      return;
    }

    setCurrentTrialIndex(index);
    setUserResponded(false);
    setFeedbackText(null);

    // 70% GO trials, 30% NO-GO trials (creates strong prepotent action impulse)
    const isNoGo = Math.random() < 0.3;
    const isCongruent = Math.random() < 0.5;

    let trial: TrialConfig;
    if (isNoGo) {
      trial = {
        type: 'nogo',
        centerSymbol: '☠️',
        flankers: '⚡ ⚡',
        targetDirection: 'freeze',
      };
    } else {
      const dir = Math.random() < 0.5 ? 'left' : 'right';
      const arrow = dir === 'left' ? '◄' : '►';
      const flankerArrow = isCongruent ? arrow : dir === 'left' ? '►' : '◄';
      trial = {
        type: 'go',
        centerSymbol: arrow,
        flankers: `${flankerArrow} ${flankerArrow}`,
        targetDirection: dir,
      };
    }

    // 400ms fixation cross interval
    setStimulusVisible(false);
    setTimeout(() => {
      setCurrentStimulus(trial);
      setStimulusVisible(true);
      trialStartTimeRef.current = Date.now();

      // Stimulus window: 750ms to react
      trialTimerRef.current = setTimeout(() => {
        setStimulusVisible(false);

        // Check if user missed a GO
        if (trial.type === 'go' && !userResponded) {
          setOmissionErrors((o) => o + 1);
          setScore((s) => Math.max(0, s - 20));
          setFeedbackText(language === 'fr' ? 'Manqué !' : language === 'zh' ? '反应迟疑 (未点击)' : 'Missed GO!');
          if (!isAudioMuted) playGameErrorSound();
        } else if (trial.type === 'nogo' && !userResponded) {
          // Successfully inhibited!
          setSuccessfulStops((s) => s + 1);
          setScore((s) => s + 35);
          setFeedbackText(language === 'fr' ? 'Arrêt Réussi !' : language === 'zh' ? '刹车成功！' : 'Inhibition Success!');
        }

        setTimeout(() => {
          runTrial(index + 1);
        }, 350);
      }, 750);
    }, 450);
  };

  const startGame = () => {
    setScore(0);
    setCommissionErrors(0);
    setOmissionErrors(0);
    setSuccessfulGos(0);
    setSuccessfulStops(0);
    setCurrentTrialIndex(0);
    setGameState('running');
    if (!isAudioMuted) playPsychPulse(528, 0.2);
    runTrial(0);
  };

  useEffect(() => {
    return () => {
      if (trialTimerRef.current) clearTimeout(trialTimerRef.current);
    };
  }, []);

  const handleActionTap = () => {
    if (gameState !== 'running' || !stimulusVisible || userResponded || !currentStimulus) return;
    setUserResponded(true);

    const rt = Date.now() - trialStartTimeRef.current;

    if (currentStimulus.type === 'go') {
      const speedBonus = Math.max(10, Math.round((750 - rt) / 20));
      setScore((s) => s + 30 + speedBonus);
      setSuccessfulGos((g) => g + 1);
      setFeedbackText(language === 'fr' ? `GO Rapide (${rt}ms)` : language === 'zh' ? `精准击发 (${rt}ms)` : `Fast GO (${rt}ms)`);
      if (!isAudioMuted) playSubtleClick();
    } else {
      // False alarm commission error!
      setCommissionErrors((c) => c + 1);
      setScore((s) => Math.max(0, s - 40));
      setFeedbackText(language === 'fr' ? 'FAUSSE ALERTE !' : language === 'zh' ? '误触刹车红线！' : 'FALSE ALARM (Commission Error)!');
      if (!isAudioMuted) playGameErrorSound();
    }
  };

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-amber-500/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-semibold block">
            {language === 'fr' ? 'Inhibition Go / No-Go' : language === 'zh' ? '心流反应抑制与动作刹车' : 'Go / No-Go Flanker Task'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Réactivité Motrice vs Freinage' : language === 'zh' ? '侧翼冲突与毫秒刹车定力' : 'Motor Impulse Braking'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
            {currentTrialIndex + 1} / {totalTrials}
          </span>
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
                ? 'Tapez vite sur GO, mais immobilisez-vous sur NO-GO !'
                : language === 'zh'
                ? '规则：看到箭头迅速点击 GO，看到骷髅 ☠️ 绝对不要动！'
                : 'Rule: Tap GO instantly on Arrows, FREEZE completely on Skulls ☠️'}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'La grande majorité des stimuli sont des "GO", ce qui programme vos muscles à frapper. Le test mesure la capacité de votre gyrus frontal inférieur à stopper net ce réflexe.'
                : language === 'zh'
                ? '70% 的信号都是刺激点击的 GO 箭头，使你的神经系统形成强预激。当偶发的深红骷髅突击时，考验右侧额下回能否在300毫秒内紧急踩死动作刹车！'
                : '70% of stimuli trigger a GO tap, priming prepotent motor actions. When a skull appears, your right inferior frontal gyrus must slam the motor brake instantly.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Démarrer le test réflexe' : language === 'zh' ? '开始刹车测试 (20轮)' : 'Start Reflex Run (20 Trials)'}</span>
          </button>
        </div>
      )}

      {gameState === 'running' && (
        <div className="space-y-6 py-2">
          {/* Telemetry Bar */}
          <div className="flex items-center justify-around p-3 rounded-2xl bg-stone-900/60 border border-white/5 font-mono text-xs">
            <div>
              <span className="text-[10px] text-text-secondary dark:text-stone-400 uppercase block">SCORE</span>
              <span className="text-base font-bold text-amber-400">{score}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-secondary dark:text-stone-400 uppercase block">STOPS</span>
              <span className="text-base font-bold text-emerald-400">{successfulStops}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-secondary dark:text-stone-400 uppercase block">FALSE ALARMS</span>
              <span className="text-base font-bold text-red-400">{commissionErrors}</span>
            </div>
          </div>

          {/* Stimulus Flash Stage */}
          <div
            onClick={handleActionTap}
            className="cursor-pointer py-12 sm:py-16 rounded-3xl bg-stone-900/80 border border-white/10 shadow-2xl flex flex-col items-center justify-center select-none active:scale-95 transition-all min-h-[200px]"
          >
            {stimulusVisible && currentStimulus ? (
              <div className="text-center space-y-2 animate-scaleIn">
                <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-3xl sm:text-5xl font-mono font-black">
                  <span className="text-stone-500 opacity-60 text-2xl sm:text-4xl">
                    {currentStimulus.flankers}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-2xl shadow-lg border ${
                      currentStimulus.type === 'go'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                        : 'bg-red-500/30 text-red-400 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.6)] animate-pulse'
                    }`}
                  >
                    {currentStimulus.centerSymbol}
                  </span>
                  <span className="text-stone-500 opacity-60 text-2xl sm:text-4xl">
                    {currentStimulus.flankers}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-stone-400 block pt-2">
                  {currentStimulus.type === 'go'
                    ? language === 'fr' ? '>> GO ! TOUCHEZ ! <<' : language === 'zh' ? '>> 击发！立即触屏 <<' : '>> GO! TAP ANYWHERE! <<'
                    : language === 'fr' ? '!! STOP ! NE TOUCHEZ PAS ! !!' : language === 'zh' ? '!! 刹车！绝对不要碰屏幕 !!' : '!! STOP! FREEZE HAND! !!'}
                </span>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-stone-600 flex items-center justify-center text-stone-500 font-mono text-xs">
                +
              </div>
            )}
          </div>

          {/* Feedback Label */}
          {feedbackText && (
            <div className="text-center font-mono text-xs text-amber-300 font-bold animate-fadeIn">
              {feedbackText}
            </div>
          )}

          {/* Mobile Tap Target Button */}
          <div className="text-center pt-2">
            <button
              onClick={handleActionTap}
              className="w-full py-4 rounded-2xl bg-amber-500 text-stone-950 font-black text-sm tracking-wider shadow-lg active:scale-95 transition-all"
            >
              {language === 'fr' ? 'ACTIONNER (OU TOUCHER L’ÉCRAN)' : language === 'zh' ? '触控动作按键 (击发)' : 'TAP ACTION (OR SCREEN)'}
            </button>
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
              {language === 'fr' ? 'Indice de Contrôle Moteur' : language === 'zh' ? '神经动作抑制与刹车评级' : 'Motor Response Inhibition Scorecard'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {commissionErrors <= 1
                ? language === 'fr'
                  ? 'Contrôle moteur impeccable. Votre capacité de freinage d’urgence empêche les faux pas et signatures précipitées.'
                  : language === 'zh'
                  ? '极其精纯的动作刹车制动力！在高速前冲预激下依然能稳如磐石避开红线，绝不会在谈判桌上冲动失守。'
                  : 'Masterful motor inhibition. Your neural braking mechanism prevents impulsive slip-ups and unforced verbal errors.'
                : language === 'fr'
                ? 'Bonne réactivité mais attention aux faux départs. Renforcez le délai de confirmation préfrontal.'
                : language === 'zh'
                ? '动作反应敏捷，但存在偶发误触。在做高风险决断前建议保持“200毫秒微定力”。'
                : 'High motor speed with occasional false triggers. Condition a 200ms prefrontal confirmation buffer.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL SCORE</span>
              <span className="text-lg font-bold text-amber-400">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">PERFECT STOPS</span>
              <span className="text-lg font-bold text-emerald-400">{successfulStops}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FALSE ALARMS</span>
              <span className="text-lg font-bold text-red-400">{commissionErrors}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={startGame}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Recommencer' : language === 'zh' ? '再次测验' : 'Retry'}</span>
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
