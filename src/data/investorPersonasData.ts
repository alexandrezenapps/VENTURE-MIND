import { LocalizedString } from '../types';

export type NegotiationStyle = 
  | 'aggressive_dominance' 
  | 'governance_hawk' 
  | 'blitzscaling_whale' 
  | 'forensic_quant' 
  | 'founder_friendly_empath' 
  | 'strategic_cvc';

export interface InvestorPersona {
  id: string;
  name: string;
  firm: string;
  avatarUrl: string;
  role: LocalizedString;
  archetype: LocalizedString;
  negotiationStyle: NegotiationStyle;
  badgeTitle: LocalizedString;
  aum: string;
  stageFocus: string;
  psychologicalProfile: {
    coreMotivation: LocalizedString;
    weaknessOrFear: LocalizedString;
    pressureTactics: LocalizedString[];
    preferredCounters: LocalizedString[];
  };
  startingTerms: {
    valuation: number;
    checkSize: number;
    prefType: '1x_np' | '1x_part' | '2x_np';
    boardType: 'founder_control' | 'balanced' | 'investor_control';
    optionPool: number;
    specialClause?: LocalizedString;
  };
  dialogueSamples: {
    openingPitch: LocalizedString;
    calibratedPushbackResponse: LocalizedString;
    aggressivePushbackResponse: LocalizedString;
    concessionAccepted: LocalizedString;
    walkAwayWarning: LocalizedString;
  };
  tacticalEmpathyTip: LocalizedString;
}

