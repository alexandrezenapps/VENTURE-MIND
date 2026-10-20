import React, { useState } from 'react';
import {
  Brain,
  Zap,
  ShieldCheck,
  Eye,
  Target,
  Smile,
  HeartPulse,
  Hourglass,
  ShieldAlert,
  Coins,
  Sparkles,
  Flame,
  Grid,
  Play,
  RotateCcw,
  Award,
  Activity,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  psychologyGamesList,
  psychologyDomainsMeta,
} from '../../data/psychologyGamesData';
import { PsychologyGameDomain, PsychologyGameMeta } from '../../types';

// Import all 12 game components
import { StroopGame } from './games/StroopGame';
import { DualNBackGame } from './games/DualNBackGame';
import { SchulteGridGame } from './games/SchulteGridGame';
import { MicroExpressionGame } from './games/MicroExpressionGame';
import { HeartbeatVagusGame } from './games/HeartbeatVagusGame';
import { MarshmallowDelayGame } from './games/MarshmallowDelayGame';
import { CognitiveReframeGame } from './games/CognitiveReframeGame';
import { IowaGamblingGame } from './games/IowaGamblingGame';
import { GoNoGoGame } from './games/GoNoGoGame';
import { WisconsinCardGame } from './games/WisconsinCardGame';
import { SunkCostGame } from './games/SunkCostGame';
import { SpatialMatrixGame } from './games/SpatialMatrixGame';

