import { LocalizedString } from '../types';

export type CapTableDefenseTier = 'junior' | 'mid' | 'senior';

export interface CapTableQuestion {
  id: string;
  tier: CapTableDefenseTier;
  category:
    | 'equity_threshold'
    | 'esop_shuffle'
    | 'board_majority'
    | 'dual_class'
    | 'liquidation_preference'
    | 'anti_dilution'
    | 'drag_along'
    | 'founder_vesting'
    | 'pay_to_play'
    | 'protective_provisions'
    | 'safe_vs_priced'
    | 'dividend_overhang';
  title: LocalizedString;
  context: LocalizedString; // Boardroom dialogue or venture partner quote
  givenFacts: {
    label: LocalizedString;
    value: string;
  }[];
  question: LocalizedString;
  options: {
    text: string;
    isCorrect: boolean;
    trapNote: LocalizedString; // Why this option is right or a common pitfall
  }[];
  tacticalDebrief: {
    title: LocalizedString;
    verdict: 'masterstroke' | 'solid_defense';
    mechanicsExplained: LocalizedString;
    realWorldCase: LocalizedString; // Precedent from Silicon Valley/Wall Street
    goldenRule: LocalizedString; // Founder doctrine
  };
  timeLimitSeconds: number;
}

// Institutional Venture Partners pool for realism
const VC_FIRMS = [
  { name: 'Sarah Lin', firm: 'Sequoia Capital' },
  { name: 'Marcus Vance', firm: 'Horizon Ventures' },
  { name: 'Victoria Sterling', firm: 'Sterling & Bourne' },
  { name: 'Elena Rostova', firm: 'Index Partners' },
  { name: 'Kenji Takahashi', firm: 'Apex Vision Fund' },
  { name: 'David Khosla', firm: 'Founders Syndicate' },
  { name: 'Dr. Arthur Chen', firm: 'Singularity Frontier' },
  { name: 'Sophie Bernard', firm: 'Benchmark Capital' },
  { name: 'Alexandre Meyer', firm: 'Accel Partners' },
  { name: 'Liam O’Connor', firm: 'Bessemer Venture' },
  { name: 'Catherine Dupont', firm: 'Tiger Global Capital' },
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ==========================================
// 12 DYNAMIC PROCEDURAL GENERATOR ARCHETYPES
// ==========================================

// 1. ESOP Shuffle Pre-Money vs Post-Money Dilution Hit
function genEsopShuffleTrap(id: string, timeLimit: number): CapTableQuestion {
  const vc = getRandomItem(VC_FIRMS);
  const investmentM = getRandomItem([4, 5, 6, 8, 10]);
  const postM = investmentM * getRandomItem([4, 5]);
  const preM = postM - investmentM;
  const poolPct = getRandomItem([15, 18, 20]);
  const realHiringNeed = getRandomItem([7, 8, 10]);

  return {
    id,
    tier: 'junior',
    category: 'esop_shuffle',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The Pre-Money Option Pool Shuffle',
      fr: 'Le Piège du Pool ESOP Pré-Money',
      zh: '期权池投前大洗牌（Option Pool Shuffle）',
    },
    context: {
      en: `"${vc.name} from ${vc.firm}: 'We offer $${investmentM}M on a $${postM}M Post-Money valuation ($${preM}M Pre). However, you must establish an unallocated ${poolPct}% ESOP pool strictly prior to closing.'"`,
      fr: `"${vc.name} de ${vc.firm} : 'Nous investissons ${investmentM} M$ sur ${postM} M$ Post-Money. Mais vous devez créer un pool BSPCE de ${poolPct} % strictement en pré-money.'"`,
      zh: `“${vc.firm}合伙人 ${vc.name}：‘我们愿意出资 ${investmentM}00 万美元，按投后 ${postM}00 万美元（投前 ${preM}00 万）交割。但硬性前提是：必须在交割前由老股东增设 ${poolPct}% 的未分配期权池。’”`,
    },
    givenFacts: [
      { label: { en: 'Investment', fr: 'Investissement', zh: '融资金额' }, value: `$${investmentM}M` },
      { label: { en: 'Post-Money Valuation', fr: 'Valorisation Post', zh: '投后估值' }, value: `$${postM}M` },
      { label: { en: 'Demanded Pre-Money Pool', fr: 'Pool Exigé', zh: '索要投前期权池' }, value: `${poolPct}%` },
    ],
    question: {
      en: 'Why is demanding the option pool entirely in the PRE-money a predatory dilution trap for founders?',
      fr: 'Pourquoi exiger un pool d’options entièrement en PRÉ-money constitue-t-il un piège de dilution prédateur ?',
      zh: '为何投资人要求在“投前（Pre-Money）”一次性预留大额期权池是严重的隐性压价与过度稀释陷阱？',
    },
    options: shuffle([
      {
        text: `期权池由创始人100%独自买单，等同于将有效投前估值直接砍去${poolPct}%，投资人入场免受该期权池稀释`,
        isCorrect: true,
        trapNote: {
          en: 'Correct: Pre-money pool forces existing founders to absorb 100% of the dilution upfront, giving the incoming VC a cheaper unallocated bonus.',
          fr: 'Exact : Le pool en pré-money est financé à 100 % par les fondateurs. L’investisseur entre sur une base décotée sans subir la dilution.',
          zh: '完全正确！投前期权池由创始人独自用老股承担，投资人相当于以极低实际价格拿到无稀释特权。正确反制是用未来18个月招聘计划（如仅需7-8%）据理力争。',
        },
      },
      {
        text: '期权池由新进VC与创始人按出资比例共同承担稀释，双方股权被平等扣除',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: If it is created in Pre-Money, the investor shares ZERO dilution from this pool.',
          fr: 'Faux : En pré-money, l’investisseur ne subit aucune dilution de ce pool.',
          zh: '错误！这正是最常见的误区。如果写明在投前（Pre-Money）增加，新投资人分文不付，稀释完全由创始人独自承担！',
        },
      },
      {
        text: '设立投前期权池会让期权行权价虚高，导致未来无法招募到优秀工程师',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Strike price is set by independent 409A valuation, not the pool timing.',
          fr: 'Faux : Le prix d’exercice dépend de la valorisation 409A indépendante.',
          zh: '错误！期权行权价是由独立的409A资产评估决定的，期权池时间点陷阱的实质是对老股东股权的无情劫掠。',
        },
      },
      {
        text: '只要估值超过2000万美元，期权池设立在投前或投后对创始人没有任何数学影响',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Pre vs Post timing creates huge equity percentage swings regardless of valuation size.',
          fr: 'Faux : L’impact en pourcentage reste massif quelle que soit la valorisation.',
          zh: '错误！无论估值多大，投前增加期权池都会让创始团队直接损失5%~8%的核心绝对控股权！',
        },
      },
    ]),
    tacticalDebrief: {
      title: {
        en: 'The Option Pool Shuffle Counter-Offensive',
        fr: 'La Riposte au Piège du Pool ESOP',
        zh: '期权池大洗牌破局法则：用招聘精算表迎头痛击',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: `By demanding a ${poolPct}% pool in Pre-Money, the VC lowers the real pre-money valuation by millions. The professional founder counter is: "Here is our 18-month hiring model; we only need ${realHiringNeed}%, and any excess must be Post-Money."`,
        fr: `En imposant ${poolPct} % en pré-money, le fonds fait baisser le pré-money effectif. La parade consiste à opposer un plan d’embauche réel limité à ${realHiringNeed} %.`,
        zh: `投资人张口就要${poolPct}%的投前期权池，表面是“为团队留人才”，实质是将真实投前估值暗中砍去几百万元！创始人绝不能在哲学上争辩，而是出示详尽的18个月Headcount招聘预算表（证明仅需${realHiringNeed}%），省下上千万元股权价值！`,
      },
      realWorldCase: {
        en: 'Venture Capital firms routinely anchor at 15-20% pools. Founders with hiring budgets consistently negotiate this down to 8-10%, directly protecting 5-7% founder equity.',
        fr: 'Les fonds ancrent systématiquement à 15-20 %. Les fondateurs armés d’un budget précis ramènent ce chiffre à 8-10 %.',
        zh: '硅谷顶级律所NVCA统计，VC开出的Term Sheet默认多为15-20%投前池。准备了招聘明细表的创始人平均能压到8-10%，直接守住5%-7%核心股权。',
      },
      goldenRule: {
        en: 'Golden Rule: Never accept an arbitrary pool size. Calculate the exact 12-18 month headcount budget, and refuse pre-money padding.',
        fr: 'Règle d’Or : Ne concédez jamais un pool arbitraire. Calculez les besoins réels à 12-18 mois.',
        zh: '防卫铁律：绝不接受拍脑袋的期权池比例！拿出12-18个月职位精算表，拒绝为VC的免费入场大礼包买单！',
      },
    },
  };
}

