import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Award, Flame, Timer, AlertOctagon, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface SunkCostGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

interface SunkCostScenario {
  id: string;
  title: { en: string; fr: string; zh: string };
  sunkInvested: string;
  uncomfortableData: { en: string; fr: string; zh: string };
  rationalChoice: 'sever' | 'pivot';
  psychologicalTrap: { en: string; fr: string; zh: string };
  severExplanation: { en: string; fr: string; zh: string };
}

const SCENARIOS: SunkCostScenario[] = [
  {
    id: 'sunk_1',
    title: { en: 'Project Apex Infrastructure', fr: 'Projet Apex Infrastructure', zh: '核心引擎重构工程' },
    sunkInvested: '$3,200,000 & 16 Months',
    uncomfortableData: {
      en: 'A breakthrough open-source protocol just made your custom engine redundant. Maintenance cost will bleed $120k/mo.',
      fr: 'Un protocole open-source révolutionnaire rend votre moteur obsolète. La maintenance coûtera 120 k$/mois.',
      zh: '最新开源技术标准使自研引擎瞬间丧失先发优势。若继续死磕，每月将持续失血12万美元维护费。',
    },
    rationalChoice: 'sever',
    psychologicalTrap: {
      en: 'Ego preservation: CTO cannot bear to delete 16 months of personal pride and architectural sweat.',
      fr: 'Préservation d’ego : Le CTO refuse d’effacer 16 mois d’efforts et de fierté personnelle.',
      zh: '虚荣心理防御：技术团队无法接受将付诸了16个月心血与自豪感的代码全部废弃。',
    },
    severExplanation: {
      en: 'Sovereign move: Immediately mothball custom code, adopt the open protocol, and reassign 10 top engineers to high-margin client features.',
      fr: 'Action souveraine : Archivez le code obsolète, adoptez le protocole libre et réaffectez vos ingénieurs.',
      zh: '斯多葛决断：立刻封存自研残局，全面拥抱开放协议，将精锐工程师瞬间调拨至直接产生现金流的战略业务。',
    },
  },
  {
    id: 'sunk_2',
    title: { en: 'The Predatory Bridge Term Sheet', fr: 'Le Prêt-Relais Prédateur', zh: '饮鸩止渴式过桥救援意向书' },
    sunkInvested: '$800,000 Seed + 3 Months of Due Diligence',
    uncomfortableData: {
      en: 'Lead investor offers a $2M bridge loan, but insists on a 3x Participating Liquidation Preference and full personal founder indemnity.',
      fr: 'Un fonds propose 2 M$ de bridge, mais exige une préférence participante 3x et caution personnelle.',
      zh: '资方愿提供200万美元过桥救急，但附加极其苛刻的3倍参与清算优先权以及创始人个人无限连带责任。',
    },
    rationalChoice: 'sever',
    psychologicalTrap: {
      en: 'Fear of immediate shutdown: Taking toxic term sheets merely delays catastrophic loss of founder economic sovereignty.',
      fr: 'Peur du noir immédiat : Accepter des termes toxiques ne fait que différer la spoliation totale.',
      zh: '对短期清算的过度恐慌：饮鸩止渴只会让创始人最终沦为毫无分红权的过桥资方打工人。',
    },
    severExplanation: {
      en: 'Sovereign move: Walk away from toxic predatory capital, cut burn to default alive, and secure revenue-based non-dilutive lines.',
      fr: 'Action souveraine : Rejetez le capital prédateur, passez en mode Default Alive et levez de la dette non dilutive.',
      zh: '斯多葛决断：坚决掀桌拒绝毒丸条款！立即大砍非核心开支进入“自主存活(Default Alive)”，启动非稀释性营收过桥。',
    },
  },
  {
    id: 'sunk_3',
    title: { en: 'The Bleeding Retail Distributor Pact', fr: 'Le Réseau de Distribution Déficitaire', zh: '持续失血的线下代理分销网络' },
    sunkInvested: '$1,800,000 & 3-Year Relationship',
    uncomfortableData: {
      en: 'Legacy distributors account for 40% of volume but generate -12% net margin. Meanwhile, direct digital sales have 82% margin.',
      fr: 'Les distributeurs pèsent 40 % du volume mais affichent -12 % de marge. Le digital direct dégage 82 %.',
      zh: '传统代理网络虽贡献40%流水，但实际净利润率为-12%严重倒贴。与此同时，直销数字渠道毛利高达82%。',
    },
    rationalChoice: 'sever',
    psychologicalTrap: {
      en: 'Social obligation & vanity volume: Reluctance to disappoint longstanding distributors and fear of top-line revenue drop.',
      fr: 'Obligation sociale & vanité du volume : Peur de décevoir les partenaires historiques et chute de CA facial.',
      zh: '面子与人情绑架：不忍心向合作三年的老代理商摊牌，且极度恐惧砍掉渠道后总营收数字表面变小。',
    },
    severExplanation: {
      en: 'Sovereign move: Sever negative-margin distributor contracts, redirect capital to pure 82% margin digital sales, and achieve immediate profitability.',
      fr: 'Action souveraine : Résiliez les contrats à marge négative et concentrez vos forces sur le direct rentable.',
      zh: '斯多葛决断：毫不留情切断亏损代理合同！将全部弹药投入82%毛利的直营阵地，当月实现经营性正现金流。',
    },
  },
];

