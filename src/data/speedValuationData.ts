import { LocalizedString } from '../types';

export type SpeedValuationTier = 'junior' | 'mid' | 'senior';

export interface ValuationQuestion {
  id: string;
  category:
    | 'post_money'
    | 'equity_dilution'
    | 'pre_from_stake'
    | 'esop_shuffle'
    | 'share_price'
    | 'safe_discount'
    | 'exit_multiple'
    | 'note_interest'
    | 'down_round'
    | 'step_up'
    | 'secondary_discount';
  title: LocalizedString;
  context: LocalizedString; // VC dialog or scenario context
  givenFacts: {
    label: LocalizedString;
    value: string;
  }[];
  question: LocalizedString;
  options: {
    text: string;
    isCorrect: boolean;
    trapNote: LocalizedString; // Why this wrong choice is a common trap
  }[];
  mentalShortcut: {
    formulaName: LocalizedString;
    ruleOfThumb: LocalizedString; // The 3-second mental trick
    explanation: LocalizedString;
  };
  timeLimitSeconds: number;
}

// Famous tier-1 venture firms and partners for realistic boardroom contextual flavor
const VC_PARTNERS = [
  { name: 'Sarah Lin', firm: 'Sequoia Capital' },
  { name: 'Marcus Vance', firm: 'Horizon Ventures' },
  { name: 'Victoria Sterling', firm: 'Sterling & Bourne' },
  { name: 'Elena Rostova', firm: 'Index Partners' },
  { name: 'Kenji Takahashi', firm: 'Apex Vision Fund' },
  { name: 'David Khosla', firm: 'Founders Syndicate' },
  { name: 'Claire Valois', firm: 'Partech Growth' },
  { name: 'Dr. Arthur Chen', firm: 'Singularity Frontier' },
  { name: 'Sophie Bernard', firm: 'Benchmark Capital' },
  { name: 'Alexandre Meyer', firm: 'Accel Partners' },
  { name: 'Liam O’Connor', firm: 'Bessemer Venture' },
  { name: 'Helena Lindqvist', firm: 'Nordic Valhalla' },
];

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// -------------------------------------------------------------
// DYNAMIC PROCEDURAL GENERATORS (14 Real-world Deal Archetypes)
// -------------------------------------------------------------

