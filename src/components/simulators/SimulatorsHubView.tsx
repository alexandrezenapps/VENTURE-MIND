import React, { useState } from 'react';
import {
  PieChart,
  Scale,
  TrendingUp,
  Sliders,
  DollarSign,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Calendar,
  Zap,
} from 'lucide-react';
import { useApp, SimulatorType } from '../../context/AppContext';
import { CapTableDilutionCalculator } from './CapTableDilutionCalculator';

export const SimulatorsHubView: React.FC = () => {
  const {
    language,
    currency,
    selectedSimulator,
    setSelectedSimulator,
    formatMoney,
  } = useApp();

  // 1. Cap Table State
  const [capPreMoney, setCapPreMoney] = useState(12000000);
  const [capInvestment, setCapInvestment] = useState(3000000);
  const [capInitialShares, setCapInitialShares] = useState(8000000);
  const [capOptionPoolPct, setCapOptionPoolPct] = useState(10);
  const [capPoolTiming, setCapPoolTiming] = useState<'pre' | 'post'>('pre'); // Option Pool Shuffle

  // 2. SAFE State
  const [safeType, setSafeType] = useState<'post' | 'pre'>('post');
  const [safeAmount, setSafeAmount] = useState(1000000);
  const [safeCap, setSafeCap] = useState(8000000);
  const [safeDiscount, setSafeDiscount] = useState(20);
  const [seriesAPreMoney, setSeriesAPreMoney] = useState(15000000);

  // 3. Waterfall State
  const [exitValuation, setExitValuation] = useState(40000000);
  const [preferredInvested, setPreferredInvested] = useState(8000000);
  const [preferenceMultiple, setPreferenceMultiple] = useState(1);
  const [participatingType, setParticipatingType] = useState<'non_participating' | 'participating' | 'participating_capped'>('non_participating');
  const [preferredEquityPct, setPreferredEquityPct] = useState(25);

  // 4. 24-Month Fundraising Simulator State
  const [month, setMonth] = useState(1);
  const [cash, setCash] = useState(1200000);
  const [monthlyBurn, setMonthlyBurn] = useState(65000);
  const [mrr, setMrr] = useState(15000);
  const [founderMorale, setFounderMorale] = useState(90);
  const [termSheetOffers, setTermSheetOffers] = useState(0);
  const [logMessages, setLogMessages] = useState<string[]>([
    'Month 1: Seed closed ($1.2M in bank). Core product MVP launched.',
  ]);

  // Cap Table Calculations
  const capPostMoney = capPreMoney + capInvestment;
  const effectivePre = capPoolTiming === 'pre' 
    ? capPreMoney * (1 - capOptionPoolPct / 100) 
    : capPreMoney;
  const sharePrice = effectivePre / capInitialShares;
  const investorShares = capInvestment / sharePrice;
  const poolShares = (capOptionPoolPct / 100) * (capInitialShares + investorShares) / (1 - capOptionPoolPct / 100);
  const totalPostShares = capInitialShares + investorShares + poolShares;
  
  const founderFinalPct = (capInitialShares / totalPostShares) * 100;
  const investorFinalPct = (investorShares / totalPostShares) * 100;
  const poolFinalPct = (poolShares / totalPostShares) * 100;

  // SAFE Calculations
  const safeCapOwnership = (safeAmount / safeCap) * 100;
  const discountPriceRatio = 1 - safeDiscount / 100;

  // Waterfall Calculations
  const preferenceObligation = preferredInvested * preferenceMultiple;
  let preferredPayout = 0;
  let commonPayout = 0;

  if (participatingType === 'non_participating') {
    const asConvertedPayout = (preferredEquityPct / 100) * exitValuation;
    if (asConvertedPayout > preferenceObligation) {
      preferredPayout = asConvertedPayout;
      commonPayout = exitValuation - asConvertedPayout;
    } else {
      preferredPayout = Math.min(exitValuation, preferenceObligation);
      commonPayout = Math.max(0, exitValuation - preferredPayout);
    }
  } else if (participatingType === 'participating') {
    preferredPayout = Math.min(exitValuation, preferenceObligation);
    const remaining = Math.max(0, exitValuation - preferredPayout);
    preferredPayout += (preferredEquityPct / 100) * remaining;
    commonPayout = exitValuation - preferredPayout;
  } else {
    // 2x cap on preference
    const capMax = preferredInvested * 2;
    preferredPayout = Math.min(exitValuation, preferenceObligation);
    const remaining = Math.max(0, exitValuation - preferredPayout);
    const extra = (preferredEquityPct / 100) * remaining;
    preferredPayout = Math.min(capMax, preferredPayout + extra);
    commonPayout = exitValuation - preferredPayout;
  }

  const investorMOIC = preferredInvested > 0 ? (preferredPayout / preferredInvested).toFixed(2) : '0';

  // 24-Month Advance Month Action
  const advanceMonth = (action: 'hire' | 'marketing' | 'partner_roadshow' | 'cut_burn') => {
    if (month >= 24 || cash <= 0) return;

    let newCash = cash - (monthlyBurn - mrr);
    let newBurn = monthlyBurn;
    let newMrr = mrr;
    let newMorale = founderMorale;
    let newOffers = termSheetOffers;
    let message = '';

    if (action === 'hire') {
      newBurn += 15000;
      newMrr += 8000;
      newMorale += 5;
      message = `Month ${month + 1}: Hired Senior Fullstack Engineer. Burn +$15k, MRR +$8k.`;
    } else if (action === 'marketing') {
      newCash -= 20000;
      newMrr += 12000;
      message = `Month ${month + 1}: Aggressive marketing sprint. ARR pipeline up 25%.`;
    } else if (action === 'partner_roadshow') {
      newMorale -= 8;
      if (newMrr > 40000 || month > 12) {
        newOffers += 1;
        message = `Month ${month + 1}: Tier-1 Lead VC issued a Series A Term Sheet!`;
      } else {
        message = `Month ${month + 1}: VC roadshow meetings held. Feedback: "Revisit at $50k MRR."`;
      }
    } else if (action === 'cut_burn') {
      newBurn = Math.max(25000, newBurn - 15000);
      newMorale -= 10;
      message = `Month ${month + 1}: Trimmed non-essential expenses. Runway extended!`;
    }

    setMonth((m) => m + 1);
    setCash(Math.max(0, newCash));
    setMonthlyBurn(newBurn);
    setMrr(newMrr);
    setFounderMorale(Math.max(10, Math.min(100, newMorale)));
    setTermSheetOffers(newOffers);
    setLogMessages((prev) => [message, ...prev.slice(0, 5)]);
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-mobile-nav">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <Sliders className="w-4 h-4" />
          <span>
            {language === 'fr'
              ? 'Laboratoire de Modélisation Financière'
              : language === 'zh'
              ? '金融沙盘推演实验室'
              : 'Financial Simulation & Mechanics Lab'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-text-primary dark:text-stone-100 mt-1">
          {language === 'fr'
            ? 'Simulateurs de Table de Cap, SAFE & Cascades'
            : language === 'zh'
            ? '股权结构表、SAFE协议与清算瀑布沙盘'
            : 'Cap Table, SAFE, and Waterfall Simulators'}
        </h1>
        <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 max-w-2xl">
          {language === 'fr'
            ? 'Manipulez les paramètres réels de dilution, de valorisation et de liquidation pour anticiper chaque euro négocié.'
            : language === 'zh'
            ? '深度调节投前投后估值、期权池洗牌、清算多倍参与及24个月现金流跑道，让每一项谈判条款都有数可循。'
            : 'Adjust valuation inputs, option pool timing, and liquidation multiples to protect your company economics.'}
        </p>
      </div>

      {/* Simulator Switcher Tabs */}
      <div className="flex items-center space-x-2 border-b border-border-main dark:border-stone-800 pb-3 overflow-x-auto text-xs no-scrollbar font-semibold">
        {[
          { id: 'captable', label: { en: 'Cap Table & Dilution', fr: 'Table de Cap & Dilution', zh: '股权表与稀释沙盘' }, icon: PieChart },
          { id: 'safe', label: { en: 'SAFE & Convertible Notes', fr: 'SAFE & BSA-AIR', zh: 'SAFE/可转债换算' }, icon: Scale },
          { id: 'waterfall', label: { en: 'Exit Waterfall', fr: 'Cascade de Liquidation', zh: '清算退出瀑布' }, icon: TrendingUp },
          { id: 'fundraising', label: { en: '24-Month Journey', fr: 'Parcours Fondateur 24 Mois', zh: '24个月融资跑道沙盘' }, icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedSimulator === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedSimulator(tab.id as SimulatorType)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-surface-main dark:bg-stone-900 text-text-secondary dark:text-stone-400 hover:text-text-primary border border-border-main dark:border-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label[language]}</span>
            </button>
          );
        })}
      </div>

      {/* SIMULATOR 1: MULTI-ROUND CAP TABLE DILUTION CALCULATOR */}
      {selectedSimulator === 'captable' && (
        <CapTableDilutionCalculator />
      )}

      {false && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>Round Parameters</span>
            </h3>

            <div>
              <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
                Pre-Money Valuation: <strong className="text-text-primary dark:text-stone-100">{formatMoney(capPreMoney)}</strong>
              </label>
              <input
                type="range"
                min="2000000"
                max="50000000"
                step="500000"
                value={capPreMoney}
                onChange={(e) => setCapPreMoney(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
                Investment Amount: <strong className="text-emerald-600">{formatMoney(capInvestment)}</strong>
              </label>
              <input
                type="range"
                min="500000"
                max="15000000"
                step="250000"
                value={capInvestment}
                onChange={(e) => setCapInvestment(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
                Option Pool Size: <strong className="text-purple-600">{capOptionPoolPct}%</strong>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={capOptionPoolPct}
                onChange={(e) => setCapOptionPoolPct(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Option Pool Shuffle Mechanism */}
            <div className="p-3 rounded-xl bg-surface-muted dark:bg-stone-800/60 border border-border-main dark:border-stone-700 space-y-2">
              <span className="font-bold text-stone-800 dark:text-stone-200 block">
                Option Pool Timing (Shuffle Effect):
              </span>
              <div className="flex space-x-2 font-mono">
                <button
                  onClick={() => setCapPoolTiming('pre')}
                  className={`flex-1 py-1.5 rounded-lg border text-center transition-all ${
                    capPoolTiming === 'pre'
                      ? 'bg-emerald-600 text-white font-bold border-emerald-600'
                      : 'bg-surface-main dark:bg-stone-900 text-text-secondary border-border-main dark:border-stone-700'
                  }`}
                >
                  Pre-Money (VC standard)
                </button>
                <button
                  onClick={() => setCapPoolTiming('post')}
                  className={`flex-1 py-1.5 rounded-lg border text-center transition-all ${
                    capPoolTiming === 'post'
                      ? 'bg-emerald-600 text-white font-bold border-emerald-600'
                      : 'bg-surface-main dark:bg-stone-900 text-text-secondary border-border-main dark:border-stone-700'
                  }`}
                >
                  Post-Money (Fair sharing)
                </button>
              </div>
              <p className="text-[11px] text-text-secondary dark:text-stone-400 leading-tight">
                {capPoolTiming === 'pre'
                  ? '⚠️ 100% of the option pool dilution is borne solely by existing founders before the investor puts money in.'
                  : '✅ Dilution for the option pool is shared proportionately between founders and the incoming investor.'}
              </p>
            </div>
          </div>

          {/* Visualization & Cap Table Breakdown (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs space-y-6">
            <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 flex items-center justify-between">
              <span>Post-Round Ownership Structure</span>
              <span className="font-mono text-emerald-600 font-bold">
                Post-Money: {formatMoney(capPostMoney)}
              </span>
            </h3>

            {/* Stacked Pro-Forma Bar */}
            <div className="space-y-2">
              <div className="h-7 w-full rounded-xl overflow-hidden flex font-mono text-xs text-white font-bold text-center">
                <div
                  style={{ width: `${founderFinalPct}%` }}
                  className="bg-stone-800 dark:bg-stone-700 flex items-center justify-center truncate px-1"
                  title="Founders"
                >
                  {founderFinalPct.toFixed(1)}%
                </div>
                <div
                  style={{ width: `${investorFinalPct}%` }}
                  className="bg-emerald-600 flex items-center justify-center truncate px-1"
                  title="Investor"
                >
                  {investorFinalPct.toFixed(1)}%
                </div>
                <div
                  style={{ width: `${poolFinalPct}%` }}
                  className="bg-purple-600 flex items-center justify-center truncate px-1"
                  title="Option Pool"
                >
                  {poolFinalPct.toFixed(1)}%
                </div>
              </div>

              <div className="flex justify-between text-xs font-mono text-text-secondary dark:text-stone-400">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-stone-800 dark:bg-stone-700 inline-block" />
                  <span>Founders: {founderFinalPct.toFixed(1)}%</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
                  <span>New Investor: {investorFinalPct.toFixed(1)}%</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-purple-600 inline-block" />
                  <span>ESOP Pool: {poolFinalPct.toFixed(1)}%</span>
                </span>
              </div>
            </div>

            {/* Clean Tabular Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border-main dark:border-stone-800 text-text-secondary dark:text-stone-400">
                    <th className="py-2">Stakeholder</th>
                    <th className="py-2">Shares</th>
                    <th className="py-2 text-right">Ownership %</th>
                    <th className="py-2 text-right">Value ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main dark:divide-stone-800">
                  <tr>
                    <td className="py-2.5 font-bold text-text-primary dark:text-stone-100">Founders</td>
                    <td className="py-2.5 text-text-secondary">{capInitialShares.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold text-text-primary dark:text-stone-100">{founderFinalPct.toFixed(2)}%</td>
                    <td className="py-2.5 text-right font-bold text-text-primary dark:text-stone-100">{formatMoney((founderFinalPct / 100) * capPostMoney)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-emerald-600 dark:text-emerald-400">Series A Lead</td>
                    <td className="py-2.5 text-text-secondary">{Math.round(investorShares).toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold text-emerald-600">{investorFinalPct.toFixed(2)}%</td>
                    <td className="py-2.5 text-right font-bold text-emerald-600">{formatMoney(capInvestment)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-purple-600 dark:text-purple-400">Option Pool</td>
                    <td className="py-2.5 text-text-secondary">{Math.round(poolShares).toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold text-purple-600">{poolFinalPct.toFixed(2)}%</td>
                    <td className="py-2.5 text-right font-bold text-purple-600">{formatMoney((poolFinalPct / 100) * capPostMoney)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATOR 2: SAFE & NOTE SIMULATOR */}
      {selectedSimulator === 'safe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs space-y-5 text-xs">
            <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 flex items-center space-x-2">
              <Scale className="w-4 h-4 text-blue-600" />
              <span>SAFE & Note Inputs</span>
            </h3>

            {/* SAFE Type Toggle */}
            <div className="flex space-x-2 font-mono">
              <button
                onClick={() => setSafeType('post')}
                className={`flex-1 py-2 rounded-lg border text-center transition-all ${
                  safeType === 'post'
                    ? 'bg-blue-600 text-white font-bold border-blue-600'
                    : 'bg-surface-muted dark:bg-stone-800 text-text-secondary border-border-main dark:border-stone-700'
                }`}
              >
                Post-Money SAFE (YC 2018+)
              </button>
              <button
                onClick={() => setSafeType('pre')}
                className={`flex-1 py-2 rounded-lg border text-center transition-all ${
                  safeType === 'pre'
                    ? 'bg-blue-600 text-white font-bold border-blue-600'
                    : 'bg-surface-muted dark:bg-stone-800 text-text-secondary border-border-main dark:border-stone-700'
                }`}
              >
                Pre-Money SAFE (Classic)
              </button>
            </div>

            <div>
              <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
                SAFE Investment Amount: <strong className="text-text-primary dark:text-stone-100">{formatMoney(safeAmount)}</strong>
              </label>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="50000"
                value={safeAmount}
                onChange={(e) => setSafeAmount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
                Valuation Cap: <strong className="text-blue-600">{formatMoney(safeCap)}</strong>
              </label>
              <input
                type="range"
                min="2000000"
                max="20000000"
                step="500000"
                value={safeCap}
                onChange={(e) => setSafeCap(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
                Discount Rate: <strong className="text-amber-600">{safeDiscount}%</strong>
              </label>
              <input
                type="range"
                min="0"
                max="35"
                step="5"
                value={safeDiscount}
                onChange={(e) => setSafeDiscount(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs space-y-6 text-xs">
            <h3 className="font-bold text-sm text-text-primary dark:text-stone-100">
              Conversion Comparison at Series A
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                <span className="font-mono text-[10px] uppercase text-blue-700 dark:text-blue-400 font-bold block mb-1">
                  Effective Investor Ownership
                </span>
                <span className="text-2xl font-bold font-mono text-blue-900 dark:text-blue-200">
                  {safeCapOwnership.toFixed(2)}%
                </span>
                <p className="text-[11px] text-text-secondary mt-1">
                  Guaranteed minimum ownership via Cap ({formatMoney(safeCap)})
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-muted dark:bg-stone-800/60 border border-border-main dark:border-stone-700">
                <span className="font-mono text-[10px] uppercase text-text-secondary dark:text-stone-400 font-bold block mb-1">
                  Discount Effective Price
                </span>
                <span className="text-2xl font-bold font-mono text-text-primary dark:text-stone-100">
                  {((1 - safeDiscount / 100) * 100).toFixed(0)}%
                </span>
                <p className="text-[11px] text-text-secondary mt-1">
                  Investor receives {safeDiscount}% price discount if Cap is exceeded
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
              <span className="font-bold block text-text-primary dark:text-stone-100 mb-1">
                Executive Takeaway:
              </span>
              In a Post-Money SAFE, if you stack four $500k SAFEs at an $8M Cap, you have already committed <strong>25.0%</strong> of your company before negotiating with any Series A lead.
            </div>
          </div>
        </div>
      )}

      {/* SIMULATOR 3: EXIT WATERFALL SIMULATOR */}
      {selectedSimulator === 'waterfall' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs space-y-5 text-xs">
            <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Exit Scenario Controls</span>
            </h3>

            <div>
              <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
                Exit M&A Enterprise Valuation: <strong className="text-text-primary dark:text-stone-100">{formatMoney(exitValuation)}</strong>
              </label>
              <input
                type="range"
                min="5000000"
                max="150000000"
                step="2500000"
                value={exitValuation}
                onChange={(e) => setExitValuation(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
                Preferred Multiple: <strong className="text-amber-600">{preferenceMultiple}x</strong>
              </label>
              <div className="flex space-x-2 font-mono">
                {[1, 1.5, 2, 3].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setPreferenceMultiple(mult)}
                    className={`flex-1 py-1.5 rounded-lg border text-center transition-all ${
                      preferenceMultiple === mult
                        ? 'bg-amber-600 text-white font-bold border-amber-600'
                        : 'bg-surface-muted dark:bg-stone-800 text-text-secondary border-border-main dark:border-stone-700'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            {/* Participating Type */}
            <div className="space-y-1">
              <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
                Preference Type:
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'non_participating', label: '1x Non-Participating (Clean NVCA Standard)' },
                  { id: 'participating', label: 'Participating (Double Dipping Predator)' },
                  { id: 'participating_capped', label: 'Participating with 2x Cap' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setParticipatingType(item.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                      participatingType === item.id
                        ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500 font-bold text-amber-800 dark:text-amber-300'
                        : 'bg-surface-muted dark:bg-stone-800 border-border-main dark:border-stone-700 text-text-secondary'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs space-y-6">
            <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 flex items-center justify-between">
              <span>Waterfall Payout Distribution</span>
              <span className="font-mono text-amber-600 font-bold">
                Investor MOIC: {investorMOIC}x
              </span>
            </h3>

            {/* Visual Bar */}
            <div className="space-y-2">
              <div className="h-8 w-full rounded-xl overflow-hidden flex font-mono text-xs text-white font-bold text-center">
                <div
                  style={{ width: `${(preferredPayout / exitValuation) * 100}%` }}
                  className="bg-amber-600 flex items-center justify-center truncate px-2"
                >
                  Preferred: {formatMoney(preferredPayout)}
                </div>
                <div
                  style={{ width: `${(commonPayout / exitValuation) * 100}%` }}
                  className="bg-emerald-600 flex items-center justify-center truncate px-2"
                >
                  Common: {formatMoney(commonPayout)}
                </div>
              </div>
              <div className="flex justify-between text-xs font-mono text-text-secondary dark:text-stone-400">
                <span>Preferred Returns: {((preferredPayout / exitValuation) * 100).toFixed(1)}%</span>
                <span>Common Founders & Pool: {((commonPayout / exitValuation) * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-muted dark:bg-stone-800/60 border border-border-main dark:border-stone-700 text-xs text-text-secondary dark:text-stone-300">
              {participatingType === 'participating' ? (
                <span className="text-rose-600 dark:text-rose-400 font-bold block mb-1">
                  Predatory Dilution Warning:
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                  Clean Standard Liquidation:
                </span>
              )}
              {participatingType === 'participating'
                ? 'Because of full participation, the investor gets their full investment multiple first, then takes their 25% share of the rest, stripping $10M+ from the common shareholders.'
                : 'With standard non-participating preferred, the investor must choose between taking their money back OR converting to common equity, leaving maximum value to the founders.'}
            </div>
          </div>
        </div>
      )}

      {/* SIMULATOR 4: 24-MONTH JOURNEY SIMULATOR */}
      {selectedSimulator === 'fundraising' && (
        <div className="p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main dark:border-stone-800 pb-4">
            <div>
              <span className="text-xs font-mono text-emerald-600 font-bold">
                MONTH {month} OF 24
              </span>
              <h3 className="text-lg font-bold text-text-primary dark:text-stone-100 font-heading">
                Founder Runway Survival & Series A Odyssey
              </h3>
            </div>

            <div className="flex items-center space-x-4 text-xs font-mono">
              <div>
                <span className="text-text-secondary block">Cash Balance</span>
                <span className={`text-base font-bold ${cash < 200000 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatMoney(cash)}
                </span>
              </div>
              <div>
                <span className="text-text-secondary block">Net Runway</span>
                <span className="text-base font-bold text-text-primary dark:text-stone-100">
                  {monthlyBurn - mrr > 0 ? (cash / (monthlyBurn - mrr)).toFixed(1) : '∞'} mos
                </span>
              </div>
              <div>
                <span className="text-text-secondary block">Series A Offers</span>
                <span className="text-base font-bold text-amber-600">
                  {termSheetOffers} Term Sheets
                </span>
              </div>
            </div>
          </div>

          {/* Action Decision Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => advanceMonth('hire')}
              className="p-3.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 hover:border-emerald-500 text-left text-xs transition-all space-y-1"
            >
              <strong className="block text-text-primary dark:text-stone-100">1. Hire Top Engineer</strong>
              <span className="text-text-secondary text-[11px] block">Burn +$15k/mo, MRR +$8k</span>
            </button>
            <button
              onClick={() => advanceMonth('marketing')}
              className="p-3.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 hover:border-emerald-500 text-left text-xs transition-all space-y-1"
            >
              <strong className="block text-text-primary dark:text-stone-100">2. Customer Acq Sprint</strong>
              <span className="text-text-secondary text-[11px] block">One-time -$20k, MRR +$12k</span>
            </button>
            <button
              onClick={() => advanceMonth('partner_roadshow')}
              className="p-3.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 hover:border-emerald-500 text-left text-xs transition-all space-y-1"
            >
              <strong className="block text-text-primary dark:text-stone-100">3. Pitch Lead VC Partners</strong>
              <span className="text-text-secondary text-[11px] block">Requires traction for offers</span>
            </button>
            <button
              onClick={() => advanceMonth('cut_burn')}
              className="p-3.5 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 hover:border-emerald-500 text-left text-xs transition-all space-y-1"
            >
              <strong className="block text-text-primary dark:text-stone-100">4. Cut Burn to Default Alive</strong>
              <span className="text-text-secondary text-[11px] block">Reduce monthly burn -$15k</span>
            </button>
          </div>

          {/* Activity Feed Log */}
          <div className="p-4 rounded-xl bg-surface-muted dark:bg-stone-800/50 border border-border-main dark:border-stone-700 font-mono text-xs space-y-1.5">
            <span className="text-[10px] uppercase text-text-secondary dark:text-stone-400 block mb-1">
              Odyssey Operational Event Log:
            </span>
            {logMessages.map((msg, i) => (
              <p key={i} className="text-stone-700 dark:text-stone-300">
                {msg}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
