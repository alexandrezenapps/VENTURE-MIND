export interface DecisionOption {
  id: string;
  type: 'concession' | 'confrontation' | 'mastery';
  label: {
    en: string;
    fr: string;
    zh: string;
  };
  impact: {
    composure: number;
    leverage: number;
    valuationDiff: number; // in $
  };
  feedback: {
    en: string;
    fr: string;
    zh: string;
  };
  mindfulRule: {
    en: string;
    fr: string;
    zh: string;
  };
}

export interface GameEncounter {
  id: string;
  themeId: string;
  phaseTitle: {
    en: string;
    fr: string;
    zh: string;
  };
  adversaryTactic: {
    en: string;
    fr: string;
    zh: string;
  };
  adversaryDialogue: {
    en: string;
    fr: string;
    zh: string;
  };
  hiddenPsychology: {
    en: string;
    fr: string;
    zh: string;
  };
  options: DecisionOption[];
}

export const TWENTY_GAME_ENCOUNTERS: GameEncounter[] = [
  // 1. 估值极限定价锚点
  {
    id: 'enc_01',
    themeId: 'valuation_anchor',
    phaseTitle: {
      en: 'The Valuation Anchor Squeeze',
      fr: 'L’Ancrage Agressif de Valorisation',
      zh: '估值极限定价锚点',
    },
    adversaryTactic: {
      en: 'Psychological Anchoring & Capital Scarcity Bluff',
      fr: 'Ancrage Psychologique & Menace de Pénurie',
      zh: '锚定效应试探与制造资本寒冬稀缺感',
    },
    adversaryDialogue: {
      en: '"Current macro market is frozen. We appreciate your traction, but in this climate, nobody else will write an $8M pre-money check. This is our firm ceiling."',
      fr: '« Le marché macroéconomique est glacé. Personne d’autre n’écrira un chèque à 8 M$ pre-money. C’est notre plafond ferme et non négociable. »',
      zh: '“现在的资本市场彻底进入严冬了。虽然你们数据不错，但这个大环境下除了我们，没人能给你们开出800万投前的支票。这是我们的坚决上限。”',
    },
    hiddenPsychology: {
      en: 'The partner has unused LP capital that MUST be deployed this quarter. They are terrified of missing out on your sector lead, using an aggressive anchor to test your emotional desperation.',
      fr: 'L’associé doit impérativement déployer des fonds ce trimestre. Il craint le FOMO et teste votre fébrilité émotionnelle avec un ancrage très bas.',
      zh: '【潜台词探测】该合伙人本季度有硬性出资额度，且刚错失你所在赛道的竞品。他深知你的稀缺价值，此时抛出800万低锚点，纯粹是为了刺探你是否有情绪恐慌。',
    },
    options: [
      {
        id: 'e1_concession',
        type: 'concession',
        label: {
          en: 'Hesitate and reluctantly accept: "The market is indeed tough, we will take the $8M to close fast."',
          fr: 'Hésiter et céder : « Le marché est dur en effet, nous acceptons les 8 M$ pour aller vite. »',
          zh: '叹气并勉强顺从：“现在行情确实不好，为了尽快落袋，我们接受800万估值。”',
        },
        impact: { composure: -25, leverage: -30, valuationDiff: -4000000 },
        feedback: {
          en: 'Emotional Collapse! You accepted their opening anchor without testing conviction. The investor now knows you lack market confidence.',
          fr: 'Effondrement Émotionnel ! Vous cédez dès le premier coup sans vérifier la conviction réelle du fonds.',
          zh: '定力溃败！一招未拆便直接咽下对方的开场低锚点。对手立刻断定你缺乏其他买家与心理底气，后续条款将被全方位收割。',
        },
        mindfulRule: {
          en: 'Law of Anchoring: Never negotiate inside the opponent’s anchor. Re-frame using objective ARR growth multiples.',
          fr: 'Loi de l’Ancrage : Ne négociez jamais à l’intérieur de l’ancre de l’adversaire. Recadrez par des multiples objectifs.',
          zh: '【博弈心法】永远不要在对手划定的锚点范围内还价。必须跳出框架，用客观的增长倍数重构讨论基准。',
        },
      },
      {
        id: 'e1_confront',
        type: 'confrontation',
        label: {
          en: 'React indignantly: "8 million is an insult to our hard work! We would rather shut down than take this insult!"',
          fr: 'Réagir avec colère : « 8 millions est une insulte à notre travail ! Plutôt tout arrêter que signer cela ! »',
          zh: '拍桌愤怒斥责：“800万是对我们团队的侮辱！我们宁可不融，也绝不受这种轻视！”',
        },
        impact: { composure: -35, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Loss of Composure! Emotional anger signals amateur fragility. Negotiations stall and ego replaces deal logic.',
          fr: 'Faillite Émotionnelle ! L’agressivité trahit votre insécurité. L’ego détruit la dynamique rationnelle.',
          zh: '情绪失控！愤怒是博弈中最廉价的底牌，暴露出脆弱的自尊心。对手会认为你心智不成熟，随时可能在未来经营中意气用事。',
        },
        mindfulRule: {
          en: 'Tactical Equanimity: Hostility narrows cognitive bandwidth. Treat aggressive valuation as data, not an attack.',
          fr: 'Équanimité Tactique : L’hostilité réduit vos réflexes. Considérez l’offre basse comme une donnée brute, non une agression.',
          zh: '【博弈心法】喜怒不形于色，定力即是威严。把对手的苛刻出价当成一串冷冰冰的数据，而非人格攻击。',
        },
      },
      {
        id: 'e1_mastery',
        type: 'mastery',
        label: {
          en: 'Execute 4-second silence, smile calmly, and anchor with ARR metrics: "We understand your macro prudence. However, at 300% YoY growth and 85% gross margin, top-quartile transactions trade at 18x ARR. Our baseline is $14M."',
          fr: 'Appliquer 4 secondes de silence, sourire posément et recadrer : « Nous comprenons votre prudence. Mais à 300% de croissance et 85% de marge, le marché trade à 18x l’ARR. Notre socle rationnel est de 14 M$. »',
          zh: '保持4秒战术静默，从容微笑并递交数据重构：“理解机构的风控审慎。但我们以300%年增速与85%毛利领跑赛道，行业中位数是18倍ARR，我们合理的基准估值是1400万。”',
        },
        impact: { composure: +25, leverage: +30, valuationDiff: +6000000 },
        feedback: {
          en: 'Mastery! The 4-second tactical silence absorbs their pressure. Reframing around public ARR multiples shatters their artificial anchor.',
          fr: 'Coup de Maître ! Le silence de 4 secondes dissipe la tension. L’ancrage objectif sur l’ARR force l’adversaire à remonter.',
          zh: '降维破局！4秒战术静默打破了对方逼迫快速就范的节奏；随后用无懈可击的财务倍数建立客观新锚点，迫使对手回到理性轨道！',
        },
        mindfulRule: {
          en: 'The 4-Second Rule: Silence creates psychological gravity. The first one to speak under discomfort loses leverage.',
          fr: 'Règle des 4 Secondes : Le silence crée une gravité irrésistible. Celui qui parle par malaise cède du terrain.',
          zh: '【博弈心法】4秒静默律：沉默会产生巨大的心理引力。在高压提问后谁先因为尴尬开口，谁就交出了筹码。',
        },
      },
    ],
  },

  // 2. 优先清算权中的毒丸暗礁
  {
    id: 'enc_02',
    themeId: 'liquidation_trap',
    phaseTitle: {
      en: 'The Poison Pill Liquidation Trap',
      fr: 'Le Piège de la Liquidation Participante',
      zh: '优先清算权中的毒丸暗礁',
    },
    adversaryTactic: {
      en: 'Trojan Horse Trade-off (Higher Valuation in Exchange for 2x Participating)',
      fr: 'Cheval de Troie (Hausse de valo contre liquidation 2x participante)',
      zh: '木马计：表面让步估值，暗中塞入2倍参与型清算毒丸',
    },
    adversaryDialogue: {
      en: '"Fine, we can stretch the valuation up to $13M. But in exchange, we require a standard 2x Participating Liquidation Preference so we align downside risk together."',
      fr: '« D’accord, montons à 13 M$. Mais en contrepartie, nous exigeons une préférence de liquidation 2x participante standard pour aligner nos risques. »',
      zh: '“行，估值我们可以破例让到1300万。但作为平衡，我们需要2倍参与型清算优先权（2x Participating），这很公道，利益捆绑共担风险嘛。”',
    },
    hiddenPsychology: {
      en: 'The partner hopes you only care about vanity headlines ("$13M valuation!"). The 2x participating clause guarantees them $10M off the top in an exit plus their 20% equity share—decimating founder return.',
      fr: 'L’associé parie sur votre vanité du chiffre affiché. La clause 2x participante lui garantit le double de sa mise AVANT tout partage avec vous.',
      zh: '【潜台词探测】对方看准了年轻创业者容易被“估值数字”冲昏头脑。2倍参与型意味着未来公司哪怕以3000万卖掉，他先拿走双倍本金，再分走剩余20%，创始团队将两手空空！',
    },
    options: [
      {
        id: 'e2_concession',
        type: 'concession',
        label: {
          en: 'Focus solely on the valuation bump: "13 million sounds great! Deal."',
          fr: 'Célébrer la valorisation : « 13 millions, c’est parfait ! Marché conclu. »',
          zh: '只看估值数字大喜过望：“1300万太好了！就按这个签吧。”',
        },
        impact: { composure: -30, leverage: -35, valuationDiff: -3000000 },
        feedback: {
          en: 'Fatal Dilution Trap! You fell for the headline valuation while giving away exit proceeds. In a modest exit, founders receive zero.',
          fr: 'Piège Mortel ! Vous gagnez la vanité du titre mais perdez le cash réel en cas de sortie modeste.',
          zh: '致命盲区！赚了面子，丢了里子。2倍参与型清算是投资界的毒丸，未来在5000万以下的并购中，创始团队的收益将被合法掠夺殆尽。',
        },
        mindfulRule: {
          en: 'Economics Over Vanity: Liquidation structure dictates real payouts, not the pre-money valuation headline.',
          fr: 'Économie vs Vanité : La cascade de liquidation dicte la rentabilité réelle, pas le titre de valorisation.',
          zh: '【博弈心法】里子大于面子：估值是虚荣指标，清算瀑布才是真正装进口袋里的真金白银。',
        },
      },
      {
        id: 'e2_confront',
        type: 'confrontation',
        label: {
          en: 'Accuse the investor: "You are trying to scam me with dirty term sheet tricks!"',
          fr: 'Attaquer l’investisseur : « Vous essayez de m’escroquer avec des clauses véreuses ! »',
          zh: '直接翻脸怒斥：“你们是在合同里给我埋雷下毒！把创业者当傻子吗？！”',
        },
        impact: { composure: -25, leverage: -20, valuationDiff: 0 },
        feedback: {
          en: 'Defensive Agitation! Calling standard VC posturing a "scam" destroys trust and makes future board collaboration toxic.',
          fr: 'Agitation Défensive ! Accuser l’associé de fraude ruine le capital confiance indispensable au futur conseil.',
          zh: '防卫过激！博弈场上没有人讲道德，大家只讲筹码与规则。将商业试探升级为人格指控，彻底堵死了体面修正条款的空间。',
        },
        mindfulRule: {
          en: 'Detached Reframing: Never ascribe to malice what can be negotiated with legal precision.',
          fr: 'Recadrage Détaché : N’attribuez jamais à la malveillance ce qui se règle par la précision juridique.',
          zh: '【博弈心法】超然破局：不要把商业博弈上升为道德审判，用精密的法律结构降维击退试探。',
        },
      },
      {
        id: 'e2_mastery',
        type: 'mastery',
        label: {
          en: 'Firm boundary with institutional standard: "We insist on the clean NVCA standard: 1x Non-Participating. If you need downside security, we offer a board observer seat and quarterly audit transparency."',
          fr: 'Fermeté institutionnelle : « Nous nous en tenons au standard NVCA : 1x Non-Participante. Pour sécuriser votre baisse, nous offrons un censeur au board et un audit trimestriel. »',
          zh: '严守底线，对等置换：“我们只签署NVCA标准下的「1倍非参与型清算」。如果贵方需要下行风控安全感，我们愿意在季度财务审计与观察员席位上给予完全透明度。”',
        },
        impact: { composure: +30, leverage: +30, valuationDiff: +4000000 },
        feedback: {
          en: 'Surgical Precision! You neutralized predatory double-dipping while offering legitimate governance transparency.',
          fr: 'Précision Chirurgicale ! Vous supprimez le double enrichissement prédateur tout en offrant une transparence légitime.',
          zh: '外科手术级反制！坚定剔除毒丸条款，同时给予对手合规风控的体面台阶，展现出跨国顶级CEO的专业治理段位！',
        },
        mindfulRule: {
          en: 'The Principle of Clean Architecture: Non-participating is the gold standard of equitable risk-sharing.',
          fr: 'Principe d’Architecture Saine : Le 1x non-participant est la norme royale de l’alignement des risques.',
          zh: '【博弈心法】清爽结构律：1倍非参与型（1x Non-Participating）是风投生态健康共赢的黄金法则，寸土不让。',
        },
      },
    ],
  },

  // 3. 董事会一票否决权偷袭
  {
    id: 'enc_03',
    themeId: 'board_veto',
    phaseTitle: {
      en: 'The Board Veto Infiltration',
      fr: 'L’Infiltration des Droits de Veto au Board',
      zh: '董事会一票否决权偷袭',
    },
    adversaryTactic: {
      en: 'Governance Creep (Seeking Operational Vetoes under Guise of Minority Rights)',
      fr: 'Grignotage de Gouvernance (Veto opérationnel déguisé en protection minoritaire)',
      zh: '治理渗透：以“少数股权常规保护”为名，索取日常高管任免与次年预算的一票否决权',
    },
    adversaryDialogue: {
      en: '"We only want 1 seat on a 5-person board. But we require sole veto rights over all C-level hiring, executive compensation, and the annual budget."',
      fr: '« Nous ne demandons qu’un seul siège sur cinq. En revanche, nous exigeons un droit de veto exclusif sur l’embauche des dirigeants et le budget annuel. »',
      zh: '“我们在5人董事会里只要1个席位。但是出于对资金的负责，我们必须对高管招聘、薪酬以及次年预算拥有单独一票否决权。”',
    },
    hiddenPsychology: {
      en: 'Operational vetoes paralyze founder authority. If you agree, the investor effectively controls who you can hire and fire, turning you into an employee in your own company.',
      fr: 'Un veto opérationnel paralyse le fondateur. L’investisseur contrôlerait qui vous pouvez recruter ou remercier.',
      zh: '【潜台词探测】对方企图用经营否决权将你降级为“高级打工人”。一旦让出预算与人事否决权，未来任何战略转型都会被卡脖子。',
    },
    options: [
      {
        id: 'e3_concession',
        type: 'concession',
        label: {
          en: 'Concede casually: "Since you only have one seat, veto on budget seems reasonable enough."',
          fr: 'Céder naïvement : « Un seul siège avec veto budgétaire me semble acceptable. »',
          zh: '草率妥协：“既然你们只有1票，给个预算和招聘否决权应该也没关系吧。”',
        },
        impact: { composure: -35, leverage: -30, valuationDiff: -2000000 },
        feedback: {
          en: 'Loss of Founder Autonomy! You just surrendered operational control. Every key employee hire can now be blocked.',
          fr: 'Perte Totale d’Autonomie ! Vous venez de céder le contrôle opérationnel. Tout recrutement stratégique peut être bloqué.',
          zh: '主权丧失！你亲手交出了公司的控制权绞索。此后每次招聘副总裁或发放期权，都必须看投资人脸色。',
        },
        mindfulRule: {
          en: 'Operational vs Fundamental: Protective provisions belong to fundamental events (mergers, bankruptcy), never daily operations.',
          fr: 'Opérationnel vs Fondamental : Les vetos ne s’appliquent qu’aux événements majeurs (fusions, liquidation), jamais au quotidien.',
          zh: '【博弈心法】法定事项与日常运营的红线：否决权只能赋予破产、增资、售出公司等根本性事项，日常人事绝不可让渡。',
        },
      },
      {
        id: 'e3_confront',
        type: 'confrontation',
        label: {
          en: 'Rigid hostility: "No vetoes whatsoever! Either you trust me completely or do not invest!"',
          fr: 'Hostilité rigide : « Aucun veto quel qu’il soit ! C’est la confiance totale ou rien ! »',
          zh: '教条对抗：“没有任何否决权可言！你们要么全心信任我，要么就别投！”',
        },
        impact: { composure: -20, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Naive Ultimatum! Institutional investors have fiduciary duties to their LPs. Denying all statutory minority protections looks legally naive.',
          fr: 'Ultimatum Puéril ! Les fonds ont des obligations légales envers leurs LPs. Refuser toute protection statutaire passe pour de l’amateurisme.',
          zh: '幼稚对立！机构投资人对LP负有受托责任，不可能完全没有任何重大事项保护。绝对排斥一切常规保护会让你显得缺乏商业常识。',
        },
        mindfulRule: {
          en: 'Constructive Boundary: Distinguish legitimate LP fiduciary protections from abusive operational interference.',
          fr: 'Frontière Constructive : Distinguez la protection fiduciaire de l’ingérence opérationnelle abusive.',
          zh: '【博弈心法】理性划分边界：聪明的创始人主动拥抱合理的法定重大保护，同时铁腕捍卫日常经营的独立决断权。',
        },
      },
      {
        id: 'e3_mastery',
        type: 'mastery',
        label: {
          en: 'Carve-out diplomacy: "We grant standard class protective provisions for liquidation, recapitalization, and sale of the company. However, C-suite appointments and budgets remain strictly by simple board majority."',
          fr: 'Diplomatie de démarcation : « Nous accordons les vetos de classe statutaires pour cession, recapitalisation ou faillite. En revanche, le recrutement et le budget relèvent de la majorité simple du board. »',
          zh: '精准切割术：“在修改章程、破产清算、增发新股等重大法定事项上，我们给予优先股一票否决权；但在预算与高管任免上，必须坚持董事会简单多数决。”',
        },
        impact: { composure: +25, leverage: +25, valuationDiff: +3000000 },
        feedback: {
          en: 'Sovereign Board Governance! You satisfied their LP compliance without giving up an inch of CEO executive leadership.',
          fr: 'Gouvernance Souveraine ! Vous rassurez leurs LPs sans céder le moindre millimètre de votre autorité managériale.',
          zh: '大将风度！既满足了机构风控的合规交差，又坚如磐石地捍卫了CEO的统帅权，对手合伙人内心会对你刮目相看。',
        },
        mindfulRule: {
          en: 'The Golden Ratio of Governance: Protect investor capital against dilutive abuse; protect founder vision against bureaucratic paralysis.',
          fr: 'Le Ratio d’Or de la Gouvernance : Protéger le capital contre la dilution abusive ; protéger la vision contre la paralysie.',
          zh: '【博弈心法】治理黄金律：防范资本被恶意侵占是投资人的底线，防止战略决策被官僚瘫痪是创始人的生命线。',
        },
      },
    ],
  },

  // 4. 极限倒计时的最后通牒
  {
    id: 'enc_04',
    themeId: 'exploding_deadline',
    phaseTitle: {
      en: 'The Exploding Deadline Bluff',
      fr: 'Le Bluff de la Date Limite Explosive',
      zh: '极限倒计时的最后通牒',
    },
    adversaryTactic: {
      en: 'Artificial Scarcity & FOMO Inversion (Exploding Term Sheet)',
      fr: 'Pression Temporelle & Urgence Artificielle (Term Sheet Explosif)',
      zh: '时间紧迫感挤压与最后通牒心理战',
    },
    adversaryDialogue: {
      en: '"Our Investment Committee approved this term sheet today, but our offer expires at 11:59 PM tonight. If you don’t countersign, we walk away and wire capital to your direct competitor tomorrow morning."',
      fr: '« Le comité a validé le deal aujourd’hui, mais l’offre expire ce soir à 23h59. Si vous ne signez pas, nous nous retirons pour financer votre concurrent direct dès demain. »',
      zh: '“投委会今天下午刚过会，但这份Term Sheet在今晚23:59自动作废。如果你今晚不签，明天一早我们就转头投资你的直接竞品。”',
    },
    hiddenPsychology: {
      en: 'Classic exploding offer tactic! High-pressure sales technique designed to bypass your legal counsel and deny you time to receive a competing second term sheet.',
      fr: 'Tactique classique de la dead-line explosive ! Conçue pour court-circuiter votre avocat et vous empêcher de comparer d’autres offres.',
      zh: '【潜台词探测】经典的“倒计时施压法”！对手根本来不及明天给竞品尽调打款，他之所以设置24小时最后通牒，是因为他嗅到了其他机构也在联系你，企图剥夺你找律师复核和横向比价的时间！',
    },
    options: [
      {
        id: 'e4_concession',
        type: 'concession',
        label: {
          en: 'Panic and sign at 11:45 PM without completing legal diligence: "I cannot risk our competitor getting funded."',
          fr: 'Paniquer et signer à 23h45 sans avis juridique : « Trop risqué de voir le concurrent financé. »',
          zh: '恐慌失措，深夜11:45在未经律师审查的情况下草草签字：“绝不能让竞品拿到这笔钱。”',
        },
        impact: { composure: -40, leverage: -35, valuationDiff: -3000000 },
        feedback: {
          en: 'Panic Surrender! You succumbed to an artificial deadline. Unreviewed binding exclusivity can trap your company for 90 days.',
          fr: 'Capitulation dans la Panique ! Vous cédez à une date limite fictive. L’exclusivité non relue peut vous verrouiller 90 jours.',
          zh: '恐慌性溃退！掉进了对手精心编造的虚假死线陷阱中。未经验资和律师把关的签字，很可能让你陷入长达90天的排他性绞杀。',
        },
        mindfulRule: {
          en: 'Urgency Bias: Artificial deadlines are designed to create panic. Never sign any legal instrument during cognitive overwhelm.',
          fr: 'Biais d’Urgence : Les dead-lines artificielles créent la panique. Ne signez jamais en état de saturation cognitive.',
          zh: '【博弈心法】紧迫感偏误：所有商业上的“今晚不签就作废”都是心理战施压。人在肾上腺素飙升时，智商至少下降30%。',
        },
      },
      {
        id: 'e4_confront',
        type: 'confrontation',
        label: {
          en: 'Petulant bluff: "Go ahead and fund them then! We never wanted your money anyway!" and hang up.',
          fr: 'Provocation puérile : « Allez financer le concurrent alors ! Nous ne voulions pas de votre argent ! » et raccrocher.',
          zh: '意气用事叫板：“那你就去投竞品吧！我们根本不稀罕你们的钱！”随后挂断电话。',
        },
        impact: { composure: -25, leverage: -20, valuationDiff: 0 },
        feedback: {
          en: 'Burned Bridges! Emotional bluffing turns a solvable negotiation into an irreversible breakdown.',
          fr: 'Ponts Coupés ! Ce bluff bravache transforme une opportunité en rupture définitive et stérile.',
          zh: '掀翻牌桌！在博弈中用赌徒心态意气用事，将原本可以争取的顶级机构直接推向了对手阵营。',
        },
        mindfulRule: {
          en: 'Strategic Maturity: The best negotiators never slam doors; they leave an elegant corridor for the other party to step down gracefully.',
          fr: 'Maturité Stratégique : Les maîtres ne claquent jamais la porte ; ils laissent un couloir élégant pour reculer avec grâce.',
          zh: '【博弈心法】围师必阙：永远不要把话说绝，高明的博弈大师永远给对手留下一条体面后退的台阶。',
        },
      },
      {
        id: 'e4_mastery',
        type: 'mastery',
        label: {
          en: 'Sovereign composure: "We deeply appreciate the conviction of your IC. High-quality partnerships require thorough 48-hour legal review. We will deliver our signed response Thursday at 2 PM. If that timeline fails your mandate, we respect your choice."',
          fr: 'Sérénité souveraine : « Nous saluons la conviction de votre comité. Un partenariat de long terme exige 48h de revue juridique. Notre réponse définitive arrivera jeudi à 14h. Si ce délai ne convient pas, nous respecterons votre décision. »',
          zh: '从容定力，重设时间表：“由衷感谢投委会的高效认可。但一段十年的合伙关系，必须经过48小时严格的法律尽调审查。我们将在周四下午14:00准时递交签署意见。如果贵方确实无法等待这两天，我们完全理解并尊重贵方的选择。”',
        },
        impact: { composure: +35, leverage: +35, valuationDiff: +5000000 },
        feedback: {
          en: 'Ultimate Composure Triumph! By remaining polite, unbothered, and offering a concrete realistic time (Thursday 2 PM), you called their bluff. The partner will wait.',
          fr: 'Triomphe de Maître ! Calme absolu. En fixant un créneau précis (jeudi 14h), vous désamorcez le bluff. Le fonds attendra.',
          zh: '登峰造极！以静制动，不卑不亢。你没有拒绝合作，而是以专业法治的姿态反向设定了周四下午的明确节奏。99%的优质机构会立刻顺水推舟顺延死线！',
        },
        mindfulRule: {
          en: 'The Power of Willingness to Walk: You have no real leverage until you are genuinely calm about walking away with dignity.',
          fr: 'Pouvoir du Détachement : Vous n’avez aucun levier réel tant que vous n’êtes pas prêt à partir avec dignité et calme.',
          zh: '【博弈心法】敢于离场的定力：在博弈中，真正拥有主导权的永远是那个「做好了随时体面离场准备」的人。',
        },
      },
    ],
  },

  // 5. 期权池投前大洗牌
  {
    id: 'enc_05',
    themeId: 'option_pool_shuffle',
    phaseTitle: {
      en: 'The Option Pool Shuffle',
      fr: 'Le Tour de Passe-Passe du Pool d’Options',
      zh: '期权池投前大洗牌',
    },
    adversaryTactic: {
      en: 'Pre-Money Option Pool Dilution Shuffle',
      fr: 'Dilution Asymétrique du Pool Pré-Money',
      zh: '投前期权池洗牌：要求设立20%未分配期权池，由创始人单方全额稀释',
    },
    adversaryDialogue: {
      en: '"To scale executive hiring, we require a 20% unallocated option pool created entirely pre-money before our investment closes. This is standard Silicon Valley protocol."',
      fr: '« Pour recruter les cadres, nous exigeons un pool d’options de 20% créé entièrement en pré-money avant notre closing. C’est la norme de la Silicon Valley. »',
      zh: '“为了后续招募顶尖高管，我们要求在投前设立20%的未分配期权池，完全从你们创始人的股份里切出来。这是硅谷标准惯例。”',
    },
    hiddenPsychology: {
      en: 'By expanding the pool PRE-money, the investor pays significantly less per share and avoids sharing any dilution for future hiring.',
      fr: 'En créant le pool en pré-money, le fonds paie moins par action et évite de subir la moindre dilution future.',
      zh: '【潜台词探测】所谓的“硅谷惯例”是障眼法。投前设立20%意味着有效投前估值被暗中砍掉了20%，新投资人一股不稀释，创始人被当成冤大头单方面割肉！',
    },
    options: [
      {
        id: 'e5_concession',
        type: 'concession',
        label: {
          en: 'Accept 20% pre-money unconditionally: "Hiring great people is critical, 20% sounds fine."',
          fr: 'Accepter 20% sans négocier : « Recruter est crucial, 20% me va. »',
          zh: '全盘接受：“招人确实重要，20%就20%吧，你们是专业机构听你们的。”',
        },
        impact: { composure: -30, leverage: -35, valuationDiff: -3500000 },
        feedback: {
          en: 'Severe Dilution Loss! You gave up 20% of your equity before the round even funded. Most of that unallocated pool will sit idle.',
          fr: 'Dilution Sévère ! Vous donnez 20% de votre capital avant même le tour. Ce pool non alloué dormira inutilement.',
          zh: '股权重创！未分配期权池过大，等于提前将数百万美元的股权白白送人，后续若未用完，投资人反而坐享其成。',
        },
        mindfulRule: {
          en: 'Hiring Plan Discipline: Never accept an arbitrary option pool number without an itemized 18-month hiring model.',
          fr: 'Discipline de Recrutement : N’acceptez jamais un pourcentage sans budget de recrutement sur 18 mois.',
          zh: '【博弈心法】预算匹配律：永远不要接受凭空捏造的期权池比例，用未来18个月具体高管HC人头表倒推合理池子。',
        },
      },
      {
        id: 'e5_confront',
        type: 'confrontation',
        label: {
          en: 'Outrage: "20% is robbery! We will give zero percent options!"',
          fr: 'Scandale : « 20% c’est du vol ! Ce sera zéro pourcent ! »',
          zh: '激烈抗拒：“20%纯粹是打劫！我们一个点期权都不会给！”',
        },
        impact: { composure: -25, leverage: -20, valuationDiff: 0 },
        feedback: {
          en: 'Unrealistic Extremism! Zero option pool prevents hiring key talent, scaring off serious investors.',
          fr: 'Extrémisme Irréaliste ! Zéro option empêche de recruter des talents clés et fait fuir les fonds sérieux.',
          zh: '盲目极化！一家高速增长的科技公司不可能没有期权池。拒绝任何期权会显得创始人缺乏团队激励格局。',
        },
        mindfulRule: {
          en: 'Constructive Sizing: Aligning incentives requires a reasonable pool, negotiated with mathematical rigor.',
          fr: 'Calibrage Constructif : Un pool raisonnable aligne les intérêts si calculé avec rigueur.',
          zh: '【博弈心法】科学裁剪：用数学模型替代情绪争吵，用真实的期权需求打碎对方的狮子大开口。',
        },
      },
      {
        id: 'e5_mastery',
        type: 'mastery',
        label: {
          en: 'Present precise 18-month hiring model: "Our hiring plan requires a VP Engineering (2.5%), VP Sales (2.5%), and 3 key leads (3%). Total need is 8%. We propose an 8% pool, or sharing any remainder post-money."',
          fr: 'Présenter un modèle RH chiffré : « Notre plan sur 18 mois nécessite un VP Tech (2,5%), un VP Sales (2,5%) et 3 leads (3%), soit 8%. Nous proposons un pool de 8%, ou un partage post-money. »',
          zh: '出具精密HC测算表：“根据18个月招聘路线图，我们需引进VP研发（2.5%）、VP销售（2.5%）及3位核心架构师（3%），真实需求仅为8%。我们同意设立8%期权池，超额部分由投后全体股东同比例分摊。”',
        },
        impact: { composure: +30, leverage: +30, valuationDiff: +4500000 },
        feedback: {
          en: 'Masterful Tactical Rebuttal! By presenting an exact spreadsheet, you eliminated 12% founder dilution while preserving hiring capability.',
          fr: 'Riposte de Génie ! Avec un tableur précis, vous économisez 12% de dilution tout en garantissant les recrutements.',
          zh: '神级破局！用详尽的人才引进颗粒度直接戳破了20%的泡沫，直接为创始团队挽回12%的控股权，专业度拉满！',
        },
        mindfulRule: {
          en: 'Data Disarms Posturing: A granular hiring plan disarms arbitrary VC dilution demands every single time.',
          fr: 'Les Faits Désarment la Posture : Un plan RH granulaire désamorce toujours les exigences arbitraires.',
          zh: '【博弈心法】用颗粒度碾压模糊施压：在严谨的岗位明细面前，任何模糊的“惯例要求”都会瞬间失去立足点。',
        },
      },
    ],
  },

  // 6. 最惠国条款连环套
  {
    id: 'enc_06',
    themeId: 'mfn_clause',
    phaseTitle: {
      en: 'The MFN Entanglement in SAFEs',
      fr: 'Le Piège de la Clause de la Nation la Plus Favorisée (MFN)',
      zh: '最惠国条款连环套',
    },
    adversaryTactic: {
      en: 'Overreaching Most Favored Nation (MFN) Ratchet',
      fr: 'Clause MFN Illimitée sur Billets Convertibles',
      zh: '全天候最惠国条款索求：要求无条件自动享受后续任何战略资方的特殊权益',
    },
    adversaryDialogue: {
      en: '"Since this is an early SAFE note, we require an unconditional MFN clause granting us any rights, discounts, or governance privileges given to any future investor down the road."',
      fr: '« Comme il s’agit d’un SAFE d’amorçage, nous exigeons une clause MFN inconditionnelle nous octroyant tout droit ou avantage futur consenti à un tiers. »',
      zh: '“既然这是早期SAFE可转债，我们必须拥有无条件最惠国条款（MFN）。未来你们给任何后入局投资人的任何更低估值、折扣或特殊特权，我们自动享有。”',
    },
    hiddenPsychology: {
      en: 'The investor wants a free perpetual call option on future strategic deals (e.g., partnerships with Microsoft or NVIDIA) without providing strategic value.',
      fr: 'Le fonds veut un droit gratuit sur vos futurs partenariats stratégiques sans apporter de valeur industrielle.',
      zh: '【潜台词探测】对方企图不劳而获。未来你可能为了引入微软、英伟达等产业巨头而给予特定的业务协同权益，若带了无限制MFN，早期纯财务投资人也会搭便车勒索。',
    },
    options: [
      {
        id: 'e6_concession',
        type: 'concession',
        label: {
          en: 'Sign standard blanket MFN without expiration: "Sounds fair for an early believer."',
          fr: 'Signer la clause MFN sans limite : « Normal pour un investisseur de la première heure. »',
          zh: '无底线答应：“早期投资人确实不容易，给就给吧，都是为了支持我们。”',
        },
        impact: { composure: -25, leverage: -30, valuationDiff: -2000000 },
        feedback: {
          en: 'Governance Entanglement! In your next round, this investor will claim commercial and board rights intended for large strategic partners.',
          fr: 'Verrouillage Juridique ! Au tour suivant, cet investisseur réclamera des droits réservés aux géants industriels.',
          zh: '埋下连环雷！后续引入战略投资人时，早期小股东凭借MFN跳出来要求同等特权，导致关键融资直接告吹。',
        },
        mindfulRule: {
          en: 'Scope Your MFN: Limit MFN strictly to purely economic terms (valuation cap, discount) and expire at Qualified Financing.',
          fr: 'Cadrer la Clause MFN : Limitez-la aux termes purement financiers et terminez-la au prochain tour qualifié.',
          zh: '【博弈心法】MFN边界律：最惠国条款绝不可无限期、无边界。必须限定在纯财务条款（估值上限与折扣率），且下一轮自动终止。',
        },
      },
      {
        id: 'e6_confront',
        type: 'confrontation',
        label: {
          en: 'Denounce: "MFN is parasitic! Take our vanilla note or leave immediately!"',
          fr: 'Dénoncer : « Le MFN est parasitaire ! Prenez la note standard ou partez ! »',
          zh: '愤慨指责：“MFN纯粹是寄生虫条款！要么签纯净版SAFE，要么现在就请便！”',
        },
        impact: { composure: -20, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Needless Friction! Standard YC SAFEs have predefined MFN templates. Hostile rejection makes you seem difficult to work with.',
          fr: 'Friction Inutile ! Le SAFE Y-Combinator prévoit déjà des cadres MFN. Le rejet agressif vous disqualifie.',
          zh: '情绪化短视！YC标准SAFE本身就包含合规MFN版本，过度警惕和敌对情绪让对方怀疑你未来在董事会难以沟通。',
        },
        mindfulRule: {
          en: 'Distinguish Standard from Overreach: Adopt established YC standard language instead of emotional denial.',
          fr: 'Distinguer la Norme de l’Abus : Utilisez le modèle officiel YC plutôt qu’un refus épidermique.',
          zh: '【博弈心法】以标准治越权：直接拿出硅谷YC官方标准文本作为盾牌，既得体合规，又堵死了对手私自加料的野心。',
        },
      },
      {
        id: 'e6_mastery',
        type: 'mastery',
        label: {
          en: 'Bound the MFN cleanly: "We accept the official Y-Combinator MFN form: restricted strictly to valuation cap and discount, and automatically terminating upon our Series A Qualified Financing."',
          fr: 'Encadrer le MFN : « Nous acceptons le modèle officiel YC : strictement limité au cap et à la décote, et prenant fin dès le closing de la Série A. »',
          zh: '精准立规矩：“我们接受YC官方标准版MFN：其效力仅限于估值上限与转股折扣率，且在下一轮合格机构融资完成交割时自动作废；排除任何治理权与商业独家权益。”',
        },
        impact: { composure: +25, leverage: +25, valuationDiff: +2500000 },
        feedback: {
          en: 'Pristine Legal Hygiene! You protected future strategic corporate deals while giving the early investor legitimate economic parity.',
          fr: 'Hygiène Juridique Exemplaire ! Vous protégez vos futurs tours tout en accordant la parité financière légitime.',
          zh: '教科书级规范！既保护了未来战略融资的独立运作空间，又满足了早期投资人的财务平等待遇，无懈可击。',
        },
        mindfulRule: {
          en: 'Automatic Sunsets: Every protective privilege must have an automatic termination event.',
          fr: 'Cadavres Exquis Évités : Tout privilège exceptionnel doit comporter une date ou un événement d’extinction automatique.',
          zh: '【博弈心法】日落条款法则：任何授予投资人的特殊权益，都必须绑定明确的“终止日落事件（Sunset Event）”。',
        },
      },
    ],
  },

  // 7. 苛刻业绩对赌与股权罚没
  {
    id: 'enc_07',
    themeId: 'earnout_clawback',
    phaseTitle: {
      en: 'Aggressive Earnout & Equity Clawback',
      fr: 'Garantie de Performance & Forfait d’Actions Prédateur',
      zh: '苛刻业绩对赌与股权罚没',
    },
    adversaryTactic: {
      en: 'Debt-like Downside Transfer (Forced Founder Equity Forfeiture)',
      fr: 'Transfert de Risque Bancaire (Confiscation du capital fondateur)',
      zh: '明股实债式下行转嫁：未达次年目标则无偿没收创始人30%股权划归投资人',
    },
    adversaryDialogue: {
      en: '"You project $6M ARR next year. If you hit less than 80% of this budget, founders must forfeit 30% of their equity to us as liquidated damages. Put your skin in the game."',
      fr: '« Vous prévoyez 6 M$ d’ARR. Si vous réalisez moins de 80%, les fondateurs devront nous céder 30% de leurs actions en dédommagement. Montrez votre engagement. »',
      zh: '“你们BP里预测明年做到600万ARR。如果实际完成率低于80%，创始团队必须无偿把名下30%的股权转让给我们作为履约赔偿。对自己有信心就签。”',
    },
    hiddenPsychology: {
      en: 'Predatory private equity behavior disguised as venture capital! They want debt-like guarantees with equity upside, shifting normal market headwinds entirely onto founders.',
      fr: 'Comportement prédateur digne des fonds vautours ! Ils veulent la rentabilité de l’equity avec la garantie absolue d’une dette.',
      zh: '【潜台词探测】典型的“伪风投、真高利贷”流氓行为！把市场宏观下行和不可抗力风险全部甩锅给创业者，企图通过业绩对赌零成本夺取控股权。',
    },
    options: [
      {
        id: 'e7_concession',
        type: 'concession',
        label: {
          en: 'Sign out of boastful overconfidence: "We will crush the $6M target easily anyway, let’s sign."',
          fr: 'Signer par excès de confiance : « On va exploser les 6 M$ de toute façon, signons. »',
          zh: '盲目自信赌一把：“我们团队战斗力极强，明年肯定能超额完成，签就签！”',
        },
        impact: { composure: -35, leverage: -40, valuationDiff: -5000000 },
        feedback: {
          en: 'Existential Suicide! A supply-chain shock or macro slowdown could force you to forfeit your company for a 79% performance year.',
          fr: 'Suicide Professionnel ! Un simple choc de marché à 79% du budget vous dépossède de votre propre entreprise.',
          zh: '自杀式豪赌！商业世界充满黑天鹅。哪怕因为宏观汇率或大客户账期导致完成度为79%，你辛辛苦苦打造的公司将被对方合法吞并。',
        },
        mindfulRule: {
          en: 'Venture Capital is Equity Risk: True equity investors share downside risk. Never sign personal equity forfeiture clawbacks.',
          fr: 'Le Capital-Risque Partage le Risque : Un vrai investisseur assume la baisse. Ne signez JAMAIS de pénalité en capital.',
          zh: '【博弈心法】风险投资本质律：股权投资的核心在于共担风险与享受指数级溢价。任何要求无偿割肉退股的资方都是伪VC。',
        },
      },
      {
        id: 'e7_confront',
        type: 'confrontation',
        label: {
          en: 'Furious rant: "You are predatory loan sharks, get out of our office!"',
          fr: 'Fureur : « Vous êtes des usuriers mafieux, sortez de nos bureaux ! »',
          zh: '怒发冲冠：“你们简直就是放高利贷的黑心资方！滚出我们的办公室！”',
        },
        impact: { composure: -25, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Loss of Composure! Emotionally attacking investors damages your reputation in the tight-knit investor syndicate.',
          fr: 'Perte de Contrôle ! Insulter un partenaire vous grille auprès de l’ensemble de la communauté d’investisseurs.',
          zh: '失态决裂！无论对方条款多离谱，破口大骂只会让业内觉得你缺乏商界成年人的克制修养。',
        },
        mindfulRule: {
          en: 'Cold Firmness: Reject predatory terms with icy mathematical dignity, never shouting.',
          fr: 'Fermeté Glaciale : Rejetez l’inacceptable avec une dignité calme, jamais en hurlant.',
          zh: '【博弈心法】冷峻的尊严：以冰冷而体面的法律事实拒绝毒丸，声量越小，往往杀伤力与威慑力越强。',
        },
      },
      {
        id: 'e7_mastery',
        type: 'mastery',
        label: {
          en: 'State non-negotiable institutional boundary: "Venture capital is pure equity risk. We never sign debt clawbacks or equity forfeiture. If milestone achievement is critical to you, we can discuss milestone-based valuation tranches, not equity penalties."',
          fr: 'Fixer la ligne rouge institutionnelle : « Le venture est un investissement en fonds propres. Nous ne signons aucun gage d’actions. Si les étapes vous inquiètent, discutons de tranches de valo, jamais de saisie. »',
          zh: '坚定亮出行业绝对红线：“风投的基石在于同舟共济。我们绝不签署任何个人股权罚没条款。如果里程碑对贵方至关重要，我们可以探讨「分期注资估值阶梯」，但绝不接受惩罚性没收。”',
        },
        impact: { composure: +35, leverage: +30, valuationDiff: +5000000 },
        feedback: {
          en: 'Total Strategic Victory! You drew a principled red line. The investor will withdraw the predatory request.',
          fr: 'Victoire Stratégique Totale ! Vous posez une ligne rouge infranchissable avec calme. Le fonds abandonne cette demande abusive.',
          zh: '绝对定力反制！不留任何幻想地焊死红线，同时给出合规的“分期估值”备选路径，彻底击溃对手的敲诈企图！',
        },
        mindfulRule: {
          en: 'The Unbreakable Red Line: You cannot negotiate with a clause designed to destroy your company’s soul. Say no with serene finality.',
          fr: 'La Ligne Rouge Sacrée : Certaines clauses ne se négocient pas : on dit non avec une sérénité définitive.',
          zh: '【博弈心法】不可动摇的底线：凡是危及创业生命与人格尊严的条款，没有妥协空间。用极致的从容说出最坚定的“不”。',
        },
      },
    ],
  },

  // 8. 领售权与强制出售胁迫
  {
    id: 'enc_08',
    themeId: 'drag_along',
    phaseTitle: {
      en: 'The Drag-Along Forced Sale Trap',
      fr: 'Le Piège du Drag-Along (Obligation de Cession Forcée)',
      zh: '领售权与强制出售胁迫',
    },
    adversaryTactic: {
      en: 'Unchecked Drag-Along (Forced Fire Sale Threshold)',
      fr: 'Drag-Along sans Seuil de Valorisation Minimal',
      zh: '领售权暗箱：投资人持有50%优先股即可强迫全体创始人低价向第三方清盘出售',
    },
    adversaryDialogue: {
      en: '"If a majority of Series A investors vote to accept an acquisition offer after Year 3, founders must drag along and sell all shares at whatever price is offered."',
      fr: '« Si la majorité de la Série A vote une offre d’achat après 3 ans, les fondateurs ont l’obligation de céder 100% de leurs parts quel que soit le montant. »',
      zh: '“三年后如果超过半数A轮投资人同意任何第三方的收购要约，创始团队必须无条件配合领售（Drag-along），以对方开出的任何价格卖掉公司。”',
    },
    hiddenPsychology: {
      en: 'The fund lifecycle is approaching 7-10 years. If the company is doing well but not IPO-scale, they want the power to force a premature $30M fire sale to return cash to their LPs.',
      fr: 'Le fonds arrive en fin de vie. Si la boîte vivote à 30 M$, il veut forcer la vente pour clore son reporting, brisant votre potentiel.',
      zh: '【潜台词探测】该基金存续期即将到期。如果未来公司年营收稳健但未达IPO规模，他们想借此条款在3000万低位强行把公司甩卖清盘，只为给LP交差，扼杀你长成独角兽的梦想！',
    },
    options: [
      {
        id: 'e8_concession',
        type: 'concession',
        label: {
          en: 'Accept passively: "A majority vote of investors sounds like standard corporate democracy."',
          fr: 'Accepter passivement : « La majorité des investisseurs, c’est la démocratie d’entreprise. »',
          zh: '被动顺从：“既然是多数投资人同意，那也算民主表决，应该没问题。”',
        },
        impact: { composure: -30, leverage: -35, valuationDiff: -4000000 },
        feedback: {
          en: 'Disastrous Surrender! You granted investors the unilateral right to force you out of your own creation at a bargain price.',
          fr: 'Capitulation Désastreuse ! Vous donnez le pouvoir de vous éjecter à prix bradé.',
          zh: '拱手送命！投资人的利益是快速套现结清基金，创始人的利益是做大做强。把领售权完全交给资方，等于把自己的命运交给刽子手。',
        },
        mindfulRule: {
          en: 'Drag-Along Alignment: Drag-along requires founder concurrence AND a minimum valuation floor (e.g. 3x-5x of current round).',
          fr: 'Alignement du Drag-Along : Il exige l’accord des fondateurs ET un prix plancher (ex. 3x à 5x le tour actuel).',
          zh: '【博弈心法】领售对等律：领售权生效必须绑定双重门槛——创始人多数决同意，且并购估值不得低于本轮估值的3-5倍。',
        },
      },
      {
        id: 'e8_confront',
        type: 'confrontation',
        label: {
          en: 'Scream: "We will never sell our baby! Drag-along is completely unacceptable under any circumstance!"',
          fr: 'Hurler : « On ne vendra jamais notre bébé ! Le drag-along est inacceptable ! »',
          zh: '情绪失控叫嚣：“我们绝不卖掉自己的心血！任何形式的领售权都休想写进合同！”',
        },
        impact: { composure: -20, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Unprofessional Naivety! M&A buyers require 100% drag-along to avoid rogue minority holdouts. Total refusal stalls closing.',
          fr: 'Naïveté Ruineuse ! Les acheteurs exigent 100% du capital. Refuser tout drag-along bloque la transaction.',
          zh: '教条幼稚！未来的真正买家收购时必须100%收购股权，领售权是为了防止个别流氓小股东敲诈。完全拒绝领售会让公司在未来无法完成大型并购。',
        },
        mindfulRule: {
          en: 'Channel Structure, Don’t Block: Good founders structure safeguards into standard clauses instead of resisting reality.',
          fr: 'Structurer plutôt que Bloquer : Un bon dirigeant sécurise la clause au lieu de nier la réalité du marché.',
          zh: '【博弈心法】筑堤导流而非蛮力堵截：合格的CEO懂得给常规条款装上安全气囊，而不是因噎废食拒绝所有法定义务。',
        },
      },
      {
        id: 'e8_mastery',
        type: 'mastery',
        label: {
          en: 'Add dual-gate protection: "We agree to drag-along under two conditions: (1) Approval by Common holders holding >50%, and (2) The transaction valuation must yield at least 3x the Series A post-money price."',
          fr: 'Insérer la double serrure : « Nous acceptons le drag-along à 2 conditions : (1) Accord de >50% des actions ordinaires, et (2) Prix de vente minimal supérieur à 3x le post-money actuel. »',
          zh: '构筑“双重安全锁”：“我们同意保留领售权，但必须设置双保险：第一，必须获得持有50%以上普通股的创始人代表同意；第二，被收购估值必须不低于本轮投后估值的3倍，且创始人享有优先回购自救权。”',
        },
        impact: { composure: +30, leverage: +30, valuationDiff: +4500000 },
        feedback: {
          en: 'Ironclad Governance Mastery! You protected against lowball fire sales while keeping the company attractive for bona fide 10x M&A.',
          fr: 'Maîtrise Inébranlable ! Vous empêchez la braderie tout en restant compatible avec une sortie à 10x.',
          zh: '炉火纯青的治理艺术！既确保未来大并购畅通无阻，又彻底杜绝了投资人在低位贱卖公司中饱私囊的可能，完美双赢！',
        },
        mindfulRule: {
          en: 'Valuation Floors: A drag-along without a valuation floor is a loaded weapon pointed at founders. Always lock the safety pin.',
          fr: 'Le Plancher Protecteur : Un drag-along sans prix plancher est une arme pointée sur votre tempe. Mettez le cran de sûreté.',
          zh: '【博弈心法】必须装上估值安全栓：没有最低保底价格的领售权，就是一把顶在创始人头上的枪。务必锁死扳机！',
        },
      },
    ],
  },

  // 9. 全额棘轮反稀释毒药
  {
    id: 'enc_09',
    themeId: 'anti_dilution_ratchet',
    phaseTitle: {
      en: 'Full Ratchet Anti-Dilution Ambush',
      fr: 'L’Embuscade du Full Ratchet (Anti-Dilution Radicale)',
      zh: '全额棘轮反稀释毒药',
    },
    adversaryTactic: {
      en: 'Punitive Full Ratchet vs Broad-Based Weighted Average',
      fr: 'Full Ratchet Toxique contre Moyenne Pondérée Standard',
      zh: '偷梁换柱：暗中植入全额棘轮（Full Ratchet），在降价轮次对创始人进行灭顶清洗',
    },
    adversaryDialogue: {
      en: '"For anti-dilution protection, our legal team inserted standard Full Ratchet adjustment. It’s just standard language to protect our downside if tech markets soften."',
      fr: '« Pour l’anti-dilution, nous insérons un Full Ratchet standard. C’est la clause habituelle pour protéger notre mise si la tech ralentit. »',
      zh: '“在反稀释条款方面，我们法务插入了常规的全额棘轮（Full Ratchet）。这只是标准法律套话，大环境不好时稍微保护一下我们的下行净值而已。”',
    },
    hiddenPsychology: {
      en: 'Full Ratchet is NEVER standard in Tier-1 deals. It ignores the number of shares issued in a down round; issuing even $10,000 at a lower price resets their entire multimillion-dollar investment to that micro price.',
      fr: 'Le Full Ratchet n’est JAMAIS la norme ! Il ignore les volumes. Émettre 10k$ à prix bas réajuste tout leur investissement au rabais.',
      zh: '【潜台词探测】他在撒谎！全额棘轮在正规风投界早已被唾弃。哪怕未来你因为紧急救急以较低价格增发了10万元期权，投资人过去的数千万投资将全部重置为这一极低价格，直接稀释掉你80%的股权！',
    },
    options: [
      {
        id: 'e9_concession',
        type: 'concession',
        label: {
          en: 'Leave it to legal boilerplate: "If legal says it’s standard language, let’s keep moving."',
          fr: 'Négliger la clause : « Si l’avocat dit que c’est standard, continuons. »',
          zh: '当成格式条款放过：“法务既然说是常规措辞，那就照旧吧，别为小词句争执了。”',
        },
        impact: { composure: -30, leverage: -35, valuationDiff: -4000000 },
        feedback: {
          en: 'Lethal Blind Spot! Full Ratchet is the most lethal anti-dilution weapon. In a modest down-round, founders are wiped out completely.',
          fr: 'Angle Mort Mortel ! Le Full Ratchet est une guillotine. Au moindre down-round, les fondateurs sont anéantis.',
          zh: '致命盲盒！全额棘轮是协议里最危险的核弹。未来一旦遭遇市场波动发生平价或微降融资，创始人将被瞬间清洗出局。',
        },
        mindfulRule: {
          en: 'Weighted Average Only: Broad-Based Weighted Average is the only balanced anti-dilution standard accepted in institutional VC.',
          fr: 'Moyenne Pondérée Exclusive : La Broad-Based Weighted Average est la seule norme acceptable.',
          zh: '【博弈心法】唯一正道加权平均：国际顶级风投公认的唯有“广义加权平均（Broad-Based Weighted Average）”，全额棘轮绝不可留！',
        },
      },
      {
        id: 'e9_confront',
        type: 'confrontation',
        label: {
          en: 'Insult their integrity: "Only crooked second-rate funds use Full Ratchet! How dare you treat us like fools!"',
          fr: 'Insulte violente : « Seuls les fonds de seconde zone utilisent le Full Ratchet ! Honte à vous ! »',
          zh: '破口大骂：“只有三流骗子基金才会偷偷用全额棘轮！你们到底安的什么心？！”',
        },
        impact: { composure: -25, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Petulant Blowup! You escalated a drafting issue into an existential brawl, damaging deal atmosphere.',
          fr: 'Explosion Émotionnelle ! Vous transformez une négociation de clause en combat d’ego stérile.',
          zh: '意气用事！商业谈判要用外科手术式的法律手术刀切除病灶，把条款交锋变成人身攻击只会让谈判陷入死胡同。',
        },
        mindfulRule: {
          en: 'Precision Over Wrath: Strike out toxic terms with calm statutory citations, not righteous shouting.',
          fr: 'Précision plutôt que Fureur : Biffez les clauses toxiques avec les normes NVCA sans crier.',
          zh: '【博弈心法】用专业降维打击：拿出NVCA标准范本直接划掉全额棘轮，用冷静的专业事实让对方自惭形秽。',
        },
      },
      {
        id: 'e9_mastery',
        type: 'mastery',
        label: {
          en: 'Calmly substitute NVCA formula: "Full Ratchet is disproportionate and unacceptable. We exclusively execute the Broad-Based Weighted Average formula, which fairly accounts for both price and volume of future issuances."',
          fr: 'Remplacement par la norme NVCA : « Le Full Ratchet est disproportionné. Nous appliquons exclusivement la Broad-Based Weighted Average, qui pondère équitablement prix et volumes. »',
          zh: '平静切除毒瘤并植入黄金标准：“全额棘轮严重失衡且不可接受。我们全套协议统一采用NVCA标准的「广义加权平均法（Broad-Based Weighted Average）」，既能根据真实注资规模保护投资人下行，又维护了股权架构的健康稳定。”',
        },
        impact: { composure: +30, leverage: +30, valuationDiff: +4500000 },
        feedback: {
          en: 'Surgical Legal Cleanliness! You struck down a toxic predatory mechanic and cemented market-standard fairness.',
          fr: 'Chirurgie Juridique Parfaite ! Vous supprimez une clause toxique et ancrez l’équité du marché.',
          zh: '专业压制！对方一听你张口就是Broad-Based Weighted Average，立刻知道你在股权精算上是行家，收起了所有侥幸试探。',
        },
        mindfulRule: {
          en: 'Volume Matters: Broad-based anti-dilution accounts for how much was raised, preventing minor share grants from triggering ruinous dilution.',
          fr: 'Le Volume Fait la Loi : La moyenne pondérée tient compte du volume réel émis, protégeant l’équipe.',
          zh: '【博弈心法】量价权衡律：反稀释必须兼顾“价格与发行规模”。只有广义加权平均才能保护企业在暴风雨中生存。',
        },
      },
    ],
  },

  // 10. 90天超长排他期封锁
  {
    id: 'enc_10',
    themeId: 'exclusivity_lockup',
    phaseTitle: {
      en: 'The 90-Day Exclusivity Lockup',
      fr: 'Le Verrouillage d’Exclusivité de 90 Jours',
      zh: '90天超长排他期封锁',
    },
    adversaryTactic: {
      en: 'Extended Exclusivity (No-Shop) Squeeze',
      fr: 'Clause de No-Shop Éternelle pour Asphyxier la Trésorerie',
      zh: '漫天过海排他封锁：意向书要求长达90天的排他禁止接触，企图耗尽创始人现金流',
    },
    adversaryDialogue: {
      en: '"Our audit and technical diligence requires deep scrutiny. We require a 90-day strict no-shop period starting today during which you cannot talk to any other investors."',
      fr: '« Notre audit nécessite une analyse approfondie. Nous exigeons une exclusivité stricte de 90 jours sans aucun contact tiers dès aujourd’hui. »',
      zh: '“我们基金的法务与技术尽调非常严苛深入。从签字之日起，你们必须签署90天严格排他协议（No-Shop），禁止与任何其他潜在投资人接洽。”',
    },
    hiddenPsychology: {
      en: 'By freezing your fundraising for 3 months, your cash reserves drop dangerously low. On Day 80, they will attempt to cut your valuation by 30%, knowing you cannot pivot.',
      fr: 'En gelant vos discussions 3 mois, votre cash s’effondre. Au jour 80, ils renégocieront la valo à la baisse.',
      zh: '【潜台词探测】温水煮青蛙的拖延绞杀！90天排他期会让公司的现金跑道（Runway）严重消耗。等到第80天账上快没钱时，对方就会突然找借口压价30%，赌你没时间找新资方接盘！',
    },
    options: [
      {
        id: 'e10_concession',
        type: 'concession',
        label: {
          en: 'Agree willingly: "Diligence takes time, 90 days shows we have nothing to hide."',
          fr: 'Accepter avec candeur : « La diligence prend du temps, 90 jours prouve notre bonne foi. »',
          zh: '诚意妥协：“深度尽调确实需要时间，90天说明我们行得正坐得端，签吧。”',
        },
        impact: { composure: -30, leverage: -35, valuationDiff: -3500000 },
        feedback: {
          en: 'Runway Hostage Crisis! You handed over your negotiation clock. In 90 days your company will be on life support.',
          fr: 'Prise d’Otage de Trésorerie ! Vous perdez la maîtrise de votre calendrier de survie.',
          zh: '沦为人质！把生命线交给了对手的时间表。三个月后账面现金见底，你将彻底失去翻盘和议价的筹码。',
        },
        mindfulRule: {
          en: 'Runway is Leverage: The party with the shortest cash runway always loses leverage. Never sign prolonged exclusivity.',
          fr: 'Le Cash est le Levier : Celui qui a le moins de runway capitule toujours. Pas d’exclusivité longue.',
          zh: '【博弈心法】现金跑道即是议价权：在商业交锋中，账面现金撑得最久的人永远占据上风。绝不可用超长排他耗干自己！',
        },
      },
      {
        id: 'e10_confront',
        type: 'confrontation',
        label: {
          en: 'Accuse them of stalling: "You just want to bankrupt us! Zero days of exclusivity, we talk to whoever we want!"',
          fr: 'Accusation : « Vous voulez nous asphyxier ! Zéro exclusivité, nous parlons à qui bon nous semble ! »',
          zh: '当面斥责：“你们就是想拖死我们！一天排他都不给，我们想找谁谈就找谁谈！”',
        },
        impact: { composure: -20, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Impractical Posturing! Serious funds will not spend $50,000 on legal audit without standard 30-day exclusivity.',
          fr: 'Posture Impasse ! Aucun fonds sérieux ne dépense 50k$ d’audit sans 30 jours d’exclusivité.',
          zh: '脱离实际！机构正式启动第三方会计所法务尽调需要花费数十万成本，拒绝任何排他会让正规基金无法立项立资。',
        },
        mindfulRule: {
          en: 'Reciprocal Good Faith: Give serious investors reasonable time, bound strictly by performance milestones.',
          fr: 'Bonne Foi Réciproque : Donnez du temps cadré par des jalons précis.',
          zh: '【博弈心法】对等互信与时间结界：给予正规尽调合理的紧凑窗口，但必须给窗口装上里程碑卡口。',
        },
      },
      {
        id: 'e10_mastery',
        type: 'mastery',
        label: {
          en: 'Milestone-based 30-day exclusivity: "We grant 30 days of exclusivity, extendable by 15 days only if initial legal draft is issued by Day 20. If diligence halts, exclusivity terminates automatically."',
          fr: 'Exclusivité de 30 jours à jalons : « Nous accordons 30 jours d’exclusivité, prorogeables de 15 jours si le projet de pacte est remis au jour 20. Sans quoi l’exclusivité prend fin. »',
          zh: '里程碑绑定法：“我们同意给予30天标准排他期；若贵方在第20天前如期出具正式法律文本并启动交割，可顺延15天；若任何一方中途终止尽调，排他协议自动即时失效，互不承担违约金。”',
        },
        impact: { composure: +30, leverage: +30, valuationDiff: +3500000 },
        feedback: {
          en: 'Brilliant Diligence Rhythm! You kept the momentum fast and prevented them from using time as a hostage weapon.',
          fr: 'Rythme Parfait ! Vous maintenez la pression temporelle et évitez la stratégie d’usure.',
          zh: '节奏大师！30天窗口逼迫对方高效推进尽调，里程碑自动解绑机制化被动为主动，既彰显诚意又守住生死线！',
        },
        mindfulRule: {
          en: 'Speed Kills Deal Rot: Long deals rot. Keep diligence compressed to maintain deal momentum and psychological urgency.',
          fr: 'La Lenteur Tue les Deals : Les négociations lentes pourrissent. Maintenez une cadence cadencée.',
          zh: '【博弈心法】夜长梦多律：任何融资周期一旦拖沓就会滋生腐坏与变数。用紧凑的节奏倒逼资金快速打款。',
        },
      },
    ],
  },

  // 11. 竞业穿透与商业机密刺探
  {
    id: 'enc_11',
    themeId: 'information_rights_espionage',
    phaseTitle: {
      en: 'Information Rights & Corporate Conflict',
      fr: 'Droits d’Information & Conflit d’Intérêts Industriel',
      zh: '信息权与商业机密刺探',
    },
    adversaryTactic: {
      en: 'Trojan Information Rights (Competitive Leakage Risk)',
      fr: 'Droits d’Audit sans Muraille de Chine',
      zh: '特洛伊木马：要求无限制调取未脱敏核心算法代码与客户全量名单，企图刺探机密',
    },
    adversaryDialogue: {
      en: '"Our LP mandates require monthly raw customer logs, technical IP architecture diagrams, and pricing algorithm source code under our general Information Rights clause."',
      fr: '« Nos LPs exigent les logs clients bruts, les diagrammes d’architecture IP et le code source de pricing sous couvert des droits d’information. »',
      zh: '“受我们母基金LP审计要求，根据常规信息权，你们必须每月向我们开放未经脱敏的核心客户名录、定价算法模型与底层架构技术细节。”',
    },
    hiddenPsychology: {
      en: 'The venture firm also holds a 15% stake in your closest market competitor. Sharing unredacted customer lists will result in competitive leaks to their portfolio favorite.',
      fr: 'Le fonds possède 15% de votre rival direct. Partager ces données non masquées nourrira votre concurrent.',
      zh: '【潜台词探测】暗藏利益冲突！该机构的关联基金早在去年就投资了你的死敌竞品。如果把核心客户清单和底层定价模型交出去，无异于向竞品直接输送商业底牌！',
    },
    options: [
      {
        id: 'e11_concession',
        type: 'concession',
        label: {
          en: 'Hand over full data: "Transparency is the basis of partnership, we will share everything."',
          fr: 'Donner toutes les données : « La transparence est la base du partenariat. »',
          zh: '双手奉上：“既然成了一家人就要坦诚相待，全量名单和算法我们打包发给你们。”',
        },
        impact: { composure: -35, leverage: -40, valuationDiff: -5000000 },
        feedback: {
          en: 'Catastrophic Trade Secret Breach! Within two months, your rival will undercut your pricing and target your top 20 enterprise clients.',
          fr: 'Fuite Catastrophique ! Dans deux mois, votre rival cassera vos prix sur vos 20 plus gros clients.',
          zh: '商业自戕！不到两个月，竞品就会拿着你的客户名册挨个上门挖角降价，核心算法壁垒荡然无存。',
        },
        mindfulRule: {
          en: 'Information Asymmetry Defense: Information rights are strictly for financial oversight, never trade secret extraction.',
          fr: 'Défense du Secret d’Affaires : Les droits d’info servent au contrôle financier, jamais au pillage de brevets.',
          zh: '【博弈心法】财务知情权与商业秘密的防火墙：股东信息权仅限于财务核算与合规审计，绝不可侵入企业技术与客户隐私内核！',
        },
      },
      {
        id: 'e11_confront',
        type: 'confrontation',
        label: {
          en: 'Threaten legal action: "You are corporate spies working for our competitor! We will sue you!"',
          fr: 'Menace juridique : « Vous êtes des espions industriels ! Nous vous poursuivrons ! »',
          zh: '怒骂斥责：“你们就是派来偷机密的间谍！我们要起诉你们侵犯商业秘密！”',
        },
        impact: { composure: -25, leverage: -20, valuationDiff: 0 },
        feedback: {
          en: 'Defensive Hostility! Threatening lawsuits during fundraising burns relationships and triggers negative industry gossip.',
          fr: 'Paranoïa Déplacée ! Menacer de procès en phase de closing déclenche un boycott du syndicat.',
          zh: '狂怒失策！在还未签字的谈判阶段动辄威胁起诉，显得极其不成熟且歇斯底里，资方会立刻抽身并对外散布不利谣言。',
        },
        mindfulRule: {
          en: 'Chinese Walls: Protect proprietary assets with structured compliance protocols, not paranoia.',
          fr: 'Murailles de Chine : Protégez vos actifs par des protocoles étanches, non par la paranoïa.',
          zh: '【博弈心法】合规隔离墙胜于口诛笔伐：用冰冷的法律保密协议与数据脱敏规则建立物理隔离，让心机者无从下手。',
        },
      },
      {
        id: 'e11_mastery',
        type: 'mastery',
        label: {
          en: 'Enforce standard Chinese Wall: "We provide audited quarterly financial statements and macro KPI summaries under standard NVCA information rights. To protect trade secrets and customer privacy under GDPR, all proprietary algorithms and client identifiers remain confidential and excluded."',
          fr: 'Poser la Muraille de Chine : « Nous fournissons les états financiers audités trimestriels selon la norme NVCA. Pour le secret des affaires et le RGPD, le code source et les identités clients restent confidentiels. »',
          zh: '构筑合规防火墙：“根据NVCA标准信息权，我们按期提供季度审计报表与宏观经营指标。但出于合规隐私及商业秘密保护法，任何底层算法源码与客户未脱敏明细不属于常规信息权范畴，严格受到商业保密法案保护。”',
        },
        impact: { composure: +30, leverage: +30, valuationDiff: +4000000 },
        feedback: {
          en: 'Masterful Corporate Governance! You satisfied fiduciary audit standards while sealing trade secrets behind bulletproof legal walls.',
          fr: 'Gouvernance Parfaite ! Vous respectez l’audit fiduciaire tout en blindant vos secrets industriels.',
          zh: '大师级合规防守！以法律合规为盾牌，有理有据地切断非分企图，既无可挑剔又守住了企业命脉。',
        },
        mindfulRule: {
          en: 'Trust But Verify Barriers: Real partners respect robust corporate data hygiene. Loose data invites exploitation.',
          fr: 'Hygiène des Données : Les vrais partenaires respectent la protection des actifs sensibles.',
          zh: '【博弈心法】严谨即尊重：越是界限分明、数据保护严苛的创始人，在顶级资方眼中越有专业敬畏感。',
        },
      },
    ],
  },

  // 12. 创始人成熟期重置勒索
  {
    id: 'enc_12',
    themeId: 'vesting_reset',
    phaseTitle: {
      en: 'Founder Vesting Reset Coercion',
      fr: 'Le Chantage du Re-Vesting des Fondateurs',
      zh: '创始人成熟期重置勒索',
    },
    adversaryTactic: {
      en: 'Zero-Credit Vesting Reset (Handcuffing the Founders)',
      fr: 'Remise à Zéro du Vesting Fondateur sans Ancienneté',
      zh: '股权重新清零：强制将已创业3年积累的成熟股权作废，要求从头重新开始4年成熟期',
    },
    adversaryDialogue: {
      en: '"Before we fund, all existing founder shares must be placed back into a fresh 4-year vesting schedule with a 1-year cliff and zero credit for past work. We need to know you won’t walk away."',
      fr: '« Avant de virer les fonds, vos actions existantes doivent être réinitialisées sur 4 ans avec cliff d’un an, sans aucune antériorité. Nous devons nous assurer de votre fidélité. »',
      zh: '“打款前，你们过去3年创业的所有股权必须全部清零，重新装进一个全新的4年成熟计划（4-year vesting）里，带1年断崖期（Cliff），既往工龄一律不算。我们得确保你们拿到钱不会撂挑子。”',
    },
    hiddenPsychology: {
      en: 'A zero-credit reset strips founders of past sweat equity. If the board terminates the CEO in month 11, the founder walks away with ZERO shares despite 4 years of real sacrifice.',
      fr: 'Un reset total dépouille les fondateurs. Si le conseil vous révoque au 11e mois, vous partez avec ZÉRO action après 4 ans d’efforts.',
      zh: '【潜台词探测】用心险恶的套马索！既往三年辛酸付出被一笔抹杀。如果答应了带1年Cliff的全新重置，投资人在第11个月通过董事会找借口解雇你，你将净身出户，连一颗期权都拿不到！',
    },
    options: [
      {
        id: 'e12_concession',
        type: 'concession',
        label: {
          en: 'Accept total reset: "I have no intention of leaving anyway, so 4 fresh years is fine."',
          fr: 'Accepter la remise à zéro : « Je ne compte pas partir, donc 4 nouvelles années me conviennent. »',
          zh: '盲目轻信答应：“反正我一辈子都在这家公司，清零重新成熟就重新成熟吧，身正不怕影子斜。”',
        },
        impact: { composure: -35, leverage: -40, valuationDiff: -4500000 },
        feedback: {
          en: 'Lethal Vulnerability! Board dynamics shift. If you are ousted without credit, 100% of your equity evaporates instantly.',
          fr: 'Vulnérabilité Extrême ! Les rapports de force changent. Si vous êtes remercié, tout votre travail est confisqué.',
          zh: '自卸铠甲！董事会未来一旦发生路线分歧，你没有任何护身符。将自己的命门毫无保留地拱手相让，无异于与虎谋皮。',
        },
        mindfulRule: {
          en: 'Credit for Past Sweat: Always demand credit for historical service and insist on double-trigger acceleration.',
          fr: 'Reconnaissance du Passé : Exigez l’ancienneté acquise et une accélération double-trigger.',
          zh: '【博弈心法】既往付出不可抹杀律：过去的创业工龄必须折算，且必须配置双重触发加速成熟（Double-Trigger Acceleration）自卫机制。',
        },
      },
      {
        id: 'e12_confront',
        type: 'confrontation',
        label: {
          en: 'Indignant blowup: "I built this company from nothing! How dare you question my loyalty!"',
          fr: 'Explosion : « J’ai bâti cette entreprise de rien ! Comment osez-vous douter de ma loyauté ! »',
          zh: '悲愤填膺：“这公司是我一砖一瓦干出来的！你们竟然怀疑我的忠诚度？这是对人格的侮辱！”',
        },
        impact: { composure: -25, leverage: -20, valuationDiff: 0 },
        feedback: {
          en: 'Emotional Whining! Investors care about risk mitigation, not subjective sentiments of personal loyalty.',
          fr: 'Jérémiades ! Les fonds gèrent le risque institutionnel, pas les états d’âme de fidélité.',
          zh: '情感绑架无效！风投做决策不是为了交朋友。把机制性风险防范视为“不信任我”，只会暴露出极度脆弱的管理心智。',
        },
        mindfulRule: {
          en: 'Institutional Reassurance: Address the retention concern through structured acceleration rather than hurt feelings.',
          fr: 'Rassurance Institutionnelle : Traitez la rétention par une ingénierie d’accélération, pas par l’ego blessé.',
          zh: '【博弈心法】以机制对冲疑虑：用精密的加速行权设计给双方吃定心丸，永远不要用眼泪和委屈来谈条件。',
        },
      },
      {
        id: 'e12_mastery',
        type: 'mastery',
        label: {
          en: 'Structure balanced vesting compromise: "We agree to re-vesting, but with (1) 50% recognized upfront for 3 years of past operations, (2) Remaining 50% vesting monthly over 2 years with NO cliff, and (3) Full Double-Trigger Acceleration upon acquisition or termination without cause."',
          fr: 'Compromis d’équité équilibré : « Nous acceptons un re-vesting avec : (1) 50% acquis au titre des 3 ans passés, (2) Les 50% restants sur 2 ans sans cliff, et (3) Accélération Double-Trigger en cas de sortie ou révocation sans motif. »',
          zh: '提出权威平衡折衷方案：“理解资方对创始人锁定的审慎考量。我们同意签署成熟期修正案，但必须遵循三条铁律：第一，既往3年折算50%股权即时全额成熟；第二，剩余50%在未来2年按月线性成熟，无任何断崖期；第三，必须附加「双重触发加速成熟（Double Trigger）」保障，在无故解雇或并购时自动全额成熟。”',
        },
        impact: { composure: +35, leverage: +30, valuationDiff: +5000000 },
        feedback: {
          en: 'Elite Founder Protection! You preserved past gains, aligned forward incentives, and locked in bulletproof double-trigger safety.',
          fr: 'Protection d’Élite ! Vous préservez l’acquis, alignez l’avenir et verrouillez la sécurité anti-éviction.',
          zh: '无可挑剔的顶级操盘！既化解了对方担心创始人拿钱跑路的借口，又牢牢守住了过往成果与反恶意架空的保护网，合伙人只能点头叹服！',
        },
        mindfulRule: {
          en: 'The Double-Trigger Armor: Never sign vesting without double-trigger acceleration protecting against hostile takeovers.',
          fr: 'L’Armure Double-Trigger : Ne signez jamais de vesting sans clause d’accélération en cas de révocation injustifiée.',
          zh: '【博弈心法】双重触发加速律：没有配置Double Trigger的Vesting，就是悬在头顶的达摩克利斯之剑。必须焊死铠甲！',
        },
      },
    ],
  },

  // 13. 超级优先认购权垄断
  {
    id: 'enc_13',
    themeId: 'super_pro_rata',
    phaseTitle: {
      en: 'Super Pro-Rata & Allocation Blockade',
      fr: 'Le Super Pro-Rata & le Blocage des Futurs Tours',
      zh: '超级优先认购权垄断',
    },
    adversaryTactic: {
      en: 'Super Pro-Rata Allocation Lock (Blocking Future Lead Investors)',
      fr: 'Super Pro-Rata Prédateur Bloquant les Futurs Leads',
      zh: '超级认购权垄断：要求在未来轮次拥有2倍甚至3倍的超额认购权，挤压未来顶级资方',
    },
    adversaryDialogue: {
      en: '"We want a Super Pro-Rata right to purchase up to 30% of your Series B, regardless of what the new lead investor requests. We want to double down on our winners."',
      fr: '« Nous exigeons un droit de Super Pro-Rata de 30% sur votre Série B, peu importe la demande du futur lead. Nous voulons doubler la mise sur nos gagnants. »',
      zh: '“下一轮B轮融资，我们必须拥有超级优先认购权（Super Pro-Rata），有权直接认购30%的份额，不管未来的新领投机构提什么要求。我们只对赢家下重注。”',
    },
    hiddenPsychology: {
      en: 'A 30% super pro-rata guarantees that future Tier-1 lead investors (Sequoia, Benchmark) won’t have enough allocation to lead your Series B, killing competitive tension.',
      fr: 'Un super pro-rata de 30% empêchera un lead prestigieux de prendre la place nécessaire en Série B, tuant la compétition.',
      zh: '【潜台词探测】恶性占位！B轮新领投机构通常需要拿到20%-25%的基准份额才会开支票。如果老股东趴在盘子里强占30%，新的一线顶级基金根本进不来，直接扼杀未来的竞价热潮！',
    },
    options: [
      {
        id: 'e13_concession',
        type: 'concession',
        label: {
          en: 'Flattered surrender: "You believing in us so strongly for Series B is an honor! Granted."',
          fr: 'Flatté et naïf : « Que vous vouliez remettre autant en Série B est un honneur ! Accordé. »',
          zh: '受宠若惊：“承蒙抬爱！能得到贵方B轮这么大的追投承诺是我们的荣幸，马上同意。”',
        },
        impact: { composure: -30, leverage: -35, valuationDiff: -3000000 },
        feedback: {
          en: 'Future Financing Roadblock! In Series B, top venture leads will walk away because this investor hogs the entire cap table.',
          fr: 'Blocage du Futur Tour ! En Série B, les meilleurs leads partiront car la table de cap est saturée.',
          zh: '断送未来！到B轮时你会发现，没有顶尖基金愿意给老股东抬轿子打工，因为老股东占尽了所有额度，导致新一轮融资无人敢接盘。',
        },
        mindfulRule: {
          en: 'Allocation is Sovereign Currency: Clean allocation space is the key to attracting Tier-1 lead investors down the road.',
          fr: 'L’Allocation est une Devise : Gardez de la place pour attirer un lead de premier rang demain.',
          zh: '【博弈心法】融资额度是稀缺主权：干净充裕的额度是吸引下一代顶级领投人的核心诱饵，绝不可提前预支贱卖！',
        },
      },
      {
        id: 'e13_confront',
        type: 'confrontation',
        label: {
          en: 'Bicker over control: "You are greedy! We will give you zero pro-rata in the future!"',
          fr: 'Dispute : « Vous êtes avares ! Vous n’aurez aucun pro-rata à l’avenir ! »',
          zh: '愤怒翻脸：“你们太贪婪了！连以后的份额都要霸占，我们以后一分钱都不会让你们跟投！”',
        },
        impact: { composure: -20, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Signaling Disaster! Denying standard pro-rata makes founders look spiteful and alienates strong institutional syndicates.',
          fr: 'Signal Toxique ! Refuser le pro-rata classique donne une image d’amateur rancunier.',
          zh: '因噎废食！合规的同比例优先认购权（Pro-rata）是行业公认惯例。如果连老股东保比例的权利都剥夺，会发出极坏的市场信号。',
        },
        mindfulRule: {
          en: 'Pro-Rata Yes, Super-Pro-Rata No: Grant standard pro-rata to protect dilution, but strictly reject artificial super pro-rata monopolies.',
          fr: 'Pro-Rata Oui, Super Non : Accordez le maintien au prorata, mais rejetez le monopole artificiel.',
          zh: '【博弈心法】保比例允许，强霸占坚拒：尊重并保障投资人按现有持股比例跟投的权利，坚决抵制任何超额占位野心。',
        },
      },
      {
        id: 'e13_mastery',
        type: 'mastery',
        label: {
          en: 'Cap at Standard Pro-Rata with Pay-to-Play: "We welcome your capital in Series B through standard 1x Pro-Rata matching your exact ownership percentage. This preserves the necessary 20%+ allocation required by a Tier-1 Series B lead."',
          fr: 'Plafonner au Pro-Rata Standard : « Nous accueillerons votre réinvestissement via le Pro-Rata standard 1x aligné sur votre part réelle. Cela préserve les 20%+ exigés par le futur lead de Série B. »',
          zh: '坚定固守标准Pro-Rata：“我们热烈欢迎贵方在B轮持续跟投，但严格执行「标准1倍同比例优先认购权（Standard Pro-Rata）」，份额与贵方实际持股同频。这能够留出至少20%-25%的充裕空间，确保我们共同引入全球顶尖的B轮领投机构。”',
        },
        impact: { composure: +30, leverage: +30, valuationDiff: +3500000 },
        feedback: {
          en: 'Flawless Syndicate Strategy! You affirmed their partnership while defending the cap table space for your next multi-million dollar lead.',
          fr: 'Stratégie de Syndicat Parfaite ! Vous valorisez leur soutien tout en gardant la table ouverte pour le futur lead.',
          zh: '大师级局观！既成全了对方重注优秀项目的诉求，又体面地把贪婪压制在合规的1x同比例范围内，为未来的领头羊留足了跑马场！',
        },
        mindfulRule: {
          en: 'Protect the Next Lead: Every financing round must be architected to make the NEXT financing round frictionless.',
          fr: 'Préparer le Coup d’Après : Chaque tour doit être pensé pour rendre le suivant limpide et attractif.',
          zh: '【博弈心法】为下一轮领投留出生路：每一次融资条款的设计，都必须以“让下一轮融资顺滑无阻”为唯一最高检验标准。',
        },
      },
    ],
  },

  // 14. 战略投资人业务独家锁链
  {
    id: 'enc_14',
    themeId: 'cvc_exclusivity',
    phaseTitle: {
      en: 'CVC Commercial Exclusivity Shackles',
      fr: 'Les Chaînes d’Exclusivité d’un Corporate (CVC)',
      zh: '战略投资人业务独家锁链',
    },
    adversaryTactic: {
      en: 'Strategic Captive Shackles (CVC demanding ecosystem exclusivity)',
      fr: 'Prise au Piège par un Grand Compte (Exclusivité commerciale fatale)',
      zh: '战略资本锁喉：某巨头旗下CVC投资，要求签署全生态独家排他供应协议，切断竞争对手',
    },
    adversaryDialogue: {
      en: '"We will invest $4M at your dream valuation, but our corporate parent requires an exclusive 3-year commercial distribution lock. You cannot sell your core enterprise software to Amazon or Google."',
      fr: '« Nous investissons 4 M$ à votre valo rêvée, mais notre maison mère exige 3 ans d’exclusivité commerciale. Interdiction de vendre à Amazon ou Google. »',
      zh: '“我们愿意以顶格估值给你注资400万美元。但我们母集团要求签署为期3年的排他性独家商业协议，你们的核心企业级技术不得向亚马逊、谷歌或任何友商销售。”',
    },
    hiddenPsychology: {
      en: 'The CVC is weaponizing equity investment to stifle innovation for their parent corporation. Accepting turns you into a glorified R&D subsidiary, ruining standalone IPO valuation multiples.',
      fr: 'Le corporate étouffe votre potentiel pour servir son groupe. Vous devenez une filiale sous-payée, ruinant l’IPO.',
      zh: '【潜台词探测】戴着金手铐的收编！母集团想用区区400万把你们圈养为专用外包研发部。一旦丧失向全行业销售的权利，未来任何独立IPO或全行业并购都化为泡影！',
    },
    options: [
      {
        id: 'e14_concession',
        type: 'concession',
        label: {
          en: 'Bask in the brand glory: "Partnering exclusively with a Fortune 50 giant validates us completely. Sign!"',
          fr: 'S’émerveiller de la marque : « Être exclusif avec un géant valide notre techno ! Signons ! »',
          zh: '为大厂光环陶醉：“能傍上世界500强大树太牛了，独家就独家，有大集团罩着我们不愁没业务！”',
        },
        impact: { composure: -35, leverage: -45, valuationDiff: -6000000 },
        feedback: {
          en: 'Fatal Valuation Cap! You signed away 70% of the market. Other venture capital will never invest in a captured satellite company.',
          fr: 'Plafond Fatal ! Vous perdez 70% du marché adressable. Aucun VC n’investira dans une filiale masquée.',
          zh: '自断经脉！你自愿放弃了全行业70%以上的潜在客户。从签字那刻起，没有任何纯财务VC再愿意进场，估值倍数暴跌。',
        },
        mindfulRule: {
          en: 'Independent Valuation Multiples: Never sacrifice total addressable market (TAM) for the illusion of corporate security.',
          fr: 'Autonomie du Marché : Ne sacrifiez jamais votre TAM pour l’illusion d’une sécurité corporate.',
          zh: '【博弈心法】主权独立律：创业的最高估值来自独立全行业生态。绝不可为眼前的微薄订单把整个公司的未来降维成附庸。',
        },
      },
      {
        id: 'e14_confront',
        type: 'confrontation',
        label: {
          en: 'Attack their motives: "You are trying to monopolize our hard work and kill our startup! We will tell the press!"',
          fr: 'Attaque frontale : « Vous voulez nous tuer et monopoliser notre travail ! Nous irons voir la presse ! »',
          zh: '撕破脸叫嚣：“你们居心叵测！就是想借投资扼杀创新！我们要向媒体曝光你们的垄断行径！”',
        },
        impact: { composure: -25, leverage: -20, valuationDiff: 0 },
        feedback: {
          en: 'Diplomatic Suicide! Antagonizing an industrial giant with public threats burns corporate partnerships across the industry.',
          fr: 'Suicide Diplomatique ! Menacer publiquement un géant vous ferme toutes les portes industrielles.',
          zh: '外交灾难！大企业有自己的商业利益诉求无可厚非。动辄诉诸媒体只会显得你心智极不成熟，彻底关死与所有产业资方合作的大门。',
        },
        mindfulRule: {
          en: 'Decouple Equity from Commercial: True dealmakers separate investment terms from commercial distribution contracts.',
          fr: 'Découpler l’Investissement du Commercial : Les maîtres séparent le pacte financier du contrat de vente.',
          zh: '【博弈心法】股债商三权分立：高明的谈判者永远把“股权投资协议”与“商业销售合同”严格物理切割，绝不同流合污。',
        },
      },
      {
        id: 'e14_mastery',
        type: 'mastery',
        label: {
          en: 'Strictly decouple equity from commerce: "We deeply value your enterprise synergy, but our charter dictates that we build an open-industry platform. We welcome your equity investment on clean financial terms. Any commercial exclusivity requires a separate agreement tied to a guaranteed $20M annual minimum purchase commitment."',
          fr: 'Découplage chirurgical : « Nous accueillons votre investissement financier pur. Toute exclusivité commerciale relève d’un contrat séparé avec un engagement ferme de 20 M$ d’achats annuels garantis. »',
          zh: '股权与商业彻底物理脱钩：“我们非常珍视母集团的产业协同潜力，但公司章程规定我们必须打造全行业开放平台。我们热烈欢迎贵方以纯财务形式入股；任何商业独家性必须在股权协议之外独立签署，且必须绑定每年不低于2000万美元的「保底最低采购金」，达不到则排他自动失效。”',
        },
        impact: { composure: +35, leverage: +35, valuationDiff: +6000000 },
        feedback: {
          en: 'Masterclass in Commercial Leverage! By putting a concrete $20M price tag on exclusivity, you called their bluff and protected company independence.',
          fr: 'Coup de Génie ! En fixant un prix réel de 20 M$ à l’exclusivité, vous désamorcez le piège et sauvez l’indépendance.',
          zh: '封神反击！对方想空手套白狼，你直接开出2000万保底采购对冲。对方若不敢给钱就必须体面放弃独家，若真给钱则你直接拿到巨额确定性收入，立于不败之地！',
        },
        mindfulRule: {
          en: 'Exclusivity Must Be Paid in Gold: Exclusivity is the most expensive luxury in enterprise commerce. Make them pay market value or walk away.',
          fr: 'L’Exclusivité se Paie au Prix Fort : L’exclusivité est le luxe absolu. Qu’ils paient le prix réel ou passent leur chemin.',
          zh: '【博弈心法】排他是极昂贵的奢侈品：商业世界上没有免费的独家。想要垄断排他，就必须拿出真金白银的保底大单来换！',
        },
      },
    ],
  },

  // 15. 双层超级投票权剥夺
  {
    id: 'enc_15',
    themeId: 'dual_class_voting',
    phaseTitle: {
      en: 'Dual-Class Voting Rights Dilution',
      fr: 'L’Affaiblissement des Droits de Vote Doubles (Dual-Class)',
      zh: '双层超级投票权剥夺',
    },
    adversaryTactic: {
      en: 'Elimination of Super-Voting Rights (Collapsing 10:1 Voting Shares)',
      fr: 'Suppression des Actions à Droits de Vote Multiples (10:1)',
      zh: '削藩夺权：逼迫创始人废除10:1超级投票权AB股架构，强行推行同股同权',
    },
    adversaryDialogue: {
      en: '"Our governance policy strictly opposes dual-class structures. You must collapse your 10:1 Class B super-voting shares into 1:1 common stock prior to our investment closing."',
      fr: '« Notre politique de gouvernance s’oppose aux structures dual-class. Vous devez convertir vos actions 10:1 en actions ordinaires 1:1 avant le closing. »',
      zh: '“我们基金的ESG与治理白皮书坚决反对任何双层股权架构。打款前，创始团队必须把10:1的B类超级投票权全部注销，平权转为1:1同股同权。”',
    },
    hiddenPsychology: {
      en: 'Dual-class stock prevents hostile corporate takeovers and activist investor coups. By stripping super-voting rights, the investor syndicate can later band together to replace the visionary CEO.',
      fr: 'Les actions multiples protègent contre les putschs internes. Sans elles, le syndicat d’investisseurs peut révoquer le CEO à la première crise.',
      zh: '【潜台词探测】剥夺创始人的政治护城河！超级投票权是硅谷科技巨头守护战略愿景的核心武器。一旦废除，后续多轮融资后资方很容易联合其他股东直接在董事会发动政变架空创始人。',
    },
    options: [
      {
        id: 'e15_concession',
        type: 'concession',
        label: {
          en: 'Concede in the name of democracy: "One share, one vote is fair corporate governance. We agree."',
          fr: 'Céder au nom de la démocratie : « Une action, une voix est démocratique. Nous acceptons. »',
          zh: '草率弃权：“一股一票听上去确实挺民主公正的，为了顺利拿钱，转就转吧。”',
        },
        impact: { composure: -30, leverage: -35, valuationDiff: -3500000 },
        feedback: {
          en: 'Surrender of Strategic Vision! Without super-voting stock, early-stage dilution will cause founders to lose voting control by Series B.',
          fr: 'Abandon de la Vision ! Sans vote double, la dilution naturelle vous fera perdre le contrôle dès la Série B.',
          zh: '缴械投降！科技创新需要十年如一日的战略定力。失去超级投票权，随着未来融资股权被稀释到20%以下，你将彻底丧失对公司命运的决断权。',
        },
        mindfulRule: {
          en: 'Founder Vision is the Asset: The investor is backing YOUR vision. Giving up control defeats the rationale of investing in you.',
          fr: 'La Vision est l’Actif : L’investisseur mise sur vous. Perdre le contrôle contredit le sens même de leur mise.',
          zh: '【博弈心法】愿景是无上资产：资方之所以投你，是因为看重创始人的战略前瞻。交出投票权，等于亲手毁掉了他们投资这艘飞船的引擎。',
        },
      },
      {
        id: 'e15_confront',
        type: 'confrontation',
        label: {
          en: 'Condescending retort: "Go invest in dividend utilities then! Tech giants are built on absolute founder control!"',
          fr: 'Réplique méprisante : « Allez investir dans des obligations alors ! La tech exige un contrôle absolu ! »',
          zh: '傲慢反呛：“那你们去买国债和公用事业股票好了！伟大的科技公司哪家不是创始人说一不二绝对控股！”',
        },
        impact: { composure: -20, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Hubris and Arrogance! Dismissing legitimate LP corporate governance concerns makes you appear reckless and uncoachable.',
          fr: 'Arrogance Dangereuse ! Balayer les règles de bonne gouvernance vous fait passer pour un despote incontrôlable.',
          zh: '狂妄自大！虽然话在理，但居高临下的嘲讽语气暴露出极度的傲慢与不可调和，资方会判定创始人缺乏倾听与合作素养。',
        },
        mindfulRule: {
          en: 'Sunsets Over Surrender: Defend dual-class by introducing responsible sunset provisions (death, disability, 10-year horizon).',
          fr: 'Le Compromis du Sunset : Défendez le vote double avec des clauses d’extinction responsables (décès, horizon 10 ans).',
          zh: '【博弈心法】以日落条款换取超级投票权：通过设置科学的“日落条款（Sunset Clause）”（如创始人离职或创业10年后自动转平），打消资方对终身特权的顾虑。',
        },
      },
      {
        id: 'e15_mastery',
        type: 'mastery',
        label: {
          en: 'Defend dual-class with institutional sunset compromise: "Our 10:1 structure follows the proven architecture of Google and Airbnb to protect long-term product breakthroughs. To satisfy LP fiduciary standards, we incorporate a standard 7-year Sunset clause and automatic conversion upon founder departure."',
          fr: 'Défense avec clause Sunset : « Notre structure 10:1 s’inspire de Google et Airbnb pour préserver l’innovation. Pour vos LPs, nous intégrons un sunset de 7 ans et conversion automatique en cas de départ. »',
          zh: '以科技巨头实践构筑日落折衷：“我们的10:1架构沿用了谷歌、爱彼迎等科技先锋的成熟范式，目的在于为长期技术研发筑牢护城河。为了兼顾贵方对治理合规的要求，我们主动配置标准「7年日落条款（Sunset Clause）」及创始人离职即自动失效机制，既守住创新舵盘，又杜绝无限期特权。”',
        },
        impact: { composure: +30, leverage: +30, valuationDiff: +4500000 },
        feedback: {
          en: 'Statesmanlike Governance! You anchored to iconic tier-1 precedents and offered legitimate corporate safeguards.',
          fr: 'Statut d’Homme d’État ! Vous ancrez sur des précédents prestigieux tout en offrant des garde-fous responsables.',
          zh: '政治家级的大局观！既用标杆案例赋予了双层架构无上的正当性，又用日落条款给予资方完美的合规台阶，气度与控股两全其美！',
        },
        mindfulRule: {
          en: 'Guard the Pilot’s Seat: Long-term venture outperformance demands visionary conviction, shielded by balanced governance architecture.',
          fr: 'Gardez le Siège du Pilote : La surperformance venture exige une vision protégée par une gouvernance équilibrée.',
          zh: '【博弈心法】驾驶舱不可让渡：指数级的科技奇迹，永远源于不被短期噪音干扰的战略远见。用精密的治理架构誓死护卫舵盘！',
        },
      },
    ],
  },

  // 16. 最后一刻压价变卦
  {
    id: 'enc_16',
    themeId: 'retrade_bluff',
    phaseTitle: {
      en: 'The 11th-Hour Retrade Bluff',
      fr: 'La Renégociation Déloyale de Dernière Minute (Retrade)',
      zh: '最后一刻压价变卦',
    },
    adversaryTactic: {
      en: 'Predatory Retrading (Cutting Valuation on the Brink of Wiring Funds)',
      fr: 'Chantage au Virement (Baisse brutale de valo au moment de signer)',
      zh: '出尔反尔：在所有尽调完成、打款前夕突然宣称宏观波动，无理单方面压价25%',
    },
    adversaryDialogue: {
      en: '"Our Investment Committee took a second look this morning. Due to recent SaaS public market multiples compression, we can only proceed if we cut the valuation by 25% to $10M. Wire is queued."',
      fr: '« Le comité a revu le dossier ce matin. Vu la baisse des multiples SaaS cotés, nous ne pouvons clôturer qu’à 10 M$ (-25%). Les fonds sont prêts à partir. »',
      zh: '“今天一早投委会做了最终复核。鉴于最近二级市场SaaS估值中枢下移，我们只能把投前估值下调25%至1000万才获批打款。电汇已经备好，你改个字签掉就能秒到账。”',
    },
    hiddenPsychology: {
      en: 'The classic despicable "retrade" move! They know your legal expenses are high and your cash is low. They are testing if you have a viable BATNA (Best Alternative to a Negotiated Agreement).',
      fr: 'Le classique coup de pute du retrade ! Ils savent votre trésorerie basse et testent si vous avez un plan B solide.',
      zh: '【潜台词探测】资本界最臭名昭著的临门一脚敲诈（Retrading）！他们赌你前期花费了昂贵法务尽调费用，且对外已经放出签约风声，以为你无路可退，企图趁火打劫！',
    },
    options: [
      {
        id: 'e16_concession',
        type: 'concession',
        label: {
          en: 'Swallow the bitter pill: "The wire is queued and we need the cash to make payroll. We accept."',
          fr: 'Avaler la couleuvre : « Le virement est prêt et nous avons les salaires à payer. Accepté. »',
          zh: '含泪割肉：“下周还要给团队发工资，电汇既然备好了，那就按1000万签吧。”',
        },
        impact: { composure: -35, leverage: -40, valuationDiff: -3500000 },
        feedback: {
          en: 'Victim of Extortion! Giving in to a last-minute retrade establishes you as weak prey. They will renegotiate subsequent rounds just as ruthlessly.',
          fr: 'Victime d’Extorsion ! Céder au retrade vous marque comme une proie facile pour les tours futurs.',
          zh: '任人宰割！一旦对这种道德底线级别的出尔反尔妥协，投资人会彻底看扁你。在未来的任何决策中，他们都会如法炮制进行极限压榨。',
        },
        mindfulRule: {
          en: 'Never Reward Bad Faith: Rewarding bad-faith renegotiation ensures worse bad-faith in future boardroom conflicts.',
          fr: 'Ne Récompensez Jamais la Mauvaise Foi : Céder à la trahison garantit d’autres trahisons futures.',
          zh: '【博弈心法】绝不奖励背信弃义：在博弈中，一旦你奖励了一次背信行为，就等于为下一次更大的敲诈敞开了大门。',
        },
      },
      {
        id: 'e16_confront',
        type: 'confrontation',
        label: {
          en: 'Scream and curse: "You dishonorable frauds! I will post this on Twitter and destroy your reputation!"',
          fr: 'Hurlements : « Escrocs sans honneur ! Je vais vous pourrir sur LinkedIn et détruire votre réputation ! »',
          zh: '暴跳如雷发烂渣：“你们毫无契约精神！我要把你们的无耻行径发到社交媒体上，让全行业看看你们的真面目！”',
        },
        impact: { composure: -25, leverage: -20, valuationDiff: 0 },
        feedback: {
          en: 'Self-Destructive Tantrum! Publicly threatening a venture firm marks you as a radioactive founder across the entire VC ecosystem.',
          fr: 'Crise Auto-Destructrice ! Menacer de scandale public vous rend radioactif auprès de tous les investisseurs.',
          zh: '自爆式发泄！公开威胁曝光资方，会触发整个VC投资圈的群体自保防御机制，导致其他潜在投资人因为害怕被公开撕扯而不敢近身。',
        },
        mindfulRule: {
          en: 'Maintain Cold Lethal Grace: The most devastating response to bad faith is cold, polite detachment combined with a superior alternative.',
          fr: 'La Grâce Léthale : La réponse la plus féroce à la trahison est le calme glacial adossé à un plan B.',
          zh: '【博弈心法】优雅的杀伤力：面对下作手段，最致命的反击绝不是气急败坏地破口大骂，而是冷若冰霜的礼貌以及掏出更强牌面的底牌。',
        },
      },
      {
        id: 'e16_mastery',
        type: 'mastery',
        label: {
          en: 'Polite, lethal walkaway with BATNA: "Our agreed valuation reflected binding diligence. We do not retrade signed agreements. We have a parallel term sheet from our second-round finalist at our original terms; if your wire cannot execute at the agreed price today, we will release your exclusivity and close with them tomorrow."',
          fr: 'Refus glacial adossé au plan B : « Nous ne renégocions pas un accord finalisé. Nous avons une offre concurrente aux termes convenus. Si votre virement ne part pas au montant fixé aujourd’hui, nous libérons l’exclusivité et signons avec eux demain. »',
          zh: '平静亮出底牌与离场决心：“我们此前签署的Term Sheet是建立在长达四周严谨尽调之上的契约。我们从不在最后一刻背弃商誉、也绝不接受临阵压价。我们备用协议库中有另外两家顶级机构随时准备承接。如果贵方今天无法按照既定协议履约打款，我们将在下午17:00正式宣布排他期解除，并与备选资方签署交割。”',
        },
        impact: { composure: +40, leverage: +45, valuationDiff: +4500000 },
        feedback: {
          en: 'Supreme Strategic Checkmate! By showing you are totally calm, willing to walk, and backed by a competitive option, the partner backs down and wires the original amount.',
          fr: 'Échec et Mat Magistral ! En montrant votre calme absolu et votre offre alternative, le fonds cède et vire la somme initiale.',
          zh: '绝杀破局！真正的威慑不需要任何粗鄙之词。平静、法治、且有实打实的备选方案（BATNA）。合伙人立刻意识到踢到了铁板，大概率会在两小时内打款认怂！',
        },
        mindfulRule: {
          en: 'BATNA is Real Power: You have no real power at the negotiation table without a viable alternative in your back pocket.',
          fr: 'Le BATNA est le Pouvoir Réel : Vous n’avez aucun pouvoir sans une alternative crédible dans votre manche.',
          zh: '【博弈心法】最佳替代方案（BATNA）即真理：手里有粮，心里不慌。谈判桌上永远不要让自己沦落到“非他不可”的绝境。',
        },
      },
    ],
  },

  // 17. 联合投资人跟投绑架
  {
    id: 'enc_17',
    themeId: 'syndicate_holdout',
    phaseTitle: {
      en: 'Syndicate Free-Rider Holdout',
      fr: 'La Prise d’Otage d’un Petit Investisseur du Syndicat',
      zh: '联合投资人跟投绑架',
    },
    adversaryTactic: {
      en: 'Minority Syndicate Holdout & Extortion',
      fr: 'Chantage à la Signature d’un Porteur Minoritaire',
      zh: '搭便车勒索：占股1%的小股东利用全员签字规则故意拖延不签字，暗中索取额外特殊利益',
    },
    adversaryDialogue: {
      en: '"I represent the 1.2% angel syndicate. We refuse to countersign the Series A investor rights agreement unless the company pays us a $50,000 advisory fee and grants us special liquidation rights."',
      fr: '« Je représente les 1,2% d’un syndicat d’angels. Nous ne signerons pas le pacte de Série A sans 50 000 $ de conseil et des droits de sortie spéciaux. »',
      zh: '“我代表上一轮跟投那1.2%份额的小天使。除非公司额外给我们支付5万美元的所谓咨询顾问费并追加单独退出权，否则我们绝不签署A轮投资协议。”',
    },
    hiddenPsychology: {
      en: 'The holdout investor knows the Series A lead requires 100% signature hygiene before wiring $5M. They are exploiting this closing technicality to blackmail management.',
      fr: 'L’actionnaire sait que le nouveau lead exige 100% des signatures. Il instrumentalise cette contrainte pour racketter la société.',
      zh: '【潜台词探测】典型的“碰瓷型钉子户”！他们深知A轮领头机构有合规洁癖，要求全员签署才能打款500万。便企图在最后一公里以区区1.2%的微小份额卡脖子勒索！',
    },
    options: [
      {
        id: 'e17_concession',
        type: 'concession',
        label: {
          en: 'Bribe them to make them go away: "It’s only $50,000, let’s pay it to unblock the $5M wire."',
          fr: 'Payer la rançon : « Ce n’est que 50 000 $, payons pour débloquer les 5 M$. »',
          zh: '息事宁人花钱消灾：“不就5万美元嘛，比起500万大钱，赶紧转给他把字签了算了。”',
        },
        impact: { composure: -30, leverage: -35, valuationDiff: -1500000 },
        feedback: {
          en: 'Blackmail Encouraged! Paying off a holdout angel invites other angels to demand side payments, polluting cap table integrity.',
          fr: 'Chantage Validé ! Rétribuer un parasite incitera les autres à réclamer des pots-de-vin similaires.',
          zh: '养痈遗患！对敲诈者的妥协会迅速在早期投资人间传开，其他跟投人也会效仿索要抽屉协议，导致股权结构彻底变质。',
        },
        mindfulRule: {
          en: 'Never Pay Ransom: Once you pay ransom to a shareholder, you compromise the integrity of your cap table forever.',
          fr: 'Pas de Rançon : Payer une rançon à un associé pollue la légitimité de votre gouvernance à jamais.',
          zh: '【博弈心法】绝不向讹诈妥协：在资本合规面前，任何灰色抽屉协议都是埋在未来的定时炸弹。',
        },
      },
      {
        id: 'e17_confront',
        type: 'confrontation',
        label: {
          en: 'Lash out wildly: "You ungrateful parasite! We made you money and now you stab us in the back!"',
          fr: 'Insultes : « Parasite ingrat ! On vous a fait gagner de l’argent et vous nous poignardez ! »',
          zh: '痛骂白眼狼：“你这个忘恩负义的白眼狼！当初带你赚钱，现在竟然背后捅刀子！”',
        },
        impact: { composure: -20, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Unproductive Venting! Anger gives the extortionist psychological power and prolongs closing paralysis.',
          fr: 'Colère Stérile ! L’insulte renforce son sentiment de toute-puissance et bloque le closing.',
          zh: '无能狂怒！情绪宣泄解决不了闭环法务要求。痛骂只会让钉子户更加有恃无恐地拖延签字。',
        },
        mindfulRule: {
          en: 'Use Legal Force Multipliers: Defeat obstructionists with statutory drag-along thresholds and syndicate majority rules.',
          fr: 'La Force du Droit : Brisez les minorités de blocage par les mécanismes de majorité légaux.',
          zh: '【博弈心法】运用法律武器降维清障：用章程中的多数决与拖售清理机制依法清障，何须与无赖废话。',
        },
      },
      {
        id: 'e17_mastery',
        type: 'mastery',
        label: {
          en: 'Invoke statutory drag-along and lead investor support: "Our existing shareholder agreement specifies that a 75% majority approves new financing instruments and drags along non-signers. The lead investor and 98% of shareholders have executed. You have 24 hours to countersign, after which company counsel will execute the drag-along power-of-attorney clause."',
          fr: 'Activer le Drag-Along légal : « Le pacte stipule que 75% suffisent pour approuver le tour. 98% ont signé. Vous avez 24h avant que nous n’activions le pouvoir de substitution légal. »',
          zh: '启动章程多数决与授权代签条款：“既有公司章程第14条明确规定：持股75%以上多数决即自动代表全体签署合格增资协议，并赋权董事会对异议小股东行使法定代理代签权。目前已有98.8%的股东完成签署。我们给予贵方24小时履约签署；逾期我们将直接启动公司法务代签与清理程序，并保留起诉恶意阻挠融资侵犯全体股东利益的追索权。”',
        },
        impact: { composure: +30, leverage: +30, valuationDiff: +2500000 },
        feedback: {
          en: 'Masterful Legal Checkmate! You used statutory powers to neutralize the holdout cleanly without paying a dime in blackmail.',
          fr: 'Échec et Mat Juridique ! Vous utilisez la force statutaire pour neutraliser le parasite sans verser un centime.',
          zh: '一击毙命的法律重锤！直接以公司法和章程中的代签赋权条款粉碎对方的非分幻想，敲诈者自知理亏只能乖乖签字！',
        },
        mindfulRule: {
          en: 'Draft For Rogue Actors: Good governance anticipates bad actors long before the crisis arrives.',
          fr: 'Anticiper les Fous : Une bonne gouvernance intègre des mécanismes d’écrasement des minorités nocives.',
          zh: '【博弈心法】凡事预则立：优秀的法务架构在创立第一天就设计好了防范少数人卡脖子的清理机制。',
        },
      },
    ],
  },

  // 18. 无限连带责任保证试探
  {
    id: 'enc_18',
    themeId: 'personal_guarantee',
    phaseTitle: {
      en: 'Personal Guarantee & Infinite Liability',
      fr: 'Garantie Personnelle & Responsabilité Illimitée',
      zh: '无限连带责任保证试探',
    },
    adversaryTactic: {
      en: 'Personal Guarantee Trap (Piercing the Corporate Veil)',
      fr: 'Piège de la Caution Personnelle sur Biens Propres',
      zh: '刺破有限责任面纱：要求创始人在合同中签署个人无限连带清偿保证，以家庭房产做抵押',
    },
    adversaryDialogue: {
      en: '"We require founders to personally co-sign as joint guarantors on all reps, warranties, and indemnities, backed by your personal assets and real estate. True entrepreneurs bet their houses."',
      fr: '« Nous exigeons que les fondateurs se portent garants personnels solidaires sur l’ensemble des déclarations et garanties, gagés sur vos biens propres. Les vrais entrepreneurs misent leur maison. »',
      zh: '“为了确保陈述与保证的真实性，我们要求创始人个人提供「无限连带担保责任」，以个人家庭财产和房产兜底一切违约赔偿。真正的创业者要有拿身家性命做赌注的气魄。”',
    },
    hiddenPsychology: {
      en: 'This breaches the sacred principle of limited liability. If a patent dispute or unproven tax claim arises, the fund can seize the founder’s personal bank accounts and family home.',
      fr: 'Cela détruit la responsabilité limitée. Au premier litige fiscal, le fonds peut saisir votre maison familiale.',
      zh: '【潜台词探测】现代公司制度的倒退！有限责任公司就是为了隔离商业风险。把创业者个人身家性命绑在商业合同上，一旦公司遇到不可抗力专利纠纷，你的个人房产存款将被直接查封充公！',
    },
    options: [
      {
        id: 'e18_concession',
        type: 'concession',
        label: {
          en: 'Macho surrender: "I have 100% confidence in our tech, I’ll sign on my personal assets!"',
          fr: 'Héroïsme suicidaire : « J’ai 100% confiance en ma tech, je garantis sur mes biens propres ! »',
          zh: '盲目热血上头：“我对自己的公司有百分百信心！签就签，赌上我的个人房产我也在所不惜！”',
        },
        impact: { composure: -40, leverage: -45, valuationDiff: -5000000 },
        feedback: {
          en: 'Unforgivable Recklessness! You destroyed the corporate veil protecting your family. A rogue IP lawsuit can now bankrupt you personally.',
          fr: 'Inconscience Impardonnable ! Vous détruisez la protection légale de votre famille pour une fanfaronnade.',
          zh: '万劫不复的盲动！把商业经营的正常探索与家庭生计彻底绑定。未来哪怕遇到专利流氓敲诈，也会直接让你个人破产。',
        },
        mindfulRule: {
          en: 'The Corporate Veil is Sacred: Limited liability exists for a reason. Never, ever pierce the corporate veil for equity investors.',
          fr: 'La Responsabilité Limitée est Sacrée : Ne cautionnez JAMAIS un investissement en capital sur vos biens propres.',
          zh: '【博弈心法】有限责任面纱神圣不可侵犯：股权投资是商业冒险，绝不是人身典当。个人无限连带是绝对不可逾越的死线。',
        },
      },
      {
        id: 'e18_confront',
        type: 'confrontation',
        label: {
          en: 'Angry moralizing: "You want to leave my children on the street! You are sick in the head!"',
          fr: 'Drame : « Vous voulez mettre mes enfants à la rue ! Vous êtes des malades mentaux ! »',
          zh: '歇斯底里斥责：“你们这是想让我家破人亡！你们的心肠怎么能这么歹毒黑心！”',
        },
        impact: { composure: -25, leverage: -20, valuationDiff: 0 },
        feedback: {
          en: 'Emotional Breakdown! Resorting to family drama makes you look fragile rather than legally formidable.',
          fr: 'Effondrement ! Pleurnicher sur votre famille affaiblit votre stature de dirigeant.',
          zh: '情绪失控！诉诸道德与家庭同情解决不了博弈问题。必须用现代公司法的铁律给予当头棒喝。',
        },
        mindfulRule: {
          en: 'Institutional Standards: Point to the statutory foundations of venture capital law rather than personal distress.',
          fr: 'Normes Légales Pures : Invoquez le droit des sociétés plutôt que votre détresse personnelle.',
          zh: '【博弈心法】用公司法基石降维回击：用现代商业文明的基础原则碾碎任何奴隶式的倒退条款。',
        },
      },
      {
        id: 'e18_mastery',
        type: 'mastery',
        label: {
          en: 'Enforce standard indemnification cap: "Limited liability is the non-negotiable foundation of corporate equity. We strictly follow the NVCA standard: representations are made by the Company, with liability capped strictly at the escrow amount, excluding deliberate fraud. Personal guarantees are fundamentally off the table."',
          fr: 'Ligne rouge NVCA inviolable : « La responsabilité limitée est le socle de l’equity. Les garanties sont portées par la Société, plafonnées au séquestre, hors fraude délibérée. Les cautions personnelles sont exclues. »',
          zh: '以现代法治立下神圣红线：“有限责任是全球公司制度的立足之基。在风险投资中，任何陈述与保证均由公司主体承担，赔偿上限严格受限于交易托管金（Escrow）或投资总额，仅在发生故意欺诈（Fraud）时追究责任人。个人无限连带保证在现代商业投资中没有任何探讨空间。”',
        },
        impact: { composure: +35, leverage: +35, valuationDiff: +5000000 },
        feedback: {
          en: 'Ironclad Legal Protection! You protected your personal life while affirming legitimate corporate accountability for fraud.',
          fr: 'Protection Inébranlable ! Vous protégez votre sphère privée tout en assumant la responsabilité corporate légitime.',
          zh: '大义凛然，无懈可击！既以国际通行标准粉碎了对方刺破公司面纱的非分试探，又明确表明对真实欺诈承担法定责任，尽显顶级企业家风骨！',
        },
        mindfulRule: {
          en: 'Fraud Yes, Commercial Risk No: Founders are accountable for honesty and diligence, never for unpredictable commercial macro failure.',
          fr: 'Fraude Oui, Risque Non : Vous répondez de votre honnêteté, jamais des aléas économiques.',
          zh: '【博弈心法】欺诈担责，风险自负：创业者对言行真实与恪尽职守负责，绝不对变幻莫测的商业成败承担个人债务！',
        },
      },
    ],
  },

  // 19. 清算顺位超级优先权争夺
  {
    id: 'enc_19',
    themeId: 'seniority_clash',
    phaseTitle: {
      en: 'Seniority vs Pari Passu Priority Clash',
      fr: 'Le Conflit de Séniorité dans la Cascade de Liquidation',
      zh: '清算顺位超级优先权争夺',
    },
    adversaryTactic: {
      en: 'Super-Senior Tiering (Subordinating Earlier Angels & Employees)',
      fr: 'Séniorité Écrasante Évinçant les Premiers Investisseurs',
      zh: '顺位欺凌：晚期资方要求其优先权凌驾于此前所有早期天使与员工之上（Super-Senior）',
    },
    adversaryDialogue: {
      en: '"Because we are writing the largest check of $5M, our Series A must have Senior Liquidation Priority over all prior Seed notes and common stock. We get paid first before anyone else touches a dime."',
      fr: '« Parce que nous mettons 5 M$, notre Série A doit être Senior sur les Seed et le Common. Nous sommes remboursés avant que quiconque ne touche un centime. »',
      zh: '“鉴于我们这次出了500万大钱，我们的A轮必须享有最高超级清算顺位（Senior Priority），踩在之前所有的天使轮和员工普通股头上。退出时我们拿光之后，才轮得到别人。”',
    },
    hiddenPsychology: {
      en: 'Super-senior priority divides your investor base. If a sale occurs at $8M, the Series A takes $5M and Seed angels receive virtually zero, triggering litigation and destroying team morale.',
      fr: 'La séniorité divise vos soutiens. En cas de vente à 8 M$, la Série A prend tout, ruinant vos premiers business angels.',
      zh: '【潜台词探测】分化股东、制造内部仇恨！如果同意超级优先顺位，未来以小幅溢价退出时，新资方吃干抹净，早期陪你度过生死关头的天使投资人和员工将一无所获，引发股东诉讼与人心涣散！',
    },
    options: [
      {
        id: 'e19_concession',
        type: 'concession',
        label: {
          en: 'Accept because the check is large: "They gave the most money, they deserve to be paid first."',
          fr: 'Céder au montant du chèque : « Ils mettent le plus d’argent, c’est normal. »',
          zh: '嫌贫爱富随波逐流：“谁给的钱多谁说了算，他们拿第一顺位也说得过去。”',
        },
        impact: { composure: -30, leverage: -35, valuationDiff: -3000000 },
        feedback: {
          en: 'Syndicate Alienation! You threw your earliest believers under the bus. Your angel board will block the transaction in protest.',
          fr: 'Trahison des Premiers Anges ! Vous sacrifiez vos premiers soutiens, qui bloqueront le tour.',
          zh: '背信弃义的灾难！为了新欢抛弃患难与共的旧臣。早期天使股东有权在股东大会上否决这一不平等协议，直接导致融资难产。',
        },
        mindfulRule: {
          en: 'Pari Passu Equity Solidarity: Treat Preferred rounds pari passu (on equal footing) to maintain shareholder harmony.',
          fr: 'Solidarité Pari Passu : Traitez les séries sur un pied d’égalité pour garder l’harmonie.',
          zh: '【博弈心法】同等顺位（Pari Passu）法则：保持各轮优先股在同一顺位按比例分配，是维护股东团结与团队士气的生命线。',
        },
      },
      {
        id: 'e19_confront',
        type: 'confrontation',
        label: {
          en: 'Self-righteous anger: "You have no loyalty! Our angel investors took real risk, not you corporate fat cats!"',
          fr: 'Colère moralisatrice : « Vous n’avez aucune morale ! Nos angels ont pris de vrais risques, pas vous ! »',
          zh: '道德讨伐：“你们太没有道义了！天使投资人才是冒真正风险的人，你们凭什么坐收渔利踩别人头上！”',
        },
        impact: { composure: -20, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Emotional Bickering! New capital naturally asks for seniority. Counter with clean math and tiered distribution models.',
          fr: 'Querelle Inutile ! L’argent frais cherche toujours la priorité. Répondez par la structure mathématique.',
          zh: '宣泄无补于事！新进大资金本能地追求下行安全感。道德审判解决不了利益诉求，唯有用成熟的阶梯同等顺位模型破局。',
        },
        mindfulRule: {
          en: 'Structure Unifies Capital: Craft equitable waterfalls where all classes share proportional returns.',
          fr: 'La Structure Réconcilie le Capital : Construisez une cascade équitable où chacun est respecté.',
          zh: '【博弈心法】用架构化解分歧：用科学的清算瀑布让多轮资方同进同退，把零和博弈转化为合力共赢。',
        },
      },
      {
        id: 'e19_mastery',
        type: 'mastery',
        label: {
          en: 'Enforce standard Pari Passu waterfall: "To maintain fiduciary alignment across our cap table, all Preferred series participate on a Pari Passu (pro-rata) basis. If you require downside buffering, we support an agreed minimum valuation hurdle, but all preferred dollars stand shoulder-to-shoulder."',
          fr: 'Imposer le Pari Passu universel : « Pour aligner nos actionnaires, toutes les actions de préférence sont traitées Pari Passu au prorata. Tout dollar investi se tient côte à côte. »',
          zh: '坚守国际通行Pari Passu同等顺位：“为了维护全体股东与管理团队的核心利益协同，所有优先股一律遵循「同等顺位、按股分配（Pari Passu）」的黄金法则。如果贵方对下行保护有顾虑，我们可以在分期估值上微调，但绝不在清算阶级上开撕裂股东阵营的口子。”',
        },
        impact: { composure: +30, leverage: +30, valuationDiff: +4000000 },
        feedback: {
          en: 'Statesmanlike Cap Table Leadership! You preserved loyalty with early angels while successfully closing the Series A lead.',
          fr: 'Autorité Exemplaire ! Vous protégez vos premiers soutiens tout en signant votre Série A.',
          zh: '大将统帅风度！不负早期引路人，不偏迎晚期大资本。在两者之间确立公正的同比例原则，赢得了全场所有投资人的深度敬佩！',
        },
        mindfulRule: {
          en: 'Shoulder-to-Shoulder Capital: When capital stands on equal footing, incentives align toward maximal long-term upside.',
          fr: 'Égalité du Capital : Quand le capital est logé à la même enseigne, tout le monde vise le sommet.',
          zh: '【博弈心法】平等待人则人心归一：只有让所有出资人在退出清算中同甘共苦，团队才能心无旁骛冲击百倍独角兽！',
        },
      },
    ],
  },

  // 20. 上市登记权突袭与禁售不平等待遇
  {
    id: 'enc_20',
    themeId: 'registration_rights_lockup',
    phaseTitle: {
      en: 'Registration Rights & Lock-up Arbitrage',
      fr: 'L’Arbitrage des Droits d’Enregistrement et du Lock-Up d’IPO',
      zh: '上市登记权突袭与禁售不平等待遇',
    },
    adversaryTactic: {
      en: 'IPO Lockup Asymmetry (Forcing Founders into 360-Day Freeze while VCs Exit Early)',
      fr: 'Asymétrie de Lock-Up d’IPO (Les fondateurs bloqués, les fonds encaissent)',
      zh: '上市流动性掠夺：要求在IPO时享有优先搭售登记权先行套现，强令创始人额外锁定360天不得减持',
    },
    adversaryDialogue: {
      en: '"In the event of an IPO, our fund receives first-priority Demand Registration rights to sell 100% of our position. Management must sign a 360-day extended lock-up preventing any founder liquidity."',
      fr: '« Lors de l’IPO, notre fonds aura priorité absolue pour vendre 100% de ses parts. Les fondateurs devront s’engager sur un lock-up prolongé de 360 jours sans aucune liquidité. »',
      zh: '“在未来IPO上市时，我们基金享有最高阶的「主导登记权（Demand Registration）」，优先把名下老股100%抛售套现；而创始团队必须签署长达360天的禁售锁定期，不准卖出一分钱。”',
    },
    hiddenPsychology: {
      en: 'They want to dump their shares in the immediate post-IPO retail hype, leaving founders to hold the bag if public markets experience lockup expiration selling pressure.',
      fr: 'Ils veulent encaisser sur la hype d’ouverture et vous laisser assumer la baisse boursière ultérieure.',
      zh: '【潜台词探测】终极金蝉脱壳！他们想在敲钟首日的资本泡沫中先把基金本金和利润全部兑现离场，逼着创业者承担长达一年的锁定期与股价破发风险，拿创始团队当接盘肉盾！',
    },
    options: [
      {
        id: 'e20_concession',
        type: 'concession',
        label: {
          en: 'Overwhelmed by IPO dreams: "An IPO is so far away, whatever lock-up they want is fine."',
          fr: 'Étourdi par le mot IPO : « L’IPO est si loin, peu importe le lock-up qu’ils demandent. »',
          zh: '被敲钟梦想冲昏头脑：“IPO那都是十年后的事了，他们爱怎么锁就怎么锁吧，能上市就行。”',
        },
        impact: { composure: -30, leverage: -35, valuationDiff: -3500000 },
        feedback: {
          en: 'Final Hour Blindness! When IPO day comes, this clause will legally lock founders while investors dump and crash the share price.',
          fr: 'Cécité du Dernier Tour ! À l’IPO, le fonds bradera ses parts et vous regarderez vos millions fondre sans pouvoir agir.',
          zh: '终局溃败！当企业历经千难万险终于上市敲钟，投资人抛售套现导致股价大跌，而创始团队被死死锁在原地眼睁睁看着财富灰飞烟灭。',
        },
        mindfulRule: {
          en: 'Closing Integrity: The terms you sign at Series A cast a 10-year shadow all the way to NASDAQ.',
          fr: 'La Clôture Réfléchie : Les clauses signées en Série A projettent leur ombre jusqu’au Nasdaq.',
          zh: '【博弈心法】见微知著，预见终局：早期签署的每一个不起眼的登记权与锁定期条款，都会在敲钟纳斯达克的那一天投下决定性的阴影。',
        },
      },
      {
        id: 'e20_confront',
        type: 'confrontation',
        label: {
          en: 'Suspicious rant: "You are planning to dump and run! You don’t believe in our company’s long-term future!"',
          fr: 'Crise de paranoïa : « Vous préparez votre fuite ! Vous ne croyez pas en nous sur le long terme ! »',
          zh: '歇斯底里指责：“你们这是打定主意要套现跑路！从一开始你们就没打算长期陪跑！”',
        },
        impact: { composure: -20, leverage: -15, valuationDiff: 0 },
        feedback: {
          en: 'Unproductive Argument! Funds are legally bound to deliver liquidity to LPs. Structure the lockup equitably instead of emoting.',
          fr: 'Polémique Stérile ! Les fonds ont le devoir de générer de la liquidité. Encadrez le lock-up avec équité.',
          zh: '幼稚抱怨！基金本身就有存续期和向LP返还流动性的受托职责。指责资本追求退出是天真，用对等的协同机制约束退出才是成熟。',
        },
        mindfulRule: {
          en: 'Align the Exit: Ensure all parties share liquidity and lockup durations proportionally on the public markets.',
          fr: 'Aligner la Sortie : Partagez la liquidité et la durée de blocage au prorata strict.',
          zh: '【博弈心法】退出的同生共死律：将所有股东的锁定期与套现节奏完全绑定，同舟共济才能换来敲钟时刻的真正自由。',
        },
      },
      {
        id: 'e20_mastery',
        type: 'mastery',
        label: {
          en: 'Enforce underwriter parity and pro-rata piggyback: "All IPO lockups are determined exclusively by the managing investment bank underwriters on a standard 180-day equal basis for all shareholders. Furthermore, all secondary registration rights must operate on a strict Pro-Rata Piggyback mechanism. We enter the market together; we exit together."',
          fr: 'Parité des banques d’affaires : « Le lock-up est fixé par les banques chefs de file sur une base égale de 180 jours. Tout enregistrement secondaire est strictement Pro-Rata Piggyback. Nous entrons ensemble, nous sortons ensemble. »',
          zh: '以承销商国际通则锁定平权同进同退：“所有IPO禁售锁定期必须交由上市主承销商（投行）统一裁定，所有主要股东一律遵循标准的「180天同等锁定期（180-day lockup）」，绝不允许资方先行套现。同时，任何附带登记权严格采用「同比例附带（Pro-Rata Piggyback）」机制。同舟共济进场，共享胜利离场！”',
        },
        impact: { composure: +40, leverage: +40, valuationDiff: +6000000 },
        feedback: {
          en: 'Grandmaster Pinnacle! You sealed the ultimate victory: complete parity from the first angel check all the way to ringing the opening bell.',
          fr: 'Apogée Magistrale ! Vous scellez la victoire ultime : une parité parfaite du premier chèque jusqu’au gong de la Bourse.',
          zh: '登峰造极的大圆满！从天使轮的第一张可转债，一路过关斩将至纳斯达克的敲钟时刻，用坚如磐石的法治定力捍卫了全体战友的尊严与财富，博弈宗师实至名归！',
        },
        mindfulRule: {
          en: 'Together We Ring the Bell: Real dealmaking composure is not winning an argument—it is building an unshakeable fortress of shared honor and prosperity.',
          fr: 'Gagner Ensemble : La vraie sérénité en négociation n’est pas de vaincre un rival, mais de bâtir une forteresse indestructible de prospérité partagée.',
          zh: '【博弈心法】胜兵先胜，荣耀与共：博弈的终极意义不是打败对手，而是在风暴中以不可撼动的定力构建一个风雨同舟、荣辱与共的伟大城堡！',
        },
      },
    ],
  },
];
