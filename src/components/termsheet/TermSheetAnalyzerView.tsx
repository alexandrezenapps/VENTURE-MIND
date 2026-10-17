import React, { useState } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  FileCheck,
  Scale,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuditItem {
  clause: string;
  category: 'Economics' | 'Control' | 'Process';
  severity: 'danger' | 'warning' | 'clean';
  issue: string;
  remedy: string;
  marketStandard: string;
}

export const TermSheetAnalyzerView: React.FC = () => {
  const { language } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<'aggressive' | 'clean'>('aggressive');
  const [customText, setCustomText] = useState('');

  const aggressiveFindings: AuditItem[] = [
    {
      clause: 'Liquidation Preference: 2.0x Participating Preferred Stock without cap.',
      category: 'Economics',
      severity: 'danger',
      issue: 'Extractive double-dipping preference that takes 2x capital back before sharing pro-rata in remaining proceeds.',
      remedy: 'Push back to standard "1.0x Non-Participating Preferred". In an acquisition, investor must choose preference OR common share.',
      marketStandard: '92% of US Series A deals in NVCA index use 1.0x Non-Participating.',
    },
    {
      clause: 'Anti-Dilution: Adjusted pursuant to a Full Ratchet mechanism.',
      category: 'Economics',
      severity: 'danger',
      issue: 'Full Ratchet reprices all prior shares to the down-round price, ignoring capital volume and obliterating founder equity.',
      remedy: 'Replace immediately with "Broad-Based Weighted Average" anti-dilution formula.',
      marketStandard: 'Over 96% of institutional venture deals employ Broad-Based Weighted Average.',
    },
    {
      clause: 'Board Composition: Two (2) Preferred directors, One (1) Common founder.',
      category: 'Control',
      severity: 'warning',
      issue: 'Transfers immediate voting majority of the fiduciary board to preferred investors at Series A.',
      remedy: 'Counter with a 2-2-1 board: 2 Founders, 2 Investors, and 1 independent director mutually agreed upon.',
      marketStandard: 'Balanced 2-2-1 or Founder-majority (2-1) is typical for Series A.',
    },
    {
      clause: 'Exclusivity: 90-day strict no-shop lockup with $200,000 break fee.',
      category: 'Process',
      severity: 'warning',
      issue: 'Excessively long 90-day exclusivity freezes founder leverage and creates risk if the VC walks away near the deadline.',
      remedy: 'Cap exclusivity at 30 days, conditional upon weekly written confirmation that due diligence milestones are being met.',
      marketStandard: 'Market standard is 30 to 45 calendar days.',
    },
  ];

  const cleanFindings: AuditItem[] = [
    {
      clause: 'Liquidation Preference: 1.0x Non-Participating Preferred.',
      category: 'Economics',
      severity: 'clean',
      issue: 'Clean, founder-aligned payout mechanism.',
      remedy: 'Accept. This aligns investor and founder upside for significant exit outcomes.',
      marketStandard: 'Standard NVCA model term sheet.',
    },
    {
      clause: 'Anti-Dilution: Broad-Based Weighted Average.',
      category: 'Economics',
      severity: 'clean',
      issue: 'Standard mathematical dilution protection weighted by round volume.',
      remedy: 'Accept.',
      marketStandard: 'NVCA gold standard.',
    },
    {
      clause: 'Board Composition: Two (2) Founders, One (1) Preferred, One (1) Independent.',
      category: 'Control',
      severity: 'clean',
      issue: 'Protects founder operational agency while providing balanced governance.',
      remedy: 'Accept.',
      marketStandard: 'Market standard for Series A.',
    },
  ];

  const findings = selectedPreset === 'aggressive' ? aggressiveFindings : cleanFindings;

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-mobile-nav">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <FileSpreadsheet className="w-4 h-4" />
          <span>
            {language === 'fr'
              ? 'Audit Juridique & Détection des Pièges'
              : language === 'zh'
              ? '意向书雷达排查与毒丸化解'
              : 'Educational Term Sheet Auditor'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-text-primary dark:text-stone-100 mt-1">
          {language === 'fr'
            ? 'Analyseur Éducatif de Term Sheet'
            : language === 'zh'
            ? '投资意向书智能排雷工作台'
            : 'Term Sheet Clause Risk Analyzer'}
        </h1>
        <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 max-w-2xl">
          {language === 'fr'
            ? 'Chargez des modèles types ou inspectez des clauses réelles pour auditer immédiatement la dangerosité des conditions économiques et de gouvernance.'
            : language === 'zh'
            ? '载入标杆案例或粘贴条款草案，系统化识别清算优先权陷阱、完全棘轮、控制权旁落及排他期封锁。'
            : 'Audit liquidation mechanics, board vetoes, anti-dilution traps, and lockups against market NVCA standards.'}
        </p>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center space-x-3 text-xs font-mono">
        <button
          onClick={() => setSelectedPreset('aggressive')}
          className={`px-4 py-2 rounded-xl border transition-all ${
            selectedPreset === 'aggressive'
              ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400 font-bold'
              : 'bg-surface-main dark:bg-stone-900 border-border-main dark:border-stone-800 text-text-secondary hover:text-text-primary'
          }`}
        >
          ⚠️ Predator Down-Market Term Sheet (4 Red Flags)
        </button>
        <button
          onClick={() => setSelectedPreset('clean')}
          className={`px-4 py-2 rounded-xl border transition-all ${
            selectedPreset === 'clean'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'bg-surface-main dark:bg-stone-900 border-border-main dark:border-stone-800 text-text-secondary hover:text-text-primary'
          }`}
        >
          ✅ NVCA Gold Standard Series A (Clean)
        </button>
      </div>

      {/* Audit Findings Table / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-text-secondary dark:text-stone-400">
          <span>
            {findings.length} clauses analyzed • Benchmarked against NVCA Series A Index
          </span>
          <span className="text-[11px] text-amber-600">
            {selectedPreset === 'aggressive' ? 'High Risk Exposure' : 'Low Risk / Standard'}
          </span>
        </div>

        <div className="space-y-4">
          {findings.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border transition-all shadow-xs space-y-3 ${
                item.severity === 'danger'
                  ? 'border-rose-500/50 bg-rose-500/5 dark:bg-rose-950/20'
                  : item.severity === 'warning'
                  ? 'border-amber-500/50 bg-amber-500/5 dark:bg-amber-950/20'
                  : 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
              }`}
            >
              {/* Clause Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-main dark:border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                      item.severity === 'danger'
                        ? 'bg-rose-600 text-white'
                        : item.severity === 'warning'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {item.severity.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-text-secondary dark:text-stone-400 uppercase">
                    {item.category}
                  </span>
                </div>
                <span className="text-xs text-text-secondary dark:text-stone-400 font-mono">
                  {item.marketStandard}
                </span>
              </div>

              {/* Clause Raw Text */}
              <div className="font-mono text-xs font-semibold text-text-primary dark:text-stone-100 bg-surface-muted dark:bg-stone-800/80 p-3 rounded-xl border border-border-main dark:border-stone-700">
                "{item.clause}"
              </div>

              {/* Risk Analysis & Founder Counter Remedy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">
                    Risk to Founders & Common Stock:
                  </span>
                  <p className="text-text-secondary dark:text-stone-300 leading-relaxed">
                    {item.issue}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                    Recommended Counter-Language:
                  </span>
                  <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                    {item.remedy}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
