import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  CheckCircle2,
  Award,
  Layers,
  Sliders,
  Wind,
  Bell,
  Music,
  Flame,
  ArrowRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  playTibetanSingingBowl,
  startAmbientDrone,
  stopAmbientDrone,
  startZenStream,
  stopZenStream,
} from '../../utils/soundscapes';

type ProtocolId = 'box' | 'vagal' | 'coherent' | 'silence';

interface BreathingProtocol {
  id: ProtocolId;
  name: { en: string; fr: string; zh: string };
  subtitle: { en: string; fr: string; zh: string };
  bestFor: { en: string; fr: string; zh: string };
  phases: {
    name: { en: string; fr: string; zh: string };
    duration: number; // in seconds
    instruction: { en: string; fr: string; zh: string };
    color: string;
    borderGlow: string;
  }[];
}

const PROTOCOLS: BreathingProtocol[] = [
  {
    id: 'box',
    name: { en: 'Tactical Box 4×4', fr: 'Respiration Carrée 4×4', zh: '箱式战术呼吸 4×4' },
    subtitle: { en: 'Navy SEAL & High-Stakes Pitch Protocol', fr: 'Protocole de Sang-Froid Exécutif', zh: '特种定力 · 投决会与谈判前镇定' },
    bestFor: { en: 'Eliminate adrenaline tremors before meeting VCs or presenting term sheets.', fr: 'Neutralise le tremblement d’adrénaline avant de négocier.', zh: '彻底消除进场谈判前的心跳加速与应激反应。' },
    phases: [
      {
        name: { en: 'Inhale Clarity', fr: 'Inspirer la Clarté', zh: '吸气 · 充盈澄澈' },
        duration: 4,
        instruction: { en: 'Deep nasal inhale, expanding the diaphragm with calm resolve.', fr: 'Inspiration nasale lente, expansion du diaphragme.', zh: '深缓鼻吸，横膈膜饱满扩张，收摄定力。' },
        color: 'from-emerald-400 via-teal-300 to-cyan-400',
        borderGlow: 'border-emerald-400 shadow-emerald-500/40',
      },
      {
        name: { en: 'Hold Ground', fr: 'Suspension Calme', zh: '屏息 · 守正固本' },
        duration: 4,
        instruction: { en: 'Remain poised in stillness. Do not rush to fill the silence.', fr: 'Suspension immobile. Domptez l’urgence de parler.', zh: '心止如水，守住中枢，不因静默而慌乱。' },
        color: 'from-amber-400 via-yellow-300 to-amber-500',
        borderGlow: 'border-amber-400 shadow-amber-500/40',
      },
      {
        name: { en: 'Exhale Defense', fr: 'Expirer la Tension', zh: '呼气 · 释放对抗' },
        duration: 4,
        instruction: { en: 'Smoothly release tension. Dissolve defensive ego and fear of refusal.', fr: 'Expiration douce. Relâchez l’ego défensif et la peur.', zh: '舒缓吐气，彻底放下防御姿态与被拒恐惧。' },
        color: 'from-violet-400 via-purple-300 to-indigo-400',
        borderGlow: 'border-violet-400 shadow-violet-500/40',
      },
      {
        name: { en: 'Sovereign Pause', fr: 'Vide Souverain', zh: '空歇 · 战略从容' },
        duration: 4,
        instruction: { en: 'Rest in pure awareness. Ground in your BATNA and objective facts.', fr: 'Pause à vide. Ancrez-vous dans votre BATNA et les faits.', zh: '空腹静观，回归客观底牌，从容应变。' },
        color: 'from-rose-400 via-pink-300 to-amber-300',
        borderGlow: 'border-rose-400 shadow-rose-500/40',
      },
    ],
  },
  {
    id: 'vagal',
    name: { en: '4-7-8 Vagal Grounding', fr: 'Apaisement Vagal 4-7-8', zh: '4-7-8 迷走神经深度降压' },
    subtitle: { en: 'Emergency Acute Anxiety & Down-Round Reset', fr: 'Décharge du Stress & Choc de Valorisation', zh: '应激急救 · 遭遇极限施压或估值暴跌时重置' },
    bestFor: { en: 'Deep parasympathetic reset when receiving aggressive redlines or intimidating terms.', fr: 'Réinitialise le système nerveux face aux clauses agressives.', zh: '当投资人抛出苛刻压价或霸王条款时，迅速重置神经系统。' },
    phases: [
      {
        name: { en: 'Inhale Focus', fr: 'Inspiration (4s)', zh: '深吸 (4秒)' },
        duration: 4,
        instruction: { en: 'Quiet inhale through nose.', fr: 'Inspiration nasale paisible.', zh: '静缓鼻吸，接纳当下。' },
        color: 'from-teal-400 via-emerald-300 to-cyan-300',
        borderGlow: 'border-teal-400 shadow-teal-500/40',
      },
      {
        name: { en: 'Deep Hold', fr: 'Rétention Profonde (7s)', zh: '深沉屏息 (7秒)' },
        duration: 7,
        instruction: { en: 'Oxygenate brain tissue. Lower cardiac sympathetic tone.', fr: 'Oxygénation cérébrale. Abaissement du rythme cardiaque.', zh: '大脑组织充分供氧，强制降低心交感神经过载。' },
        color: 'from-amber-400 via-orange-300 to-yellow-400',
        borderGlow: 'border-amber-400 shadow-amber-500/40',
      },
      {
        name: { en: 'Audible Release', fr: 'Expiration Complète (8s)', zh: '彻底吐气 (8秒)' },
        duration: 8,
        instruction: { en: 'Slow, complete mouth exhalation. Expel all manufactured urgency.', fr: 'Expiration lente et totale. Évacuez toute urgence artificielle.', zh: '经口绵长轻吐，排空所有被对方人为制造的紧迫感。' },
        color: 'from-purple-500 via-indigo-400 to-sky-400',
        borderGlow: 'border-purple-400 shadow-purple-500/40',
      },
    ],
  },
  {
    id: 'coherent',
    name: { en: 'Heart-Brain Coherence', fr: 'Cohérence Cœur-Cerveau', zh: '身心共振 · 5.5秒心脑同步' },
    subtitle: { en: 'Optimal Heart Rate Variability (HRV) for Strategy', fr: 'Rythme Optimal pour les Décisions Stratégiques', zh: '6次/分钟谐振 · 进入最佳战略决策脑电波' },
    bestFor: { en: 'Synchronizes intuition and financial logic for maximum charisma and analytical focus.', fr: 'Synchronise intuition et rigueur analytique.', zh: '将商业直觉与金融逻辑深度协同，维持高维决策清醒度。' },
    phases: [
      {
        name: { en: 'Rise (Inhale)', fr: 'Élévation (5.5s)', zh: '升 · 稳健吸气 (5.5秒)' },
        duration: 5.5,
        instruction: { en: 'Inhale steadily for 5.5 seconds.', fr: 'Inspiration fluide pendant 5,5s.', zh: '匀速吸气5.5秒，心率自然柔和上升。' },
        color: 'from-blue-400 via-indigo-300 to-purple-400',
        borderGlow: 'border-blue-400 shadow-blue-500/40',
      },
      {
        name: { en: 'Ease (Exhale)', fr: 'Apaisement (5.5s)', zh: '降 · 舒缓呼气 (5.5秒)' },
        duration: 5.5,
        instruction: { en: 'Exhale smoothly for 5.5 seconds.', fr: 'Expiration fluide pendant 5,5s.', zh: '匀速呼气5.5秒，心率自然柔和平缓回落。' },
        color: 'from-emerald-400 via-teal-300 to-amber-300',
        borderGlow: 'border-emerald-400 shadow-emerald-500/40',
      },
    ],
  },
];

