import { LeaderboardRecord, LocalizedString, SessionModeKey } from '../types';
import {
  getLeaderboardRecords,
  addLeaderboardRecord,
  getUserPlayerName,
} from '../utils/leaderboardStorage';

export type CapTableTierFilter = 'all' | '5_rounds' | '25_rounds' | '50_rounds';

export interface CapTableLeaderboardEntry {
  id: string;
  gameId: 'game_03';
  sessionMode: '5_rounds' | '25_rounds' | '50_rounds';
  tierCategory: 'junior' | 'mid' | 'senior';
  rank: number;
  playerName: string;
  playerTitle: LocalizedString;
  syndicate: string;
  countryCode: string;
  score: number;
  votingControlPct: number; // e.g. 84.5% voting leverage preserved
  founderEquityPct: number; // e.g. 71.2% founder common equity retained
  valuationSaved: number; // dollar equity protected
  roundsCompleted: number;
  totalRounds: number;
  timestamp: string;
  isUser: boolean;
  tier: 'sovereign' | 'alpha' | 'principal' | 'associate';
  specialAccomplishment?: LocalizedString;
}

// Curated Institutional Mock Peer Records for Game #3: 股权结构防卫战
const MOCK_CAP_TABLE_PEERS: Omit<CapTableLeaderboardEntry, 'rank'>[] = [
  // SENIOR TIER: 50 Rounds - Ultimate Sovereignty War
  {
    id: 'ct_peer_senior_01',
    gameId: 'game_03',
    sessionMode: '50_rounds',
    tierCategory: 'senior',
    playerName: 'Elena Vance (Dual-Class Titan)',
    playerTitle: {
      en: 'Supreme Boardroom Sovereign',
      fr: 'Souveraine Suprême du Conseil',
      zh: '终局决战 · 最高主权理事长',
    },
    syndicate: 'Bessemer Citadel Vanguard',
    countryCode: 'US',
    score: 9680,
    votingControlPct: 88.5,
    founderEquityPct: 74.2,
    valuationSaved: 250000000,
    roundsCompleted: 50,
    totalRounds: 50,
    timestamp: '2026-10-27T18:40:00Z',
    isUser: false,
    tier: 'sovereign',
    specialAccomplishment: {
      en: 'Repelled 3x Participating Ratchet & Preserved 10:1 Dual-Class Super Voting',
      fr: 'Repoussé le ratchet 3x et préservé le super-vote 10:1',
      zh: '击退3倍参与清算附带全棘轮毒丸，捍卫10:1双重股权绝对控制权',
    },
  },
  {
    id: 'ct_peer_senior_02',
    gameId: 'game_03',
    sessionMode: '50_rounds',
    tierCategory: 'senior',
    playerName: 'Marcus Sterling (Benchmark Syndicate)',
    playerTitle: {
      en: 'Cap Table Fortress Grandmaster',
      fr: 'Grand Maître de la Citadelle',
      zh: '股权铁壁防御宗师',
    },
    syndicate: 'Silicon Valley Founders Syndicate',
    countryCode: 'US',
    score: 9340,
    votingControlPct: 85.0,
    founderEquityPct: 71.8,
    valuationSaved: 235000000,
    roundsCompleted: 50,
    totalRounds: 50,
    timestamp: '2026-10-26T21:15:00Z',
    isUser: false,
    tier: 'sovereign',
    specialAccomplishment: {
      en: 'Enacted Post-Money Option Pool Carve-Out to Protect Founders from 15% Pre-Money Dilution',
      fr: 'Négocié le pool post-money pour bloquer 15% de dilution',
      zh: '将15%期权池强制推向投后分摊，阻止对创始人单边洗牌稀释',
    },
  },
  {
    id: 'ct_peer_senior_03',
    gameId: 'game_03',
    sessionMode: '50_rounds',
    tierCategory: 'senior',
    playerName: 'Sarah Lin (Khosla Venture Fellow)',
    playerTitle: {
      en: 'Principal Charter Architect',
      fr: 'Architecte en Chef des Statuts',
      zh: '章程防御首席架构师',
    },
    syndicate: 'San Francisco Tech Core',
    countryCode: 'US',
    score: 8990,
    votingControlPct: 82.4,
    founderEquityPct: 69.5,
    valuationSaved: 220000000,
    roundsCompleted: 50,
    totalRounds: 50,
    timestamp: '2026-10-25T14:30:00Z',
    isUser: false,
    tier: 'alpha',
    specialAccomplishment: {
      en: 'Enforced 2-2-1 Balanced Board Architecture, Preventing Investor Coalition Takeover',
      fr: 'Verrouillé le conseil 2-2-1 évitant le coup d’État',
      zh: '筑牢2-2-1平衡董事会格局，一票否决资方恶意罢免条款',
    },
  },
  {
    id: 'ct_peer_senior_04',
    gameId: 'game_03',
    sessionMode: '50_rounds',
    tierCategory: 'senior',
    playerName: 'Jean-Luc Moreau (Station F Sovereign)',
    playerTitle: {
      en: 'European Governance Commander',
      fr: 'Commandant Européen de la Gouvernance',
      zh: '欧洲风投治理指挥官',
    },
    syndicate: 'Partech Sovereign Alliance',
    countryCode: 'FR',
    score: 8650,
    votingControlPct: 79.8,
    founderEquityPct: 67.0,
    valuationSaved: 205000000,
    roundsCompleted: 50,
    totalRounds: 50,
    timestamp: '2026-10-24T16:50:00Z',
    isUser: false,
    tier: 'alpha',
    specialAccomplishment: {
      en: 'Neutralized Exploding 24-Hour Term Sheet with Competitive Multi-Syndicate Term Bidding',
      fr: 'Contré la term sheet explosive via mise en concurrence',
      zh: '识破24小时爆炸性排他陷阱，引爆多方竞价重掌主导权',
    },
  },
  {
    id: 'ct_peer_senior_05',
    gameId: 'game_03',
    sessionMode: '50_rounds',
    tierCategory: 'senior',
    playerName: 'Kenji Takahashi (Tokyo Tech Empire)',
    playerTitle: {
      en: 'Unshakable Equity Guardian',
      fr: 'Gardien Inébranlable du Capital',
      zh: '不动如山 · 股权主权卫士',
    },
    syndicate: 'SoftBank Vision Alpha',
    countryCode: 'JP',
    score: 8320,
    votingControlPct: 77.5,
    founderEquityPct: 65.4,
    valuationSaved: 195000000,
    roundsCompleted: 50,
    totalRounds: 50,
    timestamp: '2026-10-23T11:20:00Z',
    isUser: false,
    tier: 'principal',
    specialAccomplishment: {
      en: 'Restricted Drag-Along Threshold to 75% Supermajority, Preserving Founder Veto on Fire Sales',
      fr: 'Porté le drag-along à 75%, conservant le veto fondateur',
      zh: '将拖售权门槛锚定在75%超级多数，誓死保留创始人对低价贱卖的一票否决权',
    },
  },

  // MID TIER: 25 Rounds - Boardroom Siege & Defensive Tactics
  {
    id: 'ct_peer_mid_01',
    gameId: 'game_03',
    sessionMode: '25_rounds',
    tierCategory: 'mid',
    playerName: 'Alexander Wright (Founders Fund Fellow)',
    playerTitle: {
      en: 'Boardroom Siege Master',
      fr: 'Maître du Siège au Conseil',
      zh: '中级董事会推演大师',
    },
    syndicate: 'Palantir & FF Founders Network',
    countryCode: 'US',
    score: 4890,
    votingControlPct: 84.0,
    founderEquityPct: 70.5,
    valuationSaved: 87500000,
    roundsCompleted: 25,
    totalRounds: 25,
    timestamp: '2026-10-27T08:15:00Z',
    isUser: false,
    tier: 'sovereign',
    specialAccomplishment: {
      en: 'Eliminated Cumulative Dividend compounding at 12% across 3 Series Preferred rounds',
      fr: 'Supprimé les dividendes cumulatifs de 12%',
      zh: '剔除年化12%复利累积股息，阻断对剩余清算池的隐性吞噬',
    },
  },
  {
    id: 'ct_peer_mid_02',
    gameId: 'game_03',
    sessionMode: '25_rounds',
    tierCategory: 'mid',
    playerName: 'Mei-Ling Zhou (Sequoia China Alum)',
    playerTitle: {
      en: 'Tactical Equity Strategist',
      fr: 'Stratège Tactique du Capital',
      zh: '股权战术防御首席',
    },
    syndicate: 'Hong Kong & Shanghai Tech Circle',
    countryCode: 'SG',
    score: 4620,
    votingControlPct: 81.6,
    founderEquityPct: 68.2,
    valuationSaved: 82500000,
    roundsCompleted: 25,
    totalRounds: 25,
    timestamp: '2026-10-26T14:40:00Z',
    isUser: false,
    tier: 'sovereign',
    specialAccomplishment: {
      en: 'Substituted Broad-Based Weighted Average for Dangerous Narrow-Based Anti-Dilution',
      fr: 'Substitué la moyenne pondérée large à la formule étroite',
      zh: '将狭义反稀释纠正为广义加权平均公式，守住下轮下折保护线',
    },
  },
  {
    id: 'ct_peer_mid_03',
    gameId: 'game_03',
    sessionMode: '25_rounds',
    tierCategory: 'mid',
    playerName: 'Liam O’Connor (Index Partners Chair)',
    playerTitle: {
      en: 'Venture Governance Architect',
      fr: 'Architecte de la Gouvernance VC',
      zh: '公司治理战术行家',
    },
    syndicate: 'London Venture Partners',
    countryCode: 'GB',
    score: 4350,
    votingControlPct: 79.2,
    founderEquityPct: 66.0,
    valuationSaved: 78000000,
    roundsCompleted: 25,
    totalRounds: 25,
    timestamp: '2026-10-25T19:30:00Z',
    isUser: false,
    tier: 'alpha',
    specialAccomplishment: {
      en: 'Restricted Investor Protective Provisions Exclusively to Adverse Charter Modifications',
      fr: 'Limité les droits de veto aux seules modifs statutaires néfastes',
      zh: '限缩资方一票否决权仅限于对公司章程的不利修改，捍卫日常经营决策自由',
    },
  },
  {
    id: 'ct_peer_mid_04',
    gameId: 'game_03',
    sessionMode: '25_rounds',
    tierCategory: 'mid',
    playerName: 'Sofia Rossi (Milan Tech Syndicate)',
    playerTitle: {
      en: 'Cap Table Defense Officer',
      fr: 'Officier de Défense du Capital',
      zh: '股权防卫精锐主理人',
    },
    syndicate: 'Southern European Angel Syndicate',
    countryCode: 'IT',
    score: 4080,
    votingControlPct: 76.8,
    founderEquityPct: 64.2,
    valuationSaved: 73500000,
    roundsCompleted: 25,
    totalRounds: 25,
    timestamp: '2026-10-24T12:10:00Z',
    isUser: false,
    tier: 'principal',
    specialAccomplishment: {
      en: 'Added 1-Year Sunset Clause to Negative Covenants Upon Reaching $20M ARR Milestone',
      fr: 'Ajouté une clause d’extinction sur covenants négatifs à 20M$ ARR',
      zh: '为限制性承诺设立1年日落条款，约定营收达到2000万美元时自动失效',
    },
  },

  // JUNIOR TIER: 5 Rounds - Foundation Defense & Speed Reflexes
  {
    id: 'ct_peer_junior_01',
    gameId: 'game_03',
    sessionMode: '5_rounds',
    tierCategory: 'junior',
    playerName: 'Ryan Chen (YC S24 Sovereign Founder)',
    playerTitle: {
      en: 'Seed Sovereignty Prodigy',
      fr: 'Prodige de la Souveraineté Seed',
      zh: '初级摸底速战冠军 · 新锐创始人',
    },
    syndicate: 'Y Combinator Alumni Ring',
    countryCode: 'US',
    score: 980,
    votingControlPct: 86.0,
    founderEquityPct: 72.0,
    valuationSaved: 12500000,
    roundsCompleted: 5,
    totalRounds: 5,
    timestamp: '2026-10-27T10:00:00Z',
    isUser: false,
    tier: 'sovereign',
    specialAccomplishment: {
      en: 'Flawless 5/5 Rapid Defense on Liquidation Preference and Option Pool Mechanics',
      fr: '5/5 défenses parfaites sur la préférence de liquidation',
      zh: '5连击秒答清算优先权与期权池真实成本，0犹豫守住种子轮主导权',
    },
  },
  {
    id: 'ct_peer_junior_02',
    gameId: 'game_03',
    sessionMode: '5_rounds',
    tierCategory: 'junior',
    playerName: 'Astrid Lindholm (Nordic VC Fellow)',
    playerTitle: {
      en: 'Clean Cap Table Specialist',
      fr: 'Spécialiste de la Table Saine',
      zh: '干净股权结构先锋',
    },
    syndicate: 'Stockholm Angel Collective',
    countryCode: 'SE',
    score: 920,
    votingControlPct: 83.5,
    founderEquityPct: 70.0,
    valuationSaved: 12000000,
    roundsCompleted: 5,
    totalRounds: 5,
    timestamp: '2026-10-26T17:25:00Z',
    isUser: false,
    tier: 'alpha',
    specialAccomplishment: {
      en: 'Rejected Uncapped Convertible Notes in Favor of Clean SAFE with Reasonable Cap',
      fr: 'Rejeté les obligations convertibles non plafonnées pour SAFE propre',
      zh: '果断拒绝无上限可转债，切换为设定理性估值上限的标准SAFE协议',
    },
  },
  {
    id: 'ct_peer_junior_03',
    gameId: 'game_03',
    sessionMode: '5_rounds',
    tierCategory: 'junior',
    playerName: 'Tariq Mansoor (Doha Growth Seed)',
    playerTitle: {
      en: 'Boardroom Foundation Guardian',
      fr: 'Gardien des Fondations au Conseil',
      zh: '初级股权防线先锋',
    },
    syndicate: 'MENA Early Stage Fund',
    countryCode: 'QA',
    score: 870,
    votingControlPct: 80.5,
    founderEquityPct: 67.5,
    valuationSaved: 10500000,
    roundsCompleted: 5,
    totalRounds: 5,
    timestamp: '2026-10-25T11:45:00Z',
    isUser: false,
    tier: 'alpha',
    specialAccomplishment: {
      en: 'Set Standard 4-Year Vesting with 1-Year Cliff, Preventing Co-founder Walkaway Shakedown',
      fr: 'Imposé le vesting 4 ans / 1 an cliff pour protéger le capital',
      zh: '推行标准4年按月成熟+1年悬崖期条款，根除合伙人提前离职带走大量股权隐患',
    },
  },
  {
    id: 'ct_peer_junior_04',
    gameId: 'game_03',
    sessionMode: '5_rounds',
    tierCategory: 'junior',
    playerName: 'Beatriz Silva (São Paulo Tech Core)',
    playerTitle: {
      en: 'Rapid Governance Tactician',
      fr: 'Tacticienne de Gouvernance Éclair',
      zh: '速攻治理锐意新锐',
    },
    syndicate: 'LatAm Venture Syndicate',
    countryCode: 'BR',
    score: 820,
    votingControlPct: 78.0,
    founderEquityPct: 65.0,
    valuationSaved: 10000000,
    roundsCompleted: 5,
    totalRounds: 5,
    timestamp: '2026-10-24T20:15:00Z',
    isUser: false,
    tier: 'principal',
    specialAccomplishment: {
      en: 'Protected Information Rights while Excluding Pre-Seed Competitor Investors',
      fr: 'Protégé les droits d’information en excluant les concurrents',
      zh: '在赋予资方知情权的同时，严格设置竞业排他条款防止商业机密泄露',
    },
  },
];