// 2. Boardroom Majority & The Steve Jobs 1985 Ousting Trap
function genBoardroomMajorityDefense(id: string, timeLimit: number): CapTableQuestion {
  const vc = getRandomItem(VC_FIRMS);
  const founderSeats = getRandomItem([2, 3]);
  const investorSeatsAsked = founderSeats + 1;

  return {
    id,
    tier: 'junior',
    category: 'board_majority',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Boardroom Majority & The CEO Ousting Trap',
      fr: 'Majorité au Conseil & Risque de Révocation du DG',
      zh: '董事会多数失控与免职政变陷阱',
    },
    context: {
      en: `"${vc.name} from ${vc.firm}: 'We want to lead your Series A, but we require a 5-person board composed of ${founderSeats} founders and ${investorSeatsAsked} investor representatives so we can guide corporate governance.'"`,
      fr: `"${vc.name} de ${vc.firm} : 'Nous exigeons un conseil de 5 membres : ${founderSeats} fondateurs et ${investorSeatsAsked} représentants investisseurs pour veiller à la gouvernance.'"`,
      zh: `“${vc.firm} ${vc.name}：‘我们可以领投A轮，但治理要求是设立5人董事会：包含 ${founderSeats} 名创始人席位与 ${investorSeatsAsked} 名投资人席位，以便专业机构行使战略监督。’”`,
    },
    givenFacts: [
      { label: { en: 'Proposed Founders Seats', fr: 'Sièges Fondateurs', zh: '拟定创始人席位' }, value: `${founderSeats} 席` },
      { label: { en: 'Proposed Investor Seats', fr: 'Sièges Investisseurs', zh: '拟定投资人席位' }, value: `${investorSeatsAsked} 席` },
      { label: { en: 'Board Decision Rule', fr: 'Règle de Vote', zh: '董事会表决规则' }, value: 'Simple Majority (简单多数过半)' },
    ],
    question: {
      en: 'What is the catastrophic danger of allowing investor representatives to outnumber founder seats on the Board of Directors?',
      fr: 'Quel est le danger mortel de laisser les investisseurs obtenir la majorité des sièges au conseil d’administration ?',
      zh: '允许外部投资人席位超过创始人席位（形成资本多数董事会）的致命危险是什么？',
    },
    options: shuffle([
      {
        text: '外部投资人随时可以召开临时董事会以简单多数投票当场免除创始人CEO职务，夺取公司控制权',
        isCorrect: true,
        trapNote: {
          en: 'Correct: Board of Directors possesses executive hire/fire power. When investors have majority seats, the founder serves at their mercy.',
          fr: 'Exact : Le conseil nomme et révoque le directeur général. Une majorité d’investisseurs permet de licencier le fondateur à tout moment.',
          zh: '完全正确！董事会直接拥有CEO任免权。一旦投资人席位过半，任何战略分歧时资本均可简单多数强行罢免创始人！',
        },
      },
      {
        text: '投资人董事必须按公司法要求每天到办公室打卡上班，增加公司的日常管理成本',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Board members only attend periodic meetings, not daily operations.',
          fr: 'Faux : Les administrateurs n’interviennent pas dans la gestion opérationnelle quotidienne.',
          zh: '错误！董事不是日常雇员，不用每天上班；董事掌握的是战略生死裁决权与CEO任免权。',
        },
      },
      {
        text: '外部董事席位过多会导致公司每年多缴纳高达25%的企业增值税与股东分红税',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Board composition has zero impact on corporate tax brackets.',
          fr: 'Faux : La structure du conseil n’a aucun rapport avec la fiscalité.',
          zh: '错误！董事会席位数量与税收分红税率毫无关系，这是毫无常识的干扰项。',
        },
      },
      {
          text: '只要创始人持有超过50%的普通股股份，董事会即使是投资人占多数也无法罢免创始人',
          isCorrect: false,
          trapNote: {
            en: 'Incorrect: Shareholder votes are separate from Board actions! Board members vote per capita, and the Board hires/fires the CEO.',
            fr: 'Faux : Le conseil d’administration décide de la révocation du DG à la majorité des sièges, indépendamment des actions ordinaires !',
            zh: '致命误区！股东大会与董事会是两套独立的权力体系！CEO是由董事会按人头票任免的，即便拥有多数股权，也会被董事会当场解职！',
          },
        },
      ]),
    tacticalDebrief: {
      title: {
        en: 'The Steve Jobs 1985 Playbook Defense',
        fr: 'La Leçon Steve Jobs 1985 au Conseil',
        zh: '乔布斯1985年出局惨剧的制度性救赎',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: 'Steve Jobs was ousted from Apple in 1985 because John Sculley swayed a board dominated by non-founders. The standard defense is the 2-2-1 structure: 2 Founders, 2 Investors, and 1 mutually agreed Independent Industry CEO.',
        fr: 'Steve Jobs a été évincé d’Apple en 1985 par un conseil dominé par des tiers. La parade absolue est la règle 2-2-1 avec un administrateur indépendant neutre.',
        zh: '1985年乔布斯正是因为董事会失去多数，被约翰·斯卡利与外部董事联合罢免，痛失一手创立的苹果！破解之道是坚决推行“2创始人-2投资人-1中立独立董事”的2-2-1制衡阵型，并设立创始人CEO免职特别保护性条款。',
      },
      realWorldCase: {
        en: 'Airbnb (Brian Chesky) and Stripe (Patrick Collison) famously retained strict board independence protocols, barring any single investor syndicate from holding outright majority.',
        fr: 'Airbnb et Stripe ont sanctuarisé des administrateurs indépendants pour empêcher tout coup d’État.',
        zh: 'Airbnb创始人切斯基与Stripe创始人科里森兄弟均在董事会中坚守中立独立董事机制，绝不允许任何外部资本持有绝对过半席位。',
      },
      goldenRule: {
        en: 'Golden Rule: Never grant investors a majority on the Board of Directors without an independent tiebreaker.',
        fr: 'Règle d’Or : Ne concédez jamais la majorité des sièges aux fonds sans un indépendant neutre.',
        zh: '防卫铁律：无论融资额多高，永远不要让外部投资人占有董事会绝对多数席位！',
      },
    },
  };
}

// 3. Dual-Class 10:1 Super-Voting Shares (Zuckerberg Citadel)
function genDualClassDefense(id: string, timeLimit: number): CapTableQuestion {
  const founderEquity = getRandomItem([25, 30, 35]);
  const otherEquity = 100 - founderEquity;
  const founderVotes = founderEquity * 10;
  const totalVotes = founderVotes + otherEquity;
  const founderVotingPower = Math.round((founderVotes / totalVotes) * 100);

  return {
    id,
    tier: 'mid',
    category: 'dual_class',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Dual-Class Architecture: The 10-to-1 Voting Shield',
      fr: 'Actions à Vote Double : Le Bouclier 10 pour 1',
      zh: 'AB双重股权架构：10:1超级投票权护城河',
    },
    context: {
      en: `"You are approaching Series B. After successive dilutions, your founding team holds ${founderEquity}% equity, while outside investors hold ${otherEquity}%. You implement a Class B Dual-Class share structure granting 10 votes per share to founders."`,
      fr: `"En Série B, votre équipe détient ${founderEquity} % du capital et les investisseurs ${otherEquity} %. Vous adoptez une structure d’actions Classe B à 10 voix par action pour les fondateurs."`,
      zh: `“公司进入B轮后，创始团队经济股权被稀释至 ${founderEquity}%，外部投资人与期权池合计持有 ${otherEquity}%。你在公司章程中设立了AB股双重股权架构：创始人持有B类股，每股享有10票表决权。”`,
    },
    givenFacts: [
      { label: { en: 'Founder Economic Equity', fr: 'Capital Détenu', zh: '创始人经济持股' }, value: `${founderEquity}%` },
      { label: { en: 'Outside Shareholders', fr: 'Autres Actionnaires', zh: '外部股东持股' }, value: `${otherEquity}%` },
      { label: { en: 'Class B Voting Multiplier', fr: 'Multiplicateur Voix B', zh: 'B类股投票倍数' }, value: '10 Votes / Share (10:1)' },
    ],
    question: {
      en: `Under this 10:1 dual-class structure, what is the founders' effective voting control power in shareholder meetings?`,
      fr: `Avec ce ratio 10:1, quel est le pourcentage effectif des droits de vote des fondateurs en assemblée générale ?`,
      zh: `在此 10:1 超级表决权架构下，创始团队在股东大会中实际拥有的投票权比例是多少？`,
    },
    options: shuffle([
      {
        text: `${founderVotingPower}%（依然享有压倒性绝对控股权，彻底消除恶意收购与夺权风险）`,
        isCorrect: true,
        trapNote: {
          en: `Correct: (${founderEquity}*10) / [(${founderEquity}*10) + ${otherEquity}] = ${founderVotingPower}%. Founders retain unassailable control despite economic dilution.`,
          fr: `Exact : (${founderEquity}*10) / (${founderVotes} + ${otherEquity}) = ${founderVotingPower} %. Les fondateurs contrôlent l’assemblée générale.`,
          zh: `计算精准！创始人票数=${founderEquity}×10=${founderVotes}票，总票数=${founderVotes}+${otherEquity}=${totalVotes}票。投票权高达${founderVotingPower}%，虽股权被稀释但对公司战略一言九鼎！`,
        },
      },
      {
        text: `${founderEquity}%（投票权与经济持股比例必须永远严格一致，不能脱钩）`,
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Dual-class structures deliberately decouple economic equity from voting rights.',
          fr: 'Faux : Les structures à vote double découplent précisément le capital des droits de vote.',
          zh: '错误！AB双重股权架构的核心就是将“经济所有权”与“表决决策权”彻底脱钩！',
        },
      },
      {
        text: `50.0%（公司法规定无论如何超级表决权最高只能达到50%）`,
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: In Delaware and international corporate charters, voting rights can legally exceed 70-80% via Class B stock.',
          fr: 'Faux : Le droit des sociétés permet de dépasser largement 70-80 % des voix via les actions B.',
          zh: '错误！在特拉华州公司法与主流资本市场中，扎克伯格等人长期通过AB股持有超75%甚至85%投票权，不存在50%上限限制。',
        },
      },
      {
        text: `${Math.min(99, founderEquity * 2)}%（双重股权在法律上只能给予2倍表决权）`,
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: 10:1 is the global gold standard employed by Google, Meta, and Palantir.',
          fr: 'Faux : Le standard mondial est de 10 voix pour 1 (Google, Meta, Palantir).',
          zh: '错误！国际通行的AB股架构普遍为10:1超级表决权，绝非2倍限制。',
        },
      },
    ]),
    tacticalDebrief: {
      title: {
        en: 'The Mark Zuckerberg & Google Sovereign Citadel',
        fr: 'La Citadelle Souveraine de Mark Zuckerberg',
        zh: '扎克伯格与谷歌创始人的终身掌舵者护城河',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: `Dual-class share structures allow visionary founders to accept massive institutional capital without surrendering corporate destiny. Even if founders only own ${founderEquity}% of the shares, they command ${founderVotingPower}% of the votes.`,
        fr: `Les actions à droits de vote multiples permettent de lever des centaines de millions tout en conservant ${founderVotingPower} % des voix.`,
        zh: `AB股双重股权是当代科技独角兽最具威力的主权武器。它让创始人可以无惧多轮巨额稀释，在经济股权只有${founderEquity}%时，依然掌控${founderVotingPower}%的绝对决断权，免除外部资本指手画脚。`,
      },
      realWorldCase: {
        en: 'Mark Zuckerberg utilized 10:1 super-voting shares to maintain unquestioned control of Meta (Facebook) across its entire trajectory from Series B to $1 Trillion market cap.',
        fr: 'Mark Zuckerberg a utilisé le ratio 10:1 pour conserver le contrôle total de Meta jusqu’à 1 000 milliards de dollars de capitalisation.',
        zh: '扎克伯格正是凭借10:1超级投票权，在Facebook从估值几千万一路扩张至万亿美元帝国的过程中，始终拥有对公司命运不可撼动的终身最高统治权。',
      },
      goldenRule: {
        en: 'Golden Rule: When dilution is inevitable, decouple equity from voting power through Dual-Class Class B shares.',
        fr: 'Règle d’Or : Découplez la part économique des droits de vote dès que possible.',
        zh: '防卫铁律：当资本扩张稀释不可避免时，必须通过AB双重表决权将股权与投票权脱钩，死守控制权！',
      },
    },
  };
}

