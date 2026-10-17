import React, { useState } from 'react';
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  sender: 'investor' | 'founder';
  text: string;
  tone?: string;
  dealImpact?: string;
}

export const NegotiationView: React.FC = () => {
  const { language, formatMoney, progress } = useApp();

  // Term Sheet Offer state
  const [valuation, setValuation] = useState<number>(12000000);
  const [prefType, setPrefType] = useState<'1x_np' | '1x_part' | '2x_np'>('1x_part');
  const [boardType, setBoardType] = useState<'founder_control' | 'balanced' | 'investor_control'>('investor_control');
  const [optionPool, setOptionPool] = useState<number>(15);

  // Negotiation transcript
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'investor',
      text: language === 'fr'
        ? 'Marcus Vance (Horizon Capital) : « Écoutez, nous adorons la tech, mais ce marché est gelé. Notre offre est ferme : 12 M$ pré-money, 1x participante, et 2 sièges pour nous au conseil. Vous avez 48 heures pour signer. »'
        : language === 'zh'
        ? 'Marcus Vance (地平线资本主管合伙人)：“我们非常认可你们的技术壁垒，但眼下大环境处于严冬。我们的最终条件：1200万美元投前估值，1倍参与型清算优先权，资方占2个董事席位。48小时内签署有效。”'
        : 'Marcus Vance (Horizon Capital): "Look, we respect the tech, but macro multiples have compressed. Our terms are firm: $12M pre-money, 1x participating liquidation preference, and two investor board seats. We need a signature within 48 hours."',
      tone: 'Aggressive / Pressure',
    },
  ]);

  const [counterInput, setCounterInput] = useState('');

  // Deal Scoring Metrics
  const calculateDealScore = () => {
    let score = 50;
    // Valuation bonus
    score += ((valuation - 10000000) / 10000000) * 20;
    // Clean preference
    if (prefType === '1x_np') score += 20;
    else if (prefType === '2x_np') score -= 15;
    else score -= 25; // 1x participating is toxic
    // Board control
    if (boardType === 'founder_control') score += 15;
    else if (boardType === 'balanced') score += 10;
    else score -= 20;
    // Option pool
    score -= (optionPool - 10) * 2;
    return Math.max(10, Math.min(100, Math.round(score)));
  };

  const dealScore = calculateDealScore();
  const investorAcceptance = Math.max(15, Math.min(95, Math.round(110 - dealScore * 0.75)));

  const handleSendCounter = (presetText?: string) => {
    const textToSend = presetText || counterInput;
    if (!textToSend.trim()) return;

    const newFounderMsg: Message = {
      sender: 'founder',
      text: textToSend,
    };

    let reply = '';
    let newVal = valuation;
    let newPref = prefType;
    let newBoard = boardType;

    // Simulate investor reaction based on Chris Voss tactics
    if (textToSend.includes('How') || textToSend.includes('Comment') || textToSend.includes('如何') || textToSend.includes('standard')) {
      reply = language === 'fr'
        ? 'Marcus Vance : « Vous marquez un point sur les futurs tours. Si nous retirons la préférence participante pour revenir à une 1x non-participante standard, vous devez accepter le conseil équilibré 2-2-1 avec un indépendant neutre. »'
        : language === 'zh'
        ? 'Marcus Vance：“你说得有道理，非标参与权确实可能阻碍下一轮领投。如果我们将清算条款调整为标准的1倍非参与型，你们必须同意设立2-2-1制衡董事会（含1名独立中立董事）。”'
        : 'Marcus Vance: "Fair point regarding Series B syndication friction. If we drop the participating preference to a clean 1x non-participating, you must accept a 2-2-1 board with a mutual industry independent."';
      newPref = '1x_np';
      newBoard = 'balanced';
      newVal = 13500000;
    } else {
      reply = language === 'fr'
        ? 'Marcus Vance : « Ce chiffre de valorisation est trop élevé par rapport à vos métriques actuelles. Nous pouvons monter à 13 M$ si vous acceptez le pool d’options à 12 % avant le tour. »'
        : language === 'zh'
        ? 'Marcus Vance：“这个估值脱离了你们当前的ARR数据。我们可以让步到1300万，但前提是必须在投前设立12%的期权池。”'
        : 'Marcus Vance: "That valuation is stretched against your current ARR. We can bump to $13M if you agree to keep the unallocated option pool at 12% pre-money."';
      newVal = Math.min(14000000, valuation + 500000);
    }

    setValuation(newVal);
    setPrefType(newPref);
    setBoardType(newBoard);

    setMessages((prev) => [
      ...prev,
      newFounderMsg,
      {
        sender: 'investor',
        text: reply,
      },
    ]);
    setCounterInput('');
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-mobile-nav">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <Flame className="w-4 h-4" />
          <span>
            {language === 'fr'
              ? 'Arène de Négociation en Direct'
              : language === 'zh'
              ? 'AI机构合伙人实战博弈'
              : 'Live Institutional VC Negotiation Simulator'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-text-primary dark:text-stone-100 mt-1">
          {language === 'fr'
            ? 'Négociez Votre Term Sheet Face au Fonds'
            : language === 'zh'
            ? '意向书实战交锋：博弈合伙人'
            : 'AI Term Sheet Showdown'}
        </h1>
        <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 max-w-2xl">
          {language === 'fr'
            ? 'Affrontez Marcus Vance, associé directeur chez Horizon Capital. Maniez questions calibrées, compromis sur la gouvernance et arbitrage valorisation.'
            : language === 'zh'
            ? '直面地平线资本管理合伙人Marcus Vance的强势发难。运用校准型提问、治理权交换与估值对弈，争取最清洁的投资条款。'
            : 'Counter predatory terms, neutralize exploding deadlines, and defend founder control using tactical empathy.'}
        </p>
      </div>

      {/* Deal Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Founder Equity & Health Score */}
        <div className="p-4 rounded-xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs">
          <div className="flex justify-between items-center text-xs font-mono mb-1">
            <span className="text-text-secondary dark:text-stone-400">
              {language === 'fr' ? 'Qualité du Deal (Fondateur)' : language === 'zh' ? '创始人权益健康度' : 'Founder Deal Quality Score'}
            </span>
            <span className={`font-bold ${dealScore > 65 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {dealScore}%
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${dealScore > 65 ? 'bg-emerald-600' : 'bg-amber-600'}`}
              style={{ width: `${dealScore}%` }}
            />
          </div>
          <p className="text-[11px] text-text-secondary mt-1">
            {dealScore > 75
              ? '✅ Clean NVCA terms with protected governance.'
              : '⚠️ Watch out: participating liquidation or board overreach remains.'}
          </p>
        </div>

        {/* Investor Acceptance Probability */}
        <div className="p-4 rounded-xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs">
          <div className="flex justify-between items-center text-xs font-mono mb-1">
            <span className="text-text-secondary dark:text-stone-400">
              {language === 'fr' ? 'Probabilité de Signature VC' : language === 'zh' ? '资方签署接受概率' : 'Investor Willingness to Sign'}
            </span>
            <span className={`font-bold ${investorAcceptance > 50 ? 'text-blue-600' : 'text-rose-600'}`}>
              {investorAcceptance}%
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${investorAcceptance > 50 ? 'bg-blue-600' : 'bg-rose-600'}`}
              style={{ width: `${investorAcceptance}%` }}
            />
          </div>
          <p className="text-[11px] text-text-secondary mt-1">
            {investorAcceptance > 60
              ? 'Market-aligned offer. Partner is ready to seek investment committee signoff.'
              : 'Partner feels pushed too far. Risk of walking away.'}
          </p>
        </div>
      </div>

      {/* Main Negotiation Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat / Dialogue Interface (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[520px] rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 overflow-hidden shadow-xs">
          {/* Partner Header */}
          <div className="px-5 py-3 border-b border-border-main dark:border-stone-800 bg-surface-muted/50 dark:bg-stone-800/50 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-200 flex items-center justify-center font-bold text-xs">
                MV
              </div>
              <div>
                <span className="font-bold text-text-primary dark:text-stone-100 block">
                  Marcus Vance
                </span>
                <span className="text-[11px] text-text-secondary dark:text-stone-400">
                  Managing Partner, Horizon Capital ($250M Fund)
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
              Live Negotiation
            </span>
          </div>

          {/* Transcript Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'founder' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'founder'
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : 'bg-surface-muted dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-tl-xs border border-border-main dark:border-stone-700'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Calibrated Tactic Quick-Triggers */}
          <div className="p-3 border-t border-border-main dark:border-stone-800 bg-surface-muted/30 dark:bg-stone-800/30 flex space-x-2 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() =>
                handleSendCounter(
                  language === 'fr'
                    ? 'Comment notre prochain tour en Série B réagira-t-il face à une préférence participante de 1x qui diverge des standards NVCA ?'
                    : language === 'zh'
                    ? '下一轮机构领投方如果看到非标的参与型清算优先权，将如何影响我们获得顶级估值？'
                    : 'How will our future Series B lead price the stock with a non-standard participating preference overhang?'
                )
              }
              className="px-3 py-1.5 rounded-lg bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all"
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
              className="px-3 py-1.5 rounded-lg bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-700 hover:border-emerald-500 whitespace-nowrap text-text-secondary hover:text-text-primary transition-all"
            >
              ⚖️ Propose 2-2-1 Balanced Board
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-border-main dark:border-stone-800 flex items-center space-x-2">
            <input
              type="text"
              value={counterInput}
              onChange={(e) => setCounterInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCounter()}
              placeholder={
                language === 'fr'
                  ? 'Tapez votre contre-argument ou formulez une question calibrée...'
                  : language === 'zh'
                  ? '输入你的谈判反驳陈述或校准型提问...'
                  : 'Type calibrated counter-offer or question to Marcus Vance...'
              }
              className="flex-1 px-3 py-2 rounded-xl bg-surface-muted dark:bg-stone-800 border border-border-main dark:border-stone-700 text-xs text-text-primary dark:text-stone-100 focus:outline-emerald-500"
            />
            <button
              onClick={() => handleSendCounter()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Deal Term Sheet Sheet (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs space-y-5 text-xs">
          <h3 className="font-bold text-sm text-text-primary dark:text-stone-100 flex items-center justify-between">
            <span>Live Term Sheet Terms</span>
            <span className="font-mono text-emerald-600 font-bold">
              Pre: {formatMoney(valuation)}
            </span>
          </h3>

          {/* Term 1: Valuation slider */}
          <div>
            <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
              Pre-Money Valuation: <strong className="text-text-primary dark:text-stone-100">{formatMoney(valuation)}</strong>
            </label>
            <input
              type="range"
              min="8000000"
              max="18000000"
              step="500000"
              value={valuation}
              onChange={(e) => setValuation(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Term 2: Liquidation Preference */}
          <div>
            <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
              Liquidation Preference Clause:
            </label>
            <div className="space-y-1.5 font-mono">
              {[
                { id: '1x_np', label: '1x Non-Participating (Clean Standard)', clean: true },
                { id: '1x_part', label: '1x Participating (VC Predator Trap)', clean: false },
                { id: '2x_np', label: '2x Non-Participating (Downside heavy)', clean: false },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPrefType(p.id as any)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg border text-[11px] transition-all ${
                    prefType === p.id
                      ? p.clean
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                      : 'bg-surface-muted dark:bg-stone-800 border-border-main dark:border-stone-700 text-text-secondary'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Term 3: Board Composition */}
          <div>
            <label className="block text-text-secondary dark:text-stone-400 font-mono mb-1">
              Board of Directors Architecture:
            </label>
            <div className="space-y-1.5 font-mono">
              {[
                { id: 'founder_control', label: '2 Founders, 1 Preferred (Founder Control)' },
                { id: 'balanced', label: '2 Founders, 2 Preferred, 1 Independent (Balanced)' },
                { id: 'investor_control', label: '2 Preferred, 1 Founder (Investor Control ⚠️)' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBoardType(b.id as any)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg border text-[11px] transition-all ${
                    boardType === b.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'bg-surface-muted dark:bg-stone-800 border-border-main dark:border-stone-700 text-text-secondary'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
