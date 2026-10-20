import React, { useState } from 'react';
import { Play, RotateCcw, Award, Coins, TrendingUp, AlertTriangle, Sparkles, Layers } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface IowaGamblingGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

interface DeckConfig {
  id: 'A' | 'B' | 'C' | 'D';
  name: string;
  isBadDeck: boolean;
  gain: number;
  penaltyChances: number[]; // possible penalty draws
}

const DECKS: DeckConfig[] = [
  { id: 'A', name: 'Deck Alpha', isBadDeck: true, gain: 100, penaltyChances: [0, 0, 150, 250, 350] },
  { id: 'B', name: 'Deck Beta', isBadDeck: true, gain: 100, penaltyChances: [0, 0, 0, 0, 1250] }, // sudden massive crash
  { id: 'C', name: 'Deck Gamma', isBadDeck: false, gain: 50, penaltyChances: [0, 0, 25, 50, 75] },
  { id: 'D', name: 'Deck Delta', isBadDeck: false, gain: 50, penaltyChances: [0, 0, 0, 0, 250] },
];

export const IowaGamblingGame: React.FC<IowaGamblingGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted, formatMoney } = useApp();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [capital, setCapital] = useState(2000);
  const [totalDraws, setTotalDraws] = useState(0);
  const maxDraws = 15;
  const [lastDrawOutcome, setLastDrawOutcome] = useState<{
    deckId: string;
    gain: number;
    penalty: number;
    net: number;
  } | null>(null);

  const [goodDeckCount, setGoodDeckCount] = useState(0);
  const [badDeckCount, setBadDeckCount] = useState(0);

  const startGame = () => {
    setCapital(2000);
    setTotalDraws(0);
    setGoodDeckCount(0);
    setBadDeckCount(0);
    setLastDrawOutcome(null);
    setGameState('playing');
    if (!isAudioMuted) playPsychPulse(440, 0.25);
  };

  const handleDrawCard = (deck: DeckConfig) => {
    if (gameState !== 'playing' || totalDraws >= maxDraws) return;

    const penaltyIdx = Math.floor(Math.random() * deck.penaltyChances.length);
    const penalty = deck.penaltyChances[penaltyIdx];
    const gain = deck.gain;
    const net = gain - penalty;

    const nextCap = capital + net;
    setCapital(nextCap);

    if (deck.isBadDeck) {
      setBadDeckCount((b) => b + 1);
    } else {
      setGoodDeckCount((g) => g + 1);
    }

    setLastDrawOutcome({
      deckId: deck.id,
      gain,
      penalty,
      net,
    });

    if (net >= 0) {
      if (!isAudioMuted) playSubtleClick();
    } else {
      if (!isAudioMuted) playGameErrorSound();
    }

    const nextDrawCount = totalDraws + 1;
    setTotalDraws(nextDrawCount);

    if (nextDrawCount >= maxDraws) {
      setTimeout(() => {
        setGameState('ended');
        if (!isAudioMuted) playGameVictoryFanfare();
      }, 700);
    }
  };

  const somaticIntuitionRatio = totalDraws
    ? Math.round((goodDeckCount / totalDraws) * 100)
    : 0;

  const finalScore = Math.max(50, Math.round(somaticIntuitionRatio * 5 + (capital - 1000) / 4));

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-emerald-500/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
            {language === 'fr' ? 'Tâche Somatique d’Iowa' : language === 'zh' ? '爱荷华决策与躯体标记假说' : 'Iowa Somatic Risk Task'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Calibration de l’Intuition Viscérale' : language === 'zh' ? '潜意识风险直觉测验' : 'Subconscious Risk Intuition'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            {totalDraws} / {maxDraws} {language === 'fr' ? 'Tirages' : language === 'zh' ? '抽牌' : 'Draws'}
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
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Coins className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? 'Testez votre instinct face aux pièges à retardement'
                : language === 'zh'
                ? '游戏规则：4组黑曜石牌组，依靠潜意识直觉甄别毒丸牌'
                : 'Rule: 4 Obsidian Decks — Train your somatic marker intuition'}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'Vous commencez avec 2 000 $. Certains paquets offrent de gros gains immédiats mais de redoutables pénalités secrètes. Saurez-vous identifier les bons paquets ?'
                : language === 'zh'
                ? '初始资本2,000美元，共抽卡15次。某些牌组单次现金奖励丰厚但暗藏毁灭性穿仓扣罚；某些牌组收益温和但极稳。测试你的大脑何时能下意识识别危险！'
                : 'Start with $2,000. Bad decks offer seductive upfront payouts paired with catastrophic delayed penalties. Test how quickly your gut flags danger.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Lancer les tirages (15 tours)' : language === 'zh' ? '开始直觉抽牌 (15轮)' : 'Start 15 Card Draws'}</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6 py-2">
          {/* Capital Status Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-900/60 border border-white/5 font-mono text-xs">
            <div>
              <span className="text-[10px] text-text-secondary dark:text-stone-400 uppercase block">
                {language === 'fr' ? 'Capital Total' : language === 'zh' ? '当前净资产' : 'Current Capital'}
              </span>
              <span className="text-xl font-bold text-emerald-400">{formatMoney(capital)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 uppercase block">
                {language === 'fr' ? 'Taux d’Intuition' : language === 'zh' ? '避险直觉率' : 'Somatic Ratio'}
              </span>
              <span className="text-sm font-bold text-stone-200">{somaticIntuitionRatio}%</span>
            </div>
          </div>

          {/* 4 Obsidian Card Decks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {DECKS.map((deck) => (
              <button
                key={deck.id}
                onClick={() => handleDrawCard(deck)}
                className="p-4 sm:p-5 rounded-2xl bg-surface-muted dark:bg-[#15192c] hover:bg-stone-800/80 border border-emerald-500/20 hover:border-emerald-400/60 shadow-lg text-center transition-all active:scale-95 flex flex-col items-center justify-between group h-36 sm:h-40"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-serif-luxury font-bold text-sm text-stone-100 block">
                    {deck.name}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 block mt-0.5">
                    {language === 'fr' ? 'Tirer une carte' : language === 'zh' ? '点击抽取' : 'Draw Card'}
                  </span>
                </div>
                <div className="w-full bg-emerald-500/10 py-1 rounded-lg text-[10px] font-mono text-emerald-300">
                  {deck.id}
                </div>
              </button>
            ))}
          </div>

          {/* Last Draw Result Announcement */}
          {lastDrawOutcome && (
            <div
              className={`p-3.5 rounded-2xl border text-xs text-center font-mono animate-fadeIn ${
                lastDrawOutcome.net >= 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <span>
                {language === 'fr' ? 'Tirage' : language === 'zh' ? '抽中' : 'Drawn'} {lastDrawOutcome.deckId}: +${lastDrawOutcome.gain}
                {lastDrawOutcome.penalty > 0 && ` | -${lastDrawOutcome.penalty} PENALTY`}
                {' => '}
                <strong className="text-sm">
                  {lastDrawOutcome.net >= 0 ? `+$${lastDrawOutcome.net}` : `-$${Math.abs(lastDrawOutcome.net)}`}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}

      {gameState === 'ended' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'Diagnostic des Marqueurs Somatiques' : language === 'zh' ? '躯体标记与风险潜意识报告' : 'Somatic Marker Diagnostic'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {somaticIntuitionRatio >= 60
                ? language === 'fr'
                  ? 'Intuition viscérale aiguë. Vous avez inconsciemment évité les paquets à risques disproportionnés avant même de calculer la théorie.'
                  : language === 'zh'
                  ? '极其卓越的风险躯体标记敏感度！在尚未完全掌握数学期望前，你的潜意识便已本能地远离了暗藏暴雷的诱饵牌组。'
                  : 'Elite somatic marker sensitivity. Your intuitive gut flagged high-risk predatory traps well ahead of conscious probability calculations.'
                : language === 'fr'
                ? 'Sensibilité moyenne aux pièges cachés. Méfiez-vous des gros gains initiaux assortis de conditions léonines.'
                : language === 'zh'
                ? '对表面高收益的诱惑抵抗力偏弱。需在商业谈判中格外警惕表面光鲜但暗藏惩罚性责任的对赌协议。'
                : 'Susceptible to high-upside illusions. Beware of lucrative upfront terms carrying punitive deferred clawbacks.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL CAPITAL</span>
              <span className="text-lg font-bold text-emerald-400">{formatMoney(capital)}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">SAFE DECK %</span>
              <span className="text-lg font-bold text-stone-100">{somaticIntuitionRatio}%</span>
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
              <span>{language === 'fr' ? 'Recommencer' : language === 'zh' ? '再次测验' : 'Retry'}</span>
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