// 4. Liquidation Preference: 1x Non-Participating vs 2x Participating Overhang
function genLiquidationPreferenceTrap(id: string, timeLimit: number): CapTableQuestion {
  const investmentM = getRandomItem([10, 15, 20]);
  const exitM = investmentM * getRandomItem([3, 4]);
  const investorPct = 25;

  const payout1xNonPart = Math.max(investmentM, exitM * (investorPct / 100));
  const commonPayout1x = exitM - payout1xNonPart;

  const top2x = investmentM * 2;
  const remaining = Math.max(0, exitM - top2x);
  const investorCut = top2x + remaining * (investorPct / 100);
  const commonPayout2x = Math.max(0, exitM - investorCut);

  return {
    id,
    tier: 'mid',
    category: 'liquidation_preference',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The Double-Dipping 2x Participating Preference Trap',
      fr: 'Le Piège Prédateur de la Préférence 2x Participante',
      zh: '恶性“2倍参与型清算优先权”吸血毒丸',
    },
    context: {
      en: `"An institutional investor injects $${investmentM}M for 25% equity, but sneaks in a '2x Participating Preferred' liquidation preference. A few years later, the company is acquired for $${exitM}M."`,
      fr: `"Un fonds investit ${investmentM} M$ pour 25 % avec une préférence '2x participante'. La société est rachetée ${exitM} M$ plus tard."`,
      zh: `“某机构投资人向公司注资 ${investmentM}00 万美元获得 25% 股权，但在条款中强加了‘2倍参与型清算优先权（2x Participating Preferred）’。几年后公司以 ${exitM}00 万美元完成并购出售。”`,
    },
    givenFacts: [
      { label: { en: 'Investment Amount', fr: 'Investissement', zh: '融资金额' }, value: `$${investmentM}M` },
      { label: { en: 'Exit Acquisition Price', fr: 'Prix de Sortie', zh: '公司并购退出总额' }, value: `$${exitM}M` },
      { label: { en: 'Liquidation Clause', fr: 'Clause de Préférence', zh: '清算优先权条款' }, value: '2x Participating Preferred' },
    ],
    question: {
      en: `Under this 2x Participating preference, how much do the common shareholders (founders and employee ESOP) actually receive, versus standard 1x Non-Participating?`,
      fr: `Avec cette clause 2x participante, combien perçoivent les actionnaires ordinaires (fondateurs et salariés) comparé à une 1x non participante ?`,
      zh: `在这笔 2倍参与型清算优先权剥削下，普通股股东（创始团队与期权员工）最终仅能拿到多少美元，相比标准1倍非参与少拿了多少？`,
    },
    options: shuffle([
      {
        text: `普通股仅剩 $${commonPayout2x}M（比标准的 $${commonPayout1x}M 惨遭剥夺 $${commonPayout1x - commonPayout2x}M，收益被无情腰斩）`,
        isCorrect: true,
        trapNote: {
          en: `Correct: 2x takes $${top2x}M off top, plus 25% of remainder. Investors take $${investorCut}M, leaving founders with crumbs ($${commonPayout2x}M).`,
          fr: `Exact : L'investisseur prélève 2x (${top2x} M$) en priorité, puis 25 % du reliquat. Les fondateurs ne touchent que ${commonPayout2x} M$ au lieu de ${commonPayout1x} M$.`,
          zh: `算术极其精准！投资人先拿走2倍本金即$${top2x}M，剩下$${remaining}M还要再切走25%（即$${remaining * 0.25}M），最终独吞$${investorCut}M，创始人与员工惨遭吸血，只剩$${commonPayout2x}M！`,
        },
      },
      {
        text: `普通股与投资人平分 $${exitM / 2}M，因为并购时所有股票一律强制平权`,
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Preferred stock sits above Common stock in the liquidation waterfall stack.',
          fr: 'Faux : Les actions préférentielles sont prioritaires dans la cascade de liquidation.',
          zh: '错误！优先股在清算瀑布流（Waterfall）中拥有绝对第一受偿顺位，普通股只能拿剩下的残渣。',
        },
      },
      {
        text: `创始人能全额拿到 $${exitM * 0.75}M，因为投资人只占25%股权`,
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: You ignored the 2x participating preference clause completely!',
          fr: 'Faux : Vous avez ignoré la clause 2x participante qui siphonne la sortie.',
          zh: '致命盲区！只看占股比例忽略优先清算倍数，是导致无数创始人辛苦多年颗粒无收的最大元凶！',
        },
      },
      {
        text: `投资人只能拿回 $${investmentM}M 本金，超出部分法律规定必须全部无偿归还创始人`,
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Contractual liquidation preferences are legally binding and strictly enforced.',
          fr: 'Faux : Les clauses de préférence sont strictement exécutoires par les tribunaux.',
          zh: '错误！投资意向书与股东协议中的清算优先权具有严格法律效力，法院会严格按条款划扣！',
        },
      },
    ]),
    tacticalDebrief: {
      title: {
        en: 'The Anti-Participating Preferred Fortress',
        fr: 'Le Rempart Contre la Préférence Participante',
        zh: '死守标准 1x 非参与优先股（1x Non-Participating）底线',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: 'Participating preference allows VCs to "double dip": they recover multiple times their principal, then participate pro-rata in common equity. The universal NVCA standard must always be 1x Non-Participating Preferred.',
        fr: 'La préférence participante permet aux investisseurs de se faire rembourser leur mise avec prime ET de toucher leur quote-part. Exigez toujours la préférence 1x non participante.',
        zh: '参与型（Participating）优先权是资本最嗜血的“双头吃”工具：先拿走倍数本金和股息，再回过头瓜分普通股红利。创始人融资时必须坚决要求标准“1x Non-Participating（1倍非参与）”，即投资人只能在拿回本金或按股权比例分配之间二选一！',
      },
      realWorldCase: {
        en: 'In distressed tech acquisitions, participating preferred stacks have caused founders of $100M+ acquisitions to walk away with zero dollars while VCs took 100% of proceeds.',
        fr: 'Dans de nombreux rachats, des fondateurs sont repartis sans un centime malgré des sorties à plus de 100 M$ à cause de préférences participantes empilées.',
        zh: '在创投下行周期中，大量标榜估值超1亿美元被并购的公司，由于早期签下了2x或3x参与型优先权，最终并购款全额流向了VC，创始团队与全体早期员工一分钱都没分到！',
      },
      goldenRule: {
        en: 'Golden Rule: Never accept participating preferred stock. Clean 1x Non-Participating is the only acceptable market norm.',
        fr: 'Règle d’Or : Bannissez la préférence participante. Seule la 1x non participante protège vos intérêts.',
        zh: '防卫铁律：无论估值开得多高，坚决斩断任何“参与型（Participating）”清算优先权！死守1倍非参与纯净底线！',
      },
    },
  };
}

