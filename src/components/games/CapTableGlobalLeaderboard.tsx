import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  ShieldCheck,
  Crown,
  Medal,
  Award,
  Zap,
  TrendingUp,
  Search,
  Filter,
  Play,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  Percent,
  DollarSign,
  UserCheck,
  Flame,
  Globe,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CapTableLeaderboardEntry,
  CapTableTierFilter,
  getCapTableGlobalLeaderboard,
  getUserCapTableSummary,
  subscribeToCapTableLeaderboard,
} from '../../services/capTableLeaderboardService';

interface CapTableGlobalLeaderboardProps {
  onPlayGame?: (tier?: 'junior' | 'mid' | 'senior') => void;
  className?: string;
  initialTierFilter?: CapTableTierFilter;
}

export const CapTableGlobalLeaderboard: React.FC<CapTableGlobalLeaderboardProps> = ({
  onPlayGame,
  className = '',
  initialTierFilter = 'all',
}) => {
  const { language, formatMoney } = useApp();

  const [activeTier, setActiveTier] = useState<CapTableTierFilter>(initialTierFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<CapTableLeaderboardEntry[]>([]);
  const [userSummary, setUserSummary] = useState(() => getUserCapTableSummary());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load and refresh leaderboard data
  const reloadData = () => {
    setIsRefreshing(true);
    const data = getCapTableGlobalLeaderboard(activeTier, searchQuery);
    setEntries(data);
    setUserSummary(getUserCapTableSummary());
    setTimeout(() => setIsRefreshing(false), 250);
  };

  useEffect(() => {
    reloadData();
  }, [activeTier, searchQuery]);

  // Subscribe to real-time events when user finishes a game session
  useEffect(() => {
    const unsubscribe = subscribeToCapTableLeaderboard(() => {
      reloadData();
    });
    return unsubscribe;
  }, [activeTier, searchQuery]);

  // Separate Top 3 for podium and remaining for table
  const top3 = useMemo(() => entries.slice(0, 3), [entries]);
  const tableEntries = useMemo(() => entries.slice(3), [entries]);

  // Translations
  const t = {
    badge: {
      en: 'Game #3 Official Global Ladder',
      fr: 'Classement Mondial Officiel Game #3',
      zh: 'Game #3 官方全球天梯榜',
    },
    title: {
      en: 'Cap Table Defense: Sovereign Rankings',
      fr: 'Guerre de Capitalisation : Classement Souverain',
      zh: '股权结构防卫战 · 全球巅峰天梯榜',
    },
    subtitle: {
      en: 'Global venture founders ranked by boardroom voting power preserved, anti-dilution mastery, and equity defense under extreme pressure.',
      fr: 'Fondateurs mondiaux classés par contrôle souverain préservé, maîtrise anti-dilution et valeur protégée.',
      zh: '记录全球风投创始人与董事长在董事会夺权、期权池洗牌与毒丸条款下的投票控制权留存率与股权守卫战力。',
    },
    tabs: {
      all: { en: 'All Tiers', fr: 'Tous Niveaux', zh: '全部段位' },
      junior: { en: 'Junior (5 Rounds)', fr: 'Junior (5 Manches)', zh: '初级 5题 · 摸底速攻' },
      mid: { en: 'Mid-Tier (25 Rounds)', fr: 'Intermédiaire (25 Manches)', zh: '中级 25题 · 董事会推演' },
      senior: { en: 'Senior (50 Rounds)', fr: 'Expert (50 Manches)', zh: '高级 50题 · 终局决战' },
    },
    searchPlaceholder: {
      en: 'Search by founder, title, or VC syndicate...',
      fr: 'Rechercher par fondateur, titre ou syndicat...',
      zh: '搜索创始人姓名、头衔或风投财团...',
    },
    userStanding: {
      title: { en: 'Your Sovereign Standing', fr: 'Votre Statut Souverain', zh: '您的当前主权战位' },
      unranked: {
        en: 'You have not defended your cap table on the global ladder yet.',
        fr: 'Vous n’avez pas encore défendu votre capital sur le classement.',
        zh: '您尚未在股权防卫战全球天梯留下记录。',
      },
      ctaPlay: { en: 'Enter Cap Table Battle', fr: 'Défendre la Table', zh: '进入防卫战立榜' },
      ctaImprove: { en: 'Play Again to Climb Rank', fr: 'Rejouer pour Grimper', zh: '再战一局冲击榜首' },
      rank: { en: 'Global Rank', fr: 'Rang Mondial', zh: '全球天梯排名' },
      votingPower: { en: 'Voting Control', fr: 'Contrôle des Votes', zh: '最高投票控制权' },
      equityRetained: { en: 'Founder Equity', fr: 'Capital Fondateur', zh: '股权留存率' },
      valueDefended: { en: 'Value Defended', fr: 'Valeur Défendue', zh: '成功守卫估值' },
      bestScore: { en: 'Best Score', fr: '最高积分', zh: '最高防卫战分' },
    },
    tableHeaders: {
      rank: { en: 'Rank', fr: 'Rang', zh: '排名' },
      founder: { en: 'Founder & Syndicate', fr: 'Fondateur & Syndicat', zh: '创始人 / 机构战盟' },
      tier: { en: 'Tier Mode', fr: 'Palier', zh: '防御关卡' },
      voting: { en: 'Voting Leverage', fr: 'Levier de Vote', zh: '投票权保留' },
      equity: { en: 'Founder Equity', fr: 'Capital Fondateur', zh: '股权留存' },
      saved: { en: 'Valuation Defended', fr: 'Valeur Sauvegardée', zh: '守卫估值' },
      score: { en: 'Defense Score', fr: 'Score de Défense', zh: '防卫积分' },
    },
    podiumTitles: {
      first: { en: '1st Sovereign Chair', fr: '1er Président Souverain', zh: '第1名 · 终身掌舵首席' },
      second: { en: '2nd Dual-Class Shield', fr: '2e Bouclier Double Classe', zh: '第2名 · 双重股权铁壁' },
      third: { en: '3rd Governance Titan', fr: '3e Titan de la Gouvernance', zh: '第3名 · 公司治理战神' },
    },
    emptyState: {
      en: 'No founders matched your query.',
      fr: 'Aucun fondateur ne correspond à votre recherche.',
      zh: '未找到符合条件的创始人记录。',
    },
    footerNote: {
      en: 'Rule of Sovereign Governance: Securing >50.1% voting power via dual-class stock or protective charter vetoes guarantees long-term strategic independence.',
      fr: 'Règle de Gouvernance : Maintenir >50,1% de droits de vote via super-actions assure l’indépendance de la vision stratégique.',
      zh: '主权治理铁律：通过双重股权架构或关键事项一票否决权牢牢捍卫>50.1%投票控制权，是创始人守卫公司生命线与战略独立性的根本护城河。',
    },
  };

  return (
    <div
      className={`rounded-3xl bg-gradient-to-b from-[#0a0e1a] via-[#0d1326] to-[#0a0f1d] border border-amber-500/30 shadow-2xl p-5 sm:p-7 md:p-8 text-white space-y-6 md:space-y-8 relative overflow-hidden ${className}`}
    >
      {/* Background Ambience Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <span className="p-1 rounded-md bg-amber-500/10 border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </span>
            <span>{t.badge[language]}</span>
            <span className="text-amber-500/40">/</span>
            <span className="inline-flex items-center space-x-1 text-emerald-400">
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? '1,428 Fondateurs Actifs' : language === 'zh' ? '1,428位创始人在线' : '1,428 Founders Ranked'}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white tracking-tight flex items-center gap-3">
            <span>{t.title[language]}</span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/15 border border-amber-400/40 text-amber-300">
              LIVE
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {t.subtitle[language]}
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={reloadData}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-mono"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">
              {language === 'fr' ? 'Actualiser' : language === 'zh' ? '刷新天梯' : 'Refresh'}
            </span>
          </button>

          {onPlayGame && (
            <button
              onClick={() => onPlayGame(activeTier === 'all' ? 'senior' : activeTier === '5_rounds' ? 'junior' : activeTier === '25_rounds' ? 'mid' : 'senior')}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-stone-950 font-mono font-bold text-xs shadow-lg flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {language === 'fr' ? 'Rejoindre la Guerre' : language === 'zh' ? '开启股权防卫战' : 'Play Game #3'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 2. User Standing Banner (Prominent Callout) */}
      <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-[#11172a]/90 border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/10 border border-amber-400/40 flex items-center justify-center shrink-0">
            {userSummary.hasPlayed ? (
              <Crown className="w-6 h-6 text-amber-300" />
            ) : (
              <UserCheck className="w-6 h-6 text-stone-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                {t.userStanding.title[language]}
              </span>
              {userSummary.hasPlayed && userSummary.bestRank && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                  #{userSummary.bestRank} / {entries.length}
                </span>
              )}
            </div>

            <div className="text-sm sm:text-base font-bold text-white mt-0.5">
              {userSummary.hasPlayed ? (
                <span>
                  {language === 'fr'
                    ? `Position Globale : #${userSummary.bestRank} • ${userSummary.highestVotingPower.toFixed(1)}% Contrôle Gardé`
                    : language === 'zh'
                    ? `当前排位：第 ${userSummary.bestRank} 名 • 最高掌控 ${userSummary.highestVotingPower.toFixed(1)}% 投票权`
                    : `Global Standing: Rank #${userSummary.bestRank} • ${userSummary.highestVotingPower.toFixed(1)}% Voting Preserved`}
                </span>
              ) : (
                <span className="text-stone-300">{t.userStanding.unranked[language]}</span>
              )}
            </div>

            {userSummary.hasPlayed && (
              <div className="flex items-center gap-3 text-[11px] font-mono text-stone-300 mt-1 flex-wrap">
                <span>
                  {t.userStanding.bestScore[language]}:{' '}
                  <strong className="text-amber-300">{userSummary.bestScore.toLocaleString()}</strong>
                </span>
                <span className="text-stone-600">•</span>
                <span>
                  {t.userStanding.valueDefended[language]}:{' '}
                  <strong className="text-emerald-400">{formatMoney(userSummary.highestEquitySaved)}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {onPlayGame && (
          <button
            onClick={() => onPlayGame(activeTier === 'all' ? 'senior' : activeTier === '5_rounds' ? 'junior' : activeTier === '25_rounds' ? 'mid' : 'senior')}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <span>
              {userSummary.hasPlayed
                ? t.userStanding.ctaImprove[language]
                : t.userStanding.ctaPlay[language]}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. Controls: Tier Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-10">
        {/* Tier Tabs */}
        <div className="flex items-center bg-[#0e1424] p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTier('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer shrink-0 ${
              activeTier === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {t.tabs.all[language]}
          </button>

          <button
            onClick={() => setActiveTier('5_rounds')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer shrink-0 ${
              activeTier === '5_rounds'
                ? 'bg-emerald-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {t.tabs.junior[language]}
          </button>

          <button
            onClick={() => setActiveTier('25_rounds')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer shrink-0 ${
              activeTier === '25_rounds'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {t.tabs.mid[language]}
          </button>

          <button
            onClick={() => setActiveTier('50_rounds')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer shrink-0 ${
              activeTier === '50_rounds'
                ? 'bg-purple-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {t.tabs.senior[language]}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder[language]}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0e1424] border border-white/10 text-xs font-mono text-white placeholder-stone-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs font-mono"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 4. Top 3 Sovereign Podium (Grandmasters) */}
      {top3.length > 0 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 pt-2">
          {top3.map((entry, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            const podiumMeta = isFirst
              ? {
                  crown: <Crown className="w-6 h-6 text-amber-300" />,
                  bg: 'bg-gradient-to-b from-amber-950/40 via-[#181d32] to-[#0f1424]',
                  border: 'border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.2)]',
                  rankColor: 'text-amber-400',
                  badgeBg: 'bg-amber-400/20 text-amber-200 border-amber-400/40',
                  titleLabel: t.podiumTitles.first[language],
                }
              : isSecond
              ? {
                  crown: <Medal className="w-5 h-5 text-stone-200" />,
                  bg: 'bg-gradient-to-b from-stone-900/60 via-[#151a2d] to-[#0f1424]',
                  border: 'border-stone-400/40 shadow-lg',
                  rankColor: 'text-stone-300',
                  badgeBg: 'bg-stone-300/20 text-stone-200 border-stone-300/40',
                  titleLabel: t.podiumTitles.second[language],
                }
              : {
                  crown: <Award className="w-5 h-5 text-amber-600" />,
                  bg: 'bg-gradient-to-b from-amber-950/20 via-[#14192b] to-[#0f1424]',
                  border: 'border-amber-700/40 shadow-lg',
                  rankColor: 'text-amber-500',
                  badgeBg: 'bg-amber-700/20 text-amber-300 border-amber-700/40',
                  titleLabel: t.podiumTitles.third[language],
                };

            return (
              <div
                key={entry.id}
                className={`rounded-2xl p-5 border ${podiumMeta.bg} ${podiumMeta.border} relative flex flex-col justify-between gap-4 transition-transform hover:-translate-y-1 duration-200 ${
                  entry.isUser ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                {/* Podium Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                      {podiumMeta.crown}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                        {podiumMeta.titleLabel}
                      </div>
                      <div className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <span className="truncate max-w-[150px]">{entry.playerName}</span>
                        {entry.isUser && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-400 text-stone-950 font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`text-2xl font-mono font-bold ${podiumMeta.rankColor}`}>
                    #{entry.rank}
                  </span>
                </div>

                {/* Subtitle & Syndicate */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-amber-200 font-serif-luxury">
                    {entry.playerTitle[language]}
                  </div>
                  <div className="text-[11px] font-mono text-stone-400 truncate">
                    {entry.syndicate} • {entry.countryCode}
                  </div>
                </div>

                {/* Defense Metrics Card */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-400 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.tableHeaders.voting[language]}</span>
                    </span>
                    <span className="font-bold text-amber-300">{entry.votingControlPct.toFixed(1)}%</span>
                  </div>

                  {/* Visual Voting Power Bar */}
                  <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, entry.votingControlPct)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-white/5">
                    <span className="text-stone-400">{t.tableHeaders.equity[language]}:</span>
                    <span className="text-emerald-300 font-semibold">{entry.founderEquityPct.toFixed(1)}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-400">{t.tableHeaders.saved[language]}:</span>
                    <span className="text-stone-200">{formatMoney(entry.valuationSaved)}</span>
                  </div>
                </div>

                {/* Accomplishment Callout */}
                {entry.specialAccomplishment && (
                  <div className="text-[10px] text-stone-300 bg-white/5 p-2 rounded-lg border border-white/5 leading-snug">
                    <span className="text-amber-400 font-semibold font-mono">
                      {language === 'fr' ? 'Haut Fait : ' : language === 'zh' ? '战术战果：' : 'Feat: '}
                    </span>
                    {entry.specialAccomplishment[language]}
                  </div>
                )}

                {/* Score and Tier Badge */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/10 text-stone-300 border border-white/10">
                    {entry.sessionMode === '5_rounds'
                      ? '5 RNDS'
                      : entry.sessionMode === '25_rounds'
                      ? '25 RNDS'
                      : '50 RNDS'}
                  </span>
                  <div className="text-right">
                    <span className="text-stone-400 text-[10px] uppercase block">Points</span>
                    <span className="text-base font-bold text-amber-400 font-mono">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Detailed Leaderboard Table */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold flex items-center space-x-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'fr'
                ? `Tous les Rangs (${entries.length} Fondateurs)`
                : language === 'zh'
                ? `全球战力天梯全览 (${entries.length} 位创始人)`
                : `Global Cap Table Rankings (${entries.length} Founders)`}
            </span>
          </h3>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-[#0e1424] border border-white/10 text-stone-400 space-y-2">
            <Info className="w-8 h-8 mx-auto text-stone-500" />
            <p className="text-xs font-mono">{t.emptyState[language]}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0e1424]/90 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-stone-400 bg-black/30">
                  <th className="py-3 px-3 sm:px-4">{t.tableHeaders.rank[language]}</th>
                  <th className="py-3 px-3 sm:px-4">{t.tableHeaders.founder[language]}</th>
                  <th className="py-3 px-3 sm:px-4 text-center">{t.tableHeaders.tier[language]}</th>
                  <th className="py-3 px-3 sm:px-4 text-right">{t.tableHeaders.voting[language]}</th>
                  <th className="py-3 px-3 sm:px-4 text-right">{t.tableHeaders.equity[language]}</th>
                  <th className="py-3 px-3 sm:px-4 text-right hidden md:table-cell">{t.tableHeaders.saved[language]}</th>
                  <th className="py-3 px-3 sm:px-4 text-right">{t.tableHeaders.score[language]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {entries.map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors hover:bg-white/[0.04] ${
                        entry.isUser
                          ? 'bg-amber-500/10 border-l-4 border-l-amber-400'
                          : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          {entry.rank === 1 ? (
                            <span className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/50 flex items-center justify-center font-bold text-xs">
                              1
                            </span>
                          ) : entry.rank === 2 ? (
                            <span className="w-6 h-6 rounded-md bg-stone-300/20 text-stone-200 border border-stone-300/50 flex items-center justify-center font-bold text-xs">
                              2
                            </span>
                          ) : entry.rank === 3 ? (
                            <span className="w-6 h-6 rounded-md bg-amber-700/20 text-amber-400 border border-amber-700/50 flex items-center justify-center font-bold text-xs">
                              3
                            </span>
                          ) : (
                            <span className="text-stone-400 font-medium pl-1.5">
                              #{entry.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Founder & Syndicate */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-white flex items-center space-x-2">
                            <span>{entry.playerName}</span>
                            {entry.isUser && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-400 text-stone-950 font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400 truncate max-w-xs">
                            {entry.playerTitle[language]} • <span className="text-stone-500">{entry.syndicate}</span>
                          </div>
                        </div>
                      </td>

                      {/* Tier Mode */}
                      <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                            entry.sessionMode === '50_rounds'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : entry.sessionMode === '25_rounds'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {entry.sessionMode === '5_rounds'
                            ? '5 Qs'
                            : entry.sessionMode === '25_rounds'
                            ? '25 Qs'
                            : '50 Qs'}
                        </span>
                      </td>

                      {/* Voting Leverage */}
                      <td className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-amber-300">
                          {entry.votingControlPct.toFixed(1)}%
                        </span>
                      </td>

                      {/* Founder Equity */}
                      <td className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">
                        <span className="text-emerald-300 font-semibold">
                          {entry.founderEquityPct.toFixed(1)}%
                        </span>
                      </td>

                      {/* Saved Valuation */}
                      <td className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap hidden md:table-cell text-stone-300">
                        {formatMoney(entry.valuationSaved)}
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-white font-mono text-sm">
                          {entry.score.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Sovereign Governance Principle Educational Footer */}
      <div className="relative z-10 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t.footerNote[language]}</p>
      </div>
    </div>
  );
};
