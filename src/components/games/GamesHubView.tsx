import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Brain,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { gamesData } from '../../data/gamesData';
import { GameInfo } from '../../types';
import { FacingTheGame } from './FacingTheGame';
import { SpeedValuationGame } from './SpeedValuationGame';
import { CapTableBattleGame } from './CapTableBattleGame';
import { LeaderboardModal } from '../common/LeaderboardModal';
import speedValuationIcon from '../../assets/images/speed_valuation_icon_1793106944524.jpg';
import capTableIcon from '../../assets/images/cap_table_sovereignty_icon_1793108638526.jpg';

export const GamesHubView: React.FC = () => {
  const { language, progress, recordGameScore, formatMoney, setActiveTab } = useApp();

  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Mini-Game: Term Sheet Detective (Game 5)
  const [trapsFound, setTrapsFound] = useState<string[]>([]);
  const [detectiveScore, setDetectiveScore] = useState(0);
  const [detectiveFinished, setDetectiveFinished] = useState(false);

  const activeGame = gamesData.find((g) => g.id === activeGameId);

  // Detective game trap clauses
  const detectiveClauses = [
    {
      id: 'trap_1',
      text: 'Series A Preferred Stock shall carry a 2.5x Participating Liquidation Preference with no cap.',
      isTrap: true,
      explanation: 'Predatory 2.5x Participating preference extracts majority of exit returns before common founders receive anything.',
    },
    {
      id: 'clean_1',
      text: 'The Board shall consist of five (5) members: two (2) Common, two (2) Preferred, and one (1) Independent.',
      isTrap: false,
      explanation: 'Standard balanced 2-2-1 board architecture.',
    },
    {
      id: 'trap_2',
      text: 'Anti-dilution protection shall be adjusted pursuant to a Full Ratchet formula.',
      isTrap: true,
      explanation: 'Full Ratchet ignores investment size and resets all conversion prices down to the lowest share price issued.',
    },
    {
      id: 'clean_2',
      text: 'Investors holding at least 1,000,000 shares shall have standard pro-rata participation rights in future rounds.',
      isTrap: false,
      explanation: 'Standard major investor pro-rata right.',
    },
    {
      id: 'trap_3',
      text: 'This term sheet expires within 24 hours of delivery and requires immediate exclusive negotiating rights for 90 days.',
      isTrap: true,
      explanation: 'Aggressive exploding deadline coupled with an unusually prolonged 90-day lockup.',
    },
  ];

  const handleToggleTrap = (clauseId: string, isTrap: boolean) => {
    if (isTrap) {
      if (!trapsFound.includes(clauseId)) {
        const next = [...trapsFound, clauseId];
        setTrapsFound(next);
        const score = next.length * 33;
        setDetectiveScore(score);
        if (next.length >= 3) {
          setDetectiveFinished(true);
          recordGameScore('game_05', 100);
        }
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-mobile-nav">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <Gamepad2 className="w-4 h-4" />
            <span>
              {language === 'fr'
                ? 'Gymnase de Négociation & Défis Tactiques'
                : language === 'zh'
                ? '风投博弈训练营与战术竞技场'
                : 'Venture Arena & Tactical Deal Games'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-text-primary dark:text-stone-100 mt-1">
            {language === 'fr'
              ? '20 Jeux Interactifs de Capital-Risque'
              : language === 'zh'
              ? '20款互动风投博弈训练'
              : '20 Interactive Dealmaking Games'}
          </h1>
          <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 max-w-2xl">
            {language === 'fr'
              ? 'Affûtez vos réflexes de calcul mental, détectez les clauses prédatrices et défendez votre table de capitalisation sous pression.'
              : language === 'zh'
              ? '在倒计时高压下淬炼估值心算、识别协议毒丸条款、抵御控股权稀释并巩固谈判筹码。'
              : 'Sharpen mental valuation speed, uncover predatory traps under time pressure, and defend founder equity.'}
          </p>
        </div>

        {/* Top Actions: Leaderboard & Global Points */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center space-x-2.5 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-amber-500/10 hover:from-amber-500/30 hover:to-purple-500/25 border border-amber-400/40 text-amber-300 transition-all cursor-pointer shadow-md active:scale-95"
            title="Open Grandmaster Leaderboard"
          >
            <Trophy className="w-5 h-5 text-amber-300" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-stone-400 dark:text-stone-300">
                {language === 'fr' ? 'Classement Mondial' : language === 'zh' ? '全景天梯榜' : 'Leaderboard'}
              </div>
              <div className="text-xs font-bold text-white">
                {language === 'fr' ? 'Voir les Records' : language === 'zh' ? '查看巅峰高分' : 'View High Scores'}
              </div>
            </div>
          </button>

          {/* Global Game Mastery Score */}
          <div className="flex items-center space-x-3 p-2.5 sm:p-3 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-text-secondary dark:text-stone-400">
                {language === 'fr' ? 'Points Cumulés' : language === 'zh' ? '实战总积分' : 'Total Game Points'}
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                {Object.values(progress.gameScores).reduce((a, b) => a + b, 0)}{' '}
                <span className="text-xs text-text-secondary dark:text-stone-400 font-normal">/ 2,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Banner: 12 Psychology Mind Games */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-purple-950/70 via-[#181d38] to-stone-900 border border-purple-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>
              {language === 'fr'
                ? 'Nouveau : 12 Jeux de Psychologie Cognitive'
                : language === 'zh'
                ? '全新上线 · 12款心理学心智博弈游戏'
                : 'Featured: 12 Psychology Cognitive Mind Games'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-white">
            {language === 'fr'
              ? 'Entraînez Attention, Vitesse Mentale & Sang-Froid'
              : language === 'zh'
              ? '训练超强专注力、动脑敏捷度与高压心理素质'
              : 'Attention, Neuro-Agility & High-Pressure Composure'}
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            {language === 'fr'
              ? 'Stroop, Double N-Back, Grille de Schulte, Micro-Expressions FACS, Cohérence Cardiaque et Tâche d’Iowa.'
              : language === 'zh'
              ? '包含斯特鲁普抑制控制、双重N-Back、舒尔特方格、FACS微表情识别、迷走神经心率调谐与爱荷华决策等12项科学训练。'
              : 'Empirically grounded in Stroop, Dual N-Back, Schulte Matrix, FACS Micro-Expressions, Vagus Coherence, and Iowa Somatic Risk.'}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('psychology')}
          className="shrink-0 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-all"
        >
          <span>
            {language === 'fr'
              ? 'Accéder au Lab Psychologique'
              : language === 'zh'
              ? '立即进入心理学实验室'
              : 'Launch Psychology Lab'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Premier Triple Flagship Showcases: Game #1, Game #2 & Game #3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Flagship Game #1: 面对博弈 · 定力与破局 */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#12162a] via-[#1a1f3d] to-[#251b38] border border-amber-400/40 shadow-xl text-white flex flex-col justify-between gap-5 group">

          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400/50 shadow-md">
              <img
                src="/src/assets/images/game_adversary_partner_1793030978874.jpg"
                alt="Adversary Partner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-1 left-2 text-[9px] font-mono text-amber-300 font-bold uppercase">
                Game #1
              </span>
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="inline-flex items-center space-x-1.5 text-amber-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'fr' ? 'Épreuve Reine · Face au Duel' : language === 'zh' ? '风投首战 · 面对博弈' : 'Flagship Duel · Facing the Game'}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-white leading-snug">
                {language === 'fr'
                  ? 'Face au Duel : Sérénité & Maîtrise'
                  : language === 'zh'
                  ? '面对博弈 · 定力与破局'
                  : 'Facing the Game: Composure & Leverage'}
              </h2>

              <p className="text-[11px] text-stone-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
                {language === 'fr'
                  ? 'Désamorcez les pièges d’ancrage bas, de liquidation participante et de fausse urgence avec une sérénité souveraine.'
                  : language === 'zh'
                  ? '博弈的核心不是击败对手，而是看透心机，守住定力。抵御极限压价、清算毒丸与倒计时施压，悟透创投博弈精髓。'
                  : 'Defend your cap table against predatory anchors, poison pills, and fake deadlines across 20 randomized rounds.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-stone-200 font-mono text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'fr' ? 'Records' : language === 'zh' ? '巅峰榜' : 'High Scores'}</span>
            </button>

            <button
              onClick={() => setActiveGameId('game_01')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-mono font-bold text-xs shadow-lg flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'fr' ? 'Jouer Game #1' : language === 'zh' ? '进入博弈对决' : 'Play Game #1'}</span>
            </button>
          </div>
        </div>

        {/* Flagship Game #2: 极速估值心算 · 秒级破局 */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#0a1a1f] via-[#0f282e] to-[#121e33] border border-emerald-400/40 shadow-xl text-white flex flex-col justify-between gap-5 group">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-400/60 shadow-lg bg-[#0a141c]">
              <img
                src={speedValuationIcon}
                alt="Speed Valuation Game Icon"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 left-2 text-[9px] font-mono text-emerald-300 font-bold uppercase drop-shadow-md">
                Game #2
              </span>
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-emerald-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                <span className="inline-flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                  <span>{language === 'fr' ? 'Armure Cognitive' : language === 'zh' ? '认知防线 · 估值心算' : 'Mental Armor'}</span>
                </span>
                <span className="text-emerald-500/60">·</span>
                <span className="text-amber-400 font-bold">
                  {language === 'fr' ? '3 Paliers (5 / 25 / 50)' : language === 'zh' ? '初中高三级 (5/25/50题)' : '3 Tiers (5/25/50)'}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-white leading-snug">
                {language === 'fr'
                  ? 'Valorisation Éclair : Le Réflexe 3s'
                  : language === 'zh'
                  ? '极速估值心算 · 秒级破局'
                  : 'Speed Valuation: The 3-Second Mental Edge'}
              </h2>

              <p className="text-[11px] text-stone-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
                {language === 'fr'
                  ? 'L’hésitation trahit l’insécurité. Calculez instantanément le Pré, le Post et les pièges de pool en 5, 25 ou 50 épreuves dynamiques sans répétition.'
                  : language === 'zh'
                  ? '估值心算不是冷冰冰的算术，而是创始人的谈判护城河。初级5题热身、中级25题董事会推演、高级50题极限连击，随机出题永不重复。'
                  : 'Grabbing a calculator signals hesitation. Master instant mental shortcuts across 5, 25, or 50 procedural non-repeating rounds.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-stone-200 font-mono text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'fr' ? 'Records' : language === 'zh' ? '巅峰榜' : 'High Scores'}</span>
            </button>

            <button
              onClick={() => setActiveGameId('game_02')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-mono font-bold text-xs shadow-lg flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'fr' ? 'Jouer Game #2' : language === 'zh' ? '进入极速心算' : 'Play Game #2'}</span>
            </button>
          </div>
        </div>

        {/* Flagship Game #3: 股权结构防卫战 · 守卫生命线 */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#17130a] via-[#241c10] to-[#1a2335] border border-amber-400/50 shadow-xl text-white flex flex-col justify-between gap-5 group">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400/60 shadow-lg bg-[#0e111a]">
              <img
                src={capTableIcon}
                alt="Cap Table Defense Icon"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 left-2 text-[9px] font-mono text-amber-300 font-bold uppercase drop-shadow-md">
                Game #3
              </span>
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-amber-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                <span className="inline-flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'fr' ? 'Citadelle de Souveraineté' : language === 'zh' ? '主权防线 · 股权保卫' : 'Sovereignty Citadel'}</span>
                </span>
                <span className="text-amber-500/60">·</span>
                <span className="text-emerald-400 font-bold">
                  {language === 'fr' ? '3 Paliers (5 / 25 / 50)' : language === 'zh' ? '初中高三级 (5/25/50题)' : '3 Tiers (5/25/50)'}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-white leading-snug">
                {language === 'fr'
                  ? 'Guerre de Capitalisation : Le Pouvoir Absolu'
                  : language === 'zh'
                  ? '股权结构防卫战 · 守卫生命线'
                  : 'Cap Table Defense: War for Sovereignty'}
              </h2>

              <p className="text-[11px] text-stone-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
                {language === 'fr'
                  ? 'La défense de la table n’est pas pour thésauriser, mais pour protéger la vision. Déjouez les coups d’État et les pools prédateurs en 5, 25 ou 50 questions dynamiques.'
                  : language === 'zh'
                  ? '股权防卫绝非守财，而是守护愿景的绝对掌控权。初级5题摸底、中级25题董事会推演、高级50题终局决战，破期权池洗牌与全棘轮毒丸，题题随机不重复。'
                  : 'Cap table defense preserves sovereign control over your life’s vision. Master board balance, dual-class stock, and ratchets across 5, 25, or 50 procedural rounds.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-stone-200 font-mono text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'fr' ? 'Records' : language === 'zh' ? '巅峰榜' : 'High Scores'}</span>
            </button>

            <button
              onClick={() => setActiveGameId('game_03')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-stone-950 font-mono font-bold text-xs shadow-lg flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 fill-current text-stone-950" />
              <span>{language === 'fr' ? 'Jouer Game #3' : language === 'zh' ? '进入股权防卫战' : 'Play Game #3'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* GAME 1: FACING THE GAME MOUNT */}
      {activeGameId === 'game_01' && (
        <FacingTheGame
          onFinish={(score) => {
            recordGameScore('game_01', score);
          }}
          onExit={() => setActiveGameId(null)}
        />
      )}

      {/* GAME 2: SPEED VALUATION LIVE ENGINE MOUNT */}
      {activeGameId === 'game_02' && (
        <SpeedValuationGame
          onExit={() => setActiveGameId(null)}
        />
      )}

      {/* GAME 3: CAP TABLE BATTLE LIVE ENGINE MOUNT */}
      {activeGameId === 'game_03' && (
        <CapTableBattleGame
          onExit={() => setActiveGameId(null)}
        />
      )}

      {/* Active Game Modal / Sandbox Overlay (Other Games: Game #4, #5...) */}
      {activeGameId && activeGameId !== 'game_01' && activeGameId !== 'game_02' && activeGameId !== 'game_03' && activeGame && (
        <div className="p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border-2 border-emerald-500 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border-main dark:border-stone-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                Game #{activeGame.number} • {activeGame.difficulty}
              </span>
              <h2 className="text-xl font-bold font-heading text-text-primary dark:text-stone-100">
                {activeGame.localizedTitle[language]}
              </h2>
            </div>
            <button
              onClick={() => setActiveGameId(null)}
              className="text-xs px-3 py-1.5 rounded-lg bg-surface-muted dark:bg-stone-800 text-text-secondary hover:text-text-primary"
            >
              {language === 'fr' ? 'Quitter le jeu' : language === 'zh' ? '退出游戏' : 'Exit Game'}
            </button>
          </div>

          {/* GAME 5: TERM SHEET DETECTIVE LIVE ENGINE */}
          {activeGameId === 'game_05' && (

            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200">
                <strong>Mission :</strong> {language === 'fr'
                  ? 'Cliquez sur les 3 clauses prédatrices cachées dans cette term sheet préliminaire.'
                  : language === 'zh'
                  ? '审查下方意向书条款草案，点击找出其中隐藏的3条毒丸条款。'
                  : 'Click on the 3 predatory poison pill clauses hidden within this draft term sheet.'}
              </div>

              <div className="space-y-3">
                {detectiveClauses.map((clause) => {
                  const isFound = trapsFound.includes(clause.id);
                  return (
                    <div
                      key={clause.id}
                      onClick={() => handleToggleTrap(clause.id, clause.isTrap)}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                        isFound
                          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'bg-surface-main dark:bg-stone-900 border-border-main dark:border-stone-800 hover:border-amber-500/50 text-text-primary dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="leading-relaxed pr-4 font-mono text-[11px] md:text-xs">
                          {clause.text}
                        </p>
                        {isFound && (
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-rose-600 text-white shrink-0">
                            TRAP DETECTED
                          </span>
                        )}
                      </div>
                      {isFound && (
                        <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-2 pt-2 border-t border-rose-200 dark:border-rose-900/40 italic">
                          Why: {clause.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-main dark:border-stone-800 text-xs font-mono">
                <span>
                  Traps Spotted: <strong>{trapsFound.length} / 3</strong>
                </span>
                {detectiveFinished ? (
                  <span className="text-emerald-600 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Term Sheet Cleaned (+100 pts)</span>
                  </span>
                ) : (
                  <span className="text-text-secondary">Keep inspecting...</span>
                )}
              </div>
            </div>
          )}

          {/* Fallback for other games: Quick Simulator Launcher */}
          {activeGameId !== 'game_02' && activeGameId !== 'game_05' && (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <Gamepad2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-text-primary dark:text-stone-100">
                {activeGame.localizedTitle[language]}
              </h3>
              <p className="text-xs text-text-secondary dark:text-stone-400">
                {activeGame.objective[language]}
              </p>
              <div className="p-3 rounded-xl bg-surface-muted dark:bg-stone-800 text-xs font-mono text-text-secondary dark:text-stone-300">
                Skills: {activeGame.skillsTrained.join(' • ')}
              </div>
              <button
                onClick={() => {
                  recordGameScore(activeGame.id, 85);
                  setActiveGameId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Complete Interactive Exercise (+85 pts)
              </button>
            </div>
          )}
        </div>
      )}

      {/* 20 Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {gamesData.map((game) => {
          const userScore = progress.gameScores[game.id] || 0;
          const isMastered = userScore >= 90;

          return (
            <div
              key={game.id}
              onClick={() => setActiveGameId(game.id)}
              className="p-5 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 hover:border-amber-500/40 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-text-secondary dark:text-stone-400">
                    Game #{game.number}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {game.difficulty}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {game.localizedTitle[language]}
                </h3>

                <p className="text-xs text-text-secondary dark:text-stone-400 line-clamp-2 mt-1.5 leading-relaxed">
                  {game.objective[language]}
                </p>

                <div className="mt-3 flex items-center space-x-2 text-[10px] text-text-secondary dark:text-stone-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{game.durationMinutes} min</span>
                  <span>•</span>
                  <span>{game.category}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border-main dark:border-stone-800 flex items-center justify-between text-xs">
                {userScore > 0 ? (
                  <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    Best: {userScore} pts
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-text-secondary dark:text-stone-400">
                    Unplayed
                  </span>
                )}

                <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Play</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
};

