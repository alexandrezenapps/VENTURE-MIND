import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Award, Grid, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { playPsychPulse, playGameErrorSound, playGameVictoryFanfare, playSubtleClick } from '../../../utils/soundscapes';

interface SpatialMatrixGameProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

export const SpatialMatrixGame: React.FC<SpatialMatrixGameProps> = ({ onFinish, onExit }) => {
  const { language, isAudioMuted } = useApp();

  const [currentLevel, setCurrentLevel] = useState(1); // Levels 1 to 5
  const [gameState, setGameState] = useState<'idle' | 'memorizing' | 'recalling' | 'round_complete' | 'ended'>('idle');

  // 4x4 matrix (16 cells)
  const [targetCells, setTargetCells] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const startLevel = (lvl: number) => {
    // Number of cells to memorize scales: Level 1 = 4, Level 2 = 5, Level 3 = 6, Level 4 = 7, Level 5 = 8
    const count = 3 + lvl;
    const picked: number[] = [];
    while (picked.length < count) {
      const r = Math.floor(Math.random() * 16);
      if (!picked.includes(r)) picked.push(r);
    }

    setTargetCells(picked);
    setSelectedCells([]);
    setGameState('memorizing');

    if (!isAudioMuted) playPsychPulse(440, 0.3);

    // Memorize for 1.8 seconds, then go dark for recall
    setTimeout(() => {
      setGameState('recalling');
    }, 1800);
  };

  const startGame = () => {
    setCurrentLevel(1);
    setScore(0);
    startLevel(1);
  };

  const handleCellClick = (idx: number) => {
    if (gameState !== 'recalling' || selectedCells.includes(idx)) return;

    const nextSelected = [...selectedCells, idx];
    setSelectedCells(nextSelected);

    if (targetCells.includes(idx)) {
      if (!isAudioMuted) playSubtleClick();
    } else {
      if (!isAudioMuted) playGameErrorSound();
    }

    // Check if player has selected the required number of cells
    if (nextSelected.length >= targetCells.length) {
      // Evaluate accuracy for this level
      const correctHits = nextSelected.filter((c) => targetCells.includes(c)).length;
      const levelScore = correctHits * 30 + (correctHits === targetCells.length ? 50 : 0);
      setScore((s) => s + levelScore);

      setGameState('round_complete');

      if (currentLevel < 5) {
        setTimeout(() => {
          setCurrentLevel((l) => l + 1);
          startLevel(currentLevel + 1);
        }, 1200);
      } else {
        setTimeout(() => {
          setGameState('ended');
          if (!isAudioMuted) playGameVictoryFanfare();
        }, 1200);
      }
    }
  };

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-main dark:bg-[#121629] border border-purple-500/20 shadow-2xl text-text-primary dark:text-stone-100 max-w-2xl mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-main dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold block">
            {language === 'fr' ? 'Mémoire Spatiale Matricielle' : language === 'zh' ? '瞬态空间工作记忆宽带' : 'Spatial Memory Matrix'}
          </span>
          <h3 className="text-lg font-bold font-heading text-text-primary dark:text-stone-100">
            {language === 'fr' ? 'Encodage Visuel Éclair' : language === 'zh' ? '黑曜石符文空间拓扑复原' : 'Corsi Visuospatial Sketchpad'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30">
            {language === 'fr' ? 'Niveau' : language === 'zh' ? '难度阶梯' : 'Level'} {currentLevel} / 5
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
            <Grid className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-text-primary dark:text-stone-100">
              {language === 'fr'
                ? 'Mémorisez les cristaux allumés pendant 1,8 seconde'
                : language === 'zh'
                ? '游戏规则：在1.8秒内速记高亮晶格，熄灭后凭记忆原样点击还原'
                : 'Rule: Memorize the illuminated rune coordinates in 1.8s, then tap to replicate'}
            </h4>
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {language === 'fr'
                ? 'Une constellation de runes dorées s’allume brièvement sur la grille 4x4. Restituez le schéma de tête. Le nombre de cibles augmente à chaque palier.'
                : language === 'zh'
                ? '4x4黑曜石阵列将点亮若干发光晶格（由4格递增至8格）。网格熄灭后，依靠海马体空间拓扑印记，准确点击复现所有被点亮的位置。'
                : 'Golden obsidian runes illuminate for a brief 1.8s window. Reconstruct the spatial schema from memory as the cognitive span expands from 4 to 8 nodes.'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'fr' ? 'Lancer la matrice' : language === 'zh' ? '开始空间记忆测试' : 'Start Spatial Matrix'}</span>
          </button>
        </div>
      )}

      {(gameState === 'memorizing' || gameState === 'recalling' || gameState === 'round_complete') && (
        <div className="space-y-6 py-2">
          {/* Phase Banner */}
          <div className="text-center font-mono text-xs">
            <span
              className={`px-3 py-1 rounded-xl uppercase tracking-wider font-bold inline-block border ${
                gameState === 'memorizing'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse'
                  : gameState === 'recalling'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
              }`}
            >
              {gameState === 'memorizing'
                ? language === 'fr' ? '👁️ OBSERVEZ & ENCODEZ' : language === 'zh' ? '👁️ 正在编码：速记发光位置 (1.8秒)' : '👁️ ENCODING: MEMORIZE PATTERN'
                : gameState === 'recalling'
                ? language === 'fr' ? '🎯 RESTITUEZ LE SCHÉMA' : language === 'zh' ? '🎯 凭记忆点击还原被点亮晶格' : '🎯 RECALL: TAP MATCHING COORDINATES'
                : language === 'fr' ? '✓ TOUR VALIDÉ !' : language === 'zh' ? '✓ 阶梯完成！进入下一轮' : '✓ ROUND COMPLETE!'}
            </span>
          </div>

          {/* 4x4 Obsidian Grid */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-[280px] sm:max-w-[320px] mx-auto p-4 rounded-3xl bg-stone-900/90 border border-white/10 shadow-2xl">
            {Array.from({ length: 16 }).map((_, idx) => {
              const isTarget = targetCells.includes(idx);
              const isSelected = selectedCells.includes(idx);

              let cellStyle = 'bg-stone-800/60 border-white/5 hover:border-purple-400/30';

              if (gameState === 'memorizing') {
                if (isTarget) {
                  cellStyle = 'bg-gradient-to-br from-amber-400 to-amber-500 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-105';
                }
              } else if (gameState === 'recalling') {
                if (isSelected) {
                  cellStyle = isTarget
                    ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                    : 'bg-red-500 border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.5)]';
                }
              } else if (gameState === 'round_complete') {
                if (isTarget) {
                  cellStyle = isSelected
                    ? 'bg-emerald-500 border-emerald-300 shadow-md'
                    : 'bg-amber-500/50 border-amber-300 border-dashed';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  disabled={gameState !== 'recalling' || isSelected}
                  className={`aspect-square rounded-2xl transition-all duration-200 border flex items-center justify-center active:scale-95 shadow-md ${cellStyle}`}
                >
                  {gameState === 'memorizing' && isTarget && (
                    <Sparkles className="w-5 h-5 text-stone-950 animate-spin" />
                  )}
                  {gameState === 'recalling' && isSelected && isTarget && (
                    <CheckCircle2 className="w-5 h-5 text-stone-950" />
                  )}
                  {gameState === 'recalling' && isSelected && !isTarget && (
                    <XCircle className="w-5 h-5 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-center text-xs font-mono text-stone-400">
            {language === 'fr' ? 'Sélectionnés :' : language === 'zh' ? '已选择晶格：' : 'Selected:'}{' '}
            <strong className="text-purple-400">{selectedCells.length} / {targetCells.length}</strong>
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-serif-luxury font-bold text-text-primary dark:text-stone-100">
              {language === 'fr' ? 'Indice de Mémoire Spatiale' : language === 'zh' ? '海马体空间拓扑记忆报告' : 'Spatial Working Memory Scorecard'}
            </h3>
            <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
              {score >= 350
                ? language === 'fr'
                  ? 'Capacité spatiale prodigieuse. Votre calepin visuo-spatial retient des architectures mentales denses avec une grande clarté.'
                  : language === 'zh'
                  ? '非凡的视空间草稿板容量！能够在脑海中清晰留存高密度的复杂空间坐标与多维股权架构蓝图。'
                  : 'Exceptional visuospatial sketchpad. Your hippocampus retains dense mental models and architectural topologies with crystal clarity.'
                : language === 'fr'
                ? 'Bonne mémoire visuelle. La pratique régulière renforce l’empan spatial.'
                : language === 'zh'
                ? '良好基础。持续进行网格瞬态记忆训练可显著扩增短期视觉空间广度。'
                : 'Solid visuospatial baseline. Ongoing matrix practice expands working memory spatial span.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">FINAL SCORE</span>
              <span className="text-lg font-bold text-purple-400">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted dark:bg-stone-900/60 border border-border-main dark:border-white/5">
              <span className="text-[10px] text-text-secondary dark:text-stone-400 font-mono block">MAX SPATIAL SPAN</span>
              <span className="text-lg font-bold text-emerald-400">7-Node Grid</span>
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
