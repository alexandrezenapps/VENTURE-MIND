import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  PieChart,
  DollarSign,
  Flame,
  Brain,
  Layers,
  ChevronRight,
  Volume2,
  FileCheck2,
  Scale,
  Sparkles,
  Compass,
  Aperture,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  Quote,
  Play,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { termsData } from '../../data/termsData';
import { psychologyPrinciples } from '../../data/psychologyData';
import { MindfulPauseWidget } from '../mindfulness/MindfulPauseWidget';
import { OverlappingCardStack } from '../common/OverlappingCardStack';
import { DOMAIN_STACKS_DATA } from '../../data/overlappingCardsData';

// Image paths from batch generation
const IMAGES = {
  salon: '/src/assets/images/dashboard_executive_salon_1793030559001.jpg',
  equilibrium: '/src/assets/images/dashboard_zen_equilibrium_1793030559181.jpg',
  gears: '/src/assets/images/dashboard_precision_gears_1793030560318.jpg',
};

// Curated high-prestige strategic aphorisms
const STRATEGIC_APHORISMS = [
  {
    author: 'Sun Tzu',
    work: { en: 'The Art of War', fr: 'L’Art de la Guerre', zh: '孙子兵法' },
    quote: {
      en: 'Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.',
      fr: 'Les guerriers victorieux triomphent d’abord avant d’engager la bataille, tandis que les vaincus se battent d’abord en espérant vaincre.',
      zh: '胜兵先胜而后求战，败兵先战而后求胜。在签署投资协议前，胜负早已在估值模型与定力交锋中注定。',
    },
    context: {
      en: 'Venture Discipline: Never negotiate from desperation; model every clause before entering the room.',
      fr: 'Discipline VC : Ne négociez jamais dans l’urgence ; modélisez chaque clause avant de vous asseoir.',
      zh: '风投启示：永远不要在被动中谈判，进入会议室前算清所有隐藏清算陷阱。',
    },
  },
  {
    author: 'Seneca',
    work: { en: 'Letters from a Stoic', fr: 'Lettres à Lucilius', zh: '塞涅卡道德书简' },
    quote: {
      en: 'We suffer more often in imagination than in reality.',
      fr: 'Nous souffrons bien plus souvent en imagination qu’en réalité.',
      zh: '我们在恐惧臆想中所受的折磨，远多于客观现实本身。面对极限压价，唯定力可破局。',
    },
    context: {
      en: 'Mindful Composure: Investor rejection or harsh term sheets are tactical moments, not existential verdicts.',
      fr: 'Sérénité Exécutive : Un refus d’investisseur ou un term sheet agressif est un levier tactique, jamais une fatalité.',
      zh: '心理定力：投资人的挑剔并非对你的否定，而是测试你对股权护城河坚守的试金石。',
    },
  },
  {
    author: 'Charlie Munger',
    work: { en: 'Poor Charlie’s Almanack', fr: 'L’Almanach de Charlie', zh: '穷查理宝典' },
    quote: {
      en: 'The big money is not in the buying and the selling, but in the waiting.',
      fr: 'La grande fortune ne réside ni dans l’achat ni dans la vente, mais dans la patience réfléchie.',
      zh: '高维资本的真正暴利不在于买进卖出的频繁操作，而在于深思熟虑后的从容守候。',
    },
    context: {
      en: 'Cap Table Horizon: Dilution compounding requires decade-scale vision and surgical control of liquidation waterfalls.',
      fr: 'Horizon Capital : La création de valeur exige une vision décennale et un contrôle chirurgical de la dilution.',
      zh: '股权智慧：期权池与反稀释的复利效应需要以十年为刻度来审视。',
    },
  },
  {
    author: 'Peter Thiel',
    work: { en: 'Zero to One', fr: 'De Zéro à Un', zh: '从0到1' },
    quote: {
      en: 'Monopoly is the condition of every successful business.',
      fr: 'Le monopole créatif est la condition de toute entreprise véritablement pérenne.',
      zh: '垄断是一切成功商业的先决条件。在资本竞争中，差异化定力是无上护城河。',
    },
    context: {
      en: 'Pricing Power: True defensibility allows founders to command pristine terms with zero participating liquidation.',
      fr: 'Pouvoir de Négociation : Une véritable différenciation permet d’imposer des termes non-participatifs stricts.',
      zh: '谈判要义：真正的不可替代性是创始人争取1x非参与清算优先权的绝对底气。',
    },
  },
];

