export type RoundType = 'founding' | 'safe' | 'convertible_note' | 'priced_equity' | 'option_pool_grant';

export type StakeholderCategory =
  | 'founders'
  | 'employees'
  | 'angels'
  | 'seed_vc'
  | 'series_a_vc'
  | 'series_b_vc'
  | 'option_pool';

export interface FundingRound {
  id: string;
  name: string;
  type: RoundType;
  date: string;
  preMoneyValuation: number; // In dollars
  investmentAmount: number; // New cash invested
  sharePrice?: number;
  valuationCap?: number; // For SAFEs / Convertible Notes
  discountPercent?: number; // e.g. 20%
  interestRate?: number; // e.g. 6% annual for Convertible Note
  holdingMonths?: number; // Months before conversion for accrued interest
  optionPoolPercent?: number; // e.g. 10% target pool
  poolTiming?: 'pre_money' | 'post_money'; // Option Pool Shuffle vs Post-Money
  leadInvestor?: string;
  investorGroup?: StakeholderCategory;
  sharesIssued?: number;
  note?: string;
}

export interface StakeholderEntry {
  id: string;
  name: string;
  category: StakeholderCategory;
  initialShares: number;
  color: string;
}

export interface StakeholderRoundSnapshot {
  id: string;
  name: string;
  category: StakeholderCategory;
  shares: number;
  ownershipPercent: number;
  investedCapital: number;
  currentValue: number;
  dilutionFromLastRound: number; // e.g. -4.5%
  color: string;
}

export interface RoundSimulationResult {
  roundId: string;
  roundName: string;
  roundType: RoundType;
  effectivePreMoney: number;
  newCapital: number;
  postMoneyValuation: number;
  effectiveSharePrice: number;
  totalShares: number;
  newSharesIssued: number;
  stakeholders: StakeholderRoundSnapshot[];
  optionPoolShares: number;
  optionPoolPercent: number;
}

export interface WhatIfScenarioConfig {
  founderVestingPercent: number; // 25 (1-yr cliff), 50, 75, 100 (fully vested)
  earlyEmployeeOptionsExercisedPercent: number; // 0, 25, 50, 100
  coFounderDepartsUnvestedClawback: boolean; // if true, cofounder departed at month 12 with 50% shares repurchased
  optionPoolTiming: 'pre_money' | 'post_money'; // pre-money shuffle vs fair post-money
  isAntiDilutionTriggered: boolean; // down-round broad-based weighted average vs full ratchet
  exitValuation: number; // e.g. 20000000
  liquidationMultiple: 1 | 2; // 1x vs 2x
  isParticipating: boolean; // true = participating preferred
}

export interface WhatIfComparison {
  baseFounderPct: number;
  whatIfFounderPct: number;
  deltaFounderPct: number;
  baseFounderValue: number;
  whatIfFounderValue: number;
  deltaFounderValue: number;
  vestedFounderShares: number;
  unvestedFounderShares: number;
  activeEmployeeOptionsShares: number;
  unallocatedPoolShares: number;
  investorPreferredShares: number;
  totalDilutedShares: number;
  founderVotingControlStatus: 'majority' | 'effective_veto' | 'minority';
  exitProceedsFounders: number;
  exitProceedsInvestors: number;
}
