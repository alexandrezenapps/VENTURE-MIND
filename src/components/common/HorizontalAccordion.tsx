import React, { useState } from 'react';
import {
  Sliders,
  Flame,
  FileSpreadsheet,
  Brain,
  Sparkles,
  ChevronRight,
  Maximize2,
  Minimize2,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface AccordionPillar {
  id: string;
  number: string;
  title: { en: string; fr: string; zh: string };
  subtitle: { en: string; fr: string; zh: string };
  tag: { en: string; fr: string; zh: string };
  icon: React.ElementType;
  color: {
    border: string;
    borderActive: string;
    bgGradient: string;
    collapsedBg: string;
    text: string;
    accent: string;
    glow: string;
  };
  metrics: {
    label: { en: string; fr: string; zh: string };
    value: string;
  }[];
  description: { en: string; fr: string; zh: string };
  keyTakeaway: { en: string; fr: string; zh: string };
  actionLabel: { en: string; fr: string; zh: string };
  actionTargetTab: 'simulators' | 'negotiation' | 'termsheet' | 'psychology' | 'mindfulness';
}

const DEFAULT_PILLARS: AccordionPillar[] = [
  {
    id: 'pillar_captable',
    number: '01',
    title: {
      en: 'Cap Table & Waterfall Sovereignty',
      fr: 'Ingénierie du Cap Table & Cascades',
      zh: '股权架构与退出清算瀑布沙盘',
    },
    subtitle: {
      en: 'Cold mathematical modeling against aggressive dilution and liquidation preference shuffles.',
      fr: 'Modélisation financière contre les pièges de dilution et préférences abusives.',
      zh: '以冰冷严谨的数理推演对抗暗度陈仓的期权池前置与双重优先清算陷阱。',
    },
    tag: {
      en: 'Capital Engineering',
      fr: 'Ingénierie Financière',
      zh: '资本数理工程',
    },
    icon: Sliders,
    color: {
      border: 'border-cyan-500/25',
      borderActive: 'border-cyan-400/60',
      bgGradient: 'from-[#0B1A34]/98 via-[#071224]/95 to-[#040813]',
      collapsedBg: 'bg-gradient-to-b from-[#0F1C33]/85 via-[#0A1325]/90 to-[#060C18]/95 hover:from-[#132342]/90 hover:to-[#0A1224]',
      text: 'text-cyan-300',
      accent: 'bg-cyan-400',
      glow: 'shadow-[0_16px_40px_rgba(6,182,212,0.18),inset_0_1px_1px_rgba(255,255,255,0.18)]',
    },
    metrics: [
      { label: { en: 'Preference Anchor', fr: 'Préférence Standard', zh: '清算优先权底线' }, value: '1.0x Non-Part' },
      { label: { en: 'Hiring Pool Range', fr: 'Pool d’Option', zh: '合理期权池精算' }, value: '8% - 10%' },
      { label: { en: 'Simulated Exit', fr: 'Sortie Cible', zh: '沙盘退出估值' }, value: '$50M+' },
    ],
    description: {
      en: 'Test multiple financing rounds, option pool unallocations, and exit waterfalls to ensure founders retain true economic upside.',
      fr: 'Simulez les tours de table successifs pour garantir l’alignement des intérêts et la part du fondateur.',
      zh: '实时推演多轮稀释、投前/投后设立期权池对股权的真实冲击，掌握每一百分点背后的千万级财富去向。',
    },
    keyTakeaway: {
      en: 'Never agree to pre-money option pool shuffles without an itemized 18-month hiring forecast.',
      fr: 'Ne jamais céder sur un pool de 20% pré-money sans plan de recrutement audité.',
      zh: '绝不接受缺乏18个月实际招募预算支撑的20%投前单方虚高期权池切分。',
    },
    actionLabel: {
      en: 'Launch Dilution Sandbox',
      fr: 'Lancer le Simulateur',
      zh: '启动股权推演沙盘',
    },
    actionTargetTab: 'simulators',
  },
  {
    id: 'pillar_negotiation',
    number: '02',
    title: {
      en: 'AI Investor High-Stakes Duel',
      fr: 'Duel de Négociation VC IA',
      zh: 'AI投资人极限压价实战博弈',
    },
    subtitle: {
      en: 'Real-time live battle against predatory partner Marcus Vance. Master somatic composure under pressure.',
      fr: 'Confrontez Marcus Vance sous pression réelle sans fléchir ni réagir émotionnellement.',
      zh: '直面凶悍VC合伙人马库斯·万斯的连续极限施压，在心率飙升中保持冰冷理性。',
    },
    tag: {
      en: 'High-Stakes Game Theory',
      fr: 'Théorie des Jeux',
      zh: '战术博弈对抗',
    },
    icon: Flame,
    color: {
      border: 'border-rose-500/25',
      borderActive: 'border-rose-400/60',
      bgGradient: 'from-[#260D1C]/98 via-[#180711]/95 to-[#0C0308]',
      collapsedBg: 'bg-gradient-to-b from-[#25101F]/85 via-[#180A14]/90 to-[#0E050B]/95 hover:from-[#2F1427]/90 hover:to-[#150711]',
      text: 'text-rose-300',
      accent: 'bg-rose-400',
      glow: 'shadow-[0_16px_40px_rgba(244,63,94,0.18),inset_0_1px_1px_rgba(255,255,255,0.18)]',
    },
    metrics: [
      { label: { en: 'Somatic Pause', fr: 'Pause Somatique', zh: '战术生理深呼吸' }, value: '4.0 Seconds' },
      { label: { en: 'Deal Temperature', fr: 'Thermostat Duel', zh: '谈判博弈温度' }, value: 'Dynamic' },
      { label: { en: 'Success Ratio', fr: 'Taux Victoire', zh: '合伙人降伏率' }, value: 'Top 5%' },
    ],
    description: {
      en: 'Engineered with realistic behavioral scripts: bluff detection, sudden valuation cuts, and poison-pill introductions.',
      fr: 'Algorithme comportemental réaliste : feintes, baisses surprises de valo et clauses pièges.',
      zh: '搭载拟真合伙人对抗模型：秒识估值虚晃一枪、试探性撤资威胁与夜半突袭签署意向书。',
    },
    keyTakeaway: {
      en: 'Indignation destroys deal equity; silence combined with cold mathematical anchors dismantles predatory tactics.',
      fr: 'La colère ruine la négociation ; le silence armé de chiffres rigoureux désamorce l’agressivité.',
      zh: '愤怒是谈判中最昂贵的毒药；微笑与严谨数理对冲是击溃资本傲慢的最强利刃。',
    },
    actionLabel: {
      en: 'Enter Investor Showdown',
      fr: 'Entrer dans l’Arène',
      zh: '立即进入博弈竞技场',
    },
    actionTargetTab: 'negotiation',
  },
  {
    id: 'pillar_termsheet',
    number: '03',
    title: {
      en: 'Term Sheet Poison-Pill Radar',
      fr: 'Radar Anti-Clauses Toxiques',
      zh: '意向书暗坑排雷与治理护盾',
    },
    subtitle: {
      en: 'Surgical clause-by-clause inspection: drag-along thresholds, veto powers, and liquidation traps.',
      fr: 'Inspection chirurgicale des droits de veto, drag-along et mécanismes de blocage.',
      zh: '逐句逐字外科手术式排查：领售权门槛、一票否决权蔓延与反稀释毒丸条款。',
    },
    tag: {
      en: 'Legal Governance Shield',
      fr: 'Gouvernance & Droit',
      zh: '公司治理护城河',
    },
    icon: FileSpreadsheet,
    color: {
      border: 'border-amber-500/30',
      borderActive: 'border-amber-400/70',
      bgGradient: 'from-[#281A08]/98 via-[#190F05]/95 to-[#0D0702]',
      collapsedBg: 'bg-gradient-to-b from-[#261B0D]/85 via-[#191107]/90 to-[#0E0A04]/95 hover:from-[#312310]/90 hover:to-[#170E05]',
      text: 'text-amber-300',
      accent: 'bg-amber-400',
      glow: 'shadow-[0_16px_40px_rgba(245,158,11,0.22),inset_0_1px_1px_rgba(255,255,255,0.22)]',
    },
    metrics: [
      { label: { en: 'Board Balance', fr: 'Équilibre Conseil', zh: '董事会治理结构' }, value: '2-2-1 Ratio' },
      { label: { en: 'Drag-Along Gate', fr: 'Seuil Drag-Along', zh: '领售权触发门槛' }, value: 'Founder OK' },
      { label: { en: 'Veto Scope', fr: 'Périmètre Veto', zh: '否决权安全边界' }, value: 'Major Only' },
    ],
    description: {
      en: 'Audit standard and aggressive clauses side-by-side with instant green/yellow/red risk alerts.',
      fr: 'Comparez instantanément les clauses standard vs toxiques avec classification des risques par couleur.',
      zh: '对比行业合规基线与激进掠夺条款，掌握保护性条款的精准边界，守住公司控股主导权。',
    },
    keyTakeaway: {
      en: 'A high valuation paired with toxic governance conditions is an optical illusion for losing control.',
      fr: 'Une valorisation flatteuse avec une gouvernance toxique équivaut à une expropriation différée.',
      zh: '用丧失公司控制权换取虚高估值，是初创企业在繁荣假象下最危险的自掘坟墓。',
    },
    actionLabel: {
      en: 'Scan Sample Term Sheets',
      fr: 'Analyser un Term Sheet',
      zh: '开启意向书雷达排查',
    },
    actionTargetTab: 'termsheet',
  },
  {
    id: 'pillar_psychology',
    number: '04',
    title: {
      en: '12 Neuro-Cognitive Mind Games',
      fr: '12 Jeux Cérébraux Neuro-Psy',
      zh: '十二项高阶心智博弈实验室',
    },
    subtitle: {
      en: 'Calibrate prefrontal inhibition, working memory capacity, and somatic risk intuition under deal heat.',
      fr: 'Musclez l’inhibition préfrontale, la mémoire de travail et l’intuition du risque viscéral.',
      zh: '以经典实验范式全面强化前额叶神经刹车、瞬时工作记忆与潜意识避险直觉。',
    },
    tag: {
      en: 'Cognitive Neuro-Lab',
      fr: 'Laboratoire Neuro-Cognitif',
      zh: '心智神经实验室',
    },
    icon: Brain,
    color: {
      border: 'border-purple-500/25',
      borderActive: 'border-purple-400/60',
      bgGradient: 'from-[#1E0F33]/98 via-[#120720]/95 to-[#090310]',
      collapsedBg: 'bg-gradient-to-b from-[#1C102C]/85 via-[#120A1D]/90 to-[#0A0511]/95 hover:from-[#25153A]/90 hover:to-[#12061E]',
      text: 'text-purple-300',
      accent: 'bg-purple-400',
      glow: 'shadow-[0_16px_40px_rgba(168,85,247,0.18),inset_0_1px_1px_rgba(255,255,255,0.18)]',
    },
    metrics: [
      { label: { en: 'Scientific Tests', fr: 'Tests Validés', zh: '经典科学范式' }, value: '12 Paradigms' },
      { label: { en: 'Executive Logos', fr: 'Logos Générés', zh: '专属高定徽章' }, value: '12 Custom 3D' },
      { label: { en: 'Target Networks', fr: 'Réseaux Cérébraux', zh: '核心靶向通路' }, value: 'PFC / vmPFC' },
    ],
    description: {
      en: 'From Stroop cognitive interference to the Iowa Gambling somatic markers and Wisconsin set-shifting.',
      fr: 'De Stroop au test d’Iowa et à la flexibilité de Wisconsin, renforcez vos réflexes cognitifs d’élite.',
      zh: '从斯特鲁普抗干扰、爱荷华潜意识风险标记到威斯康星认知灵活性跃迁，全方位锻造高维领袖心智。',
    },
    keyTakeaway: {
      en: 'The founder’s autonomic nervous system is the ultimate competitive moat at the negotiation table.',
      fr: 'Le système nerveux du dirigeant est son avantage concurrentiel le plus imprenable.',
      zh: '创始人的自律神经反应与波澜不惊的心理素质，是资本谈判桌上真正不可被复制的终极护城河。',
    },
    actionLabel: {
      en: 'Explore 12 Mind Games',
      fr: 'Relever les 12 Défis',
      zh: '进入12项心智挑战',
    },
    actionTargetTab: 'psychology',
  },
  {
    id: 'pillar_mindfulness',
    number: '05',
    title: {
      en: 'Stoic Composure & Zen Sanctuary',
      fr: 'Sanctuaire Zen & Stoïcisme',
      zh: '正念定力与斯多葛从容之境',
    },
    subtitle: {
      en: 'Instant heart rate vagal resonance, box breathing, and radical unshakeable equanimity in turbulent waters.',
      fr: 'Cohérence cardiaque vagale, respiration carrée et calme souverain face à l’incertitude.',
      zh: '以4-4-4盒式呼吸激活迷走神经抗压回路，化解生死抉择前的焦虑与生理应激。',
    },
    tag: {
      en: 'Stoic Equanimity',
      fr: 'Sérénité Stoïque',
      zh: '斯多葛定力心法',
    },
    icon: Sparkles,
    color: {
      border: 'border-emerald-500/25',
      borderActive: 'border-emerald-400/60',
      bgGradient: 'from-[#0B241A]/98 via-[#061711]/95 to-[#030C08]',
      collapsedBg: 'bg-gradient-to-b from-[#0E231C]/85 via-[#081813]/90 to-[#040D0A]/95 hover:from-[#132E25]/90 hover:to-[#081912]',
      text: 'text-emerald-300',
      accent: 'bg-emerald-400',
      glow: 'shadow-[0_16px_40px_rgba(16,185,129,0.18),inset_0_1px_1px_rgba(255,255,255,0.18)]',
    },
    metrics: [
      { label: { en: 'Cadence Breath', fr: 'Rythme Respiratoire', zh: '盒式战术呼吸' }, value: '4-4-4-4 Sec' },
      { label: { en: 'Cortisol Reset', fr: 'Baisse Cortisol', zh: '皮质醇降解率' }, value: '-38% Vagal' },
      { label: { en: 'Sanctuary State', fr: 'État Mental', zh: '定力心智境界' }, value: 'Equanimity' },
    ],
    description: {
      en: 'Equips executives with physiological resets to silence amygdala panic before walking into high-stakes boardroom votes.',
      fr: 'Permet de calmer l’amygdale avant les votes décisifs en conseil d’administration.',
      zh: '赋予企业领袖秒级神经镇定能力：在重大董事会投票与估值拉锯前平息杏仁核恐慌。',
    },
    keyTakeaway: {
      en: 'He who masters his breath and inner pulse dictates the rhythm of the entire room.',
      fr: 'Celui qui contrôle son souffle et son pouls maîtrise le tempo de toute l’assemblée.',
      zh: '凡能从容呼吸并掌控自身心跳节律者，必能降维掌控整间会议室的博弈气场。',
    },
    actionLabel: {
      en: 'Open Mindful Sanctuary',
      fr: 'Ouvrir le Sanctuaire',
      zh: '步入正念定力殿堂',
    },
    actionTargetTab: 'mindfulness',
  },
];

interface HorizontalAccordionProps {
  pillars?: AccordionPillar[];
  initialExpandedId?: string | null;
  className?: string;
}

export const HorizontalAccordion: React.FC<HorizontalAccordionProps> = ({
  pillars = DEFAULT_PILLARS,
  initialExpandedId = 'pillar_captable',
  className = '',
}) => {
  const { language, setActiveTab } = useApp();

  // Active expanded strip id; null means all strips are equal-width narrow strips (默认等宽窄条)
  const [expandedId, setExpandedId] = useState<string | null>(initialExpandedId);

  const toggleItem = (id: string) => {
    // If clicking currently expanded item, collapse to equal-width narrow strips
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const isAllEqual = expandedId === null;

  return (
    <div className={`relative w-full rounded-3xl bg-gradient-to-b from-[#14182C]/95 via-[#0C0F1E]/98 to-[#060812] border border-amber-400/25 p-5 sm:p-8 shadow-[0_28px_70px_-15px_rgba(0,0,0,0.85),0_0_36px_rgba(217,119,6,0.08),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden ${className}`}>
      {/* Background ambient lighting meshes with artistic color coordination */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-radial from-amber-500/12 via-purple-600/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-radial from-cyan-500/10 via-emerald-600/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-x-16 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/40 to-transparent pointer-events-none" />

      {/* Component Top Header & Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest uppercase font-semibold text-amber-300/90">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'fr'
                ? '01 · ARCHITECTURE DE L’ACCORDÉON STRATÉGIQUE'
                : language === 'zh'
                ? '01 · 创投五大核心维度战略手风琴'
                : '01 · EXECUTIVE STRATEGIC PILLARS'}
            </span>
            <span aria-hidden="true" className="text-amber-500/40">·</span>
            <span className="text-stone-400">
              {language === 'zh' ? '动态展开 & 延迟淡入' : 'Dynamic Reveal'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif-luxury font-medium text-white flex items-center space-x-3 tracking-tight">
            <span>
              {language === 'fr'
                ? 'Cinq Piliers Stratégiques de l’Entreprise'
                : language === 'zh'
                ? '创投五维全景战略手风琴'
                : 'Five Sovereign Executive Pillars'}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-stone-300/90 max-w-2xl leading-relaxed">
            {language === 'fr'
              ? 'Par défaut bandes étroites égales. Cliquez pour déployer, rétrécir les autres et révéler le contenu en fondu différé.'
              : language === 'zh'
              ? '默认等宽纤细窄条排列。轻触任一维度即平滑变宽展现纵深推演，其余自适应收窄让位，核心指标有序延迟淡入。'
              : 'Equal-width narrow strips by default. Click any strip to expand wider while others narrow, with delayed content fade-in.'}
          </p>
        </div>

        {/* Action Toggle Mode: Equalize vs Auto-Expand */}
        <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
          <button
            onClick={() => setExpandedId(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95 ${
              isAllEqual
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-[0_0_16px_rgba(245,158,11,0.35)]'
                : 'bg-white/[0.05] text-stone-300 hover:text-white border border-white/10 hover:border-amber-400/40'
            }`}
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>
              {language === 'fr'
                ? 'Tous Égaux'
                : language === 'zh'
                ? '全部恢复等宽窄条'
                : 'Equal Strips'}
            </span>
          </button>
          {!isAllEqual && (
            <button
              onClick={() => setExpandedId(pillars[0].id)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium bg-white/[0.04] text-stone-300 hover:text-white border border-white/10 hover:border-amber-400/40 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'zh' ? '重置首项展开' : 'Reset First'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Horizontal Accordion Container */}
      <div className="relative z-10 pt-6">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-3.5 w-full min-h-[500px] md:h-[470px] overflow-hidden select-none">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isExpanded = expandedId === pillar.id;

            // Flex calculations:
            const flexClass = isAllEqual
              ? 'flex-1 md:flex-1'
              : isExpanded
              ? 'flex-[4.2] md:flex-[4.2]'
              : 'flex-1 md:flex-[0.75]';

            return (
              <div
                key={pillar.id}
                onClick={() => toggleItem(pillar.id)}
                className={`relative rounded-2xl md:rounded-3xl border transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1) cursor-pointer overflow-hidden flex flex-col justify-between ${flexClass} ${
                  isExpanded
                    ? `${pillar.color.borderActive} ${pillar.color.glow} bg-gradient-to-br ${pillar.color.bgGradient}`
                    : `${pillar.color.border} ${pillar.color.collapsedBg} shadow-[0_10px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.7)]`
                }`}
              >
                {/* Top ambient glint */}
                <div
                  className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-current to-transparent transition-opacity duration-300 ${
                    isExpanded ? 'opacity-100' : 'opacity-25'
                  } ${pillar.color.text}`}
                />

                {/* ========================================================
                    CASE 1: COLLAPSED NARROW STRIP VIEW (其余同步收窄)
                    ======================================================== */}
                {!isExpanded && (
                  <div className="h-full w-full p-3 sm:p-4 flex flex-col justify-between items-center text-center transition-opacity duration-300">
                    {/* Number & Icon */}
                    <div className="space-y-2.5 flex flex-col items-center">
                      <span className="w-7 h-7 rounded-lg bg-white/[0.05] text-amber-200/90 font-serif-luxury text-xs font-bold flex items-center justify-center border border-amber-400/25 shadow-xs">
                        {pillar.number}
                      </span>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-inner ${pillar.color.accent}/20 ${pillar.color.text} border border-current/25`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Vertical Title in narrow mode */}
                    <div className="my-auto py-2 flex flex-col items-center justify-center">
                      <span className="hidden md:block writing-mode-vertical text-xs font-serif-luxury font-medium text-stone-200 tracking-widest line-clamp-1 py-1 drop-shadow-sm">
                        {pillar.title[language]}
                      </span>
                      <span className="md:hidden text-xs font-serif-luxury font-medium text-stone-200">
                        {pillar.title[language]}
                      </span>
                    </div>

                    {/* Bottom Indicator Prompt */}
                    <div className="flex flex-col items-center space-y-1.5 pb-1">
                      <span
                        className={`w-2 h-2 rounded-full ${pillar.color.accent} shadow-[0_0_8px_currentColor]`}
                      />
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </div>
                )}

                {/* ========================================================
                    CASE 2: EXPANDED WIDE VIEW (点击展开变宽，内容延迟淡入)
                    Notice the delayed fade-in CSS:
                    `transition-all duration-400 delay-200 ease-out`
                    ======================================================== */}
                {isExpanded && (
                  <div className="h-full w-full p-5 sm:p-7 flex flex-col justify-between overflow-y-auto no-scrollbar transition-all duration-400 delay-200 ease-out opacity-100 translate-y-0">
                    <div className="space-y-4">
                      {/* Expanded Header: Number, Tag, Action badge */}
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-7 h-7 rounded-lg bg-white/[0.08] text-amber-200 font-serif-luxury font-bold flex items-center justify-center text-xs border border-amber-400/35 shadow-xs">
                            #{pillar.number}
                          </span>
                          <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-stone-300">
                            {pillar.tag[language]}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[10px] text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                          <CheckCircle2 className="w-3 h-3 text-amber-400" />
                          <span>{language === 'zh' ? '已激活全景推演' : 'Active Focus'}</span>
                        </div>
                      </div>

                      {/* Title & Icon Header */}
                      <div className="flex items-start space-x-3.5 pt-1">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${pillar.color.accent}/25 border border-current/35 ${pillar.color.text}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif-luxury font-bold text-lg sm:text-xl md:text-2xl text-white tracking-wide leading-tight">
                            {pillar.title[language]}
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-300/90 mt-1 leading-snug">
                            {pillar.subtitle[language]}
                          </p>
                        </div>
                      </div>

                      {/* 3 Prominent Metrics Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        {pillar.metrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 flex flex-col justify-between space-y-1 shadow-inner"
                          >
                            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider truncate">
                              {metric.label[language]}
                            </span>
                            <span
                              className={`text-sm sm:text-base font-bold font-mono tabular-nums ${pillar.color.text}`}
                            >
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Deep Strategic Description */}
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-300/90">
                          <Activity className="w-3.5 h-3.5 text-amber-400" />
                          <span>{language === 'fr' ? 'Mécanisme Décisionnel :' : language === 'zh' ? '核心决断逻辑与推演机制：' : 'Executive Mechanism:'}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-200/95 leading-relaxed">
                          {pillar.description[language]}
                        </p>
                      </div>

                      {/* Key Takeaway / Tactical Shield */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-400/40 flex items-start space-x-2.5 text-xs sm:text-sm">
                        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-amber-100/95 leading-snug">
                          <span className="font-bold font-mono text-amber-300 mr-2">
                            {language === 'zh' ? '【底线铁律】' : '[SOVEREIGN RULE]'}
                          </span>
                          {pillar.keyTakeaway[language]}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 mt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] font-mono text-stone-400 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{language === 'zh' ? '系统已准备就绪 · 点击直接进入专项推演' : 'Ready · Direct integration'}</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab(pillar.actionTargetTab);
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-950 flex items-center space-x-2 shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all active:scale-95 cursor-pointer bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 hover:shadow-[0_6px_25px_rgba(245,158,11,0.5)]"
                      >
                        <span>{pillar.actionLabel[language]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Indicator */}
        <div className="mt-3.5 flex items-center justify-between text-xs text-stone-400/90 px-1 font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            <span>
              {language === 'fr'
                ? 'Astuce : Cliquez sur un volet pour le déployer et synchroniser les autres'
                : language === 'zh'
                ? '微交互提示：轻触任一维度平滑展开，其余维度自适应收窄；指标有序延迟淡入'
                : 'Interaction cue: Tap any narrow strip to expand smoothly; content materializes with delayed fade-in'}
            </span>
          </div>
          <span className="text-[11px] text-amber-300/80">
            {isAllEqual ? (language === 'zh' ? '当前：全等宽状态' : 'Equalized') : (language === 'zh' ? '当前：焦点展开状态' : 'Expanded Mode')}
          </span>
        </div>
      </div>
    </div>
  );
};
