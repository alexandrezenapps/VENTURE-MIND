import { LeaderboardRecord, SessionModeKey } from '../types';

const LEADERBOARD_STORAGE_KEY = 'vm_venture_leaderboard_records_v1';
const PLAYER_NAME_STORAGE_KEY = 'vm_venture_player_name';

// Default initial high scores from top peer venture players to spark immediate competitiveness
const INITIAL_PEER_RECORDS: LeaderboardRecord[] = [
  {
    id: 'rec_peer_01',
    gameId: 'game_01',
    sessionMode: '20_rounds',
    playerName: 'Sarah L. (Sequoia Fellow)',
    playerTitle: { en: 'Managing Director', fr: 'Associée Directrice', zh: '管理合伙人' },
    score: 100,
    composure: 98,
    leverage: 95,
    valuationSaved: 19500000,
    roundsCompleted: 20,
    totalRounds: 20,
    timestamp: '2026-10-24T14:32:00Z',
    isUser: false,
    tier: 'sovereign',
  },
  {
    id: 'rec_peer_02',
    gameId: 'game_01',
    sessionMode: '10_rounds',
    playerName: 'Elena R. (Index Partners)',
    playerTitle: { en: 'Principal Architect', fr: 'Architecte Principale', zh: '资深主理人' },
    score: 98,
    composure: 95,
    leverage: 92,
    valuationSaved: 18200000,
    roundsCompleted: 10,
    totalRounds: 10,
    timestamp: '2026-10-25T09:15:00Z',
    isUser: false,
    tier: 'alpha',
  },
  {
    id: 'rec_peer_03',
    gameId: 'game_01',
    sessionMode: '5_rounds',
    playerName: 'Marc A. (Benchmark Syndicate)',
    playerTitle: { en: 'Founding Partner', fr: 'Associé Fondateur', zh: '创始合伙人' },
    score: 96,
    composure: 92,
    leverage: 90,
    valuationSaved: 17000000,
    roundsCompleted: 5,
    totalRounds: 5,
    timestamp: '2026-10-25T18:40:00Z',
    isUser: false,
    tier: 'alpha',
  },
  {
    id: 'rec_peer_04',
    gameId: 'game_01',
    sessionMode: '20_rounds',
    playerName: 'Kenji T. (SoftBank Vision)',
    playerTitle: { en: 'Investment Director', fr: 'Directeur d’Investissement', zh: '投资总监' },
    score: 94,
    composure: 90,
    leverage: 88,
    valuationSaved: 16500000,
    roundsCompleted: 20,
    totalRounds: 20,
    timestamp: '2026-10-23T11:20:00Z',
    isUser: false,
    tier: 'principal',
  },
  {
    id: 'rec_peer_05',
    gameId: 'game_01',
    sessionMode: '10_rounds',
    playerName: 'David K. (Khosla Ventures)',
    playerTitle: { en: 'Deal Lead', fr: 'Directeur de Tour', zh: '项目领投人' },
    score: 92,
    composure: 88,
    leverage: 86,
    valuationSaved: 15800000,
    roundsCompleted: 10,
    totalRounds: 10,
    timestamp: '2026-10-22T16:05:00Z',
    isUser: false,
    tier: 'principal',
  },
  {
    id: 'rec_peer_06',
    gameId: 'game_01',
    sessionMode: '5_rounds',
    playerName: 'Claire V. (Partech Growth)',
    playerTitle: { en: 'Senior Associate', fr: 'Associée Senior', zh: '高级投资经理' },
    score: 88,
    composure: 84,
    leverage: 82,
    valuationSaved: 14500000,
    roundsCompleted: 5,
    totalRounds: 5,
    timestamp: '2026-10-21T13:45:00Z',
    isUser: false,
    tier: 'associate',
  },
  {
    id: 'rec_peer_07',
    gameId: 'game_02',
    sessionMode: '10_rounds',
    playerName: 'Alexandre Z. (Founders Fund Quant)',
    playerTitle: { en: 'Valuation Maestro', fr: 'Maître de la Valorisation', zh: '估值心算大师' },
    score: 1250,
    composure: 99,
    leverage: 96,
    valuationSaved: 25000000,
    roundsCompleted: 10,
    totalRounds: 10,
    timestamp: '2026-10-25T20:10:00Z',
    isUser: false,
    tier: 'sovereign',
  },
  {
    id: 'rec_peer_08',
    gameId: 'game_02',
    sessionMode: '5_rounds',
    playerName: 'Sophie B. (Benchmark Math Fellow)',
    playerTitle: { en: 'Senior Quant', fr: 'Quant Senior', zh: '初级心算锐星' },
    score: 680,
    composure: 95,
    leverage: 92,
    valuationSaved: 12500000,
    roundsCompleted: 5,
    totalRounds: 5,
    timestamp: '2026-10-25T14:22:00Z',
    isUser: false,
    tier: 'alpha',
  },
  {
    id: 'rec_peer_09',
    gameId: 'game_02',
    sessionMode: '25_rounds',
    playerName: 'Vikram P. (Bessemer Quant Lead)',
    playerTitle: { en: 'Mid-Tier Valuation Architect', fr: 'Architecte Intermédiaire', zh: '中级董事会推演大师' },
    score: 3450,
    composure: 96,
    leverage: 94,
    valuationSaved: 62500000,
    roundsCompleted: 25,
    totalRounds: 25,
    timestamp: '2026-10-26T11:15:00Z',
    isUser: false,
    tier: 'sovereign',
  },
  {
    id: 'rec_peer_10',
    gameId: 'game_02',
    sessionMode: '50_rounds',
    playerName: 'Catherine D. (Tiger Global Partner)',
    playerTitle: { en: 'Grandmaster Quant Titan', fr: 'Titan Quant Suprême', zh: '高级巅峰50连击神算' },
    score: 7890,
    composure: 99,
    leverage: 98,
    valuationSaved: 125000000,
    roundsCompleted: 50,
    totalRounds: 50,
    timestamp: '2026-10-26T18:45:00Z',
    isUser: false,
    tier: 'sovereign',
  },
];


