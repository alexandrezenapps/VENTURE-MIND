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

export const GamesHubView: React.FC = () => {
  const { language, progress, recordGameScore, formatMoney, setActiveTab } = useApp();

  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mini-Game 1 State: Speed Valuation (Game 2)
  const [valRound, setValRound] = useState(1);
  const [valPre, setValPre] = useState(8000000);
  const [valInvest, setValInvest] = useState(2000000);
  const [valTimer, setValTimer] = useState(25);
  const [valScore, setValScore] = useState(0);
  const [valFeedback, setValFeedback] = useState<string | null>(null);
  const [valIsActive, setValIsActive] = useState(false);

  // Mini-Game 2 State: Term Sheet Detective (Game 5)
  const [trapsFound, setTrapsFound] = useState<string[]>([]);
  const [detectiveScore, setDetectiveScore] = useState(0);
  const [detectiveFinished, setDetectiveFinished] = useState(false);

  const activeGame = gamesData.find((g) => g.id === activeGameId);

  // Speed valuation game timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeGameId === 'game_02' && valIsActive && valTimer > 0) {
      interval = setInterval(() => {
        setValTimer((t) => {
          if (t <= 1) {
            setValIsActive(false);
            recordGameScore('game_02', valScore);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGameId, valIsActive, valTimer, valScore, recordGameScore]);

  const startSpeedValuation = () => {
    setValRound(1);
    setValPre(8000000);
    setValInvest(2000000);
    setValTimer(30);
    setValScore(0);
    setValFeedback(null);
    setValIsActive(true);
  };

  const handleValAnswer = (selectedPost: number) => {
    const correctPost = valPre + valInvest;
    if (selectedPost === correctPost) {
      const added = 20 + valTimer;
      const nextScore = valScore + added;
      setValScore(nextScore);
      setValFeedback('Correct! + ' + added + ' pts');

      if (valRound < 5) {
        setValRound((r) => r + 1);
        const newPre = (valRound + 2) * 4000000;
        const newInvest = (valRound + 1) * 1500000;
        setValPre(newPre);
        setValInvest(newInvest);
        setValTimer(25);
      } else {
        setValIsActive(false);
        recordGameScore('game_02', nextScore);
      }
    } else {
      setValFeedback('Incorrect valuation calculation. Try again!');
    }
  };

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

        {/* Global Game Mastery Score */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-text-secondary dark:text-stone-400">
              {language === 'fr' ? 'Points Cumulés' : language === 'zh' ? '实战总积分' : 'Total Game Points'}
            </div>
            <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
              {Object.values(progress.gameScores).reduce((a, b) => a + b, 0)}{' '}
              <span className="text-xs text-text-secondary dark:text-stone-400 font-normal">/ 2,000</span>
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

      {/* Active Game Modal / Sandbox Overlay */}
      {activeGameId && activeGame && (
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
              onClick={() => {
                setActiveGameId(null);
                setValIsActive(false);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-surface-muted dark:bg-stone-800 text-text-secondary hover:text-text-primary"
            >
              {language === 'fr' ? 'Quitter le jeu' : language === 'zh' ? '退出游戏' : 'Exit Game'}
            </button>
          </div>

          {/* GAME 2: SPEED VALUATION LIVE ENGINE */}
          {activeGameId === 'game_02' && (
            <div className="space-y-6">
              {!valIsActive && valRound === 1 && valScore === 0 ? (
                <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
                  <Zap className="w-12 h-12 text-amber-500 mx-auto" />
                  <h3 className="text-lg font-bold text-text-primary dark:text-stone-100">
                    {language === 'fr'
                      ? 'Prêt pour le défi de valorisation éclair ?'
                      : language === 'zh'
                      ? '准备好开始极速估值挑战了吗？'
                      : 'Ready for Speed Valuation?'}
                  </h3>
                  <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
                    {language === 'fr'
                      ? '5 questions successives. 30 secondes par tour. Calculez instantanément la valorisation Post-Money et la part investisseur.'
                      : language === 'zh'
                      ? '连续5轮快速作答，每轮30秒。快速心算投后估值与投资人稀释占比。'
                      : '5 consecutive rounds. 30 seconds per round. Compute Post-Money Valuation and investor dilution instantly.'}
                  </p>
                  <button
                    onClick={startSpeedValuation}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md"
                  >
                    {language === 'fr' ? 'Démarrer le Chronomètre' : language === 'zh' ? '开始计时挑战' : 'Start Timer'}
                  </button>
                </div>
              ) : valIsActive ? (
                <div className="space-y-6 max-w-xl mx-auto">
                  {/* Status HUD */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted dark:bg-stone-800 text-xs font-mono">
                    <span>Round {valRound} / 5</span>
                    <span className="flex items-center space-x-1 text-amber-600 font-bold">
                      <Clock className="w-4 h-4" />
                      <span>{valTimer}s</span>
                    </span>
                    <span className="text-emerald-600 font-bold">{valScore} pts</span>
                  </div>

                  {/* Question Box */}
                  <div className="p-6 rounded-2xl bg-stone-100 dark:bg-stone-800/80 text-center space-y-2">
                    <span className="text-xs font-mono uppercase text-text-secondary dark:text-stone-400">
                      Scenario #{valRound}
                    </span>
                    <div className="text-sm md:text-base font-semibold text-text-primary dark:text-stone-100">
                      Pre-Money = <strong className="text-emerald-600">{formatMoney(valPre)}</strong> | Investment = <strong className="text-blue-600">{formatMoney(valInvest)}</strong>
                    </div>
                    <p className="text-xs text-text-secondary dark:text-stone-400">
                      What is the resulting Post-Money Valuation?
                    </p>
                  </div>

                  {/* 3 Selectable Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      valPre + valInvest,
                      valPre + valInvest * 1.5,
                      valPre - valInvest > 0 ? valPre - valInvest : valPre * 1.2,
                    ]
                      .sort(() => Math.random() - 0.5)
                      .map((valOpt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleValAnswer(valOpt)}
                          className="p-3.5 rounded-xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-700 hover:border-emerald-500 text-sm font-mono font-bold text-text-primary dark:text-stone-100 hover:bg-emerald-500/10 transition-all"
                        >
                          {formatMoney(valOpt)}
                        </button>
                      ))}
                  </div>

                  {valFeedback && (
                    <div className="text-center text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                      {valFeedback}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-text-primary dark:text-stone-100 font-heading">
                    Challenge Completed!
                  </h3>
                  <p className="text-sm font-mono text-emerald-600 font-bold">
                    Final Score: {valScore} / 100 pts (+XP added)
                  </p>
                  <button
                    onClick={startSpeedValuation}
                    className="px-5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium text-xs hover:bg-stone-300"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}

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
    </div>
  );
};