export const INVESTOR_PERSONAS: InvestorPersona[] = [
  {
    id: 'marcus_vance',
    name: 'Marcus Vance',
    firm: 'Horizon Capital',
    avatarUrl: '/src/assets/images/game_adversary_partner_1793030978874.jpg',
    role: {
      en: 'Managing General Partner',
      fr: 'Associé Gérant Directeur',
      zh: '主管合伙人',
    },
    archetype: {
      en: 'The Institutional Shark',
      fr: 'Le Requin Institutionnel',
      zh: '铁面机构捕食者',
    },
    negotiationStyle: 'aggressive_dominance',
    badgeTitle: {
      en: 'Pressure & Anchor Specialist',
      fr: 'Spécialiste de la Pression et de l’Ancrage',
      zh: '极限低锚与倒计时施压专家',
    },
    aum: '$1.4B AUM',
    stageFocus: 'Series A / Growth',
    psychologicalProfile: {
      coreMotivation: {
        en: 'Maximizing ownership percentage (20%+) while locking in downside insurance through participating liquidation.',
        fr: 'Maximiser le pourcentage de capital (20%+) tout en verrouillant une assurance avec une préférence participante.',
        zh: '通过低估值锚定夺取20%以上绝对股权，并用附带参与型清算为基金构筑下行保底。',
      },
      weaknessOrFear: {
        en: 'Fear of missing out (FOMO) to a top-tier peer fund like Sequoia or Benchmark, and losing a category-defining deal.',
        fr: 'Peur de rater le tour au profit d’un concurrent de premier rang (FOMO) sur un deal majeur.',
        zh: '极度恐惧错过（FOMO），害怕同行顶级基金（如红杉、Benchmark）以更清洁条款截胡独角兽。',
      },
      pressureTactics: [
        { en: '24-hour artificial exploding deadline', fr: 'Compte à rebours 24h artificiel', zh: '24小时虚假倒计时逼签' },
        { en: 'Low-ball pre-money valuation anchor', fr: 'Ancrage de valorisation très bas', zh: '极低投前估值锚定压迫' },
        { en: '1x Participating poison pill', fr: 'Préférence 1x participante toxique', zh: '1倍附带参与清算优先权毒丸' },
      ],
      preferredCounters: [
        { en: 'Calibrated "How" questions', fr: 'Questions calibrées en "Comment"', zh: '校准型提问（"这如何保证下轮领投顺畅？"）' },
        { en: 'Mentioning active peer term sheets', fr: 'Mentionner d’autres offres actives', zh: '暗示正在推进其他一线机构竞价协议' },
        { en: 'Trading valuation for clean governance', fr: 'Échanger la valo contre une gouvernance propre', zh: '以合理估值让步换取无毒丸清洁条款' },
      ],
    },
    startingTerms: {
      valuation: 12000000,
      checkSize: 3000000,
      prefType: '1x_part',
      boardType: 'investor_control',
      optionPool: 15,
      specialClause: {
        en: 'Exploding Deadline: 48 hours to sign, or offer is permanently revoked.',
        fr: 'Délai d’explosion : 48 heures pour signer, sinon offre révoquée.',
        zh: '引爆条款：48小时内必须签署，逾期永久撤回。',
      },
    },
    dialogueSamples: {
      openingPitch: {
        en: 'Look, we love the tech, but macro multiples have compressed. Our terms are firm: $12M pre-money, 1x participating liquidation preference, and two investor board seats. We need a signature within 48 hours.',
        fr: 'Écoutez, nous adorons la tech, mais ce marché est gelé. Notre offre est ferme : 12 M$ pré-money, 1x participante, et 2 sièges pour nous au conseil. Vous avez 48 heures pour signer.',
        zh: '我们非常认可你们的技术壁垒，但眼下大环境处于严冬。我们的最终条件：1200万美元投前估值，1倍参与型清算优先权，资方占2个董事席位。48小时内签署有效。',
      },
      calibratedPushbackResponse: {
        en: 'Fair point regarding Series B friction. If we drop the participating preference to clean 1x non-participating, you must accept a balanced 2-2-1 board with a neutral industry independent.',
        fr: 'Vous marquez un point sur les futurs tours. Si nous retirons la préférence participante pour revenir à une 1x non-participante standard, vous devez accepter le conseil équilibré 2-2-1 avec un indépendant neutre.',
        zh: '你说得有道理，非标参与权确实可能阻碍下一轮领投。如果我们将清算条款调整为标准的1倍非参与型，你们必须同意设立2-2-1制衡董事会（含1名独立中立董事）。',
      },
      aggressivePushbackResponse: {
        en: 'That valuation is divorced from your trailing ARR. If you push for $18M without the metrics to back it up, we will deploy this check into your top competitor by Friday.',
        fr: 'Cette valorisation est déconnectée de vos métriques. Si vous exigez 18 M$ sans chiffres, nous investirons chez votre concurrent d’ici vendredi.',
        zh: '这个估值脱离了你们过去12个月的ARR数据。如果缺乏指标支撑还要硬要1800万，我们周五前就会把这张支票开给你们的主要竞品。',
      },
      concessionAccepted: {
        en: 'Agreed. We will strike the participating clause and settle at $14M Pre-Money with standard NVCA rights. Let us draft the definitive agreement.',
        fr: 'D’accord. Nous biffons la clause participante et signons à 14 M$ Pré-Money selon les standards NVCA. Préparons les statuts définitifs.',
        zh: '成交。我们划掉参与型清算条款，锁定1400万美元投前估值与标准NVCA条款。让律师出正式投资协议吧。',
      },
      walkAwayWarning: {
        en: 'We are reaching an impasse. If we cannot find alignment on board governance within the next hour, Horizon Capital will formally withdraw our term sheet.',
        fr: 'Nous arrivons à une impasse. Sans accord sur la gouvernance dans l’heure, Horizon Capital retirera formellement son offre.',
        zh: '谈判已逼近死局。如果未来一小时内无法在董事会席位上达成一致，地平线资本将正式收回投资意向书。',
      },
    },
    tacticalEmpathyTip: {
      en: 'Do not debate his aggressive numbers. Use label empathy: "It sounds like Horizon has fiduciary duties to protect downstream capital." Then counter with a 2-2-1 board.',
      fr: 'N’attaquez pas ses chiffres de front. Utilisez l’empathie tactique : "Il semble qu’Horizon ait l’obligation de protéger ses LPs." Puis proposez le 2-2-1.',
      zh: '切莫与他的傲慢情绪硬碰硬。使用战术同理心标签：“地平线显然需要对LP资金的安全边际负责”，随后抛出2-2-1中立董事方案置换利益。',
    },
  },
  {
    id: 'victoria_sterling',
    name: 'Victoria Sterling',
    firm: 'Sterling & Bourne Ventures',
    avatarUrl: '/src/assets/images/victoria_sterling_partner.jpg',
    role: {
      en: 'Senior Managing Partner',
      fr: 'Associée Directrice Senior',
      zh: '资深管理合伙人',
    },
    archetype: {
      en: 'The Governance Hawk',
      fr: 'Le Faucon de la Gouvernance',
      zh: '风控与公司治理铁鹰',
    },
    negotiationStyle: 'governance_hawk',
    badgeTitle: {
      en: 'Veto Rights & Fiduciary Purist',
      fr: 'Puriste Fiduciaire & Droits de Veto',
      zh: '董事会否决权与信托受托人',
    },
    aum: '$850M AUM',
    stageFocus: 'Early Series A / DeepTech',
    psychologicalProfile: {
      coreMotivation: {
        en: 'Protecting downside control. She is willing to pay a fair valuation, but demands extensive vetoes over CEO removal, M&A, and debt.',
        fr: 'Contrôler le risque de baisse. Prête à payer le prix, mais exige des vetos stricts sur la cession et la gestion.',
        zh: '对控股权与重大事项否决权极度敏感。估值可以谈，但在CEO任免、重大并购及债务上有绝对一票否决权。',
      },
      weaknessOrFear: {
        en: 'Unregulated founder rogue behavior, unauthorized cap table dilution, and loss of fiduciary oversight.',
        fr: 'Peur de la dérive non régulée des fondateurs et de la perte de contrôle fiduciaire.',
        zh: '恐惧创始人失控乱烧钱、未经许可的股权增发，以及失去对董事会决策的主导权。',
      },
      pressureTactics: [
        { en: 'Excessive negative covenants & vetoes', fr: 'Clauses négatives et vetos excessifs', zh: '层层嵌套的保护性否决权条款' },
        { en: 'Pre-money ESOP pool expansion (18%+)', fr: 'Création d’un pool ESOP démesuré (18%+)', zh: '强制要求在投前单设18%以上期权池' },
        { en: 'Vesting reset demands for co-founders', fr: 'Remise à zéro du vesting des fondateurs', zh: '要求既有创始人股权成熟期归零重新起算' },
      ],
      preferredCounters: [
        { en: 'Offering dual-class voting sunset trigger', fr: 'Clause d’extinction de vote double conditionnelle', zh: '设置特定业绩达标的超级投票权日落条款' },
        { en: 'Right-sizing the ESOP pool to a 12-month hiring plan', fr: 'Dimensionner le pool ESOP au plan de recrutement', zh: '出具详实的12-18个月招聘计划，压缩期权池比例' },
        { en: 'Adopting standard NVCA protective provisions', fr: 'Alignement strict sur les statuts NVCA standards', zh: '坚持采用美国NVCA标准正面清单，剔除私人特权' },
      ],
    },
    startingTerms: {
      valuation: 14500000,
      checkSize: 3500000,
      prefType: '1x_np',
      boardType: 'investor_control',
      optionPool: 18,
      specialClause: {
        en: 'Protective Veto: Investor sole veto on executive hiring, budget exceeding $100K, and patent licensing.',
        fr: 'Veto Protecteur : Veto exclusif sur les embauches de direction et dépenses de plus de 100 k$.',
        zh: '特别否决权：单笔超10万美元支出、核心高管招聘及专利授权享有单一否决权。',
      },
    },
    dialogueSamples: {
      openingPitch: {
        en: 'Valuation is merely optics; governance is perpetuity. We are prepared to offer $14.5M Pre-Money, clean 1x non-participating. However, we require standard fiduciary vetoes and an 18% unallocated option pool.',
        fr: 'La valorisation est éphémère ; la gouvernance est éternelle. Nous offrons 14,5 M$ Pré-Money propre en 1x non-participante, avec des vetos fiduciaires complets et 18 % d’ESOP.',
        zh: '估值不过是暂时的面子，治理架构才是基业长青的基石。我们愿意给出1450万美元投前估值，标准的1倍非参与优先股。但是，必须赋予资方全面的信托否决权，并在投前设立18%期权池。',
      },
      calibratedPushbackResponse: {
        en: 'I hear your concern about operational velocity. If we narrow our veto to genuine corporate transactions (M&A, liquidation, secondary sales), will you agree to an independent board seat filled jointly?',
        fr: 'Je comprends votre souci d’agilité. Si nous limitons le veto aux opérations majeures (fusions, ventes), acceptez-vous un siège indépendant nommé conjointement ?',
        zh: '我理解你对运营决策效率的担忧。如果我们把否决权范围严格限定在公司控制权变更（如并购、清算、老股转让），你是否同意共同推举一位中立行业专家出任独立董事？',
      },
      aggressivePushbackResponse: {
        en: 'Founders who reject prudent governance invariably invite disaster. Without these fiduciary safeguards, our investment committee will not sanction capital deployment.',
        fr: 'Les fondateurs qui rejettent une gouvernance prudente courent au désastre. Sans ces garde-fous, notre comité n’investira pas.',
        zh: '拒绝严谨公司治理的创始人，往往在规模化时走向灾难。若缺少这些关键信托风控机制，我们投委会绝不可能放款。',
      },
      concessionAccepted: {
        en: 'Your hiring budget model is well-reasoned. We will right-size the option pool to 12% and adopt standard NVCA protective provisions. We look forward to building together.',
        fr: 'Votre budget de recrutement est rigoureux. Nous abaissons le pool à 12 % et adoptons la liste NVCA standard. Bienvenue au portefeuille.',
        zh: '你的招聘薪酬测算模型非常扎实。我们同意将投前期权池缩减至12%，并全面采用NVCA标准保护条款。期待未来的携手共进。',
      },
      walkAwayWarning: {
        en: 'Refusing an independent audit and board representation is an insurmountable red flag for our partners. We may not be the right firm for you.',
        fr: 'Refuser un administrateur indépendant est un signal d’alarme rédhibitoire pour nous.',
        zh: '拒绝设立制衡型董事会与独立审计，在我们合伙人看来是不可接受的危险信号。我们可能并非彼此合适的对象。',
      },
    },
    tacticalEmpathyTip: {
      en: 'Acknowledge her institutional prestige: "We deeply value Sterling & Bourne’s fiduciary reputation." Then offer detailed Excel headcount projections to trim the 18% option pool down to 10-12%.',
      fr: 'Flattez son sérieux juridique : "Nous respectons infiniment la rigueur de votre maison." Puis démontrez chiffres à l’appui qu’un pool de 12 % suffit largement.',
      zh: '肯定其深厚的信托声誉：“我们非常重视贵机构三十年来严谨的风控口碑。”随后呈上未来12个月具体到人头的期权预算表，精准将18%期权池砍至10-12%。',
    },
  },
  {
    id: 'kenji_takahashi',
    name: 'Kenji Takahashi',
    firm: 'Apex Horizon Vision Fund',
    avatarUrl: '/src/assets/images/kenji_takahashi_partner.jpg',
    role: {
      en: 'Executive Investment Director',
      fr: 'Directeur Exécutif des Investissements',
      zh: '执行投资董事',
    },
    archetype: {
      en: 'The Blitzscaling Whale',
      fr: 'La Baleine du Blitzscaling',
      zh: '超级主权资本巨鳄',
    },
    negotiationStyle: 'blitzscaling_whale',
    badgeTitle: {
      en: 'Mega-Check & Super Pro-Rata',
      fr: 'Méga-Ticket & Super Pro-Rata',
      zh: '巨额注资与超额优先认购权',
    },
    aum: '$12B Mega-Fund',
    stageFocus: 'Late Series A / Category Leader',
    psychologicalProfile: {
      coreMotivation: {
        en: 'Drowning competitors in capital. He wants to write a check 3x bigger than asked ($8M instead of $3M) for 25% ownership.',
        fr: 'Écraser la concurrence par la masse de capital. Il veut tripler le montant du chèque pour obtenir 25 % du capital.',
        zh: '坚信资金规模就是护城河。宁可将融资金额从300万直接加码到800万甚至更高，但必须拿走25%以上大股权。',
      },
      weaknessOrFear: {
        en: 'Small thinking. He fears the company will remain a regional player instead of a global monopoly.',
        fr: 'Peur du manque d’ambition mondiale et de rester un acteur de niche régionale.',
        zh: '厌恶小家子气与保守稳健。害怕公司沦为区域性小而美生意，无法成长为千亿市值全球垄断平台。',
      },
      pressureTactics: [
        { en: 'Preemptive round size inflation ($8M+)', fr: 'Gonflement agressif du tour de table', zh: '单方面强行做大融资金额稀释老股东' },
        { en: 'Super pro-rata preemptive rights (1.5x)', fr: 'Super pro-rata écrasant les entrants futurs', zh: '索取1.5倍超额优先认购权锁定后轮' },
        { en: 'Threat of funding your global rival', fr: 'Menace de financer votre rival mondial', zh: '暗示会将巨量资本转投向全球主要竞争对手' },
      ],
      preferredCounters: [
        { en: 'Tranching the mega-check on international expansion', fr: 'Trancher le chèque sur l’expansion internationale', zh: '将超额资金与海外扩张里程碑挂钩，分期发放' },
        { en: 'Capping ownership at 20% by scaling Pre-Money', fr: 'Plafonner la part à 20 % en rehaussant le Pré', zh: '顺水推舟做大融资金额，但同步大幅拉高投前估值' },
        { en: 'Restricting super pro-rata to standard pro-rata', fr: 'Ramener le super pro-rata à la norme NVCA', zh: '将超额认购权限制在标准等比例认购（防止后续资方被排挤）' },
      ],
    },
    startingTerms: {
      valuation: 22000000,
      checkSize: 8000000,
      prefType: '1x_np',
      boardType: 'balanced',
      optionPool: 12,
      specialClause: {
        en: 'Super Pro-Rata: Right to acquire 150% of our pro-rata ownership in all subsequent financing rounds.',
        fr: 'Super Pro-Rata : Droit d’acquérir 150 % du pro-rata dans les tours ultérieurs.',
        zh: '超额优先认购权：在后续所有融资轮次中拥有150%超配认购权。',
      },
    },
    dialogueSamples: {
      openingPitch: {
        en: 'Why raise a meager $3M when $8M allows you to hire the top 50 AI researchers on Earth? We will price your round at $22M Pre-Money for an even 26% ownership. Let us build a monopoly.',
        fr: 'Pourquoi lever seulement 3 M$ quand 8 M$ vous permettent d’embaucher les 50 meilleurs ingénieurs IA du monde ? 22 M$ Pré-Money pour 26 %. Bâtissons un monopole.',
        zh: '既然800万美元能让你们一口气招募全球最顶尖的50位AI科学家，为什么还要小家子气地融300万？我们直接给2200万美元投前估值，拿26%股份。让我们一起建立垄断帝国。',
      },
      calibratedPushbackResponse: {
        en: 'You want to preserve cap table optionality for a Series B crossover fund—I respect that. What if we step up the valuation to $26M Pre-Money so our $8M check takes exactly 23.5%?',
        fr: 'Vous voulez garder de la place pour un fonds crossover en Série B. Si nous montons à 26 M$ Pré, nos 8 M$ ne prennent que 23,5 % ?',
        zh: '你想为后续进入的国际顶级对冲基金留足股权空间——我理解这个宏观考量。如果我们把投前估值上调至2600万美元，让800万注资刚好占股23.5%，你能接受吗？',
      },
      aggressivePushbackResponse: {
        en: 'If you refuse our speed and capital scale, understand that our mandate is to back the winner. If not you, we deploy $20M into your rival next Monday.',
        fr: 'Si vous refusez cette puissance de feu, nous investirons 20 M$ chez votre rival dès lundi prochain.',
        zh: '如果你们缺乏驾驭大规模资本的魄力，我们的使命是下注该赛道最终的唯一赢家。如果不是你们，下周一这笔2000万资金就会出现在你们竞品的账户里。',
      },
      concessionAccepted: {
        en: 'We accept standard pro-rata. We want you hungry and energized. Wire instructions confirmed for $8M at $25M Pre.',
        fr: 'Accordé pour le pro-rata standard. Nous voulons des fondateurs conquérants. C’est parti pour 8 M$ sur 25 M$ Pré.',
        zh: '同意放弃超额优先认购权，回归标准等比例认购。我们要的是一支充满野心但不受束缚的战队。以2500万投前、注资800万定稿。',
      },
      walkAwayWarning: {
        en: 'Capital is moving at light speed. We cannot wait through multi-week indecision while markets evolve.',
        fr: 'Le capital se déploie à la vitesse de la lumière. Nous ne tolérons pas les hésitations de plusieurs semaines.',
        zh: '时代资本的窗口转瞬即逝。我们无法等待数周的犹疑不决，而错失定义整个赛道的战略先机。',
      },
    },
    tacticalEmpathyTip: {
      en: 'Feed his grand vision: "We completely share your ambition for category dominance." Leverage his massive check to demand a much higher pre-money ($25M+), diluting founders less while securing runway.',
      fr: 'Nourrissez son rêve : "Nous visons l’hégémonie mondiale." Utilisez son gros chèque pour exiger une valorisation plus haute ($25M+).',
      zh: '顺应其宏大愿景：“我们完全认同以压倒性资本优势实现行业垄断的打法。”借力打力：既然你要投800万，就要求同步把投前推高到2500万美元以上，反向保护创始人稀释率。',
    },
  },
  {
    id: 'dr_arthur_chen',
    name: 'Dr. Arthur Chen',
    firm: 'Singularity Frontier Ventures',
    avatarUrl: '/src/assets/images/dr_arthur_chen_partner.jpg',
    role: {
      en: 'Founding Partner & Chief Scientist',
      fr: 'Associé Fondateur & Directeur Scientifique',
      zh: '管理合伙人兼首席科学家',
    },
    archetype: {
      en: 'The Forensic Quant',
      fr: 'Le Quant Médico-Légal',
      zh: '深度硬科技量化极客',
    },
    negotiationStyle: 'forensic_quant',
    badgeTitle: {
      en: 'Milestone Tranches & Unit Economics',
      fr: 'Tranches par Jalons & Économie Unitaire',
      zh: '里程碑分期打款与单元经济审计',
    },
    aum: '$450M DeepTech Fund',
    stageFocus: 'Seed / Series A Science & AI',
    psychologicalProfile: {
      coreMotivation: {
        en: 'De-risking scientific execution. He requires capital to be tranched against tangible technical and revenue milestones.',
        fr: 'Réduire le risque scientifique. Il exige de décaisser les fonds par tranches indexées sur des jalons.',
        zh: '以科研严谨性解构商业风险。要求将投资款拆解为2至3期，与实际技术指标及商业化节点深度绑定打款。',
      },
      weaknessOrFear: {
        en: 'Vaporware, unverified AI benchmarks, fabricated ARR, and high churn disguised as enterprise growth.',
        fr: 'Peur du vaporware, des benchmarks frelatés et du churn caché derrière la croissance faciale.',
        zh: '深恶痛绝PPT宣讲与概念炒作。恐惧技术伪命题、刷量ARR，以及高流失率被营销手段掩盖。',
      },
      pressureTactics: [
        { en: 'Tranched capital disbursement ($1.5M now, $1.5M on milestone)', fr: 'Financement par tranches conditionnelles', zh: '严苛的分期里程碑注资机制' },
        { en: 'Full-ratchet penalty if milestones are missed', fr: 'Full-ratchet en cas de retard de jalon', zh: '未达成技术指标即触发全面棘轮反稀释重锤' },
        { en: 'Intense forensic audit on gross margin & COGS', fr: 'Audit impitoyable des marges brutes', zh: '针对云算力成本与真实毛利率的解剖级盘查' },
      ],
      preferredCounters: [
        { en: 'Objective third-party benchmark criteria', fr: 'Critères de validation tiers indépendants', zh: '引入中立第三方机构评测标准作为技术门槛' },
        { en: 'Upfront capital release for core compute/GPU capex', fr: 'Déblocage initial pour les dépenses GPU critiques', zh: '证明算力集群采购需要前期一次性现金锁价' },
        { en: 'Replacing tranches with broad-based anti-dilution', fr: 'Substituer les tranches par du weighted-average', zh: '以标准的加权平均反稀释替换严苛的分期惩罚' },
      ],
    },
    startingTerms: {
      valuation: 11000000,
      checkSize: 3000000,
      prefType: '1x_np',
      boardType: 'balanced',
      optionPool: 10,
      specialClause: {
        en: 'Milestone Tranching: $1.5M at closing; $1.5M conditioned on achieving 99.5% model accuracy & $1.2M ARR within 9 months.',
        fr: 'Jalons : 1,5 M$ au closing ; 1,5 M$ conditionnés à 99,5 % de précision et 1,2 M$ d’ARR en 9 mois.',
        zh: '分期条款：交割日支付150万美元；剩余150万须在9个月内达成模型99.5%准确率及120万ARR方可解锁。',
      },
    },
    dialogueSamples: {
      openingPitch: {
        en: 'Your architecture has genuine novelty, but model training costs represent an unsustainable cash drag. We propose $11M Pre-Money, with $1.5M wired at close, and $1.5M released upon hitting production latency milestones.',
        fr: 'Votre architecture est innovante, mais vos coûts de calcul GPU sont exorbitants. 11 M$ Pré : 1,5 M$ au closing, 1,5 M$ aux jalons de latence.',
        zh: '你们的模型架构确实具有原创性，但训练与推理成本带来了极高的烧钱速率。我们开出1100万美元投前估值，首期交割150万，剩余150万待模型延迟指标验证达标后再行划拨。',
      },
      calibratedPushbackResponse: {
        en: 'Your hardware supplier data is rigorous. If vendor contracts require full upfront capital commitment, we can remove the revenue milestone and wire $2.5M upfront, keeping $500K for the enterprise pilot release.',
        fr: 'Vos contrats d’approvisionnement GPU sont solides. Si l’acompte est obligatoire, nous débloquons 2,5 M$ immédiatement.',
        zh: '你们出具的算力供应商年度锁价合同非常具有说服力。如果预订集群确需全额预付，我们可以取消商业化收入门槛，首期打款提升至250万美元。',
      },
      aggressivePushbackResponse: {
        en: 'Hype does not offset negative gross margins. If you cannot mathematically prove 70%+ gross margin at scale, this valuation is uninvestable.',
        fr: 'Le battage médiatique ne compense pas une marge brute négative. Prouvez mathématiquement vos 70 % de marge.',
        zh: '故事讲得再动听，也无法弥补负毛利的硬伤。如果不能用数学逻辑证明规模化后毛利率能达到70%以上，这笔估值毫无投资合理性。',
      },
      concessionAccepted: {
        en: 'Your unit economics cohort proves the flywheel. We will fund the full $3.0M upfront at a revised $13.0M Pre-Money. Clean broad-based weighted average terms.',
        fr: 'Vos cohortes démontrent la rentabilité unitaire. 3,0 M$ en un seul versement sur 13,0 M$ Pré-Money propre.',
        zh: '你们的用户群组留存与算力摊薄曲线印证了飞轮效应。我们同意一次性划拨全额300万美元，投前估值上调至1300万美元，并适用标准的加权平均反稀释。',
      },
      walkAwayWarning: {
        en: 'Science requires reproducible data. Refusing technical milestone verification undermines our core investment thesis.',
        fr: 'La science exige des données reproductibles. Refuser les jalons techniques brise notre thèse.',
        zh: '科学探索必须依托可复现的数据。若拒绝接受客观技术节点验收，便违背了我们硬科技基金的核心投资逻辑。',
      },
    },
    tacticalEmpathyTip: {
      en: 'Dr. Chen only respects mathematical rigor. Present a detailed unit-economics waterfall showing how GPU costs scale sublinearly with user volume. Disarm tranches by offering a technical advisory board seat.',
      fr: 'Le Dr. Chen ne jure que par les chiffres. Présentez un modèle montrant la baisse des coûts serveurs par palier.',
      zh: '面对陈博士，任何口才与心理战术都毫无意义，唯有硬核数学与真实数据能打动他。出示精密的边际算力成本递减曲线，并邀请其出任技术顾问委员会主席以化解分期打款要求。',
    },
  },
  {
    id: 'helena_lindqvist',
    name: 'Helena Lindqvist',
    firm: 'Nordic Valhalla Capital',
    avatarUrl: '/src/assets/images/helena_lindqvist_partner.jpg',
    role: {
      en: 'Founding General Partner',
      fr: 'Associée Fondatrice Principale',
      zh: '创始主管合伙人',
    },
    archetype: {
      en: 'The Founder-Friendly Empath',
      fr: 'L’Alliée Bienveillante des Fondateurs',
      zh: '长期主义创始人护航者',
    },
    negotiationStyle: 'founder_friendly_empath',
    badgeTitle: {
      en: 'Clean NVCA & Mission Alignment',
      fr: 'Standards NVCA Propres & Alignement Mission',
      zh: '纯净标准条款与使命共赢伙伴',
    },
    aum: '$600M European Impact Fund',
    stageFocus: 'Seed to Series A / Clean & AI',
    psychologicalProfile: {
      coreMotivation: {
        en: 'Backing ethical, resilient founders for decades. She rejects predatory poison pills and offers clean standard market terms.',
        fr: 'Accompagner des fondateurs éthiques sur 20 ans. Elle refuse les clauses toxiques et offre des statuts exemplaires.',
        zh: '推崇长期主义与可持续共赢。坚决反对一切破坏创始团队控制权的苛刻毒丸，恪守最干净的NVCA行业标准范本。',
      },
      weaknessOrFear: {
        en: 'Founder burnout, cultural toxicity, predatory secondary liquidation, and broken ethical trust.',
        fr: 'Peur du burnout des fondateurs, de la toxicité managériale et de la rupture de confiance.',
        zh: '最担忧创始团队内耗崩塌、企业文化毒性、短期套现套利，以及彼此之间信任基石的破裂。',
      },
      pressureTactics: [
        { en: 'Insisting on founder wellness & mental health stipend', fr: 'Imposer des engagements de santé mentale d’équipe', zh: '要求将部分融资专项用于团队心理弹性与身心健康' },
        { en: 'Broad ESG & environmental reporting covenants', fr: 'Clauses d’impact ESG et de gouvernance éthique', zh: '约定严格的环境与社会治理（ESG）年度披露要求' },
        { en: 'Modest valuation ceiling to ensure healthy Series B pricing', fr: 'Plafond de valorisation modéré pour protéger la Série B', zh: '主张理性估值，防止下一轮过早陷入降估值逆风（Down-round）' },
      ],
      preferredCounters: [
        { en: 'Demonstrating sustainable hiring culture', fr: 'Présenter une culture d’équipe durable', zh: '展示高人效、低流失率的自驱型组织文化' },
        { en: 'Accepting fair valuation in exchange for zero liquidation strings', fr: 'Accepter un prix juste contre zéro poison pill', zh: '以温和估值换取零清算特权、零排他性绑定的纯粹条款' },
        { en: 'Inviting her to take an active mentorship board observer role', fr: 'Lui confier un rôle d’observatrice conseil bienveillante', zh: '邀请其担任董事会观察员并主导战略顾问委员会' },
      ],
    },
    startingTerms: {
      valuation: 13500000,
      checkSize: 3000000,
      prefType: '1x_np',
      boardType: 'founder_control',
      optionPool: 10,
      specialClause: {
        en: 'Founder Protection Covenant: Clean 1x Non-Participating; Founders maintain 3 out of 4 voting seats.',
        fr: 'Pacte Protecteur Fondateurs : 1x Non-Participante propre ; 3 sièges sur 4 conservés par les fondateurs.',
        zh: '创始人保护盟约：标准的1倍非参与优先股，董事会4个席位中创始人保留3席绝对多数。',
      },
    },
    dialogueSamples: {
      openingPitch: {
        en: 'We don’t believe in manufactured 24-hour urgency or toxic liquidation preferences. We offer a fair $13.5M Pre-Money, clean 1x non-participating stock, and founder board control. Let us build something that endures.',
        fr: 'Nous refusons l’urgence artificielle et les pièges de liquidation. Nous proposons 13,5 M$ Pré-Money propre, 1x non-participante et contrôle fondateur.',
        zh: '我们绝不搞虚假的24小时逼签把戏，更不屑使用清算毒丸。我们给出公平的1350万美元投前估值，标准的1倍非参与优先股，并保障创始人的绝对控制权。让我们打造基业长青的伟大事业。',
      },
      calibratedPushbackResponse: {
        en: 'If you feel $15M better reflects your momentum with enterprise pilots, we can support that—provided we ensure the Series B bar remains achievable.',
        fr: 'Si vous estimez que 15 M$ reflète mieux vos pilotes grands comptes, nous vous suivons, pourvu que la Série B reste saine.',
        zh: '如果你确信1500万美元能更真实地反映企业级客户的交付进展，我们完全愿意支持——只要我们共同确保下轮融资的增长台阶健康可行。',
      },
      aggressivePushbackResponse: {
        en: 'Chasing an inflated $25M valuation from a predatory fund will only set you up for a catastrophic down-round next year. Long-term founders prioritize partners over headlines.',
        fr: 'Viser une valorisation gonflée auprès d’un fonds prédateur vous condamne à un down-round brutal. Privilégiez les partenaires aux gros titres.',
        zh: '向掠夺性机构索要虚高估值，只会为明年埋下一轮惨烈的降估值（Down-round）暴雷。真正成熟的创始人看重的是并肩作战的战友，而不是新闻通稿上的数字。',
      },
      concessionAccepted: {
        en: 'Splendid. We have a shared vision. We are wiring $3.5M at $14.5M Pre-Money with complete founder governance alignment.',
        fr: 'Magnifique. Nous partageons la même vision. 3,5 M$ sur 14,5 M$ Pré avec statuts NVCA propres signés.',
        zh: '非常愉快。我们的价值观高度一致。协议锁定在1450万美元投前估值，投资350万美元，签署纯正创始人友好型NVCA范本。',
      },
      walkAwayWarning: {
        en: 'If this partnership becomes purely transactional rather than mission-aligned, we may not be the optimal custodians for your cap table.',
        fr: 'Si cette alliance devient purement mercantile et perd son âme, nous préférons nous effacer.',
        zh: '如果这场携手最终沦为冷冰冰的短期数字博弈，失去了初心与价值观认同，我们愿意体面退后，祝福你们找到合适的资方。',
      },
    },
    tacticalEmpathyTip: {
      en: 'Do not play hardball or bluff with Helena; she detects insincerity instantly. Be transparent about your weaknesses and pitch: "We want an investor who stands by us when things get hard."',
      fr: 'Ne bluffez jamais avec Helena. Soyez d’une transparence totale sur vos défis et valorisez son soutien humain.',
      zh: '千万不要对海伦娜耍谈判手腕或虚张声势，她的敏锐直觉能瞬间识破虚伪。展现真诚与敬畏：“我们寻找的是逆境中与我们背靠背坚守的伙伴”，她会给予你最优质的商业资源与护航。',
    },
  },
  {
    id: 'devon_miller',
    name: 'Devon "Rex" Miller',
    firm: 'Omnicorp Strategic Ventures',
    avatarUrl: '/src/assets/images/devon_miller_cvc.jpg',
    role: {
      en: 'VP of Corporate Development & CVC',
      fr: 'Vice-Président Corp Dev & CVC',
      zh: '企业战略投资副总裁',
    },
    archetype: {
      en: 'The Strategic Trojan Horse',
      fr: 'Le Cheval de Troie Stratégique',
      zh: '战略生态特洛伊木马',
    },
    negotiationStyle: 'strategic_cvc',
    badgeTitle: {
      en: 'Distribution Power & Commercial ROFR Trap',
      fr: 'Puissance de Distribution & Piège de ROFR',
      zh: '分销渠道诱惑与先买权捆绑陷阱',
    },
    aum: '$2.5B Corporate Balance Sheet',
    stageFocus: 'Strategic Series A / B Ecosystem',
    psychologicalProfile: {
      coreMotivation: {
        en: 'Locking up technology exclusivity, blocking competitors (Google, Apple, Microsoft) from acquiring you, and securing IP access.',
        fr: 'Verrouiller l’exclusivité technologique, bloquer les rivaux et sécuriser un droit de rachat prioritaire.',
        zh: '通过战略投资锁定核心技术排他权，阻断竞对科技巨头收购，并暗中获取敏感产品与核心专利授权。',
      },
      weaknessOrFear: {
        en: 'Watching the startup get acquired by their arch-rival or signing an exclusive enterprise partnership with a competitor.',
        fr: 'Peur panique de voir votre startup rachetée par son ennemi juré sur le marché.',
        zh: '极度恐惧该初创公司被死对头巨头（如微软、苹果或谷歌）全资收购，成为刺向母公司的利刃。',
      },
      pressureTactics: [
        { en: 'Right of First Refusal (ROFR) on acquisition', fr: 'Droit de premier refus (ROFR) sur la vente', zh: '强制写入不可撤销的并购优先受让权（ROFR）' },
        { en: 'Exclusive commercial distribution lockup', fr: 'Exclusivité commerciale sur leur plateforme', zh: '要求排他性技术接口与独家渠道分销' },
        { en: 'Broad competitor information rights leakage', fr: 'Droits d’information étendus vers la maison-mère', zh: '要求穿透至业务细节的深度信息查阅权' },
      ],
      preferredCounters: [
        { en: 'Replacing ROFR with Right of First Notice (ROFN)', fr: 'Remplacer le ROFR par un simple ROFN (information)', zh: '将先买权（ROFR）降级为优先通知权（ROFN），消除并购毒丸' },
        { en: 'Carving out non-exclusive commercial agreements', fr: 'Exclure l’exclusivité commerciale des statuts', zh: '将商业合作从股权投资协议中剥离，保持中立多云架构' },
        { en: 'Strict firewall on confidential product roadmaps', fr: 'Cloisonnement strict contre les fuites vers la R&D interne', zh: '建立严格的合规防火墙，屏蔽与母公司研发重叠的商业机密' },
      ],
    },
    startingTerms: {
      valuation: 17000000,
      checkSize: 4500000,
      prefType: '1x_np',
      boardType: 'balanced',
      optionPool: 12,
      specialClause: {
        en: 'Strategic ROFR & Exclusivity: Omnicorp holds exclusive Right of First Refusal on any acquisition offer, plus 18-month competitor commercial exclusivity.',
        fr: 'ROFR & Exclusivité : Omnicorp détient un droit de premier refus sur la vente et 18 mois d’exclusivité commerciale.',
        zh: '战略特许：母公司享有独家先买权（ROFR），且被投企业18个月内不得与任何同业巨头签署商业协议。',
      },
    },
    dialogueSamples: {
      openingPitch: {
        en: 'We can deploy your API across 100 million Omnicorp enterprise devices by next month. We will price your round at a premium $17M Pre-Money. All we require is standard commercial platform exclusivity and an exit ROFR.',
        fr: 'Nous pouvons intégrer votre solution sur 100 millions d’appareils Omnicorp le mois prochain. Valorisation premium de 17 M$ Pré-Money. En échange : exclusivité commerciale et droit de premier refus.',
        zh: '下个月我们就能把你们的软件推送到全球1亿台母公司企业级终端上。我们甚至愿意溢价给出1700万美元投前估值。我们唯一的诉求：排他性商业合作以及未来的并购先买权（ROFR）。',
      },
      calibratedPushbackResponse: {
        en: 'You worry that a ROFR chills third-party M&A bids. How about this: we replace the ROFR with a 15-day Right of First Notice (ROFN), and our commercial partnership remains non-exclusive with tiered pricing?',
        fr: 'Vous craignez que le ROFR décourage les acheteurs. Remplaçons le ROFR par un préavis de 15 jours (ROFN), sans exclusivité stricte.',
        zh: '你担心ROFR条款会吓退其他潜在收购方。我们可以各退一步：把并购先买权（ROFR）修改为15天优先通知权（ROFN），且商业分销采取分级优惠而非绝对排他。',
      },
      aggressivePushbackResponse: {
        en: 'If you want to stay neutral and sell to our arch-competitors, fine. But without exclusivity, you do not get access to our 5,000-person global salesforce.',
        fr: 'Si vous voulez rester neutre, libre à vous. Mais sans exclusivité, oubliez notre force de vente mondiale de 5 000 commerciaux.',
        zh: '如果你坚持要脚踏两条船向我们的死对头供货，可以。但若没有排他性承诺，你们也别想调用母公司遍布全球的5000人地推销售团队。',
      },
      concessionAccepted: {
        en: 'Agreed. We drop the acquisition ROFR and keep a standard ROFN. Commercial contracts will be handled under a separate arm’s length master services agreement.',
        fr: 'Accepté. Nous abandonnons le ROFR au profit du ROFN. Le partenariat commercial sera signé séparément à des conditions de marché.',
        zh: '达成共识。我们撤销并购先买权（ROFR），仅保留优先通知权（ROFN）。商业合作条款将从股权协议中彻底剥离，作为独立市场化合同签署。',
      },
      walkAwayWarning: {
        en: 'Our corporate investment committee requires strategic value. Without defensive protection against our competitors, financial return alone is insufficient.',
        fr: 'Notre investissement doit avoir une valeur stratégique. Le simple retour financier ne suffit pas à notre conseil.',
        zh: '我们是企业战略CVC，不是纯财务基金。如果无法为母公司筑起护城河，仅凭财务回报根本通不过投资委员会的最终审批。',
      },
    },
    tacticalEmpathyTip: {
      en: 'Beware the gold-plated handcuffs. Never give a CVC an acquisition ROFR, as it kills your future M&A auction. Counter: "How does locking us into exclusivity help us become an independent $10B enterprise?"',
      fr: 'Attention aux menottes dorées. Ne concédez JAMAIS de ROFR d’acquisition à un CVC ; cela tue toute enchère future. Proposez un ROFN.',
      zh: '提防戴着金手铐的特洛伊木马。绝对不能给CVC任何并购先买权（ROFR），否则未来上市或被高价收购的路将被彻底堵死。用校准型提问反客为主：“排他性绑定如何能帮助我们成长为独立百亿级平台？”并坚决降级为优先通知权（ROFN）。',
    },
  },
];