const safeGetStorage = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // Ignore storage errors in strict/sandbox environments
  }
  return null;
};

const safeSetStorage = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Ignore
  }
};

export const getUserPlayerName = (): string => {
  const saved = safeGetStorage(PLAYER_NAME_STORAGE_KEY);
  return saved?.trim() || 'You (Principal)';
};

export const setUserPlayerName = (name: string): void => {
  if (name.trim()) {
    safeSetStorage(PLAYER_NAME_STORAGE_KEY, name.trim());
  }
};

export const getLeaderboardRecords = (sessionMode: SessionModeKey = 'all'): LeaderboardRecord[] => {
  let records: LeaderboardRecord[] = [];
  const raw = safeGetStorage(LEADERBOARD_STORAGE_KEY);

  if (raw) {
    try {
      records = JSON.parse(raw);
    } catch {
      records = INITIAL_PEER_RECORDS;
    }
  } else {
    records = INITIAL_PEER_RECORDS;
    safeSetStorage(LEADERBOARD_STORAGE_KEY, JSON.stringify(INITIAL_PEER_RECORDS));
  }

  // Filter by session mode if not 'all'
  let filtered = records;
  if (sessionMode !== 'all') {
    filtered = records.filter((r) => r.sessionMode === sessionMode);
  }

  // Sort descending: highest score first, then composure, then leverage, then recent date
  return filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.composure !== a.composure) return b.composure - a.composure;
    if (b.leverage !== a.leverage) return b.leverage - a.leverage;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

export const addLeaderboardRecord = (
  record: Omit<LeaderboardRecord, 'id' | 'timestamp'>
): LeaderboardRecord => {
  const existing = getLeaderboardRecords('all');
  const newEntry: LeaderboardRecord = {
    ...record,
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  const updated = [newEntry, ...existing];
  safeSetStorage(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
};

export const getUserBestScore = (sessionMode: SessionModeKey = 'all'): LeaderboardRecord | null => {
  const userRecords = getLeaderboardRecords(sessionMode).filter((r) => r.isUser);
  return userRecords.length > 0 ? userRecords[0] : null;
};

export const resetLeaderboardToDefaults = (): void => {
  safeSetStorage(LEADERBOARD_STORAGE_KEY, JSON.stringify(INITIAL_PEER_RECORDS));
};
