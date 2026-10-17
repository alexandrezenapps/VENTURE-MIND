import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  Compass,
  Eye,
  Ear,
  Scale,
  Shield,
  Award,
  AlertTriangle,
  Zap,
  HeartHandshake,
  Volume2,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  psychologyPrinciples,
  psychologyCategoriesMeta,
} from '../../data/psychologyData';
import { PsychologyCategory, PsychologyPrinciple } from '../../types';

export const PsychologyView: React.FC = () => {
  const { language, speak, progress } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<PsychologyCategory | 'all'>('all');
  const [selectedPrinciple, setSelectedPrinciple] = useState<PsychologyPrinciple>(psychologyPrinciples[0]);
  const [search, setSearch] = useState('');

  // Interactive Radar Diagnostic state
  const [radarScores, setRadarScores] = useState({
    composure: 85,
    batnaFirmness: 78,
    sunkCostDefense: 90,
    framingPower: 82,
    objectionHandling: 88,
  });

  const categories = Object.keys(psychologyCategoriesMeta) as PsychologyCategory[];

  const filteredPrinciples = psychologyPrinciples.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name[language].toLowerCase().includes(q);
      const matchDef = p.definition[language].toLowerCase().includes(q);
      return matchName || matchDef;
    }
    return true;
  });

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-mobile-nav">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <Brain className="w-4 h-4" />
          <span>
            {language === 'fr'
              ? 'Science Comportementale & Négociation Éthique'
              : language === 'zh'
              ? '行为心理学与伦理谈判战术'
              : 'Behavioral Science & Ethical Deal Negotiation'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-text-primary dark:text-stone-100 mt-1">
          {language === 'fr'
            ? 'Radar Psychologique & 100 Principes de Négociation'
            : language === 'zh'
            ? '心理雷达与100项博弈心法'
            : 'Psychology Radar & 100 Negotiation Principles'}
        </h1>
        <p className="text-xs text-text-secondary dark:text-stone-400 mt-1 max-w-3xl leading-relaxed">
          {language === 'fr'
            ? 'Les décisions d’investissement se négocient entre êtres humains soumis aux biais, à la rareté et au mimétisme. Maîtrisez le calme, le cadrage et l’éthique.'
            : language === 'zh'
            ? '风投交易从本质上是充满信息不对称、认知偏差与从众效应的人性较量。掌握情绪自控、价值重构与商业信誉护城河。'
            : 'Venture investments are closed between human actors driven by heuristics, scarcity, and social proof. Master self-regulation, objective framing, and ethical sovereignty.'}
        </p>
      </div>

      {/* Psychology Radar Interactive Diagnostic Tool */}
      <div className="p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold font-heading text-text-primary dark:text-stone-100 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>
                {language === 'fr'
                  ? 'Audit Diagnostic du Radar Psychologique'
                  : language === 'zh'
                  ? '心理韧性与博弈雷达诊断'
                  : 'Psychology Radar Diagnostic'}
              </span>
            </h2>
            <p className="text-xs text-text-secondary dark:text-stone-400">
              {language === 'fr'
                ? 'Évaluez votre posture mentale et détectez vos vulnérabilités avant la réunion de term sheet'
                : language === 'zh'
                ? '在签署排他协议前，全面诊断团队的情绪定力与谈判底牌抗压值'
                : 'Benchmark your behavioral resilience and spot personal vulnerabilities before closing meetings'}
            </p>
          </div>
          <div className="text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800">
            {language === 'fr' ? 'Indice de Résilience :' : language === 'zh' ? '综合抗压指数：' : 'Resilience Index:'}{' '}
            <strong className="text-sm">
              {Math.round(
                (radarScores.composure +
                  radarScores.batnaFirmness +
                  radarScores.sunkCostDefense +
                  radarScores.framingPower +
                  radarScores.objectionHandling) /
                  5
              )}
              %
            </strong>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-text-primary dark:text-stone-200">
                  {language === 'fr' ? 'Sang-froid (Pause 4s)' : language === 'zh' ? '冷静自持力 (4秒静默)' : 'Valuation Haircut Composure'}
                </span>
                <span className="text-purple-600 font-bold">{radarScores.composure}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={radarScores.composure}
                onChange={(e) =>
                  setRadarScores((prev) => ({ ...prev, composure: Number(e.target.value) }))
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-text-primary dark:text-stone-200">
                  {language === 'fr' ? 'Solidité du BATNA' : language === 'zh' ? '备选底牌坚韧度 (BATNA)' : 'BATNA Walk-Away Firmness'}
                </span>
                <span className="text-purple-600 font-bold">{radarScores.batnaFirmness}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={radarScores.batnaFirmness}
                onChange={(e) =>
                  setRadarScores((prev) => ({ ...prev, batnaFirmness: Number(e.target.value) }))
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-text-primary dark:text-stone-200">
                  {language === 'fr' ? 'Défense Coûts Irrécupérables' : language === 'zh' ? '沉没成本抵御力' : 'Sunk Cost Trap Defense'}
                </span>
                <span className="text-purple-600 font-bold">{radarScores.sunkCostDefense}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={radarScores.sunkCostDefense}
                onChange={(e) =>
                  setRadarScores((prev) => ({ ...prev, sunkCostDefense: Number(e.target.value) }))
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-text-primary dark:text-stone-200">
                  {language === 'fr' ? 'Puissance du Cadrage' : language === 'zh' ? '价值叙事重构力' : 'Strategic Narrative Framing'}
                </span>
                <span className="text-purple-600 font-bold">{radarScores.framingPower}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={radarScores.framingPower}
                onChange={(e) =>
                  setRadarScores((prev) => ({ ...prev, framingPower: Number(e.target.value) }))
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Diagnostic Recommendation Insight */}
          <div className="p-4 rounded-xl bg-surface-muted dark:bg-stone-800/60 border border-border-main dark:border-stone-700 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold block mb-1">
                {language === 'fr' ? 'Diagnostic Immédiat' : language === 'zh' ? '战术体检建议' : 'Actionable Recommendation'}
              </span>
              <p className="text-xs text-text-secondary dark:text-stone-300 leading-relaxed">
                {radarScores.batnaFirmness < 70
                  ? language === 'fr'
                    ? 'Attention : Votre point de repli est trop fragile. Sécurisez un bridge d’angels avant de négocier la term sheet.'
                    : language === 'zh'
                    ? '警报：当前备选底线偏弱。在签署排他条款前，务必先从老股东处锁定过桥意向函。'
                    : 'Caution: Walk-away leverage is vulnerable. Secure a non-dilutive grant or angel bridge before locking exclusivity.'
                  : language === 'fr'
                  ? 'Excellente assise. Vous pouvez refuser les clauses de préférence participantes avec sérénité.'
                  : language === 'zh'
                  ? '底牌扎实。完全具备底气从容否决任何非标参与型清算优先权。'
                  : 'High leverage profile. You are well-positioned to reject non-market participating preferences.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Domains Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-surface-muted dark:bg-stone-800 text-text-secondary dark:text-stone-400 hover:text-text-primary'
          }`}
        >
          {language === 'fr' ? 'Tous les domaines' : language === 'zh' ? '全领域' : 'All Domains'}
        </button>
        {categories.map((catKey) => {
          const meta = psychologyCategoriesMeta[catKey];
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === catKey
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-surface-muted dark:bg-stone-800 text-text-secondary dark:text-stone-400 hover:text-text-primary'
              }`}
            >
              {meta[language]}
            </button>
          );
        })}
      </div>

      {/* Main Principle Showcase & Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Principle Selector List (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filteredPrinciples.map((principle) => {
            const isSelected = selectedPrinciple.id === principle.id;
            return (
              <div
                key={principle.id}
                onClick={() => setSelectedPrinciple(principle)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-500/10 dark:bg-purple-950/40 border-purple-500/50 shadow-xs'
                    : 'bg-surface-main dark:bg-stone-900 border-border-main dark:border-stone-800 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary dark:text-stone-400 mb-1">
                  <span>Principle #{principle.number}</span>
                  <span className="uppercase text-purple-600 dark:text-purple-400 font-semibold">
                    {principle.category}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-text-primary dark:text-stone-100">
                  {principle.name[language]}
                </h4>
                <p className="text-xs text-text-secondary dark:text-stone-400 line-clamp-2 mt-1">
                  {principle.definition[language]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Principle Breakdown (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-main dark:bg-stone-900 border border-border-main dark:border-stone-800 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold mb-1">
                Rule #{selectedPrinciple.number} • {selectedPrinciple.category}
              </div>
              <h2 className="text-xl font-bold font-heading text-text-primary dark:text-stone-100">
                {selectedPrinciple.name[language]}
              </h2>
            </div>
            <button
              onClick={() =>
                speak(
                  `${selectedPrinciple.name[language]}. ${selectedPrinciple.definition[language]}`
                )
              }
              className="p-2 rounded-xl bg-surface-muted dark:bg-stone-800 text-purple-600 dark:text-purple-400 hover:scale-105 transition-all"
              title="Pronounce tactic"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Definition */}
          <p className="text-xs md:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {selectedPrinciple.definition[language]}
          </p>

          {/* Scenario In Action */}
          <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 text-xs">
            <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">
              {language === 'fr'
                ? 'Confrontation en Réunion VC :'
                : language === 'zh'
                ? '高压谈判实况模拟：'
                : 'VC Meeting Confrontation:'}
            </span>
            <p className="italic text-purple-950 dark:text-purple-200">
              "{selectedPrinciple.fundraisingScenario[language]}"
            </p>
          </div>

          {/* Constructive Use vs Misuse Warning Guardrail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-800 dark:text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'fr'
                    ? 'Usage Éthique Constructif'
                    : language === 'zh'
                    ? '正向伦理实战运用'
                    : 'Constructive Ethical Execution'}
                </span>
              </div>
              <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed">
                {selectedPrinciple.constructiveUse[language]}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
              <div className="flex items-center space-x-1.5 font-bold text-rose-800 dark:text-rose-400 mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>
                  {language === 'fr'
                    ? 'Garde-Fou & Risque d’Abus'
                    : language === 'zh'
                    ? '伦理警示与操纵红线'
                    : 'Guardrail & Anti-Coercion'}
                </span>
              </div>
              <p className="text-rose-950 dark:text-rose-200 leading-relaxed">
                {selectedPrinciple.misuseWarning[language]}
              </p>
            </div>
          </div>

          {/* Reflection Question */}
          <div className="p-4 rounded-xl bg-surface-muted dark:bg-stone-800/60 border border-border-main dark:border-stone-700 text-xs">
            <span className="font-mono text-[10px] uppercase font-bold text-text-secondary dark:text-stone-400 block mb-1">
              {language === 'fr' ? 'Question d’Auto-Évaluation' : language === 'zh' ? '战略自省发问' : 'Strategic Self-Inquiry'}
            </span>
            <p className="font-medium text-text-primary dark:text-stone-100">
              {selectedPrinciple.reflectionPrompt[language]}
            </p>
          </div>

          {/* Actionable Exercise */}
          <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs">
            <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
              {language === 'fr' ? 'Exercice Pratique d’Entraînement' : language === 'zh' ? '刻意练习任务' : 'Deliberate Practice Task'}
            </span>
            <p className="text-text-primary dark:text-stone-200">
              {selectedPrinciple.exercise[language]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
