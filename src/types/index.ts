export type Language = 'fr' | 'en' | 'zh';
export type Currency = 'EUR' | 'USD';

export type Category = 
  | 'all'
  | 'economics'
  | 'control'
  | 'captable'
  | 'funding'
  | 'protections'
  | 'convertibles'
  | 'process'
  | 'governance'
  | 'psychology'
  | 'negotiation'
  | 'valuation';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface LocalizedString {
  en: string;
  fr: string;
  zh: string;
}

export interface Term {
  id: string; // e.g. "term_001" to "term_100"
  numericId: number;
  canonical: string;
  fr: string;
  zh: string;
  category: Category;
  difficulty: Difficulty;
  statutoryStandard?: {
    nvca: string;
    pacte: string;
    china: string;
  };
  shortDef: LocalizedString;
  simpleExplanation: LocalizedString;
  founderView: LocalizedString;
  investorView: LocalizedString;
  fictionalExample: LocalizedString;
  calculationNote?: LocalizedString;
  psychologyConnection: LocalizedString;
  negotiationQuestions: LocalizedString[];
  redFlags: LocalizedString[];
  relatedTermIds: string[];
  masteryScore: number; // 0 to 100
  isSaved?: boolean;
}

export type PsychologyCategory =
  | 'self_control'
  | 'cognitive_biases'
  | 'perception_framing'
  | 'listening_questioning'
  | 'batna_zopa'
  | 'handling_refusals'
  | 'credibility_trust'
  | 'risk_uncertainty'
  | 'fundraising_dynamics'
  | 'alignment_ethics';

export interface PsychologyPrinciple {
  id: string; // e.g. "psy_001"
  number: number;
  name: LocalizedString;
  category: PsychologyCategory;
  definition: LocalizedString;
  fundraisingScenario: LocalizedString;
  constructiveUse: LocalizedString;
  misuseWarning: LocalizedString;
  reflectionPrompt: LocalizedString;
  exercise: LocalizedString;
  masteryScore: number;
}

export interface GameInfo {
  id: string; // e.g. "game_01" to "game_20"
  number: number;
  title: string;
  localizedTitle: LocalizedString;
  objective: LocalizedString;
  difficulty: Difficulty;
  durationMinutes: number;
  skillsTrained: string[];
  bestScore: number;
  maxScore: number;
  status: 'unplayed' | 'in_progress' | 'mastered';
  category: 'finance' | 'captable' | 'governance' | 'negotiation' | 'psychology';
}

export interface QuizQuestion {
  id: string; // e.g. "q_001"
  number: number;
  termId?: string;
  category: Category;
  difficulty: Difficulty;
  question: LocalizedString;
  options: LocalizedString[];
  correctIndex: number;
  explanation: LocalizedString;
  statutoryReference?: string;
  psychologyLink?: string;
  pedagogicalCase?: string;
}

export interface Badge {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  nextStep: LocalizedString;
}

export interface UserProgress {
  ventureIQ: number;
  level: number;
  levelName: LocalizedString;
  currentXP: number;
  targetXP: number;
  streakDays: number;
  completedLessons: string[];
  savedTermIds: string[];
  gameScores: Record<string, number>;
  quizScores: Record<string, { score: number; total: number; date: string }>;
  radarCompetencies: {
    knowledge: number;
    finance: number;
    capTable: number;
    psychology: number;
    negotiation: number;
    speed: number;
    risk: number;
    decisionQuality: number;
  };
}

export type PsychologyGameDomain = 'attention' | 'brain' | 'resilience';

export interface PsychologyGameMeta {
  id: string;
  number: number;
  title: LocalizedString;
  subtitle: LocalizedString;
  domain: PsychologyGameDomain;
  difficulty: Difficulty;
  scientificOrigin: LocalizedString;
  targetBrainArea: LocalizedString;
  cognitiveBenefit: LocalizedString;
  instructions: LocalizedString;
  bestScoreKey: string;
  iconName: string;
}

export type SessionModeKey = 'all' | '5_rounds' | '10_rounds' | '20_rounds' | '25_rounds' | '50_rounds' | 'speed' | 'detective';

export interface LeaderboardRecord {
  id: string;
  gameId: string;
  sessionMode: Exclude<SessionModeKey, 'all'>;
  playerName: string;
  playerTitle: LocalizedString;
  score: number;
  composure: number;
  leverage: number;
  valuationSaved: number;
  roundsCompleted: number;
  totalRounds: number;
  timestamp: string;
  isUser: boolean;
  tier: 'sovereign' | 'alpha' | 'principal' | 'associate';
}

export type { InvestorPersona, NegotiationStyle } from '../data/investorPersonasData';

