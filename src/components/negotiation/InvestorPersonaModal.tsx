import React from 'react';
import {
  X,
  ShieldAlert,
  Brain,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Scale,
  Sparkles,
  Building2,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INVESTOR_PERSONAS, InvestorPersona } from '../../data/investorPersonasData';

interface InvestorPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersonaId: string;
  onSelectPersona: (persona: InvestorPersona) => void;
}

export const InvestorPersonaModal: React.FC<InvestorPersonaModalProps> = ({
  isOpen,
  onClose,
  selectedPersonaId,
  onSelectPersona,
}) => {
  const { language, formatMoney } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl bg-[#0B0F19] border border-amber-400/30 shadow-[0_24px_70px_rgba(0,0,0,0.85)] text-stone-100 p-5 sm:p-7 md:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
            <Brain className="w-4 h-4" />
            <span>
              {language === 'fr'
                ? 'Base de Données des Personas Investisseurs'
                : language === 'zh'
                ? '风投合伙人人格画像与心理学数据库'
                : 'Investor Personas & Psychological Database'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white">
            {language === 'fr'
              ? 'Choisissez Votre Adversaire de Négociation'
              : language === 'zh'
              ? '选择你的博弈对手 · 六大经典创投性格画像'
              : 'Select Your VC Counterpart · 6 Institutional Archetypes'}
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
            {language === 'fr'
              ? 'Chaque associé incarne une psychologie, un mandat de fonds et des tactiques de pression spécifiques. Choisissez un profil pour adapter votre empathie tactique.'
              : language === 'zh'
              ? '每位机构合伙人拥有截然不同的基金体量、心理弱点、施压套路与让步底线。深入剖析其心理X光画像，运用针对性的战术同理心破局。'
              : 'Every partner carries a distinct fund mandate, core fear, pressure playbook, and concession boundary. Select an adversary to train tactical empathy.'}
          </p>
        </div>

        {/* 6 Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INVESTOR_PERSONAS.map((persona) => {
            const isSelected = persona.id === selectedPersonaId;

            return (
              <div
                key={persona.id}
                onClick={() => {
                  onSelectPersona(persona);
                  onClose();
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-[#101524] border-stone-800 hover:border-amber-400/50 hover:bg-[#141b2e]'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Avatar + Name + Firm */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-800 shrink-0 border border-stone-700">
                        <img
                          src={persona.avatarUrl}
                          alt={persona.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            // Fallback to initials if image not present
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-amber-300 bg-[#161c2d]">
                          {persona.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {persona.name}
                        </h4>
                        <div className="text-[11px] text-stone-400 font-mono">
                          {persona.firm} · <span className="text-amber-400/90">{persona.aum}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Archetype & Badge */}
                  <div>
                    <div className="text-xs font-semibold text-amber-300">
                      {persona.archetype[language]}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {persona.badgeTitle[language]}
                    </div>
                  </div>

                  {/* Motivation */}
                  <div className="p-3 rounded-xl bg-black/40 border border-stone-800/80 text-[11px] text-stone-300 leading-relaxed">
                    <strong className="text-amber-400 block text-[10px] uppercase font-mono mb-0.5">
                      {language === 'fr' ? 'Motivation Première' : language === 'zh' ? '核心动机' : 'Core Motivation'}
                    </strong>
                    {persona.psychologicalProfile.coreMotivation[language]}
                  </div>

                  {/* Pressure Tactics */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold block">
                      {language === 'fr' ? 'Tactiques de Pression' : language === 'zh' ? '施压杀招' : 'Pressure Tactics'}
                    </span>
                    <ul className="space-y-0.5 text-[10px] text-stone-400 font-mono">
                      {persona.psychologicalProfile.pressureTactics.map((tactic, tIdx) => (
                        <li key={tIdx} className="flex items-center space-x-1.5 truncate">
                          <span className="text-rose-500 shrink-0">⚠️</span>
                          <span className="truncate">{tactic[language]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Starting Deal Quick-Stats */}
                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Offer Pre</span>
                    <strong className="text-emerald-400">{formatMoney(persona.startingTerms.valuation)}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block">Check</span>
                    <strong className="text-blue-400">{formatMoney(persona.startingTerms.checkSize)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-stone-400 font-mono">
          <span>
            {language === 'fr'
              ? 'Cliquez sur une carte pour charger instantanément ses termes et sa personnalité.'
              : language === 'zh'
              ? '点击任意卡片即可一键加载对应的条款草案、谈判口吻与心理交锋逻辑。'
              : 'Click any persona card to load their term sheet offer, negotiation tone, and psychological profile.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-mono transition-colors"
          >
            {language === 'fr' ? 'Fermer' : language === 'zh' ? '完成选择' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