// Helper to derive tier category from sessionMode
export const mapSessionModeToTier = (mode: string): 'junior' | 'mid' | 'senior' => {
  if (mode === '5_rounds') return 'junior';
  if (mode === '25_rounds') return 'mid';
  return 'senior';
};

// Global event bus for real-time leaderboard updates
type LeaderboardListener = () => void;
const listeners = new Set<LeaderboardListener>();

export const subscribeToCapTableLeaderboard = (listener: LeaderboardListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore
    }
  });
};

/**
 * Fetch Cap Table Global Leaderboard entries.
 * Merges real user session records for Game 3 from localStorage with curated mock institutional peers.
 */
export const getCapTableGlobalLeaderboard = (
  tierFilter: CapTableTierFilter = 'all',
  searchQuery: string = ''
): CapTableLeaderboardEntry[] => {
  // 1. Fetch user records from shared storage
  const rawStorageRecords = getLeaderboardRecords('all');
  const userGame3Records = rawStorageRecords.filter(
    (r) => r.gameId === 'game_03' && (r.isUser || r.playerName.includes('You'))
  );

  // 2. Map user records to CapTableLeaderboardEntry format
  const mappedUserEntries: Omit<CapTableLeaderboardEntry, 'rank'>[] = userGame3Records.map((r) => {
    const tierCat = mapSessionModeToTier(r.sessionMode);
    return {
      id: r.id,
      gameId: 'game_03',
      sessionMode: r.sessionMode as '5_rounds' | '25_rounds' | '50_rounds',
      tierCategory: tierCat,
      playerName: r.playerName || `${getUserPlayerName()} (Founder)`,
      playerTitle: r.playerTitle || {
        en: 'Cap Table Fortress Architect',
        fr: 'Architecte de la Citadelle',
        zh: '股权铁壁防御架构师',
      },
      syndicate: 'Your Autonomous Venture Shield',
      countryCode: 'GLOBAL',
      score: r.score,
      votingControlPct: Math.min(99.9, Math.max(50, r.leverage || 80)),
      founderEquityPct: Math.min(99.9, Math.max(45, r.composure || 72)),
      valuationSaved: r.valuationSaved || r.score * 25000,
      roundsCompleted: r.roundsCompleted || 5,
      totalRounds: r.totalRounds || 5,
      timestamp: r.timestamp,
      isUser: true,
      tier: r.tier || 'sovereign',
      specialAccomplishment: {
        en: 'Defended Voting Power and Cap Table Integrity Under Simulated Boardroom Pressure',
        fr: 'Contrôle souverain et capital préservés sous pression',
        zh: '在模拟董事会极限施压下，守住股权掌控权与生命线',
      },
    };
  });

  // 3. Combine user records with mock institutional peers
  const combined: Omit<CapTableLeaderboardEntry, 'rank'>[] = [
    ...mappedUserEntries,
    ...MOCK_CAP_TABLE_PEERS,
  ];

  // 4. Filter by Tier if selected
  let filtered = combined;
  if (tierFilter !== 'all') {
    filtered = combined.filter((entry) => entry.sessionMode === tierFilter);
  }

  // 5. Filter by Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (entry) =>
        entry.playerName.toLowerCase().includes(q) ||
        entry.syndicate.toLowerCase().includes(q) ||
        entry.playerTitle.en.toLowerCase().includes(q) ||
        entry.playerTitle.zh.toLowerCase().includes(q) ||
        entry.playerTitle.fr.toLowerCase().includes(q)
    );
  }

  // 6. Sort descending: highest score first, then votingControlPct, then founderEquityPct, then recent timestamp
  const sorted = filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.votingControlPct !== a.votingControlPct) return b.votingControlPct - a.votingControlPct;
    if (b.founderEquityPct !== a.founderEquityPct) return b.founderEquityPct - a.founderEquityPct;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // 7. Assign dynamic 1-indexed ranks
  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};

