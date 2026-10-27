import React, { useState, useEffect } from 'react';
import {
  Flame,
  ShieldAlert,
  Send,
  Building2,
  TrendingUp,
  Scale,
  Brain,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Users,
  ChevronDown,
  ChevronUp,
  Volume2,
  FileText,
  DollarSign,
  Award,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  INVESTOR_PERSONAS,
  InvestorPersona,
} from '../../data/investorPersonasData';
import { InvestorPersonaModal } from './InvestorPersonaModal';

interface Message {
  sender: 'investor' | 'founder';
  text: string;
  tone?: string;
  dealImpact?: string;
}

export const NegotiationView: React.FC = () => {
  const { language, formatMoney, progress, recordGameScore, speak } = useApp();

  // Active Investor Persona
  const [activePersona, setActivePersona] = useState<InvestorPersona>(INVESTOR_PERSONAS[0]);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [showDossier, setShowDossier] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Term Sheet Offer state
  const [valuation, setValuation] = useState<number>(activePersona.startingTerms.valuation);
  const [prefType, setPrefType] = useState<'1x_np' | '1x_part' | '2x_np'>(activePersona.startingTerms.prefType);
  const [boardType, setBoardType] = useState<'founder_control' | 'balanced' | 'investor_control'>(activePersona.startingTerms.boardType);
  const [optionPool, setOptionPool] = useState<number>(activePersona.startingTerms.optionPool);

  // Messages Transcript
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'investor',
      text: `${activePersona.name} (${activePersona.firm}) : "${activePersona.dialogueSamples.openingPitch[language]}"`,
      tone: activePersona.badgeTitle[language],
    },
  ]);

  const [counterInput, setCounterInput] = useState('');
  const [dealSigned, setDealSigned] = useState(false);

  // Switch persona handler
  const handleSelectPersona = (newPersona: InvestorPersona) => {
    setActivePersona(newPersona);
    setValuation(newPersona.startingTerms.valuation);
    setPrefType(newPersona.startingTerms.prefType);
    setBoardType(newPersona.startingTerms.boardType);
    setOptionPool(newPersona.startingTerms.optionPool);
    setDealSigned(false);

    const initialMsg: Message = {
      sender: 'investor',
      text: `${newPersona.name} (${newPersona.firm}) : "${newPersona.dialogueSamples.openingPitch[language]}"`,
      tone: newPersona.badgeTitle[language],
    };

    setMessages([initialMsg]);

    if (audioEnabled) {
      setTimeout(() => {
        speak(newPersona.dialogueSamples.openingPitch[language]);
      }, 0);
    }
  };

  // Reset current negotiation
  const handleResetSession = () => {
    setValuation(activePersona.startingTerms.valuation);
    setPrefType(activePersona.startingTerms.prefType);
    setBoardType(activePersona.startingTerms.boardType);
    setOptionPool(activePersona.startingTerms.optionPool);
    setDealSigned(false);

    const initialMsg: Message = {
      sender: 'investor',
      text: `${activePersona.name} (${activePersona.firm}) : "${activePersona.dialogueSamples.openingPitch[language]}"`,
      tone: activePersona.badgeTitle[language],
    };
    setMessages([initialMsg]);
  };

  // Deal Scoring Metrics
  const calculateDealScore = () => {
    let score = 50;
    // Valuation bonus
    score += ((valuation - activePersona.startingTerms.valuation) / activePersona.startingTerms.valuation) * 25;
    // Clean preference
    if (prefType === '1x_np') score += 20;
    else if (prefType === '2x_np') score -= 15;
    else score -= 25; // 1x participating is toxic
    // Board control
    if (boardType === 'founder_control') score += 15;
    else if (boardType === 'balanced') score += 10;
    else score -= 20;
    // Option pool (ideal is 10-12%, higher pool penalizes founders)
    score -= (optionPool - 10) * 2;
    return Math.max(10, Math.min(100, Math.round(score)));
  };

  const dealScore = calculateDealScore();
  const investorAcceptance = Math.max(15, Math.min(95, Math.round(108 - dealScore * 0.7)));

  // Send Counter-Offer / Calibrated Tactic
  const handleSendCounter = (presetText?: string) => {
    const textToSend = presetText || counterInput;
    if (!textToSend.trim() || dealSigned) return;

    const newFounderMsg: Message = {
      sender: 'founder',
      text: textToSend,
    };

    let reply = '';
    let newVal = valuation;
    let newPref = prefType;
    let newBoard = boardType;
    let newPool = optionPool;

    const lower = textToSend.toLowerCase();

    // Check for calibrated empathy or Chris Voss techniques
    const isCalibrated =
      lower.includes('how') ||
      lower.includes('comment') ||
      lower.includes('如何') ||
      lower.includes('standard') ||
      lower.includes('nvca') ||
      lower.includes('balanced') ||
      lower.includes('rofn') ||
      lower.includes('gpu') ||
      lower.includes('gross margin') ||
      lower.includes('cohort');

    const isAggressive =
      lower.includes('unacceptable') ||
      lower.includes('inacceptable') ||
      lower.includes('无法接受') ||
      lower.includes('refuse') ||
      lower.includes('bad') ||
      lower.includes('competitor');

    if (isCalibrated) {
      reply = `${activePersona.name} : "${activePersona.dialogueSamples.calibratedPushbackResponse[language]}"`;
      newPref = '1x_np';
      newBoard = 'balanced';
      newVal = Math.round(valuation * 1.08);
      newPool = Math.max(10, optionPool - 2);
    } else if (isAggressive) {
      reply = `${activePersona.name} : "${activePersona.dialogueSamples.aggressivePushbackResponse[language]}"`;
      newVal = Math.max(activePersona.startingTerms.valuation, valuation - 500000);
    } else {
      reply = `${activePersona.name} : "${
        language === 'fr'
          ? `Nous entendons votre proposition. Sur une base de ${formatMoney(
              valuation + 500000
            )}, nous pouvons converger si le pool d’options reste à ${optionPool} %.`
          : language === 'zh'
          ? `我们评估了你的报价。在投前估值提升至 ${formatMoney(
              valuation + 500000
            )} 的前提下，我们可以在期权池维持在 ${optionPool}% 时达成一致。`
          : `We hear your position. We can align around ${formatMoney(
              valuation + 500000
            )} if the option pool remains at ${optionPool}%.`
      }"`;
      newVal = valuation + 500000;
    }

    setValuation(newVal);
    setPrefType(newPref);
    setBoardType(newBoard);
    setOptionPool(newPool);

    setMessages((prev) => [
      ...prev,
      newFounderMsg,
      {
        sender: 'investor',
        text: reply,
      },
    ]);
    setCounterInput('');

    if (audioEnabled) {
      setTimeout(() => {
        speak(reply);
      }, 0);
    }
  };

  // Sign definitive Term Sheet
  const handleSignDeal = () => {
    setDealSigned(true);
    const finalScore = Math.round((dealScore + investorAcceptance) / 2);
    recordGameScore('game_04', finalScore);

    const signMsg: Message = {
      sender: 'investor',
      text: `${activePersona.name} : "${activePersona.dialogueSamples.concessionAccepted[language]}"`,
      tone: 'Deal Signed & Executed',
    };
    setMessages((prev) => [...prev, signMsg]);

    if (audioEnabled) {
      setTimeout(() => {
        speak(activePersona.dialogueSamples.concessionAccepted[language]);
      }, 0);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-mobile-nav text-text-primary dark:text-stone-100">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <Flame className="w-4 h-4 fill-current text-rose-500" />
            <span>
              {language === 'fr'
                ? 'Arène de Négociation & Personas VC'
                : language === 'zh'
                ? '风投博弈模拟器 · 机构合伙人人格数据库'
                : 'VC Negotiation Simulator · Investor Personas'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-text-primary dark:text-white mt-1">
            {language === 'fr'
              ? 'Négociez Face aux Grands Fonds de la Place'
              : language === 'zh'
              ? '意向书实战交锋：博弈顶级合伙人'
              : 'Institutional Term Sheet Showdown'}
          </h1>
          <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            {language === 'fr'
              ? 'Affrontez 6 profils d’investisseurs distincts : requins institutionnels, faucons de gouvernance, baleines de blitzscaling et CVC stratégiques.'
              : language === 'zh'
              ? '与6位拥有独特心理画像的顶级合伙人对弈：铁面捕食者、风控铁鹰、主权巨鳄、硬科技量化极客、长期共赢者与企业CVC木马。'
              : 'Face off against 6 unique investor archetypes: institutional sharks, governance hawks, blitzscaling whales, and strategic corporate VCs.'}
          </p>
        </div>

        {/* Top Action Buttons: Switch Persona, Audio, Reset */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={() => setAudioEnabled((v) => !v)}
            className={`p-2.5 rounded-xl border text-xs font-mono transition-colors ${
              audioEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'bg-surface-muted dark:bg-stone-800 border-border-main dark:border-stone-700 text-stone-400'
            }`}
            title="Toggle Voice Readout"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetSession}
            className="px-3 py-2 rounded-xl bg-surface-muted dark:bg-stone-800 hover:bg-surface-elevated text-text-secondary text-xs font-mono transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Réinitialiser' : language === 'zh' ? '重置对局' : 'Reset'}</span>
          </button>

          <button
            onClick={() => setIsPersonaModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs font-mono shadow-md flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>
              {language === 'fr' ? 'Changer d’Investisseur' : language === 'zh' ? '切换对手画像 (6位)' : 'Switch Investor'}
            </span>
          </button>
        </div>
      </div>

      {/* ACTIVE PERSONA SPOTLIGHT BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-surface-main dark:bg-[#0f1424] border border-border-main dark:border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-stone-800 shrink-0 border-2 border-amber-400/40 shadow-md">
            <img
              src={activePersona.avatarUrl}
              alt={activePersona.name}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-base text-amber-300 bg-[#161c2d]">
              {activePersona.name.split(' ').map((n) => n[0]).join('')}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-white">
                {activePersona.name}
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-500 dark:text-amber-300 border border-amber-400/30">
                {activePersona.archetype[language]}
              </span>
            </div>

            <div className="text-xs text-text-secondary dark:text-stone-400 font-mono mt-0.5">
              {activePersona.role[language]} · {activePersona.firm} · <strong className="text-amber-500">{activePersona.aum}</strong>
            </div>
          </div>
        </div>

        {/* Persona Dossier Button */}
        <button
          onClick={() => setShowDossier((v) => !v)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-surface-muted dark:bg-stone-800/80 hover:bg-stone-700/80 border border-border-main dark:border-stone-700 text-xs font-mono transition-all self-start md:self-center cursor-pointer"
        >
          <Brain className="w-4 h-4 text-amber-400" />
          <span>
            {showDossier
              ? language === 'fr'
                ? 'Masquer le Dossier X-Ray'
                : language === 'zh'
                ? '收起心理X光档案'
                : 'Hide Psychological Dossier'
              : language === 'fr'
              ? 'Voir le Dossier X-Ray Psychologique'
              : language === 'zh'
              ? '调阅心理X光档案'
              : 'View Psychological Dossier'}
          </span>
          {showDossier ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* COLLAPSIBLE PSYCHOLOGICAL DOSSIER */}
      {showDossier && (
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/5 dark:bg-[#12182d] border border-amber-400/30 shadow-lg space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface-main dark:bg-[#0c1020] border border-border-main dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-500">
                {language === 'fr' ? 'Motivation Principale' : language === 'zh' ? '核心诉求与动机' : 'Core Motivation'}
              </span>
              <p className="text-text-secondary dark:text-stone-300 leading-relaxed">
                {activePersona.psychologicalProfile.coreMotivation[language]}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-main dark:bg-[#0c1020] border border-border-main dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-400">
                {language === 'fr' ? 'Peur / Point de Vulnérabilité' : language === 'zh' ? '深层恐惧与软肋' : 'Core Fear / Vulnerability'}
              </span>
              <p className="text-text-secondary dark:text-stone-300 leading-relaxed">
                {activePersona.psychologicalProfile.weaknessOrFear[language]}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-main dark:bg-[#0c1020] border border-border-main dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                {language === 'fr' ? 'Astuce d’Empathie Tactique' : language === 'zh' ? '战术同理心破局密钥' : 'Tactical Empathy Key'}
              </span>
              <p className="text-text-secondary dark:text-stone-300 leading-relaxed">
                {activePersona.tacticalEmpathyTip[language]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DEAL METERS DUAL DISPLAY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Founder Equity & Health Score */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-main dark:bg-[#0f1424] border border-border-main dark:border-stone-800 shadow-xs">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-text-secondary dark:text-stone-400">
              {language === 'fr' ? 'Qualité du Deal (Fondateur)' : language === 'zh' ? '创始人权益健康度' : 'Founder Deal Quality Score'}
            </span>
            <span className={`font-bold font-mono text-sm ${dealScore > 65 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {dealScore}%
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${dealScore > 65 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${dealScore}%` }}
            />
          </div>
          <p className="text-[11px] text-text-secondary dark:text-stone-400 mt-2 font-mono">
            {dealScore > 75
              ? '✅ Clean NVCA terms with protected founder governance.'
              : dealScore > 50
              ? '⚖️ Moderate terms. Watch out for liquidation preference or option pool dilution.'
              : '⚠️ Toxic predatory conditions in place.'}
          </p>
        </div>

        {/* Investor Acceptance Probability */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-main dark:bg-[#0f1424] border border-border-main dark:border-stone-800 shadow-xs">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-text-secondary dark:text-stone-400">
              {language === 'fr' ? 'Probabilité de Signature VC' : language === 'zh' ? '资方签署接受概率' : 'Investor Willingness to Sign'}
            </span>
            <span className={`font-bold font-mono text-sm ${investorAcceptance > 60 ? 'text-blue-500' : 'text-rose-500'}`}>
              {investorAcceptance}%
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${investorAcceptance > 60 ? 'bg-blue-500' : 'bg-rose-500'}`}
              style={{ width: `${investorAcceptance}%` }}
            />
          </div>
          <p className="text-[11px] text-text-secondary dark:text-stone-400 mt-2 font-mono">
            {investorAcceptance > 65
              ? 'Market-aligned offer. Partner is ready to execute definitive contracts.'
              : 'Partner feels pushed too far. Risk of walking away.'}
          </p>
        </div>
      </div>

      {/* MAIN NEGOTIATION CHAT & LIVE TERM SHEET DIALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat / Dialogue Interface (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[560px] rounded-3xl bg-surface-main dark:bg-[#0d111c] border border-border-main dark:border-stone-800 overflow-hidden shadow-xl">
          {/* Partner Live Header */}
          <div className="px-5 py-3.5 border-b border-border-main dark:border-stone-800 bg-surface-muted/50 dark:bg-[#121626] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs font-mono">
                {activePersona.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <span className="font-bold text-text-primary dark:text-stone-100 block">
                  {activePersona.name}
                </span>
                <span className="text-[11px] text-text-secondary dark:text-stone-400 font-mono">
                  {activePersona.firm} · {activePersona.aum}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Live Session
              </span>
            </div>
          </div>

          {/* Transcript Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'founder' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${
                    m.sender === 'founder'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs'
                      : 'bg-surface-muted dark:bg-[#14192a] text-stone-900 dark:text-stone-100 rounded-tl-xs border border-border-main dark:border-stone-700/80'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Calibrated Tactic Quick-Triggers (Tailored per Persona) */}
          <div className="p-3 border-t border-border-main dark:border-stone-800 bg-surface-muted/30 dark:bg-[#0f1322] flex space-x-2 overflow-x-auto text-[11px] no-scrollbar">
            {activePersona.id === 'marcus_vance' && (
              <>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Comment notre prochain tour en Série B réagira-t-il face à une préférence participante de 1x qui diverge des standards NVCA ?'
                        : language === 'zh'
                        ? '下一轮顶级机构领投方如果看到非标的参与型清算优先权，将如何影响我们获得百亿估值？'
                        : 'How will our future Series B lead price the stock with a non-standard participating preference overhang?'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  🎯 Calibrated "How" Question (Clean Preference)
                </button>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Nous apprécions votre implication. Pour le conseil, adoptons une gouvernance 2-2-1 avec un administrateur indépendant mutuellement choisi.'
                        : language === 'zh'
                        ? '我们非常尊重贵机构的赋能价值。对于董事会席位，我们提议采用主流的2-2-1平衡架构（含共同推选的独立董事）。'
                        : 'We value your partnership. For the board, let us implement a balanced 2-2-1 structure with a mutually agreed industry independent.'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  ⚖️ Propose 2-2-1 Balanced Board
                </button>
              </>
            )}

            {activePersona.id === 'victoria_sterling' && (
              <>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Voici notre plan de recrutement détaillé sur 18 mois : un pool de 12 % suffit largement à attirer 6 ingénieurs seniors.'
                        : language === 'zh'
                        ? '这是我们未来18个月的具体招聘测算表：12%的期权池已完全足够吸引6位核心科学家与销售主管加盟。'
                        : 'Here is our detailed 18-month hiring model: a 12% pool fully covers 6 senior engineering and GTM hires.'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  📊 Justify 12% ESOP with Headcount Plan
                </button>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Nous acceptons les vetos statutaires stricts de la NVCA sur les fusions-acquisitions et la liquidation, mais conservons la liberté opérationnelle.'
                        : language === 'zh'
                        ? '我们完全同意在并购与清算等重大公司事项上赋予资方标准NVCA否决权，但在日常经营研发上保持管理层自主权。'
                        : 'We agree to standard NVCA protective provisions on M&A and dissolution, while keeping operational autonomy.'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  🛡️ NVCA Standard Governance Compromise
                </button>
              </>
            )}

            {activePersona.id === 'kenji_takahashi' && (
              <>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Si vous souhaitez déployer 8 M$, ajustons la valorisation à 26 M$ Pré pour maintenir la dilution globale sous les 23 %.'
                        : language === 'zh'
                        ? '如果贵基金希望直接注资800万美元建立护城河，我们提议将投前估值同步调整至2600万美元，让整体稀释保持在23%合理区间。'
                        : 'If you want to deploy $8M to monopolize the category, let us price the Pre-Money at $26M to keep dilution disciplined.'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  🚀 Scale Pre-Money to $26M for $8M Check
                </button>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Nous accordons un droit de pro-rata standard NVCA, mais pas de super pro-rata à 150 % qui bloquerait de futurs partenaires stratégiques.'
                        : language === 'zh'
                        ? '我们乐于给予标准等比例优先认购权，但无法签署150%超额认购权，必须为后期的战略投资人留足空间。'
                        : 'We offer standard 100% pro-rata rights, but must exclude 150% super pro-rata to preserve Series B syndication.'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  ⚡ Restrict Super Pro-Rata to Standard
                </button>
              </>
            )}

            {activePersona.id === 'dr_arthur_chen' && (
              <>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Nos contrats d’infrastructure GPU exigent un paiement comptant immédiat. Débloquons 2,5 M$ dès le closing initial.'
                        : language === 'zh'
                        ? '我们出具的算力供应商合同要求预付全款锁定算力。提议首期交割金额提升至250万美元，剩余50万与企业交付挂钩。'
                        : 'Our GPU vendor contracts require committed capex upfront. Let us fund $2.5M at closing with $500K on enterprise delivery.'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  🔬 GPU Capex Contract Justification
                </button>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Voici la preuve de nos cohortes : le coût marginal d’inférence chute de 60 % dès que le volume double.'
                        : language === 'zh'
                        ? '这是真实客户群组留存数据：模型微调与推理边际成本在调用量翻倍时呈指数级下降60%，毛利率完全达标。'
                        : 'Cohort metrics show inference unit costs drop 60% with scale, proving 70%+ gross margin sustainability.'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  📈 Unit Economics Flywheel Proof
                </button>
              </>
            )}

            {activePersona.id === 'helena_lindqvist' && (
              <>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Nous partageons entièrement votre vision à long terme. Fixons la valorisation à 14,5 M$ avec des statuts NVCA propres.'
                        : language === 'zh'
                        ? '我们非常珍视与贵基金的长期共赢理念。提议在1450万美元投前估值达成共识，签署最纯正的标准NVCA协议。'
                        : 'We share your 20-year horizon. Let us finalize at $14.5M Pre-Money with clean NVCA market terms.'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  🌱 Mission & Long-Term Values Alignment
                </button>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Nous vous invitons formellement à prendre un rôle d’observatrice active au conseil d’administration.'
                        : language === 'zh'
                        ? '我们诚挚邀请您出任董事会首席顾问与战略观察员，深度参与公司文化与战略治理。'
                        : 'We formally invite you to serve as Board Observer and Strategic Advisory Chair.'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  🤝 Invite as Board Observer
                </button>
              </>
            )}

            {activePersona.id === 'devon_miller' && (
              <>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Un droit de premier refus (ROFR) bloquerait tout rachat futur. Remplaçons-le par un droit de première notification (ROFN) de 15 jours.'
                        : language === 'zh'
                        ? '独家并购先买权（ROFR）会彻底破坏未来潜在买家的竞价意愿。我们坚决提议将其替换为15天的优先通知权（ROFN）。'
                        : 'An acquisition ROFR chills future M&A. We propose replacing it with a 15-day Right of First Notice (ROFN).'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  🛡️ Replace Poison ROFR with Clean ROFN
                </button>
                <button
                  onClick={() =>
                    handleSendCounter(
                      language === 'fr'
                        ? 'Nous séparons la levée de fonds du contrat commercial : partenariat non exclusif avec remises tarifaires préférentielles.'
                        : language === 'zh'
                        ? '股权投资协议与商业采购合同必须完全解耦：商业合作以独立非排他主服务协议签署，并给予母公司阶梯折扣。'
                        : 'Separate equity investment from commercial distribution: non-exclusive tiered partnership agreement.'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface-main dark:bg-[#171d33] border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  📦 Arm’s Length Commercial Unbundling
                </button>
              </>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3.5 border-t border-border-main dark:border-stone-800 flex items-center space-x-2.5">
            <input
              type="text"
              value={counterInput}
              disabled={dealSigned}
              onChange={(e) => setCounterInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCounter()}
              placeholder={
                dealSigned
                  ? language === 'fr'
                    ? 'Term Sheet signée avec succès !'
                    : language === 'zh'
                    ? '投资意向书已成功签署！'
                    : 'Term sheet successfully executed!'
                  : language === 'fr'
                  ? `Formulez une question calibrée ou une contre-offre à ${activePersona.name}...`
                  : language === 'zh'
                  ? `向 ${activePersona.name} 发送校准型提问或谈判反驳意见...`
                  : `Type calibrated counter-offer or question to ${activePersona.name}...`
              }
              className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-muted dark:bg-[#14192a] border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 focus:outline-emerald-500"
            />
            <button
              onClick={() => handleSendCounter()}
              disabled={dealSigned || !counterInput.trim()}
              className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Deal Term Sheet Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-surface-main dark:bg-[#0d111c] border border-border-main dark:border-stone-800 shadow-xl space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-border-main dark:border-stone-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-500 font-bold block">
                Term Sheet Dials
              </span>
              <h3 className="font-bold text-sm text-text-primary dark:text-white">
                Live Proposed Terms
              </h3>
            </div>
            <span className="font-mono text-emerald-500 font-bold text-sm">
              Pre: {formatMoney(valuation)}
            </span>
          </div>

          {/* Special Clause Warning if Active */}
          {activePersona.startingTerms.specialClause && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200">
              <div className="flex items-center space-x-1.5 font-bold font-mono text-[10px] uppercase text-amber-500 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Special Investor Covenant</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {activePersona.startingTerms.specialClause[language]}
              </p>
            </div>
          )}

          {/* Term 1: Valuation slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-secondary dark:text-stone-400">Pre-Money Valuation:</span>
              <strong className="text-emerald-500 tabular-nums">{formatMoney(valuation)}</strong>
            </div>
            <input
              type="range"
              min={Math.round(activePersona.startingTerms.valuation * 0.7)}
              max={Math.round(activePersona.startingTerms.valuation * 1.5)}
              step="500000"
              value={valuation}
              disabled={dealSigned}
              onChange={(e) => setValuation(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Term 2: Liquidation Preference */}
          <div className="space-y-1.5">
            <label className="block text-text-secondary dark:text-stone-400 font-mono text-[11px]">
              Liquidation Preference Clause:
            </label>
            <div className="space-y-1.5 font-mono">
              {[
                { id: '1x_np', label: '1x Non-Participating (Clean NVCA)', clean: true },
                { id: '1x_part', label: '1x Participating (Predatory Trap)', clean: false },
                { id: '2x_np', label: '2x Non-Participating (Downside heavy)', clean: false },
              ].map((p) => (
                <button
                  key={p.id}
                  disabled={dealSigned}
                  onClick={() => setPrefType(p.id as any)}
                  className={`w-full text-left px-3 py-2 rounded-xl border text-[11px] transition-all cursor-pointer ${
                    prefType === p.id
                      ? p.clean
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold'
                        : 'bg-rose-500/15 border-rose-500 text-rose-950 dark:text-rose-200 font-bold'
                      : 'bg-surface-muted dark:bg-[#121626] border-border-main dark:border-stone-800 text-text-secondary hover:border-stone-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Term 3: Board Composition */}
          <div className="space-y-1.5">
            <label className="block text-text-secondary dark:text-stone-400 font-mono text-[11px]">
              Board Architecture:
            </label>
            <div className="space-y-1.5 font-mono">
              {[
                { id: 'founder_control', label: 'Founder Majority (2 Founders, 1 VC)' },
                { id: 'balanced', label: 'Balanced (2 Founders, 2 VCs, 1 Neutral Indep.)' },
                { id: 'investor_control', label: 'Investor Majority (2 VCs, 1 Founder ⚠️)' },
              ].map((b) => (
                <button
                  key={b.id}
                  disabled={dealSigned}
                  onClick={() => setBoardType(b.id as any)}
                  className={`w-full text-left px-3 py-2 rounded-xl border text-[11px] transition-all cursor-pointer ${
                    boardType === b.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold'
                      : 'bg-surface-muted dark:bg-[#121626] border-border-main dark:border-stone-800 text-text-secondary hover:border-stone-700'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Term 4: Option Pool Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-secondary dark:text-stone-400">Pre-Money ESOP Pool:</span>
              <strong className="text-amber-500 tabular-nums">{optionPool}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="20"
              step="1"
              value={optionPool}
              disabled={dealSigned}
              onChange={(e) => setOptionPool(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Final Action Buttons */}
          <div className="pt-3 border-t border-border-main dark:border-stone-800 space-y-2">
            {!dealSigned ? (
              <button
                onClick={handleSignDeal}
                disabled={investorAcceptance < 40}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-mono font-bold text-xs shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'fr'
                    ? 'Accepter et Signer la Term Sheet'
                    : language === 'zh'
                    ? '敲定意向书并正式交割签署'
                    : 'Execute & Sign Definitive Term Sheet'}
                </span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500 text-emerald-950 dark:text-emerald-200 text-center font-mono text-xs space-y-1">
                <div className="flex items-center justify-center space-x-1.5 font-bold">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>
                    {language === 'fr' ? 'Contrat Signé avec Succès !' : language === 'zh' ? '条款协议圆满交割！' : 'Deal Closed & Syndicated!'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  {language === 'fr'
                    ? `Score Final du Deal : ${Math.round((dealScore + investorAcceptance) / 2)} / 100`
                    : language === 'zh'
                    ? `最终战术综合得分：${Math.round((dealScore + investorAcceptance) / 2)} / 100`
                    : `Final Deal Synthesis: ${Math.round((dealScore + investorAcceptance) / 2)} / 100`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Investor Persona Switcher Modal */}
      <InvestorPersonaModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        selectedPersonaId={activePersona.id}
        onSelectPersona={handleSelectPersona}
      />
    </div>
  );
};