function genPostMoneyAddition(id: string, timeLimit: number): ValuationQuestion {
  const preValues = [6, 8, 10, 12, 14, 15, 16, 18, 20, 24, 25, 28, 30, 35, 40, 50];
  const checkValues = [1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7.5, 8, 10];
  const pre = getRandomItem(preValues);
  const check = getRandomItem(checkValues);
  const post = pre + check;
  const partner = getRandomItem(VC_PARTNERS);

  const correct = `$${post.toFixed(1).replace('.0', '')}M`;
  const wrong1 = `$${(pre - check > 0 ? pre - check : pre * 0.8).toFixed(1).replace('.0', '')}M`;
  const wrong2 = `$${pre.toFixed(1).replace('.0', '')}M`;
  const wrong3 = `$${(post + check).toFixed(1).replace('.0', '')}M`;

  return {
    id,
    category: 'post_money',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Pre-to-Post Valuation Bridge',
      fr: 'Passerelle Pré vers Post-Money',
      zh: '投前转投后基础定桩',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "We are writing a $${check}M lead check into your round at a $${pre}M Pre-Money valuation."`,
      fr: `${partner.name} (${partner.firm}) : « Nous investissons un ticket de ${check} M$ sur une valorisation Pré-Money de ${pre} M$. »`,
      zh: `${partner.name}（${partner.firm}）：“我们以${pre}00万美元投前估值，领投开出${check}00万美元支票。”`,
    },
    givenFacts: [
      { label: { en: 'Pre-Money', fr: 'Pré-Money', zh: '投前估值' }, value: `$${pre}.0M` },
      { label: { en: 'Investment Check', fr: 'Ticket Investisseur', zh: '投资金额' }, value: `$${check}M` },
    ],
    question: {
      en: 'What is the resulting Post-Money Valuation?',
      fr: 'Quelle est la valorisation Post-Money résultante ?',
      zh: '交割完成后的【投后估值 (Post-Money)】是多少？',
    },
    options: shuffle([
      {
        text: correct,
        isCorrect: true,
        trapNote: {
          en: `Exact! Post-Money = Pre ($${pre}M) + Check ($${check}M) = $${post}M.`,
          fr: `Exact ! Post-Money = Pré (${pre} M$) + Chèque (${check} M$) = ${post} M$.`,
          zh: `完全正确！投后估值 = 投前 ($${pre}M) + 投资款 ($${check}M) = $${post}M。`,
        },
      },
      {
        text: wrong1,
        isCorrect: false,
        trapNote: {
          en: 'Subtracted investment instead of adding. Cash in always increases equity base.',
          fr: 'Vous avez soustrait le cash injecté au lieu de l’ajouter.',
          zh: '误将投资款做减法。投资人现金进入公司必定增加整体股权净值基数。',
        },
      },
      {
        text: wrong2,
        isCorrect: false,
        trapNote: {
          en: 'You repeated Pre-Money. Post-Money must reflect the new capital.',
          fr: 'Vous avez confondu Pré et Post. Le cash nouveau élargit la base.',
          zh: '混淆了投前与投后。现金注入后必须扩充整体股权盘子。',
        },
      },
      {
        text: wrong3,
        isCorrect: false,
        trapNote: {
          en: 'Double-counted the check. Watch your mental math addition.',
          fr: 'Double comptage de l’investissement.',
          zh: '重复多计提了投资款。进位心算失误。',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The Additive Anchor Law',
        fr: 'Loi Additive Fondamentale',
        zh: '投后加法定律',
      },
      ruleOfThumb: {
        en: 'Post-Money = Pre-Money + Check Size (Immediate 1-second addition)',
        fr: 'Post-Money = Pré-Money + Chèque (Addition instantanée)',
        zh: '投后估值 = 投前估值 + 投资金额（1秒加法，绝不含糊）',
      },
      explanation: {
        en: 'Never hesitate on the basic Post-Money bridge. Lock the number immediately before negotiating percentages.',
        fr: 'Ne trébuchez jamais sur l’addition de base. Verrouillez le Post-Money d’une traite.',
        zh: '在谈判桌上，对方报出Pre与Check后，第一秒脱口而出Post-Money，瞬间在气场上确立专业地位。',
      },
    },
  };
}

function gen20PctInversion(id: string, timeLimit: number): ValuationQuestion {
  const checks = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8];
  const check = getRandomItem(checks);
  const post = check * 5;
  const pre = check * 4;
  const partner = getRandomItem(VC_PARTNERS);

  return {
    id,
    category: 'pre_from_stake',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The 20% Stake Inversion (5x Rule)',
      fr: 'Règle Inversée du 20 % (Règle du 5x)',
      zh: '20% 股权倒推估值（5倍心算法）',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "We are willing to lead your round with a $${check}M check for an even 20.0% equity stake."`,
      fr: `${partner.name} (${partner.firm}) : « Nous menons le tour avec un ticket de ${check} M$ pour exactement 20,0 % du capital. »`,
      zh: `${partner.name}（${partner.firm}）：“我们出资${check}00万美元，条件是拿走公司整整20.0%的投后股权。”`,
    },
    givenFacts: [
      { label: { en: 'Investment Check', fr: 'Ticket Investisseur', zh: '投资金额' }, value: `$${check}.0M` },
      { label: { en: 'Target Stake', fr: 'Part du Capital', zh: '目标持股' }, value: '20.0% (1/5)' },
    ],
    question: {
      en: 'What is the implied PRE-Money Valuation being offered?',
      fr: 'Quelle est la valorisation PRÉ-Money implicite proposée ?',
      zh: '该笔出价暗含的【投前估值 (Pre-Money)】是多少？',
    },
    options: shuffle([
      {
        text: `$${pre.toFixed(1).replace('.0', '')}M`,
        isCorrect: true,
        trapNote: {
          en: `Flawless! 20% means Post = 5x check ($${post}M), Pre = 4x check = $${pre}M.`,
          fr: `Impeccable ! 20 % signifie Post = 5x (${post} M$), Pré = 4x = ${pre} M$.`,
          zh: `精准绝杀！20%意味着投后是5倍($${post}M)，投前是4倍：${check} × 4 = $${pre}M。`,
        },
      },
      {
        text: `$${post.toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: `That is Post-Money! You forgot to subtract the $${check}M check to get Pre-Money.`,
          fr: `C’est le Post-Money ! Il faut déduire le chèque pour trouver le Pré.`,
          zh: `这是投后估值！题目问的是投前，没有扣除稀释进来的${check}00万投资款。`,
        },
      },
      {
        text: `$${(check * 3).toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'Undercalculated. Multiplied by 3 instead of 4.',
          fr: 'Sous-estimé d’un facteur. Multiplié par 3 au lieu de 4.',
          zh: '算低了。乘以了3倍而非4倍。',
        },
      },
      {
        text: `$${(pre + check * 2).toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'Overestimated. If Pre were this high, the check would purchase far less than 20%.',
          fr: 'Surestimation. À ce niveau, le chèque n’achèterait pas 20 %.',
          zh: '高估了投前。若投前这么高，${check}00万买不到20%股权。',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The 20% = 5x Post / 4x Pre Law',
        fr: 'Règle du 20 % = 5x Post / 4x Pré',
        zh: '20% 股权四五倍心算法',
      },
      ruleOfThumb: {
        en: '20% stake means Post-Money = 5 × Check, Pre-Money = 4 × Check!',
        fr: '20 % = Post à 5x le chèque, Pré à 4x le chèque !',
        zh: '出让20%：投后必是投资款的5倍，投前必是投资款的4倍！（快速乘以4即得投前）',
      },
      explanation: {
        en: 'Since 20% = 1/5, the existing 80% represents 4 parts. Multiply check size by 4 to get Pre-Money instantly in under 2 seconds!',
        fr: '20 % = 1/5. Les 80 % restants représentent 4 parts. Multipliez le chèque par 4 pour le Pré !',
        zh: '20%即五分之一，创始人保留的80%恰好是投资款的4倍。听到20%出价，直接拿支票乘4得投前，秒杀一切繁琐计算。',
      },
    },
  };
}

function gen16PctInversion(id: string, timeLimit: number): ValuationQuestion {
  const checks = [1.2, 1.5, 1.8, 2.0, 2.4, 3.0, 3.6, 4.2, 4.8, 6.0];
  const check = getRandomItem(checks);
  const post = Math.round(check * 6 * 10) / 10;
  const pre = Math.round(check * 5 * 10) / 10;
  const partner = getRandomItem(VC_PARTNERS);

  return {
    id,
    category: 'pre_from_stake',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The 1/6th Rule (16.67% Stake)',
      fr: 'Règle du Sixième (16,67 %)',
      zh: '16.67% 六分之一心算法则',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "Our investment committee requires a 16.67% post-round stake for a $${check}M check."`,
      fr: `${partner.name} (${partner.firm}) : « Notre comité exige 16,67 % du capital Post pour un chèque de ${check} M$. »`,
      zh: `${partner.name}（${partner.firm}）：“我们投委会要求出资${check}00万美元，占投后恰好16.67%的股权。”`,
    },
    givenFacts: [
      { label: { en: 'Investment Check', fr: 'Ticket Investisseur', zh: '投资金额' }, value: `$${check}M` },
      { label: { en: 'Equity Stake', fr: 'Part du Capital', zh: '出让股权' }, value: '16.67% (1/6)' },
    ],
    question: {
      en: 'What is the implied PRE-Money Valuation?',
      fr: 'Quelle est la valorisation PRÉ-Money implicite ?',
      zh: '该笔出价对应的【投前估值 (Pre-Money)】是多少？',
    },
    options: shuffle([
      {
        text: `$${pre.toFixed(1).replace('.0', '')}M`,
        isCorrect: true,
        trapNote: {
          en: `Masterful! 16.67% = 1/6. Post = 6x ($${post}M), Pre = 5x = $${pre}M.`,
          fr: `Magistral ! 16,67 % = 1/6. Post = 6x (${post} M$), Pré = 5x = ${pre} M$.`,
          zh: `神算之境！16.67% = 1/6。投后是6倍($${post}M)，投前是5倍：${check} × 5 = $${pre}M。`,
        },
      },
      {
        text: `$${post.toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'You gave Post-Money! Subtract the check size to get Pre-Money.',
          fr: 'C’est le Post-Money ! Il faut soustraire le chèque pour le Pré.',
          zh: '这是投后估值！必须扣减投资款才能得出投前估值。',
        },
      },
      {
        text: `$${(check * 4).toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'Multiplied by 4 (the 20% rule), but 16.67% requires multiplying by 5.',
          fr: 'Multiplication par 4 au lieu de 5.',
          zh: '乘了4倍（那是20%的规则），16.67%投前需要乘5倍。',
        },
      },
      {
        text: `$${(check * 7).toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'Multiplied by 7 (the 12.5% rule). Keep fractional shortcuts distinct.',
          fr: 'Confusion avec la règle du 12,5 % (1/8).',
          zh: '乘了7倍（那是12.5%的规则），切莫混淆关键分数。',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The 16.67% = 1/6 Multiplier Rule',
        fr: 'Règle du Sixième (16,67 % = 6x)',
        zh: '16.67% 六分之一心算法则',
      },
      ruleOfThumb: {
        en: '16.67% = 1/6th of Post-Money! Post = Check × 6. Pre = Check × 5!',
        fr: '16,67 % = 1/6 du Post ! Post = Chèque × 6. Pré = Chèque × 5 !',
        zh: '16.67% 恰好是六分之一(1/6)！投后 = 支票 × 6；投前 = 支票 × 5！',
      },
      explanation: {
        en: 'Seasoned VCs love 1/6th equity stakes. Multiply check by 5 to find Pre-Money before they take their next sip of coffee.',
        fr: 'Les VC adorent le 1/6e. Multipliez le chèque par 5 pour trouver le Pré instantanément.',
        zh: '顶尖创投老炮的看家本领：16.67%对应1/6。求投前直接拿支票金额乘5，1秒报出底价。',
      },
    },
  };
}

function gen12PctInversion(id: string, timeLimit: number): ValuationQuestion {
  const checks = [0.8, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0];
  const check = getRandomItem(checks);
  const post = Math.round(check * 8 * 10) / 10;
  const pre = Math.round(check * 7 * 10) / 10;
  const partner = getRandomItem(VC_PARTNERS);

  return {
    id,
    category: 'pre_from_stake',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The 1/8th Angel Check (12.5% Stake)',
      fr: 'Le Billet au Huitième (12,5 %)',
      zh: '12.5% 八分之一天使出算法',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "Our angel syndicate offers $${check}M for an even 12.5% post-money equity stake."`,
      fr: `${partner.name} (${partner.firm}) : « Notre syndicat d’anges propose ${check} M$ pour exactement 12,5 % du capital Post. »`,
      zh: `${partner.name}（${partner.firm}）：“我们天使财团出资${check}00万美元，占投后刚好12.5%的股权。”`,
    },
    givenFacts: [
      { label: { en: 'Investment Check', fr: 'Ticket Investisseur', zh: '投资金额' }, value: `$${check}M` },
      { label: { en: 'Target Stake', fr: 'Part du Capital', zh: '目标持股' }, value: '12.5% (1/8)' },
    ],
    question: {
      en: 'What is the implied POST-Money Valuation?',
      fr: 'Quelle est la valorisation POST-Money implicite ?',
      zh: '该笔出价暗含的【投后估值 (Post-Money)】是多少？',
    },
    options: shuffle([
      {
        text: `$${post.toFixed(1).replace('.0', '')}M`,
        isCorrect: true,
        trapNote: {
          en: `Bullseye! 12.5% = 1/8. Post-Money is 8 × $${check}M = $${post}M!`,
          fr: `Dans le mille ! 12,5 % = 1/8. Le Post-Money vaut 8 × ${check} M$ = ${post} M$ !`,
          zh: `直击靶心！12.5% = 1/8。投后估值 = 8 × $${check}M = $${post}M！（投前则是 $${pre}M）。`,
        },
      },
      {
        text: `$${pre.toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'That is the Pre-Money valuation! The prompt asked for Post-Money.',
          fr: 'C’est le Pré-Money ! La question demandait le Post-Money.',
          zh: '这是投前估值！题目问的是投后估值，切勿混淆两者。',
        },
      },
      {
        text: `$${(check * 10).toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'Multiplied by 10 (10% stake). 12.5% requires multiplying by 8.',
          fr: 'Multiplication par 10 au lieu de 8.',
          zh: '乘了10倍（那是10%的规则）。12.5%对应的乘数是8。',
        },
      },
      {
        text: `$${(check * 6).toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'Multiplied by 6 (the 16.67% rule). 1/8 = 8x.',
          fr: 'Confusion avec le 1/6.',
          zh: '乘了6倍（那是16.67%的规则）。1/8对应的是8倍。',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The 12.5% = 1/8 Multiplier Shortcut',
        fr: 'Règle du Huitième (12,5 % = 8x)',
        zh: '12.5% 八倍倒推心算法',
      },
      ruleOfThumb: {
        en: '12.5% is exactly 1/8th! Post-Money = Check × 8. Pre-Money = Check × 7.',
        fr: '12,5 % = exactement 1/8e ! Post = Chèque × 8. Pré = Chèque × 7.',
        zh: '12.5% 恰好是 1/8！投后估值 = 投资额 × 8；投前估值 = 投资额 × 7！',
      },
      explanation: {
        en: 'Any binary fraction (12.5% = 1/8) simplifies into multiplying by 8 for Post, and 7 for Pre. Computed in under 2 seconds.',
        fr: '12,5 % se résout en multipliant le chèque par 8 pour le Post, et par 7 pour le Pré.',
        zh: '天使与早期机构极喜好12.5%干净分数。大脑迅速反应：投后乘8，投前乘7，两秒定音。',
      },
    },
  };
}

function genEsopPoolShuffle(id: string, timeLimit: number): ValuationQuestion {
  const headlines = [10, 15, 20, 25, 30, 40];
  const pools = [10, 15, 20];
  const headline = getRandomItem(headlines);
  const pool = getRandomItem(pools);
  const effective = Math.round(headline * (1 - pool / 100) * 10) / 10;
  const shaved = Math.round((headline - effective) * 10) / 10;
  const partner = getRandomItem(VC_PARTNERS);

  return {
    id,
    category: 'esop_shuffle',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'The Pre-Money Option Pool Trap',
      fr: 'Le Piège du Pool d’Options Pré-Money',
      zh: '期权池洗牌陷阱（隐蔽估值大打折）',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "We offer $${headline}.0M Pre-Money, CONDITIONED on creating an unallocated ${pool}% ESOP pool entirely out of the PRE-money cap table."`,
      fr: `${partner.name} (${partner.firm}) : « Nous proposons ${headline},0 M$ Pré-Money, à condition de créer un pool ESOP de ${pool} % AVANT le tour (sur le Pré). »`,
      zh: `${partner.name}（${partner.firm}）：“我们报价投前估值${headline}00万美元，前提是交割前必须在【投前】设立${pool}%的未分配期权池。”`,
    },
    givenFacts: [
      { label: { en: 'Headline Pre-Money', fr: 'Pré-Money Facial', zh: '面子投前估值' }, value: `$${headline}.0M` },
      { label: { en: 'Pre-Money ESOP', fr: 'Pool ESOP Requis', zh: '投前强制期权池' }, value: `${pool}.0%` },
    ],
    question: {
      en: 'What is the TRUE Effective Pre-Money Valuation paid for existing founder shares?',
      fr: 'Quelle est la VRAIE valorisation Pré-Money effective payée pour les actions fondateurs ?',
      zh: '剔除这笔由创始人单方面承担的期权池后，创始人真实的【有效投前估值】是多少？',
    },
    options: shuffle([
      {
        text: `$${effective.toFixed(1).replace('.0', '')}M`,
        isCorrect: true,
        trapNote: {
          en: `Masterful! Effective Pre = Headline ($${headline}M) × (1 - ${pool}%) = $${effective}M. The VC shaved $${shaved}M off your valuation!`,
          fr: `Magistral ! Pré effectif = ${headline} M$ × (1 - ${pool} %) = ${effective} M$. L’investisseur vous a rogné ${shaved} M$ !`,
          zh: `神级洞察！有效投前 = 名义投前 ($${headline}M) × (1 - ${pool}%) = $${effective}M。VC用期权池隐蔽削减了你$${shaved}M真实估值！`,
        },
      },
      {
        text: `$${headline.toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'Fell for the headline illusion. Because the pool is carved out of pre-money, founders absorb 100% of the dilution.',
          fr: 'Vous avez mordu au chiffre de façade. Le pool dilue les fondateurs à 100 % avant l’entrée du nouvel arrivant.',
          zh: '被面子数字蒙蔽。因为期权池完全从交割前老股中掏出，创始人持股被就地折价。',
        },
      },
      {
        text: `$${(headline - pool * 0.1).toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'Decimal math confusion. Calculate percentage multiplication, not a raw subtraction.',
          fr: 'Erreur décimale sur le calcul du pourcentage.',
          zh: '小数位心算失误。期权池折价是比例相乘，不是直接减去百分比数值。',
        },
      },
      {
        text: `$${(effective * 0.8).toFixed(1).replace('.0', '')}M`,
        isCorrect: false,
        trapNote: {
          en: 'Overcalculated the discount.',
          fr: 'Décote surestimée.',
          zh: '过度放大了折价幅度。',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The Option Pool Haircut Shortcut',
        fr: 'Règle de la Décote du Pool ESOP',
        zh: '期权池洗牌折价心算法',
      },
      ruleOfThumb: {
        en: 'Effective Pre-Money = Headline Pre-Money × (100% - ESOP %)',
        fr: 'Pré Effectif = Pré Facial × (100 % - % Pool)',
        zh: '真实有效投前 = 名义投前 × (100% - 投前期权池比例)',
      },
      explanation: {
        en: 'VCs use pre-money option pools to lower valuation without changing the press release headline. Always calculate Effective Pre!',
        fr: 'Les VC utilisent le pool pré-money pour réduire discrètement la valorisation. Calculez toujours le Pré effectif !',
        zh: '顶级VC最常用的套路：表面给高估值满足虚荣心，背后强塞大期权池压低底价。心算一秒看穿真实底牌！',
      },
    },
  };
}

function genPerSharePrice(id: string, timeLimit: number): ValuationQuestion {
  const sharesList = [5, 10, 20];
  const preValues = [15, 20, 25, 30, 40, 50];
  const shares = getRandomItem(sharesList);
  const pre = getRandomItem(preValues);
  const price = (pre / shares).toFixed(2);
  const partner = getRandomItem(VC_PARTNERS);

  return {
    id,
    category: 'share_price',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Share Price Mental Division',
      fr: 'Division Éclair du Prix par Action',
      zh: '每股发行单价速算法',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "You have exactly ${shares},000,000 fully diluted common shares. Our term sheet prices the Pre-Money at $${pre}.0M."`,
      fr: `${partner.name} (${partner.firm}) : « Vous avez ${shares} 000 000 d’actions diluées. Notre term sheet fixe le Pré à ${pre},0 M$. »`,
      zh: `${partner.name}（${partner.firm}）：“你公司目前完全稀释总股本为${shares},000,000股。我们意向书给出的投前估值为${pre}00万美元。”`,
    },
    givenFacts: [
      { label: { en: 'Pre-Money Valuation', fr: 'Pré-Money', zh: '投前估值' }, value: `$${pre},000,000` },
      { label: { en: 'Total Pre-Round Shares', fr: 'Actions Totales', zh: '完全稀释总股本' }, value: `${shares},000,000` },
    ],
    question: {
      en: 'What is the exact Issue Price Per Share for Series A Preferred Stock?',
      fr: 'Quel est le prix d’émission exact par action pour la Série A ?',
      zh: '本次A轮优先股的【每股发行价格 (Price Per Share)】是多少？',
    },
    options: shuffle([
      {
        text: `$${price} / share`,
        isCorrect: true,
        trapNote: {
          en: `Spot on! Price = Pre-Money ($${pre}M) / Pre-round Shares (${shares}M) = $${price}/share.`,
          fr: `Exact ! Prix = Pré (${pre} M$) / Actions (${shares} M) = ${price} $/action.`,
          zh: `干净利落！每股单价 = 投前 ($${pre}M) / 投前股数 (${shares}M) = $${price} / 股。`,
        },
      },
      {
        text: `$${(parseFloat(price) / 10).toFixed(2)} / share`,
        isCorrect: false,
        trapNote: {
          en: 'Lost a zero in mental decimal shifting.',
          fr: 'Erreur d’un zéro dans le décalage décimal.',
          zh: '位数错误，少算了一个零。',
        },
      },
      {
        text: `$${(parseFloat(price) * 10).toFixed(2)} / share`,
        isCorrect: false,
        trapNote: {
          en: 'Overcalculated by 10x.',
          fr: 'Facteur 10 en trop.',
          zh: '高估了10倍。',
        },
      },
      {
        text: `$${(parseFloat(price) + 0.75).toFixed(2)} / share`,
        isCorrect: false,
        trapNote: {
          en: 'Arithmetic overshoot.',
          fr: 'Calcul imprécis.',
          zh: '除法心算进位偏差。',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The Millions-Cancel Division Rule',
        fr: 'Règle de Simplification des Millions',
        zh: '百万对消速除法',
      },
      ruleOfThumb: {
        en: 'Share Price = Millions of Pre-Money ÷ Millions of Shares (Cancel both "M"s!)',
        fr: 'Prix = Millions de Pré ÷ Millions d’Actions (Biffez les "M" !)',
        zh: '每股发行价 = 投前估值(百万) ÷ 现有总股数(百万) [直接对消百万单位，${pre} ÷ ${shares} = $${price}]',
      },
      explanation: {
        en: 'Never count seven zeroes in your head. Cancel the "Millions" unit on both sides: $25M / 10M shares = 25 / 10 = $2.50.',
        fr: 'Ne comptez jamais sept zéros. Simplifiez l’unité million : 25 M$ / 10 M = 2,50 $.',
        zh: '千万别在脑子里数零。两边都带“百万”，直接约掉：${pre}除以${shares}，心算秒得答案。',
      },
    },
  };
}

function genSafeCapVsDiscount(id: string, timeLimit: number): ValuationQuestion {
  const caps = [6, 8, 10, 12];
  const seriesAPres = [12, 15, 18, 20];
  const cap = getRandomItem(caps);
  const seriesPre = getRandomItem(seriesAPres.filter((p) => p > cap));
  const discountVal = Math.round(seriesPre * 0.8 * 10) / 10;
  const partner = getRandomItem(VC_PARTNERS);

  const capWins = cap < discountVal;
  const winningVal = capWins ? cap : discountVal;

  return {
    id,
    category: 'safe_discount',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'SAFE Valuation Cap vs 20% Discount Clash',
      fr: 'Arbitrage SAFE : Plafond vs Décote 20 %',
      zh: 'SAFE 估值上限与20%折价博弈决断',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "Your seed angel holds a SAFE with a $${cap}.0M Valuation Cap and a 20% Discount. Series A is priced at $${seriesPre}.0M Pre-Money."`,
      fr: `${partner.name} (${partner.firm}) : « Un business angel détient un SAFE à ${cap},0 M$ de Cap et 20 % de décote. La Série A est fixée à ${seriesPre},0 M$ Pré. »`,
      zh: `${partner.name}（${partner.firm}）：“早期天使持有一份附带【${cap}00万估值上限 (Cap)】与【20%折价率】的SAFE。本轮A轮正式投前估值为${seriesPre}00万美元。”`,
    },
    givenFacts: [
      { label: { en: 'SAFE Valuation Cap', fr: 'Plafond SAFE', zh: 'SAFE估值上限' }, value: `$${cap}.0M` },
      { label: { en: 'SAFE Discount', fr: 'Décote SAFE', zh: 'SAFE折价' }, value: '20.0%' },
      { label: { en: 'Series A Pre-Money', fr: 'Pré-Money Série A', zh: 'A轮正式投前估值' }, value: `$${seriesPre}.0M` },
    ],
    question: {
      en: 'At what effective valuation will the SAFE convert into equity?',
      fr: 'À quelle valorisation effective le SAFE se convertira-t-il ?',
      zh: '根据保护投资人利益原则，该SAFE将以哪一个【有效估值】执行转股？',
    },
    options: shuffle([
      {
        text: `$${cap}.0M (Cap Prevails)`,
        isCorrect: capWins,
        trapNote: {
          en: `20% discount on $${seriesPre}M = $${discountVal}M. Since $${cap}M Cap < $${discountVal}M, the Cap yields a lower share price and wins!`,
          fr: `20 % de décote sur ${seriesPre} M$ = ${discountVal} M$. Comme ${cap} M$ < ${discountVal} M$, le Cap l’emporte !`,
          zh: `20%折价对应估值为 $${seriesPre}M × 0.8 = $${discountVal}M。由于 $${cap}M 上限更低，转股价格更便宜，上限胜出！`,
        },
      },
      {
        text: `$${discountVal}M (Discount Prevails)`,
        isCorrect: !capWins,
        trapNote: {
          en: `Discount yields $${discountVal}M. Compare to the Cap to see which gives a lower price.`,
          fr: `La décote donne ${discountVal} M$.`,
          zh: `折价换算出的有效估值是$${discountVal}M。`,
        },
      },
      {
        text: `$${seriesPre}.0M (Uncapped Conversion)`,
        isCorrect: false,
        trapNote: {
          en: 'Ignored both Cap and Discount. Early risk-takers never convert at full price.',
          fr: 'Vous avez ignoré le plafond et la décote.',
          zh: '完全忽略了上限与折价保护。早期天使绝不可能按A轮原价转股。',
        },
      },
      {
        text: `$${(cap * 0.8).toFixed(1).replace('.0', '')}M (Double-Dip Trap)`,
        isCorrect: false,
        trapNote: {
          en: 'You applied the discount TO the Cap! Cap and Discount are strictly ALTERNATIVES, they never stack.',
          fr: 'Vous avez appliqué la décote sur le plafond ! Les deux clauses ne se cumulent jamais.',
          zh: '双重计提错误！你把20%折价又扣在估值上限上。上限与折价是“二选一”选择权，绝不可叠加！',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The Cap vs Discount Showdown',
        fr: 'Duel Plafond contre Décote',
        zh: '上限 vs 折价心算PK法则',
      },
      ruleOfThumb: {
        en: 'Compute Discount Value: Pre × (1 - Discount). Compare with Cap. The LOWER number wins!',
        fr: 'Calculez : Pré × (1 - Décote). Comparez au Cap. Le montant le plus BAS l’emporte !',
        zh: '心算法：折价估值 = 现轮估值 × 0.8。与上限对比，哪个数字【更低】，就以哪个转股！',
      },
      explanation: {
        en: 'SAFE holders convert at whichever mechanism gives them the lower price per share (more shares). Lower valuation = higher ownership.',
        fr: 'L’investisseur choisit l’option lui octroyant le plus grand nombre de titres (la valorisation la plus basse).',
        zh: 'SAFE转股原则是投资人利益最大化。哪种机制算出的估值更低（每股更便宜），就执行哪种。',
      },
    },
  };
}

function genFounderRetention(id: string, timeLimit: number): ValuationQuestion {
  const currentStakes = [70, 75, 80, 85];
  const dilutions = [20, 25];
  const current = getRandomItem(currentStakes);
  const dilution = getRandomItem(dilutions);
  const retained = Math.round(current * (1 - dilution / 100) * 10) / 10;
  const partner = getRandomItem(VC_PARTNERS);

  return {
    id,
    category: 'equity_dilution',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Founder Equity Retention After Dilution',
      fr: 'Rétention du Capital Fondateur Après Dilution',
      zh: '稀释后创始人留存股权心算',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "Your founding team currently owns ${current}.0% of the company. Our round acquires a ${dilution}.0% post-money stake."`,
      fr: `${partner.name} (${partner.firm}) : « L’équipe fondatrice détient ${current},0 %. Notre tour acquiert ${dilution},0 % Post-Money. »`,
      zh: `${partner.name}（${partner.firm}）：“创始团队目前持有公司${current}.0%的股权。本轮新投资人将获得${dilution}.0%的投后股权。”`,
    },
    givenFacts: [
      { label: { en: 'Pre-Round Founder Ownership', fr: 'Part Fondateur Initiale', zh: '轮前创始人持股' }, value: `${current}.0%` },
      { label: { en: 'New Round Dilution', fr: 'Dilution du Tour', zh: '新轮出让比例' }, value: `${dilution}.0%` },
    ],
    question: {
      en: 'What exact percentage of the company do the founders retain post-round?',
      fr: 'Quel pourcentage exact du capital les fondateurs conservent-ils après le tour ?',
      zh: '交割完成后，创始团队在公司中的持股比例将变为多少？',
    },
    options: shuffle([
      {
        text: `${retained.toFixed(1).replace('.0', '')}%`,
        isCorrect: true,
        trapNote: {
          en: `Flawless multiplication! Retained = ${current}% × (1 - ${dilution}%) = ${retained}%.`,
          fr: `Calcul parfait ! Part restante = ${current} % × (1 - ${dilution} %) = ${retained} %.`,
          zh: `毫无破绽！留存持股 = ${current}% × (1 - ${dilution}%) = ${retained}%。`,
        },
      },
      {
        text: `${current - dilution}%`,
        isCorrect: false,
        trapNote: {
          en: `Fatal subtraction error! You subtracted ${dilution}% directly (${current} - ${dilution} = ${current - dilution}%). Dilution is multiplicative, not additive!`,
          fr: `Erreur de soustraction brute (${current} - ${dilution} = ${current - dilution} %). La dilution est un produit proportionnel !`,
          zh: `致命减法陷阱：你直接拿 ${current}% 减去 ${dilution}%（${current} - ${dilution} = ${current - dilution}%）。股权稀释是乘法比例萎缩，绝不可做减法！`,
        },
      },
      {
        text: `${(retained + 5).toFixed(1).replace('.0', '')}%`,
        isCorrect: false,
        trapNote: {
          en: 'Undercalculated dilution impact.',
          fr: 'Dilution sous-estimée.',
          zh: '低估了稀释影响。',
        },
      },
      {
        text: `${(retained - 5).toFixed(1).replace('.0', '')}%`,
        isCorrect: false,
        trapNote: {
          en: 'Overcalculated dilution impact.',
          fr: 'Dilution surestimée.',
          zh: '高估了稀释影响。',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The Multiplicative Retention Rule',
        fr: 'Règle de Rétention Multiplicative',
        zh: '留存股权乘数定律',
      },
      ruleOfThumb: {
        en: 'Retained % = Existing % × (100% - Round Dilution %) [Never direct subtraction!]',
        fr: 'Part Restante = Part Actuelle × (100 % - Dilution %) [Jamais de soustraction directe !]',
        zh: '留存比例 = 既有比例 × (100% - 本轮出让比例) [切记用乘法，绝不可直接相减！]',
      },
      explanation: {
        en: 'When a new investor takes 20%, all existing shareholders retain 80% (4/5) of whatever they previously owned. Simple mental fraction multiplication.',
        fr: 'Quand le nouvel entrant prend 20 %, les associés existants conservent 80 % (les 4/5) de leurs actions respectives.',
        zh: '新投资人认购20%，老股东等比例保留原来份额的80%（4/5）。分数乘法瞬间心算。',
      },
    },
  };
}

function genExitMultipleTarget(id: string, timeLimit: number): ValuationQuestion {
  const checks = [2, 3, 4, 5, 6];
  const postMultiples = [4, 5]; // check is 20% or 25% of post
  const check = getRandomItem(checks);
  const multFactor = getRandomItem(postMultiples);
  const post = check * multFactor;
  const returnTarget = getRandomItem([5, 10]);
  const exitVal = post * returnTarget;
  const partner = getRandomItem(VC_PARTNERS);

  return {
    id,
    category: 'exit_multiple',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Target Exit Valuation Inversion',
      fr: 'Cible de Sortie pour Rendement de Fonds',
      zh: '基金门槛退出估值倒推心算',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "We are deploying $${check}.0M into a $${post}.0M Post-Money valuation. Our fund mandate requires a ${returnTarget}x return on this check at liquidity."`,
      fr: `${partner.name} (${partner.firm}) : « Nous investissons ${check},0 M$ sur ${post},0 M$ Post. Notre mandat exige un retour de ${returnTarget}x sur ce ticket. »`,
      zh: `${partner.name}（${partner.firm}）：“我们以${post}00万美元投后估值注资${check}00万美元。该基金投委会要求该笔投资退出时必须实现【${returnTarget}倍回报】。”`,
    },
    givenFacts: [
      { label: { en: 'Investment Check', fr: 'Ticket Investisseur', zh: '投资金额' }, value: `$${check}.0M` },
      { label: { en: 'Post-Money Valuation', fr: 'Post-Money', zh: '投后估值' }, value: `$${post}.0M` },
      { label: { en: 'Target Multiple', fr: 'Objectif de Rendement', zh: '目标回报倍数' }, value: `${returnTarget}x Cash-on-Cash` },
    ],
    question: {
      en: 'Assuming zero subsequent dilution, what minimum Exit Valuation must the company reach?',
      fr: 'En supposant zéro dilution future, quelle valorisation de sortie minimale faut-il atteindre ?',
      zh: '假设后续无额外稀释，公司退出时的【最低退出估值】必须达到多少？',
    },
    options: shuffle([
      {
        text: `$${exitVal}M`,
        isCorrect: true,
        trapNote: {
          en: `Sensational! Exit = Post-Money ($${post}M) × Return Target (${returnTarget}x) = $${exitVal}M!`,
          fr: `Magistral ! Sortie = Post-Money (${post} M$) × Multiple (${returnTarget}x) = ${exitVal} M$ !`,
          zh: `顶级水准！退出估值 = 投后估值 ($${post}M) × 回报倍数 (${returnTarget}x) = $${exitVal}M！一秒神算。`,
        },
      },
      {
        text: `$${check * returnTarget}M`,
        isCorrect: false,
        trapNote: {
          en: `That is only the VC’s cash proceeds ($${check}M × ${returnTarget} = $${check * returnTarget}M), not the whole company valuation!`,
          fr: `C’est uniquement le montant perçu par le fonds, pas la valorisation totale de la société !`,
          zh: `这只是VC自己分回的现金总额，不是整家公司的退出估值！`,
        },
      },
      {
        text: `$${Math.round(exitVal * 0.5)}M`,
        isCorrect: false,
        trapNote: {
          en: 'Undercalculated. Fails the fund multiple threshold.',
          fr: 'Insuffisant pour valider la thèse de rendement.',
          zh: '算低了一半，达不到基金硬性回报指标。',
        },
      },
      {
        text: `$${exitVal * 2}M`,
        isCorrect: false,
        trapNote: {
          en: 'Overestimated by 2x.',
          fr: 'Surestimation du double.',
          zh: '高估了2倍。',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The Target Exit Inversion Shortcut',
        fr: 'Règle Inversée de Sortie Cible',
        zh: '退出倍数投后对齐心算法',
      },
      ruleOfThumb: {
        en: 'Exit Valuation = Post-Money × Target Return Multiple ($${post}M × ${returnTarget} = $${exitVal}M!)',
        fr: 'Valorisation de Sortie = Post-Money × Multiple Cible (${post} M$ × ${returnTarget} = ${exitVal} M$ !)',
        zh: '退出估值 = 投后估值 × 目标回报倍数（$${post}M × ${returnTarget} = $${exitVal}M！一秒神算）',
      },
      explanation: {
        en: 'Because ownership percentage is fixed, returning 10x on the check is mathematically identical to multiplying the Post-Money by 10! Zero complex fractions required.',
        fr: 'Le multiple sur le chèque s’applique directement à la valorisation Post-Money. Zéro fraction complexe.',
        zh: '由于持股比例固定，投资款翻几倍，整家公司的投后估值就必须翻几倍。直接拿投后估值乘倍数，不用算复杂分母！',
      },
    },
  };
}

function genDownRoundHaircut(id: string, timeLimit: number): ValuationQuestion {
  const prevPosts = [40, 50, 60, 80, 100];
  const haircuts = [25, 30, 40, 50];
  const prev = getRandomItem(prevPosts);
  const haircut = getRandomItem(haircuts);
  const newPre = Math.round(prev * (1 - haircut / 100));
  const partner = getRandomItem(VC_PARTNERS);

  return {
    id,
    category: 'down_round',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Down-Round Valuation Haircut',
      fr: 'Décote de Valorisation (Down-Round)',
      zh: '降估值融资折让幅度速算',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "Your previous Series A closed at a $${prev}.0M Post-Money valuation. Today's market is cold; we offer $${newPre}.0M Pre-Money."`,
      fr: `${partner.name} (${partner.firm}) : « Votre Série A précédente s’est conclue à ${prev},0 M$ Post. Le marché s’est retourné : nous offrons ${newPre},0 M$ Pré. »`,
      zh: `${partner.name}（${partner.firm}）：“你们上一轮A轮投后估值为${prev}00万美元。当前资本严冬，我们开出的A+轮投前估值为${newPre}00万美元。”`,
    },
    givenFacts: [
      { label: { en: 'Previous Post-Money', fr: 'Post-Money Précédent', zh: '前轮投后估值' }, value: `$${prev}.0M` },
      { label: { en: 'New Pre-Money Offer', fr: 'Nouvelle Offre Pré', zh: '现轮投前出价' }, value: `$${newPre}.0M` },
    ],
    question: {
      en: 'What exact percentage Valuation Haircut (Deflation) does this down-round represent?',
      fr: 'Quel pourcentage exact de décote (down-round) cette offre représente-t-elle ?',
      zh: '该笔降估值出价相较前轮投后，其【估值折让幅度 (Haircut %)】是多少？',
    },
    options: shuffle([
      {
        text: `-${haircut}.0% Haircut`,
        isCorrect: true,
        trapNote: {
          en: `Exact! Haircut = ($${prev}M - $${newPre}M) / $${prev}M = ${haircut}.0% down-round.`,
          fr: `Exact ! Décote = (${prev} M$ - ${newPre} M$) / ${prev} M$ = -${haircut},0 %.`,
          zh: `心算精准！估值折让率 = ($${prev}M - $${newPre}M) / $${prev}M = -${haircut}.0%。`,
        },
      },
      {
        text: `-${haircut - 10}.0% Haircut`,
        isCorrect: false,
        trapNote: {
          en: 'Undercalculated the haircut.',
          fr: 'Décote sous-estimée.',
          zh: '低估了折价率。',
        },
      },
      {
        text: `-${haircut + 15}.0% Haircut`,
        isCorrect: false,
        trapNote: {
          en: 'Overcalculated the down-round penalty.',
          fr: 'Décote surestimée.',
          zh: '高估了折价惩罚幅度。',
        },
      },
      {
        text: `-15.0% Haircut`,
        isCorrect: false,
        trapNote: {
          en: 'Arbitrary estimate.',
          fr: 'Estimation imprécise.',
          zh: '粗略目测失误。',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The Valuation Haircut Metric',
        fr: 'Mesure de la Décote',
        zh: '降估值折让速算法',
      },
      ruleOfThumb: {
        en: 'Haircut % = (Previous Post - New Pre) ÷ Previous Post',
        fr: 'Décote % = (Post Précédent - Nouveau Pré) ÷ Post Précédent',
        zh: '折让幅度 = (前轮投后 - 现轮投前) ÷ 前轮投后',
      },
      explanation: {
        en: 'A down-round triggers anti-dilution clauses. Knowing the exact haircut helps you model the dilution impact on common shareholders.',
        fr: 'Un down-round déclenche l’anti-dilution. Connaître le taux exact permet de modéliser l’effet sur les fondateurs.',
        zh: '降估值会立刻引爆反稀释条款。秒算折让率能帮助创始人迅速推演普通股的洗牌程度。',
      },
    },
  };
}

function genStepUpMultiple(id: string, timeLimit: number): ValuationQuestion {
  const seedPosts = [4, 5, 6, 8, 10];
  const stepUps = [2.5, 3.0, 4.0, 5.0];
  const seedPost = getRandomItem(seedPosts);
  const stepUp = getRandomItem(stepUps);
  const seriesPre = Math.round(seedPost * stepUp * 10) / 10;
  const partner = getRandomItem(VC_PARTNERS);

  return {
    id,
    category: 'step_up',
    timeLimitSeconds: timeLimit,
    title: {
      en: 'Up-Round Step-Up Multiple',
      fr: 'Multiple d’Étape (Step-Up)',
      zh: '溢价轮次倍数心算法 (Step-Up)',
    },
    context: {
      en: `${partner.name} (${partner.firm}): "Your Seed round closed at $${seedPost}.0M Post-Money. We are pricing Series A at $${seriesPre}.0M Pre-Money."`,
      fr: `${partner.name} (${partner.firm}) : « Votre tour d’amorçage s’est conclu à ${seedPost},0 M$ Post. Nous valorisons la Série A à ${seriesPre},0 M$ Pré. »`,
      zh: `${partner.name}（${partner.firm}）：“你们种子轮投后估值为${seedPost}00万美元。我们为A轮开出${seriesPre}00万美元投前估值。”`,
    },
    givenFacts: [
      { label: { en: 'Seed Post-Money', fr: 'Post Amorçage', zh: '种子轮投后' }, value: `$${seedPost}.0M` },
      { label: { en: 'Series A Pre-Money', fr: 'Pré Série A', zh: 'A轮投前估值' }, value: `$${seriesPre}.0M` },
    ],
    question: {
      en: 'What is the Step-Up Multiple for early seed investors?',
      fr: 'Quel est le multiple d’étape (step-up) pour les premiers investisseurs ?',
      zh: '早期种子轮投资人的【账面浮盈倍数 (Step-Up Multiple)】是多少？',
    },
    options: shuffle([
      {
        text: `${stepUp}x Step-Up`,
        isCorrect: true,
        trapNote: {
          en: `Spot on! Step-Up = Series A Pre ($${seriesPre}M) / Seed Post ($${seedPost}M) = ${stepUp}x!`,
          fr: `Exact ! Step-Up = Pré Série A (${seriesPre} M$) / Post Amorçage (${seedPost} M$) = ${stepUp}x !`,
          zh: `漂亮！账面倍数 = A轮投前 ($${seriesPre}M) / 种子轮投后 ($${seedPost}M) = ${stepUp}x！`,
        },
      },
      {
        text: `${(stepUp + 1).toFixed(1)}x Step-Up`,
        isCorrect: false,
        trapNote: {
          en: 'Overestimated the step-up multiple.',
          fr: 'Multiple surestimé.',
          zh: '多算了1倍。',
        },
      },
      {
        text: `${Math.max(1.5, stepUp - 1).toFixed(1)}x Step-Up`,
        isCorrect: false,
        trapNote: {
          en: 'Undercalculated early investor appreciation.',
          fr: 'Plus-value sous-estimée.',
          zh: '少算了倍数。',
        },
      },
      {
        text: '1.8x Step-Up',
        isCorrect: false,
        trapNote: {
          en: 'Arbitrary guess.',
          fr: 'Estimation erronée.',
          zh: '粗略估算偏差。',
        },
      },
    ]),
    mentalShortcut: {
      formulaName: {
        en: 'The Round Step-Up Ratio',
        fr: 'Ratio de Step-Up de Tour',
        zh: '跨轮台阶倍数定律',
      },
      ruleOfThumb: {
        en: 'Step-Up Multiple = New Pre-Money ÷ Previous Post-Money ($${seriesPre}M ÷ $${seedPost}M = ${stepUp}x)',
        fr: 'Step-Up = Nouveau Pré ÷ Post Précédent (${seriesPre} M$ ÷ ${seedPost} M$ = ${stepUp}x)',
        zh: '台阶倍数 = 新一轮投前估值 ÷ 上一轮投后估值（$${seriesPre}M ÷ $${seedPost}M = ${stepUp}x）',
      },
      explanation: {
        en: 'Step-up multiple measures round momentum and unrealized gain. A 3x to 4x step-up between Seed and Series A indicates top-decile traction.',
        fr: 'Un step-up de 3x à 4x entre amorçage et Série A signale une traction d’élite.',
        zh: '台阶倍数衡量公司跨轮加速度。种子轮到A轮实现3x至4x台阶，证明业务进入顶级梯队。',
      },
    },
  };
}

// Procedural generator factory pool
const GENERATOR_FACTORIES = [
  genPostMoneyAddition,
  gen20PctInversion,
  gen16PctInversion,
  gen12PctInversion,
  genEsopPoolShuffle,
  genPerSharePrice,
  genSafeCapVsDiscount,
  genFounderRetention,
  genExitMultipleTarget,
  genDownRoundHaircut,
  genStepUpMultiple,
];

/**
 * Generate a complete dynamic session of non-repeating questions.
 * @param tier 'junior' (5 questions) | 'mid' (25 questions) | 'senior' (50 questions)
 */
export function generateDynamicValuationSession(tier: SpeedValuationTier): ValuationQuestion[] {
  let count = 5;
  let timeLimit = 15;

  if (tier === 'mid') {
    count = 25;
    timeLimit = 12;
  } else if (tier === 'senior') {
    count = 50;
    timeLimit = 10;
  }

  const questions: ValuationQuestion[] = [];
  const usedKeys = new Set<string>();

  // Keep generating unique questions until count is reached
  let attempts = 0;
  while (questions.length < count && attempts < count * 8) {
    attempts++;
    const factory = getRandomItem(GENERATOR_FACTORIES);
    const qId = `dyn_val_${tier}_${questions.length + 1}_${Date.now().toString(36).slice(-4)}`;
    const question = factory(qId, timeLimit);

    // Create a key to avoid duplicate questions in the same run
    const fingerprint = `${question.category}_${question.options.find((o) => o.isCorrect)?.text}_${question.title.en}`;

    if (!usedKeys.has(fingerprint)) {
      usedKeys.add(fingerprint);
      questions.push(question);
    }
  }

  // If strict distinctness under high counts capped out, fill remaining with unique IDs
  while (questions.length < count) {
    const factory = getRandomItem(GENERATOR_FACTORIES);
    const qId = `dyn_val_${tier}_${questions.length + 1}_pad_${Math.random()}`;
    questions.push(factory(qId, timeLimit));
  }

  return questions;
}
