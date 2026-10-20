import React, { useState, useMemo } from 'react';
import {
  PieChart,
  TrendingDown,
  TrendingUp,
  Plus,
  Trash2,
  RotateCcw,
  Sliders,
  DollarSign,
  HelpCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  ChevronRight,
  Download,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  FundingRound,
  RoundType,
  RoundSimulationResult,
  StakeholderRoundSnapshot,
  StakeholderCategory,
} from '../../types/capTable';

const STAKEHOLDER_COLORS: Record<StakeholderCategory, string> = {
  founders: '#F59E0B', // Amber
  employees: '#10B981', // Emerald
  angels: '#8B5CF6', // Purple
  seed_vc: '#3B82F6', // Sapphire blue
  series_a_vc: '#EC4899', // Rose/Pink
  series_b_vc: '#06B6D4', // Cyan
  option_pool: '#64748B', // Slate
};

const INITIAL_ROUNDS_PRESET: FundingRound[] = [
  {
    id: 'round_0',
    name: '1. Incorporation & Founder Allocation',
    type: 'founding',
    date: 'Jan 2024',
    preMoneyValuation: 0,
    investmentAmount: 50000,
    sharePrice: 0.005,
    sharesIssued: 8000000,
    leadInvestor: 'Founding Team',
    investorGroup: 'founders',
    note: '8,000,000 Common shares issued at $0.005 par value.',
  },
  {
    id: 'round_1',
    name: '2. Pre-Seed Post-Money SAFE',
    type: 'safe',
    date: 'Jun 2024',
    preMoneyValuation: 7000000,
    investmentAmount: 1000000,
    valuationCap: 8000000,
    discountPercent: 20,
    leadInvestor: 'Angel Syndicate',
    investorGroup: 'angels',
    note: 'Post-Money SAFE: $1M invested at an $8M valuation cap.',
  },
  {
    id: 'round_2',
    name: '3. ESOP Option Pool Setup',
    type: 'option_pool_grant',
    date: 'Dec 2024',
    preMoneyValuation: 8000000,
    investmentAmount: 0,
    optionPoolPercent: 10,
    poolTiming: 'pre_money', // Option pool shuffle
    leadInvestor: 'Employee Pool',
    investorGroup: 'option_pool',
    note: '10% unallocated option pool created before Series A (Option Pool Shuffle).',
  },
  {
    id: 'round_3',
    name: '4. Series A Preferred Equity Round',
    type: 'priced_equity',
    date: 'Aug 2025',
    preMoneyValuation: 16000000,
    investmentAmount: 4000000,
    leadInvestor: 'Horizon Venture Partners',
    investorGroup: 'series_a_vc',
    note: '$4M new capital at $16M Pre-Money ($20M Post-Money). SAFEs convert.',
  },
];

