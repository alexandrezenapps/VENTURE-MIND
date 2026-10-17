import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  Brain,
  Feather,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MindfulPauseWidget: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, speak } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0); // 0: Inhale, 1: Hold, 2: Exhale, 3: Peace
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const phases = [
    {
      label: { en: 'Inhale Clarity', fr: 'Inspirer la Clarté', zh: '吸气 · 澄澈心神' },
      hint: { en: 'Breathe in steady resolve (4s)', fr: 'Respirez posément (4s)', zh: '平稳吸气，接纳当下的定力 (4秒)' },
      color: 'from-emerald-400 via-teal-300 to-cyan-400',
      glow: 'shadow-emerald-500/30',
    },
    {
      label: { en: 'Hold Ground', fr: 'Suspendre le Souffle', zh: '屏息 · 守固底线' },
      hint: { en: 'Center in stillness before replying (4s)', fr: 'Suspendez le souffle avec sang-froid (4s)', zh: '静止守神，消退肾上腺素冲动 (4秒)' },
      color: 'from-amber-400 via-yellow-300 to-orange-400',
      glow: 'shadow-amber-500/30',
    },
    {
      label: { en: 'Exhale Tension', fr: 'Expirer la Tension', zh: '呼气 · 释放对抗' },
      hint: { en: 'Release defensive adrenaline (4s)', fr: 'Relâchez toute crispation défensive (4s)', zh: '舒缓吐气，化解防卫性抗拒 (4秒)' },
      color: 'from-purple-400 via-indigo-300 to-violet-400',
      glow: 'shadow-purple-500/30',
    },
    {
      label: { en: 'Sovereign Calm', fr: 'Calme Souverain', zh: '从容 · 战略从容' },
      hint: { en: 'Observe without emotional reaction (4s)', fr: 'Observez sans réactivité impulsive (4s)', zh: '心如止水，以客观事实启口 (4秒)' },
      color: 'from-rose-400 via-pink-300 to-amber-300',
      glow: 'shadow-rose-500/30',
    },
  ];

  const currentPhase = phases[phaseIndex];

  // Breath cycle timer (4 seconds per phase)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setPhaseIndex((p) => {
              const nextP = (p + 1) % 4;
              if (nextP === 0) {
                setCyclesCompleted((c) => c + 1);
              }
              return nextP;
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleBreath = () => {
    if (!isActive) {
      setSecondsLeft(4);
      setPhaseIndex(0);
    }
    setIsActive((prev) => !prev);
  };

  const mindfulQuotes = {
    en: '“Between stimulus and response there is a space. In that space is our power to choose our response.”',
    fr: '« Entre le stimulus et la réponse, il y a un espace. Dans cet espace réside notre pouvoir de choisir. »',
    zh: '“在刺激与回应之间存在一个空间。在那个空间里，蕴藏着我们选择回应的力量与自由。”',
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-5 md:p-7 bg-gradient-to-br from-stone-900 via-stone-900 to-indigo-950 border border-white/10 dark:border-white/5 text-white shadow-xl">
      {/* Radiant Background Blur */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Philosophy & Guidance */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 border border-white/10 text-[11px] font-mono tracking-wider uppercase text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {language === 'fr'
                ? 'Mindfulness Exécutive & Respiration 4x4'
                : language === 'zh'
                ? '正念静心 · 4秒战术箱式呼吸'
                : 'Executive Mindfulness & Tactical Pause'}
            </span>
          </div>

          <h3 className="fluid-heading-2 font-serif-luxury italic font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-stone-100 to-purple-200">
            {language === 'fr'
              ? 'Le Sanctuaire du Calme Avant l’Offre'
              : language === 'zh'
              ? '谈判交锋前的正念定力之境'
              : 'The Mindful Sovereignty Chamber'}
          </h3>

          <p className="fluid-body-sm text-stone-300 max-w-md italic leading-relaxed">
            {mindfulQuotes[language]}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-[11px] font-mono text-stone-400">
            <span>
              {language === 'fr' ? 'Cycles complétés :' : language === 'zh' ? '已完成周期：' : 'Cycles Done:'}{' '}
              <strong className="text-amber-300">{cyclesCompleted}</strong>
            </span>
            <span>•</span>
            <span className="text-emerald-300">
              {language === 'fr' ? 'Pouls stabilisé' : language === 'zh' ? '脉搏平缓' : 'Vagal Nerve Calmed'}
            </span>
          </div>
        </div>

        {/* Center / Right: Glowing Breathing Sphere Widget */}
        <div className="flex flex-col items-center space-y-3 shrink-0">
          <div className="relative flex items-center justify-center w-32 sm:w-36 h-32 sm:h-36">
            {/* Outer Pulsing Aura */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${currentPhase.color} opacity-20 blur-xl transition-all duration-1000 ${
                isActive ? 'scale-125' : 'scale-100'
              }`}
            />

            {/* Breathing Ring */}
            <div
              className={`w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gradient-to-br from-stone-900 to-stone-950 border-2 border-white/20 flex flex-col items-center justify-center transition-all duration-700 shadow-2xl ${
                isActive ? 'scale-110 border-amber-400/60' : 'scale-100'
              }`}
            >
              <div className="fluid-stat font-bold font-mono text-amber-200">
                {isActive ? `${secondsLeft}s` : '4s'}
              </div>
              <div className="fluid-stat-label text-stone-400 text-center px-1">
                {isActive ? currentPhase.label[language] : 'Paused'}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleBreath}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-900/30 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-stone-950" />}
              <span>
                {isActive
                  ? language === 'fr'
                    ? 'Suspendre'
                    : language === 'zh'
                    ? '暂停正念'
                    : 'Pause'
                  : language === 'fr'
                  ? 'Commencer l’Apaisement'
                  : language === 'zh'
                  ? '开启正念呼吸'
                  : 'Begin Tactical Pause'}
              </span>
            </button>

            {cyclesCompleted > 0 && (
              <button
                onClick={() => {
                  setIsActive(false);
                  setCyclesCompleted(0);
                  setSecondsLeft(4);
                  setPhaseIndex(0);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 text-xs"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