// Interactive Strategic Dilemma of the Day
const DAILY_DILEMMA = {
  id: 'dilemma-01',
  title: {
    en: 'The Predatory Term Sheet Paradox',
    fr: 'Le Paradoxe du Term Sheet Prédateur',
    zh: '陷阱意向书与破局博弈',
  },
  context: {
    en: 'A Tier-1 venture fund offers you $5,000,000 at a seemingly high $25M post-money valuation. However, the legal annex specifies: (1) 2x Participating Liquidation Preference with no cap, and (2) a 20% unallocated Option Pool created entirely pre-money at founders’ sole dilution.',
    fr: 'Un fonds prestigieux vous propose 5 000 000 $ sur une valorisation post-money alléchante de 25 M$. Cependant, l’annexe juridique stipule : (1) Une liquidation 2x participante sans plafond, et (2) un pool d’options de 20% créé intégralement en pre-money aux dépens exclusifs des fondateurs.',
    zh: '一家一线风投向你开出500万美元投资、2500万美元Post-Money高估值意向书。但条款附件注明：(1) 2倍参与型清算优先权（无上限双重分红），(2) 20%未分配期权池在投前全部由创始人单方稀释。',
  },
  options: [
    {
      id: 'opt-a',
      label: {
        en: 'Accept immediately to leverage the prestigious fund brand for PR and hiring.',
        fr: 'Accepter immédiatement pour profiter du prestige de la marque et accélérer le recrutement.',
        zh: '立即全盘接受，借助一线风投品牌效应进行PR造势和高管招募。',
      },
      isOptimal: false,
      feedback: {
        en: 'Critical Danger! The 2x participating preference means the VC takes $10M first PLUS 20% of the remainder. In an exit under $40M, founders walk away with virtually zero.',
        fr: 'Danger Critique ! La préférence 2x participante confère au VC 10 M$ prioritaires PLUS 20% du reliquat. Lors d’une sortie sous 40 M$, les fondateurs ne touchent quasiment rien.',
        zh: '致命陷阱！2倍参与型意味着退出时VC先拿走1000万美元底金，再参与剩余80%的按股分配。若以4000万美元退出，创始人实际收益几乎被彻底榨干。',
      },
    },
    {
      id: 'opt-b',
      label: {
        en: 'Counter-offer: 1x Non-Participating preference, and budget a realistic 18-month hiring pool of 8% shared post-money.',
        fr: 'Contre-proposition chirurgicale : Préférence 1x non-participante standard, et dimensionnement d’un pool d’options réaliste de 8% sur 18 mois.',
        zh: '精准还击：坚持1倍非参与型清算标准条款，并将期权池调整为18个月内实际所需的8%合理规模。',
      },
      isOptimal: true,
      feedback: {
        en: 'Masterful Venture Acumen! 1x Non-Participating aligns incentives completely. Reducing the unallocated pool from 20% to 8% preserves upwards of 12% founder equity.',
        fr: 'Maîtrise Stratégique Absolue ! Le 1x non-participant réaligne les intérêts. Réduire le pool non alloué de 20% à 8% préserve plus de 12% du capital des fondateurs.',
        zh: '最高段位对决！1倍非参与型彻底消除双头套现，将未分配期权池从20%降至8%可为创始团队直接守住超过12%的核心股权！',
      },
    },
    {
      id: 'opt-c',
      label: {
        en: 'Break off talks indignantly and publicly accuse the partner of predatory practices.',
        fr: 'Rompre brutalement les pourparlers et dénoncer publiquement les pratiques agressives du fonds.',
        zh: '情绪失控并单方面终止谈判，公开指责该合伙人手段刻薄。',
      },
      isOptimal: false,
      feedback: {
        en: 'Emotional Failure! Venture capital is a small, interconnected ecosystem. Extreme indignation destroys deal reputation. Always counter with cold mathematical precision.',
        fr: 'Faillite Émotionnelle ! L’écosystème VC est ultra-connecté. La colère nuit irrémédiablement à votre réputation. Répondez toujours avec une froide précision mathématique.',
        zh: '定力崩塌！风投圈极度重叠互通，情绪化对抗会摧毁信誉声望。真正的高手永远用严谨的数学模型和从容微笑来进行降维博弈。',
      },
    },
  ],
};