// 5. Anti-Dilution: Full Ratchet vs Broad-Based Weighted Average
function genAntiDilutionDefense(id: string, timeLimit: number): CapTableQuestion {
  const originalPrice = getRandomItem([10, 20]);
  const downRoundPrice = originalPrice / 2;

  return {
    id,
    tier: 'senior',
    category: 'anti_dilution',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The Death Spiral: Full-Ratchet vs Weighted Average',
      fr: 'La Spirale Mortelle : Full-Ratchet vs Moyenne Pondérée',
      zh: '下行轮致命死亡螺旋：全棘轮 vs 广义加权平均',
    },
    context: {
      en: `"In a market downturn, your startup raises a Down-Round at $${downRoundPrice}/share (down from the previous Series A price of $${originalPrice}/share). Series A investors hold an anti-dilution clause."`,
      fr: `"En période de crise, vous levez un tour à la baisse à ${downRoundPrice} $/action (contre ${originalPrice} $ précédemment). Les investisseurs détiennent une clause anti-dilution."`,
      zh: `“市场遭遇寒冬，公司被迫进行下行轮（Down-Round）融资，新一轮每股价格跌至 $${downRoundPrice}（上一轮A轮每股进场价为 $${originalPrice}）。上一轮投资人合同中拥有一项反稀释保护条款。”`,
    },
    givenFacts: [
      { label: { en: 'Previous Series A Price', fr: 'Prix Série A Précédent', zh: '原A轮每股进场价' }, value: `$${originalPrice}.00` },
      { label: { en: 'Down-Round Issue Price', fr: 'Nouveau Prix Baissier', zh: '下调轮每股增发价' }, value: `$${downRoundPrice}.00` },
      { label: { en: 'Price Drop Severity', fr: 'Décote', zh: '估值暴跌幅度' }, value: '50% Haircut' },
    ],
    question: {
      en: 'What is the catastrophic difference between "Full-Ratchet" and "Broad-Based Weighted Average" anti-dilution protection?',
      fr: 'Quelle est la différence catastrophique entre l’anti-dilution "Full-Ratchet" et la "Moyenne Pondérée Élargie" ?',
      zh: '全棘轮（Full-Ratchet）与广义加权平均（Broad-Based Weighted Average）反稀释条款之间最致命的区别是什么？',
    },
    options: shuffle([
      {
        text: `全棘轮将投资人全部原有股份的转股价瞬间强制腰斩重置为 $${downRoundPrice}（引发毁灭性无限超发稀释，全盘吃光创始人股权）；而广义加权平均兼顾增发规模，稀释极其温和`,
        isCorrect: true,
        trapNote: {
          en: 'Correct: Full-Ratchet treats all previous shares as if bought at the rock-bottom price, crushing common founders. Broad-based weighted average adjusts proportionally based on actual dollars raised.',
          fr: 'Exact : Le Full-Ratchet réaligne 100 % des actions au prix le plus bas, pulvérisant les fondateurs. La moyenne pondérée amortit la dilution.',
          zh: '完全正确！全棘轮不看增发数量，直接将以往全部投资金额转股价重置到底部，让投资人免费获得成倍超发新股，直接将创始人股权清零；广义加权平均按实际募资权重调节，极为温和。',
        },
      },
      {
        text: '全棘轮只会稀释新加入的外部投资人，创始团队的普通股股权享有完全免稀释特权',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: The dilution created by Full-Ratchet comes almost entirely out of the founders and common shareholders!',
          fr: 'Faux : La dilution générée par le Full-Ratchet est subie de plein fouet par les fondateurs.',
          zh: '错误！全棘轮超发的新股正是从创始人和员工普通股池中硬生生剥离出来的！',
        },
      },
      {
        text: '广义加权平均要求创始人必须立刻自掏腰包补齐每股差额现金给投资人',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Anti-dilution adjusts conversion ratios of stock, never personal cash.',
          fr: 'Faux : L’anti-dilution ajuste les ratios de conversion, pas les comptes bancaires personnels.',
          zh: '错误！反稀释是股份转换比例机制，绝对不需要创始人个人补缴现金。',
        },
      },
      {
          text: '全棘轮在国际公司法中是完全非法的，签署了也无法律效力',
          isCorrect: false,
          trapNote: {
            en: 'Incorrect: Full Ratchet is fully legal in contract law if signed, which is why founders must actively reject it in negotiations.',
            fr: 'Faux : Le Full-Ratchet est légal s’il est signé, c’est pourquoi il faut le refuser fermement.',
            zh: '错误！只要签字盖章就具有完全法律约束力，因此创始人必须在谈判时坚决将其扫地出门。',
          },
        },
      ]),
    tacticalDebrief: {
      title: {
        en: 'Defending Against the Full-Ratchet Guillotine',
        fr: 'La Guillotine du Full-Ratchet Neutralisée',
        zh: '抵御全棘轮断头台：广义加权平均是唯一正途',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: 'Broad-Based Weighted Average takes into account the actual number of shares issued in the down round relative to total capitalization. Full Ratchet ignores volume and reprices everything, triggering a fatal cap table death spiral.',
        fr: 'La formule pondérée élargie tient compte du volume d’actions émises. Le Full-Ratchet ignore les montants et déclenche une spirale mortelle.',
        zh: '广义加权平均公式综合考量了下调轮融资金额占全稀释总股本的真实比例，即便估值腰斩，调整后的转股价降幅通常仅有几毛钱；而全棘轮直接腰斩，引爆毁灭性超发。',
      },
      realWorldCase: {
        en: 'During the 2022-2023 venture downturn, multiple fast-growing startups collapsed because Series A Full-Ratchet provisions were triggered by small down-rounds, leaving founders with under 3% ownership.',
        fr: 'En 2022-2023, des startups ont vu le capital de leurs fondateurs s’effondrer sous les 3 % suite au déclenchement de Full-Ratchets.',
        zh: '在2022-2023年全球科技估值大回调中，多起初创企业因早期不慎签下全棘轮，在下行轮中导致期权池和创始人股权被全额洗掉，团队彻底失去士气导致破产清算。',
      },
      goldenRule: {
        en: 'Golden Rule: Broad-Based Weighted Average is the only acceptable anti-dilution term. Never sign a Full-Ratchet clause.',
        fr: 'Règle d’Or : La moyenne pondérée élargie est le seul standard viable. Bannissez le Full-Ratchet.',
        zh: '防卫铁律：无论融资难度多大，坚决只签“广义加权平均（Broad-Based Weighted Average）”，誓死不签“全棘轮（Full-Ratchet）”卖身契！',
      },
    },
  };
}

// 6. Pay-to-Play Sanction in Down Rounds
function genPayToPlaySanction(id: string, timeLimit: number): CapTableQuestion {
  return {
    id,
    tier: 'senior',
    category: 'pay_to_play',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The Pay-to-Play Citadel Defense',
      fr: 'La Clause Pay-to-Play : L’Arme de Solidarité Obligatoire',
      zh: '寒冬统战神器：“不跟投即罚下（Pay-to-Play）”防御机制',
    },
    context: {
      en: `"In a tough funding environment, the company needs an emergency $5M internal bridge round. You enforce a 'Pay-to-Play' provision in the corporate charter."`,
      fr: `"En pleine crise, la société a besoin d'un bridge interne de 5 M$. Vous activez une clause 'Pay-to-Play' dans les statuts."`,
      zh: `“在外部资本极其冰冻的时期，公司需要启动一轮 500 万美元的内部老股东过桥救急融资。你在章程中激活了‘Pay-to-Play’（不跟投即罚下）条款。”`,
    },
    givenFacts: [
      { label: { en: 'Internal Round Size', fr: 'Tour Interne', zh: '内部过桥规模' }, value: '$5,000,000' },
      { label: { en: 'Mechanism Triggered', fr: 'Clause Activée', zh: '触发治理机制' }, value: 'Pay-to-Play Provision' },
      { label: { en: 'Default Sanction', fr: 'Sanction', zh: '违约制裁后果' }, value: 'Forfeiture of Preferred Rights (丧失优先权)' },
    ],
    question: {
      en: 'How does a "Pay-to-Play" provision powerfully protect the founder and the company during capital winter?',
      fr: 'Comment la clause "Pay-to-Play" protège-t-elle puissamment les fondateurs et l’entreprise en période de crise ?',
      zh: '“Pay-to-Play”条款在资本寒冬中如何强力保护创始人与公司的核心利益？',
    },
    options: shuffle([
      {
        text: '强制要求所有现有优先股投资人必须按股权比例出资跟投，拒绝出资跟投者的优先股强制降级转为普通股并丧失董事席位与清算优先特权',
        isCorrect: true,
        trapNote: {
          en: 'Correct: Pay-to-Play forces investors to support the company or lose their senior privileges, preventing opportunistic obstruction.',
          fr: 'Exact : Elle oblige les fonds à réinvestir sous peine de perdre leurs privilèges et sièges au conseil.',
          zh: '完全正确！Pay-to-Play倒逼现有VC共进退，敢袖手旁观的投机资本其优先股直接被强制降格为普通股，抹杀其清算特权与董事会干涉能力！',
        },
      },
      {
        text: '允许投资人免费获得公司最新研发的全部软件源代码与专利所有权',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: IP transfer is never related to financing governance mechanisms.',
          fr: 'Faux : La propriété intellectuelle n’a aucun rapport avec cette clause.',
          zh: '错误！这是商业常识陷阱，知识产权永远归公司所有。',
        },
      },
      {
        text: '要求创始人在未来三年内必须放弃一切薪水，作为对投资人的违约赔偿',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Pay-to-Play disciplines non-participating INVESTORS, not founders.',
          fr: 'Faux : Le Pay-to-Play sanctionne les INVESTISSEURS défaillants, pas les fondateurs.',
          zh: '错误！Pay-to-Play是专门用来约束制裁“见死不救”的外部投资人的利器，绝非惩罚创始人。',
        },
      },
      {
          text: '只要启动Pay-to-Play，公司必须立刻宣布在纳斯达克强制敲钟上市',
          isCorrect: false,
          trapNote: {
            en: 'Incorrect: Pay-to-Play is a private company financing governance mechanism.',
            fr: 'Faux : C’est un mécanisme interne de gouvernance pour financer un tour privé.',
            zh: '错误！Pay-to-Play是未上市创业公司在生死攸关时的内部股东统战工具。',
          },
        },
      ]),
    tacticalDebrief: {
      title: {
        en: 'The Ultimate Founder Alignment Tool in Crisis',
        fr: 'L’Outil Ultime d’Alignement des Actionnaires en Période de Crise',
        zh: '危机中团结一切有生力量的最强统战利刃',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: 'Pay-to-Play strips non-supportive VCs of their voting vetoes, anti-dilution rights, and liquidation preferences, converting them into standard common stock. This aligns active capital behind the founding team.',
        fr: 'Le Pay-to-Play prive les fonds inactifs de leurs droits de veto et préférences, assainissant instantanément la table de capitalisation.',
        zh: 'Pay-to-Play是清算优先权堆栈和清除僵尸股东的最强杀招。不愿注入救命钱的老股东将被剥夺一切特权，直接清洗为普通股，为公司卸下沉重的历史包袱！',
      },
      realWorldCase: {
        en: 'Top Silicon Valley firms utilized Pay-to-Play during the dot-com crash and 2008 meltdown to cleanse broken cap tables, paving the way for eventual multi-billion dollar IPO turnarounds.',
        fr: 'Utilisé massivement lors du krach de 2008 pour nettoyer les tables et relancer des sociétés jusqu’à l’IPO.',
        zh: '在2000年互联网泡沫与2008年次贷危机中，顶级硅谷企业正是凭借Pay-to-Play清洗掉了落井下石的投机机构，带领公司重获新生直至上市。',
      },
      goldenRule: {
        en: 'Golden Rule: Embed Pay-to-Play provisions in your charter to ensure existing investors back the company when times get tough.',
        fr: 'Règle d’Or : Intégrez le Pay-to-Play pour contraindre les investisseurs à soutenir l’entreprise par tous les temps.',
        zh: '防卫铁律：章程必须预留Pay-to-Play统战武器，确保风雨来临时老股东必须与创始人同舟共济！',
      },
    },
  };
}

