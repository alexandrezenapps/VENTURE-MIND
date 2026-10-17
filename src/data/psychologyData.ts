import { PsychologyPrinciple, PsychologyCategory } from '../types';

export const psychologyCategoriesMeta: Record<
  PsychologyCategory,
  { en: string; fr: string; zh: string; icon: string; description: { en: string; fr: string; zh: string } }
> = {
  self_control: {
    en: 'Self-Awareness & Emotional Regulation',
    fr: 'Conscience de soi & Régulation émotionnelle',
    zh: '自我觉察与情绪调节',
    icon: 'Brain',
    description: {
      en: 'Mastering pulse, emotional triggers, and physiological calm during high-stakes valuation interrogations.',
      fr: 'Maîtriser son pouls, ses déclencheurs et son calme physiologique lors des interrogatoires de valorisation.',
      zh: '在高风险估值谈判中掌握自身脉搏、情绪触发点与生理冷静。',
    },
  },
  cognitive_biases: {
    en: 'Cognitive Biases in Deals',
    fr: 'Biais cognitifs dans les négociations',
    zh: '交易中的认知偏差',
    icon: 'Compass',
    description: {
      en: 'Detecting anchoring, confirmation traps, sunk cost fallacies, and overconfidence across both sides of the table.',
      fr: 'Détecter ancrage, biais de confirmation, coûts irrécupérables et excès de confiance des deux côtés de la table.',
      zh: '洞察谈判桌两端的锚定效应、确认偏见、沉没成本陷阱与过度自信。',
    },
  },
  perception_framing: {
    en: 'Framing, Narrative & Proof',
    fr: 'Cadrage, Narration & Preuves',
    zh: '框架效应、叙事与证据',
    icon: 'Eye',
    description: {
      en: 'Positioning figures, traction evidence, and market size to illuminate enterprise value rather than defensive friction.',
      fr: 'Positionner chiffres, traction et taille de marché pour éclairer la valeur plutôt que des frictions défensives.',
      zh: '精准布局数据、业务进展证据与市场空间，展现企业价值而非防守姿态。',
    },
  },
  listening_questioning: {
    en: 'Diagnostic Listening & Strategic Inquiries',
    fr: 'Écoute diagnostique & Questions stratégiques',
    zh: '诊断性倾听与战略提问',
    icon: 'Ear',
    description: {
      en: 'Uncovering the partner’s underlying fund deployment timing, thesis constraints, and internal LP pressures.',
      fr: 'Découvrir le calendrier de déploiement du fonds, les contraintes de thèse et les pressions LP internes.',
      zh: '探寻投资合伙人背后的基金部署节奏、投资主题限制及内部出资人(LP)诉求。',
    },
  },
  batna_zopa: {
    en: 'BATNA, ZOPA & Trade-Off Architecture',
    fr: 'BATNA, ZOPA & Architecture des compromis',
    zh: '最佳替代方案(BATNA)、可能达成协议空间(ZOPA)与权衡架构',
    icon: 'Scale',
    description: {
      en: 'Establishing walk-away leverage, option value, and trading economic upside for board control sovereignty.',
      fr: 'Établir son point de rupture, sa valeur d’option et négocier l’upside économique contre la souveraineté de gouvernance.',
      zh: '确立退出底线筹码、期权价值，并在财务收益与董事会控制权之间展开策略性权衡。',
    },
  },
  handling_refusals: {
    en: 'Handling Rejection & Objections',
    fr: 'Gestion des refus & Traitement des objections',
    zh: '应对拒绝与异议拆解',
    icon: 'Shield',
    description: {
      en: 'Transforming "pass" calls into advisory feedback, relationship longevity, and warm co-investor introductions.',
      fr: 'Transformer un refus poli en feedback constructif, relation durable et introductions chaleureuses.',
      zh: '将婉拒转化为宝贵建议、长期信任关系以及优质跟投人引荐。',
    },
  },
  credibility_trust: {
    en: 'Credibility, Transparency & Reputation',
    fr: 'Crédibilité, Transparence & Réputation',
    zh: '信誉、透明度与声誉复利',
    icon: 'Award',
    description: {
      en: 'Constructing unshakable fiduciary pedigree through prompt diligence answers and transparent operational realities.',
      fr: 'Construire une crédibilité fiduciaire inébranlable par des réponses diligentes et une transparence opérationnelle.',
      zh: '凭借及时严谨的尽调回应与真实的运营坦诚，筑牢无可挑剔的商业信誉基石。',
    },
  },
  risk_uncertainty: {
    en: 'Risk Asymmetry & Uncertainty Management',
    fr: 'Asymétrie des risques & Incertitude',
    zh: '风险非对称性与不确定性管理',
    icon: 'AlertTriangle',
    description: {
      en: 'Aligning founder downside exposure with fund portfolio power-law mechanics and liquidation preferences.',
      fr: 'Aligner l’exposition du fondateur avec la loi de puissance des fonds et les clauses de préférence de liquidation.',
      zh: '厘清创始人下行情景与风投幂律分布及清算优先权之间的深层风险非对称关系。',
    },
  },
  fundraising_dynamics: {
    en: 'Fundraising Momentum, FOMO & Scarcity',
    fr: 'Dynamique de levée, FOMO & Rareté',
    zh: '融资势能、竞争焦虑(FOMO)与稀缺性',
    icon: 'Zap',
    description: {
      en: 'Orchestrating concurrent partner meetings, authentic term sheet deadlines, and syndicated deal heat.',
      fr: 'Orchestrer des réunions partenaires synchronisées, des délais de term sheet authentiques et l’émulation du syndicat.',
      zh: '精密把控合伙人上会节奏、真实的投资意向书时限与多机构竞逐势能。',
    },
  },
  alignment_ethics: {
    en: 'Long-Term Alignment & Ethical Sovereignty',
    fr: 'Alignement long terme & Éthique des affaires',
    zh: '长期一致性与商业伦理自主权',
    icon: 'HeartHandshake',
    description: {
      en: 'Protecting founder integrity, mission sanctity, and mutual respect over short-term financial maneuvering.',
      fr: 'Protéger l’intégrité du fondateur, la mission de l’entreprise et le respect mutuel face aux manœuvres à court terme.',
      zh: '守护创始团队原则底线、愿景纯粹性以及建立在彼此尊重之上的长期合伙关系。',
    },
  },
};