export const CapTableDilutionCalculator: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, formatMoney } = useApp();

  const [rounds, setRounds] = useState<FundingRound[]>(INITIAL_ROUNDS_PRESET);
  const [selectedRoundIdx, setSelectedRoundIdx] = useState<number>(INITIAL_ROUNDS_PRESET.length - 1);
  const [isAddingRound, setIsAddingRound] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // New Round Draft Form
  const [newRoundType, setNewRoundType] = useState<RoundType>('priced_equity');
  const [newRoundName, setNewRoundName] = useState('');
  const [newRoundPreMoney, setNewRoundPreMoney] = useState(30000000);
  const [newRoundInvestment, setNewRoundInvestment] = useState(8000000);
  const [newRoundValCap, setNewRoundValCap] = useState(25000000);
  const [newRoundDiscount, setNewRoundDiscount] = useState(20);
  const [newRoundPoolPct, setNewRoundPoolPct] = useState(10);
  const [newRoundPoolTiming, setNewRoundPoolTiming] = useState<'pre_money' | 'post_money'>('pre_money');
  const [newRoundLead, setNewRoundLead] = useState('');

  // Core Real-Time Multi-Stage Simulation Engine
  const simulationResults: RoundSimulationResult[] = useMemo(() => {
    let currentStakeholders: Map<
      string,
      { name: string; category: StakeholderCategory; shares: number; invested: number; color: string }
    > = new Map();

    const results: RoundSimulationResult[] = [];
    let pendingSafes: { id: string; name: string; invested: number; cap: number; discount: number; category: StakeholderCategory }[] = [];

    rounds.forEach((round, rIdx) => {
      let effectivePre = round.preMoneyValuation;
      let newCapital = round.investmentAmount;
      let newSharesIssued = 0;
      let effectiveSharePrice = 0;
      let poolSharesThisRound = 0;

      if (round.type === 'founding') {
        const founderShares = round.sharesIssued || 8000000;
        effectiveSharePrice = round.sharePrice || 0.005;
        effectivePre = 0;
        newCapital = round.investmentAmount;
        currentStakeholders.set('founders', {
          name: language === 'zh' ? '联合创始人团队 (Common)' : 'Founding Team (Common)',
          category: 'founders',
          shares: founderShares,
          invested: round.investmentAmount,
          color: STAKEHOLDER_COLORS.founders,
        });
        newSharesIssued = founderShares;
      } else if (round.type === 'safe') {
        // Post-money SAFE queues up or claims implicit safe ownership
        pendingSafes.push({
          id: round.id,
          name: round.leadInvestor || (language === 'zh' ? '天使投资人 (SAFE)' : 'Angel Syndicate (SAFE)'),
          invested: round.investmentAmount,
          cap: round.valuationCap || round.preMoneyValuation || 8000000,
          discount: round.discountPercent || 20,
          category: round.investorGroup || 'angels',
        });
      } else if (round.type === 'option_pool_grant') {
        // Expand option pool
        const currentTotalShares = Array.from(currentStakeholders.values()).reduce((sum, s) => sum + s.shares, 0);
        const targetPct = (round.optionPoolPercent || 10) / 100;
        // If pre-money pool shuffle, formula: PoolShares = (Target% * CurrentShares) / (1 - Target%)
        const neededShares = Math.round((targetPct * currentTotalShares) / (1 - targetPct));
        poolSharesThisRound = neededShares;
        newSharesIssued += neededShares;

        const existingPool = currentStakeholders.get('option_pool');
        if (existingPool) {
          existingPool.shares += neededShares;
        } else {
          currentStakeholders.set('option_pool', {
            name: language === 'zh' ? '期权池 (Unallocated ESOP)' : 'Option Pool (Unallocated ESOP)',
            category: 'option_pool',
            shares: neededShares,
            invested: 0,
            color: STAKEHOLDER_COLORS.option_pool,
          });
        }
      } else if (round.type === 'priced_equity') {
        // Priced equity round: convert all pending SAFEs first or simultaneously
        const preRoundShares = Array.from(currentStakeholders.values()).reduce((sum, s) => sum + s.shares, 0);
        effectiveSharePrice = round.preMoneyValuation / Math.max(1, preRoundShares);

        // Convert SAFEs: each SAFE converts at min(price from Cap, price from Discount, round price)
        pendingSafes.forEach((safe) => {
          const capPrice = safe.cap / Math.max(1, preRoundShares);
          const discountPrice = effectiveSharePrice * (1 - safe.discount / 100);
          const conversionPrice = Math.min(capPrice, discountPrice, effectiveSharePrice);
          const safeShares = Math.round(safe.invested / Math.max(0.001, conversionPrice));

          const existing = currentStakeholders.get(safe.id);
          if (existing) {
            existing.shares += safeShares;
            existing.invested += safe.invested;
          } else {
            currentStakeholders.set(safe.id, {
              name: safe.name,
              category: safe.category,
              shares: safeShares,
              invested: safe.invested,
              color: STAKEHOLDER_COLORS[safe.category] || STAKEHOLDER_COLORS.angels,
            });
          }
          newSharesIssued += safeShares;
        });
        pendingSafes = []; // cleared

        // Now issue new priced investor shares
        const investorShares = Math.round(round.investmentAmount / Math.max(0.001, effectiveSharePrice));
        newSharesIssued += investorShares;

        currentStakeholders.set(round.id, {
          name: round.leadInvestor || (language === 'zh' ? `领投机构 (${round.name})` : `Lead Investor (${round.name})`),
          category: round.investorGroup || 'series_a_vc',
          shares: investorShares,
          invested: round.investmentAmount,
          color: STAKEHOLDER_COLORS[round.investorGroup || 'series_a_vc'],
        });
      }

      // Compute Total Shares and snapshots
      const totalShares = Array.from(currentStakeholders.values()).reduce((sum, s) => sum + s.shares, 0);
      const postVal =
        round.type === 'priced_equity'
          ? round.preMoneyValuation + round.investmentAmount
          : effectiveSharePrice > 0
          ? totalShares * effectiveSharePrice
          : (round.valuationCap || 8000000);

      const prevRound = results[rIdx - 1];

      const snapshots: StakeholderRoundSnapshot[] = Array.from(currentStakeholders.entries()).map(([k, s]) => {
        const pct = totalShares > 0 ? (s.shares / totalShares) * 100 : 0;
        const prevPct = prevRound?.stakeholders.find((ps) => ps.id === k)?.ownershipPercent ?? pct;
        const dilution = rIdx === 0 ? 0 : pct - prevPct;

        return {
          id: k,
          name: s.name,
          category: s.category,
          shares: s.shares,
          ownershipPercent: Number(pct.toFixed(2)),
          investedCapital: s.invested,
          currentValue: Number(((pct / 100) * postVal).toFixed(0)),
          dilutionFromLastRound: Number(dilution.toFixed(2)),
          color: s.color,
        };
      });

      results.push({
        roundId: round.id,
        roundName: round.name,
        roundType: round.type,
        effectivePreMoney: effectivePre,
        newCapital,
        postMoneyValuation: postVal,
        effectiveSharePrice: Number(effectiveSharePrice.toFixed(4)),
        totalShares,
        newSharesIssued,
        stakeholders: snapshots,
        optionPoolShares: poolSharesThisRound,
        optionPoolPercent: round.optionPoolPercent || 0,
      });
    });

    return results;
  }, [rounds, language]);

  const currentResult = simulationResults[selectedRoundIdx] || simulationResults[simulationResults.length - 1];

  // Handle Add New Round
  const handleAddNewRound = () => {
    const nextIdx = rounds.length + 1;
    const roundId = `round_${Date.now()}`;
    const newRound: FundingRound = {
      id: roundId,
      name: newRoundName || `${nextIdx}. Round (${newRoundType.toUpperCase().replace('_', ' ')})`,
      type: newRoundType,
      date: '2026',
      preMoneyValuation: newRoundPreMoney,
      investmentAmount: newRoundInvestment,
      valuationCap: newRoundValCap,
      discountPercent: newRoundDiscount,
      optionPoolPercent: newRoundPoolPct,
      poolTiming: newRoundPoolTiming,
      leadInvestor: newRoundLead || 'New Strategic Partner',
      investorGroup: newRoundType === 'priced_equity' ? 'series_b_vc' : 'angels',
    };

    setRounds([...rounds, newRound]);
    setSelectedRoundIdx(rounds.length);
    setIsAddingRound(false);
    setNewRoundName('');
    setNewRoundLead('');
  };

  const handleDeleteRound = (idx: number) => {
    if (rounds.length <= 1) return;
    const filtered = rounds.filter((_, i) => i !== idx);
    setRounds(filtered);
    setSelectedRoundIdx(Math.max(0, idx - 1));
  };

  const handleResetPreset = (presetType: 'standard' | 'aggressive' | 'clean') => {
    if (presetType === 'standard') {
      setRounds(INITIAL_ROUNDS_PRESET);
      setSelectedRoundIdx(INITIAL_ROUNDS_PRESET.length - 1);
    } else if (presetType === 'aggressive') {
      setRounds([
        INITIAL_ROUNDS_PRESET[0],
        {
          id: 'round_agg_1',
          name: '2. Aggressive SAFE ($2M at $5M Cap)',
          type: 'safe',
          date: '2024',
          preMoneyValuation: 5000000,
          investmentAmount: 2000000,
          valuationCap: 5000000,
          discountPercent: 25,
          leadInvestor: 'Predatory Angels',
          investorGroup: 'angels',
        },
        {
          id: 'round_agg_2',
          name: '3. Expanded ESOP (15% Pre-Money)',
          type: 'option_pool_grant',
          date: '2025',
          preMoneyValuation: 6000000,
          investmentAmount: 0,
          optionPoolPercent: 15,
          poolTiming: 'pre_money',
          investorGroup: 'option_pool',
        },
        {
          id: 'round_agg_3',
          name: '4. Series A Down-Round ($5M at $8M Pre)',
          type: 'priced_equity',
          date: '2026',
          preMoneyValuation: 8000000,
          investmentAmount: 5000000,
          leadInvestor: 'Hardball VC',
          investorGroup: 'series_a_vc',
        },
      ]);
      setSelectedRoundIdx(3);
    } else {
      // Clean Founder-First
      setRounds([
        INITIAL_ROUNDS_PRESET[0],
        {
          id: 'round_clean_1',
          name: '2. Founder-Friendly SAFE ($1.5M at $15M Cap)',
          type: 'safe',
          date: '2024',
          preMoneyValuation: 15000000,
          investmentAmount: 1500000,
          valuationCap: 15000000,
          discountPercent: 15,
          leadInvestor: 'Founder Collective',
          investorGroup: 'angels',
        },
        {
          id: 'round_clean_2',
          name: '3. Shared Post-Money ESOP (7.5%)',
          type: 'option_pool_grant',
          date: '2025',
          preMoneyValuation: 20000000,
          investmentAmount: 0,
          optionPoolPercent: 7.5,
          poolTiming: 'post_money',
          investorGroup: 'option_pool',
        },
        {
          id: 'round_clean_3',
          name: '4. Series A Tier-1 VC ($8M at $32M Pre)',
          type: 'priced_equity',
          date: '2026',
          preMoneyValuation: 32000000,
          investmentAmount: 8000000,
          leadInvestor: 'Sequoia / Benchmark Tier',
          investorGroup: 'series_a_vc',
        },
      ]);
      setSelectedRoundIdx(3);
    }
  };

  const copySummaryToClipboard = () => {
    if (!currentResult) return;
    const text = `=== CAP TABLE SIMULATION: ${currentResult.roundName} ===
Post-Money Valuation: $${(currentResult.postMoneyValuation / 1000000).toFixed(2)}M
Total Shares: ${currentResult.totalShares.toLocaleString()}
Stakeholders:
${currentResult.stakeholders.map((s) => `• ${s.name}: ${s.ownershipPercent}% (${s.shares.toLocaleString()} shares | $${(s.currentValue / 1000000).toFixed(2)}M)`).join('\n')}
Generated on Venture Mind Executive Academy.`;
    navigator.clipboard?.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  return (
    <div className="space-y-6">
      {/* Title & Preset Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl glass-panel border-sophisticated">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-500/20 text-amber-400 border border-amber-400/30">
              {language === 'fr'
                ? 'Simulateur de Table de Capitalisation Dynamique'
                : language === 'zh'
                ? '多轮融资股权稀释沙盘推演'
                : 'Real-Time Cap Table Dilution Engine'}
            </span>
            <span className="text-xs text-text-secondary dark:text-stone-400 font-mono">
              • {rounds.length} {language === 'zh' ? '个融资节点' : 'Milestones'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary dark:text-stone-100 flex items-center space-x-2">
            <PieChart className="w-6 h-6 text-emerald-500" />
            <span>
              {language === 'fr'
                ? 'Modélisation Complète des Tours & Dilution'
                : language === 'zh'
                ? '股权架构与稀释测算实验室'
                : 'Multi-Round Cap Table & Dilution Lab'}
            </span>
          </h2>
          <p className="text-xs text-text-secondary dark:text-stone-400 max-w-2xl leading-relaxed">
            {language === 'fr'
              ? 'Simulez l’impact des tours priced (Série A/B), obligations convertibles, SAFEs et pools d’options BSPCE (pre vs post-money pool shuffle) sur le contrôle des fondateurs.'
              : language === 'zh'
              ? '自由添加定价股权轮次（种子轮/A轮/B轮）、可转债与SAFE协议换算，以及期权池预留（投前期权洗牌 vs 投后共同稀释），实时推演创始人股权红线。'
              : 'Simulate priced rounds (Series A/B), convertible notes, SAFEs, and option pool grants (pre vs post-money pool shuffle) with real-time ownership breakdown.'}
          </p>
        </div>

        {/* Quick Presets & Export */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            onClick={() => handleResetPreset('standard')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border border-border-main dark:border-stone-700 bg-surface-muted/60 dark:bg-stone-800/60 hover:border-amber-400 text-text-primary dark:text-stone-200 transition-all cursor-pointer"
          >
            {language === 'zh' ? '标准YC模型' : 'Standard YC'}
          </button>
          <button
            onClick={() => handleResetPreset('aggressive')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:border-rose-400 transition-all cursor-pointer"
          >
            {language === 'zh' ? '高稀释压榨' : 'Heavy Dilution'}
          </button>
          <button
            onClick={() => handleResetPreset('clean')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:border-emerald-400 transition-all cursor-pointer"
          >
            {language === 'zh' ? '创始人友好' : 'Founder First'}
          </button>
          <button
            onClick={copySummaryToClipboard}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? (language === 'zh' ? '已复制！' : 'Copied!') : (language === 'zh' ? '导出概要' : 'Export')}</span>
          </button>
        </div>
      </div>

      {/* Round Timeline Stepper */}
      <div className="p-4 rounded-2xl glass-panel border-sophisticated overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-3 min-w-max">
          {rounds.map((round, idx) => {
            const isSelected = selectedRoundIdx === idx;
            const res = simulationResults[idx];
            const founderSnapshot = res?.stakeholders.find((s) => s.category === 'founders');

            return (
              <div key={round.id} className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedRoundIdx(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500/25 via-[#231E3D] to-[#15192C] border-2 border-amber-400 ring-1 ring-amber-400/40 shadow-xl'
                      : 'bg-surface-muted/50 dark:bg-stone-900/60 border-border-main dark:border-stone-800 hover:border-stone-600'
                  }`}
                >
                  <div className="flex items-center justify-between space-x-3 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-800 text-stone-300">
                      {round.type.replace('_', ' ').toUpperCase()}
                    </span>
                    {idx > 0 && rounds.length > 1 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRound(idx);
                        }}
                        className="p-1 rounded-md text-stone-400 hover:text-rose-400 transition-colors"
                        title="Delete Round"
                      >
                        <Trash2 className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-text-primary dark:text-stone-100 truncate max-w-[170px]">
                    {round.name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono mt-1 text-stone-400">
                    <span>
                      {language === 'zh' ? '创始人：' : 'Founders:'}{' '}
                      <strong className={founderSnapshot && founderSnapshot.ownershipPercent < 51 ? 'text-rose-400' : 'text-emerald-400'}>
                        {founderSnapshot ? `${founderSnapshot.ownershipPercent}%` : '—'}
                      </strong>
                    </span>
                  </div>
                </button>

                {idx < rounds.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-stone-600 shrink-0" />
                )}
              </div>
            );
          })}

          {/* Add Round Button */}
          <button
            onClick={() => setIsAddingRound((prev) => !prev)}
            className="p-3.5 rounded-2xl border-2 border-dashed border-amber-400/40 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'zh' ? '添加新轮次' : 'Add Round'}</span>
          </button>
        </div>
      </div>

      {/* Add New Round Drawer / Modal Form */}
      {isAddingRound && (
        <div className="p-6 rounded-3xl glass-panel border-2 border-amber-400/50 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-main dark:border-stone-800 pb-3">
            <h3 className="text-base font-bold font-heading text-text-primary dark:text-stone-100 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{language === 'zh' ? '配置新轮次或期权池注资' : 'Configure New Round or Pool Grant'}</span>
            </h3>
            <button
              onClick={() => setIsAddingRound(false)}
              className="text-xs text-stone-400 hover:text-stone-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-mono text-stone-400 block mb-1">
                {language === 'zh' ? '轮次类型' : 'Round Instrument Type'}
              </label>
              <select
                value={newRoundType}
                onChange={(e) => setNewRoundType(e.target.value as RoundType)}
                className="w-full p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 font-medium"
              >
                <option value="priced_equity">Priced Equity (Series A/B/C)</option>
                <option value="safe">Post-Money SAFE / Note</option>
                <option value="option_pool_grant">Option Pool Expansion (ESOP)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-stone-400 block mb-1">
                {language === 'zh' ? '轮次名称' : 'Round Display Name'}
              </label>
              <input
                type="text"
                placeholder={newRoundType === 'priced_equity' ? 'Series B Expansion' : 'Seed Bridge SAFE'}
                value={newRoundName}
                onChange={(e) => setNewRoundName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 font-medium"
              />
            </div>

            {newRoundType === 'priced_equity' && (
              <>
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-1">
                    {language === 'zh' ? '投前估值 (Pre-Money)' : 'Pre-Money Valuation'}
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={newRoundPreMoney}
                    onChange={(e) => setNewRoundPreMoney(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-1">
                    {language === 'zh' ? '新增注资额 (New Capital)' : 'New Investment Amount'}
                  </label>
                  <input
                    type="number"
                    step="250000"
                    value={newRoundInvestment}
                    onChange={(e) => setNewRoundInvestment(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 font-mono"
                  />
                </div>
              </>
            )}

            {newRoundType === 'safe' && (
              <>
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-1">
                    {language === 'zh' ? '估值上限 (Valuation Cap)' : 'Valuation Cap'}
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={newRoundValCap}
                    onChange={(e) => setNewRoundValCap(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-1">
                    {language === 'zh' ? 'SAFE注资额' : 'SAFE Investment Amount'}
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={newRoundInvestment}
                    onChange={(e) => setNewRoundInvestment(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-1">
                    {language === 'zh' ? '折扣比例 (Discount %)' : 'Discount Rate (%)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={newRoundDiscount}
                    onChange={(e) => setNewRoundDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 font-mono"
                  />
                </div>
              </>
            )}

            {newRoundType === 'option_pool_grant' && (
              <>
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-1">
                    {language === 'zh' ? '目标期权池占比 (%)' : 'Target Pool Size (%)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={newRoundPoolPct}
                    onChange={(e) => setNewRoundPoolPct(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-1">
                    {language === 'zh' ? '期权池设立时点' : 'Pool Timing Mechanism'}
                  </label>
                  <select
                    value={newRoundPoolTiming}
                    onChange={(e) => setNewRoundPoolTiming(e.target.value as 'pre_money' | 'post_money')}
                    className="w-full p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 font-medium"
                  >
                    <option value="pre_money">Pre-Money (Option Pool Shuffle)</option>
                    <option value="post_money">Post-Money (Shared Dilution)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-mono text-stone-400 block mb-1">
                {language === 'zh' ? '领投机构/出资人' : 'Lead Investor Name'}
              </label>
              <input
                type="text"
                placeholder="Benchmark / Tiger / Andreessen"
                value={newRoundLead}
                onChange={(e) => setNewRoundLead(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleAddNewRound}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {language === 'zh' ? '确认并实时推演' : 'Simulate Round in Real-Time'}
            </button>
          </div>
        </div>
      )}

      {/* Selected Round Snapshot Metrics Banner */}
      {currentResult && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl glass-panel border-sophisticated">
            <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
              {language === 'zh' ? '当前节点投后估值' : 'Post-Money Valuation'}
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
              ${(currentResult.postMoneyValuation / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-stone-500 font-mono mt-0.5">
              Pre: ${(currentResult.effectivePreMoney / 1000000).toFixed(2)}M + ${(currentResult.newCapital / 1000000).toFixed(2)}M
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border-sophisticated">
            <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
              {language === 'zh' ? '总发行股数 (Total Shares)' : 'Fully Diluted Shares'}
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 mt-1">
              {(currentResult.totalShares / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-stone-500 font-mono mt-0.5">
              {currentResult.totalShares.toLocaleString()} shares
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border-sophisticated">
            <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
              {language === 'zh' ? '折算每股单价 (PPS)' : 'Price Per Share'}
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
              ${currentResult.effectiveSharePrice > 0 ? currentResult.effectiveSharePrice.toFixed(3) : '0.005'}
            </div>
            <div className="text-[10px] text-stone-500 font-mono mt-0.5">
              Par / Conversion Basis
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border-sophisticated">
            <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
              {language === 'zh' ? '创始人持股比例' : 'Founder Ownership'}
            </div>
            {(() => {
              const founder = currentResult.stakeholders.find((s) => s.category === 'founders');
              const isSafe = founder && founder.ownershipPercent >= 51;
              return (
                <div>
                  <div className={`text-xl sm:text-2xl font-bold font-mono mt-1 ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {founder ? `${founder.ownershipPercent}%` : '0%'}
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 mt-0.5 flex items-center space-x-1">
                    {isSafe ? (
                      <span className="text-emerald-400 flex items-center space-x-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{language === 'zh' ? '稳守绝对控股线 (51%+)' : 'Above 51% Control'}</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center space-x-0.5">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{language === 'zh' ? '跌破控股防线 (<51%)' : 'Below 51% Threshold'}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Visual Ownership Dilution Multi-Round Progress Bar */}
      <div className="p-5 sm:p-6 rounded-3xl glass-panel border-sophisticated space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-stone-200 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{language === 'zh' ? '股权堆叠透视图 · 当前轮次分布' : 'Equity Stack Spectrum · Current Distribution'}</span>
          </span>
          <span className="text-stone-400">100.00%</span>
        </div>

        {/* Stacked Bar */}
        {currentResult && (
          <div className="w-full h-8 sm:h-10 rounded-xl overflow-hidden flex shadow-inner border border-white/10">
            {currentResult.stakeholders.map((s) => {
              if (s.ownershipPercent <= 0) return null;
              return (
                <div
                  key={s.id}
                  style={{
                    width: `${s.ownershipPercent}%`,
                    backgroundColor: s.color,
                  }}
                  className="h-full flex items-center justify-center text-[10px] sm:text-xs font-bold font-mono text-stone-950 transition-all hover:brightness-110 relative group cursor-pointer"
                  title={`${s.name}: ${s.ownershipPercent}%`}
                >
                  {s.ownershipPercent >= 8 && (
                    <span className="truncate px-1">
                      {s.ownershipPercent}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        {currentResult && (
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono text-stone-300">
            {currentResult.stakeholders.map((s) => (
              <div key={s.id} className="flex items-center space-x-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="truncate max-w-[140px]">{s.name}:</span>
                <strong className="text-white">{s.ownershipPercent}%</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Stakeholder Share Table */}
      {currentResult && (
        <div className="p-5 sm:p-6 rounded-3xl glass-panel border-sophisticated space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-main dark:border-stone-800 pb-3">
            <div>
              <h3 className="font-bold font-heading text-base text-text-primary dark:text-stone-100 flex items-center space-x-2">
                <span>{language === 'zh' ? '股东名册与持股明细' : 'Stakeholder Cap Table Ledger'}</span>
                <span className="text-xs font-mono text-amber-400">({currentResult.roundName})</span>
              </h3>
            </div>
            <div className="text-xs font-mono text-stone-400">
              {language === 'zh' ? '每股面值基于本轮计算' : 'Calculated on Fully Diluted Basis'}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border-main dark:border-stone-800 text-stone-400 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">{language === 'zh' ? '股东主体' : 'Stakeholder'}</th>
                  <th className="py-2.5 px-3">{language === 'zh' ? '持股类别' : 'Class'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'zh' ? '总持有股数' : 'Shares'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'zh' ? '股权比例' : 'Ownership %'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'zh' ? '累计注资' : 'Invested'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'zh' ? '当前权益估值' : 'Implied Value'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'zh' ? '本轮稀释变动' : 'Round Dilution'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/50 dark:divide-stone-800/60">
                {currentResult.stakeholders.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="font-bold text-text-primary dark:text-stone-100 font-sans">
                        {s.name}
                      </span>
                    </td>
                    <td className="py-3 px-3 uppercase text-stone-400 text-[10px]">
                      {s.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-text-primary dark:text-stone-200">
                      {s.shares.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-amber-300">
                      {s.ownershipPercent}%
                    </td>
                    <td className="py-3 px-3 text-right text-stone-400">
                      ${s.investedCapital.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400">
                      ${(s.currentValue / 1000000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-3 text-right font-medium">
                      {s.dilutionFromLastRound < 0 ? (
                        <span className="text-rose-400 flex items-center justify-end space-x-0.5">
                          <TrendingDown className="w-3 h-3" />
                          <span>{s.dilutionFromLastRound}%</span>
                        </span>
                      ) : s.dilutionFromLastRound > 0 ? (
                        <span className="text-emerald-400 flex items-center justify-end space-x-0.5">
                          <TrendingUp className="w-3 h-3" />
                          <span>+{s.dilutionFromLastRound}%</span>
                        </span>
                      ) : (
                        <span className="text-stone-500">0.00%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Strategic Dilution Insights Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border border-amber-400/25 flex items-start space-x-3 text-xs">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-stone-100 font-heading">
            {language === 'zh'
              ? '创投精算洞察：期权池洗牌效应 (Option Pool Shuffle)'
              : 'Executive Dilution Insight: Option Pool Shuffle'}
          </div>
          <p className="text-stone-300 leading-relaxed">
            {language === 'zh'
              ? '当投资人要求在投前设立或扩充 10% 期权池（Pre-Money Pool）时，实际是将这部分期权的稀释代价100%转嫁给创始人团队；若采用投后共同扩充（Post-Money Pool），投资人与创始人将同比例共同稀释，创始人持股可多保住 1.5%~3.2% 的珍贵股权！'
              : 'When VCs insist on creating an unallocated option pool pre-money, 100% of the dilution falls on common founders before new cash enters. Pushing for post-money shared expansion preserves 1.5%–3.2% of valuable founding ownership.'}
          </p>
        </div>
      </div>
    </div>
  );
};