const STOIC_DEAL_WISDOM = [
  {
    author: 'Marcus Aurelius',
    role: { en: 'Roman Emperor & Stoic Philosopher', fr: 'Empereur romain & philosophe', zh: '古罗马皇帝 · 斯多葛哲学家' },
    quote: {
      en: '“You have power over your mind - not outside events. Realize this, and you will find strength.”',
      fr: '« Tu as pouvoir sur ton esprit, non sur les événements extérieurs. Comprends cela, et tu trouveras ta force. »',
      zh: '“你拥有掌控自己心灵的力量，而非外在事件。领悟这一点，你便将获得真正的力量。”',
    },
    takeaway: {
      en: 'In venture deals, market sentiment and VC mood swings are outside events; your valuation boundary and poise are entirely within your domain.',
      fr: 'Les humeurs des fonds sont extérieures ; votre calme et votre seuil de refus vous appartiennent totalement.',
      zh: '投资机构的瞬息万变与市场情绪是外部风浪；你的底线坚守与临危不乱，才是属于你的领地。',
    },
  },
  {
    author: 'Daniel Kahneman',
    role: { en: 'Nobel Laureate in Behavioral Economics', fr: 'Prix Nobel d’économie comportementale', zh: '诺贝尔经济学奖得主 · 行为经济学先驱' },
    quote: {
      en: '“A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.”',
      fr: '« Répéter souvent une idée la rend familière, et l’esprit confond aisément la familiarité avec la vérité. »',
      zh: '“让人轻信谎言的最有效方式就是不断重复，因为大脑很难将‘熟悉感’与‘真实性’区分开来。”',
    },
    takeaway: {
      en: 'Notice when investors repeatedly state “this clause is standard market standard everywhere.” Pause, examine statute, and verify independently.',
      fr: 'Méfiez-vous quand un VC répète « c’est le standard du marché ». Vérifiez toujours calmement avec votre propre conseil.',
      zh: '警惕投资人反复声称“这种清算优先权全行业都这样签”。深呼吸，独立查核法定标准与真实市场数据。',
    },
  },
  {
    author: 'Charlie Munger',
    role: { en: 'Vice Chairman, Berkshire Hathaway', fr: 'Vice-président de Berkshire Hathaway', zh: '伯克希尔·哈撒韦副主席 · 投资大师' },
    quote: {
      en: '“The big money is not in the buying and the selling, but in the waiting.”',
      fr: '« Le grand argent ne réside pas dans l’achat ou la vente, mais dans la patience d’attendre. »',
      zh: '“赚大钱的关键不在于频繁买入或卖出，而在于耐心地等待时机。”',
    },
    takeaway: {
      en: 'Never rush into an unfavorable term sheet simply because you are tired of the roadshow. Cultivate the composure to wait for your genuine partner.',
      fr: 'Ne signez jamais un mauvais term sheet par simple épuisement du roadshow. Sachez attendre le bon partenaire.',
      zh: '切莫因为路演身心疲惫就草率签署带毒意向书。培育定力，等待真正有长远格局的伙伴。',
    },
  },
  {
    author: 'Sun Tzu',
    role: { en: 'The Art of War', fr: 'L’Art de la Guerre', zh: '《孙子兵法》' },
    quote: {
      en: '“In the midst of chaos, there is also opportunity. The supreme art of war is to subdue the enemy without fighting.”',
      fr: '« Au milieu du chaos se trouve l’opportunité. Le plus grand art est de vaincre sans combattre. »',
      zh: '“乱生于治，怯生于勇，弱生于强。不战而屈人之兵，善之善者也。”',
    },
    takeaway: {
      en: 'True negotiation mastery is not out-shouting or out-bluffing the partner; it is aligning economic incentives so clearly that conflict evaporates.',
      fr: 'La vraie négociation n’est pas l’affrontement d’egos, mais l’alignement parfait des intérêts économiques.',
      zh: '最高境界的谈判并非拍桌博弈或虚张声势，而是以精密无暇的利益共赢机制，化解对立于无形。',
    },
  },
];