export const psychologyPrinciples: PsychologyPrinciple[] = [
  // 1. Self Control & Emotional Regulation
  {
    id: 'psy_001',
    number: 1,
    category: 'self_control',
    name: {
      en: 'The 4-Second Tactical Pause',
      fr: 'La pause tactique de 4 secondes',
      zh: '四秒战略静默',
    },
    definition: {
      en: 'Deliberately pausing for 3 to 5 seconds before answering aggressive valuation or ownership challenges to clear adrenaline.',
      fr: 'Suspendre sa parole pendant 3 à 5 secondes face à une objection agressive pour neutraliser l’adrénaline avant de répondre.',
      zh: '在遭遇关于估值或股权的激进质疑时，刻意停顿3-5秒，使肾上腺素消退后再理性作答。',
    },
    fundraisingScenario: {
      en: 'A Lead Partner sneers: "Your $20M pre-money is completely absurd in this current market cycle."',
      fr: 'L’associé principal ironise : « Votre valorisation pré-money de 20 M$ est totalement absurde dans le marché actuel. »',
      zh: '领投合伙人冷笑质问：“在当前市场环境下，你们要2000万美元投前估值纯属异想天开。”',
    },
    constructiveUse: {
      en: 'Breathe, take a sip of water, nod calmly, and respond with unit economic evidence rather than wounded ego.',
      fr: 'Respirez, buvez une gorgée d’eau, hochez la tête posément, et répondez avec les métriques unitaires plutôt qu’avec orgueil.',
      zh: '平稳呼吸，从容喝口水，点头致意，随后用扎实的单店经济模型与增长指标作答，而非出于自尊心防御。',
    },
    misuseWarning: {
      en: 'Do not use silence to feign arrogance or pretend you did not hear a legitimate accounting inquiry.',
      fr: 'Ne pas utiliser le silence pour feindre l’arrogance ou faire semblant d’ignorer une question comptable légitime.',
      zh: '切勿将静默作为傲慢挑衅或逃避正当财务质询的借口。',
    },
    reflectionPrompt: {
      en: 'What physical cue alerts you that you are entering a defensive fight-or-flight posture during meetings?',
      fr: 'Quel signal physique vous avertit que vous basculez dans une posture défensive de fuite ou de combat ?',
      zh: '在谈判桌上，什么生理信号提醒你正在陷入防守对抗状态？',
    },
    exercise: {
      en: 'Practice receiving a 50% valuation haircut roleplay without defending for the first 5 seconds.',
      fr: 'Entraînez-vous à subir une décote de 50 % en simulation sans répondre pendant les 5 premières secondes.',
      zh: '模拟演练被砍半估值的场景，刻意练习前5秒保持平静不作任何反驳。',
    },
    masteryScore: 88,
  },
  {
    id: 'psy_002',
    number: 2,
    category: 'self_control',
    name: {
      en: 'Separation of Founder Worth and Company Valuation',
      fr: 'Dissociation de la valeur personnelle et de la valorisation',
      zh: '个人价值与企业估值的剥离效应',
    },
    definition: {
      en: 'Recognizing that enterprise valuation is a financial pricing mechanism based on supply/demand and risk, not a personal report card.',
      fr: 'Reconnaître que la valorisation d’une société est un mécanisme de fixation de prix selon l’offre et la demande, et non un jugement de valeur personnel.',
      zh: '清醒认识到企业估值仅是基于供需关系与风险回报的金融定价工具，绝非个人智识或品格的成绩单。',
    },
    fundraisingScenario: {
      en: 'Receiving a down-round or flat-round term sheet after 18 months of 80-hour work weeks.',
      fr: 'Recevoir une term sheet en tour plat (flat round) après 18 mois de travail acharné à 80 heures par semaine.',
      zh: '在连续18个月每周工作80小时后，收到一份持平轮(Flat Round)或下调轮(Down Round)的投资意向书。',
    },
    constructiveUse: {
      en: 'Treat the valuation as a technical equation to solve through traction de-risking and milestone structuring.',
      fr: 'Traiter la valorisation comme une équation technique à résoudre par la réduction du risque et le jalonnement des étapes.',
      zh: '将估值视作一道技术算式，通过锁定里程碑与解除核心业务风险来进行优化。',
    },
    misuseWarning: {
      en: 'Becoming detached to the point of apathy regarding severe dilution or shareholder alignment.',
      fr: 'Devenir détaché au point d’ignorer les conséquences réelles d’une dilution excessive pour l’équipe.',
      zh: '过度抽离以至于对极其苛刻的股权稀释与股东利益失衡掉以轻心。',
    },
    reflectionPrompt: {
      en: 'If your valuation halved tomorrow, what fundamental operational truth about your product remains unchanged?',
      fr: 'Si votre valorisation était divisée par deux demain, quelle vérité fondamentale de votre produit resterait intacte ?',
      zh: '如果公司账面估值明天腰斩，你的产品哪项最底层客户价值依然坚挺？',
    },
    exercise: {
      en: 'Write down 3 core strengths of your customer retention that exist completely independent of VC funding.',
      fr: 'Listez 3 forces majeures de rétention client qui existent indépendamment de tout financement externe.',
      zh: '写出3项即便没有任何外部风投资金支持也依然存在的客户留存核心优势。',
    },
    masteryScore: 82,
  },
  {
    id: 'psy_003',
    number: 3,
    category: 'cognitive_biases',
    name: {
      en: 'The First-Offer Anchoring Trap',
      fr: 'Le piège de l’ancrage de la première offre',
      zh: '首倡报价的锚定陷阱',
    },
    definition: {
      en: 'The disproportionate psychological weight given to the first specific number placed onto the negotiating table.',
      fr: 'Le poids psychologique disproportionné accordé au premier chiffre précis posé sur la table de négociation.',
      zh: '谈判桌上第一个被抛出的具体数值往往对后续所有博弈产生不成比例的巨大心理牵引力。',
    },
    fundraisingScenario: {
      en: 'VC asks early on: "What valuation expectation did your existing angel round set for this Seed round?"',
      fr: 'Un VC demande dès le premier call : « Quelle attente de valorisation vos business angels ont-ils fixée pour ce Seed ? »',
      zh: '早期交流时投资人试探：“你们之前的天使轮给本轮融资设定了怎样的估值预期？”',
    },
    constructiveUse: {
      en: 'Anchor with a confident market band backed by recent comparable transactions rather than a single fragile point.',
      fr: 'Ancrer avec une fourchette de marché étayée par des transactions récentes plutôt qu’un chiffre isolé et fragile.',
      zh: '基于近期同赛道可比交易，给出底气充足的合理估值区间，而非报出一个容易被击碎的孤立数字。',
    },
    misuseWarning: {
      en: 'Throwing an astronomical anchor that causes credible institutional funds to immediately decline due to lack of realism.',
      fr: 'Poser un ancrage délirant qui pousse les fonds institutionnels sérieux à couper court par manque de réalisme.',
      zh: '盲目抛出脱离地心引力的天价估值，导致优质机构认为团队不切实际而直接弃牌。',
    },
    reflectionPrompt: {
      en: 'How do you recalibrate negotiations when a VC tries to anchor you to an outdated median report?',
      fr: 'Comment recadrer l’échange lorsqu’un VC cherche à vous ancrer sur un rapport statistique déconnecté de votre réalité ?',
      zh: '当投资人试图用过期的宏观中位数研报来锚定你的公司时，你该如何转换框架？',
    },
    exercise: {
      en: 'Draft a 2-sentence response deflecting an aggressive early valuation question while maintaining momentum.',
      fr: 'Rédigez une réponse de deux phrases pour esquiver une question prématurée sur la valorisation tout en préservant la dynamique.',
      zh: '撰写一段两句话的经典回答，巧妙化解早期估值摸底，同时强化投资吸引力。',
    },
    masteryScore: 90,
  },
  {
    id: 'psy_004',
    number: 4,
    category: 'cognitive_biases',
    name: {
      en: 'Sunk Cost Fallacy in Zombie Term Sheets',
      fr: 'Le biais des coûts irrécupérables des term sheets zombies',
      zh: '僵尸意向书中的沉没成本偏误',
    },
    definition: {
      en: 'Continuing to negotiate with an extractive or sluggish VC simply because the team has already spent 3 months in diligence.',
      fr: 'Continuer à négocier avec un fonds prédateur ou léthargique uniquement parce que 3 mois de diligence ont déjà été investis.',
      zh: '仅因已经耗费了3个月尽调心血，就勉强委身于拖延或条款苛刻的劣质投资机构。',
    },
    fundraisingScenario: {
      en: 'A tier-3 fund drags diligence for 14 weeks, then introduces a 2x participating liquidation preference clause at the finish line.',
      fr: 'Un fonds de second rang fait durer la diligence 14 semaines, puis glisse une préférence 2x participante à la dernière minute.',
      zh: '某机构拖延尽调长达14周，最后关头突然掏出一份附带2倍参与清算优先权的严苛条款。',
    },
    constructiveUse: {
      en: 'Willingness to ruthlessly terminate toxic negotiations when terms jeopardize founding equity sovereignty.',
      fr: 'Capacité à rompre froidement une négociation toxique dès que les termes menacent la pérennité du capital fondateur.',
      zh: '当下行条款严重侵蚀团队长期权益时，坚决果断斩断沉没成本并退出谈判。',
    },
    misuseWarning: {
      en: 'Abandoning solid partner conversations impulsively due to minor standard legal drafting comments.',
      fr: 'Rompre impulsivement un dialogue constructif pour de simples ajustements juridiques usuels.',
      zh: '因律师之间常规的措辞切磋或枝节条款就意气用事掀桌走人。',
    },
    reflectionPrompt: {
      en: 'What exact toxic term would make you walk away today regardless of how little runway remains?',
      fr: 'Quelle clause toxique précise vous pousserait à partir aujourd’hui, même s’il ne vous reste que peu de trésorerie ?',
      zh: '无论公司账上剩余跑道有多短，哪一条毒丸条款会促使你今天坚决行使否决权？',
    },
    exercise: {
      en: 'Evaluate a hypothetical term sheet: 2x Liquidation + Full Ratchet vs 1x Non-Participating with 30% lower valuation.',
      fr: 'Analysez le dilemme : Préférence 2x participante + Full Ratchet vs 1x non-participante à valorisation inférieure de 30 %.',
      zh: '对比权衡：2倍参与型优先权+完全棘轮防稀释条款 VS 估值降低30%但条款清洁的1倍非参与型结构。',
    },
    masteryScore: 85,
  },
  {
    id: 'psy_005',
    number: 5,
    category: 'perception_framing',
    name: {
      en: 'Reframing Cost as Sovereign Leverage',
      fr: 'Recadrer le coût en levier souverain',
      zh: '将支出重构为战略掌控支点',
    },
    definition: {
      en: 'Presenting capital deployment not as "burn to survive", but as accelerated customer acquisition engine with measurable payback velocity.',
      fr: 'Présenter l’emploi des fonds non comme une consommation de survie, mais comme un accélérateur d’acquisition au retour sur investissement prouvé.',
      zh: '不再将资金消耗描述为“苦苦支撑”，而是将其定位为具有清晰回本周期与边际效应的确定性增长引擎。',
    },
    fundraisingScenario: {
      en: 'A partner scrutinizes: "Why is your monthly burn rate jumping from $60k to $250k immediately post-closing?"',
      fr: 'L’analyste pointe du doigt : « Pourquoi votre burn mensuel bondit-il de 60 k$ à 250 k$ dès la clôture du tour ? »',
      zh: '投资分析师质疑：“为什么交割后你们的月度烧钱速度会立刻从6万美元飙升到25万美元？”',
    },
    constructiveUse: {
      en: 'Show that each dollar goes into proven hiring quotas where each sales rep produces 3.8x fully loaded quota within 4 months.',
      fr: 'Démontrer que chaque euro finance des commerciaux rodés générant 3,8x leur coût complet en 4 mois.',
      zh: '出具详尽团队产出测算：新增资金全额用于招募经过验证的销售单元，每人入职4个月即可产生3.8倍全口径人均产出。',
    },
    misuseWarning: {
      en: 'Masking undisciplined founder vanity spending or bloated headquarters rent behind "growth narrative".',
      fr: 'Masquer des dépenses somptuaires ou des loyers disproportionnés derrière un discours pseudo-stratégique.',
      zh: '用宏大的“战略叙事”掩饰创始人的挥霍性虚荣开支或无节制的团队臃肿。',
    },
    reflectionPrompt: {
      en: 'Can you tie every single line item in your Series A use of funds to an enterprise value multiple unlock?',
      fr: 'Pouvez-vous relier chaque ligne de votre budget Series A à un palier direct de valorisation ?',
      zh: '你是否能把A轮资金使用计划中的每一笔预算，直接对应到下一次公司估值倍数的跃升点？',
    },
    exercise: {
      en: 'Convert a standard salary table into a "Capability Unlocked & Revenue Velocity" chart for investors.',
      fr: 'Transformez une grille de salaires en tableau de « Capacités débloquées et vélocité de revenus » pour vos investisseurs.',
      zh: '将一张死板的薪酬预算表，重构为向投资人展示“核心能力解锁与营收周转速率”的动态价值图表。',
    },
    masteryScore: 84,
  },
  {
    id: 'psy_006',
    number: 6,
    category: 'listening_questioning',
    name: {
      en: 'The Calibrated "How" and "What" Inquiry',
      fr: 'Le questionnement calibré en « Comment » et « Quoi »',
      zh: '校准型“如何”与“什么”探寻法',
    },
    definition: {
      en: 'Using open-ended questions beginning with "How" or "What" to invite the VC into collaborative problem-solving without provoking defensiveness.',
      fr: 'Formuler des questions ouvertes commençant par « Comment » ou « Quoi » pour transformer la négociation en résolution commune.',
      zh: '以“如何”或“什么”开头的开放式提问，引导投资人共同参与条款难题求解，而非引发防备性对抗。',
    },
    fundraisingScenario: {
      en: 'The investor insists on a 2x board majority for their fund despite owning only 15% of the equity.',
      fr: 'L’investisseur exige une majorité au conseil d’administration pour son fonds alors qu’il ne détient que 15 % du capital.',
      zh: '投资人持股仅15%，却在投资协议中坚持索要占半数以上的董事会席位。',
    },
    constructiveUse: {
      en: 'Ask calmly: "How does having a board structure that diverges from institutional Series A standards affect our ability to bring in a tier-1 lead next year?"',
      fr: 'Demandez : « Comment cette composition de conseil influencera-t-elle notre capacité à attirer un fonds de premier plan en Série A l’an prochain ? »',
      zh: '平静发问：“如果本轮董事会架构与主流机构标准发生偏离，将如何影响我们明年吸引全球顶尖机构领投A轮？”',
    },
    misuseWarning: {
      en: 'Using "Why" aggressively (e.g. "Why would you ever think that’s fair?"), which immediately triggers defensive posturing.',
      fr: 'Employer un « Pourquoi » accusateur (« Pourquoi pensez-vous que c’est équitable ? ») qui braque immédiatement votre interlocuteur.',
      zh: '使用质问口吻的“为什么”（如“你凭什么觉得这合理？”），极易瞬间激发对方的反击心理。',
    },
    reflectionPrompt: {
      en: 'When a term seems punitive, what operational consequence can you invite the investor to solve together with you?',
      fr: 'Face à une clause punitive, quel défi opérationnel concret pouvez-vous inviter l’investisseur à surmonter avec vous ?',
      zh: '当遭遇一条看似苛刻的条款时，你能提出什么具体的未来运营隐患，邀请投资人携手攻关？',
    },
    exercise: {
      en: 'Reframe 3 aggressive defensive reactions into calm, calibrated inquiries.',
      fr: 'Reformulez 3 réactions défensives épidermiques en questions ouvertes apaisées et constructives.',
      zh: '将3句情绪化的自我防卫口吻，改写为兼具杀伤力与从容姿态的校准型探寻问句。',
    },
    masteryScore: 89,
  },
  {
    id: 'psy_007',
    number: 7,
    category: 'batna_zopa',
    name: {
      en: 'BATNA Fortification Before Term Sheet Release',
      fr: 'Consolidation du BATNA avant émission de la term sheet',
      zh: '投资意向书出炉前的备选底牌加固',
    },
    definition: {
      en: 'Strengthening your best alternative to a negotiated agreement (cash flow breakeven, revenue financing, grant, internal bridge) before entering term sheet locks.',
      fr: 'Consolider son alternative de repli (rentabilité brute, dette venture, subvention, bridge interne) avant d’entrer en exclusivité.',
      zh: '在正式进入意向书独家排他期前，扎实筑牢备选路径（收支平衡、营收分成贷款、政策补贴或老股东桥接）。',
    },
    fundraisingScenario: {
      en: 'You have only 2 months of runway left while entertaining your sole term sheet offer.',
      fr: 'Il ne vous reste que 2 mois de trésorerie au moment d’examiner votre unique term sheet.',
      zh: '在审阅桌上仅有的一份投资意向书时，公司账面跑道只剩下最后两个月。',
    },
    constructiveUse: {
      en: 'Secure a confirmed letter of intent from existing angels for a $300k defensive bridge loan so you are never negotiating from starvation.',
      fr: 'Sécuriser une lettre d’intention de 300 k$ auprès de vos business angels existants pour ne jamais négocier en position d’agonie.',
      zh: '提前从老天使投资人处锁定一份30万美元的内部过桥意向函，确保绝不处于饥不择食的被动绝境。',
    },
    misuseWarning: {
      en: 'Bluffing nonexistent term sheets with institutional VCs who share deal intelligence across partner networks.',
      fr: 'Bluffer sur de prétendues offres concurrentes face à des fonds connectés qui partagent leurs informations en coulisses.',
      zh: '在行业熟人圈层极深的风投合伙人面前虚构捏造竞争性意向书，一旦被拆穿信誉将瞬间归零。',
    },
    reflectionPrompt: {
      en: 'What is your genuine operational plan if this entire fundraising round falls through tomorrow?',
      fr: 'Quel est votre véritable plan opérationnel si ce tour de table échoue intégralement demain ?',
      zh: '如果本次融资计划在明天彻底告吹，你的真实应急生存作战方案究竟是什么？',
    },
    exercise: {
      en: 'Calculate your "Default Alive" monthly headcount and subscription trim down to zero net burn within 14 days.',
      fr: 'Calculez votre plan « Default Alive » : ajustement d’équipe et de coûts pour atteindre un cash flow net neutre en 14 jours.',
      zh: '测算你的“自带生机(Default Alive)”极简模型：在14天内砍掉非必要支出与软件订阅，实现净现金流平衡。',
    },
    masteryScore: 91,
  },
  {
    id: 'psy_008',
    number: 8,
    category: 'handling_refusals',
    name: {
      en: 'The "Fast No" Conversion Doctrine',
      fr: 'La doctrine de conversion du « Non rapide »',
      zh: '快速说“不”的高效转化法则',
    },
    definition: {
      en: 'Recognizing that an immediate polite rejection from a non-aligned fund is vastly superior to a polite 10-week string along.',
      fr: 'Comprendre qu’un refus rapide et clair vaut mille fois mieux qu’une hésitation polie qui s’étire sur 10 semaines.',
      zh: '领悟并践行：来自非契合机构的利落回绝，远胜于拖延数月、耗尽心力的礼貌性暧昧跟进。',
    },
    fundraisingScenario: {
      en: 'A partner hesitates after meeting 2: "We really love the vision, but let us check in with you in 6 months when you hit $1M ARR."',
      fr: 'Un associé hésite après le 2e rendez-vous : « Nous adorons la vision, mais revenez nous voir dans 6 mois à 1 M$ d’ARR. »',
      zh: '合伙人在第二轮沟通后游移不定：“愿景非常棒，不过建议等你们达到100万美元年经常性收入(ARR)后再聊。”',
    },
    constructiveUse: {
      en: 'Accept graciously, remove them immediately from active pipeline, add to a monthly bullet-point update list, and focus on committed leads.',
      fr: 'Remerciez chaleureusement, retirez-les de votre pipeline actif, basculez-les sur une newsletter investisseurs, et avancez.',
      zh: '大方致谢并从核心攻坚清单移出，归入月度简讯观察池，把精力全量投入到真正高意向的机构身上。',
    },
    misuseWarning: {
      en: 'Argue defensively with the partner in an attempt to prove their market thesis incorrect.',
      fr: 'Engager une polémique stérile avec l’associé pour tenter de démontrer que sa thèse d’investissement est erronée.',
      zh: '出于好胜心与合伙人发生言语争辩，试图强行证明对方的行业研判存在硬伤。',
    },
    reflectionPrompt: {
      en: 'How much founder cognitive capacity are you currently wasting on lukewarm leads that never asked for access to the data room?',
      fr: 'Combien d’énergie mentale consacrez-vous à des contacts tièdes qui n’ont même pas demandé l’accès à la data room ?',
      zh: '你目前在那些连尽调资料室(Data Room)都未申请查阅的温吞客套机构身上，耗费了多少心力？',
    },
    exercise: {
      en: 'Audit your pipeline: tag every fund as Hot (Term Sheet imminent), Warm (Active diligence), or Cold/Pass.',
      fr: 'Auditez votre pipeline : qualifiez chaque fonds en Chaud (Term sheet imminent), Tiède (Diligence en cours) ou Froid.',
      zh: '盘点你的融资漏斗：将每家机构严格标记为“极高意向”、“深度尽调中”或“冷淡/出局”。',
    },
    masteryScore: 87,
  },
  {
    id: 'psy_009',
    number: 9,
    category: 'credibility_trust',
    name: {
      en: 'The Radical Diligence Transparency Standard',
      fr: 'Le standard de transparence radicale en audit',
      zh: '极尽透明的尽调信誉准则',
    },
    definition: {
      en: 'Disclosing structural churn, operational flaws, and pipeline hiccups before the investor uncovers them during legal and financial audit.',
      fr: 'Révéler proactivement le churn, les faiblesses produit et les aléas commerciaux avant que l’audit ne les découvre.',
      zh: '在投资人启动法务与财务尽职调查之前，主动坦陈客户流失、产品瓶颈及管线波动等深层痛点。',
    },
    fundraisingScenario: {
      en: 'Your biggest enterprise pilot has decided not to renew for the upcoming fiscal quarter.',
      fr: 'Votre plus gros client pilote a décidé de ne pas renouveler son contrat pour le trimestre à venir.',
      zh: '公司最大的测试期企业级标杆客户决定下季度不再续约。',
    },
    constructiveUse: {
      en: 'State upfront: "Here is why our largest pilot churned, here is the architectural root cause, and here is how our next release solves it permanently."',
      fr: 'Présentez d’emblée l’analyse : « Voici pourquoi ce compte est parti, la cause technique identifiée, et la mise à jour qui y répond. »',
      zh: '主动披露并附带闭环解析：“这是大客户未续约的根本原因，这是架构层痛点，这是新版本彻底根治的交付路线图。”',
    },
    misuseWarning: {
      en: 'Dumping unframed panic or unresolved company crises without proposing actionable managerial remedies.',
      fr: 'Déverser un flot d’angoisse désordonné sans esquisser de mesures correctives claires.',
      zh: '不做结构化归因直接抛出恐慌情绪或未理清的内部危机，造成专业能力缺失的糟糕印象。',
    },
    reflectionPrompt: {
      en: 'What hidden data room metric would cause you the most shame if questioned by an auditor, and how will you address it today?',
      fr: 'Quel chiffre de votre data room redoutez-vous le plus d’expliquer, et comment allez-vous l’aborder dès maintenant ?',
      zh: '数据室里哪一项指标一旦被投资人查到最让你心虚？你今天打算如何坦率而专业地面向它？',
    },
    exercise: {
      en: 'Write an executive "Known Vulnerabilities & De-risking Milestones" memo for inclusion in your data room.',
      fr: 'Rédigez une note de synthèse « Vulnérabilités identifiées et plan de dé-risquage » pour votre data room.',
      zh: '撰写一份高水准的“已知业务短板与风险对冲规划”备忘录，主动置于尽调资料室显要位置。',
    },
    masteryScore: 89,
  },
  {
    id: 'psy_010',
    number: 10,
    category: 'fundraising_dynamics',
    name: {
      en: 'The Authentic Momentum Syndicate Effect',
      fr: 'L’effet syndicat de momentum authentique',
      zh: '真实势能驱动的辛迪加聚合效应',
    },
    definition: {
      en: 'Channeling multiple co-investors into a structured syndicate around an authoritative lead investor to compress time-to-close.',
      fr: 'Fédérer plusieurs co-investisseurs autour d’un lead réputé pour réduire drastiquement le temps de clôture juridique.',
      zh: '在确立权威领投机构后，迅速将多家跟投方聚拢为结构化辛迪加财团，强力压缩交割周期。',
    },
    fundraisingScenario: {
      en: 'A premier lead investor signs for $1.5M of a $2.5M round, leaving $1M of allocation open for syndication.',
      fr: 'Un lead de premier rang valide 1,5 M$ sur un tour de 2,5 M$, laissant 1 M$ d’allocation ouverte pour le syndicat.',
      zh: '知名领投方已签署150万美元投资意向（本轮共募250万），余下100万美元额度向跟投开放。',
    },
    constructiveUse: {
      en: 'Give interested second-tier funds a firm 72-hour window to take the remaining room on identical lead terms.',
      fr: 'Fixer une fenêtre ferme de 72 heures aux fonds intéressés pour souscrire au solde aux conditions strictes du lead.',
      zh: '给予有意向的跟投方严格的72小时认购窗口，全盘照搬领投方标准投资条款，不做单独非标协商。',
    },
    misuseWarning: {
      en: 'Allowing multiple tiny angels to negotiate individualized side letters that burden future Series A governance.',
      fr: 'Laisser de petits souscripteurs négocier des side letters individuelles qui compliqueront la gouvernance ultérieure.',
      zh: '允许大量小额跟投天使签署个性化抽屉协议(Side Letters)，为日后的A轮治理埋下巨大法务隐患。',
    },
    reflectionPrompt: {
      en: 'How do you safeguard your standard terms when an oversubscribed round creates fierce competition for allocation?',
      fr: 'Comment préservez-vous des termes sains et standardisés lorsque le tour est sursouscrit ?',
      zh: '当融资发生超额认购引发机构争抢份额时，你如何坚守最规范清洁的治理底线？',
    },
    exercise: {
      en: 'Draft an allocation confirmation email for co-investors detailing deadlines, pro-rata acceptance, and closing date.',
      fr: 'Rédigez l’e-mail de confirmation d’allocation pour co-investisseurs fixant délais, engagement pro-rata et date de clôture.',
      zh: '草拟一份面向跟投投资人的额度确认函，清晰约定确认截止时限、按比例配售机制与最终交割签署日。',
    },
    masteryScore: 93,
  },
  {
    id: 'psy_011',
    number: 11,
    category: 'alignment_ethics',
    name: {
      en: 'The Long-Term Partner Marriage Mindset',
      fr: 'La mentalité d’alliance de long terme',
      zh: '长期合伙“类婚姻”心智模型',
    },
    definition: {
      en: 'Evaluating prospective investors as 7-to-10 year fiduciary partners whose boardroom temperament matters more than a 10% valuation premium.',
      fr: 'Considérer les investisseurs comme des partenaires fiduciaires sur 7 à 10 ans dont le tempérament prime sur 10 % de valorisation.',
      zh: '将投资人视作长达7至10年的深度事业伙伴；其在董事会上的品性与格局远比表面高出10%的纸面估值更为关键。',
    },
    fundraisingScenario: {
      en: 'Choosing between Fund A ($12M valuation, renowned helpful partner) and Fund B ($14M valuation, notorious boardroom bully).',
      fr: 'Choisir entre le Fonds A (valo 12 M$, associé réputé bienveillant) et le Fonds B (valo 14 M$, réputation d’intrusif agressif).',
      zh: '面临两份意向书抉择：A基金投前1200万且合伙人以极力赋能闻名；B基金投前1400万但其合伙人以蛮横干预团队著称。',
    },
    constructiveUse: {
      en: 'Perform exhaustive backdoor reference checks on past founder relationships during down markets before signing.',
      fr: 'Conduire des vérifications discrètes de réputation auprès de fondateurs ayant traversé des crises avec cet associé.',
      zh: '在最终签字前，严密背调这名投资人过往在低谷期与破产危机中对待被投企业创始人的真实作风。',
    },
    misuseWarning: {
      en: 'Relying exclusively on the curated reference list provided directly by the venture fund’s PR team.',
      fr: 'Se fier uniquement aux fondateurs « vitrine » recommandés par l’équipe de communication du fonds.',
      zh: '盲目相信投资机构公关团队主动推送给你的官方模范被投企业名单。',
    },
    reflectionPrompt: {
      en: 'If your company missed revenue targets for three consecutive quarters, which partner would roll up their sleeves rather than panic?',
      fr: 'En cas de trois trimestres consécutifs sous les objectifs, quel associé vous aidera plutôt que de paniquer ?',
      zh: '如果公司连续3个季度未能达成业绩目标，哪位投资人会卷起袖子帮你共渡难关而非恐慌责难？',
    },
    exercise: {
      en: 'Create a 5-question interview framework to backdoor reference an investor with founders of liquidated portfolio companies.',
      fr: 'Élaborez une grille de 5 questions pour mener une référence informelle auprès de fondateurs dont la boîte a fait faillite.',
      zh: '编制一套针对投资人的5题匿名深度背调框架，重点访谈其过往投资失败清算项目的创始人。',
    },
    masteryScore: 92,
  },
  {
    id: 'psy_012',
    number: 12,
    category: 'risk_uncertainty',
    name: {
      en: 'The Power Law Alignment Principle',
      fr: 'Le principe d’alignement avec la loi de puissance',
      zh: '风投幂律法则的认知共振',
    },
    definition: {
      en: 'Understanding that VC fund economics require the single top portfolio winner to return the entire fund fund size, driving their appetite for massive upside over modest profitability.',
      fr: 'Comprendre que le modèle VC exige qu’une seule entreprise star rembourse l’intégralité du fonds, justifiant leur quête d’hyper-croissance.',
      zh: '深刻领会风投基金的生命线依赖单家超级头部赢家返还整只基金本金，因而其本能渴望无限上行空间而非偏安小赢。',
    },
    fundraisingScenario: {
      en: 'An institutional VC rejects your pitch: "Great $10M revenue lifestyle business, but it cannot become a $1B sovereign category king."',
      fr: 'Un VC institutionnel décline : « Belle PME rentable à 10 M$ de CA, mais pas de potentiel pour atteindre 1 Md$ de valorisation. »',
      zh: '主流风投合伙人回绝：“这无疑是年入千万美元的优质赚钱生意，但缺乏成为十亿美元独角兽的行业天花板。”',
    },
    constructiveUse: {
      en: 'Frame your total addressable market (TAM) expansion vectors and platform adjacencies to show a mathematical path to $100M+ annual recurring revenue.',
      fr: 'Articuler l’extension de votre marché total adressable (TAM) pour matérialiser un chemin crédible vers 100 M$ d’ARR.',
      zh: '清晰推演目标市场规模(TAM)延展路径与飞轮效应，让投资人看到公司年经常性收入冲破1亿美元的数学逻辑。',
    },
    misuseWarning: {
      en: 'Presenting absurd, baseless global market expansion claims that destroy founder credibility in the first five minutes.',
      fr: 'Présenter des projections mondiales fantasques qui détruisent la crédibilité de l’équipe dès les cinq premières minutes.',
      zh: '脱离实际地画大饼，把毫不相关的宏观全球大盘硬凑成自己的潜在市场，瞬间丧失专业公信力。',
    },
    reflectionPrompt: {
      en: 'Does your actual product ambition match the high-risk, venture-scale trajectory demanded by institutional equity financing?',
      fr: 'Votre ambition réelle est-elle en adéquation avec les exigences de trajectoire exponentielle du capital-risque ?',
      zh: '你的企业愿景与真实抱负，是否真正匹配股权风险投资所必然要求的极致高风险与极限非线性扩张？',
    },
    exercise: {
      en: 'Draft a 1-page "Venture Return Model": Calculate how a $500M exit at your target ownership returns 2.5x of the investor’s entire $100M fund.',
      fr: 'Calculez comment une sortie à 500 M$ à votre niveau de dilution permet de rembourser 2,5x un fonds de 100 M$.',
      zh: '做一张基金测算表：演算在最终5亿美元退出时，投资人所占股权如何实现返还其整只1亿美元基金的2.5倍。',
    },
    masteryScore: 94,
  },
];
