import React, { useState } from 'react';
import { Play, RotateCcw, Award, Sparkles, CheckCircle2, XCircle, Shuffle, Layers } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface WisconsinCardGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

type CardColor = 'red' | 'green' | 'blue' | 'yellow';
type CardShape = 'triangle' | 'star' | 'cross' | 'circle';
type CardCount = 1 | 2 | 3 | 4;

interface WCSTCard {
  color: CardColor;
  shape: CardShape;
  count: CardCount;
}

const COLOR_MAP: Record<CardColor, { hex: string; name: { en: string; fr: string; zh: string } }> = {
  red: { hex: '#EF4444', name: { en: 'Red', fr: 'Rouge', zh: '红' } },
  green: { hex: '#10B981', name: { en: 'Green', fr: 'Vert', zh: '绿' } },
  blue: { hex: '#3B82F6', name: { en: 'Blue', fr: 'Bleu', zh: '蓝' } },
  yellow: { hex: '#F59E0B', name: { en: 'Yellow', fr: 'Jaune', zh: '金' } },
};

const SHAPE_GLYPH: Record<CardShape, string> = {
  triangle: '▲',
  star: '★',
  cross: '✚',
  circle: '●',
};

// 4 Standard Reference Key Cards
const KEY_CARDS: WCSTCard[] = [
  { color: 'red', shape: 'triangle', count: 1 },
  { color: 'green', shape: 'star', count: 2 },
  { color: 'blue', shape: 'cross', count: 3 },
  { color: 'yellow', shape: 'circle', count: 4 },
];