export const SunkCostGame: React.FC<SunkCostGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'deciding' | 'reviewed' | 'ended'>('idle');
  const [secondsLeft, setSecondsLeft] = useState(8);
  const [selectedDecision, setSelectedDecision] = useState<'sever' | 'double_down' | null>(null);
  const [score, setScore] = useState(0);
  const [severedCount, setSeveredCount] = useState(0);

  const scenario = SCENARIOS[currentRound];

  const startRound = () => {
    setSelectedDecision(null);
    setSecondsLeft(8);
    setGameState('deciding');
    if (!isAudioMuted) playPsychPulse(528, 0.2);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'deciding' && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            // Time out = treated as hesitation / double down
            handleChoice('double_down');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, secondsLeft]);

  const handleChoice = (decision: 'sever' | 'double_down') => {
    setSelectedDecision(decision);
    setGameState('reviewed');

    if (decision === 'sever') {
      const speedBonus = secondsLeft * 15;
      setScore((s) => s + 100 + speedBonus);
      setSeveredCount((c) => c + 1);
      if (!isAudioMuted) playSubtleClick();
    } else {
      if (!isAudioMuted) playGameErrorSound();
    }
  };

  const handleNext = () => {
    if (currentRound < SCENARIOS.length - 1) {
      setCurrentRound((r) => r + 1);
      startRound();
    } else {
      setGameState('ended');
      if (!isAudioMuted) playGameVictoryFanfare();
    }
  };

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-red-500/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-semibold block">
            {language === 'fr' ? 'Sevrage des Coûts Irrécupérables' : language === 'zh' ? '沉没成本果断止损力' : 'Sunk Cost Severance'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Détachement Émotionnel & Lucidité' : language === 'zh' ? '战胜损失厌恶 · 极限断臂魄力' : 'Loss Aversion & Rational Severance'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-surface-muted dark:bg-stone-800/80 border border-border-main dark:border-stone-700 text-xs font-mono">
            <Timer className="w-3.5 h-3.5 text-red-400" />
            <span className={secondsLeft <= 3 ? 'text-red-400 font-bold animate-pulse' : 'text-stone-200'}>
              {secondsLeft}s
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
          <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Flame className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? '8 secondes pour couper net un gouffre financier'
                : language === 'zh'
                ? '8秒决断：面对已投入数百万的黑洞，果断止损还是死扛？'
                : '8 Seconds to Cut Sunk Losses or Fall into the Death Spiral'}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'L’être humain a une sainte horreur d’admettre que ses efforts passés sont vains. Serez-vous capable de trancher sans état d’âme pour préserver l’avenir ?'
                : language === 'zh'
                ? '人类大脑的前脑岛在面对“承认亏损”时会产生类似肉体创伤的剧痛。顶尖战略家能瞬间斩断情绪执念，在8秒内做出冷酷止损决断。'
                : 'Human insular cortex experiences loss as visceral physical pain. Elite strategists decouple emotion from past spent capital to preserve future runway.'}
            </p>
          </div>
          <button
            onClick={startRound}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Démarrer le scénario 1' : language === 'zh' ? '进入极限止损实战' : 'Start Severance Trial'}</span>
          </button>
        </div>
      )}

      {(gameState === 'deciding' || gameState === 'reviewed') && (
        <div className="space-y-6">
          {/* Sunk Cost Case Header */}
          <div className="p-5 rounded-3xl bg-stone-900/80 border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-400 font-bold uppercase tracking-wider">
                {scenario.title[language]}
              </span>
              <span className="text-stone-400">
                {language === 'fr' ? 'Perte Déjà Engloutie :' : language === 'zh' ? '已沉没总成本：' : 'Sunk Capital:'}{' '}
                <strong className="text-red-400">{scenario.sunkInvested}</strong>
              </span>
            </div>

            <p className="text-sm sm:text-base font-serif-luxury text-stone-100 leading-relaxed">
              {scenario.uncomfortableData[language]}
            </p>
          </div>

          {/* Action Choice Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleChoice('sever')}
              disabled={gameState === 'reviewed'}
              className={`p-5 rounded-3xl border text-left font-bold transition-all active:scale-95 shadow-lg flex flex-col justify-between space-y-2 ${
                gameState === 'reviewed'
                  ? selectedDecision === 'sever'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-stone-800/80 hover:bg-emerald-950/40 border-emerald-500/30 hover:border-emerald-400 text-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-emerald-400">
                  {language === 'fr' ? 'DÉCISION SOUVERAINE' : language === 'zh' ? '斯多葛决断' : 'SOVEREIGN MOVE'}
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-base font-heading">
                {language === 'fr' ? 'COUPER NET & PIVOTER' : language === 'zh' ? '果断止损 · 战略切割' : 'SEVER & PIVOT RUTHLESSLY'}
              </span>
              <span className="text-[11px] text-stone-400 font-normal">
                {language === 'fr' ? 'Accepter la perte passée pour sauver la trésorerie' : language === 'zh' ? '坦然认亏，全盘救出剩余跑道与核心团队' : 'Accept sunk loss to safeguard future runway'}
              </span>
            </button>

            <button
              onClick={() => handleChoice('double_down')}
              disabled={gameState === 'reviewed'}
              className={`p-5 rounded-3xl border text-left font-bold transition-all active:scale-95 shadow-lg flex flex-col justify-between space-y-2 ${
                gameState === 'reviewed'
                  ? selectedDecision === 'double_down'
                    ? 'bg-red-500/20 border-red-500 text-red-300'
                    : 'opacity-40 bg-stone-900 border-stone-800 text-stone-500'
                  : 'bg-stone-800/80 hover:bg-red-950/40 border-red-500/30 hover:border-red-400 text-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-red-400">
                  {language === 'fr' ? 'PIÈGE COÛTS IRRÉCUPÉRABLES' : language === 'zh' ? '沉没成本死穴' : 'EMOTIONAL TRAP'}
                </span>
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-base font-heading">
                {language === 'fr' ? 'S’ENTÊTER & PERSÉVÉRER' : language === 'zh' ? '不甘认亏 · 继续追加' : 'DOUBLE DOWN & PERSEVERE'}
              </span>
              <span className="text-[11px] text-stone-400 font-normal">
                {language === 'fr' ? 'Injecter encore du cash pour ne pas avouer l’échec' : language === 'zh' ? '为了面子和虚妄侥幸再死扛，深陷泥潭' : 'Refuse to admit past failure and bleed more'}
              </span>
            </button>
          </div>

          {/* Psychological Debrief after review */}
          {gameState === 'reviewed' && (
            <div className="p-4 rounded-2xl bg-stone-900/90 border border-white/10 text-xs space-y-2 animate-fadeIn">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                {language === 'fr' ? 'Analyse Psychologique' : language === 'zh' ? '心理机制深度复盘' : 'Psychological Insight'}
              </span>
              <p className="text-stone-300 leading-relaxed">
                {scenario.severExplanation[language]}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-red-600 text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>
                    {currentRound < SCENARIOS.length - 1
                      ? language === 'fr' ? 'Cas Suivant' : language === 'zh' ? '下一止损案' : 'Next Scenario'
                      : language === 'fr' ? 'Voir le Bilan' : language === 'zh' ? '查看止损魄力评级' : 'View Results'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === 'ended' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'Indice de Sang-Froid Stratégique' : language === 'zh' ? '沉没成本断舍离与止损魄力报告' : 'Severance Sovereignty Index'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {severedCount === SCENARIOS.length
                ? language === 'fr'
                  ? 'Félicitations. Vous possédez le détachement chirurgical des plus grands bâtisseurs. Aucune perte passée ne dicte votre futur.'
                  : language === 'zh'
                  ? '卓越的外科手术级断臂魄力！能将已沉没的时间金钱与未来战略彻底脱钩，守护了数百万公司核心弹药。'
                  : 'Flawless detachment. You operate with surgical objectivity, refusing to let past capital held hostage dictate future upside.'
                : language === 'fr'
                ? 'Bonne prise de décision. Méfiez-vous de l’orgueil personnel face aux projets enlisés.'
                : language === 'zh'
                ? '良好基础。持续克服“不甘心”与面子包袱，止损越早，胜算越大。'
                : 'Solid awareness. Keep training against the psychological pain of abandoning invested pride.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL SCORE</span>
              <span className="text-lg font-bold text-red-400">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">RATIONAL SEVERS</span>
              <span className="text-lg font-bold text-emerald-400">{severedCount} / {SCENARIOS.length}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                setCurrentRound(0);
                setScore(0);
                setSeveredCount(0);
                setGameState('idle');
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Recommencer' : language === 'zh' ? '再次测验' : 'Retry'}</span>
            </button>
            <button
              onClick={() => onFinish(score)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-red-600 text-white font-bold text-xs shadow-md hover:brightness-110 transition-all"
            >
              <span>{language === 'fr' ? 'Enregistrer & Quitter' : language === 'zh' ? '保存得分并退出' : 'Save & Close'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
