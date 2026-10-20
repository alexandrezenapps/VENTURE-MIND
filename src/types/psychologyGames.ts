import { LocalizedString } from './index';

export type PsychologyGameCategory = 'attention' | 'brain' | 'composure';

export interface PsychologyGameMetadata {
  id: string;
  number: number;
  slug: string;
  title: LocalizedString;
  tagline: LocalizedString;
  category: PsychologyGameCategory;
  categoryLabel: LocalizedString;
  iconName: string;
  badge: LocalizedString;
  durationSeconds: number;
  skillsTrained: LocalizedString[];
  scientificPrinciple: LocalizedString;
  instructions: LocalizedString[];
  controlsHint: LocalizedString;
  accentColor: 'amber' | 'emerald' | 'indigo' | 'purple' | 'rose' | 'cyan';
}

export interface GameSessionResult {
  gameId: string;
  score: number;
  accuracy: number; // 0 - 100%
  avgReactionMs: number;
  zenComposureScore: number; // 0 - 100%
  streak: number;
  completedAt: string;
  insights: LocalizedString;
}