export const WisconsinCardGame: React.FC<WisconsinCardGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [activeRule, setActiveRule] = useState<'color' | 'shape' | 'count'>('color');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [trialsCompleted, setTrialsCompleted] = useState(0);
  const totalTrials = 15;

  const [currentCard, setCurrentCard] = useState<WCSTCard>({
    color: 'red',
    shape: 'star',
    count: 3,
  });

  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [perseverationErrors, setPerseverationErrors] = useState(0); // Kept using old rule after shift

  const generateCard = () => {
    const colors: CardColor[] = ['red', 'green', 'blue', 'yellow'];
    const shapes: CardShape[] = ['triangle', 'star', 'cross', 'circle'];
    const counts: CardCount[] = [1, 2, 3, 4];

    setCurrentCard({
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      count: counts[Math.floor(Math.random() * counts.length)],
    });
  };

  const startGame = () => {
    setActiveRule('color');
    setConsecutiveCorrect(0);
    setTrialsCompleted(0);
    setScore(0);
    setPerseverationErrors(0);
    setFeedback(null);
    setGameState('playing');
    generateCard();
    if (!isAudioMuted) playPsychPulse(440, 0.2);
  };

  const handleSortIntoPile = (targetIndex: number) => {
    if (gameState !== 'playing') return;

    const targetKey = KEY_CARDS[targetIndex];
    let isCorrect = false;

    if (activeRule === 'color') {
      isCorrect = currentCard.color === targetKey.color;
    } else if (activeRule === 'shape') {
      isCorrect = currentCard.shape === targetKey.shape;
    } else if (activeRule === 'count') {
      isCorrect = currentCard.count === targetKey.count;
    }

    if (isCorrect) {
      setScore((s) => s + 40);
      setFeedback('correct');
      if (!isAudioMuted) playSubtleClick();

      const nextConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextConsecutive);

      // Secret rule shifts every 5 consecutive correct answers!
      if (nextConsecutive >= 5) {
        setConsecutiveCorrect(0);
        setActiveRule((prev) => (prev === 'color' ? 'shape' : prev === 'shape' ? 'count' : 'color'));
      }
    } else {
      setFeedback('wrong');
      setConsecutiveCorrect(0);
      setPerseverationErrors((p) => p + 1);
      if (!isAudioMuted) playGameErrorSound();
    }

    const nextTrials = trialsCompleted + 1;
    setTrialsCompleted(nextTrials);

    if (nextTrials >= totalTrials) {
      setTimeout(() => {
        setGameState('ended');
        if (!isAudioMuted) playGameVictoryFanfare();
      }, 500);
    } else {
      setTimeout(() => {
        setFeedback(null);
        generateCard();
      }, 400);
    }
  };

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-purple-500/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold block">
            {language === 'fr' ? 'Test de Wisconsin (WCST)' : language === 'zh' ? '威斯康星认知灵活性测验' : 'Wisconsin Cognitive Flexibility'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Déduction de Règles & Changement de Schéma' : language === 'zh' ? '隐蔽规则归纳与思维破定势' : 'Rule Deduction & Set-Shifting'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30">
            {trialsCompleted} / {totalTrials}
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
          <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Shuffle className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? 'Triez les cartes selon une règle secrète qui change sans préavis'
                : language === 'zh'
                ? '游戏规则：推演隐秘分类规则（颜色、形状或数量），规则会随时突变！'
                : 'Rule: Sort cards by a secret rule that silently mutates'}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'Associez la carte du bas à l’une des 4 piles clés. Vous ne recevrez qu’un retour "Correct" ou "Erreur". Après plusieurs succès, la règle change silencieusement. Adaptez-vous !'
                : language === 'zh'
                ? '将下方手牌归入上方4个基准堆之一。系统仅反馈【正确】或【错误】。当你连续猜中5次后，隐藏规则将无声剧变！考验前额叶破除路径依赖、光速自适应的思维弹性。'
                : 'Sort test card under 1 of 4 key decks. Feedback is strictly Correct or Wrong. After a series of successes, the rule secretly shifts! Shift gears without perseveration.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Lancer le test WCST' : language === 'zh' ? '开始分类测试 (15轮)' : 'Start WCST Trial'}</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6 py-2">
          {/* Telemetry Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-900/60 border border-white/5 font-mono text-xs">
            <div>
              <span className="text-[10px] text-text-secondary dark:text-stone-400 uppercase block">SCORE</span>
              <span className="text-base font-bold text-purple-400">{score}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-secondary dark:text-stone-400 uppercase block">CONSECUTIVE</span>
              <span className="text-base font-bold text-emerald-400">{consecutiveCorrect}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-secondary dark:text-stone-400 uppercase block">PERSEVERATION FAILS</span>
              <span className="text-base font-bold text-stone-300">{perseverationErrors}</span>
            </div>
          </div>

          {/* 4 Reference Key Decks */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-2 text-center">
              {language === 'fr' ? 'PILES DE RÉFÉRENCE (CLIQUEZ POUR TRIER)' : language === 'zh' ? '基准卡堆 (点击目标卡堆归类)' : 'REFERENCE KEY PILES (CLICK TO SORT)'}
            </span>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {KEY_CARDS.map((keyCard, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSortIntoPile(idx)}
                  className="p-3 sm:p-4 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-purple-500/20 hover:border-purple-400 shadow-lg flex flex-col items-center justify-center space-y-2 active:scale-95 transition-all min-h-[90px]"
                >
                  <div
                    className="flex items-center justify-center space-x-1"
                    style={{ color: COLOR_MAP[keyCard.color].hex }}
                  >
                    {Array.from({ length: keyCard.count }).map((_, cIdx) => (
                      <span key={cIdx} className="text-lg sm:text-xl font-bold">
                        {SHAPE_GLYPH[keyCard.shape]}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-stone-400">Pile {idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Test Card to Sort */}
          <div className="text-center pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block mb-2">
              {language === 'fr' ? 'CARTE À CLASSER' : language === 'zh' ? '待归选手牌' : 'TEST CARD TO SORT'}
            </span>
            <div
              className={`w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-3xl bg-stone-900 border-2 shadow-2xl flex flex-col items-center justify-center transition-all ${
                feedback === 'correct'
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : feedback === 'wrong'
                  ? 'border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-shake'
                  : 'border-purple-500/40'
              }`}
            >
              <div
                className="flex items-center justify-center flex-wrap gap-2 p-2"
                style={{ color: COLOR_MAP[currentCard.color].hex }}
              >
                {Array.from({ length: currentCard.count }).map((_, cIdx) => (
                  <span key={cIdx} className="text-2xl sm:text-3xl font-black drop-shadow-md">
                    {SHAPE_GLYPH[currentCard.shape]}
                  </span>
                ))}
              </div>
              <span className="text-[10px] font-mono text-stone-400 mt-2">
                {COLOR_MAP[currentCard.color].name[language]} · {currentCard.count}
              </span>
            </div>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`text-center font-mono text-xs font-bold animate-fadeIn ${
                feedback === 'correct' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {feedback === 'correct'
                ? language === 'fr' ? 'CORRECT ! Déduction confirmée' : language === 'zh' ? '✓ 匹配成功！规则吻合' : '✓ MATCH! Rule deduction confirmed'
                : language === 'fr' ? 'ERREUR ! Ajustez votre hypothèse' : language === 'zh' ? '✗ 规则不符！立即调整归纳假设' : '✗ MISMATCH! Shift sorting hypothesis'}
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
              {language === 'fr' ? 'Bilan de Flexibilité Cognitive' : language === 'zh' ? '前额叶认知灵活性与破定势评级' : 'Cognitive Flexibility Scorecard'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {perseverationErrors <= 3
                ? language === 'fr'
                  ? 'Agilité mentale supérieure. Vous abandonnez sans inertie les anciennes règles dès qu’elles cessent d’opérer.'
                  : language === 'zh'
                  ? '非凡的思维柔韧度与战略顿悟力！当市场规则突变时能瞬间清空历史惯性，零阻力拥抱全新逻辑。'
                  : 'Superior neuro-agility. You abandon obsolete mental models immediately upon environmental state shifts.'
                : language === 'fr'
                ? 'Bonne capacité d’adaptation. Travaillez le détachement face aux stratégies antérieures.'
                : language === 'zh'
                ? '表现稳健。在商业环境规则暗变时，切忌过度恋战或执迷于旧套路。'
                : 'Solid adaptation. Practice rapid set-shifting and detach swiftly from previously rewarded patterns.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL SCORE</span>
              <span className="text-lg font-bold text-purple-400">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">SET SHIFTS</span>
              <span className="text-lg font-bold text-emerald-400">3x</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">PERSEVERATION</span>
              <span className="text-lg font-bold text-stone-200">{perseverationErrors}</span>
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
