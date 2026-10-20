import React, { useState } from 'react';
import { Play, RotateCcw, Award, CheckCircle2, XCircle, Eye, Sparkles, Smile, Shield } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface MicroExpressionGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

interface ExpressionScenario {
  id: string;
  targetEmotion: { en: string; fr: string; zh: string };
  options: { id: string; label: { en: string; fr: string; zh: string } }[];
  correctId: string;
  facsCues: {
    en: string;
    fr: string;
    zh: string;
  };
  negotiationContext: {
    en: string;
    fr: string;
    zh: string;
  };
  svgExpressionState: 'contempt' | 'anxiety' | 'anger' | 'delight' | 'poker';
}

const SCENARIOS: ExpressionScenario[] = [
  {
    id: 'sc_1',
    targetEmotion: { en: 'Unilateral Contempt', fr: 'Mépris Unilatéral', zh: '单侧嘴角轻蔑' },
    options: [
      { id: 'contempt', label: { en: 'Contempt (AU14 Dimple)', fr: 'Mépris (Fossette AU14)', zh: '轻蔑与不屑 (AU14颊肌单侧微提)' } },
      { id: 'polite', label: { en: 'Polite Agreement', fr: 'Accord Poli', zh: '礼貌性附和' } },
      { id: 'surprise', label: { en: 'Genuine Surprise', fr: 'Surprise Sincère', zh: '真实惊讶' } },
      { id: 'doubt', label: { en: 'Intellectual Doubt', fr: 'Doute Intellectuel', zh: '理性思索' } },
    ],
    correctId: 'contempt',
    facsCues: {
      en: 'FACS AU14: One lip corner tightens and raises slightly. The only asymmetrical universal micro-expression, signaling perceived moral or strategic superiority.',
      fr: 'FACS AU14 : Un coin de lèvre se resserre et s’élève. Seule micro-expression asymétrique universelle, trahissant un sentiment de supériorité.',
      zh: 'FACS AU14：单侧嘴角颊肌紧绷微翘。人类面部唯一非对称的潜意识微表情，潜台词是“你的报价已被我看穿并毫无威慑”。',
    },
    negotiationContext: {
      en: 'Appeared for 250ms when you stated your $25M valuation cap. The lead partner signaled hidden disdain.',
      fr: 'Apparu pendant 250 ms lors de l’annonce du cap de 25 M$. L’investisseur manifeste un mépris discret.',
      zh: '在你阐述2500万美元估值上限的瞬间转瞬即逝。暗示投资合伙人认为此估值虚高且极易压价。',
    },
    svgExpressionState: 'contempt',
  },
  {
    id: 'sc_2',
    targetEmotion: { en: 'Concealed Anxiety', fr: 'Anxiété Dissimulée', zh: '隐秘焦虑与恐慌' },
    options: [
      { id: 'calm', label: { en: 'Serene Composure', fr: 'Sang-froid Sérénité', zh: '波澜不惊' } },
      { id: 'anxiety', label: { en: 'Micro-Fear (AU1+2+4+20)', fr: 'Peur Cachée (AU1+2+4)', zh: '隐性恐惧/惊恐 (AU1+2+4内眉微挑与唇拉伸)' } },
      { id: 'focus', label: { en: 'Intense Focus', fr: 'Concentration Intense', zh: '专注研读' } },
      { id: 'boredom', label: { en: 'Passive Boredom', fr: 'Ennui Passif', zh: '心不在焉' } },
    ],
    correctId: 'anxiety',
    facsCues: {
      en: 'FACS AU1+2+4: Inner eyebrows pulled up and together, eyelids tense, lips stretched horizontally. Betrays fear of losing the deal.',
      fr: 'FACS AU1+2+4 : Sourcils intérieurs relevés et rapprochés, lèvres étirées. Révèle la peur de perdre le tour.',
      zh: 'FACS AU1+2+4：内侧眉头微抬且聚拢，眼裂轻微张大，唇角水平微拉伸。透露出极度担心失去这笔交易的恐慌。',
    },
    negotiationContext: {
      en: 'Occurred right when you revealed an alternative term sheet from a Tier-1 syndicate.',
      fr: 'Survenu dès l’instant où vous avez mentionné une term sheet concurrente de premier plan.',
      zh: '当你淡定提及已收到另一家头部机构竞品意向函时，对方瞬间闪现的神经应激。',
    },
    svgExpressionState: 'anxiety',
  },
  {
    id: 'sc_3',
    targetEmotion: { en: 'Suppressed Anger', fr: 'Colère Réprimée', zh: '克制压抑的怒意' },
    options: [
      { id: 'sadness', label: { en: 'Disappointment', fr: 'Déception Triste', zh: '遗憾失望' } },
      { id: 'anger', label: { en: 'Suppressed Anger (AU4+7+23)', fr: 'Colère Réprimée (AU4+7)', zh: '克制压抑之怒 (AU4皱眉+AU7睑肌紧绷+AU23唇红变窄)' } },
      { id: 'neutral', label: { en: 'Poker Neutrality', fr: 'Neutralité de Poker', zh: '中性扑克脸' } },
      { id: 'pity', label: { en: 'Sympathy', fr: 'Compassion', zh: '同情' } },
    ],
    correctId: 'anger',
    facsCues: {
      en: 'FACS AU4+7+23: Eyebrows drawn down and inward, lower eyelids tightened, red margin of lips thinned and compressed tightly.',
      fr: 'FACS AU4+7+23 : Sourcils froncés vers le bas, paupières inférieures tendues, lèvres pincées et amincies.',
      zh: 'FACS AU4+7+23：眉毛下压聚拢，下眼睑肌肉紧缩，红唇变窄紧抿。表明其领地边界受到侵犯，正极力克制进攻冲动。',
    },
    negotiationContext: {
      en: 'Flashed when you firmly rejected their 2x Participating Liquidation Preference demand.',
      fr: 'Émis quand vous avez catégoriquement refusé leur clause de préférence participante 2x.',
      zh: '在你坚定否决其2倍参与清算优先权毒丸条款时出现，透露出其习惯掌控话语权被逆转后的恼怒。',
    },
    svgExpressionState: 'anger',
  },
  {
    id: 'sc_4',
    targetEmotion: { en: 'Genuine Duchenne Delight', fr: 'Joie Duchenne Authentique', zh: '杜氏真诚欣喜' },
    options: [
      { id: 'fake_smile', label: { en: 'Courteous Fake Smile', fr: 'Sourire Commercial Faux', zh: '社交假笑' } },
      { id: 'delight', label: { en: 'Duchenne Delight (AU6+12)', fr: 'Joie Duchenne (AU6+12)', zh: '杜氏真诚喜悦 (AU6眼轮匝肌收缩+AU12颧大肌上提)' } },
      { id: 'smug', label: { en: 'Smug Superiority', fr: 'Supériorité Fatuité', zh: '得逞自满' } },
      { id: 'relief', label: { en: 'Exhausted Relief', fr: 'Soulagement Fatigué', zh: '疲惫解脱' } },
    ],
    correctId: 'delight',
    facsCues: {
      en: 'FACS AU6+AU12: Involuntary contraction of Orbicularis Oculi lifts the cheeks and creates crow’s feet wrinkles, impossible to consciously feign.',
      fr: 'FACS AU6+12 : Contraction involontaire de l’orbiculaire créant des pattes d’oie, impossible à feindre consciemment.',
      zh: 'FACS AU6+AU12：眼轮匝肌下意识收缩推挤出眼角“鱼尾纹”，两颊对称上提。这是社交假笑绝对无法刻意伪装的真实满意。',
    },
    negotiationContext: {
      en: 'Shown when you agreed to let their operating partner mentor your European go-to-market.',
      fr: 'Observé lorsque vous avez validé le rôle de mentor européen de leur operating partner.',
      zh: '当你欣然同意让其合伙人协助开拓欧洲战略生态时，对方卸下防御露出的由衷认可。',
    },
    svgExpressionState: 'delight',
  },
  {
    id: 'sc_5',
    targetEmotion: { en: 'Calculated Mask', fr: 'Masque Calculé de Poker', zh: '算计性刻意扑克脸' },
    options: [
      { id: 'empathy', label: { en: 'Active Empathy', fr: 'Empathie Active', zh: '主动共情' } },
      { id: 'distracted', label: { en: 'Zoned Out', fr: 'Distrait Ailleurs', zh: '走神发呆' } },
      { id: 'poker', label: { en: 'Calculated Mask (Suppression)', fr: 'Masque Calculé (FACS)', zh: '算计性情绪压制 (微凝视与眨眼抑制)' } },
      { id: 'shock', label: { en: 'Stunned Paralysis', fr: 'Paralysie de Choc', zh: '震惊木讷' } },
    ],
    correctId: 'poker',
    facsCues: {
      en: 'Intentional muscle immobilization: Blink rate drops by 80%, fixed ocular gaze with slight jaw muscle tension (masseter clench).',
      fr: 'Immobilisation intentionnelle : Le clignement chute de 80 %, regard fixe et légère tension du masséter.',
      zh: '刻意肌肉固化：瞬目（眨眼）频率骤降80%，视线微收敛，咬肌下意识收紧。这是大脑高负荷心理演算与信息隐瞒的典型体征。',
    },
    negotiationContext: {
      en: 'The partner stopped all nodding and held complete stillness before offering their counter-proposal.',
      fr: 'L’associé a cessé tout hochement de tête avant de formuler sa contre-offre.',
      zh: '在提出关键对价让步前，对方突然中断所有肢体语言反馈，进入深度推演计算的无声战局。',
    },
    svgExpressionState: 'poker',
  },
];

