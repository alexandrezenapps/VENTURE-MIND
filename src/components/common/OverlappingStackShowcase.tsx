import React, { useState } from 'react';
import {
  Layers,
  GraduationCap,
  Bookmark,
  BookOpen,
  Award,
  Sparkles,
  Sliders,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DOMAIN_STACKS_DATA } from '../../data/overlappingCardsData';
import { StackDomain, StackCardItem, StackDirection } from '../../types/overlappingStack';
import { OverlappingCardStack } from './OverlappingCardStack';

interface OverlappingStackShowcaseProps {
  initialDomain?: StackDomain;
  onClose?: () => void;
  isModal?: boolean;
}

export const OverlappingStackShowcase: React.FC<OverlappingStackShowcaseProps> = ({
  initialDomain = 'courses',
  onClose,
  isModal = false,
}) => {
  const { language, isAudioMuted, toggleAudioMute, setActiveTab } = useApp();
  const [activeDomain, setActiveDomain] = useState<StackDomain>(initialDomain);
  const [stackDirection, setStackDirection] = useState<StackDirection>('horizontal');
  const [selectedCardForModal, setSelectedCardForModal] = useState<StackCardItem | null>(null);

  const currentDeck = DOMAIN_STACKS_DATA[activeDomain] || DOMAIN_STACKS_DATA.courses;

  const domainTabs: {
    id: StackDomain;
    label: { en: string; fr: string; zh: string };
    icon: React.ElementType;
    badgeCount: number;
    color: string;
  }[] = [
    {
      id: 'courses',
      label: { en: 'Course Categories', fr: 'Catégories de Cours', zh: '课程分类' },
      icon: GraduationCap,
      badgeCount: DOMAIN_STACKS_DATA.courses.cards.length,
      color: 'emerald',
    },
    {
      id: 'bookmarks',
      label: { en: 'Learning Collections', fr: 'Favoris & Collections', zh: '学习收藏' },
      icon: Bookmark,
      badgeCount: DOMAIN_STACKS_DATA.bookmarks.cards.length,
      color: 'amber',
    },
    {
      id: 'vocabulary',
      label: { en: 'Vocabulary Sets', fr: 'Packs de Vocabulaire', zh: '词汇集' },
      icon: BookOpen,
      badgeCount: DOMAIN_STACKS_DATA.vocabulary.cards.length,
      color: 'indigo',
    },
    {
      id: 'profile',
      label: { en: 'Personal Profile', fr: 'Profil & Titres', zh: '个人资料' },
      icon: Award,
      badgeCount: DOMAIN_STACKS_DATA.profile.cards.length,
      color: 'purple',
    },
  ];

  const handleCardAction = (card: StackCardItem) => {
    setSelectedCardForModal(card);
  };

  const content = (
    <div className="space-y-6">
      {/* Top Banner & Control Deck with High-Exposure Chromatic Lighting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#171B30] via-[#202542] to-[#19172E] border border-amber-400/35 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),0_0_30px_rgba(229,184,66,0.12),inset_0_1px_1px_rgba(255,255,255,0.18)] relative overflow-hidden">
        {/* Luminous Ambient Glows */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-gradient-to-br from-amber-400/25 via-rose-500/20 to-purple-600/15 rounded-full blur-[85px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 bg-gradient-to-tr from-purple-600/22 via-indigo-500/20 to-teal-400/18 rounded-full blur-[85px] pointer-events-none" />

        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
              {language === 'fr'
                ? 'Architecture de Cartes Empilées'
                : language === 'zh'
                ? '重叠式卡片系统 · 1/3覆盖'
                : 'Overlapping Card Stack Deck'}
            </span>
            <span className="text-xs text-stone-300 font-mono">
              • {language === 'zh' ? '收起展示前三张与+N' : 'Top 3 + Remainder (+N)'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-100 flex items-center space-x-2">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>
              {language === 'fr'
                ? 'Composant de Cartes Empilées Multi-Domaines'
                : language === 'zh'
                ? '重叠式卡片组件 · 四大应用场景'
                : 'Multi-Domain Overlapping Stacks'}
            </span>
          </h2>

          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            {language === 'fr'
              ? 'Cartes avec recouvrement d’un tiers. Enroulées : 3 premières cartes et badge +N. Déploiement séquentiel avec noms au clic, puis repliement fluide.'
              : language === 'zh'
              ? '卡片相互覆盖约三分之一；收起时显示前三张与 +N 剩余数量；点击后依次展开并显赫呈现名称；再次点击平滑原路收回。支持课程分类、学习收藏、词汇集与个人资料。'
              : 'Cards overlap by ~1/3. Collapsed: top 3 cards + remaining (+N) badge. Click to sequentially unfold and reveal names; click again to smoothly retract.'}
          </p>
        </div>

        {/* Global Controls & Close */}
        <div className="flex items-center space-x-2 relative z-10 self-start md:self-center">
          {/* Sound Toggle */}
          <button
            onClick={toggleAudioMute}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              !isAudioMuted
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.2)]'
                : 'bg-stone-800/80 border-stone-700 text-stone-400'
            }`}
            title={!isAudioMuted ? 'Mute sound effects' : 'Unmute sound effects'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Domain Tabs: 课程分类, 学习收藏, 词汇集, 个人资料 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {domainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDomain === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveDomain(tab.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all text-left flex items-start justify-between cursor-pointer active:scale-95 shadow-md ${
                isActive
                  ? 'bg-gradient-to-br from-amber-500/25 via-[#231E3D] to-[#15192C] border-2 border-amber-400 ring-1 ring-amber-400/50 shadow-[0_12px_28px_-4px_rgba(245,158,11,0.25)]'
                  : 'glass-panel border-sophisticated hover:border-amber-400/40 text-text-secondary dark:text-stone-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isActive
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-surface-muted dark:bg-stone-800 text-text-secondary dark:text-stone-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-text-primary dark:text-stone-100">
                    {tab.label[language]}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-text-secondary dark:text-stone-400 pl-9">
                  {tab.badgeCount} {language === 'zh' ? '张卡片' : 'Cards in Deck'}
                </div>
              </div>

              {isActive && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mt-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Overlapping Card Stack Master Component */}
      <OverlappingCardStack
        key={activeDomain}
        cards={currentDeck.cards}
        title={currentDeck.title}
        subtitle={currentDeck.subtitle}
        domainLabel={currentDeck.title}
        accentColor={currentDeck.accent}
        direction={stackDirection}
        overlapPercent={33} // 约三分之一覆盖
        onCardAction={handleCardAction}
      />

      {/* Single Card Detail Inspector Modal */}
      {selectedCardForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-surface-main dark:bg-stone-900 border border-amber-400/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-main dark:border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  {selectedCardForModal.categoryLabel
                    ? selectedCardForModal.categoryLabel[language]
                    : 'Card Detail'}
                </span>
                {selectedCardForModal.badge && (
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">
                    {selectedCardForModal.badge[language]}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedCardForModal(null)}
                className="p-1.5 rounded-xl bg-surface-muted dark:bg-stone-800 hover:bg-stone-700 text-stone-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold font-heading text-text-primary dark:text-stone-100">
                {selectedCardForModal.title[language]}
              </h3>
              {selectedCardForModal.subtitle && (
                <p className="text-xs text-text-secondary dark:text-stone-400 mt-1">
                  {selectedCardForModal.subtitle[language]}
                </p>
              )}
            </div>

            {selectedCardForModal.description && (
              <div className="p-4 rounded-2xl bg-surface-muted dark:bg-stone-950/50 border border-border-main dark:border-stone-800 text-xs text-text-secondary dark:text-stone-300 leading-relaxed">
                {selectedCardForModal.description[language]}
              </div>
            )}

            {selectedCardForModal.tags && (
              <div className="flex flex-wrap gap-1.5">
                {selectedCardForModal.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {selectedCardForModal.metrics && (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                {selectedCardForModal.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-muted dark:bg-stone-800/60 p-2.5 rounded-xl border border-border-main dark:border-stone-700"
                  >
                    <div className="text-[10px] text-text-secondary dark:text-stone-400">
                      {m.label[language]}
                    </div>
                    <div className="font-bold text-amber-500 text-sm">{m.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-border-main dark:border-stone-800 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedCardForModal(null)}
                className="px-4 py-2 rounded-xl border border-border-main dark:border-stone-700 text-xs text-text-secondary dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {language === 'fr' ? 'Fermer' : language === 'zh' ? '关闭' : 'Close'}
              </button>
              <button
                onClick={() => {
                  setSelectedCardForModal(null);
                  if (activeDomain === 'courses' || activeDomain === 'vocabulary') {
                    setActiveTab('learn');
                  } else if (activeDomain === 'profile') {
                    setActiveTab('profile');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
              >
                <span>
                  {language === 'fr'
                    ? 'Aller au Module'
                    : language === 'zh'
                    ? '前往研习模块'
                    : 'Open Module'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-5xl my-auto">{content}</div>
      </div>
    );
  }

  return content;
};
