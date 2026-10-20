import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Award, CheckCircle2, XCircle, ShieldAlert, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface CognitiveReframeGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

interface ReframeCase {
  id: string;
  toxicThought: { en: string; fr: string; zh: string };
  distortionOptions: { id: string; label: { en: string; fr: string; zh: string } }[];
  correctDistortionId: string;
  counterFrames: { id: string; frame: { en: string; fr: string; zh: string }; isSovereign: boolean }[];
  scientificDebrief: { en: string; fr: string; zh: string };
}

const REFRAME_CASES: ReframeCase[] = [
  {
    id: 'cbt_1',
    toxicThought: {
      en: '“The tier-1 partner rejected our deck after our final meeting. Our entire company is fundamentally flawed and we are destined to fail.”',
      fr: '« L’associé principal a refusé notre deck après l’entretien final. Toute notre stratégie est nulle et nous courons à la faillite. »',
      zh: '“头部基金合伙人在终轮会谈后否决了我们的BP。这说明我们的整个商业模式从根基上就是错的，注定要惨败收场。”',
    },
    distortionOptions: [
      { id: 'catastrophizing', label: { en: 'Catastrophizing (Magnification)', fr: 'Catastrophisme (Dramatisation)', zh: '灾难化放大 (Catastrophizing)' } },
      { id: 'all_nothing', label: { en: 'All-or-Nothing Dichotomy', fr: 'Pensée Tout ou Rien', zh: '全或无非黑即白' } },
      { id: 'emotional_reasoning', label: { en: 'Emotional Reasoning', fr: 'Raisonnement Émotionnel', zh: '情绪化主观归因' } },
    ],
    correctDistortionId: 'catastrophizing',
    counterFrames: [
      {
        id: 'f1',
        frame: {
          en: 'One partner’s thesis mismatch is statistical noise. We now have specific diligence feedback to sharpen our unit economics for the remaining 8 funds in our pipeline.',
          fr: 'Le rejet d’un seul fonds est un bruit statistique. Nous avons des retours précis pour affiner notre thèse auprès des 8 autres investisseurs.',
          zh: '单家机构的赛道偏好不匹配纯属统计噪音。我们获得了极具价值的尽调反馈，正好可以针对管线中其余8家意向资方精准迭代单位经济学。',
        },
        isSovereign: true,
      },
      {
        id: 'f2',
        frame: {
          en: 'Let’s immediately slash our pricing by 50% so nobody else rejects us.',
          fr: 'Baissons tout de suite nos prix de 50 % pour éviter d’autres refus.',
          zh: '立即将估值对半砍50%，确保下一家无论如何不会再拒绝我们。',
        },
        isSovereign: false,
      },
    ],
    scientificDebrief: {
      en: 'Aaron Beck (1967): Catastrophizing extrapolates a single isolated setback into an inevitable total disaster. The sovereign mind treats rejections as Bayesian data points.',
      fr: 'Aaron Beck (1967) : La dramatisation extrapole un incident en désastre global. L’esprit souverain traite un refus comme un simple point de données bayésien.',
      zh: '阿伦·贝克认知疗法：灾难化思维将单一局部受挫妄自无限放大为全局毁灭。真正成熟的创业者将拒信视为贝叶斯统计中的修正数据点。',
    },
  },
  {
    id: 'cbt_2',
    toxicThought: {
      en: '“Unless we close this round at exactly our target $20M valuation with zero governance concessions, this entire fundraising process is a humiliating defeat.”',
      fr: '« Si nous ne bouclons pas à exactement 20 M$ de valorisation sans la moindre concession, cette levée est un échec cuisant. »',
      zh: '“除非本轮能在2000万美元估值下一分不让且完全不作任何治理让步，否则这次融资就是一场彻头彻尾的羞辱性溃败。”',
    },
    distortionOptions: [
      { id: 'all_nothing', label: { en: 'All-or-Nothing Dichotomy', fr: 'Dichotomie Binaire (Tout ou Rien)', zh: '全或无绝对化思维 (All-or-Nothing)' } },
      { id: 'mind_reading', label: { en: 'Mind Reading', fr: 'Lecture de Pensée', zh: '盲目读心术' } },
      { id: 'personalization', label: { en: 'Personalization Trap', fr: 'Personnalisation Excessive', zh: '个人化受害情结' } },
    ],
    correctDistortionId: 'all_nothing',
    counterFrames: [
      {
        id: 'f1',
        frame: {
          en: 'Valuation is a single variable in an N-dimensional optimization. Trading 10% valuation for Tier-1 syndicate board governance and clean 1x preference multiplies exit probability by 400%.',
          fr: 'La valorisation n’est qu’une variable parmi d’autres. Échanger 10 % de valo contre un conseil de renom et des termes propres quadruple les chances de succès.',
          zh: '估值仅是多维博弈中的单一变量。以10%估值弹性换取纯净的1倍非参与优先权与顶级产业合伙人入局，能将未来退出成功率拉升数倍。',
        },
        isSovereign: true,
      },
      {
        id: 'f2',
        frame: {
          en: 'Refuse to sign anything unless every single word matches our original wish list.',
          fr: 'Refusons catégoriquement tant que chaque virgule ne correspond pas à nos souhaits.',
          zh: '绝不妥协，直到资方全盘接受我们最初列出的每一条清单为止。',
        },
        isSovereign: false,
      },
    ],
    scientificDebrief: {
      en: 'Albert Ellis (REBT): Rigid “Musturbation” and black-and-white absolutism destroys deal flexibility. Optimal negotiators think in continuous trade-off frontiers.',
      fr: 'Albert Ellis (REBT) : L’absolutisme rigide détruit la souplesse de négociation. Les stratèges pensent en continuum de compromis optimisés.',
      zh: '阿尔伯特·艾利斯理性情绪疗法：绝对化的“必须/应当”执念会抹杀交易灵活性。高段位谈判者永远在连续的对价前沿面上寻找帕累托最优解。',
    },
  },
  {
    id: 'cbt_3',
    toxicThought: {
      en: '“We already sank $1.5M and 14 months building this legacy enterprise feature. If we pivot away now, all our past sweat and blood will be completely wasted.”',
      fr: '« Nous avons déjà englouti 1,5 M$ et 14 mois sur cette fonctionnalité. Pivoter maintenant signifierait avoir tout gâché en vain. »',
      zh: '“我们已经在这个老企业级功能上砸了150万美元和14个月心血。如果现在断臂转型，过去的汗水和团队尊严就全打水漂了。”',
    },
    distortionOptions: [
      { id: 'sunk_cost_fallacy', label: { en: 'Sunk Cost Fallacy (Loss Aversion)', fr: 'Piège des Coûts Irrécupérables', zh: '沉没成本与损失厌恶陷阱' } },
      { id: 'overgeneralization', label: { en: 'Overgeneralization', fr: 'Sur-généralisation', zh: '以偏概全' } },
      { id: 'labeling', label: { en: 'Emotional Labeling', fr: 'Étiquetage Réducteur', zh: '自我标签化' } },
    ],
    correctDistortionId: 'sunk_cost_fallacy',
    counterFrames: [
      {
        id: 'f1',
        frame: {
          en: 'Past capital is already spent regardless. The only rational calculation is: Where will our remaining $1M runway generate the highest return on future invested time?',
          fr: 'L’argent passé est dépensé quoi qu’il arrive. La seule question rationnelle est : Où nos 1 M$ restants généreront-ils le plus d’impact futur ?',
          zh: '过去的资本与时间无论如何已无法追回。唯一理性的战略命题是：账面剩余的100万跑道投入到哪里，才能在未来产生最高的资本收益？',
        },
        isSovereign: true,
      },
      {
        id: 'f2',
        frame: {
          en: 'Keep funding it for 6 more months so we can at least prove we weren’t wrong to build it.',
          fr: 'Continuons 6 mois de plus pour prouver que nous avions raison au départ.',
          zh: '再咬牙硬撑半年，至少向董事会证明我们当初立项没有犯错。',
        },
        isSovereign: false,
      },
    ],
    scientificDebrief: {
      en: 'Kahneman & Tversky (Prospect Theory): Pain of loss is psychologically twice as intense as pleasure of equivalent gain. Severing emotional attachments protects future runway.',
      fr: 'Kahneman & Tversky : La douleur de la perte est deux fois plus vive que le plaisir du gain. Couper l’attachement émotionnel préserve le futur.',
      zh: '卡尼曼前景理论：失去100万的心理痛感是得到100万快乐的两倍。果断阻断沉没成本的情绪回声，是顶级CEO最具含金量的战略魄力。',
    },
  },
];

