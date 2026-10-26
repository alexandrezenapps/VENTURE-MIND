import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Sparkles,
  Flame,
  Brain,
  Scale,
  TrendingUp,
  X,
  User,
  Edit2,
  Check,
  RotateCcw,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  LeaderboardRecord,
  SessionModeKey,
} from '../../types';
import {
  getLeaderboardRecords,
  getUserBestScore,
  getUserPlayerName,
  setUserPlayerName,
  resetLeaderboardToDefaults,
} from '../../utils/leaderboardStorage';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightRecordId?: string | null;
  defaultMode?: SessionModeKey;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  highlightRecordId,
  defaultMode = 'all',
}) => {
  const { language, formatMoney } = useApp();

  const [activeMode, setActiveMode] = useState<SessionModeKey>(defaultMode);
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);
  const [playerName, setPlayerName] = useState(() => getUserPlayerName());
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(() => getUserPlayerName());

  const refreshRecords = (mode: SessionModeKey) => {
    const list = getLeaderboardRecords(mode);
    setRecords(list);
  };

  useEffect(() => {
    if (isOpen) {
      refreshRecords(activeMode);
      setPlayerName(getUserPlayerName());
      setNameInput(getUserPlayerName());
    }
  }, [isOpen, activeMode]);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserPlayerName(nameInput.trim());
      setPlayerName(nameInput.trim());
      setIsEditingName(false);
      refreshRecords(activeMode);
    }
  };

  const handleResetDefaults = () => {
    resetLeaderboardToDefaults();
    refreshRecords(activeMode);
  };

  if (!isOpen) return null;

  const top3 = records.slice(0, 3);
  const remaining = records.slice(3);
  const userBest = getUserBestScore(activeMode);

  const t = {
    title: {
      en: 'Venture High Scores & Grandmaster Leaderboard',
      fr: 'Tableau des Records & Classement des Grands Maîtres',
      zh: '风投巅峰排行榜 · 宗师天梯',
    },
    subtitle: {
      en: 'Global executive rankings across 5, 10, and 20-round tactical deal sessions.',
      fr: 'Classement exécutif mondial sur les sessions de négociation à 5, 10 et 20 manches.',
      zh: '记录全球主管合伙人与创始人在5回合、10回合与20回合极限死局中的定力与估值守卫高分。',
    },
    tabs: {
      all: { en: 'All Sessions', fr: 'Toutes Sessions', zh: '全部天梯' },
      quick5: { en: '5-Round Duel', fr: '5 Manches', zh: '5 回合速战' },
      deep10: { en: '10-Round Masterclass', fr: '10 Manches', zh: '10 回合深弈' },
      grand20: { en: '20-Round Grand Slam', fr: '20 Manches', zh: '20 回合传奇' },
    },
    cols: {
      rank: { en: 'Rank', fr: 'Rang', zh: '排名' },
      player: { en: 'Executive / Partner', fr: 'Associé / Fondateur', zh: '选手与头衔' },
      session: { en: 'Mode', fr: 'Session', zh: '对局赛制' },
      score: { en: 'Score', fr: 'Score', zh: '终局得分' },
      composure: { en: 'Composure', fr: 'Sérénité', zh: '定力' },
      leverage: { en: 'Leverage', fr: 'Maîtrise', zh: '掌控力' },
      value: { en: 'Value Saved', fr: 'Valeur Sauvegardée', zh: '守住权益' },
      date: { en: 'Date', fr: 'Date', zh: '日期' },
    },
    userBanner: {
      en: 'Your High Score',
      fr: 'Votre Meilleur Score',
      zh: '你的历史最佳',
    },
    noRecords: {
      en: 'No session records found for this category yet. Be the first to conquer it!',
      fr: 'Aucun enregistrement pour cette catégorie. Soyez le premier à la conquérir !',
      zh: '当前赛制暂无纪录，立即开局，登顶首位！',
    },
  };

  const getSessionBadge = (mode: string) => {
    switch (mode) {
      case '5_rounds':
        return { label: '5-Round', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-400/20' };
      case '10_rounds':
        return { label: '10-Round', color: 'text-purple-400 bg-purple-500/10 border-purple-400/20' };
      case '20_rounds':
        return { label: '20-Round', color: 'text-amber-400 bg-amber-500/10 border-amber-400/20' };
      default:
        return { label: 'Duel', color: 'text-stone-300 bg-stone-500/10 border-stone-400/20' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl bg-[#0D101D] border border-amber-400/35 shadow-[0_24px_70px_rgba(0,0,0,0.8),0_0_35px_rgba(229,184,66,0.15)] text-stone-100 p-5 sm:p-7 md:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all shadow-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Region */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{language === 'fr' ? 'Classement des Étoiles VC' : language === 'zh' ? '风投竞技场 · 荣誉殿堂' : 'Venture Hall of Fame'}</span>
            </div>
            <h2 className="fluid-heading-2 font-serif-luxury font-bold text-white tracking-tight">
              {t.title[language]}
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              {t.subtitle[language]}
            </p>
          </div>

          {/* User Handle Customizer */}
          <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center gap-2.5 self-start md:self-auto">
            <User className="w-4 h-4 text-amber-400 shrink-0" />
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  maxLength={24}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg bg-black/60 border border-amber-400/50 text-white font-mono focus:outline-hidden w-36"
                  placeholder="Your handle"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                  title="Save name"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-300">{playerName}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-stone-400 hover:text-amber-400 transition-colors"
                  title="Edit executive handle"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User High Score Banner */}
        {userBest && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-emerald-500/20 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300 font-bold font-mono">
                ★
              </div>
              <div>
                <span className="font-mono text-stone-400 uppercase tracking-wider block text-[10px]">
                  {t.userBanner[language]}
                </span>
                <span className="text-sm font-bold text-white">
                  {userBest.playerName} · <strong className="text-amber-300">{userBest.score} pts</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono text-[11px] text-stone-300">
              <span>{userBest.composure}% {language === 'fr' ? 'Sérénité' : language === 'zh' ? '定力' : 'Composure'}</span>
              <span>·</span>
              <span>{userBest.leverage}% {language === 'fr' ? 'Maîtrise' : language === 'zh' ? '掌控力' : 'Leverage'}</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">{formatMoney(userBest.valuationSaved)}</span>
            </div>
          </div>
        )}

        {/* Session Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-white/[0.05] rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveMode('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMode === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {t.tabs.all[language]}
          </button>
          <button
            onClick={() => setActiveMode('5_rounds')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMode === '5_rounds'
                ? 'bg-cyan-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {t.tabs.quick5[language]}
          </button>
          <button
            onClick={() => setActiveMode('10_rounds')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMode === '10_rounds'
                ? 'bg-purple-500 text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {t.tabs.deep10[language]}
          </button>
          <button
            onClick={() => setActiveMode('20_rounds')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeMode === '20_rounds'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {t.tabs.grand20[language]}
          </button>
        </div>

        {/* Podium Top 3 Cards */}
        {top3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {/* 1st Place */}
            {top3[0] && (
              <div
                className={`order-1 md:order-2 p-5 rounded-3xl bg-gradient-to-b from-amber-500/25 via-[#1a1f38] to-[#12162a] border-2 border-amber-400/70 shadow-[0_12px_36px_rgba(245,158,11,0.25)] flex flex-col justify-between relative ${
                  top3[0].id === highlightRecordId ? 'ring-2 ring-amber-300' : ''
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1 shadow-md">
                  <Crown className="w-3 h-3 fill-current" />
                  <span>Rank #1 Grandmaster</span>
                </div>

                <div className="pt-2 text-center space-y-1">
                  <div className="text-base font-bold text-white truncate">{top3[0].playerName}</div>
                  <div className="text-[11px] text-amber-300 font-mono">
                    {top3[0].playerTitle[language]}
                  </div>
                  <div className="text-3xl font-bold font-mono text-amber-300 pt-2 tabular-nums">
                    {top3[0].score}{' '}
                    <span className="text-xs text-stone-400 font-normal">/ 100</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-1 text-center font-mono text-[10px] text-stone-300">
                  <div>
                    <span className="block text-stone-400">Composure</span>
                    <strong className="text-purple-300">{top3[0].composure}%</strong>
                  </div>
                  <div>
                    <span className="block text-stone-400">Leverage</span>
                    <strong className="text-cyan-300">{top3[0].leverage}%</strong>
                  </div>
                  <div>
                    <span className="block text-stone-400">Protected</span>
                    <strong className="text-emerald-400">{formatMoney(top3[0].valuationSaved)}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* 2nd Place */}
            {top3[1] && (
              <div
                className={`order-2 md:order-1 p-4.5 rounded-3xl bg-white/[0.04] border border-white/20 shadow-md flex flex-col justify-between relative ${
                  top3[1].id === highlightRecordId ? 'ring-2 ring-cyan-300' : ''
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-[10px] font-mono uppercase text-stone-400 font-bold">
                    🥈 Rank #2 Master
                  </div>
                  <div className="text-sm font-bold text-white truncate">{top3[1].playerName}</div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    {top3[1].playerTitle[language]}
                  </div>
                  <div className="text-2xl font-bold font-mono text-stone-200 pt-1 tabular-nums">
                    {top3[1].score}{' '}
                    <span className="text-xs text-stone-400 font-normal">/ 100</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-3 gap-1 text-center font-mono text-[10px] text-stone-300">
                  <div>
                    <span className="block text-stone-400">Composure</span>
                    <strong className="text-purple-300">{top3[1].composure}%</strong>
                  </div>
                  <div>
                    <span className="block text-stone-400">Leverage</span>
                    <strong className="text-cyan-300">{top3[1].leverage}%</strong>
                  </div>
                  <div>
                    <span className="block text-stone-400">Protected</span>
                    <strong className="text-emerald-400">{formatMoney(top3[1].valuationSaved)}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div
                className={`order-3 p-4.5 rounded-3xl bg-white/[0.04] border border-white/20 shadow-md flex flex-col justify-between relative ${
                  top3[2].id === highlightRecordId ? 'ring-2 ring-amber-500' : ''
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-[10px] font-mono uppercase text-amber-600 font-bold">
                    🥉 Rank #3 Principal
                  </div>
                  <div className="text-sm font-bold text-white truncate">{top3[2].playerName}</div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    {top3[2].playerTitle[language]}
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-500 pt-1 tabular-nums">
                    {top3[2].score}{' '}
                    <span className="text-xs text-stone-400 font-normal">/ 100</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-3 gap-1 text-center font-mono text-[10px] text-stone-300">
                  <div>
                    <span className="block text-stone-400">Composure</span>
                    <strong className="text-purple-300">{top3[2].composure}%</strong>
                  </div>
                  <div>
                    <span className="block text-stone-400">Leverage</span>
                    <strong className="text-cyan-300">{top3[2].leverage}%</strong>
                  </div>
                  <div>
                    <span className="block text-stone-400">Protected</span>
                    <strong className="text-emerald-400">{formatMoney(top3[2].valuationSaved)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabular Ranks Grid */}
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.06] text-stone-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4 w-14">{t.cols.rank[language]}</th>
                  <th className="py-3 px-4">{t.cols.player[language]}</th>
                  <th className="py-3 px-4">{t.cols.session[language]}</th>
                  <th className="py-3 px-4 text-right">{t.cols.score[language]}</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">{t.cols.composure[language]}</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">{t.cols.leverage[language]}</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">{t.cols.value[language]}</th>
                  <th className="py-3 px-4 text-right hidden lg:table-cell">{t.cols.date[language]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-stone-400 italic">
                      {t.noRecords[language]}
                    </td>
                  </tr>
                ) : (
                  records.map((rec, index) => {
                    const isHighlighted = rec.id === highlightRecordId;
                    const sessionBadge = getSessionBadge(rec.sessionMode);
                    return (
                      <tr
                        key={rec.id}
                        className={`transition-colors ${
                          isHighlighted
                            ? 'bg-amber-500/20 font-bold'
                            : rec.isUser
                            ? 'bg-purple-950/20 hover:bg-purple-950/30'
                            : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="py-3 px-4 font-bold">
                          {index === 0 ? (
                            <span className="text-amber-300">#1</span>
                          ) : index === 1 ? (
                            <span className="text-stone-300">#2</span>
                          ) : index === 2 ? (
                            <span className="text-amber-600">#3</span>
                          ) : (
                            <span className="text-stone-500">#{index + 1}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-sans">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
                              {rec.playerName}
                            </span>
                            {rec.isUser && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-amber-400 text-stone-950 font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono block">
                            {rec.playerTitle[language]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${sessionBadge.color}`}>
                            {sessionBadge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold tabular-nums text-amber-300 text-sm">
                          {rec.score}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-purple-300 hidden sm:table-cell">
                          {rec.composure}%
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-cyan-300 hidden sm:table-cell">
                          {rec.leverage}%
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-emerald-400 font-semibold hidden md:table-cell">
                          {formatMoney(rec.valuationSaved)}
                        </td>
                        <td className="py-3 px-4 text-right text-stone-400 text-[10px] hidden lg:table-cell">
                          {new Date(rec.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between text-xs pt-2">
          <button
            onClick={handleResetDefaults}
            className="text-[11px] font-mono text-stone-500 hover:text-stone-300 flex items-center space-x-1 cursor-pointer"
            title="Reset to default peer records"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{language === 'fr' ? 'Réinitialiser le classement' : language === 'zh' ? '重置排行榜数据' : 'Reset Table'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            {language === 'fr' ? 'Fermer' : language === 'zh' ? '关闭榜单' : 'Close Leaderboard'}
          </button>
        </div>
      </div>
    </div>
  );
};