// 7. Founder Vesting & Unvested Share Clawbacks
function genFounderVestingClawback(id: string, timeLimit: number): CapTableQuestion {
  return {
    id,
    tier: 'junior',
    category: 'founder_vesting',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Founder Vesting & The Co-Founder Departure Trap',
      fr: 'Vesting des Fondateurs & Départ Prématuré d’un Associé',
      zh: '创始人股权成熟机制（Vesting）与联合创始人离职黑洞',
    },
    context: {
      en: `"You co-founded a company with 50/50 equity. After 8 months, your co-founder burns out and abruptly quits to join a competitor, demanding to keep all 50% of the company's shares permanently."`,
      fr: `"Vous fondez une startup à 50/50. Après 8 mois, votre associé démissionne et exige de conserver 50 % des actions à vie."`,
      zh: `“你与联合创始人以 50/50 平分股权创业。公司刚刚起步 8 个月，联合创始人因心态崩溃突然单方面离职，并声称‘股权是我的合法财产’，拒绝交出任何一点股份并打算加盟竞品。”`,
    },
    givenFacts: [
      { label: { en: 'Initial Equity Split', fr: 'Répartition Initiale', zh: '初始股权结构' }, value: '50% / 50%' },
      { label: { en: 'Departure Timing', fr: 'Départ après', zh: '离职时间节点' }, value: '8 Months (8个月)' },
      { label: { en: 'Standard Vesting Schedule', fr: 'Calendrier Standard', zh: '标准成熟方案' }, value: '4-Year Vesting with 1-Year Cliff' },
    ],
    question: {
      en: 'If you implemented a standard 4-Year Vesting with 1-Year Cliff (with company repurchase right), what happens to the departing co-founder’s 50% shares?',
      fr: 'Si vous aviez instauré un vesting de 4 ans avec cliff de 1 an, que devient la totalité des 50 % d’actions de l’associé partant ?',
      zh: '若你在创业第一天就签署了标准的“4年成熟机制附带1年断崖期（1-Year Cliff）与公司名义回购权”，该离职合伙人的50%股份在法律上将如何处置？',
    },
    options: shuffle([
      {
        text: '因工作未满1年断崖期（1-Year Cliff），其持有的50%未成熟股份全部归零，公司以1元名义价格全额回购注销，股权被完整拯救回公司',
        isCorrect: true,
        trapNote: {
          en: 'Correct: Before the 1-year cliff, 0% has vested. The company has the legal right to repurchase all unvested shares at nominal price ($1).',
          fr: 'Exact : Avant le cliff d’un an, 0 % n’est acquis. La société rachète 100 % des actions non acquises au prix symbolique.',
          zh: '完全正确！1年断崖期（Cliff）意味着满1年才成熟第一笔（25%），未满1年成熟度为0%！公司有权以1元象征价格全额收回注销，保全公司生命线！',
        },
      },
      {
        text: '他将永久带走50%股权并成为终身大股东，后续任何新投资人都无法进入，公司股权结构彻底死亡（Dead Cap Table）',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: This only happens if founders NAIVELY never signed a vesting agreement!',
          fr: 'Faux : Ce cauchemar n’arrive que si les fondateurs n’ont pas signé de contrat de vesting.',
          zh: '错误！这是“没有签署成熟协议”时的致命悲剧，而在签署了1年Cliff成熟协议的情况下，公司享有全额回收特权。',
        },
      },
      {
        text: '离职合伙人必须按当时的估值强行卖给投资人，换取几百万美元离职补偿金',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Unvested shares have no liquidity value and revert to the company.',
          fr: 'Faux : Les actions non acquises n’ont aucune valeur de sortie et retournent à l’entreprise.',
          zh: '错误！未成熟股份不享有任何变现权利，直接被公司收回。',
        },
      },
      {
          text: '由当地法院将这50%股份拍卖给社会公众，拍卖款作为诉讼费上缴',
          isCorrect: false,
          trapNote: {
            en: 'Incorrect: Corporate bylaws govern private stock repurchase.',
            fr: 'Faux : Le rachat des actions non acquises relève du pacte d’actionnaires privé.',
            zh: '错误！这是荒谬的干扰项，股东协议与章程早已明确约定了回购注销机制。',
          },
        },
      ]),
    tacticalDebrief: {
      title: {
        en: 'The Vital Shield of Founder Vesting',
        fr: 'Le Bouclier Vital du Vesting des Fondateurs',
        zh: '创业第一天的生死结界：4年成熟与1年断崖',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: 'Without a 4-year vesting schedule and 1-year cliff, early co-founder departures permanently poison the cap table, making future venture funding completely impossible.',
        fr: 'Sans vesting de 4 ans et cliff d’un an, le départ prématuré d’un associé empoisonne définitivement la table et bloque tout investisseur futur.',
        zh: '未设立Vesting成熟协议是早期创业公司最常见、最致命的自杀式漏洞！一个中途退出的合伙人带走大量股份，会形成“死股池（Dead Cap Table）”，任何正规VC都不会再给这种公司投资一分钱。必须在创业第一天签署4年成熟与1年Cliff！',
      },
      realWorldCase: {
        en: 'Mark Zuckerberg faced a major lawsuit from Eduardo Saverin precisely over initial vesting and dilution disputes. Modern founders standardize strict vesting before raising any capital.',
        fr: 'Mark Zuckerberg a affronté un litige retentissant avec Eduardo Saverin sur ces mêmes questions de dilution et de présence.',
        zh: '扎克伯格当年与爱德华多·萨维林（Eduardo Saverin）轰动业界的股权纠纷正是源于早期缺乏完备的成熟注销协议。现代硅谷创业者在注册公司第一天便会强制锁定成熟机制。',
      },
      goldenRule: {
        en: 'Golden Rule: Every founder—including yourself—must sign a 4-year vesting schedule with a 1-year cliff on Day 1.',
        fr: 'Règle d’Or : Tout fondateur doit être soumis à un vesting de 4 ans avec un cliff d’un an dès le premier jour.',
        zh: '防卫铁律：创业第一天，所有联合创始人（包括你自己）必须无一例外签署附带1年断崖期的4年成熟回购协议！',
      },
    },
  };
}

