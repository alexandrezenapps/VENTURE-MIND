import { LocalizedString } from '../types';

export interface ValuationQuestion {
  id: string;
  category: 'post_money' | 'equity_dilution' | 'pre_from_stake' | 'esop_shuffle' | 'share_price' | 'safe_discount' | 'exit_multiple';
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

export const SPEED_VALUATION_QUESTIONS: ValuationQuestion[] = [
  {
    id: 'val_01',
    category: 'post_money',
    title: {
      en: 'Classic Pre-to-Post Bridge',
      fr: 'Passerelle Classique Pré/Post',
      zh: '投前转投后基础定桩',
    },
    context: {
      en: 'A tier-1 venture partner slides a term sheet across the mahogany table: "$3.5M cash infusion at $14M Pre-Money valuation."',
      fr: 'Un associé de premier plan vous propose : "3,5 M$ d’injection sur une valorisation Pré-Money de 14 M$."',
      zh: '红杉合伙人在实木谈判桌前推来意向书草案：“我们领投350万美元，投前估值锁定为1400万美元。”',
    },
    givenFacts: [
      { label: { en: 'Pre-Money', fr: 'Pré-Money', zh: '投前估值' }, value: '$14.0M' },
      { label: { en: 'Investment Check', fr: 'Ticket Investisseur', zh: '投资金额' }, value: '$3.5M' },
    ],
    question: {
      en: 'What is the resulting Post-Money Valuation?',
      fr: 'Quelle est la valorisation Post-Money résultante ?',
      zh: '本次融资完成后的最终【投后估值 (Post-Money)】是多少？',
    },
    options: [
      {
        text: '$17.5M',
        isCorrect: true,
        trapNote: {
          en: 'Exact! Post-Money = Pre-Money ($14M) + Investment ($3.5M) = $17.5M.',
          fr: 'Exact ! Post-Money = Pré-Money (14 M$) + Investissement (3,5 M$) = 17,5 M$.',
          zh: '完全正确！投后估值 = 投前估值 ($14M) + 投资款 ($3.5M) = $17.5M。',
        },
      },
      {
        text: '$10.5M',
        isCorrect: false,
        trapNote: {
          en: 'Subtracted investment instead of adding. Never confuse cash in with cash out.',
          fr: 'Vous avez soustrait au lieu d’ajouter. Le capital nouveau augmente la valeur.',
          zh: '误将投资款从投前估值中扣减。新增资金必定做加法增加公司账面资金。',
        },
      },
      {
        text: '$14.0M',
        isCorrect: false,
        trapNote: {
          en: 'Confused Pre-Money with Post-Money. Investment must expand total equity base.',
          fr: 'Confusion entre Pré et Post. Le cash investisseur vient s’ajouter.',
          zh: '混淆了投前与投后。现金进入公司后必须扩充整体股权净值基数。',
        },
      },
      {
        text: '$19.0M',
        isCorrect: false,
        trapNote: {
          en: 'Arithmetic overshoot. $14M + $3.5M = $17.5M, not $19M.',
          fr: 'Erreur de calcul. 14 M$ + 3,5 M$ = 17,5 M$, pas 19 M$.',
          zh: '心算进位偏差。14 + 3.5 = 17.5，切忌在紧张谈判中慌乱进位。',
        },
      },
    ],
    mentalShortcut: {
      formulaName: {
        en: 'The Golden Additive Anchor',
        fr: 'L’Ancrage Additif Fondamental',
        zh: '投后加法定律',
      },
      ruleOfThumb: {
        en: 'Post-Money = Pre-Money + Cash Injected (Immediate 1-second addition)',
        fr: 'Post-Money = Pré-Money + Cash Injecté (Addition instantanée)',
        zh: '投后估值 = 投前估值 + 新注入现金（1秒加法，绝不含糊）',
      },
      explanation: {
        en: 'The most frequent mistake under pressure is failing to immediately declare Post-Money before calculating percentage dilution. Always lock Post-Money first.',
        fr: 'L’erreur la plus fréquente sous pression est d’oublier de verrouiller le Post-Money avant de calculer la dilution.',
        zh: '谈判桌上最致命的心态是慌乱。对方报出Pre和Check时，第一秒脱口而出Post-Money，瞬间在气势上建立专业防线。',
      },
    },
    timeLimitSeconds: 15,
  },
  {
    id: 'val_02',
    category: 'pre_from_stake',
    title: {
      en: 'The 20% Stake Inversion (The 5x Rule)',
      fr: 'L’Inversion du Seuil 20 % (Règle du 5x)',
      zh: '20% 股权倒推估值（5倍心算法）',
    },
    context: {
      en: 'Lead partner looks you in the eye: "We are writing a clean $2.5M lead check for a round 20% equity stake in the company."',
      fr: 'L’associé vous regarde droit dans les yeux : "Nous signons un chèque de 2,5 M$ pour exactement 20 % de votre capital."',
      zh: '领投合伙人凝视着你的眼睛：“我们开出一张250万美元的纯支票，条件是拿走公司整整20%的股权。”',
    },
    givenFacts: [
      { label: { en: 'Investment Check', fr: 'Ticket Investisseur', zh: '投资金额' }, value: '$2.5M' },
      { label: { en: 'Target Equity Stake', fr: 'Part du Capital', zh: '出让股权占比' }, value: '20.0%' },
    ],
    question: {
      en: 'What is the implied Pre-Money Valuation being offered?',
      fr: 'Quelle est la valorisation Pré-Money implicite proposée ?',
      zh: '对方这笔出价背后，暗含的【投前估值 (Pre-Money)】是多少？',
    },
    options: [
      {
        text: '$10.0M',
        isCorrect: true,
        trapNote: {
          en: 'Flawless! 20% means Post = 5x check ($12.5M). Pre = $12.5M - $2.5M = $10.0M.',
          fr: 'Impeccable ! 20 % équivaut à Post = 5x ticket (12,5 M$). Pré = 10,0 M$.',
          zh: '精准绝杀！20%意味着投后是支票的5倍($12.5M)，投前 = $12.5M - $2.5M = $10.0M。',
        },
      },
      {
        text: '$12.5M',
        isCorrect: false,
        trapNote: {
          en: 'You gave Post-Money! You forgot to subtract the $2.5M check to find Pre-Money.',
          fr: 'Vous avez donné la valorisation Post-Money ! Il faut soustraire le chèque de 2,5 M$.',
          zh: '这是投后估值！切记对方问的是投前，没有扣除自己将要稀释进来的250万现金。',
        },
      },
      {
        text: '$8.0M',
        isCorrect: false,
        trapNote: {
          en: 'Divided check by Pre instead of Post ($2.5M / 0.2 = $12.5M Post, not $10M Post).',
          fr: 'Calcul erroné de la base de fractionnement.',
          zh: '计算偏差。20%是对投后的占比，不是对投前的占比。',
        },
      },
      {
        text: '$15.0M',
        isCorrect: false,
        trapNote: {
          en: 'Overestimated. If Pre were $15M, Post is $17.5M and $2.5M would only buy 14.3%!',
          fr: 'Surestimation. À 15 M$ Pré, 2,5 M$ ne représenteraient que 14,3 %.',
          zh: '高估了投前。如果投前是1500万，250万投资只能买到14.3%的股份，而不是20%。',
        },
      },
    ],
    mentalShortcut: {
      formulaName: {
        en: 'The 20% = 5x Inversion Rule',
        fr: 'Règle Inversée du 20 % = 5x',
        zh: '20% 股权五倍心算法',
      },
      ruleOfThumb: {
        en: '20% stake means Post-Money = 5 × Check. Pre-Money = 4 × Check!',
        fr: '20 % de capital signifie Post = 5 × Chèque. Pré = 4 × Chèque !',
        zh: '出让20%股份：投后必是投资款的5倍！投前必是投资款的4倍！（$2.5M × 4 = $10M）',
      },
      explanation: {
        en: 'Since 20% = 1/5 of Post-Money, the remaining 80% (Pre-Money) is exactly 4/5. Simply multiply check size by 4 to get Pre-Money instantly in under 2 seconds!',
        fr: '20 % = 1/5 du Post-Money. Les 80 % restants (Pré-Money) représentent 4 parts. Multipliez le chèque par 4 pour trouver le Pré instantanément !',
        zh: '因为20% = 1/5投后，剩下的80%投前正好是投资额的4倍。听到20%出价，心算直接：支票金额 × 4 = 投前！无需动笔。',
      },
    },
    timeLimitSeconds: 15,
  },
  {
    id: 'val_03',
    category: 'equity_dilution',
    title: {
      en: 'The Dilution Trap (Pre vs Post Denominator)',
      fr: 'Le Piège du Dénominateur de Dilution',
      zh: '稀释分母陷阱（投前与投后混淆）',
    },
    context: {
      en: 'A syndicate partner offers: "$4.0M cash into a $16.0M Pre-Money valuation." How much ownership are you selling?',
      fr: 'Un syndicate propose : "4,0 M$ de cash sur 16,0 M$ Pré-Money." Quelle fraction vendez-vous ?',
      zh: '联合跟投方报价：“我们注入400万美元，基于1600万美元投前估值。”创始团队将出让多少股权？',
    },
    givenFacts: [
      { label: { en: 'Pre-Money', fr: 'Pré-Money', zh: '投前估值' }, value: '$16.0M' },
      { label: { en: 'Investment', fr: 'Investissement', zh: '投资款' }, value: '$4.0M' },
    ],
    question: {
      en: 'What exact percentage of the company will the new investors own post-round?',
      fr: 'Quel pourcentage exact du capital les investisseurs détiendront-ils après le tour ?',
      zh: '本轮新投资人将最终持有公司多少百分比的股权？',
    },
    options: [
      {
        text: '20.0%',
        isCorrect: true,
        trapNote: {
          en: 'Bingo! Post-Money = $16M + $4M = $20M. Ownership = $4M / $20M = exactly 20.0%.',
          fr: 'Parfait ! Post = 16 + 4 = 20 M$. Part = 4 / 20 = 20,0 % pile.',
          zh: '正解！投后 = 16M + 4M = 20M。股权占比 = 4M / 20M = 恰好 20.0%。',
        },
      },
      {
        text: '25.0%',
        isCorrect: false,
        trapNote: {
          en: 'Classic founder trap: You divided $4M by the $16M Pre-Money ($4M / $16M = 25%). Dilution is always calculated over Post-Money!',
          fr: 'Piège classique : division par le Pré-Money (4 / 16 = 25 %). La dilution se calcule toujours sur le Post !',
          zh: '最经典的创投新手陷阱：直接用400万除以投前1600万（4/16=25%）。股权稀释的分母永远是【投后】，绝不是投前！',
        },
      },
      {
        text: '16.7%',
        isCorrect: false,
        trapNote: {
          en: 'Confused with 1/6th ratio. 4 / 20 is exactly 1/5th (20%).',
          fr: 'Confusion avec le ratio 1/6. 4 sur 20 fait 1/5 (20 %).',
          zh: '混淆了1/6比例。4除以20是标准的1/5（20%）。',
        },
      },
      {
        text: '22.5%',
        isCorrect: false,
        trapNote: {
          en: 'Arbitrary guess. Keep math grounded: 4 / (16 + 4) = 4 / 20 = 20%.',
          fr: 'Calcul imprécis. 4 / 20 = 0,20.',
          zh: '无端猜测。牢记心算基本式：4 / (16 + 4) = 4 / 20 = 20%。',
        },
      },
    ],
    mentalShortcut: {
      formulaName: {
        en: 'The Post-Money Denominator Law',
        fr: 'Loi du Dénominateur Post-Money',
        zh: '投后分母铁律',
      },
      ruleOfThumb: {
        en: 'Dilution % = Investment / (Pre + Investment) [Never divide by Pre alone!]',
        fr: 'Dilution % = Investissement / (Pré + Investissement) [Ne jamais diviser par le Pré seul !]',
        zh: '稀释比例 = 投资款 / (投前 + 投资款) [绝不能拿投前作为分母！]',
      },
      explanation: {
        en: 'Amateur founders panic when they divide check by Pre-Money and think they lost 25% instead of 20%. Knowing the denominator is always Post-Money protects you from yielding concessions.',
        fr: 'Les fondateurs débutants paniquent en divisant par le Pré-Money et pensent céder 25 % au lieu de 20 %.',
        zh: '初创创始人经常在心算时误以投前为分母，误以为自己被稀释了25%而慌乱让步。守住投后分母，底气立现。',
      },
    },
    timeLimitSeconds: 15,
  },
  {
    id: 'val_04',
    category: 'esop_shuffle',
    title: {
      en: 'The Pre-Money Option Pool Trap (The Hidden Discount)',
      fr: 'Le Piège du Pool d’Options Pré-Money (La Décote Cachée)',
      zh: '期权池洗牌陷阱（隐蔽估值大打折）',
    },
    context: {
      en: 'A VC partner offers a flattering headline valuation: "$20.0M Pre-Money with a $5.0M check, CONDITIONED on creating an unallocated 15% ESOP option pool fully out of the PRE-money cap table."',
      fr: 'Une offre séduisante : "20,0 M$ Pré-Money avec un chèque de 5,0 M$, à condition de créer un pool ESOP de 15 % AVANT le tour (sur le Pré)."',
      zh: 'VC合伙人给出一份看似光鲜的意向书：“投前估值2000万美元，投资500万美元。前提条件：交割前必须在【投前】设立15%的未分配员工期权池。”',
    },
    givenFacts: [
      { label: { en: 'Headline Pre-Money', fr: 'Pré-Money Affiché', zh: '面子投前估值' }, value: '$20.0M' },
      { label: { en: 'Pre-Money ESOP Required', fr: 'Pool ESOP Requis', zh: '投前强制期权池' }, value: '15.0%' },
      { label: { en: 'Investment Check', fr: 'Chèque Investisseur', zh: '投资款' }, value: '$5.0M' },
    ],
    question: {
      en: 'What is the TRUE Effective Pre-Money Valuation being paid for existing founder shares?',
      fr: 'Quelle est la VRAIE valorisation Pré-Money effective payée pour les actions fondateurs ?',
      zh: '剔除这笔由创始人单方面承担的期权池后，创始人股票真正的【实际有效投前估值】是多少？',
    },
    options: [
      {
        text: '$17.0M',
        isCorrect: true,
        trapNote: {
          en: 'Masterful! Effective Pre = Headline Pre × (1 - Pool %) = $20M × 0.85 = $17.0M. The VC secretly shaved $3.0M off your valuation!',
          fr: 'Magistral ! Pré effectif = 20 M$ × (1 - 0,15) = 17,0 M$. L’investisseur vous a secrètement amputé de 3 M$ !',
          zh: '神级洞察！有效投前 = 名义投前 × (1 - 期权池比例) = $20M × 0.85 = $17.0M。VC用期权池隐蔽削减了你300万美元的真实估值！',
        },
      },
      {
        text: '$20.0M',
        isCorrect: false,
        trapNote: {
          en: 'Fell for the headline illusion. Because the 15% pool comes entirely from pre-existing shareholders, existing equity is discounted by exactly 15%.',
          fr: 'Vous avez mordu à l’hameçon du chiffre de façade. Le pool dilue les fondateurs à 100 % avant l’entrée du nouvel arrivant.',
          zh: '被名义数字蒙蔽。因为期权池完全从交割前的既有老股中挖出，创始人持股被就地折价了整整15%。',
        },
      },
      {
        text: '$15.0M',
        isCorrect: false,
        trapNote: {
          en: 'Subtracted the $5M investment instead of calculating the 15% ESOP haircut ($20M × 0.15 = $3M cut).',
          fr: 'Confusion en soustrayant le montant du chèque plutôt que l’effet du pool.',
          zh: '误减了500万投资款，而不是计算15%期权池的折价额（2000万 × 15% = 300万美元折价）。',
        },
      },
      {
        text: '$18.5M',
        isCorrect: false,
        trapNote: {
          en: 'Subtracted 1.5M instead of 15% of 20M ($3.0M). Double check your percentage decimals.',
          fr: 'Erreur décimale. 15 % de 20 M$ font 3,0 M$, et non 1,5 M$.',
          zh: '小数位心算失误。2000万的15%是300万，而不是150万。',
        },
      },
    ],
    mentalShortcut: {
      formulaName: {
        en: 'The Option Pool Haircut Shortcut',
        fr: 'Règle de la Décote du Pool ESOP',
        zh: '期权池洗牌折价心算法',
      },
      ruleOfThumb: {
        en: 'Effective Pre-Money = Headline Pre-Money × (100% - ESOP %)',
        fr: 'Pré Effectif = Pré Facial × (100 % - % Pool)',
        zh: '有效真实投前 = 纸面名义投前 × (100% - 投前期权池比例)',
      },
      explanation: {
        en: 'Venture capitalists use pre-money option pools as a polite way to lower valuation without changing the headline number in press releases. Counter by insisting the pool be right-sized or issued post-closing!',
        fr: 'Les VC utilisent le pool pré-money pour réduire discrètement la valorisation. Ripostez en calibrant la taille du pool sur vos besoins réels à 12-18 mois.',
        zh: '顶级VC最常用的暗度陈仓手段：名义上给你高估值满足虚荣心，暗地里塞入超大投前期权池压榨真实股份。心算一秒看穿真实底价！',
      },
    },
    timeLimitSeconds: 18,
  },
  {
    id: 'val_05',
    category: 'share_price',
    title: {
      en: 'Share Price Mental Division',
      fr: 'Division Éclair du Prix par Action',
      zh: '每股单价速算除法',
    },
    context: {
      en: 'You have exactly 10,000,000 fully diluted common shares outstanding prior to Series A. The lead term sheet proposes a $25.0M Pre-Money valuation.',
      fr: 'Vous avez exactement 10 000 000 d’actions ordinaires diluées avant la Série A. Le term sheet propose 25,0 M$ Pré-Money.',
      zh: '在A轮融资前，你公司完全稀释总股本恰好为10,000,000股。领投方报价投前估值为2500万美元。',
    },
    givenFacts: [
      { label: { en: 'Pre-Money Valuation', fr: 'Pré-Money', zh: '投前估值' }, value: '$25,000,000' },
      { label: { en: 'Fully Diluted Shares', fr: 'Actions Totales', zh: '完全稀释总股本' }, value: '10,000,000' },
    ],
    question: {
      en: 'What is the exact Issue Price Per Share for Series A Preferred Stock?',
      fr: 'Quel est le prix d’émission exact par action pour la Série A ?',
      zh: '本次A轮优先股的【每股发行价格 (Price Per Share)】是多少？',
    },
    options: [
      {
        text: '$2.50 / share',
        isCorrect: true,
        trapNote: {
          en: 'Spot on! Price = Pre-Money ($25M) / Pre-round Shares (10M) = $2.50 per share.',
          fr: 'Exactement ! Prix = Pré-Money (25 M$) / Actions (10 M) = 2,50 $ par action.',
          zh: '干净利落！每股单价 = 投前估值 ($25M) / 投前总股本 (10M) = $2.50 / 股。',
        },
      },
      {
        text: '$0.25 / share',
        isCorrect: false,
        trapNote: {
          en: 'Lost a zero in mental decimal shifting ($25M / 10M = 2.50, not 0.25).',
          fr: 'Erreur d’un zéro dans le décalage décimal.',
          zh: '位数错误，少算了一个零（2500万除以1000万等于2.50，不是0.25）。',
        },
      },
      {
        text: '$25.00 / share',
        isCorrect: false,
        trapNote: {
          en: 'Overcalculated by 10x ($25M / 1M would be $25; here you have 10M shares).',
          fr: 'Facteur 10 en trop.',
          zh: '高估了10倍。1000万股除以2500万，每股是2.5元。',
        },
      },
      {
        text: '$3.00 / share',
        isCorrect: false,
        trapNote: {
          en: 'Confused with post-money shares. Share price is priced off Pre-Money / Pre-Shares.',
          fr: 'Confusion avec le post-money.',
          zh: '混淆了投后股数。优先股发行价是以投前估值除以投前股份确立的。',
        },
      },
    ],
    mentalShortcut: {
      formulaName: {
        en: 'The Zero-Canceling Unit Division',
        fr: 'Règle de Simplification des Zéros',
        zh: '百万消零除法',
      },
      ruleOfThumb: {
        en: 'Price Per Share = Millions of Pre-Money / Millions of Shares (Cancel the "M"s!)',
        fr: 'Prix par action = Millions de Pré / Millions d’Actions (Biffez les "M" !)',
        zh: '每股发行价 = 投前估值(百万) ÷ 现有总股数(百万) [直接对消百万单位，25 ÷ 10 = $2.50]',
      },
      explanation: {
        en: 'By thinking in "Millions / Millions", both units cancel immediately: $25M / 10M shares = 25 / 10 = $2.50. You never have to write seven zeroes.',
        fr: 'En raisonnant en millions contre millions, les zéros disparaissent : 25 M$ / 10 M = 25 / 10 = 2,50 $. Zéro friction mentale.',
        zh: '千万别在脑子里数7个零。把两边单位统一为“百万”，25百万除以10百万，瞬间得到2.50美元。心算秒杀。',
      },
    },
    timeLimitSeconds: 12,
  },
  {
    id: 'val_06',
    category: 'pre_from_stake',
    title: {
      en: 'The 1/8th Angel Check (12.5% Stake)',
      fr: 'Le Billet d’Ange au Huitième (12,5 %)',
      zh: '12.5% 八分之一天使出算法',
    },
    context: {
      en: 'An angel super-syndicate offers $1.5M for an even 12.5% equity stake in your Seed stage AI infrastructure startup.',
      fr: 'Un super-syndicat de business angels propose 1,5 M$ pour exactement 12,5 % du capital de votre startup IA.',
      zh: '天使投资团开出条件：“我们联合投资150万美元，要占你们种子轮交割后恰好12.5%的股权。”',
    },
    givenFacts: [
      { label: { en: 'Investment Check', fr: 'Ticket Investisseur', zh: '投资金额' }, value: '$1.5M' },
      { label: { en: 'Target Equity Stake', fr: 'Part de Capital', zh: '出让股权' }, value: '12.5% (1/8)' },
    ],
    question: {
      en: 'What is the implied Post-Money Valuation of this offer?',
      fr: 'Quelle est la valorisation Post-Money implicite de cette offre ?',
      zh: '该出价暗含的【投后估值 (Post-Money)】是多少？',
    },
    options: [
      {
        text: '$12.0M',
        isCorrect: true,
        trapNote: {
          en: 'Bullseye! 12.5% = 1/8. Post-Money is 8 × $1.5M = $12.0M! (Pre-Money would be $10.5M).',
          fr: 'Plein dans le mille ! 12,5 % = 1/8. Le Post-Money vaut 8 × 1,5 M$ = 12,0 M$ !',
          zh: '直击靶心！12.5% 就是八分之一(1/8)。投后估值 = 8 × $1.5M = $12.0M！（投前则是$10.5M）。',
        },
      },
      {
        text: '$10.5M',
        isCorrect: false,
        trapNote: {
          en: 'That is the Pre-Money valuation! The question asked for the Post-Money valuation ($12.0M).',
          fr: 'C’est la valorisation Pré-Money ! La question portait sur le Post-Money (12,0 M$).',
          zh: '这是投前估值！题目问的是投后估值（$12.0M）。切勿混淆Pre与Post。',
        },
      },
      {
        text: '$15.0M',
        isCorrect: false,
        trapNote: {
          en: 'Multiplied by 10 instead of 8. 10% is 10x, but 12.5% is 8x.',
          fr: 'Multiplication par 10 au lieu de 8. 10 % fait 10x, mais 12,5 % fait 8x.',
          zh: '误乘了10倍。10%才是10倍，12.5%是8倍。',
        },
      },
      {
        text: '$9.0M',
        isCorrect: false,
        trapNote: {
          en: 'Undercalculated (multiplied by 6). 1.5M × 8 = 12.0M.',
          fr: 'Sous-estimé. 1,5 M$ × 8 = 12,0 M$.',
          zh: '少算了乘数（乘了6倍）。1.5 × 8 = 12.0。',
        },
      },
    ],
    mentalShortcut: {
      formulaName: {
        en: 'The 12.5% = 1/8 Multiplier Shortcut',
        fr: 'Règle du Huitième (12,5 % = 8x)',
        zh: '12.5% 八倍倒推心算法',
      },
      ruleOfThumb: {
        en: '12.5% is exactly 1/8th! Post-Money = Check × 8. Pre-Money = Check × 7.',
        fr: '12,5 % = exactement 1/8e ! Post-Money = Chèque × 8. Pré-Money = Chèque × 7.',
        zh: '12.5% 恰好是 1/8！投后估值 = 投资款 × 8；投前估值 = 投资款 × 7（$1.5M × 7 = $10.5M）！',
      },
      explanation: {
        en: 'Venture financiers love 12.5% because it equals binary 1/8. Multiply check by 8 to get Post-Money, or by 7 to get Pre-Money in one heartbeat.',
        fr: 'Les financiers adorent 12,5 % car c’est une fraction propre (1/8). Multipliez le chèque par 8 pour le Post, par 7 pour le Pré.',
        zh: '老道投资人极喜好12.5%这类二进制干净分数。看到12.5%，大脑立刻换算成8倍投后、7倍投前，1秒得出答案。',
      },
    },
    timeLimitSeconds: 15,
  },
  {
    id: 'val_07',
    category: 'safe_discount',
    title: {
      en: 'SAFE Valuation Cap vs Discount Clash',
      fr: 'Arbitrage SAFE : Plafond (Cap) vs Décote',
      zh: 'SAFE 估值上限与折价博弈决断',
    },
    context: {
      en: 'An early investor holds a $1.0M SAFE with an $8.0M Valuation Cap and a 20% Discount. Your Series A closes at a $12.0M Pre-Money valuation.',
      fr: 'Un investisseur précoce détient un SAFE de 1,0 M$ avec un plafond de 8,0 M$ et 20 % de décote. Votre Série A se conclut à 12,0 M$ Pré-Money.',
      zh: '早期天使持有一份100万美元SAFE，附带【800万美元估值上限 (Cap)】及【20%折价率 (Discount)】。公司A轮正式以1200万美元投前估值敲定。',
    },
    givenFacts: [
      { label: { en: 'SAFE Valuation Cap', fr: 'Plafond SAFE', zh: 'SAFE估值上限' }, value: '$8.0M' },
      { label: { en: 'SAFE Discount', fr: 'Décote SAFE', zh: 'SAFE折价' }, value: '20.0%' },
      { label: { en: 'Series A Pre-Money', fr: 'Pré-Money Série A', zh: 'A轮正式投前估值' }, value: '$12.0M' },
    ],
    question: {
      en: 'At what effective valuation will the SAFE convert into equity shares?',
      fr: 'À quelle valorisation effective le SAFE se convertira-t-il en actions ?',
      zh: '根据保护投资人利益最大化原则，该SAFE将以哪一个【有效估值】执行转股？',
    },
    options: [
      {
        text: '$8.0M (The Cap Trumps)',
        isCorrect: true,
        trapNote: {
          en: 'Razor sharp! 20% discount on $12M = $9.6M valuation. Since $8.0M Cap < $9.6M Discount valuation, the $8.0M Cap produces a lower share price and wins!',
          fr: 'Parfaitement vu ! 20 % de décote sur 12 M$ donne 9,6 M$. Comme le plafond de 8 M$ est inférieur à 9,6 M$, le Cap l’emporte !',
          zh: '明察秋毫！20%折价对应估值为 $12M × 0.8 = $9.6M。而估值上限是$8.0M。因为 $8.0M < $9.6M，上限能换得更低每股价格与更多股数，上限胜出！',
        },
      },
      {
        text: '$9.6M (The Discount Trumps)',
        isCorrect: false,
        trapNote: {
          en: 'The 20% discount valuation ($9.6M) gives FEWER shares than the $8.0M Cap. The SAFE always converts at the lower price for the investor.',
          fr: 'La décote (9,6 M$) donne moins d’actions que le Cap à 8 M$. Le SAFE convertit toujours au plus avantageux pour le détenteur.',
          zh: '折价换算出的960万高于800万上限。SAFE协议明确规定以对投资人最优惠（即估值更低）的方式转股。',
        },
      },
      {
        text: '$12.0M (Uncapped Conversion)',
        isCorrect: false,
        trapNote: {
          en: 'Ignored both the Cap and the Discount entirely! Early risk-takers never convert at full Series A price.',
          fr: 'Vous avez ignoré à la fois le plafond et la décote. Les investisseurs SAFE ont droit à leur prime de risque.',
          zh: '完全忽略了上限与折价条款。早期承担巨大风险的SAFE投资人绝不可能按A轮原价转股。',
        },
      },
      {
        text: '$6.4M (Double Dipping)',
        isCorrect: false,
        trapNote: {
          en: 'You applied the 20% discount TO the $8M Cap! Cap and Discount are strictly ALTERNATIVES, they never stack.',
          fr: 'Vous avez appliqué la décote sur le plafond ! Le Cap et la décote sont alternatifs, ils ne se cumulent jamais.',
          zh: '双重计提错误！你把20%折价又扣在了800万上限上。上限与折价是“二选一选择权”，绝不能叠加叠算。',
        },
      },
    ],
    mentalShortcut: {
      formulaName: {
        en: 'The Cap vs Discount Showdown',
        fr: 'Duel Plafond contre Décote',
        zh: '上限 vs 折价心算PK法则',
      },
      ruleOfThumb: {
        en: 'Compute Discount Value: Pre × (1 - Discount). Compare with Cap. The LOWER number wins!',
        fr: 'Calculez : Pré × (1 - Décote). Comparez au Cap. Le montant le plus BAS l’emporte !',
        zh: '心算法：折价估值 = 现轮估值 × (1 - 折价率)。与上限对比，哪个数字【更低】，就以哪个转股！',
      },
      explanation: {
        en: 'Investors receive whichever mechanism generates the lower share price (more shares). $12M × 0.80 = $9.6M. Since $8.0M is lower, $8.0M Cap applies.',
        fr: 'L’investisseur choisit toujours l’option lui octroyant le plus grand nombre de titres. $12M × 0,80 = 9,6M$, donc le Cap à 8M$ l’emporte.',
        zh: '换股原则是投资人利益最大化。计算出折价后是960万，与800万上限相比，800万更低，转股价格更便宜，因此锁定800万上限执行。',
      },
    },
    timeLimitSeconds: 15,
  },
  {
    id: 'val_08',
    category: 'exit_multiple',
    title: {
      en: 'The 10x Fund Return Exit Target',
      fr: 'La Cible de Sortie pour Retour 10x',
      zh: '10倍基金门槛退出估值倒推',
    },
    context: {
      en: 'A Tier-1 VC writes a $5.0M check for 20.0% ownership at $25.0M Post-Money. Their investment mandate requires a 10x return on this check at liquidity.',
      fr: 'Un fonds de premier plan investit 5,0 M$ pour 20,0 % sur 25,0 M$ Post. Le mandat exige un retour de 10x sur ce ticket.',
      zh: '顶级VC投资500万美元获得公司20%股权（投后2500万美元）。该基金的投委会硬性指标要求本笔投资退出时必须实现【10倍回报 (10x Return)】。',
    },
    givenFacts: [
      { label: { en: 'Investment Check', fr: 'Ticket Investisseur', zh: '投资金额' }, value: '$5.0M' },
      { label: { en: 'Equity Stake', fr: 'Part du Capital', zh: '持股比例' }, value: '20.0%' },
      { label: { en: 'Target Return', fr: 'Objectif de Rendement', zh: '目标回报倍数' }, value: '10x Cash-on-Cash' },
    ],
    question: {
      en: 'Assuming zero subsequent dilution, what minimum Exit Valuation must the company reach?',
      fr: 'En supposant zéro dilution future, quelle valorisation de sortie minimale l’entreprise doit-elle atteindre ?',
      zh: '假设后续无额外稀释，公司在IPO或被并购退出时，【最低退出估值 (Exit Valuation)】必须达到多少？',
    },
    options: [
      {
        text: '$250M',
        isCorrect: true,
        trapNote: {
          en: 'Sensational! 10x on $5M = $50M cash proceeds needed. With 20% equity: $50M / 0.20 = $250M exit valuation!',
          fr: 'Magistral ! 10x sur 5 M$ = 50 M$ de cash requis. À 20 % de capital : 50 M$ / 0,20 = 250 M$ de sortie !',
          zh: '顶级水准！500万的10倍 = 需要分回5000万美元现金。以20%持股倒推：$50M / 0.20 = 2.5亿美元（$250M）退出估值！',
        },
      },
      {
        text: '$50M',
        isCorrect: false,
        trapNote: {
          en: 'That is only the VC payout ($5M × 10 = $50M), not the whole company valuation ($50M / 0.20 = $250M)!',
          fr: 'C’est uniquement le montant perçu par le fonds (5 M$ × 10 = 50 M$), pas la valorisation totale de la société !',
          zh: '这只是VC自己拿走的5000万现金，不是整家公司的估值！VC只占20%，整家公司必须值2.5亿。',
        },
      },
      {
        text: '$100M',
        isCorrect: false,
        trapNote: {
          en: 'At $100M exit, 20% equity yields only $20M (a 4x return, failing the fund mandate).',
          fr: 'À 100 M$ de sortie, 20 % ne génèrent que 20 M$ (soit 4x le chèque, insuffisant pour la thèse).',
          zh: '如果以1亿美元退出，20%股份只能分到2000万美元（仅4倍回报），达不到基金的10倍门槛。',
        },
      },
      {
        text: '$500M',
        isCorrect: false,
        trapNote: {
          en: 'Overestimated by 2x. $50M / 0.20 is $250M, not $500M.',
          fr: 'Surestimation du double. 50 M$ / 0,20 = 250 M$.',
          zh: '高估了2倍。5000万除以0.2等于2.5亿，不是5亿。',
        },
      },
    ],
    mentalShortcut: {
      formulaName: {
        en: 'The Target Exit Inversion Rule',
        fr: 'Règle Inversée de la Sortie Cible',
        zh: '退出倍数投后对齐心算法',
      },
      ruleOfThumb: {
        en: 'Exit Valuation = Post-Money Valuation × Target Return Multiple ($25M × 10 = $250M!)',
        fr: 'Valorisation de Sortie = Post-Money × Multiple Cible (25 M$ × 10 = 250 M$ !)',
        zh: '退出估值 = 投后估值 × 目标回报倍数（$25M × 10 = $250M！一秒神算）',
      },
      explanation: {
        en: 'Here is the 1-second secret: If the check is 20% of Post-Money, returning 10x on the check is mathematically IDENTICAL to multiplying the Post-Money by 10! ($25M × 10 = $250M).',
        fr: 'Le secret de 1 seconde : le multiple sur le chèque s’applique directement à la valorisation Post-Money si la part reste constante. 25 M$ × 10 = 250 M$.',
        zh: '绝密心算法：如果投资人持股是固定比例，那么期望投资款翻10倍，整家公司的投后估值也必须翻10倍！直接拿投后估值 $25M × 10 = $250M，不用算复杂分母！',
      },
    },
    timeLimitSeconds: 15,
  },
  {
    id: 'val_09',
    category: 'equity_dilution',
    title: {
      en: 'Founder Equity Retention After Dilution',
      fr: 'Rétention du Capital Fondateur Après Dilution',
      zh: '稀释后创始人留存股权心算',
    },
    context: {
      en: 'The founding team currently holds 80.0% of the company. A Series A investor acquires a 25.0% post-money stake in a clean priced round.',
      fr: 'L’équipe fondatrice détient actuellement 80,0 % de la société. Un investisseur de Série A acquiert 25,0 % du capital Post-Money.',
      zh: '创始团队目前合计持有公司80.0%的股权。A轮新投资人通过增发新股拿下25.0%的投后股权。',
    },
    givenFacts: [
      { label: { en: 'Current Founder Ownership', fr: 'Part Fondateur Initiale', zh: '轮前创始人持股' }, value: '80.0%' },
      { label: { en: 'New Round Dilution', fr: 'Dilution du Tour', zh: '新轮出让比例' }, value: '25.0% (1/4)' },
    ],
    question: {
      en: 'What exact percentage of the company do the founders retain immediately after the round closes?',
      fr: 'Quel pourcentage exact du capital les fondateurs conservent-ils immédiatement après le tour ?',
      zh: '交割完成后，创始团队在公司中的持股比例将变为多少？',
    },
    options: [
      {
        text: '60.0%',
        isCorrect: true,
        trapNote: {
          en: 'Flawless multiplication! Retained = 80% × (1 - 0.25) = 80% × 0.75 = 60.0%!',
          fr: 'Calcul parfait ! Capital restant = 80 % × 0,75 = 60,0 % !',
          zh: '毫无破绽！留存持股 = 80% × (1 - 0.25) = 80% × 0.75 = 60.0%！',
        },
      },
      {
        text: '55.0%',
        isCorrect: false,
        trapNote: {
          en: 'Fatal subtraction trap: You subtracted 25% from 80% (80 - 25 = 55%). Dilution is multiplicative, not additive!',
          fr: 'Piège de la soustraction brute : vous avez fait 80 % - 25 % = 55 %. La dilution est un produit proportionnel !',
          zh: '致命减法陷阱：你直接拿 80% 减去 25%（80 - 25 = 55%）。股权稀释是乘法比例萎缩，绝不能直接做减法！',
        },
      },
      {
        text: '65.0%',
        isCorrect: false,
        trapNote: {
          en: 'Miscalculated 3/4ths of 80. 80 × 0.75 = 60%, not 65%.',
          fr: 'Erreur sur les 3/4 de 80. 80 × 0,75 = 60 %.',
          zh: '计算偏差。80的四分之三是60，不是65。',
        },
      },
      {
        text: '50.0%',
        isCorrect: false,
        trapNote: {
          en: 'Subtracted too much. Founders maintain control above the 51% threshold at 60.0%.',
          fr: 'Sous-estimé. Les fondateurs conservent le contrôle absolu à 60 %.',
          zh: '稀释过重。创始人依然稳稳站在51%绝对控股线之上（60.0%）。',
        },
      },
    ],
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
        en: 'When a new investor buys 25%, all existing shareholders keep 75% (3/4) of whatever they previously owned. 3/4 of 80% is 60%. Instant mental calculation.',
        fr: 'Quand le nouvel entrant prend 25 %, les actionnaires existants conservent 75 % (les 3/4) de leurs actions respectives. 3/4 de 80 % = 60 %.',
        zh: '当新投资人认购25%，所有老股东等比例保留原来份额的75%（四分之三）。80%的四分之三即是60%。用分数乘法瞬间心算。',
      },
    },
    timeLimitSeconds: 15,
  },
  {
    id: 'val_10',
    category: 'pre_from_stake',
    title: {
      en: 'The 1/6th Quick Squeeze (16.67% Stake)',
      fr: 'Le Tour au Sixième Éclair (16,67 %)',
      zh: '16.67% 六分之一速算定桩',
    },
    context: {
      en: 'A European venture fund submits an offer: "€3.0M investment for precisely 16.67% post-money equity."',
      fr: 'Un fonds européen vous transmet : "3,0 M€ d’investissement pour exactement 16,67 % du capital Post."',
      zh: '欧洲硬科技基金发来意向：我们注资300万欧元，占投后刚好16.67%的股权。',
    },
    givenFacts: [
      { label: { en: 'Investment Check', fr: 'Ticket Investisseur', zh: '投资金额' }, value: '€3.0M' },
      { label: { en: 'Target Equity Stake', fr: 'Part du Capital', zh: '出让股权' }, value: '16.67% (1/6)' },
    ],
    question: {
      en: 'What is the implied Pre-Money Valuation in euros?',
      fr: 'Quelle est la valorisation Pré-Money implicite en euros ?',
      zh: '该笔出价暗含的【投前估值 (Pre-Money)】是多少欧元？',
    },
    options: [
      {
        text: '€15.0M',
        isCorrect: true,
        trapNote: {
          en: 'Magnificent! 16.67% = 1/6. Post-Money is 6 × €3M = €18M. Pre-Money is €18M - €3M = €15.0M (or 5 × €3M)!',
          fr: 'Magistral ! 16,67 % = 1/6. Post = 6 × 3 M€ = 18 M€. Pré = 18 - 3 = 15,0 M€ (ou 5 × 3 M€) !',
          zh: '神算之境！16.67% = 1/6。投后估值 = 6 × 3M = 1800万欧；投前估值 = 18M - 3M = 1500万欧（或直接 5 × 3M）！',
        },
      },
      {
        text: '€18.0M',
        isCorrect: false,
        trapNote: {
          en: 'You gave Post-Money! Always subtract the check size when asked for Pre-Money.',
          fr: 'C’est le Post-Money ! Il faut déduire le chèque pour trouver le Pré-Money.',
          zh: '这是投后估值！问的是投前估值，必须减掉300万投资款。',
        },
      },
      {
        text: '€12.0M',
        isCorrect: false,
        trapNote: {
          en: 'Undercalculated (multiplied by 4 instead of 5). 3M × 5 = 15.0M.',
          fr: 'Sous-estimé d’un facteur. 3 M€ × 5 = 15,0 M€.',
          zh: '少乘了1倍。投前是投资额的5倍：3 × 5 = 1500万。',
        },
      },
      {
        text: '€20.0M',
        isCorrect: false,
        trapNote: {
          en: 'Too high. €3M into €20M Pre (€23M Post) is only 13.0%, not 16.67%.',
          fr: 'Trop élevé. 3 M€ sur 20 M€ Pré ne représenteraient que 13,0 %.',
          zh: '过高。若投前是2000万，300万投资款只能买到13%的股份。',
        },
      },
    ],
    mentalShortcut: {
      formulaName: {
        en: 'The 16.67% = 1/6 Multiplier Rule',
        fr: 'Règle du Sixième (16,67 % = 6x)',
        zh: '16.67% 六分之一心算法则',
      },
      ruleOfThumb: {
        en: '16.67% is 1/6th of Post-Money! Post = Check × 6. Pre = Check × 5 (€3M × 5 = €15M)!',
        fr: '16,67 % = 1/6 du Post ! Post = Chèque × 6. Pré = Chèque × 5 (3 M€ × 5 = 15 M€) !',
        zh: '16.67% 恰好是六分之一(1/6)！投后 = 支票 × 6；投前 = 支票 × 5（€3M × 5 = €15M）！',
      },
      explanation: {
        en: 'Any seasoned partner knows that 16.67% is 1/6th. To get Pre-Money instantly, multiply the check by (6 - 1) = 5. You calculate it before they take their next sip of coffee.',
        fr: '16,67 % = 1/6e. Pour trouver le Pré instantanément, multipliez le chèque par (6 - 1) = 5. Réponse foudroyante garantie.',
        zh: '顶尖创投老炮的看家本领：16.67%对应1/6。求投前直接拿支票乘5，求投后直接乘6。在对方端起咖啡杯的瞬间脱口而出，威慑力拉满。',
      },
    },
    timeLimitSeconds: 15,
  },
];
