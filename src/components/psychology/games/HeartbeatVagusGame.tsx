import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, HeartPulse, Activity, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface HeartbeatVagusGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

const CRISIS_PROMPTS = [
  { en: 'CRISIS ALERT: Lead partner demands 35% discount or deal collapses in 1 hour!', fr: 'ALERTE CRISE : L’investisseur exige 35 % de décote immédiate !', zh: '突发高压危机：领投合伙人突袭压价35%，扬言一小时内不签即全面撤资！' },
  { en: 'BOARD SHOCK: Key competitor announced massive $100M fundraise!', fr: 'CHOC : Votre concurrent direct annonce un tour de 100 M$ !', zh: '赛道巨震：主要竞品刚刚官宣完成1亿美元巨额战略融资并开始挖角！' },
  { en: 'AUDIT PANIC: Due diligence red flag found on legacy employee IP assignment!', fr: 'PANSIQUE AUDIT : Alerte de conformité PI levée lors de l’audit juridique !', zh: '法务红线：律所在老员工离职知识产权转让协议中挑出重大历史合规瑕疵！' },
];

export const HeartbeatVagusGame: React.FC<HeartbeatVagusGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [bpm, setBpm] = useState(132);
  const [coherenceScore, setCoherenceScore] = useState(35);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [targetPulseActive, setTargetPulseActive] = useState(false);
  const [currentCrisis, setCurrentCrisis] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0);
  const [harmonicHits, setHarmonicHits] = useState(0);

  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 6-second resonant coherent cycle (4s in, 6s out)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const runBreathCycle = () => {
      setBreathPhase('inhale');
      setTimeout(() => {
        if (gameState !== 'playing') return;
        setBreathPhase('exhale');
        setTargetPulseActive(true);
        setTimeout(() => setTargetPulseActive(false), 1200);
      }, 3000);
    };

    runBreathCycle();
    const interval = setInterval(runBreathCycle, 6000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Game clock and stress decay
  useEffect(() => {
    let clock: NodeJS.Timeout;
    if (gameState === 'playing') {
      clock = setInterval(() => {
        setElapsedSeconds((s) => s + 1);

        // Random stress spike every 14 seconds
        if (Math.random() < 0.15) {
          setCurrentCrisis((c) => (c + 1) % CRISIS_PROMPTS.length);
        }
      }, 1000);
    }
    return () => clearInterval(clock);
  }, [gameState]);

  // Check victory condition: Drop BPM to <= 65 and Coherence >= 90%
  useEffect(() => {
    if (gameState === 'playing' && bpm <= 65 && coherenceScore >= 88) {
      setGameState('ended');
      if (!isAudioMuted) playGameVictoryFanfare();
    }
  }, [bpm, coherenceScore, gameState, isAudioMuted]);

  const startGame = () => {
    setBpm(132);
    setCoherenceScore(35);
    setElapsedSeconds(0);
    setTotalTaps(0);
    setHarmonicHits(0);
    setCurrentCrisis(0);
    setGameState('playing');
    if (!isAudioMuted) playPsychPulse(320, 0.4);
  };

  const handleRhythmTap = () => {
    if (gameState !== 'playing') return;

    setTotalTaps((t) => t + 1);

    if (targetPulseActive) {
      // Coherent hit on the exhalation peak!
      setHarmonicHits((h) => h + 1);
      setBpm((b) => Math.max(62, b - 4));
      setCoherenceScore((c) => Math.min(100, c + 5));
      if (!isAudioMuted) playPsychPulse(432, 0.3);
    } else {
      // Out of sync tap
      setCoherenceScore((c) => Math.max(20, c - 3));
      setBpm((b) => Math.min(145, b + 2));
      if (!isAudioMuted) playSubtleClick();
    }
  };

  const finalScore = Math.max(100, Math.round(coherenceScore * 5 + Math.max(0, 80 - elapsedSeconds) * 4));

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-emerald-500/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
            {language === 'fr' ? 'Cohérence Vagale & HRV' : language === 'zh' ? '多重迷走神经抗压调谐' : 'Vagus Nerve Bio-Coherence'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Régulation Cardiaque Sous Choc' : language === 'zh' ? '高压心跳平复心流战术' : 'Autonomic Stress Down-Regulation'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-surface-muted dark:bg-stone-800/80 border border-border-main dark:border-stone-700 text-xs font-mono">
            <HeartPulse className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className={bpm > 90 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {bpm} BPM
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
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? 'Objectif : Ramenez votre pouls de 132 à 65 BPM'
                : language === 'zh'
                ? '挑战目标：在突发危机冲击下将心率从132平复至65 BPM'
                : 'Mission: Lower Heart Rate from 132 to 65 BPM via Vagus Breathing'}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'Une crise simulée a fait bondir votre rythme cardiaque. Inspirez lorsque l’orbe s’étend, expirez lorsqu’il rétrécit et touchez en rythme pour activer le nerf vague.'
                : language === 'zh'
                ? '突发极限谈判重创导致心率狂飙。跟随中央金色光环舒缓吐纳（吸气充盈，呼气收缩），在呼气脉冲波峰精准轻触屏幕，启动副交感神经制动。'
                : 'A simulated negotiation shock spiked your pulse. Inhale as the mandala expands, exhale as it recedes, and tap on resonance peaks to trigger parasympathetic braking.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Démarrer la régulation' : language === 'zh' ? '开始迷走神经调谐' : 'Begin Bio-Regulation'}</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6 py-2">
          {/* Active Crisis Banner */}
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs flex items-center space-x-3">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
            <p className="text-red-200 text-[11px] leading-tight">
              {CRISIS_PROMPTS[currentCrisis][language]}
            </p>
          </div>

          {/* Bio-Resonance Breathing Orb & Tap Stage */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div
              onClick={handleRhythmTap}
              className={`relative cursor-pointer transition-all duration-1000 flex items-center justify-center rounded-full select-none active:scale-95 ${
                breathPhase === 'inhale'
                  ? 'w-44 h-44 sm:w-56 sm:h-56 bg-gradient-to-br from-emerald-500/25 via-teal-500/15 to-transparent border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
                  : 'w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-emerald-950/40 to-stone-900 border border-emerald-500/40'
              }`}
            >
              {/* Inner Heart Core */}
              <div className="text-center space-y-1">
                <HeartPulse
                  className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto transition-transform ${
                    targetPulseActive ? 'text-emerald-300 scale-125 animate-pulse' : 'text-emerald-500'
                  }`}
                />
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300 font-bold block">
                  {breathPhase === 'inhale'
                    ? language === 'fr' ? 'INSPIRER' : language === 'zh' ? '吸 气' : 'INHALE'
                    : language === 'fr' ? 'EXPIRER & TOUCHER' : language === 'zh' ? '呼气 · 触击' : 'EXHALE & TAP'}
                </span>
                <span className="text-[10px] text-stone-400 font-mono block">
                  {bpm} BPM
                </span>
              </div>

              {/* Pulsing Target Halo */}
              {targetPulseActive && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping pointer-events-none" />
              )}
            </div>
            <p className="mt-4 text-xs font-mono text-emerald-400">
              {targetPulseActive
                ? language === 'fr' ? '>> POINT DE RÉSONANCE ! TOUCHEZ ! <<' : language === 'zh' ? '>> 谐振波峰！立即轻触光环 <<' : '>> HARMONIC PEAK! TAP NOW! <<'
                : language === 'fr' ? 'Attendez la phase d’expiration...' : language === 'zh' ? '缓慢深吸气，感受腹式充盈...' : 'Slowly inhale, expand diaphragm...'}
            </p>
          </div>

          {/* Coherence & HRV Meters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">{language === 'fr' ? 'Cohérence Vague' : language === 'zh' ? '副交感协同率' : 'Vagus Coherence'}</span>
                <span className="text-emerald-400 font-bold">{coherenceScore}%</span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${coherenceScore}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">{language === 'fr' ? 'Harmonie Rythmique' : language === 'zh' ? '同频命中率' : 'Harmonic Hits'}</span>
                <span className="text-teal-400 font-bold">{totalTaps ? Math.round((harmonicHits / totalTaps) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full transition-all duration-300"
                  style={{ width: `${totalTaps ? (harmonicHits / totalTaps) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'État de Sang-Froid Rétabli' : language === 'zh' ? '临危不乱心理定力评级' : 'Sovereign Composure Attained'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {language === 'fr'
                ? 'Félicitations. Vous avez neutralisé le pic de panique de l’amygdale en moins de 60 secondes et stabilisé votre variabilité cardiaque.'
                : language === 'zh'
                ? '极高层次的情绪自主调谐！在极限危机刺激下，凭借呼吸节律成功切断了杏仁核的恐慌回路，将大脑主控权平稳交回前额叶。'
                : 'Elite autonomic regulation. You successfully bypassed amygdala panic and restored dorsolateral strategic control.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL BPM</span>
              <span className="text-lg font-bold text-emerald-400">{bpm} BPM</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">TIME TO CALM</span>
              <span className="text-lg font-bold text-teal-400">{elapsedSeconds}s</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">SCORE</span>
              <span className="text-lg font-bold text-amber-400">{finalScore}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={startGame}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Recommencer' : language === 'zh' ? '再次调谐' : 'Retry'}</span>
            </button>
            <button
              onClick={() => onFinish(finalScore)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-emerald-500 text-stone-950 font-bold text-xs shadow-md hover:brightness-110 transition-all"
            >
              <span>{language === 'fr' ? 'Enregistrer & Quitter' : language === 'zh' ? '保存得分并退出' : 'Save & Close'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