export const MicroExpressionGame: React.FC<MicroExpressionGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'flashing' | 'guessing' | 'reviewed' | 'ended'>('idle');
  const [isMasked, setIsMasked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const scenario = SCENARIOS[currentRound];

  const startRound = () => {
    setSelectedAnswer(null);
    setIsMasked(false);
    setGameState('flashing');
    if (!isAudioMuted) playPsychPulse(587, 0.2);

    // Flash stimulus for 350ms, then mask face
    setTimeout(() => {
      setIsMasked(true);
      setGameState('guessing');
    }, 450);
  };

  const handleSelectOption = (optionId: string) => {
    if (gameState !== 'guessing') return;

    setSelectedAnswer(optionId);
    setGameState('reviewed');

    if (optionId === scenario.correctId) {
      setScore((s) => s + 100);
      setCorrectAnswers((c) => c + 1);
      if (!isAudioMuted) playSubtleClick();
    } else {
      if (!isAudioMuted) playGameErrorSound();
    }
  };

  const handleNextRound = () => {
    if (currentRound < SCENARIOS.length - 1) {
      setCurrentRound((r) => r + 1);
      setIsMasked(false);
      setSelectedAnswer(null);
      setGameState('idle');
    } else {
      setGameState('ended');
      if (!isAudioMuted) playGameVictoryFanfare();
    }
  };

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-purple-500/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold block">
            {language === 'fr' ? 'Micro-Expressions & FACS' : language === 'zh' ? '微表情与面部动作编码 (FACS)' : 'Micro-Expression Empathy'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Détection Subconsciente Éclair' : language === 'zh' ? '400毫秒潜意识共情洞察' : 'Sub-Second Involuntary Cues'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30">
            {currentRound + 1} / {SCENARIOS.length}
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
        <div className="py-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Smile className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? `Cas ${currentRound + 1} : Flash de 400ms`
                : language === 'zh'
                ? `第 ${currentRound + 1} 题：准备捕捉闪烁微表情`
                : `Scenario ${currentRound + 1}: 400ms Flash Window`}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'Le visage affichera une micro-expression involontaire pendant une fraction de seconde, puis sera masqué. Observez attentivement les yeux et les lèvres.'
                : language === 'zh'
                ? '点击开始后，面部微动作将在约400毫秒内转瞬即逝并随后重新蒙上面具。调动你的梭状回面孔区与镜像神经元！'
                : 'The face will flash an involuntary subconscious muscle contraction for ~400ms before returning to neutral. Train your fusiform face area.'}
            </p>
          </div>
          <button
            onClick={startRound}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Déclencher l’éclair facial' : language === 'zh' ? '触发微表情闪现' : 'Flash Face Micro-Cue'}</span>
          </button>
        </div>
      )}

      {(gameState === 'flashing' || gameState === 'guessing' || gameState === 'reviewed') && (
        <div className="space-y-6">
          {/* Facial Vector Arena */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-full bg-stone-900 border-2 border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] flex items-center justify-center overflow-hidden">
            {isMasked && gameState === 'guessing' ? (
              <div className="text-center space-y-2 p-4">
                <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 animate-pulse">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-purple-300 block">
                  {language === 'fr' ? '[ Visage Masqué ]' : language === 'zh' ? '[ 瞬态微表情已隐没 ]' : '[ Transient Cues Masked ]'}
                </span>
                <span className="text-[10px] text-stone-400">
                  {language === 'fr' ? 'Faites votre choix ci-dessous' : language === 'zh' ? '请凭直觉做出研判' : 'Select decoded state below'}
                </span>
              </div>
            ) : (
              /* High-End Stylized SVG Facial Expression Anatomy */
              <svg viewBox="0 0 200 200" className="w-full h-full p-4">
                {/* Face Contour */}
                <ellipse cx="100" cy="100" rx="72" ry="85" fill="#1e2238" stroke="#a855f7" strokeWidth="2" />
                
                {/* Eyebrows */}
                {scenario.svgExpressionState === 'contempt' && (
                  <>
                    <path d="M 60 70 Q 75 66 90 70" stroke="#fcd34d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <path d="M 110 66 Q 125 60 140 68" stroke="#fcd34d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  </>
                )}
                {scenario.svgExpressionState === 'anxiety' && (
                  <>
                    <path d="M 60 65 Q 75 68 90 60" stroke="#fcd34d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <path d="M 110 60 Q 125 68 140 65" stroke="#fcd34d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  </>
                )}
                {scenario.svgExpressionState === 'anger' && (
                  <>
                    <path d="M 60 62 Q 75 72 90 75" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M 110 75 Q 125 72 140 62" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </>
                )}
                {scenario.svgExpressionState === 'delight' && (
                  <>
                    <path d="M 60 68 Q 75 62 90 67" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <path d="M 110 67 Q 125 62 140 68" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  </>
                )}
                {scenario.svgExpressionState === 'poker' && (
                  <>
                    <path d="M 60 68 L 90 68" stroke="#94a3b8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <path d="M 110 68 L 140 68" stroke="#94a3b8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  </>
                )}

                {/* Eyes */}
                {scenario.svgExpressionState === 'delight' ? (
                  <>
                    <path d="M 62 90 Q 75 80 88 90" stroke="#f8fafc" strokeWidth="3" fill="none" />
                    <path d="M 112 90 Q 125 80 138 90" stroke="#f8fafc" strokeWidth="3" fill="none" />
                    {/* Crow's feet wrinkles */}
                    <path d="M 54 88 L 60 90 M 52 93 L 59 92" stroke="#fcd34d" strokeWidth="2" />
                    <path d="M 146 88 L 140 90 M 148 93 L 141 92" stroke="#fcd34d" strokeWidth="2" />
                  </>
                ) : (
                  <>
                    <ellipse cx="75" cy="88" rx="11" ry="8" fill="#0f172a" stroke="#f8fafc" strokeWidth="2" />
                    <circle cx="75" cy="88" r="4.5" fill="#38bdf8" />
                    <ellipse cx="125" cy="88" rx="11" ry="8" fill="#0f172a" stroke="#f8fafc" strokeWidth="2" />
                    <circle cx="125" cy="88" r="4.5" fill="#38bdf8" />
                  </>
                )}

                {/* Nose */}
                <path d="M 100 86 L 98 112 L 106 114" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Mouth */}
                {scenario.svgExpressionState === 'contempt' && (
                  <path d="M 72 142 Q 100 144 125 142 Q 134 130 132 128" stroke="#fcd34d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                )}
                {scenario.svgExpressionState === 'anxiety' && (
                  <path d="M 66 142 Q 100 138 134 142" stroke="#fcd34d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                )}
                {scenario.svgExpressionState === 'anger' && (
                  <path d="M 72 144 L 128 144" stroke="#ef4444" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                )}
                {scenario.svgExpressionState === 'delight' && (
                  <path d="M 68 136 Q 100 162 132 136" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
                )}
                {scenario.svgExpressionState === 'poker' && (
                  <path d="M 75 142 L 125 142" stroke="#94a3b8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                )}
              </svg>
            )}
          </div>

          {/* Context Prompt */}
          <div className="p-3.5 rounded-2xl bg-surface-muted/60 dark:bg-stone-900/60 border border-border-main dark:border-white/5 text-xs">
            <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              {language === 'fr' ? 'Contexte Négociation' : language === 'zh' ? '谈判情境微线索' : 'Negotiation Trigger Point'}
            </span>
            <p className="text-text-primary dark:text-stone-300">
              {scenario.negotiationContext[language]}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scenario.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              const isCorrect = opt.id === scenario.correctId;

              let btnStyle = 'bg-stone-800/80 hover:bg-stone-700/80 border-white/10 text-stone-200';
              if (gameState === 'reviewed') {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                } else {
                  btnStyle = 'opacity-40 bg-stone-900 border-transparent text-stone-500';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={gameState !== 'guessing'}
                  className={`p-3.5 rounded-2xl border text-left text-xs transition-all active:scale-95 shadow-md flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt.label[language]}</span>
                  {gameState === 'reviewed' && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {gameState === 'reviewed' && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Psychological FACS Explanation after review */}
          {gameState === 'reviewed' && (
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-2 animate-fadeIn">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block">
                {language === 'fr' ? 'Analyse FACS Paul Ekman' : language === 'zh' ? '保罗·艾克曼 FACS 微动作解密' : 'Paul Ekman FACS Decoding'}
              </span>
              <p className="text-stone-200 leading-relaxed">
                {scenario.facsCues[language]}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextRound}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  {currentRound < SCENARIOS.length - 1
                    ? language === 'fr' ? 'Cas Suivant' : language === 'zh' ? '进入下一案' : 'Next Scenario'
                    : language === 'fr' ? 'Voir le Bilan' : language === 'zh' ? '查看洞察评级' : 'View Results'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === 'ended' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'Indice d’Empathie Subconsciente' : language === 'zh' ? '潜意识共情与微表情洞察报告' : 'Micro-Expression Empathy Index'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {correctAnswers >= 4
                ? language === 'fr'
                  ? 'Perception extraordinaire. Vous détectez instantanément les bluffs et les fragilités cachées en table de négociation.'
                  : language === 'zh'
                  ? '极其敏锐的社交心理雷达！在极短时间内能看破伪装扑克脸、捕捉对方下意识恐惧与傲慢信号。'
                  : 'Extraordinary interpersonal radar. You spot concealed poker bluffs and subconscious anxieties effortlessly.'
                : language === 'fr'
                ? 'Bonne intuition de base. Continuez à vous exercer sur les contractions musculaires fines.'
                : language === 'zh'
                ? '良好基础。在谈判中多关注对方眼部眼轮匝肌收缩与单侧嘴角微动态。'
                : 'Solid instincts. Focus attention on unilateral lip asymmetry and orbicularis oculi eye crinkles.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL SCORE</span>
              <span className="text-lg font-bold text-purple-400">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">ACCURACY</span>
              <span className="text-lg font-bold text-emerald-400">
                {Math.round((correctAnswers / SCENARIOS.length) * 100)}%
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">CORRECT</span>
              <span className="text-lg font-bold text-stone-200">
                {correctAnswers} / {SCENARIOS.length}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                setCurrentRound(0);
                setScore(0);
                setCorrectAnswers(0);
                setGameState('idle');
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Recommencer' : language === 'zh' ? '重新测验' : 'Replay'}</span>
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
