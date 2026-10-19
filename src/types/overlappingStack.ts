import { LocalizedString } from './index';

export type StackDomain = 'courses' | 'bookmarks' | 'vocabulary' | 'profile';

export type StackDirection = 'horizontal' | 'vertical';

export interface StackCardItem {
  id: string;
  title: LocalizedString; // 名称
  subtitle?: LocalizedString;
  categoryLabel?: LocalizedString;
  badge?: LocalizedString;
  description?: LocalizedString;
  tags?: string[];
  metrics?: { label: LocalizedString; value: string }[];
  progress?: number; // 0 to 100
  accentColor: 'amber' | 'emerald' | 'indigo' | 'rose' | 'cyan' | 'purple';
  iconName?: string;
  imageUrl?: string;
  unlocked?: boolean;
  actionText?: LocalizedString;
  actionLinkTab?: string;
}

export interface DomainDeckConfig {
  id: StackDomain;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  iconName: string;
  accent: 'amber' | 'emerald' | 'indigo' | 'purple';
  cards: StackCardItem[];
}
