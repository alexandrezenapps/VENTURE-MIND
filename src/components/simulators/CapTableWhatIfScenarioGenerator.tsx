import React, { useState, useMemo } from 'react';
import {
  Sliders,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ShieldAlert,
  Users,
  Award,
  Sparkles,
  Info,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  PieChart,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  RoundSimulationResult,
  WhatIfScenarioConfig,
  WhatIfComparison,
} from '../../types/capTable';

interface CapTableWhatIfProps {
  currentRoundResult: RoundSimulationResult;
  onApplyScenario?: (customPoolTiming: 'pre_money' | 'post_money') => void;
}

export const CapTableWhatIfScenarioGenerator: React.FC<CapTableWhatIfProps> = ({
  currentRoundResult,
  onApplyScenario,
}) => {
  const { language, formatMoney } = useApp();

  // Default What-If scenario triggers
  const [scenarioConfig, setScenarioConfig] = useState<WhatIfScenarioConfig>({
    founderVestingPercent: 100, // 100% default
    earlyEmployeeOptionsExercisedPercent: 0, // 0% default
    coFounderDepartsUnvestedClawback: false, // default no departure
    optionPoolTiming: 'pre_money',
    isAntiDilutionTriggered: false,
    exitValuation: Math.max(10000000, currentRoundResult.postMoneyValuation),
    liquidationMultiple: 1,
    isParticipating: false,
  });

  // Calculate What-If scenario outcome dynamically
  const comparison: WhatIfComparison = useMemo(() => {
    // 1. Identify baseline stakeholders
    const founderEntry = currentRoundResult.stakeholders.find((s) => s.category === 'founders');
    const poolEntry = currentRoundResult.stakeholders.find((s) => s.category === 'option_pool');
    const investorEntries = currentRoundResult.stakeholders.filter(
      (s) => s.category !== 'founders' && s.category !== 'option_pool'
    );

    const baseFounderShares = founderEntry ? founderEntry.shares : 8000000;
    const baseFounderPct = founderEntry ? founderEntry.ownershipPercent : 60;
    const baseFounderVal = founderEntry ? founderEntry.currentValue : 12000000;

    const basePoolShares = poolEntry ? poolEntry.shares : 1000000;
    const baseInvestorShares = investorEntries.reduce((sum, s) => sum + s.shares, 0);
    const baseInvestorCapital = investorEntries.reduce((sum, s) => sum + s.investedCapital, 0);

    // Trigger A: Co-founder early departure clawback
    // If co-founder departs unvested, 50% of the founding shares are repurchased by the company at par value
    let adjustedFounderTotalShares = baseFounderShares;
    let clawedBackShares = 0;
    if (scenarioConfig.coFounderDepartsUnvestedClawback) {
      // Half the founder shares represent departing co-founder's unvested portion (e.g. 50% subject to 4-year schedule)
      const unvestedFraction = Math.max(0, (100 - scenarioConfig.founderVestingPercent) / 100);
      clawedBackShares = Math.round(baseFounderShares * 0.5 * (unvestedFraction || 0.5));
      adjustedFounderTotalShares -= clawedBackShares;
    }

    // Trigger B: Founder Vesting Split (Vested vs Unvested)
    const vestedFounderShares = Math.round(
      adjustedFounderTotalShares * (scenarioConfig.founderVestingPercent / 100)
    );
    const unvestedFounderShares = adjustedFounderTotalShares - vestedFounderShares;

    // Trigger C: Early Employee Options Exercise
    // Options exercised move from unallocated pool to active employee common stock
    const activeEmployeeOptionsShares = Math.round(
      basePoolShares * (scenarioConfig.earlyEmployeeOptionsExercisedPercent / 100)
    );
    const unallocatedPoolShares = basePoolShares - activeEmployeeOptionsShares;

    // Total adjusted share count
    const totalDilutedShares =
      adjustedFounderTotalShares +
      activeEmployeeOptionsShares +
      unallocatedPoolShares +
      baseInvestorShares;

    // What-If ownership percentage for founders
    const whatIfFounderPct = totalDilutedShares > 0
      ? Number(((adjustedFounderTotalShares / totalDilutedShares) * 100).toFixed(2))
      : 0;

    const deltaFounderPct = Number((whatIfFounderPct - baseFounderPct).toFixed(2));

    const postVal = currentRoundResult.postMoneyValuation;
    const whatIfFounderValue = Math.round((whatIfFounderPct / 100) * postVal);
    const deltaFounderValue = whatIfFounderValue - baseFounderVal;

    // Founder voting control status
    const founderVotingControlStatus =
      whatIfFounderPct >= 50.1 ? 'majority' : whatIfFounderPct >= 35 ? 'effective_veto' : 'minority';

    // Downside exit proceeds waterfall
    const exitVal = scenarioConfig.exitValuation;
    let exitProceedsInvestors = 0;
    let exitProceedsFounders = 0;

    const preferredInvested = baseInvestorCapital || 5000000;
    const prefClaim = preferredInvested * scenarioConfig.liquidationMultiple;

    if (scenarioConfig.isParticipating) {
      // Participating Preferred: Takes preference off top, THEN shares pro-rata in remaining proceeds
      const prefPayout = Math.min(exitVal, prefClaim);
      const remainingProceeds = Math.max(0, exitVal - prefPayout);
      const investorProRata = totalDilutedShares > 0 ? baseInvestorShares / totalDilutedShares : 0.3;
      const founderProRata = totalDilutedShares > 0 ? adjustedFounderTotalShares / totalDilutedShares : 0.7;

      exitProceedsInvestors = Math.round(prefPayout + remainingProceeds * investorProRata);
      exitProceedsFounders = Math.round(remainingProceeds * founderProRata);
    } else {
      // 1x Non-Participating: Chooses MAX(preference, pro-rata ownership)
      const investorProRataValue = (baseInvestorShares / Math.max(1, totalDilutedShares)) * exitVal;
      if (prefClaim >= investorProRataValue) {
        // Prefers liquidation preference
        exitProceedsInvestors = Math.min(exitVal, prefClaim);
        exitProceedsFounders = Math.max(0, exitVal - exitProceedsInvestors);
      } else {
        // Converts to common and shares pro-rata
        const founderProRata = adjustedFounderTotalShares / Math.max(1, totalDilutedShares);
        exitProceedsFounders = Math.round(exitVal * founderProRata);
        exitProceedsInvestors = Math.round(exitVal - exitProceedsFounders);
      }
    }

    return {
      baseFounderPct,
      whatIfFounderPct,
      deltaFounderPct,
      baseFounderValue: baseFounderVal,
      whatIfFounderValue,
      deltaFounderValue,
      vestedFounderShares,
      unvestedFounderShares,
      activeEmployeeOptionsShares,
      unallocatedPoolShares,
      investorPreferredShares: baseInvestorShares,
      totalDilutedShares,
      founderVotingControlStatus,
      exitProceedsFounders,
      exitProceedsInvestors,
    };
  }, [currentRoundResult, scenarioConfig]);

  const handleReset = () => {
    setScenarioConfig({
      founderVestingPercent: 100,
      earlyEmployeeOptionsExercisedPercent: 0,
      coFounderDepartsUnvestedClawback: false,
      optionPoolTiming: 'pre_money',
      isAntiDilutionTriggered: false,
      exitValuation: Math.max(10000000, currentRoundResult.postMoneyValuation),
      liquidationMultiple: 1,
      isParticipating: false,
    });
  };

  return (
    <div className="rounded-3xl p-6 sm:p-7 bg-surface-main dark:bg-[#121629] border border-amber-400/20 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-main dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'fr'
                ? 'Générateur de Scénarios What-If'
                : language === 'zh'
                ? '创投敏感性测算 · What-If 假设生成器'
                : 'What-If Sensitivity Scenario Engine'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-heading text-text-primary dark:text-stone-100 mt-0.5">
            {language === 'fr'
              ? 'Impact Immédiat des Clauses de Vesting & Options Salariés'
              : language === 'zh'
              ? '股权成熟期 (Vesting) 与员工期权行权冲击推演'
              : 'Founder Vesting, Early Options & Equity Split Triggers'}
          </h3>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-center px-3 py-1.5 rounded-xl text-xs font-semibold border border-border-main dark:border-stone-700 bg-surface-muted/80 dark:bg-stone-800 hover:border-amber-400 text-text-secondary dark:text-stone-300 transition-all flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'Réinitialiser' : language === 'zh' ? '重置基准' : 'Reset Triggers'}</span>
        </button>
      </div>

      {/* Main What-If Interactive Controls & Sensitivity HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 6 Startup Trigger Switches (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Trigger 1: Founders Vesting Schedule */}
          <div className="p-4 rounded-2xl bg-surface-muted/50 dark:bg-stone-900/60 border border-border-main dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text-primary dark:text-stone-100 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>
                  {language === 'fr'
                    ? '1. Vesting des Fondateurs (Calendrier 4 Ans)'
                    : language === 'zh'
                    ? '1. 创始人股权成熟进度 (4年期 + 1年悬崖期)'
                    : '1. Founders Vesting Schedule (4-Year / 1-Yr Cliff)'}
                </span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">
                {scenarioConfig.founderVestingPercent}% {language === 'zh' ? '已成熟' : 'Vested'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px]">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() =>
                    setScenarioConfig((prev) => ({ ...prev, founderVestingPercent: pct }))
                  }
                  className={`py-2 rounded-xl border text-center transition-all ${
                    scenarioConfig.founderVestingPercent === pct
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md'
                      : 'bg-surface-main dark:bg-stone-800 text-text-secondary dark:text-stone-400 border-border-main dark:border-stone-700 hover:border-amber-400/40'
                  }`}
                >
                  {pct === 25
                    ? language === 'zh' ? '1年悬崖(25%)' : 'Yr 1 (25%)'
                    : pct === 50
                    ? language === 'zh' ? '2年(50%)' : 'Yr 2 (50%)'
                    : pct === 75
                    ? language === 'zh' ? '3年(75%)' : 'Yr 3 (75%)'
                    : language === 'zh' ? '4年全熟(100%)' : 'Full (100%)'}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-text-secondary dark:text-stone-400 leading-snug">
              {scenarioConfig.founderVestingPercent < 100
                ? language === 'zh'
                  ? `当前有 ${(100 - scenarioConfig.founderVestingPercent)}% 的创始人股份属于未成熟质押状态。如果联合创始人在此期间离职，公司有权按原价注销收回！`
                  : `Currently ${100 - scenarioConfig.founderVestingPercent}% of founder stock is unvested and subject to company repurchase at nominal par if a founder departs early.`
                : language === 'zh'
                ? '全部创始人股权均已完全成熟，无离职按原价赎回风险。'
                : 'Founding equity is fully vested with no reverse-vesting repurchase risk remaining.'}
            </p>
          </div>

          {/* Trigger 2: Early Employee Options Exercise */}
          <div className="p-4 rounded-2xl bg-surface-muted/50 dark:bg-stone-900/60 border border-border-main dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text-primary dark:text-stone-100 flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>
                  {language === 'fr'
                    ? '2. Options des Salariés Clés (Exercice)'
                    : language === 'zh'
                    ? '2. 早期核心员工期权行权比例 (Option Exercise)'
                    : '2. Early Employee Options Exercise Status'}
                </span>
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {scenarioConfig.earlyEmployeeOptionsExercisedPercent}% {language === 'zh' ? '已行权' : 'Exercised'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px]">
              {[0, 25, 50, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() =>
                    setScenarioConfig((prev) => ({
                      ...prev,
                      earlyEmployeeOptionsExercisedPercent: pct,
                    }))
                  }
                  className={`py-2 rounded-xl border text-center transition-all ${
                    scenarioConfig.earlyEmployeeOptionsExercisedPercent === pct
                      ? 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-md'
                      : 'bg-surface-main dark:bg-stone-800 text-text-secondary dark:text-stone-400 border-border-main dark:border-stone-700 hover:border-emerald-400/40'
                  }`}
                >
                  {pct === 0
                    ? language === 'zh' ? '未行权(0%)' : '0% Pool'
                    : `${pct}%`}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-text-secondary dark:text-stone-400 leading-snug">
              {scenarioConfig.earlyEmployeeOptionsExercisedPercent > 0
                ? language === 'zh'
                  ? `核心高管行权了 ${scenarioConfig.earlyEmployeeOptionsExercisedPercent}% 期权，转化为具有表决权的正式普通股，期权池沉淀份额相应缩减。`
                  : `Core hires have exercised ${scenarioConfig.earlyEmployeeOptionsExercisedPercent}% of option grants into voting common shares, transitioning from unallocated pool.`
                : language === 'zh'
                ? '全部期权池仍为未分配预留池，尚未对股东投票权造成实质分流。'
                : 'Option pool remains 100% unallocated reserve with no voting common issued yet.'}
            </p>
          </div>

          {/* Trigger 3: Co-Founder Early Departure & Clawback */}
          <div className="p-4 rounded-2xl bg-surface-muted/50 dark:bg-stone-900/60 border border-border-main dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-text-primary dark:text-stone-100 flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>
                    {language === 'fr'
                      ? '3. Départ Prématuré d’un Co-Fondateur'
                      : language === 'zh'
                      ? '3. 联合创始人提前离职与股份原价回购 (Clawback)'
                      : '3. Co-Founder Early Departure & Share Repurchase'}
                  </span>
                </label>
                <p className="text-[11px] text-text-secondary dark:text-stone-400 mt-0.5">
                  {language === 'zh'
                    ? '联合创始人第14个月离职，未成熟股份由公司按0.001美元原价回购并注销'
                    : 'Co-founder departs at Month 14; unvested shares repurchased at par & cancelled'}
                </p>
              </div>

              <button
                onClick={() =>
                  setScenarioConfig((prev) => ({
                    ...prev,
                    coFounderDepartsUnvestedClawback: !prev.coFounderDepartsUnvestedClawback,
                  }))
                }
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  scenarioConfig.coFounderDepartsUnvestedClawback
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                }`}
              >
                {scenarioConfig.coFounderDepartsUnvestedClawback
                  ? language === 'zh' ? '已触发回购注销' : 'CLAWBACK ACTIVE'
                  : language === 'zh' ? '团队完整' : 'TEAM INTACT'}
              </button>
            </div>
          </div>

          {/* Trigger 4: Downside Exit Waterfall Preference Simulator */}
          <div className="p-4 rounded-2xl bg-surface-muted/50 dark:bg-stone-900/60 border border-border-main dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-text-primary dark:text-stone-100 flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-purple-500" />
                <span>
                  {language === 'fr'
                    ? '4. Cascade de Sortie & Préférence'
                    : language === 'zh'
                    ? '4. 退出瀑布对价推演 (Exit Waterfall Value)'
                    : '4. Exit Valuation & Liquidation Multiple'}
                </span>
              </label>
              <span className="font-mono text-purple-400 font-bold">
                {formatMoney(scenarioConfig.exitValuation)}
              </span>
            </div>

            <input
              type="range"
              min="5000000"
              max="60000000"
              step="2500000"
              value={scenarioConfig.exitValuation}
              onChange={(e) =>
                setScenarioConfig((prev) => ({
                  ...prev,
                  exitValuation: Number(e.target.value),
                }))
              }
              className="w-full accent-purple-500 cursor-pointer"
            />

            <div className="flex items-center space-x-2 pt-1 font-mono text-[11px]">
              <button
                onClick={() =>
                  setScenarioConfig((prev) => ({
                    ...prev,
                    liquidationMultiple: 1,
                    isParticipating: false,
                  }))
                }
                className={`flex-1 py-1.5 rounded-xl border transition-all ${
                  scenarioConfig.liquidationMultiple === 1 && !scenarioConfig.isParticipating
                    ? 'bg-purple-600 text-white font-bold border-purple-500'
                    : 'bg-surface-main dark:bg-stone-800 text-text-secondary border-border-main dark:border-stone-700'
                }`}
              >
                1x Non-Participating
              </button>

              <button
                onClick={() =>
                  setScenarioConfig((prev) => ({
                    ...prev,
                    liquidationMultiple: 2,
                    isParticipating: true,
                  }))
                }
                className={`flex-1 py-1.5 rounded-xl border transition-all ${
                  scenarioConfig.liquidationMultiple === 2 && scenarioConfig.isParticipating
                    ? 'bg-rose-600 text-white font-bold border-rose-500'
                    : 'bg-surface-main dark:bg-stone-800 text-text-secondary border-border-main dark:border-stone-700'
                }`}
              >
                2x Participating (Toxic)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Sensitivity Impact Dashboard (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
          {/* Main Delta Headline Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1a1f3d] via-[#161a2e] to-[#121424] border border-amber-400/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                {language === 'fr' ? 'RÉSULTAT DU SCÉNARIO' : language === 'zh' ? '敏感性模拟实时结论' : 'WHAT-IF IMPACT SNAPSHOT'}
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  comparison.deltaFounderPct > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : comparison.deltaFounderPct < 0
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}
              >
                {comparison.deltaFounderPct > 0
                  ? `+${comparison.deltaFounderPct}% Founder Boost`
                  : comparison.deltaFounderPct < 0
                  ? `${comparison.deltaFounderPct}% Dilution Drag`
                  : 'Zero Delta'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-mono block">
                  {language === 'fr' ? 'Part Fondateur Initiale' : language === 'zh' ? '基准创始人股比' : 'Baseline Founder Share'}
                </span>
                <span className="text-2xl font-bold font-mono text-stone-300">
                  {comparison.baseFounderPct}%
                </span>
                <span className="text-[11px] text-stone-500 block">
                  {formatMoney(comparison.baseFounderValue)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-amber-400 uppercase font-mono block">
                  {language === 'fr' ? 'Part Simulée What-If' : language === 'zh' ? '推演后创始人实占' : 'What-If Founder Share'}
                </span>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {comparison.whatIfFounderPct}%
                </span>
                <span className="text-[11px] text-emerald-400 block font-mono">
                  {formatMoney(comparison.whatIfFounderValue)}
                </span>
              </div>
            </div>

            {/* Voting Control Meter */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-300">
                  {language === 'fr' ? 'Pouvoir de Vote & Contrôle' : language === 'zh' ? '创始人董事会投票控制权' : 'Voting Control Status'}:
                </span>
                <span
                  className={`font-bold uppercase ${
                    comparison.founderVotingControlStatus === 'majority'
                      ? 'text-emerald-400'
                      : comparison.founderVotingControlStatus === 'effective_veto'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {comparison.founderVotingControlStatus === 'majority'
                    ? language === 'zh' ? '绝对控股 (>50%)' : 'Majority Control'
                    : comparison.founderVotingControlStatus === 'effective_veto'
                    ? language === 'zh' ? '关键否决权 (35-50%)' : 'Veto Blocking Stake'
                    : language === 'zh' ? '少数股东 (<35%)' : 'Minority Position'}
                </span>
              </div>

              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    comparison.whatIfFounderPct >= 50
                      ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                      : 'bg-gradient-to-r from-rose-500 to-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, comparison.whatIfFounderPct)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Visual Stack Comparison Bar */}
          <div className="p-4 rounded-2xl bg-surface-muted/50 dark:bg-stone-900/60 border border-border-main dark:border-white/5 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
              {language === 'fr' ? 'STRUCTURE DU CAPITAL : BASELINE vs WHAT-IF' : language === 'zh' ? '股权结构条目对比：基准轮次 vs 假设情境' : 'CAP TABLE SPLIT: BASELINE vs WHAT-IF'}
            </span>

            {/* Baseline Stack */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-stone-400 block">Baseline:</span>
              <div className="h-6 w-full rounded-xl overflow-hidden flex font-mono text-[10px] text-white font-bold text-center">
                <div
                  style={{ width: `${comparison.baseFounderPct}%` }}
                  className="bg-amber-500 text-stone-950 flex items-center justify-center truncate px-1"
                >
                  {comparison.baseFounderPct}%
                </div>
                <div
                  style={{ width: `${100 - comparison.baseFounderPct}%` }}
                  className="bg-stone-700 flex items-center justify-center truncate px-1"
                >
                  {(100 - comparison.baseFounderPct).toFixed(1)}% (Investors/ESOP)
                </div>
              </div>
            </div>

            {/* What-If Stack */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-amber-400 block">What-If Simulation:</span>
              <div className="h-6 w-full rounded-xl overflow-hidden flex font-mono text-[10px] text-white font-bold text-center">
                <div
                  style={{ width: `${comparison.whatIfFounderPct}%` }}
                  className="bg-emerald-500 text-stone-950 flex items-center justify-center truncate px-1"
                >
                  {comparison.whatIfFounderPct}% (Founders)
                </div>
                <div
                  style={{ width: `${100 - comparison.whatIfFounderPct}%` }}
                  className="bg-purple-600 flex items-center justify-center truncate px-1"
                >
                  {(100 - comparison.whatIfFounderPct).toFixed(1)}% (Diluted)
                </div>
              </div>
            </div>
          </div>

          {/* Exit Waterfall Payout Preview */}
          <div className="p-4 rounded-2xl bg-surface-muted/50 dark:bg-stone-900/60 border border-border-main dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-300">
                {language === 'fr' ? 'Gain Fondateurs à la Sortie' : language === 'zh' ? '在当前估值退出时创始人分现' : 'Founder Cash Payout at Exit'}:
              </span>
              <strong className="text-emerald-400 text-sm">
                {formatMoney(comparison.exitProceedsFounders)}
              </strong>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400">
                {language === 'fr' ? 'Paiement Investisseurs (Pref)' : language === 'zh' ? '优先股资方退出总分现' : 'Investor Preferred Payout'}:
              </span>
              <span className="text-stone-300">
                {formatMoney(comparison.exitProceedsInvestors)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