export const CognitiveReframeGame: React.FC<CognitiveReframeGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [step, setStep] = useState<'diagnosing' | 'reframing' | 'review'>('diagnosing');
  const [selectedDistortion, setSelectedDistortion] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctCases, setCorrectCases] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const activeCase = REFRAME_CASES[currentIdx];

  const handleSelectDistortion = (id: string) => {
    setSelectedDistortion(id);
    if (id === activeCase.correctDistortionId) {
      setScore((s) => s + 50);
      if (!isAudioMuted) playSubtleClick();
    } else {
      if (!isAudioMuted) playGameErrorSound();
    }
    setStep('reframing');
  };

  const handleSelectFrame = (id: string, isSovereign: boolean) => {
    setSelectedFrame(id);
    if (isSovereign) {
      setScore((s) => s + 50);
      setCorrectCases((c) => c + 1);
      if (!isAudioMuted) playPsychPulse(528, 0.25);
    } else {
      if (!isAudioMuted) playGameErrorSound();
    }
    setStep('review');
  };

  const handleNextCase = () => {
    if (currentIdx < REFRAME_CASES.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedDistortion(null);
      setSelectedFrame(null);
      setStep('diagnosing');
    } else {
      setIsCompleted(true);
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
            {language === 'fr' ? 'TCC & Alchimie Mentale' : language === 'zh' ? '认知重构破壁与归因重塑' : 'Cognitive Reframing Alchemy'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Déconstruction des Biais Négatifs' : language === 'zh' ? '消解负性思维 · 重铸斯多葛护盾' : 'Deconstructing Automatic Distortions'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30">
            {currentIdx + 1} / {REFRAME_CASES.length}
          </span>
          <button
            onClick={onExit}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors px-2 py-1"
          >
            {language === 'fr' ? 'Quitter' : language === 'zh' ? '退出' : 'Exit'}
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Toxic Thought Display */}
          <div className="p-5 rounded-3xl bg-red-950/20 border border-red-500/30 shadow-inner">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold block mb-2 flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>{language === 'fr' ? 'PENSÉE NÉGATIVE AUTOMATIQUE' : language === 'zh' ? '高危自动负性扭曲思维 (ANT)' : 'AUTOMATIC NEGATIVE THOUGHT'}</span>
            </span>
            <p className="text-sm sm:text-base font-serif-luxury italic text-stone-100 leading-relaxed">
              {activeCase.toxicThought[language]}
            </p>
          </div>

          {/* Step 1: Diagnose Distortion */}
          {step === 'diagnosing' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-300 block">
                {language === 'fr'
                  ? 'Étape 1 : Identifiez le piège cognitif sous-jacent'
                  : language === 'zh'
                  ? '第一步：诊断上述负性念头所犯的认知偏差陷阱'
                  : 'Step 1: Identify the underlying cognitive distortion trap'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeCase.distortionOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectDistortion(opt.id)}
                    className="p-3.5 rounded-2xl bg-stone-800/80 hover:bg-purple-900/30 border border-white/10 hover:border-purple-400/50 text-stone-200 text-xs font-medium text-left transition-all active:scale-95 shadow-md"
                  >
                    {opt.label[language]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Sovereign Counter-Frame */}
          {step === 'reframing' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-purple-300 block">
                {language === 'fr'
                  ? 'Étape 2 : Sélectionnez le recadrage stoïque et souverain'
                  : language === 'zh'
                  ? '第二步：挑选具备斯多葛理性与战略掌控力的重构方案'
                  : 'Step 2: Select the sovereign, high-agency counter-frame'}
              </span>
              <div className="space-y-3">
                {activeCase.counterFrames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => handleSelectFrame(frame.id, frame.isSovereign)}
                    className="w-full p-4 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-white/10 hover:border-purple-400/50 text-stone-200 text-xs text-left transition-all active:scale-95 shadow-md leading-relaxed flex items-start space-x-3"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{frame.frame[language]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Scientific Debrief */}
          {step === 'review' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block">
                  {language === 'fr' ? 'Débriefing Psychologique' : language === 'zh' ? '心理学与认知科学破壁复盘' : 'Psychological Science Debrief'}
                </span>
                <p className="text-stone-200 leading-relaxed">
                  {activeCase.scientificDebrief[language]}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextCase}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>
                    {currentIdx < REFRAME_CASES.length - 1
                      ? language === 'fr' ? 'Cas Suivant' : language === 'zh' ? '进入下一破壁案' : 'Next Scenario'
                      : language === 'fr' ? 'Voir le Bilan' : language === 'zh' ? '查看归因评级' : 'Complete Challenge'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'Souveraineté Cognitive Validée' : language === 'zh' ? '斯多葛认知重构评级' : 'Cognitive Fortitude Achieved'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {correctCases === REFRAME_CASES.length
                ? language === 'fr'
                  ? 'Impressionnante lucidité. Vous désamorcez les distorsions automatiques et convertissez les chocs en leviers.'
                  : language === 'zh'
                  ? '极其坚韧的理性归因能力！面对任何黑天鹅与拒绝，均能迅速剥离非理性灾难化杂质，化被动为主动。'
                  : 'Exceptional cognitive immunity. You neutralize catastrophic distortion and forge stoic advantage.'
                : language === 'fr'
                ? 'Bonne prise de conscience. Continuez à questionner les croyances binaires et les coûts irrécupérables.'
                : language === 'zh'
                ? '良好自省力。持续警惕全或无的绝对化执念，拥抱多维概率思维。'
                : 'Solid awareness. Keep interrogating binary absolutism and emotional attachment to sunk costs.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL SCORE</span>
              <span className="text-lg font-bold text-purple-400">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">SOVEREIGN REFRES</span>
              <span className="text-lg font-bold text-emerald-400">{correctCases} / {REFRAME_CASES.length}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                setCurrentIdx(0);
                setSelectedDistortion(null);
                setSelectedFrame(null);
                setStep('diagnosing');
                setIsCompleted(false);
                setScore(0);
                setCorrectCases(0);
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Recommencer' : language === 'zh' ? '重新破壁' : 'Retry'}</span>
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