export const DashboardView: React.FC = () => {
  const {
    language,
    currency,
    progress,
    setActiveTab,
    setSelectedTermId,
    setSelectedSimulator,
    setIsOpeningPortalOpen,
    setIsCardStackModalOpen,
    speak,
    formatMoney,
  } = useApp();

  // Perspective tab: 'panoramic' | 'dilemma' | 'forge'
  const [activePerspective, setActivePerspective] = useState<'panoramic' | 'dilemma' | 'forge'>('panoramic');

  // Aphorism index
  const [aphorismIndex, setAphorismIndex] = useState(0);

  // Dilemma state
  const [selectedDilemmaOption, setSelectedDilemmaOption] = useState<string | null>(null);
  const [hasSubmittedDilemma, setHasSubmittedDilemma] = useState(false);

  // In-Dashboard Quick Dilution Forge state
  const [preMoneyVal, setPreMoneyVal] = useState<number>(10000000); // 10M
  const [roundInvestment, setRoundInvestment] = useState<number>(2500000); // 2.5M
  const [optionPoolPercent, setOptionPoolPercent] = useState<number>(10); // 10%

  // Calculations for quick forge
  const postMoneyVal = preMoneyVal + roundInvestment;
  const investorSharePct = (roundInvestment / postMoneyVal) * 100;
  // Option pool created pre-money reduces founder share
  const effectiveFounderPct = Math.max(0, 100 - investorSharePct - optionPoolPercent);

  const dailyTerm = termsData.find((t) => t.id === 'term_047') || termsData[0]; // Liquidation Preference
  const dailyPsychology = psychologyPrinciples[0]; // 4-second tactical pause

  const recommendedTerms = useMemo(() => {
    return termsData
      .filter((t) => !progress.completedLessons.includes(t.id))
      .slice(0, 3);
  }, [progress.completedLessons]);

  const currentAphorism = STRATEGIC_APHORISMS[aphorismIndex];

  const handleNextAphorism = () => {
    setAphorismIndex((prev) => (prev + 1) % STRATEGIC_APHORISMS.length);
  };

  const handleBriefingAudio = () => {
    const textToSpeak =
      language === 'fr'
        ? `Briefing Exécutif Venture Mind. Leçon clé du jour : ${dailyTerm.canonical}. ${dailyTerm.shortDef.fr}. Règle de sérénité : ${dailyPsychology.name.fr}. ${currentAphorism.author} disait : ${currentAphorism.quote.fr}`
        : language === 'zh'
        ? `Venture Mind 每日主管简报。今日核心条款：${dailyTerm.canonical}。${dailyTerm.shortDef.zh}。正念定力心法：${dailyPsychology.name.zh}。${currentAphorism.author}的名言：${currentAphorism.quote.zh}`
        : `Executive Venture Mind Briefing. Daily critical term: ${dailyTerm.canonical}. ${dailyTerm.shortDef.en}. Mindful Composure: ${dailyPsychology.name.en}. ${currentAphorism.author} noted: ${currentAphorism.quote.en}`;
    speak(textToSpeak);
  };

  const t = {
    greeting: {
      en: 'Welcome, Principal & Architect',
      fr: 'Bienvenue, Associé Directeur & Fondateur',
      zh: '欢迎，主管合伙人与创业先锋',
    },
    tagline: {
      en: 'Executive venture intelligence, live cap table modeling, and strategic negotiation composure.',
      fr: 'Haute intelligence capital-risque, modélisation de capitalisation et sérénité souveraine en négociation.',
      zh: '在资本博弈的风暴中保持正念定力：深度研习股权架构、推演清算瀑布并从容应对极限压价。',
    },
    perspectives: {
      panoramic: { en: '01. Strategic Salon', fr: '01. Salon Panoramique', zh: '01. 全景战略厅' },
      dilemma: { en: '02. Deal Dilemma', fr: '02. Dilemme du Jour', zh: '02. 意向书决断' },
      forge: { en: '03. Dilution Forge', fr: '03. Forge Financière', zh: '03. 股权推演沙盘' },
    },
    dailyChallenge: {
      en: 'Term Sheet Breakdown of the Day',
      fr: 'Décryptage Term Sheet du Jour',
      zh: '今日关键条款拆解',
    },
    psychoTip: {
      en: 'Mindful Negotiation Protocol',
      fr: 'Protocole de Sérénité & Négociation',
      zh: '正念博弈心法要略',
    },
    quickLaunch: {
      en: 'Tactical Financial Simulators',
      fr: 'Simulateurs Financiers de Précision',
      zh: '高阶金融推演沙盘',
    },
    nextLessons: {
      en: 'Recommended Learning Curve',
      fr: 'Parcours d’Excellence Recommandé',
      zh: '下一阶段精进通关',
    },
  };

  return (
    <div className="space-y-7 md:space-y-9 max-w-7xl mx-auto pb-mobile-nav">
      {/* ========================================================
          1. GALLERY-GRADE EXECUTIVE SALON HERO BANNER
          ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-400/35 dark:border-amber-400/25 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65),0_0_36px_rgba(229,184,66,0.12),inset_0_1px_1px_rgba(255,255,255,0.18)] min-h-[380px] flex flex-col justify-between">
        {/* Real Architectural Image Background with Measured Contrast Scrim */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src={IMAGES.salon}
            alt="Executive Venture Capital Salon"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 filter brightness-90 contrast-105"
          />
          {/* Multi-layered measured gradient scrim for flawless WCAG contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0E17]/95 via-[#0C0E17]/88 to-[#0C0E17]/65 dark:from-[#090B12]/98 dark:via-[#0E121E]/92 dark:to-[#141829]/75" />
          <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Top Header Region: Brand Accents & Audio Briefing Action */}
        <div className="p-6 sm:p-8 md:p-10 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Editorial Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 font-mono">
              <span className="font-semibold tracking-wider uppercase text-amber-200">
                {progress.levelName[language]}
              </span>
              <span aria-hidden="true" className="text-amber-500/60">·</span>
              <span className="text-stone-300">
                {progress.streakDays}{' '}
                {language === 'fr'
                  ? 'jours de présence consécutifs'
                  : language === 'zh'
                  ? '天连续研习定力'
                  : 'consecutive strategic days'}
              </span>
              <span aria-hidden="true" className="text-amber-500/60">·</span>
              <span className="text-stone-300">
                {language === 'fr' ? 'Édition Haute Direction' : language === 'zh' ? '主管合伙人旗舰版' : 'Executive Edition'}
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="fluid-display-hero font-serif-luxury font-medium tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {t.greeting[language]}
            </h1>

            {/* Subtitle */}
            <p className="text-stone-200/90 fluid-subheading max-w-2xl leading-relaxed text-wrap-balance">
              {t.tagline[language]}
            </p>

            {/* Curated Living Aphorism */}
            <div className="mt-4 pt-4 border-t border-white/15 max-w-2xl flex items-start gap-3">
              <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                  « {currentAphorism.quote[language]} »
                </p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-amber-300/90">
                  <span className="font-bold">{currentAphorism.author}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-400">{currentAphorism.work[language]}</span>
                  <button
                    onClick={handleNextAphorism}
                    className="ml-2 underline hover:text-amber-200 cursor-pointer text-[10px]"
                    title="Changer de citation / Next aphorism"
                  >
                    {language === 'fr' ? 'Changer' : language === 'zh' ? '换一则' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Island: Sanctuaire, Briefing & Portails */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleBriefingAudio}
              className="px-4 py-2.5 rounded-2xl bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 font-medium text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'fr'
                  ? 'Écouter le Briefing'
                  : language === 'zh'
                  ? '收听每日主管简报'
                  : 'Play Daily Briefing'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('mindfulness')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'fr'
                  ? 'Sanctuaire Zen'
                  : language === 'zh'
                  ? '正念定力殿堂'
                  : 'Zen Sanctuary'}
              </span>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveTab('games')}
                className="flex-1 px-2.5 sm:px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-medium text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer shadow-xs"
                title="Launch Facing the Game #1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'fr' ? 'Face au Duel' : language === 'zh' ? '面对博弈' : 'Duel Arena'}</span>
              </button>
              <button
                onClick={() => setIsOpeningPortalOpen(true)}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 font-medium text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer"
              >
                <Aperture className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                <span>{language === 'fr' ? 'Art' : language === 'zh' ? '封面' : 'Art'}</span>
              </button>
              <button
                onClick={() => setIsCardStackModalOpen(true)}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 font-medium text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-300" />
                <span>{language === 'fr' ? 'Cartes' : language === 'zh' ? '卡组' : 'Cards'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Haute Horlogerie 4-Column Mathematical KPIs */}
        <div className="px-6 sm:px-8 md:px-10 py-4 bg-black/40 backdrop-blur-xl border-t border-amber-400/25 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative z-10">
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="fluid-stat-label text-stone-400">Venture IQ</div>
            <div className="fluid-stat font-bold text-emerald-400 mt-0.5 tabular-nums">
              {progress.ventureIQ}{' '}
              <span className="text-xs text-stone-400 font-normal">/ 180</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="fluid-stat-label text-stone-400">
              {language === 'fr' ? 'Leçons Maîtrisées' : language === 'zh' ? '核心课通透' : 'Mastered Lessons'}
            </div>
            <div className="fluid-stat font-bold text-amber-300 mt-0.5 tabular-nums">
              {progress.completedLessons.length}{' '}
              <span className="text-xs text-stone-400 font-normal">/ 100</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="fluid-stat-label text-stone-400">
              {language === 'fr' ? 'Score en Arène' : language === 'zh' ? '博弈实战分' : 'Arena Score'}
            </div>
            <div className="fluid-stat font-bold text-amber-200 mt-0.5 tabular-nums">
              {Object.values(progress.gameScores).reduce((a, b) => a + b, 0)}{' '}
              <span className="text-xs font-normal text-stone-400">pts</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="fluid-stat-label text-stone-400">
              {language === 'fr' ? 'Indice de Sérénité' : language === 'zh' ? '抗压定力率' : 'Composure Index'}
            </div>
            <div className="fluid-stat font-bold text-purple-300 mt-0.5 tabular-nums">
              {progress.radarCompetencies.psychology}%
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. ATELIER PERSPECTIVE SEGMENTED SWITCHER
          ======================================================== */}
      <div className="flex items-center justify-between border-b border-border-main dark:border-stone-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-surface-muted/90 dark:bg-stone-900/90 rounded-2xl border border-border-main/70 dark:border-stone-700/70">
          <button
            onClick={() => setActivePerspective('panoramic')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activePerspective === 'panoramic'
                ? 'bg-surface-main dark:bg-stone-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            {t.perspectives.panoramic[language]}
          </button>
          <button
            onClick={() => setActivePerspective('dilemma')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activePerspective === 'dilemma'
                ? 'bg-surface-main dark:bg-stone-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            {t.perspectives.dilemma[language]}
          </button>
          <button
            onClick={() => setActivePerspective('forge')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activePerspective === 'forge'
                ? 'bg-surface-main dark:bg-stone-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                : 'text-text-secondary dark:text-stone-400 hover:text-text-primary'
            }`}
          >
            {t.perspectives.forge[language]}
          </button>
        </div>

        <span className="hidden md:inline text-xs font-mono text-text-secondary dark:text-stone-400">
          {language === 'fr'
            ? 'Atelier de Précision & Décision Exécutive'
            : language === 'zh'
            ? '高维资本战略推演工作台'
            : 'Executive Decision & Modeling Atelier'}
        </span>
      </div>

      {/* ========================================================
          PERSPECTIVE 2: DEAL DILEMMA OF THE DAY
          ======================================================== */}
      {activePerspective === 'dilemma' && (
        <section className="p-6 sm:p-8 rounded-3xl glass-panel border-sophisticated space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider font-semibold">
                <Brain className="w-4 h-4" />
                <span>{DAILY_DILEMMA.title[language]}</span>
              </div>
              <h2 className="fluid-heading-2 font-heading font-bold text-text-primary dark:text-stone-100 mt-1">
                {language === 'fr' ? 'Dilemme de Négociation & Liquidation' : language === 'zh' ? '实战意向书博弈抉择' : 'Tactical Term Sheet Dilemma'}
              </h2>
            </div>
            <button
              onClick={() => {
                setSelectedDilemmaOption(null);
                setHasSubmittedDilemma(false);
              }}
              className="text-xs font-mono text-text-secondary dark:text-stone-400 hover:text-amber-500 flex items-center space-x-1 cursor-pointer self-start sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Réinitialiser le cas' : language === 'zh' ? '重置试炼' : 'Reset Case'}</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/25">
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-serif-luxury italic">
              "{DAILY_DILEMMA.context[language]}"
            </p>
          </div>

          {/* Decision options */}
          <div className="space-y-3">
            {DAILY_DILEMMA.options.map((opt) => {
              const isSelected = selectedDilemmaOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (!hasSubmittedDilemma) {
                      setSelectedDilemmaOption(opt.id);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 shadow-md'
                      : 'border-border-main dark:border-stone-800 hover:border-amber-400/40 bg-surface-main/60 dark:bg-stone-900/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500 text-white'
                          : 'border-stone-400 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-medium text-text-primary dark:text-stone-100">
                        {opt.label[language]}
                      </p>
                      {hasSubmittedDilemma && isSelected && (
                        <div
                          className={`mt-3 p-3 rounded-xl text-xs leading-relaxed ${
                            opt.isOptimal
                              ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          <span className="font-bold block mb-1">
                            {opt.isOptimal
                              ? language === 'fr'
                                ? 'Verdict : Décision Exemplaire (+50 XP)'
                                : language === 'zh'
                                ? '博弈裁决：登峰造极的定力 (+50 XP)'
                                : 'Verdict: Masterful Decision (+50 XP)'
                              : language === 'fr'
                              ? 'Verdict : Piège Non Déjoué'
                              : language === 'zh'
                              ? '博弈裁决：落入条款陷阱'
                              : 'Verdict: Pitfall Unresolved'}
                          </span>
                          {opt.feedback[language]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-text-secondary dark:text-stone-400 font-mono">
              {language === 'fr'
                ? 'Test d’acuité sous pression réelle'
                : language === 'zh'
                ? '极限真实场景推演'
                : 'Real-world pressure simulation'}
            </span>
            <button
              disabled={!selectedDilemmaOption || hasSubmittedDilemma}
              onClick={() => setHasSubmittedDilemma(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium text-xs sm:text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {language === 'fr' ? 'Valider la décision' : language === 'zh' ? '决断递交' : 'Submit Decision'}
            </button>
          </div>
        </section>
      )}

      {/* ========================================================
          PERSPECTIVE 3: IN-DASHBOARD DILUTION FORGE
          ======================================================== */}
      {activePerspective === 'forge' && (
        <section className="p-6 sm:p-8 rounded-3xl glass-panel border-sophisticated space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">
                <SlidersHorizontal className="w-4 h-4" />
                <span>{language === 'fr' ? 'Forge Rapide de Capitalisation' : language === 'zh' ? '即时股权推演工作台' : 'Live In-Dashboard Dilution Forge'}</span>
              </div>
              <h2 className="fluid-heading-2 font-heading font-bold text-text-primary dark:text-stone-100 mt-1">
                {language === 'fr' ? 'Simulation Immédiate Pre vs Post-Money' : language === 'zh' ? '投前投后与期权池动态精算' : 'Instant Pre vs Post-Money Dilution'}
              </h2>
            </div>
            <button
              onClick={() => {
                setSelectedSimulator('captable');
                setActiveTab('simulators');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer self-start sm:self-center"
            >
              <span>{language === 'fr' ? 'Ouvrir le simulateur complet' : language === 'zh' ? '进入全功能沙盘' : 'Full Simulator'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Sliders */}
            <div className="lg:col-span-2 space-y-5 p-5 rounded-2xl bg-surface-muted/60 dark:bg-stone-900/60 border border-border-main/70 dark:border-stone-800">
              {/* Slider 1: Pre-Money Valuation */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-text-secondary dark:text-stone-300">
                    {language === 'fr' ? 'Valorisation Pre-Money' : language === 'zh' ? '投前估值 (Pre-Money)' : 'Pre-Money Valuation'}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-sm">
                    {formatMoney(preMoneyVal)}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000000"
                  max="50000000"
                  step="500000"
                  value={preMoneyVal}
                  onChange={(e) => setPreMoneyVal(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                  <span>{formatMoney(2000000)}</span>
                  <span>{formatMoney(25000000)}</span>
                  <span>{formatMoney(50000000)}</span>
                </div>
              </div>

              {/* Slider 2: Investment Round */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-text-secondary dark:text-stone-300">
                    {language === 'fr' ? 'Montant Levé (Round Size)' : language === 'zh' ? '融资金额 (Round Size)' : 'Round Investment'}
                  </span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 tabular-nums text-sm">
                    {formatMoney(roundInvestment)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="15000000"
                  step="250000"
                  value={roundInvestment}
                  onChange={(e) => setRoundInvestment(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                  <span>{formatMoney(500000)}</span>
                  <span>{formatMoney(7500000)}</span>
                  <span>{formatMoney(15000000)}</span>
                </div>
              </div>

              {/* Slider 3: Option Pool % */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-text-secondary dark:text-stone-300">
                    {language === 'fr' ? 'Pool d’Options Pré-Money (BSPCE)' : language === 'zh' ? '投前期权池比例 (Option Pool)' : 'Pre-Money Option Pool'}
                  </span>
                  <span className="font-bold text-amber-500 tabular-nums text-sm">
                    {optionPoolPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={optionPoolPercent}
                  onChange={(e) => setOptionPoolPercent(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                  <span>0%</span>
                  <span>10% (standard)</span>
                  <span>25%</span>
                </div>
              </div>
            </div>

            {/* Live Distribution Gauges */}
            <div className="p-5 rounded-2xl bg-surface-muted/60 dark:bg-stone-900/60 border border-border-main/70 dark:border-stone-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                  {language === 'fr' ? 'Répartition Post-Financement' : language === 'zh' ? '投后股权最终分布' : 'Post-Funding Ownership'}
                </span>

                <div className="text-xl sm:text-2xl font-bold font-mono text-text-primary dark:text-stone-100 tabular-nums">
                  {formatMoney(postMoneyVal)}
                  <span className="text-xs text-stone-400 font-normal ml-1">Post-Money</span>
                </div>

                {/* Multi-segment equity bar */}
                <div className="mt-4 h-4 rounded-full overflow-hidden flex bg-stone-200 dark:bg-stone-800">
                  <div
                    style={{ width: `${effectiveFounderPct}%` }}
                    className="bg-emerald-500 transition-all duration-300"
                    title={`Founders: ${effectiveFounderPct.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${investorSharePct}%` }}
                    className="bg-cyan-500 transition-all duration-300"
                    title={`Investors: ${investorSharePct.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${optionPoolPercent}%` }}
                    className="bg-amber-500 transition-all duration-300"
                    title={`Option Pool: ${optionPoolPercent}%`}
                  />
                </div>

                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      {language === 'fr' ? 'Fondateurs Restant' : language === 'zh' ? '创始团队保留' : 'Founders Retained'}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {effectiveFounderPct.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      {language === 'fr' ? 'Nouveaux Investisseurs' : language === 'zh' ? '新投资人占比' : 'New Investors'}
                    </span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">
                      {investorSharePct.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      {language === 'fr' ? 'Pool d’Options' : language === 'zh' ? '期权池储备' : 'Option Pool'}
                    </span>
                    <span className="font-bold text-amber-500 tabular-nums">
                      {optionPoolPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border-main dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                {language === 'fr'
                  ? 'Avertissement de dilution : un pool de 10% en pre-money absorbe directement la part des fondateurs avant l’arrivée des fonds.'
                  : language === 'zh'
                  ? '精算警示：投前设立10%期权池意味着新投资人完全免于分摊，稀释压力100%落在创始人头上。'
                  : 'Notice: Pre-money option pool shuffles dilute existing shareholders prior to investment closing.'}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          PERSPECTIVE 1 (DEFAULT): STRATEGIC PANORAMA
          ======================================================== */}
      {/* Mindful Pause Widget (Tactical Composure Box Breathing) */}
      <MindfulPauseWidget />

      {/* Grid: Dual Masterpiece Cards (Daily Term & Mindful Psychology) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Daily Term Sheet Breakdown Card with Haute Horlogerie Visual Header */}
        <div className="rounded-3xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between border-sophisticated">
          {/* Subtle Image Header */}
          <div className="relative h-36 w-full overflow-hidden">
            <img
              src={IMAGES.gears}
              alt="Haute Horlogerie Precision Movement"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-main dark:from-[#131726] via-black/40 to-transparent" />
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200 font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30">
                {t.dailyChallenge[language]}
              </span>
              <span className="text-xs font-mono text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
                #{dailyTerm.id}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 pt-2 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-stone-100 font-heading">
                  {dailyTerm.canonical}
                </h3>
                <button
                  onClick={() => speak(`${dailyTerm.canonical}. ${dailyTerm.shortDef[language]}`)}
                  className="p-2 rounded-xl text-text-secondary hover:text-emerald-600 hover:bg-surface-muted dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Pronounce term"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-text-secondary dark:text-stone-400 font-mono mt-0.5">
                {language === 'fr' ? dailyTerm.fr : dailyTerm.zh}
              </p>

              <p className="text-xs text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
                {dailyTerm.shortDef[language]}
              </p>

              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                  {language === 'fr'
                    ? 'Sérénité Fondateur & Garde-Fous :'
                    : language === 'zh'
                    ? '创始人关键定力视角：'
                    : 'Founder Critical Takeaway:'}
                </span>
                <p className="text-emerald-950 dark:text-emerald-200 line-clamp-2 leading-relaxed">
                  {dailyTerm.founderView[language]}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border-main/70 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-text-secondary dark:text-stone-400 uppercase">
                {dailyTerm.difficulty} · {dailyTerm.category}
              </span>
              <button
                onClick={() => {
                  setSelectedTermId(dailyTerm.id);
                  setActiveTab('learn');
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>{language === 'fr' ? 'Leçon approfondie' : language === 'zh' ? '完整精讲' : 'Deep Lesson'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Daily Mindful Psychology Card with Zen Equilibrium Visual Header */}
        <div className="rounded-3xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between border-sophisticated">
          {/* Subtle Image Header */}
          <div className="relative h-36 w-full overflow-hidden">
            <img
              src={IMAGES.equilibrium}
              alt="Zen Equilibrium Meditation Stone"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-95 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-main dark:from-[#131726] via-black/35 to-transparent" />
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-200 font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-purple-400/30">
                {t.psychoTip[language]}
              </span>
              <span className="text-xs font-mono text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
                Rule #{dailyPsychology.number}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 pt-2 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-stone-100 font-heading">
                  {dailyPsychology.name[language]}
                </h3>
                <button
                  onClick={() => speak(`${dailyPsychology.name[language]}. ${dailyPsychology.definition[language]}`)}
                  className="p-2 rounded-xl text-text-secondary hover:text-purple-600 hover:bg-surface-muted dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Pronounce tactic"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                {dailyPsychology.definition[language]}
              </p>

              <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 text-xs">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  {language === 'fr'
                    ? 'Épreuve en Négociation :'
                    : language === 'zh'
                    ? '高压交锋实战场景：'
                    : 'Negotiation Scenario:'}
                </span>
                <p className="text-stone-700 dark:text-stone-300 italic leading-relaxed">
                  "{dailyPsychology.fundraisingScenario[language]}"
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border-main dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
                {dailyPsychology.category}
              </span>
              <button
                onClick={() => setActiveTab('psychology')}
                className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>{language === 'fr' ? 'Radar Psychologique' : language === 'zh' ? '进入心理雷达' : 'Psychology Radar'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. TACTICAL SIMULATORS SHOWCASE (4 Precision Cards)
          ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
              {t.quickLaunch[language]}
            </h2>
            <p className="text-xs text-text-secondary dark:text-stone-400">
              {language === 'fr'
                ? 'Modélisez vos tours, options BSPCE et sorties avec clarté mathématique'
                : language === 'zh'
                ? '以精准数学模型守护每一分股权：推演期权池洗牌、SAFE折价与清算瀑布'
                : 'Interactive models for valuation, option pools, liquidation preferences, and negotiation leverage'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cap Table Card */}
          <div
            onClick={() => {
              setSelectedSimulator('captable');
              setActiveTab('simulators');
            }}
            className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border-sophisticated cursor-pointer transition-all duration-300 group relative overflow-hidden hover:border-emerald-500/50"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-inner border border-emerald-500/20">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-text-primary dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {language === 'fr' ? 'Table de Capitalisation' : language === 'zh' ? '动态股权结构表' : 'Cap Table Simulator'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1.5 leading-relaxed">
              {language === 'fr' ? 'Simulez Seed, Série A et dilution BSPCE' : language === 'zh' ? '模拟种子轮、A轮期权池洗牌与股权稀释' : 'Interactive Seed, Series A & option pool dilution'}
            </p>
          </div>

          {/* SAFE Card */}
          <div
            onClick={() => {
              setSelectedSimulator('safe');
              setActiveTab('simulators');
            }}
            className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border-sophisticated cursor-pointer transition-all duration-300 group relative overflow-hidden hover:border-cyan-500/50"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-inner border border-cyan-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-text-primary dark:text-stone-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {language === 'fr' ? 'Simulateur SAFE & Notes' : language === 'zh' ? 'SAFE / 可转债换算' : 'SAFE & Note Simulator'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1.5 leading-relaxed">
              {language === 'fr' ? 'Post-Money vs Pre-Money et décotes' : language === 'zh' ? '对比Post-Money与Pre-Money上限及折扣' : 'Post vs Pre-Money SAFE, valuation caps & discounts'}
            </p>
          </div>

          {/* Waterfall Card */}
          <div
            onClick={() => {
              setSelectedSimulator('waterfall');
              setActiveTab('simulators');
            }}
            className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border-sophisticated cursor-pointer transition-all duration-300 group relative overflow-hidden hover:border-amber-500/50"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-inner border border-amber-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-text-primary dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {language === 'fr' ? 'Cascade de Sortie' : language === 'zh' ? '清算优先权瀑布' : 'Exit Waterfall Lab'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1.5 leading-relaxed">
              {language === 'fr' ? 'Calculez les montants à 10 M$, 50 M$ et 200 M$' : language === 'zh' ? '测算不同估值下1x非参与与2x参与收益' : '1x vs 2x Participating liquidation preferences'}
            </p>
          </div>

          {/* AI Investor Showdown */}
          <div
            onClick={() => setActiveTab('negotiation')}
            className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border-sophisticated cursor-pointer transition-all duration-300 group relative overflow-hidden hover:border-rose-500/50"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-inner border border-rose-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-text-primary dark:text-stone-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {language === 'fr' ? 'Négociateur VC IA' : language === 'zh' ? 'AI投资人实战博弈' : 'AI Investor Showdown'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1.5 leading-relaxed">
              {language === 'fr' ? 'Affrontez un associé impitoyable en direct' : language === 'zh' ? '直面严苛机构合伙人，实时交锋意向书条款' : 'Real-time term sheet counter-offers and live scoring'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. SIGNATURE OVERLAPPING CARD STACK (重叠式卡片组件 · 课程分类)
          ======================================================== */}
      <OverlappingCardStack
        cards={DOMAIN_STACKS_DATA.courses.cards}
        title={DOMAIN_STACKS_DATA.courses.title}
        subtitle={DOMAIN_STACKS_DATA.courses.subtitle}
        domainLabel={{ en: 'Course Categories Stack', fr: 'Filières de Cours Empilées', zh: '课程分类 · 重叠式卡组' }}
        accentColor="emerald"
        direction="horizontal"
        overlapPercent={33}
        onCardAction={(_card) => {
          setActiveTab('learn');
        }}
      />

      {/* ========================================================
          5. RECOMMENDED CURRICULUM
          ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
              {t.nextLessons[language]}
            </h2>
            <p className="text-xs text-text-secondary dark:text-stone-400">
              {language === 'fr'
                ? 'Concepts indispensables adaptés à votre niveau'
                : language === 'zh'
                ? '量身定制的下一阶段关键概念与避坑要略'
                : 'Critical curriculum tailored to your venture experience level'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('learn')}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>{language === 'fr' ? 'Tout le catalogue (100)' : language === 'zh' ? '全部100条目' : 'View All 100'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedTerms.map((term) => (
            <div
              key={term.id}
              onClick={() => {
                setSelectedTermId(term.id);
                setActiveTab('learn');
              }}
              className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border-sophisticated cursor-pointer transition-all duration-300 flex flex-col justify-between group hover:border-amber-400/50"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-surface-muted/90 dark:bg-stone-800/90 text-stone-600 dark:text-stone-400 border border-border-main/50 dark:border-stone-700/50">
                    {term.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                    +75 XP
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-text-primary dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                  {term.canonical}
                </h3>
                <p className="text-[11px] text-text-secondary dark:text-stone-400 mb-2 font-mono">
                  {language === 'fr' ? term.fr : term.zh}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                  {term.shortDef[language]}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-border-main/60 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{language === 'fr' ? 'Démarrer la leçon' : language === 'zh' ? '开始攻坚' : 'Start Lesson'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