export const MindfulnessSanctuaryView: React.FC = () => {
  const { language, speak, recordMindfulnessSession } = useApp();

  // Active protocol & timer state
  const [selectedProtocolId, setSelectedProtocolId] = useState<ProtocolId>('box');
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalSecondsBreathed, setTotalSecondsBreathed] = useState(0);

  // Audio toggles
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [droneEnabled, setDroneEnabled] = useState(false);
  const [streamEnabled, setStreamEnabled] = useState(false);

  // Wisdom carousel
  const [wisdomIndex, setWisdomIndex] = useState(0);

  // Pre-Deal Composure Diagnostic Checklist
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    egoCheck: true,
    fomoImmunity: false,
    batnaClarity: true,
    sunkCostFree: false,
    bodyRelaxed: true,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeProtocol = PROTOCOLS.find((p) => p.id === selectedProtocolId) || PROTOCOLS[0];
  const currentPhase = activeProtocol.phases[phaseIndex] || activeProtocol.phases[0];

  // Switch protocol handler
  const handleSelectProtocol = (id: ProtocolId) => {
    setSelectedProtocolId(id);
    setIsActive(false);
    setPhaseIndex(0);
    const p = PROTOCOLS.find((item) => item.id === id) || PROTOCOLS[0];
    setSecondsRemaining(p.phases[0].duration);
  };

  // Soundscape toggles
  const handleToggleDrone = () => {
    if (droneEnabled) {
      stopAmbientDrone();
      setDroneEnabled(false);
    } else {
      startAmbientDrone(0.18);
      setDroneEnabled(true);
    }
  };

  const handleToggleStream = () => {
    if (streamEnabled) {
      stopZenStream();
      setStreamEnabled(false);
    } else {
      startZenStream(0.08);
      setStreamEnabled(true);
    }
  };

  // Cleanup ambient audio on unmount
  useEffect(() => {
    return () => {
      stopAmbientDrone();
      stopZenStream();
    };
  }, []);

  // Main breathing interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setTotalSecondsBreathed((prev) => prev + 1);
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Phase transition
            setPhaseIndex((currIdx) => {
              const nextIdx = (currIdx + 1) % activeProtocol.phases.length;
              if (nextIdx === 0) {
                setCyclesCompleted((c) => {
                  const newCount = c + 1;
                  // Award session progress every 3 cycles
                  if (newCount % 3 === 0) {
                    recordMindfulnessSession(1);
                  }
                  return newCount;
                });
              }
              if (chimeEnabled) {
                playTibetanSingingBowl(324 + nextIdx * 28, 3.8);
              }
              return nextIdx;
            });
            return activeProtocol.phases[(phaseIndex + 1) % activeProtocol.phases.length]?.duration || 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phaseIndex, activeProtocol, chimeEnabled, recordMindfulnessSession]);

  // Sacred Generative Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Pulse factor calculated from phase & seconds
      const maxDuration = currentPhase.duration;
      const progress = 1 - secondsRemaining / maxDuration;
      let breathScale = 1;
      if (currentPhase.name.en.toLowerCase().includes('inhale')) {
        breathScale = 0.75 + progress * 0.45;
      } else if (currentPhase.name.en.toLowerCase().includes('hold')) {
        breathScale = 1.2;
      } else if (currentPhase.name.en.toLowerCase().includes('exhale')) {
        breathScale = 1.2 - progress * 0.45;
      } else {
        breathScale = 0.75;
      }

      // Draw subtle luminous concentric rings
      const ringCount = 5;
      for (let i = 1; i <= ringCount; i++) {
        const radius = (width * 0.16 + i * 20) * breathScale;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(212, 175, 55, 0.18)' : 'rgba(168, 85, 247, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw rotating sacred lotus geometry petals
      const petalCount = 8;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      for (let p = 0; p < petalCount; p++) {
        const rad = (Math.PI * 2 * p) / petalCount;
        ctx.beginPath();
        const dist = 55 * breathScale;
        const px = Math.cos(rad) * dist;
        const py = Math.sin(rad) * dist;
        ctx.arc(px, py, 32 * breathScale, 0, Math.PI * 2);
        ctx.fillStyle = p % 2 === 0 ? 'rgba(212, 175, 55, 0.08)' : 'rgba(147, 51, 234, 0.08)';
        ctx.fill();
        ctx.strokeStyle = p % 2 === 0 ? 'rgba(245, 158, 11, 0.35)' : 'rgba(192, 132, 252, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      angle += isActive ? 0.006 : 0.002;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isActive, currentPhase, secondsRemaining]);

  // Composure score calculation
  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const composureScore = Math.round((checkedCount / 5) * 100);

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentWisdom = STOIC_DEAL_WISDOM[wisdomIndex];

  return (
    <div className="space-y-6 sm:space-y-8 pb-28 max-w-6xl mx-auto px-1 sm:px-2">
      {/* ========================================================
          1. Hero: Executive Mindfulness Sanctuary
          ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-br from-stone-950 via-purple-950/70 to-stone-900 border border-amber-500/20 text-white shadow-2xl">
        {/* Artistic glowing radial meshes */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3.5 text-center lg:text-left flex-1">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-amber-500/20 to-emerald-500/20 border border-amber-400/30 text-xs font-mono tracking-wider uppercase text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'fr'
                  ? 'Sanctuaire Exécutif de Pleine Conscience'
                  : language === 'zh'
                  ? '创投正念殿堂 · 战略定力之境'
                  : 'Executive Mindfulness Sanctuary'}
              </span>
            </div>

            <h1 className="fluid-display-hero font-serif-luxury italic font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-purple-200">
              {language === 'fr'
                ? 'Le Calme Avant l’Offre'
                : language === 'zh'
                ? '定而后能静，静而后能安'
                : 'Sovereign Composure in the Deal Room'}
            </h1>

            <p className="fluid-body text-stone-300 max-w-2xl leading-relaxed">
              {language === 'fr'
                ? 'Maîtrisez votre état neuro-végétatif avant de pénétrer dans le conseil ou la salle de négociation. Dissolvez le FOMO artificiel, désamorcez l’adrénaline et ancrez vos décisions dans la clarté pure de votre BATNA.'
                : language === 'zh'
                ? '在踏入投决会或意向书博弈前，调适自主神经亢奋。平息人为制造的紧迫FOMO，卸除防御应激，以从容的战略定力坚守底牌与核心条款。'
                : 'Master your autonomic nervous system before stepping into boardrooms or negotiating term sheets. Dissolve manufactured FOMO, quiet the adrenaline rush, and anchor in objective clarity.'}
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-stone-300">
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>
                  {language === 'fr' ? 'Temps de présence :' : language === 'zh' ? '正念时长：' : 'Mindful Time:'}{' '}
                  <strong className="text-amber-300 font-bold">{Math.floor(totalSecondsBreathed / 60)}m {totalSecondsBreathed % 60}s</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {language === 'fr' ? 'Cycles validés :' : language === 'zh' ? '完成周期：' : 'Cycles Done:'}{' '}
                  <strong className="text-emerald-300 font-bold">{cyclesCompleted}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>
                  {language === 'fr' ? 'Indice de Sang-froid :' : language === 'zh' ? '临危定力指数：' : 'Composure:'}{' '}
                  <strong className="text-purple-300 font-bold">{composureScore}%</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Soundscape Ambient Console */}
          <div className="shrink-0 p-4 rounded-2xl bg-stone-900/80 border border-white/10 backdrop-blur-xl flex flex-col space-y-2.5 w-full sm:w-auto">
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 flex items-center space-x-1.5">
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'fr' ? 'Paysages Sonores WebAudio' : language === 'zh' ? '正念声学共鸣' : 'Zen Acoustics'}</span>
            </div>
            
            <div className="flex flex-wrap sm:flex-col gap-2">
              <button
                onClick={() => setChimeEnabled(!chimeEnabled)}
                className={`flex-1 sm:w-44 py-2 px-3 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                  chimeEnabled
                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-xs'
                    : 'bg-white/5 border-white/5 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Bell className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Bol Tibétain' : language === 'zh' ? '颂钵清鸣' : 'Tibetan Bowl'}</span>
                </span>
                <span className="font-mono text-[10px]">{chimeEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={handleToggleDrone}
                className={`flex-1 sm:w-44 py-2 px-3 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                  droneEnabled
                    ? 'bg-purple-500/20 border-purple-400/50 text-purple-300 shadow-xs'
                    : 'bg-white/5 border-white/5 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Onde 432 Hz' : language === 'zh' ? '432Hz 舒曼波' : '432Hz Drone'}</span>
                </span>
                <span className="font-mono text-[10px]">{droneEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={handleToggleStream}
                className={`flex-1 sm:w-44 py-2 px-3 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                  streamEnabled
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-xs'
                    : 'bg-white/5 border-white/5 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Wind className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Ruisseau Zen' : language === 'zh' ? '山涧轻水' : 'Zen Stream'}</span>
                </span>
                <span className="font-mono text-[10px]">{streamEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. Interactive Protocol Selector (Mobile Touch Tabs)
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PROTOCOLS.map((protocol) => {
          const isSelected = selectedProtocolId === protocol.id;
          return (
            <button
              key={protocol.id}
              onClick={() => handleSelectProtocol(protocol.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-stone-900 border-amber-400/60 shadow-lg shadow-amber-950/20'
                  : 'bg-surface-main dark:bg-stone-900/60 border-border-main dark:border-stone-800 hover:border-amber-400/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400">
                  {protocol.name[language]}
                </span>
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                )}
              </div>
              <div className="text-sm font-bold text-text-primary dark:text-stone-100 mt-1">
                {protocol.subtitle[language]}
              </div>
              <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 line-clamp-2">
                {protocol.bestFor[language]}
              </p>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          3. Sacred Animated Canvas & Breathing Chamber
          ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border border-stone-800 text-white shadow-2xl flex flex-col items-center justify-center min-h-[460px]">
        {/* Background Generative Canvas */}
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
        />

        {/* Center Glowing Sphere */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 max-w-lg text-center">
          {/* Phase Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-white/20 backdrop-blur-md shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs sm:text-sm font-mono font-bold tracking-wide text-amber-300">
              {currentPhase.name[language]}
            </span>
          </div>

          {/* Central Breathing Counter Orb */}
          <div className="relative flex items-center justify-center w-48 sm:w-56 h-48 sm:h-56">
            {/* Outer dynamic aura */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${currentPhase.color} opacity-25 blur-2xl transition-all duration-700 ${
                isActive ? 'scale-125' : 'scale-90'
              }`}
            />

            {/* Inner Ring with Counter */}
            <div
              className={`w-40 sm:w-48 h-40 sm:h-48 rounded-full bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 flex flex-col items-center justify-center transition-all duration-700 shadow-2xl ${
                currentPhase.borderGlow
              } ${isActive ? 'scale-105' : 'scale-95 opacity-90'}`}
            >
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-100 to-amber-200">
                {isActive ? `${Math.ceil(secondsRemaining)}s` : `${currentPhase.duration}s`}
              </span>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-stone-400 mt-1">
                {isActive ? currentPhase.name[language] : (language === 'zh' ? '点击开启' : language === 'fr' ? 'Prêt' : 'Ready')}
              </span>
            </div>
          </div>

          {/* Phase Detailed Guidance */}
          <p className="fluid-body text-stone-200 max-w-md italic px-4 min-h-[48px] flex items-center justify-center">
            {currentPhase.instruction[language]}
          </p>

          {/* Big Tactile Action Buttons (Touch friendly >= 48px) */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => {
                if (!isActive) {
                  setSecondsRemaining(currentPhase.duration);
                  if (chimeEnabled) playTibetanSingingBowl(320, 4.0);
                }
                setIsActive(!isActive);
              }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-stone-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-950/40 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 fill-stone-950" />
                  <span>{language === 'fr' ? 'Suspendre' : language === 'zh' ? '暂停正念' : 'Pause Session'}</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-stone-950" />
                  <span>{language === 'fr' ? 'Commencer la Session' : language === 'zh' ? '进入正念沉浸' : 'Begin Composure Flow'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsActive(false);
                setSecondsRemaining(activeProtocol.phases[0].duration);
                setPhaseIndex(0);
                setCyclesCompleted(0);
              }}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-stone-300 transition-all cursor-pointer active:scale-95"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. Pre-Deal Mindful Grounding Diagnostic Checklist
          ======================================================== */}
      <div className="rounded-3xl p-6 sm:p-8 bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-main dark:border-stone-800">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {language === 'fr'
                  ? 'Contrôle de Vigilance Pré-Négociation'
                  : language === 'zh'
                  ? '重大交易与会前 · 心理防御自查清单'
                  : 'Pre-Negotiation Mindful Grounding Checklist'}
              </span>
            </div>
            <h3 className="fluid-heading-2 font-bold text-text-primary dark:text-stone-100 mt-1">
              {language === 'fr'
                ? 'Êtes-vous dans un état d’esprit souverain ?'
                : language === 'zh'
                ? '签约或会面VC前，检视你的心理盲区与自主定力'
                : 'Are You Grounded in Sovereign Conviction?'}
            </h3>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-emerald-500/10 border border-purple-500/20 text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-text-secondary dark:text-stone-400">
              {language === 'fr' ? 'Indice de Sang-froid' : language === 'zh' ? '当前定力指数' : 'Composure Score'}
            </div>
            <div className="text-xl font-mono font-extrabold text-purple-600 dark:text-purple-400">
              {composureScore}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {[
            {
              key: 'egoCheck',
              label: {
                en: 'Ego Separation: I am optimizing for governance safety and long-term equity, not headline valuation vanity.',
                fr: 'Détachement de l’Ego : J’optimise la gouvernance et le contrôle, non la vanité d’une valorisation faciale.',
                zh: '剥离虚荣：我追求的是公司治理安全与长远股权价值，而非虚高的估值数字。',
              },
            },
            {
              key: 'fomoImmunity',
              label: {
                en: 'FOMO Immunity: I recognize that deadlines and artificial exclusivity are psychological tactics designed to induce panic.',
                fr: 'Immunité FOMO : Je reconnais que les délais couperets sont des tactiques destinées à provoquer l’urgence.',
                zh: '免疫FOMO：我清醒识破倒计时排他与限期签约不过是诱导仓促让步的心理压迫。',
              },
            },
            {
              key: 'batnaClarity',
              label: {
                en: 'BATNA Sovereignty: I am genuinely prepared to walk away and execute on my cash-flow runway if predatory terms persist.',
                fr: 'Clarté du BATNA : Je suis prêt à refuser l’offre et à m’appuyer sur ma piste d’atterrissage autonome.',
                zh: '底牌确信：若对方坚持严苛霸王条款，我具备随时离席并依靠自有造血生存的真正底气。',
              },
            },
            {
              key: 'sunkCostFree',
              label: {
                en: 'Sunk Cost Immunity: Months of roadshow exhaustion will not force me to sign a toxic liquidation waterfall.',
                fr: 'Immunité aux coûts irrécupérables : La fatigue du roadshow ne me fera pas signer une clause toxique.',
                zh: '沉没成本免疫：数月路演的身体疲惫，决不能成为我妥协签署带毒清算瀑布的理由。',
              },
            },
            {
              key: 'bodyRelaxed',
              label: {
                en: 'Somatic Stillness: My jaw is unclenched, shoulders are dropped, and my breathing remains slow and steady.',
                fr: 'Détente Somatique : Ma mâchoire est détendue, mes épaules sont basses, mon souffle est calme.',
                zh: '身心松沉：下颌已松，双肩下沉，呼吸绵长平稳，声调不亢不卑。',
              },
            },
          ].map((item) => {
            const isChecked = checklist[item.key];
            return (
              <button
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-purple-500/10 dark:bg-purple-950/30 border-purple-500/40 text-text-primary dark:text-stone-100'
                    : 'bg-surface-muted/40 dark:bg-stone-800/40 border-border-main dark:border-stone-800 text-text-secondary dark:text-stone-400 hover:border-stone-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'border-stone-400 dark:border-stone-600'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span className="text-xs sm:text-sm leading-relaxed">{item.label[language]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          5. Trilingual Stoic & Zen Dealmaking Wisdom Cards
          ======================================================== */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-stone-900 to-purple-950/80 border border-amber-500/20 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-300">
            <Feather className="w-4 h-4 text-amber-400" />
            <span>
              {language === 'fr'
                ? 'Sagesse Stoïcienne & Zen pour Fondateurs'
                : language === 'zh'
                ? '创投斯多葛与东方静心箴言'
                : 'Stoic & Zen Dealmaking Wisdom'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => speak(currentWisdom.quote[language], language)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition-all cursor-pointer"
              title="Listen Audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWisdomIndex((prev) => (prev + 1) % STOIC_DEAL_WISDOM.length)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition-all cursor-pointer"
              title="Next Wisdom"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 py-2">
          <blockquote className="fluid-heading-2 font-serif-luxury italic text-amber-100 leading-relaxed">
            {currentWisdom.quote[language]}
          </blockquote>

          <div className="flex items-center space-x-2 text-xs text-stone-300 font-mono">
            <strong className="text-amber-400 font-bold">{currentWisdom.author}</strong>
            <span>—</span>
            <span className="text-stone-400">{currentWisdom.role[language]}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <strong className="text-amber-300 font-semibold">
              {language === 'fr' ? 'Application Négociation : ' : language === 'zh' ? '博弈实战心法：' : 'Deal Takeaway: '}
            </strong>
            {currentWisdom.takeaway[language]}
          </div>
        </div>
      </div>
    </div>
  );
};