export const PsychologyGamesHub: React.FC = () => {
  const { language, progress, recordGameScore } = useApp();

  const [selectedDomain, setSelectedDomain] = useState<PsychologyGameDomain | 'all'>('all');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const filteredGames = psychologyGamesList.filter((g) => {
    if (selectedDomain === 'all') return true;
    return g.domain === selectedDomain;
  });

  const activeGame = psychologyGamesList.find((g) => g.id === activeGameId);

  // Cognitive KPI calculation across domains
  const calculateDomainScore = (domain: PsychologyGameDomain) => {
    const domainGames = psychologyGamesList.filter((g) => g.domain === domain);
    const scores = domainGames.map((g) => progress.gameScores[g.bestScoreKey] || 0);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return avg;
  };

  const attentionScore = calculateDomainScore('attention');
  const brainScore = calculateDomainScore('brain');
  const resilienceScore = calculateDomainScore('resilience');

  const handleFinishGame = (gameId: string, score: number) => {
    const game = psychologyGamesList.find((g) => g.id === gameId);
    if (game) {
      recordGameScore(game.bestScoreKey, score);
    }
    setActiveGameId(null);
  };

  const getGameIcon = (iconName: string) => {
    switch (iconName) {
      case 'Eye':
        return Eye;
      case 'Brain':
        return Brain;
      case 'Target':
        return Target;
      case 'Smile':
        return Smile;
      case 'HeartPulse':
        return HeartPulse;
      case 'Hourglass':
        return Hourglass;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Coins':
        return Coins;
      case 'Zap':
        return Zap;
      case 'Sparkles':
        return Sparkles;
      case 'Flame':
        return Flame;
      case 'Grid':
        return Grid;
      default:
        return Brain;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Executive Cognitive Lab Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#121629] via-[#1a1f3d] to-[#12222a] border border-amber-400/20 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'fr'
                ? 'Laboratoire Neuro-Cognitif & 12 Défis Psychologiques'
                : language === 'zh'
                ? '心理学心智实验室 · 12项高阶心智博弈游戏'
                : 'Cognitive Neuro-Lab · 12 Psychology Mind Games'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-medium tracking-tight text-white">
            {language === 'fr'
              ? 'Attention, Cerveau & Résilience Psychologique'
              : language === 'zh'
              ? '锻造极专注力、敏捷动脑与临危不乱的心理素质'
              : 'Attention, Neuro-Agility & Sovereign Composure'}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            {language === 'fr'
              ? 'Conçus d’après les paradigmes de Stroop, N-Back, Schulte, Bechara et Damasio. Chaque jeu muscle vos réflexes préfrontaux, votre calme sous pression et votre capacité d’analyse rapide.'
              : language === 'zh'
              ? '严格基于斯特鲁普抑制、双重N-Back、舒尔特矩阵、微表情与爱荷华赌博任务等经典神经心理学范式设计。高光质感、声光反馈，全面强化注意力过滤、高速动脑与高压定力。'
              : 'Grounded in Stroop, Dual N-Back, Schulte, and Damasio paradigms. Each game strengthens prefrontal inhibition, working memory capacity, and autonomic composure under high-stakes deal pressure.'}
          </p>
        </div>

        {/* 3 Executive Pillar Scores */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-mono block">
                  {language === 'fr' ? 'Attention & Focus' : language === 'zh' ? '注意力专注度' : 'Attention & Focus'}
                </span>
                <span className="text-base font-bold text-amber-400">{attentionScore} pts</span>
              </div>
            </div>
            <span className="text-xs font-mono text-stone-400">
              {attentionScore > 200 ? 'Elite' : attentionScore > 100 ? 'Adept' : 'Initiate'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-purple-400/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-mono block">
                  {language === 'fr' ? 'Agilité Cérébrale' : language === 'zh' ? '动脑与工作记忆' : 'Neuro-Agility'}
                </span>
                <span className="text-base font-bold text-purple-400">{brainScore} pts</span>
              </div>
            </div>
            <span className="text-xs font-mono text-stone-400">
              {brainScore > 200 ? 'Fluid' : brainScore > 100 ? 'Agile' : 'Initiate'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-emerald-400/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-mono block">
                  {language === 'fr' ? 'Résilience & Calme' : language === 'zh' ? '心理素质与定力' : 'Resilience Quotient'}
                </span>
                <span className="text-base font-bold text-emerald-400">{resilienceScore} pts</span>
              </div>
            </div>
            <span className="text-xs font-mono text-stone-400">
              {resilienceScore > 200 ? 'Stoic' : resilienceScore > 100 ? 'Calm' : 'Initiate'}
            </span>
          </div>
        </div>
      </div>

      {/* Domain Filter Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedDomain('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedDomain === 'all'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-surface-muted dark:bg-[#15192c] text-text-secondary dark:text-stone-400 hover:text-text-primary'
          }`}
        >
          {language === 'fr' ? 'Tous les 12 jeux' : language === 'zh' ? '全部 12 款心智游戏' : 'All 12 Mind Games'}
        </button>

        <button
          onClick={() => setSelectedDomain('attention')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
            selectedDomain === 'attention'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-surface-muted dark:bg-[#15192c] text-text-secondary dark:text-stone-400 hover:text-text-primary'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>{psychologyDomainsMeta.attention.name[language]}</span>
        </button>

        <button
          onClick={() => setSelectedDomain('brain')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
            selectedDomain === 'brain'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-surface-muted dark:bg-[#15192c] text-text-secondary dark:text-stone-400 hover:text-text-primary'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>{psychologyDomainsMeta.brain.name[language]}</span>
        </button>

        <button
          onClick={() => setSelectedDomain('resilience')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
            selectedDomain === 'resilience'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-surface-muted dark:bg-[#15192c] text-text-secondary dark:text-stone-400 hover:text-text-primary'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{psychologyDomainsMeta.resilience.name[language]}</span>
        </button>
      </div>

      {/* 12 Luxury Psychology Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map((game) => {
          const Icon = getGameIcon(game.iconName);
          const domainMeta = psychologyDomainsMeta[game.domain];
          const bestScore = progress.gameScores[game.bestScoreKey] || 0;

          return (
            <div
              key={game.id}
              className="group relative rounded-3xl p-6 bg-surface-main dark:bg-[#121629] border border-border-main dark:border-white/10 hover:border-amber-400/40 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Header Metadata */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-surface-muted dark:bg-stone-800 text-text-primary dark:text-stone-200 flex items-center justify-center font-bold text-[11px]">
                      {game.number}
                    </span>
                    <span className="text-[10px] text-text-secondary dark:text-stone-400 uppercase tracking-wider">
                      {domainMeta.name[language]}
                    </span>
                  </div>
                  {bestScore > 0 ? (
                    <span className="text-emerald-500 font-bold flex items-center space-x-1 text-[11px]">
                      <Award className="w-3.5 h-3.5" />
                      <span>{bestScore} pts</span>
                    </span>
                  ) : (
                    <span className="text-stone-500 text-[10px] font-mono">
                      {language === 'fr' ? 'Non joué' : language === 'zh' ? '待挑战' : 'Unplayed'}
                    </span>
                  )}
                </div>

                {/* Icon & Title */}
                <div className="flex items-start space-x-3.5 pt-1">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${domainMeta.accentColor}18`, color: domainMeta.accentColor }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif-luxury font-bold text-base text-text-primary dark:text-stone-100 group-hover:text-amber-400 transition-colors">
                      {game.title[language]}
                    </h3>
                    <p className="text-[11px] text-text-secondary dark:text-stone-400 mt-0.5 leading-snug">
                      {game.subtitle[language]}
                    </p>
                  </div>
                </div>

                {/* Scientific Origin & Brain Region */}
                <div className="p-3 rounded-2xl bg-surface-muted/60 dark:bg-stone-900/60 border border-border-main dark:border-white/5 space-y-1 text-[11px]">
                  <div className="flex items-center space-x-1.5 text-text-secondary dark:text-stone-400">
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-500/90">
                      {language === 'fr' ? 'Origine :' : language === 'zh' ? '科学范式：' : 'Paradigm:'}
                    </span>
                    <span className="truncate">{game.scientificOrigin[language]}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-text-secondary dark:text-stone-400">
                    <span className="text-[10px] uppercase font-mono font-bold text-purple-400/90">
                      {language === 'fr' ? 'Cerveau :' : language === 'zh' ? '靶向脑区：' : 'Brain Area:'}
                    </span>
                    <span className="truncate">{game.targetBrainArea[language]}</span>
                  </div>
                </div>

                {/* Cognitive Benefit */}
                <p className="text-[11px] text-text-secondary dark:text-stone-400 leading-relaxed">
                  {game.cognitiveBenefit[language]}
                </p>
              </div>

              {/* Action Launch Button */}
              <div className="pt-5 mt-4 border-t border-border-main dark:border-white/5">
                <button
                  onClick={() => setActiveGameId(game.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-muted dark:bg-[#1a1f35] hover:bg-amber-500 hover:text-stone-950 dark:hover:bg-amber-500 dark:hover:text-stone-950 border border-border-main dark:border-white/10 hover:border-amber-400 text-text-primary dark:text-stone-200 font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-sm group-hover:border-amber-400/50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {language === 'fr'
                      ? 'Lancer l’entraînement'
                      : language === 'zh'
                      ? '开启心智训练'
                      : 'Launch Challenge'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Game Modal / Lightbox Arena */}
      {activeGameId && activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl shadow-2xl">
            {/* Close button in top-right */}
            <button
              onClick={() => setActiveGameId(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Game Renderer by ID */}
            {activeGameId === 'psy_stroop' && (
              <StroopGame
                onFinish={(score) => handleFinishGame('psy_stroop', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_dual_nback' && (
              <DualNBackGame
                onFinish={(score) => handleFinishGame('psy_dual_nback', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_schulte' && (
              <SchulteGridGame
                onFinish={(score) => handleFinishGame('psy_schulte', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_micro_expression' && (
              <MicroExpressionGame
                onFinish={(score) => handleFinishGame('psy_micro_expression', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_heartbeat' && (
              <HeartbeatVagusGame
                onFinish={(score) => handleFinishGame('psy_heartbeat', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_marshmallow' && (
              <MarshmallowDelayGame
                onFinish={(score) => handleFinishGame('psy_marshmallow', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_cognitive_reframe' && (
              <CognitiveReframeGame
                onFinish={(score) => handleFinishGame('psy_cognitive_reframe', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_iowa_gambling' && (
              <IowaGamblingGame
                onFinish={(score) => handleFinishGame('psy_iowa_gambling', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_gonogo' && (
              <GoNoGoGame
                onFinish={(score) => handleFinishGame('psy_gonogo', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_wisconsin' && (
              <WisconsinCardGame
                onFinish={(score) => handleFinishGame('psy_wisconsin', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_sunk_cost' && (
              <SunkCostGame
                onFinish={(score) => handleFinishGame('psy_sunk_cost', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === 'psy_spatial_matrix' && (
              <SpatialMatrixGame
                onFinish={(score) => handleFinishGame('psy_spatial_matrix', score)}
                onExit={() => setActiveGameId(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