// 8. Drag-Along Threshold Defense
function genDragAlongThreshold(id: string, timeLimit: number): CapTableQuestion {
  return {
    id,
    tier: 'mid',
    category: 'drag_along',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The Drag-Along Forced Sale Ambush',
      fr: 'L’Embuscade de Vente Forcée (Drag-Along)',
      zh: '领售权（Drag-Along）强制出售伏击战',
    },
    context: {
      en: `"In your Series A agreement, the investor proposes a 'Drag-Along' clause stating: 'If holders of 50.1% of shares approve a sale of the company, all other shareholders must vote to sell their shares and cannot object.'"`,
      fr: `"En Série A, le fonds propose une clause d'entraînement (Drag-Along) : 'Si 50,1 % des actions approuvent la vente de la société, tous les associés sont forcés de vendre sans pouvoir s'y opposer.'"`,
      zh: `“在A轮投资协议草案中，投资人植入了一条‘领售权（Drag-Along Rights）’条款：‘若合计持有 50.1% 股份的股东同意出售公司，全体其他股东（包括创始人）必须无条件投票同意并强制出让全部股权，不得行使任何异议权。’”`,
    },
    givenFacts: [
      { label: { en: 'Proposed Drag-Along Threshold', fr: 'Seuil Proposé', zh: '拟定领售门槛' }, value: '50.1% (Simple Majority)' },
      { label: { en: 'Consequence of Trigger', fr: 'Conséquence', zh: '触发后果' }, value: 'Forced M&A Sale of Company (强制清盘甩卖)' },
    ],
    question: {
      en: 'Why is a simple 50.1% Drag-Along threshold an existential poison pill for the founding team, and how must it be countered?',
      fr: 'Pourquoi un seuil de Drag-Along à 50,1 % est-il mortel pour les fondateurs, et comment faut-il le contrer ?',
      zh: '为什么简单多数（50.1%）的领售权条款是随时会把创始人强制贱卖的绝命毒丸？正确的防守反制是什么？',
    },
    options: shuffle([
      {
        text: '一旦外部股东持股加总达到50.1%，投资人即可背着创始人强行将公司以折价卖给任何竞争对手；必须坚决要求领售权必须同时获得“创始人个人单独同意”或“持有至少67%超多数普通股同意”',
        isCorrect: true,
        trapNote: {
          en: 'Correct: Drag-along must require Founder Consent or a supermajority (e.g., 67-75% including Common stock) to prevent VCs from orchestrating a forced fire-sale.',
          fr: 'Exact : Le Drag-Along doit impérativement exiger le consentement du fondateur ou une super-majorité (67-75 %).',
          zh: '完全正确！简单多数领售权意味着VC联合后随时可以强行卖掉公司把你清洗出局。防卫底线是：领售权的启动必须包含“创始人书面同意”作为前置不可豁免要件！',
        },
      },
      {
        text: '领售权只对持股低于1%的小散户生效，法律上对创始人和核心高管没有任何约束力',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Drag-Along binds ALL shareholders without exception unless specifically carved out.',
          fr: 'Faux : Le Drag-Along engage TOUS les actionnaires sans exception.',
          zh: '错误！领售权（Drag-Along）字面意思就是“拖拽出售”，任何股东不服从都会被强制执行。',
        },
      },
      {
        text: '只要公司注册在加州，任何出售必须经过当地州长亲自签字批准',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Government officials do not approve private company commercial M&A transactions.',
          fr: 'Faux : Les autorités politiques n’interviennent pas dans les fusions privées.',
          zh: '错误！荒诞的常识陷阱。',
        },
      },
      {
          text: '50.1%门槛对创始人极其有利，因为创始人未来想套现时可以随时强迫VC必须买单',
          isCorrect: false,
          trapNote: {
            en: 'Incorrect: Drag-along is used by majority blocks to force sales to third parties, not to force investors to buy shares.',
            fr: 'Faux : Le Drag-Along oblige à vendre à un tiers acquéreur, il ne force pas les VC à racheter vos parts.',
            zh: '错误！领售权是逼迫全体股东把公司卖给第三方收购者，而不是逼投资人买单。',
          },
        },
      ]),
    tacticalDebrief: {
      title: {
        en: 'Defending the Company Destiny Against Forced Liquidation',
        fr: 'Protéger la Destinée de l’Entreprise Contre la Vente Forcée',
        zh: '誓死守护公司战略自主权：斩断强制领售暗算',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: 'A predatory Drag-Along enables investors to sell the company at a mediocre price to recoup their liquidation preference, leaving common holders with zero upside. Founders must always require "Founder Consent" before any Drag-Along can be initiated.',
        fr: 'Un Drag-Along prédateur permet aux fonds de brader la société pour récupérer leur préférence. Exigez toujours le consentement explicite du fondateur.',
        zh: '在资本眼里，公司如果遇到暂时的瓶颈，VC为了回笼本金，往往倾向于以3000万或5000万美元把公司贱卖给大厂，拿走优先清算权落袋为安，却彻底扼杀了创始人的未来。创始人必须将“创始人特别否决权（Founder Consent）”焊死在领售权条款中！',
      },
      realWorldCase: {
        en: 'In numerous VC disputes, founders who retained Founder Drag-Along Consent were able to reject low-ball acquisition offers and hold on to build multi-billion dollar standalone enterprises.',
        fr: 'De nombreux fondateurs ayant verrouillé cette clause ont pu refuser des offres de rachat bradées et bâtir des géants pérennes.',
        zh: '硅谷多个经典逆风翻盘案例中，正是因为创始人持有领售权一票否决权，才得以顶住早期机构的逼宫甩卖，守得云开见月明，最终成长为百亿级独立上市公司。',
      },
      goldenRule: {
        en: 'Golden Rule: Drag-Along provisions must always be subject to Founder Approval or a supermajority that requires Founder votes.',
        fr: 'Règle d’Or : La clause de Drag-Along doit impérativement être subordonnée à l’accord écrit du fondateur.',
        zh: '防卫铁律：领售权条款的启动，必须明确附加“经创始人本人书面同意”！绝不允许任何资本联盟在创始人不同意的情况下强行清盘贱卖公司！',
      },
    },
  };
}

// 9. Protective Provisions & Class Voting Veto
function genProtectiveProvisionsVeto(id: string, timeLimit: number): CapTableQuestion {
  return {
    id,
    tier: 'junior',
    category: 'protective_provisions',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Protective Provisions: The Founder Negative Veto Shield',
      fr: 'Clauses Protectrices : Le Bouclier de Veto Négatif',
      zh: '保护性条款（Protective Provisions）与创始人核心一票否决权',
    },
    context: {
      en: `"In negotiations, the investor team presents a list of 18 'Protective Provisions' (matters requiring separate investor class consent before management can act)."`,
      fr: `"L'investisseur présente 18 clauses protectrices soumises à son veto préalable avant toute décision de la direction."`,
      zh: `“在谈判中，投资人法务甩出了一份包含18条细则的‘保护性条款（Protective Provisions）’清单，要求凡涉及任何日常开支超10万美元、设立子公司、变更商业模式等事项，必须获得该投资人事前书面审批同意。”`,
    },
    givenFacts: [
      { label: { en: 'Proposed Veto Items', fr: 'Clauses de Veto Proposées', zh: '拟定否决事项' }, value: '18 Operational & Charter Items' },
      { label: { en: 'Operational Threshold', fr: 'Seuil Dépenses', zh: '支出审批限制' }, value: 'Above $100,000' },
    ],
    question: {
      en: 'What is the critical defense strategy founders must apply to prevent Protective Provisions from paralyzing daily operations?',
      fr: 'Quelle est la stratégie de défense vitale pour empêcher ces clauses de paralyser la gestion quotidienne ?',
      zh: '创始人应采取怎样的防卫策略，既保障投资人的正当重大权益，又防止保护性条款演变成全面瘫痪公司日常运营的行政枷锁？',
    },
    options: shuffle([
      {
        text: '严格将保护性条款限制在“公司生死存亡重大事项”（如修改章程改变优先权、向第三方出售公司、增发更优先股票），坚决剔除任何对CEO日常运营预算与人员雇佣的微观干涉',
        isCorrect: true,
        trapNote: {
          en: 'Correct: Protective provisions belong strictly on fundamental corporate structural changes, never on operational day-to-day decisions.',
          fr: 'Exact : Les clauses de veto doivent se limiter aux modifications structurelles fondamentales, jamais à la gestion opérationnelle.',
          zh: '完全正确！保护性条款是用来保护投资人防范极端结构性恶意的（如修改章程把优先股变成废纸），绝不能让其蔓延至日常经营！必须把预算和招聘等操作性事项全额剥离。',
        },
      },
      {
        text: '完全答应对方全部18项要求，且主动要求将审批门槛从10万美元下调至1000美元',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: This completely handcuffs founder decision-making and slows execution to a crawl.',
          fr: 'Faux : Cela paralyse totalement la réactivité de l’entreprise.',
          zh: '极其致命！连买一台服务器都要经过VC审批，创业公司将彻底丧失敏捷响应能力，走向窒息死亡。',
        },
      },
      {
        text: '拒绝设立任何保护性条款，声称哪怕修改公司章程取消优先股也只能由创始人一人说了算',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Institutional investors will never invest without standard NVCA protective provisions regarding charter amendments.',
          fr: 'Faux : Aucun fonds institutionnel ne signera sans protections statutaires standard.',
          zh: '错误！不切实际的极端化抗拒。正规机构投资人绝不会同意完全没有章程修改保护的协议。',
        },
      },
      {
          text: '将所有保护性条款的解释权全部委托给当地公证处进行全权裁决',
          isCorrect: false,
          trapNote: {
            en: 'Incorrect: Commercial governance is resolved between shareholders and the Board, not civil notaries.',
            fr: 'Faux : La gouvernance commerciale se règle entre actionnaires.',
            zh: '错误！这是脱离商业实操常识的干扰项。',
          },
        },
      ]),
    tacticalDebrief: {
      title: {
        en: 'Clean NVCA Protective Provisions Discipline',
        fr: 'La Discipline des Clauses de Protection Standard',
        zh: '守正出奇：严守标准NVCA重大事项边界',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: 'Venture capital protective provisions should mirror NVCA standards: altering preferred share rights, creating senior securities, or liquidating the business. Founders must ruthlessly purge operational micromanagement clauses.',
        fr: 'Les protections doivent se limiter aux standards NVCA : modification des droits des actions préférentielles, émission de titres de rang supérieur ou liquidation.',
        zh: '保护性条款的行业标准早已由美国NVCA确立：仅限于改变优先股权利、增发更优先股票、或清算出售公司。任何试图插手日常预算、战略合作审批或高管招聘的扩张性条款，都是资本侵蚀CEO行政权力的试探，必须坚决予以剔除！',
      },
      realWorldCase: {
        en: 'Seasoned serial founders demand high expenditure thresholds (e.g., $1M+ or Board budget approval) rather than individual investor sign-offs, preserving lightning-fast execution speed.',
        fr: 'Les fondateurs chevronnés exigent des seuils élevés (1 M$+) pour préserver leur vitesse d’exécution.',
        zh: '连续创业老手在谈判中会将微观审批替换为“经年度董事会批准预算内的支出无需另行审批”，将繁冗的行政摩擦降为零，保障团队闪电般的执行力。',
      },
      goldenRule: {
        en: 'Golden Rule: Protective provisions protect equity rights in the charter—they must never micromanage the CEO’s operational execution.',
        fr: 'Règle d’Or : Les clauses de veto protègent les droits statutaires, elles ne doivent jamais entraver la gestion du DG.',
        zh: '防卫铁律：保护性条款只管章程底线，绝不能让其插手CEO的日常战术指挥！',
      },
    },
  };
}