/**
 * Retrieve user's best rank and summary stats in Game #3
 */
export const getUserCapTableSummary = () => {
  const allEntries = getCapTableGlobalLeaderboard('all');
  const userEntries = allEntries.filter((e) => e.isUser);

  if (userEntries.length === 0) {
    return {
      hasPlayed: false,
      bestRank: null,
      bestScore: 0,
      highestVotingPower: 0,
      highestEquitySaved: 0,
      totalGamesPlayed: 0,
      bestTier: null,
      topAccomplishment: null,
    };
  }

  const bestEntry = userEntries[0]; // sorted first
  const highestScore = Math.max(...userEntries.map((e) => e.score));
  const highestVoting = Math.max(...userEntries.map((e) => e.votingControlPct));
  const highestSaved = Math.max(...userEntries.map((e) => e.valuationSaved));

  return {
    hasPlayed: true,
    bestRank: bestEntry.rank,
    bestScore: highestScore,
    highestVotingPower: highestVoting,
    highestEquitySaved: highestSaved,
    totalGamesPlayed: userEntries.length,
    bestTier: bestEntry.tier,
    topAccomplishment: bestEntry.specialAccomplishment,
  };
};

/**
 * Record a new Game 3 score and broadcast real-time update
 */
export const recordCapTableBattleResult = (data: {
  sessionMode: '5_rounds' | '25_rounds' | '50_rounds';
  score: number;
  accuracyPct: number;
  fastAnswerCount: number;
  totalQuestions: number;
  valuationDefended: number;
}): LeaderboardRecord => {
  const modeKey = data.sessionMode;
  const userName = getUserPlayerName();
  const accuracy = data.accuracyPct;

  const playerTitle: LocalizedString = {
    en:
      accuracy >= 90
        ? 'Supreme Boardroom Sovereign (Unshakable Chair)'
        : accuracy >= 70
        ? 'Cap Table Fortress Grandmaster'
        : 'Boardroom Governance Specialist',
    fr:
      accuracy >= 90
        ? 'Président Souverain Inamovible'
        : accuracy >= 70
        ? 'Grand Maître de la Citadelle'
        : 'Spécialiste de la Gouvernance',
    zh:
      accuracy >= 90
        ? '终身掌舵者 · 传奇董事长'
        : accuracy >= 70
        ? '股权铁壁防御架构师'
        : '公司治理新锐学徒',
  };

  const newRecord = addLeaderboardRecord({
    gameId: 'game_03',
    sessionMode: modeKey,
    playerName: userName || 'Autonomous Founder',
    playerTitle,
    score: data.score,
    composure: Math.min(100, Math.round(accuracy)),
    leverage: Math.min(
      99,
      Math.round((data.fastAnswerCount / Math.max(1, data.totalQuestions)) * 40 + 55)
    ),
    valuationSaved: data.valuationDefended,
    roundsCompleted: data.totalQuestions,
    totalRounds: data.totalQuestions,
    isUser: true,
    tier: accuracy >= 90 ? 'sovereign' : accuracy >= 70 ? 'alpha' : 'principal',
  });

  notifyListeners();
  return newRecord;
};
