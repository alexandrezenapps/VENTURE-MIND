import React from 'react';
import { ShieldCheck, CheckCircle2, RotateCcw, Sparkles, Check, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface ChecklistItem {
  id: string;
  title: { en: string; fr: string; zh: string };
  desc?: { en: string; fr: string; zh: string };
  category?: { en: string; fr: string; zh: string };
}

export interface ProgressChecklistCardProps {
  badgeText: { en: string; fr: string; zh: string };
  title: { en: string; fr: string; zh: string };
  subtitle?: { en: string; fr: string; zh: string };
  items: ChecklistItem[];
  checkedMap: Record<string, boolean>;
  onToggle: (id: string) => void;
  onReset?: () => void;
  accent?: 'emerald' | 'purple' | 'amber';
}

export const ProgressChecklistCard: React.FC<ProgressChecklistCardProps> = ({
  badgeText,
  title,
  subtitle,
  items,
  checkedMap,
  onToggle,
  onReset,
  accent = 'emerald',
}) => {
  const { language } = useApp();

  const total = items.length;
  const checkedCount = items.filter((item) => checkedMap[item.id]).length;
  const progressPercent = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
  const isComplete = progressPercent === 100;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-700 ease-out isolate ${
        isComplete
          ? 'bg-surface-main/95 dark:bg-[#141829]/95 border-emerald-500/60 dark:border-amber-400/60 shadow-[0_20px_50px_-10px_rgba(16,185,129,0.22),0_0_36px_rgba(245,158,11,0.2)] brightness-[1.07] ring-1 ring-amber-400/40'
          : 'bg-surface-main/80 dark:bg-stone-900/80 border-border-main dark:border-stone-800 shadow-xl brightness-100'
      }`}
      style={{
        transition:
          'filter 650ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 650ms cubic-bezier(0.16, 1, 0.3, 1), border-color 650ms cubic-bezier(0.16, 1, 0.3, 1), background-color 650ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* ========================================================
          1. COMPONENT BACKGROUND PROGRESS FILL TRACK
          用组件背景的填充宽度表示完成进度，勾选一项时平滑前推
          ======================================================== */}
      <div
        className={`absolute inset-y-0 left-0 pointer-events-none -z-10 ${
          isComplete
            ? 'bg-gradient-to-r from-emerald-500/25 via-teal-500/30 to-amber-500/25'
            : accent === 'purple'
            ? 'bg-gradient-to-r from-purple-500/18 via-indigo-500/18 to-emerald-500/18'
            : 'bg-gradient-to-r from-emerald-500/18 via-teal-500/18 to-amber-500/18'
        }`}
        style={{
          width: `${progressPercent}%`,
          transition: 'width 650ms cubic-bezier(0.34, 1.25, 0.64, 1)',
        }}
      >
        {/* Leading Edge Shimmer / Glow Light Bar */}
        {progressPercent > 0 && progressPercent < 100 && (
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-transparent via-amber-400 to-transparent shadow-[0_0_14px_rgba(245,158,11,0.9)]" />
        )}
        {/* Full-width completion subtle ambient breath */}
        {isComplete && (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-emerald-400/15 to-transparent pointer-events-none animate-pulse" />
        )}
      </div>

      {/* ========================================================
          2. HEADER REGION: TITLE, PROGRESS INDICATOR & RESET
          ======================================================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-main/70 dark:border-stone-800">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{badgeText[language]}</span>
          </div>
          <h3 className="fluid-heading-2 font-bold text-text-primary dark:text-stone-100">
            {title[language]}
          </h3>
          {subtitle && (
            <p className="text-xs text-text-secondary dark:text-stone-400 leading-relaxed">
              {subtitle[language]}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          {onReset && (
            <button
              onClick={onReset}
              className="p-2 rounded-xl text-text-secondary dark:text-stone-400 hover:text-amber-500 hover:bg-surface-muted dark:hover:bg-stone-800/60 transition-colors cursor-pointer text-xs flex items-center space-x-1"
              title="Reset checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-mono">
                {language === 'fr' ? 'Réinitialiser' : language === 'zh' ? '重置' : 'Reset'}
              </span>
            </button>
          )}

          {/* Progress Indicator Card */}
          <div
            className={`px-4 py-2 rounded-2xl border transition-all duration-500 text-right ${
              isComplete
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md ring-1 ring-emerald-400/40'
                : 'bg-surface-muted/80 dark:bg-stone-800/80 border-border-main/80 dark:border-stone-700/80 text-text-primary dark:text-stone-100'
            }`}
          >
            <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono uppercase tracking-wider text-text-secondary dark:text-stone-400">
              {isComplete && <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />}
              <span>
                {isComplete
                  ? language === 'fr'
                    ? 'Complet'
                    : language === 'zh'
                    ? '已达标'
                    : 'Mastered'
                  : language === 'fr'
                  ? 'Progression'
                  : language === 'zh'
                  ? '完成度'
                  : 'Progress'}
              </span>
            </div>
            <div className="text-xl font-mono font-extrabold flex items-baseline justify-end gap-1">
              <span
                className={`transition-colors duration-300 ${
                  isComplete
                    ? 'text-emerald-500 dark:text-emerald-300'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {progressPercent}%
              </span>
              <span className="text-[11px] font-normal text-text-secondary dark:text-stone-400">
                ({checkedCount}/{total})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. CHECKLIST ITEMS GRID
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
        {items.map((item) => {
          const isChecked = !!checkedMap[item.id];
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`p-4 rounded-2xl border text-left flex items-start space-x-3.5 transition-all duration-300 cursor-pointer group active:scale-[0.99] ${
                isChecked
                  ? 'bg-emerald-500/15 dark:bg-emerald-950/35 border-emerald-500/50 text-text-primary dark:text-stone-100 shadow-sm'
                  : 'bg-surface-main/60 dark:bg-stone-800/40 border-border-main/70 dark:border-stone-800 text-text-secondary dark:text-stone-400 hover:border-amber-400/40 hover:bg-surface-muted/60 dark:hover:bg-stone-800/70'
              }`}
            >
              {/* Checkbox Icon */}
              <div
                className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                  isChecked
                    ? 'bg-emerald-600 border-emerald-500 text-white scale-105 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'border-stone-400 dark:border-stone-600 group-hover:border-amber-400'
                }`}
              >
                <Check
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    isChecked ? 'scale-100 opacity-100 stroke-[3]' : 'scale-50 opacity-0'
                  }`}
                />
              </div>

              {/* Text Information */}
              <div className="flex-1 space-y-1">
                {item.category && (
                  <span
                    className={`inline-block text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md transition-colors ${
                      isChecked
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'bg-stone-200/70 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {item.category[language]}
                  </span>
                )}
                <p
                  className={`text-xs sm:text-sm font-medium leading-relaxed transition-colors ${
                    isChecked
                      ? 'text-text-primary dark:text-stone-100 font-semibold'
                      : 'text-text-secondary dark:text-stone-300'
                  }`}
                >
                  {item.title[language]}
                </p>
                {item.desc && (
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                    {item.desc[language]}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          4. COMPLETION CELEBRATION FOOTER
          ======================================================== */}
      {isComplete && (
        <div className="mt-4 pt-3.5 border-t border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-300 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold">
              {language === 'fr'
                ? 'Protocole Intégral Validé · Position de Négociation Maximale'
                : language === 'zh'
                ? '全部自查项通关 · 处于极致定力与治理安全最优态 (+100 XP)'
                : 'All Checks Grounded · Maximum Negotiation Leverage (+100 XP)'}
            </span>
          </div>
          <span className="text-[11px] text-amber-500 dark:text-amber-400 font-semibold">
            {language === 'fr' ? 'Composant Illuminé' : language === 'zh' ? '组件全幅充盈提亮' : 'Sovereignty Achieved'}
          </span>
        </div>
      )}
    </div>
  );
};