// 10. Post-Money SAFE vs Priced Seed Round Dilution
function genSafeVsPricedDilution(id: string, timeLimit: number): CapTableQuestion {
  const safeCapM = getRandomItem([6, 8, 10]);
  const safeInvestmentM = 1;
  const dilutionPct = Number(((safeInvestmentM / safeCapM) * 100).toFixed(1));

  return {
    id,
    tier: 'junior',
    category: 'safe_vs_priced',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The Post-Money SAFE Clean Seed Architecture',
      fr: 'L’Architecture d’Amorçage Propre : SAFE Post-Money',
      zh: '极简种子轮神器：Post-Money SAFE 纯净架构',
    },
    context: {
      en: `"You are raising your very first $${safeInvestmentM}M in seed capital. An angel syndicate offers a priced equity round with preferred stock, while another offers a standard Y-Combinator Post-Money SAFE with an $${safeCapM}M Valuation Cap."`,
      fr: `"Vous levez vos premiers ${safeInvestmentM} M$ en amorçage. Un syndicat propose un tour valorisé complexe, un autre propose un SAFE standard plafonné à ${safeCapM} M$."`,
      zh: `“你正在筹备首轮 ${safeInvestmentM}00 万美元种子轮融资。一组天使投资人要求做复杂的正规增资定价轮并发行优先股，而另一组顶级天使则同意采用标准YC Post-Money SAFE协议，约定 $${safeCapM}00 万美元估值上限（Cap）。”`,
    },
    givenFacts: [
      { label: { en: 'Investment Amount', fr: 'Investissement', zh: '融资金额' }, value: `$${safeInvestmentM}M` },
      { label: { en: 'SAFE Valuation Cap', fr: 'Plafond SAFE', zh: 'SAFE估值上限' }, value: `$${safeCapM}M Post-Money` },
      { label: { en: 'Calculated Dilution', fr: 'Dilution Fixe', zh: '锁定稀释比例' }, value: `${dilutionPct}%` },
    ],
    question: {
      en: 'Why is the Post-Money SAFE universally preferred by modern high-caliber founders for early seed financing?',
      fr: 'Pourquoi le SAFE Post-Money est-il universellement plébiscité par les meilleurs fondateurs en amorçage ?',
      zh: '为什么当代一流创业者在种子轮阶段几乎全员优先采用标准 Post-Money SAFE 协议？',
    },
    options: shuffle([
      {
        text: `以几页极简标准协议在数小时内完成交割，精准将早期稀释锁定在 ${dilutionPct}%，零董事席位让渡、零早期清算毒丸纠缠，为创始团队保全100%纯净治理权`,
        isCorrect: true,
        trapNote: {
          en: 'Correct: SAFE eliminates expensive legal bills, avoids premature board seats, and fixes dilution with mathematical precision.',
          fr: 'Exact : Le SAFE évite les frais d’avocats, préserve le conseil et fige précisément la dilution.',
          zh: '完全正确！标准SAFE协议无需修改章程、无需让出任何董事席位，将稀释精准锁定在 $1M/$8M = 12.5%，节省数万美元律师费与数月扯皮时间。',
        },
      },
      {
        text: 'SAFE协议里的投资款在法律上属于无偿赠与，未来即便公司上市创始人也无需给投资人兑现任何股份',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: SAFE converts into Preferred Stock at the next priced round.',
          fr: 'Faux : Le SAFE se convertit obligatoirement en actions lors du tour suivant.',
          zh: '荒唐的误解！SAFE是“未来股权简单协议”，在下一次合格机构融资时会全额按约定转股。',
        },
      },
      {
        text: '采用SAFE协议能让公司永久免除缴纳任何企业所得税与劳动仲裁责任',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Financing contracts have no bearing on employment law or corporate tax obligations.',
          fr: 'Faux : Un contrat financier n’exonère en rien des impôts et du droit du travail.',
          zh: '错误！脱离法律常识的干扰项。',
        },
      },
      {
          text: 'SAFE协议规定如果公司两年内没有上市，投资人有权无条件将创始人送进监狱',
          isCorrect: false,
          trapNote: {
            en: 'Incorrect: SAFE contains no personal debt guarantees or criminal recourse.',
            fr: 'Faux : Le SAFE n’implique aucune garantie personnelle ni responsabilité pénale.',
            zh: '错误！纯粹的干扰项。',
          },
        },
      ]),
    tacticalDebrief: {
      title: {
        en: 'The Seed Speed & Sovereignty Engine',
        fr: 'Le Moteur d’Amorçage Propre et Épuré',
        zh: '种子期极速融资与纯正控制权引擎',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: `A Post-Money SAFE fixes the investor at exactly ($1M / $${safeCapM}M = ${dilutionPct}%). Founders avoid hundreds of pages of complex preferred stock covenants before product-market fit has even been established.`,
        fr: `Le SAFE Post-Money fige exactement l’investisseur à ${dilutionPct} % sans alourdir les statuts.`,
        zh: `通过Post-Money SAFE协议，稀释公式清清楚楚：出资额除以估值上限即为稀释比例（${dilutionPct}%）。创始人在业务尚未经过充分验证的早期，避免了被提前套上繁复的优先股紧箍咒，把全部精力集中在打磨产品上！`,
      },
      realWorldCase: {
        en: 'Y Combinator standardizes 100% of its accelerator cohorts on Post-Money SAFEs, propelling thousands of startups like OpenAI, Stripe, and Airbnb into clean early cap tables.',
        fr: 'Y Combinator impose le SAFE Post-Money à 100 % de ses startups (Stripe, Airbnb, Coinbase).',
        zh: '全球顶尖孵化器 Y Combinator 在全球全面推行 Post-Money SAFE 标准模版，帮助了包括 OpenAI、Stripe 等在内的数千家明星企业在早期筑造了干干净净的股权结构。',
      },
      goldenRule: {
        en: 'Golden Rule: Keep early rounds on standard SAFEs. Never issue complex preferred stock with board seats at the seed stage.',
        fr: 'Règle d’Or : Utilisez des SAFE standard en amorçage. Ne cédez aucun siège au conseil si tôt.',
        zh: '防卫铁律：种子轮死守标准SAFE协议，绝不在种子期发行复杂的优先股和让渡任何正式董事席位！',
      },
    },
  };
}

// 11. Cumulative Dividends: The Compounding Debt Trap
function genCumulativeDividendTrap(id: string, timeLimit: number): CapTableQuestion {
  const investmentM = getRandomItem([10, 20]);
  const dividendRate = 8;
  const years = 5;
  const totalAccruedM = Number((investmentM * Math.pow(1 + dividendRate / 100, years)).toFixed(1));
  const interestOnlyM = Number((totalAccruedM - investmentM).toFixed(1));

  return {
    id,
    tier: 'senior',
    category: 'dividend_overhang',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The Compounding 8% Cumulative Dividend Trap',
      fr: 'Le Piège du Dividende Cumulatif Composé à 8 %',
      zh: '隐形高利贷：每年8%累积复利股息（Cumulative Dividend）暗算',
    },
    context: {
      en: `"In a $${investmentM}M Series B term sheet, the investor casually inserts: 'Holders of Series B Preferred shall be entitled to an 8% cumulative annual compounding dividend upon liquidation.'"`,
      fr: `"Dans une term sheet de ${investmentM} M$, le fonds glisse : 'Dividende annuel cumulatif de 8 % composé payable lors de la liquidation.'"`,
      zh: `“在某机构开出的 ${investmentM}00 万美元 B 轮投资意向书中，对方看似不经意地插入了一句话：‘B类优先股股东在发生任何清算事件时，享有按年利率 8% 逐年按复利累积计息的分红优先权。’”`,
    },
    givenFacts: [
      { label: { en: 'Investment Amount', fr: 'Montant Investi', zh: '投资本金' }, value: `$${investmentM}M` },
      { label: { en: 'Cumulative Annual Rate', fr: 'Taux Annuel Cumulé', zh: '累积股息年利率' }, value: `${dividendRate}% Compounding (每年复利)` },
      { label: { en: 'Holding Period', fr: 'Durée', zh: '持有年限' }, value: `${years} Years (5年后出售)` },
    ],
    question: {
      en: `After ${years} years, how much extra debt-like liquidation overhang ($${interestOnlyM}M) has accumulated on top of the original $${investmentM}M investment before common founders get a single dime?`,
      fr: `Après ${years} ans, quelle surcharge financière (${interestOnlyM} M$) s’est accumulée en priorité avant que les fondateurs ne touchent le moindre euro ?`,
      zh: `在公司奋战 ${years} 年后出售时，这一累积复利条款会让投资人在本金之上凭空先切走多少巨额利息，将普通股创始人逼入绝境？`,
    },
    options: shuffle([
      {
        text: `投资人除 $${investmentM}M 本金外，还将优先强行切走高达约 $${interestOnlyM}M 的高额累积利息（总受偿高达 $${totalAccruedM}M），把股权投资生生异化成了嗜血高利贷`,
        isCorrect: true,
        trapNote: {
          en: `Correct: 8% compounding over 5 years adds $${interestOnlyM}M directly to the senior liquidation overhang, starving common shareholders.`,
          fr: `Exact : L’effet cumulatif de 8 % sur 5 ans rajoute ${interestOnlyM} M$ de dette prioritaire sur la sortie.`,
          zh: `完全正确！本金$${investmentM}M按8%复利5年后膨胀至约$${totalAccruedM}M！投资人在并购时必须先把这笔凭空多出的$${interestOnlyM}M利息全额装进兜里，才轮到普通股受偿！`,
        },
      },
      {
        text: '累计分红只是纸面数字，在实际并购中自动归零失效，不用支付任何利息',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: "Cumulative" dividends explicitly accrue and must be paid in priority upon liquidation.',
          fr: 'Faux : Le terme "cumulatif" garantit juridiquement le paiement prioritaire des intérêts.',
          zh: '致命盲区！“累积（Cumulative）”在法律上意味着这笔利息每一分钱都会永久累加在优先清算受偿权最顶端！',
        },
      },
      {
        text: '投资人会把这 $${interestOnlyM}M 的利息无偿捐赠给公司的工程师员工基金',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Venture funds return capital to their limited partners, never donate returns.',
          fr: 'Faux : Les fonds reversent ces sommes à leurs souscripteurs (LP).',
          zh: '错误！资本不是慈善家，这是荒诞的干扰项。',
        },
      },
      {
          text: '只要公司年营收超过1000万美元，银行会自动替创始人垫付这笔资金',
          isCorrect: false,
          trapNote: {
            en: 'Incorrect: Commercial banks do not repay equity dividend covenants.',
            fr: 'Faux : Les banques n’assurent aucune garantie sur ces clauses statutaires.',
            zh: '错误！完全违背金融常识。',
          },
        },
      ]),
    tacticalDebrief: {
      title: {
        en: 'Purging the Cumulative Dividend Parasite',
        fr: 'Éliminer le Parasite du Dividende Cumulatif',
        zh: '清除累积股息寄生虫：坚持“非累积（Non-Cumulative）”分红',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: 'Venture Capital equity is high-risk risk capital—not guaranteed debt. The standard market norm is "Non-Cumulative Dividends as declared by the Board". Cumulative dividends act like toxic subordinated debt.',
        fr: 'Le capital-risque est un capital à risque, pas une dette garantie. La norme est le dividende non cumulatif sur décision du conseil.',
        zh: '风险投资的核心是“风险自担”，绝不能伪装成稳赚不赔的高利贷！行业标准永远是“经董事会宣布时分配的非累积股息（Non-Cumulative Dividends as declared by Board）”，绝不能接受“累积（Cumulative）”复利！',
      },
      realWorldCase: {
        en: 'Founders who conceded 8% cumulative dividends during growth rounds often discovered that after 6 years of sweat and blood, the preferred liquidation overhang doubled, wiping out all common equity value.',
        fr: 'De nombreux fondateurs ont découvert après 6 ans d’efforts que la dette prioritaire avait doublé, ne leur laissant rien lors de la vente.',
        zh: '创投历史上大量惨痛教训显示：创始人辛苦打拼6年将公司做大出售，却发现因为这笔8%累积股息，VC的受偿金额几乎翻了一倍，团队所有辛勤付出全成了为资本打工的嫁衣！',
      },
      goldenRule: {
        en: 'Golden Rule: Dividends must strictly be "Non-Cumulative, as and if declared by the Board". Never permit compounding cumulative dividends.',
        fr: 'Règle d’Or : Les dividendes doivent être non cumulatifs. Bannissez tout intérêt composé.',
        zh: '防卫铁律：分红条款必须严格写明“经董事会决定时分配之非累积股息”！坚决斩断任何累积复利计息条款！',
      },
    },
  };
}

