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
