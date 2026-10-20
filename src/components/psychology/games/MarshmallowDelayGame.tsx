import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Hourglass, TrendingUp, Sparkles, AlertOctagon, Flame } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface MarshmallowDelayGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

const TEMPTATION_NOTICES = [
  { en: 'Temptation: Quick Angel Exit offer of $50,000! Take it now or wait?', fr: 'Tentation : Offre de rachat rapide à 50 000 $ ! Encaisser ?', zh: '短期暴利诱惑：老股东开出5万美元立即现金退出，是否见好就收？' },
  { en: 'Panic Rumor: Rumors of macro interest rate hike! Cash out before dip?', fr: 'Rumeur Macro : Bruit de marché anxiogène ! Faut-il fuir ?', zh: '市场恐慌传闻：宏观利率波动加剧，多位同行恐慌抛售，你是否动摇？' },
  { en: 'Instant Gratification: Buyout offer for 2x current return right now!', fr: 'Gain Immédiat : Proposition immédiate de doubler la mise !', zh: '即时满足冲动：买方愿以当前2倍溢价立即交割，诱惑极高！' },
];

export const MarshmallowDelayGame: React.FC<MarshmallowDelayGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [gameState, setGameState] = useState<'idle' | 'holding' | 'harvested' | 'crashed'>('idle');
  const [multiplier, setMultiplier] = useState(1.0);
  const [accumulatedPoints, setAccumulatedPoints] = useState(100);
  const [holdTimeSeconds, setHoldTimeSeconds] = useState(0);
  const [volatility, setVolatility] = useState(15);
  const [activeTemptation, setActiveTemptation] = useState<number | null>(null);

  const crashTimeRef = useRef<number>(22); // Will crash between 18s and 28s randomly
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setMultiplier(1.0);
    setAccumulatedPoints(100);
    setHoldTimeSeconds(0);
    setVolatility(15);
    setActiveTemptation(null);
    crashTimeRef.current = Math.floor(18 + Math.random() * 10);
    setGameState('holding');
    if (!isAudioMuted) playPsychPulse(440, 0.2);
  };

  useEffect(() => {
    if (gameState !== 'holding') return;

    timerRef.current = setInterval(() => {
      setHoldTimeSeconds((s) => {
        const nextSec = s + 1;

        // Check if market crashed
        if (nextSec >= crashTimeRef.current) {
          setGameState('crashed');
          if (!isAudioMuted) playGameErrorSound();
          return nextSec;
        }

        // Multiplier grows exponentially
        setMultiplier((prev) => {
          const delta = 0.15 + prev * 0.08;
          return Math.round((prev + delta) * 100) / 100;
        });

        // Points accumulate
        setAccumulatedPoints((prev) => Math.round(prev * 1.14 + 15));

        // Volatility creeps up
        setVolatility((v) => Math.min(95, v + Math.floor(Math.random() * 6) - 1));

        // Pop temptation notice every ~6 seconds
        if (nextSec % 6 === 0 && Math.random() < 0.8) {
          setActiveTemptation(Math.floor(Math.random() * TEMPTATION_NOTICES.length));
        }

        if (!isAudioMuted && nextSec % 3 === 0) {
          playPsychPulse(528, 0.15);
        }

        return nextSec;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isAudioMuted]);

  const handleHarvest = () => {
    if (gameState !== 'holding') return;
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('harvested');
    if (!isAudioMuted) playGameVictoryFanfare();
  };

  const finalScore =
    gameState === 'harvested'
      ? Math.round(accumulatedPoints * (multiplier / 2))
      : 30; // crashed minimal fallback

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-amber-500/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-semibold block">
            {language === 'fr' ? 'Expérience du Marshmallow' : language === 'zh' ? '棉花糖延迟满足意志力' : 'Marshmallow Delay Discounting'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Capitalisation vs Appât Immédiat' : language === 'zh' ? '复利定力与抗诱惑收割' : 'Patience Compounding vs Bailout'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-surface-muted dark:bg-stone-800/80 border border-border-main dark:border-stone-700 text-xs font-mono">
            <Hourglass className="w-3.5 h-3.5 text-amber-500" />
            <span>{holdTimeSeconds}s</span>
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
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? 'Résistez à l’impulsion de sortie pour décupler vos gains'
                : language === 'zh'
                ? '游戏规则：抵御中途诱惑，在雪崩前择机收割最高倍数'
                : 'Rule: Withstand short-term baits and harvest maximum compounded returns'}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'Le coffre de capitalisation s’emballe chaque seconde (jusqu’à 20x). Des offres de rachat séduisantes et des rumeurs anxiogènes tenteront de vous faire fuir prématurément.'
                : language === 'zh'
                ? '蓄力仓的复利乘数每秒都在狂飙。中途会出现高额蝇头小利的诱惑弹窗与恐慌传闻。太早收割收益平平，太晚则可能遭遇黑天鹅清零！考验意志力与分寸感。'
                : 'The vault multiplier compounds exponentially. Tempting small-win baits and fear triggers will try to panic you into bailing early. Balance patient willpower against market cliff.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Lancer le test de patience' : language === 'zh' ? '进入复利意志场' : 'Start Willpower Trial'}</span>
          </button>
        </div>
      )}

      {gameState === 'holding' && (
        <div className="space-y-6 py-2">
          {/* Compounding Multiplier Display */}
          <div className="py-10 text-center rounded-3xl bg-stone-900/60 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-amber-500/10 to-transparent pointer-events-none animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
              {language === 'fr' ? 'MULTIPLICATEUR DE PATIENCE' : language === 'zh' ? '延迟满足复利乘数' : 'COMPOUNDING MULTIPLIER'}
            </span>
            <span className="text-5xl sm:text-7xl font-serif-luxury font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 tracking-wider">
              {multiplier.toFixed(2)}x
            </span>
            <div className="mt-2 text-xs font-mono text-stone-300">
              {language === 'fr' ? 'Valeur Actuelle :' : language === 'zh' ? '当前池内累积点数：' : 'Accumulated Value:'}{' '}
              <strong className="text-amber-400 text-sm">{accumulatedPoints} pts</strong>
            </div>
          </div>

          {/* Active Temptation Alarm */}
          {activeTemptation !== null && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-2.5">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                <span className="text-amber-200 text-[11px]">
                  {TEMPTATION_NOTICES[activeTemptation][language]}
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-400 italic shrink-0 ml-2">
                {language === 'fr' ? 'Résistez !' : language === 'zh' ? '保持定力！' : 'Resist!'}
              </span>
            </div>
          )}

          {/* Volatility Meter */}
          <div className="p-3.5 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-400">
                {language === 'fr' ? 'Pression de Turbulence' : language === 'zh' ? '市场博弈波动张力' : 'Market Volatility Index'}
              </span>
              <span className={volatility > 70 ? 'text-red-400 font-bold animate-pulse' : 'text-amber-400'}>
                {volatility}%
              </span>
            </div>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  volatility > 70 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
                style={{ width: `${volatility}%` }}
              />
            </div>
          </div>

          {/* Big Action Button: Harvest Now */}
          <div className="pt-2 text-center">
            <button
              onClick={handleHarvest}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-black text-sm sm:text-base shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 mx-auto"
            >
              <Award className="w-5 h-5 fill-current" />
              <span>
                {language === 'fr'
                  ? `ENCAISSER MAINTENANT (${Math.round(accumulatedPoints * (multiplier / 2))} pts)`
                  : language === 'zh'
                  ? `锁定胜局 · 立即收割 (${Math.round(accumulatedPoints * (multiplier / 2))} pts)`
                  : `HARVEST RETURNS NOW (${Math.round(accumulatedPoints * (multiplier / 2))} pts)`}
              </span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'harvested' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'Sortie Triomphale de Haute Volée' : language === 'zh' ? '精准收割 · 长期主义大获全胜' : 'Supreme Strategic Harvest'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {language === 'fr'
                ? `Vous avez tenu ${holdTimeSeconds}s avec sang-froid et capturé un multiplicateur de ${multiplier.toFixed(2)}x sans céder aux bruits du marché.`
                : language === 'zh'
                ? `在重重短期诱惑与市场恐慌下沉稳坚守了 ${holdTimeSeconds}秒，最终成功斩获 ${multiplier.toFixed(2)}倍 超额回报！`
                : `You held your nerve for ${holdTimeSeconds}s, resisting impulsive bailouts to capture a stellar ${multiplier.toFixed(2)}x multiple.`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL SCORE</span>
              <span className="text-lg font-bold text-amber-400">{finalScore}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">PEAK MULTIPLIER</span>
              <span className="text-lg font-bold text-emerald-400">{multiplier.toFixed(2)}x</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">HOLD TIME</span>
              <span className="text-lg font-bold text-stone-200">{holdTimeSeconds}s</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={startGame}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Rejouer' : language === 'zh' ? '再次博弈' : 'Play Again'}</span>
            </button>
            <button
              onClick={() => onFinish(finalScore)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-amber-500 text-stone-950 font-bold text-xs shadow-md hover:brightness-110 transition-all"
            >
              <span>{language === 'fr' ? 'Enregistrer & Quitter' : language === 'zh' ? '保存得分并退出' : 'Save & Close'}</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'crashed' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'Choc de Marché Trop Tardif' : language === 'zh' ? '贪婪过甚 · 遭遇黑天鹅突袭' : 'Over-Extended Crash'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {language === 'fr'
                ? 'La patience stratégique nécessite aussi de savoir identifier le point de rendement décroissant. Réessayez pour calibrer le timing.'
                : language === 'zh'
                ? '延迟满足并非盲目贪婪，真正的智慧在于在边际收益递减与风险拐点处果断落袋。'
                : 'Patience must be paired with acute risk calibration. Avoid confusing delayed gratification with blind hubris.'}
            </p>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={startGame}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Recommencer' : language === 'zh' ? '重新校准再试' : 'Retry'}</span>
            </button>
            <button
              onClick={() => onFinish(50)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-stone-700 text-stone-200 font-bold text-xs shadow-md hover:bg-stone-600 transition-all"
            >
              <span>{language === 'fr' ? 'Quitter' : language === 'zh' ? '退出' : 'Close'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