// 12. Secondary Share Sale Discipline
function genSecondarySaleDiscipline(id: string, timeLimit: number): CapTableQuestion {
  return {
    id,
    tier: 'senior',
    category: 'equity_threshold',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Founder Secondary Liquidity vs Retention of Control',
      fr: 'Vente Secondaire Fondateur & Préservation du Contrôle',
      zh: '创始人老股套现（Secondary Sale）与绝对控制权底线博弈',
    },
    context: {
      en: `"In Series B, an outside growth investor offers to buy $3M of your personal founder stock as secondary liquidity, which would drop your ownership from 36% down to 26%."`,
      fr: `"En Série B, un fonds propose de vous racheter 3 M$ d’actions personnelles, ce qui ferait chuter votre part de 36 % à 26 %."`,
      zh: `“在公司完成B轮融资时，新进成长基金主动向创始人抛出橄榄枝，提出愿出资 300 万美元直接购买你手中的创始人老股实现个人财务自由套现，但此举会导致你的持股比例从 36% 骤降至 26%。”`,
    },
    givenFacts: [
      { label: { en: 'Offered Cash Liquidity', fr: 'Liquidité Proposée', zh: '套现现金金额' }, value: '$3,000,000 (个人现金)' },
      { label: { en: 'Current Founder Equity', fr: 'Part Actuelle', zh: '当前创始人持股' }, value: '36% (持有否决权防线)' },
      { label: { en: 'Post-Sale Founder Equity', fr: 'Part Post-Vente', zh: '套现后持股比例' }, value: '26% (跌破33.4%一票否决线)' },
    ],
    question: {
      en: 'What is the existential risk of accepting this secondary sale without structural voting protections?',
      fr: 'Quel est le risque existentiel d’accepter cette vente secondaire sans protection statutaire de vote ?',
      zh: '在没有设立配套表决权护城河的情况下，贸然套现将股权压低到26%的最致命危险是什么？',
    },
    options: shuffle([
      {
        text: '股权跌破 33.4% 关键临界线，直接丧失对修改章程、强行并购与清算解散的法定一票否决权（Blocking Minority），战略主动权彻底拱手让人',
        isCorrect: true,
        trapNote: {
          en: 'Correct: Dropping below 33.4% forfeits the statutory blocking minority. To sell secondary safely, founders MUST have Dual-Class super-voting stock already locked in.',
          fr: 'Exact : Passer sous 33,4 % supprime la minorité de blocage. Pour vendre en secondaire, le vote double 10:1 est indispensable.',
          zh: '完全正确！33.4%是法定特别多数表决（需2/3赞成）的一票否决权警戒线！跌破此线且无AB双重表决权，创始人对公司重大资产处置和出售彻底失去阻截能力。',
        },
      },
      {
        text: '拿到300万美元后创始人会被银行强制没收全部护照和驾照',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Personal wealth has no relationship with civil mobility.',
          fr: 'Faux : L’enrichissement personnel ne remet pas en cause les droits civiques.',
          zh: '错误！荒诞的干扰项。',
        },
      },
      {
        text: '只要拿了老股套现资金，公司下周一必须立刻解雇全部老员工',
        isCorrect: false,
        trapNote: {
          en: 'Incorrect: Secondary sale is an exchange between existing shareholders and new investors.',
          fr: 'Faux : Une vente secondaire n’a aucun impact sur les contrats de travail.',
          zh: '错误！完全脱离商业运作事实。',
        },
      },
      {
          text: '26%股权在法律上等同于公司直接宣告破产',
          isCorrect: false,
          trapNote: {
            en: 'Incorrect: 26% is still a significant stake, but critically lacks statutory veto power.',
            fr: 'Faux : 26 % reste significatif, mais perd le droit de veto.',
            zh: '错误！公司不会破产，但创始团队丧失了核心战略否决权。',
          },
        },
      ]),
    tacticalDebrief: {
      title: {
        en: 'The Golden Handcuffs: Secondary Timing & Voting Fortress',
        fr: 'Liquidité Secondaire & Bouclier de Vote',
        zh: '财务自由与控制权兼得的智慧：先筑AB股，再谋老股退',
      },
      verdict: 'masterstroke',
      mechanicsExplained: {
        en: 'Selling modest secondary is healthy for relieving founder personal financial pressure, BUT it must never break governance thresholds (like 33.4% veto) unless 10:1 Dual-Class super-voting shares are already active.',
        fr: 'Prendre de la liquidité est sain pour soulager la pression, mais cela ne doit jamais faire chuter vos droits de vote sous les seuils critiques.',
        zh: '适度老股套现可以让创始人卸下生活重担、保持更长远的战略定力，但绝对不能盲目以牺牲主权为代价！顶尖创始人的操盘法则是：早在A/B轮就必须预先植入10:1超级投票权，即便经济持股跌到26%，投票权依然保持在70%以上，方能进退自如！',
      },
      realWorldCase: {
        en: 'Evan Spiegel (Snapchat) and Travis Kalanick (Uber) negotiated substantial secondary liquidity while retaining high-voting Class B/C shares to insulate their founder control.',
        fr: 'Evan Spiegel (Snapchat) a réalisé des ventes secondaires tout en conservant des actions à vote super-majoritaire.',
        zh: 'Snapchat创始人伊万·斯皮格尔（Evan Spiegel）在历次融资中实现了数千万美元老股套现，但始终通过无投票权C类股和超高投票权A/B类股牢牢将Snap控制权锁死在手中。',
      },
      goldenRule: {
        en: 'Golden Rule: Never sell secondary equity below the 33.4% veto threshold unless Dual-Class super-voting stock has already been secured.',
        fr: 'Règle d’Or : Ne vendez jamais sous les 33,4 % sans avoir verrouillé une structure à droits de vote multiples.',
        zh: '防卫铁律：除非早已构筑AB股超级表决权，否则绝不在老股套现中让经济持股跌破33.4%一票否决权红线！',
      },
    },
  };
}

const GENERATOR_FACTORIES = [
  genEsopShuffleTrap,
  genBoardroomMajorityDefense,
  genDualClassDefense,
  genLiquidationPreferenceTrap,
  genAntiDilutionDefense,
  genPayToPlaySanction,
  genFounderVestingClawback,
  genDragAlongThreshold,
  genProtectiveProvisionsVeto,
  genSafeVsPricedDilution,
  genCumulativeDividendTrap,
  genSecondarySaleDiscipline,
];

/**
 * Generate a procedural dynamic session of non-repeating Cap Table Defense questions
 * @param tier 'junior' (5 questions) | 'mid' (25 questions) | 'senior' (50 questions)
 */
export function generateDynamicCapTableSession(tier: CapTableDefenseTier): CapTableQuestion[] {
  let count = 5;
  let timeLimit = 25;

  if (tier === 'mid') {
    count = 25;
    timeLimit = 20;
  } else if (tier === 'senior') {
    count = 50;
    timeLimit = 15;
  }

  const questions: CapTableQuestion[] = [];
  const usedKeys = new Set<string>();

  let attempts = 0;
  while (questions.length < count && attempts < count * 8) {
    attempts++;
    const factory = getRandomItem(GENERATOR_FACTORIES);
    const qId = `dyn_cap_${tier}_${questions.length + 1}_${Date.now().toString(36).slice(-4)}`;
    const q = factory(qId, timeLimit);
    q.tier = tier;

    // Deduplication fingerprint
    const fingerprint = `${q.category}_${q.options.find((o) => o.isCorrect)?.text.slice(0, 30)}`;

    if (!usedKeys.has(fingerprint)) {
      usedKeys.add(fingerprint);
      questions.push(q);
    }
  }

  // Fallback padding if strict deduplication under 50 questions capped
  while (questions.length < count) {
    const factory = getRandomItem(GENERATOR_FACTORIES);
    const qId = `dyn_cap_${tier}_${questions.length + 1}_pad_${Math.random()}`;
    const q = factory(qId, timeLimit);
    q.tier = tier;
    questions.push(q);
  }

  return questions;
}
