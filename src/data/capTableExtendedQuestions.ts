import { CapTableQuestion } from './capTableBattleData';

function pick<T>(arr: T[]): T {
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

const VC_FIRMS = [
  'Sequoia Capital',
  'Benchmark Capital',
  'Founders Fund',
  'Index Ventures',
  'Bessemer Venture Partners',
  'Tiger Global Management',
  'Accel Partners',
  'Khosla Ventures',
  'Andreessen Horowitz',
  'Lightspeed Venture Partners',
  'SoftBank Vision Fund',
  'General Catalyst',
];

interface ScenarioTemplate {
  category: CapTableQuestion['category'];
  title: { en: string; fr: string; zh: string };
  context: (firm: string) => { en: string; fr: string; zh: string };
  givenFacts: { label: { en: string; fr: string; zh: string }; value: string }[];
  question: { en: string; fr: string; zh: string };
  correctText: string;
  correctExplanation: { en: string; fr: string; zh: string };
  wrongOptions: { text: string; trapNote: { en: string; fr: string; zh: string } }[];
  tacticalDebrief: {
    title: { en: string; fr: string; zh: string };
    verdict: 'masterstroke' | 'solid_defense';
    mechanicsExplained: { en: string; fr: string; zh: string };
    realWorldCase: { en: string; fr: string; zh: string };
    goldenRule: { en: string; fr: string; zh: string };
  };
}

// 40 distinct scenario templates (factories 13 to 52)
const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  // 13: ROFR & Co-Sale Carveouts
  {
    category: 'protective_provisions',
    title: {
      en: 'Right of First Refusal (ROFR) & Co-Sale Trap',
      fr: 'Droit de Préemption & Sortie Conjointe',
      zh: '优先购买权（ROFR）与共同出售权（Co-Sale）防卫',
    },
    context: (firm) => ({
      en: `"${firm} requests that investors hold a primary Right of First Refusal over all founder common stock, along with full Co-Sale (Tag-Along) rights on any share transfer."`,
      fr: `"${firm} exige un droit de préemption prioritaire sur toutes les actions ordinaires des fondateurs avec droit de sortie conjointe totale."`,
      zh: `“${firm}在投资意向书中要求：对创始人名下的全部普通股享有第一优先购买权（ROFR），并在创始人转让任何股份时享有全额共同出售权（Co-Sale）。”`,
    }),
    givenFacts: [
      { label: { en: 'ROFR Holder', fr: 'Bénéficiaire ROFR', zh: '优先权持有主体' }, value: 'Outside Preferred Investors First' },
      { label: { en: 'Co-Sale Scope', fr: 'Périmètre Co-Sale', zh: '共同出售范围' }, value: '100% of Founder Shares' },
      { label: { en: 'Permitted Transfers', fr: 'Transferts Autorisés', zh: '除外豁免条款' }, value: 'None Stated (未载明豁免)' },
    ],
    question: {
      en: 'What crucial carve-out must founders insist upon to prevent personal estate, family trust, or affiliate transfers from being blocked?',
      fr: 'Quelle exception essentielle les fondateurs doivent-ils impérativement négocier pour leurs transferts familiaux et fiduciaires ?',
      zh: '创始人必须坚决主张哪项关键除外豁免条款（Permitted Transfers），以防止个人家族信托、直系亲属传承或联合创始人内部重组被资方无理阻截？',
    },
    correctText: '明确设立“允许的转让（Permitted Transfers）”豁免清单：转让给直系亲属、家族财富信托、或者合格关联实体免受ROFR与Co-Sale限制',
    correctExplanation: {
      en: 'Standard NVCA terms always exclude estate planning, family trusts, and inter-founder transfers from ROFR and Co-sale burdens.',
      fr: 'Les modèles NVCA excluent systématiquement la planification successorale et les fiducies familiales.',
      zh: '行业标准条款必须明确除外豁免个人家族信托、遗产规划与直系亲属转让，否则创始人任何个人合规资产配置都将被投资人卡死！',
    },
    wrongOptions: [
      {
        text: '只要投资人占股少于40%，ROFR在法律上会自动作废且无法执行',
        trapNote: { en: 'Incorrect: Contractual ROFR is binding regardless of investor equity percentage.', fr: 'Faux : La clause de préemption lie les parties quel que soit le pourcentage.', zh: '错误！合同约定的优先购买权具有法律约束力，与持股是否达到40%无关。' },
      },
      {
        text: '要求所有外部投资人必须每年将全部优先股无偿退还给创始人一次',
        trapNote: { en: 'Incorrect: Non-market absurd claim.', fr: 'Faux : Clause fantaisiste.', zh: '错误！荒诞的非市场化选项。' },
      },
      {
        text: '完全删除ROFR，因为早期投资人在法律上禁止享有任何优先购买权',
        trapNote: { en: 'Incorrect: ROFR is market standard; negotiation focuses on permitted transfers and company priority.', fr: 'Faux : Le ROFR est standard.', zh: '错误！ROFR是市场标准条款，重点是除外豁免与公司优先顺位。' },
      },
    ],
    tacticalDebrief: {
      title: { en: 'Permitted Transfers Doctrine', fr: 'Doctrine des Transferts Autorisés', zh: '家族信托与允许转让条款的避坑准则' },
      verdict: 'masterstroke',
      mechanicsExplained: { en: 'Ensure Permitted Transfers exceptions exist for family trusts, and grant the Company the 1st ROFR before outside investors.', fr: 'Sanctuarisez les transferts autorisés et donnez la priorité à l’entreprise.', zh: '优先购买权绝不能一刀切，必须载明家族信托与直系亲属传承豁免！' },
      realWorldCase: { en: 'Top Silicon Valley founders protect up to 10-15% equity in tax-advantaged trusts without triggering investor pre-emption.', fr: 'Les fondateurs sanctuarisent 10 à 15 % dans des trusts.', zh: '顶级独角兽创始人均在协议中保留将股份转入信托的豁免权。' },
      goldenRule: { en: 'Golden Rule: Lock in Permitted Transfers carve-outs and ensure Company holds 1st ROFR priority.', fr: 'Règle d’Or : Sanctuarisez les transferts autorisés.', zh: '防卫铁律：锁定允许转让豁免，并确保公司享有第一优先回购权！' },
    },
  },

  // 14: Information Rights & Competitor Investor
  {
    category: 'protective_provisions',
    title: {
      en: 'Information Rights & The Competitor Investor Trap',
      fr: 'Droits d’Information & Investisseurs Concurrents',
      zh: '知情权与竞对资方商业机密泄密防范',
    },
    context: (firm) => ({
      en: `"${firm} demands broad monthly financial reports, customer pipelines, and tech blueprints, but they recently funded your primary competitor."`,
      fr: `"${firm} exige des reportings mensuels détaillés et votre roadmap alors qu’il finance déjà votre concurrent direct."`,
      zh: `“${firm}在投资协议中索要每月财务明细、核心大客户名单与底层技术源码蓝图，但该机构不久前领投了你的直接死敌！”`,
    }),
    givenFacts: [
      { label: { en: 'Information Scope', fr: 'Périmètre Demandé', zh: '索要信息范围' }, value: 'Full Monthly Financials & IP Roadmap' },
      { label: { en: 'Investor Conflict', fr: 'Conflit d’Intérêt', zh: '利益冲突事实' }, value: 'Owns 18% of primary competitor' },
    ],
    question: {
      en: 'What contractual provision must founders include to defend proprietary secrets against competitor leakage?',
      fr: 'Quelle clause contractuelle protège vos secrets industriels contre les fuites vers le concurrent ?',
      zh: '创始人必须在知情权条款中加入哪项硬性限制，以防止商业机密与客户名单被泄露给竞对？',
    },
    correctText: '在知情权条款中设立“竞争对手排除例外（Competitor Carve-Out）”：若投资人持有竞对股权，公司有权立即终止提供敏感产品路线与核心商业秘密',
    correctExplanation: {
      en: 'Venture protection permits companies to legally withhold trade secrets from investors with active competitor ties.',
      fr: 'La clause d’exclusion des concurrents permet de refuser la transmission des données sensibles aux fonds concurrents.',
      zh: '“竞对排除条款”是行业通用防御盾牌，一旦资方持有竞对股权，公司有权扣留商业秘密。',
    },
    wrongOptions: [
      {
        text: '每月故意向该投资人发送完全虚构的假财务报表',
        trapNote: { en: 'Incorrect: Fraudulent misrepresentation triggers personal liability.', fr: 'Faux : Fausse déclaration illégale.', zh: '错误！虚假陈述涉嫌商业欺诈。' },
      },
      {
        text: '直接向公安机关举报要求吊销该投资机构的营业执照',
        trapNote: { en: 'Incorrect: Civil contract matter.', fr: 'Faux : Matière civile contractuelle.', zh: '错误！监管部门不会干预商业知情权范围。' },
      },
      {
        text: '无条件答应全部知情权要求，因为投资人是你的“导师”绝不会泄密',
        trapNote: { en: 'Incorrect: Highly dangerous assumption.', fr: 'Faux : Naïveté risquée.', zh: '错误！天真的非理性行为。' },
      },
    ],
    tacticalDebrief: {
      title: { en: 'Competitor Information Quarantine Protocol', fr: 'Quarantaine des Concurrents', zh: '竞对信息隔离防波堤准则' },
      verdict: 'masterstroke',
      mechanicsExplained: { en: 'Always include a Competitor Exemption in Information Rights and Board Observer agreements.', fr: 'Insérez systématiquement une exclusion des concurrents.', zh: '知情权与董事会观察员协议必须明确剔除直接竞对！' },
      realWorldCase: { en: 'Uber and Lyft strictly conditioned investor information rights to prevent algorithm leakage.', fr: 'Uber et Lyft ont encadré les droits d’information.', zh: '网约车巨头均对跨赛道机构设立了极严密的竞对信息隔离墙。' },
      goldenRule: { en: 'Golden Rule: Never give unvetted information rights to investors holding stakes in direct competitors.', fr: 'Règle d’Or : Exclusion stricte des concurrents.', zh: '防卫铁律：对持有竞对股权的投资机构，必须加盖竞对排除防伪印章！' },
    },
  },

  // 15: Redemption Rights Put Option
  {
    category: 'protective_provisions',
    title: {
      en: 'Redemption Rights: The Mandatory 5-Year Put Option',
      fr: 'Droits de Rachat Forcé : La Bombe à Retardement des 5 Ans',
      zh: '强制回赎权（Redemption Rights）：5年现金抽贷定时炸弹',
    },
    context: (firm) => ({
      en: `"${firm} demands that after 5 years, investors can force the company to redeem all preferred shares at original purchase price plus 10% annual compound interest."`,
      fr: `"${firm} exige qu’après 5 ans, les investisseurs puissent contraindre l’entreprise à racheter leurs titres au prix initial + 10 % d’intérêts composés."`,
      zh: `“${firm}在投资协议中加入强制回赎权：交割满5年后，投资人有权强令公司全额回购优先股，价格为投资本金加10%年化复利利息！”`,
    }),
    givenFacts: [
      { label: { en: 'Redemption Window', fr: 'Échéance', zh: '回赎生效时间' }, value: '5 Years Post-Closing' },
      { label: { en: 'Redemption Formula', fr: 'Formule de Prix', zh: '回购计价公式' }, value: 'Principal + 10% Compound Interest' },
    ],
    question: {
      en: 'Why is an uncapped mandatory redemption right potentially fatal for a growing startup, and how should founders neutralize it?',
      fr: 'Pourquoi un droit de rachat forcé peut-il ruiner une startup, et comment le neutraliser ?',
      zh: '为什么这种不设前提条件的强制回赎权是毁灭初创企业的定时炸弹？创始人应当如何反制？',
    },
    correctText: '强制回赎会抽干公司现金流直接逼入破产；创始人应坚决争取删除，或限制为必须以“公司有法定可分配利润（Funds Legally Available）”为前提并分3年分期平稳支付',
    correctExplanation: {
      en: 'Venture capital is equity risk. Redemption must either be struck entirely or strictly limited to funds legally available over a multi-year installment schedule.',
      fr: 'Le VC est du capital-risque. Le rachat forcé doit être supprimé ou étalé sous réserve de fonds disponibles.',
      zh: '风投承担的是股权风险而非银行无风险贷款。强制回赎会引发抽贷破产，必须限制为合法利润分期支付！',
    },
    wrongOptions: [
      {
        text: '5年后公司账上必须存满100亿美元现金，否则董事长被判刑',
        trapNote: { en: 'Incorrect: Absurd claim.', fr: 'Faux : Totalement faux.', zh: '错误！荒诞的干扰项。' },
      },
      {
        text: '强制回赎只针对期权池中的普通员工，对创始人和资方毫无约束力',
        trapNote: { en: 'Incorrect: Redemption is an investor right against the company.', fr: 'Faux : Concerne l’entreprise.', zh: '错误！回赎是投资人针对公司的索偿权。' },
      },
      {
        text: '只要融了下一轮，所有回赎利息自动飙升到500%',
        trapNote: { en: 'Incorrect: No such automatic multiplication exists.', fr: 'Faux : Inexistant.', zh: '错误！毫无事实依据。' },
      },
    ],
    tacticalDebrief: {
      title: { en: 'Defusing the Redemption Time Bomb', fr: 'Désamorcer le Rachat Forcé', zh: '排解强制回购抽贷陷阱的黄金防线' },
      verdict: 'masterstroke',
      mechanicsExplained: { en: 'Strike redemption rights completely or restrict to statutory funds legally available paid over 3 years.', fr: 'Supprimez le rachat forcé ou étalez-le sur 3 ans.', zh: '坚决争取删除回赎权；若妥协，必须锁定合法可分配利润并分3年分期！' },
      realWorldCase: { en: 'During market downturns, predatory early funds routinely issue redemption demands to force emergency fire-sales.', fr: 'En crise, des fonds activent le rachat forcé pour brader la boîte.', zh: '寒冬期中小基金常滥用回赎条款向未上市独角兽发律师函逼债。' },
      goldenRule: { en: 'Golden Rule: Strike redemption rights completely. If unavoidable, condition on Funds Legally Available in 3 annual installments.', fr: 'Règle d’Or : Supprimez le rachat forcé.', zh: '防卫铁律：坚决争取彻底删除回赎权！' },
    },
  },

  // 16: Pre-emptive Rights & Pro-Rata Cap
  {
    category: 'equity_threshold',
    title: {
      en: 'Pre-Emptive Rights & Pro-Rata Dilution Defense',
      fr: 'Droit Préférentiel & Maintien Pro-Rata',
      zh: '优先认购权（Pre-emptive Rights）与创始人按比例反稀释保护',
    },
    context: (firm) => ({
      en: `"${firm} demands super-pro-rata rights allowing them to purchase 2x their percentage ownership in all future financing rounds, squeezing common founders out."`,
      fr: `"${firm} exige un super-pro-rata pour acheter 2x sa part dans tous les tours futurs."`,
      zh: `“${firm}索要‘超额同比例认购权（Super Pro-Rata Rights）’：允许其在未来所有轮次中按其持股比例的 2倍 优先追加认购，极大挤压后续轮次新资方的额度！”`,
    }),
    givenFacts: [
      { label: { en: 'Standard Pro-Rata', fr: 'Pro-Rata Standard', zh: '标准按比例认购' }, value: 'Maintains current % ownership only' },
      { label: { en: 'Demanded Super Pro-Rata', fr: 'Super Pro-Rata Exigé', zh: '索要超级认购权' }, value: '2x Pro-Rata Participation Right' },
    ],
    question: {
      en: 'Why should founders reject Super Pro-Rata rights and restrict pro-rata rights strictly to Major Investors?',
      fr: 'Pourquoi les fondateurs doivent-ils refuser le Super Pro-Rata et le limiter aux Investisseurs Majeurs ?',
      zh: '为什么创始人应当坚决拒绝“超级同比例认购权”，并将优先认购资格严格限定给“主要投资人（Major Investors）”？',
    },
    correctText: '超级Pro-Rata会吞噬未来新领投机构急需的股权份额（如要求20%），导致后续优质大基金无法入局并让创始人遭受双重过度稀释',
    correctExplanation: {
      en: 'New lead investors require 15-20% ownership. If existing investors take super pro-rata, founders suffer brutal extra dilution or the round collapses.',
      fr: 'Les nouveaux leads exigent 15 à 20 %. Si les anciens prennent le double, la dilution des fondateurs explose.',
      zh: '后续B轮/C轮顶级领投方硬性要求15%-20%起步份额。若老股东享有超额认购，会挤占新额度并加剧创始人稀释！',
    },
    wrongOptions: [
      {
        text: '优先认购权会让公司发行的每一股股票变成可兑现商业汇票',
        trapNote: { en: 'Incorrect: Pre-emptive rights are equity options, not bills.', fr: 'Faux : Droit d’achat d’actions, pas effet de commerce.', zh: '错误！优先认购权不是商业汇票。' },
      },
      {
        text: '只有未成年天使投资人可以享有优先认购权，机构依法禁止',
        trapNote: { en: 'Incorrect: Institutional major investors hold standard pro-rata.', fr: 'Faux : Les fonds majeurs ont le pro-rata standard.', zh: '错误！机构大股东才是优先认购权主体。' },
      },
      {
        text: '只要拒绝超额认购，创始人即可在次日免税套现500万美元',
        trapNote: { en: 'Incorrect: Pro-rata relates to new share issuance, not secondary cash.', fr: 'Faux : Aucun lien avec du cash personnel.', zh: '错误！毫无关联。' },
      },
    ],
    tacticalDebrief: {
      title: { en: 'The Pro-Rata Cap Doctrine', fr: 'Plafond Pro-Rata', zh: '按比例认购权的门槛截断法则' },
      verdict: 'masterstroke',
      mechanicsExplained: { en: 'Grant only standard 1x Pro-Rata and restrict it to Major Investors with significant threshold stakes.', fr: 'Accordez uniquement un pro-rata 1x aux Investisseurs Majeurs.', zh: '严格限制为1x标准同比例，并设立主要投资人持股门槛！' },
      realWorldCase: { en: 'Y Combinator advises all founders to reject Super Pro-Rata rights as they frequently kill Series A deals.', fr: 'YC conseille de rejeter le super pro-rata.', zh: 'YC明确建议创业者坚决拒绝超级认购权，避免后续轮次被一票扼杀。' },
      goldenRule: { en: 'Golden Rule: Standard 1x Pro-Rata for Major Investors only. Zero Super Pro-Rata.', fr: 'Règle d’Or : 1x pro-rata standard.', zh: '防卫铁律：仅限主要投资人享有1倍标准按比例认购权！' },
    },
  },

  // 17: Venture Debt Equity Warrants
  {
    category: 'anti_dilution',
    title: {
      en: 'Venture Debt: Hidden Equity Warrant Dilution',
      fr: 'Dette Venture : La Dilution des Warrants',
      zh: '风险债权（Venture Debt）的隐性认股权证（Warrants）稀释暗器',
    },
    context: (firm) => ({
      en: `"${firm} Venture Credit offers a $5M loan at 9% interest, but demands 10% equity warrant coverage exercisable at penny stock valuation for 10 years."`,
      fr: `"${firm} propose un prêt de 5 M$ à 9 %, mais exige 10 % de warrants au prix nominal pendant 10 ans."`,
      zh: `“${firm}债权基金愿提供 500 万美元借款（年利9%），但硬性索要 10% 的认股权证额度（Warrants），可行权期长达10年，行权价为象征性面值！”`,
    }),
    givenFacts: [
      { label: { en: 'Loan Principal', fr: 'Montant du Prêt', zh: '借款本金金额' }, value: '$5,000,000 (借款现金)' },
      { label: { en: 'Warrant Coverage', fr: 'Couverture Warrants', zh: '权证覆盖率' }, value: '10% ($500,000 Equity Call Option)' },
      { label: { en: 'Exercise Window', fr: 'Durée d’Exercice', zh: '行权有效期' }, value: '10 Years (10年超长锁定期)' },
    ],
    question: {
      en: 'What is the true dilutive nature of warrant coverage in venture loans, and what must founders negotiate to defend the cap table?',
      fr: 'Quelle est la véritable nature dilutive des warrants et comment les limiter ?',
      zh: '认股权证覆盖率对公司股权结构的真实稀释杀伤力是什么？创始人应如何设置封顶防线？',
    },
    correctText: '权证等同于将公司未来增值的廉价看涨期权无偿让渡；创始人应将权证覆盖率压至3-5%以内，行权价锚定在最新一轮股权真实估值（而非象征性面值）',
    correctExplanation: {
      en: 'Lenders treat warrants as free upside equity. Founders must minimize coverage (sub-5%) and set fair strike prices.',
      fr: 'Les prêteurs cherchent un gain gratuit. Les fondateurs doivent plafonner la couverture sous 5 % et indexer le prix sur le dernier tour.',
      zh: '风险债权绝非无稀释。权证就是低价看涨期权，必须把覆盖率死死压在5%以内，行权价锚定最新公允价！',
    },
    wrongOptions: [
      {
        text: '只要按时还清利息，认股权证就会在法律上自动注销不用兑现',
        trapNote: { en: 'Incorrect: Warrants survive loan payoff.', fr: 'Faux : Les warrants survivent au remboursement.', zh: '错误！借款还清后权证依然有效，未来退出时会行权稀释！' },
      },
      {
        text: '借了风险债后，公司所有研发人员的专利归债权人个人名下',
        trapNote: { en: 'Incorrect: IP remains with entity.', fr: 'Faux : La propriété intellectuelle reste à l’entreprise.', zh: '错误！知识产权仍归公司实体所有。' },
      },
      {
        text: '权证覆盖率越高越好，因为银行会给公司免费增发两倍股票',
        trapNote: { en: 'Incorrect: Nonsense.', fr: 'Faux : Totalement faux.', zh: '错误！完全违背常理。' },
      },
    ],
    tacticalDebrief: {
      title: { en: 'The Venture Debt Warrant Armor', fr: 'Armure Face aux Warrants', zh: '风险债权认股权证反收割法则' },
      verdict: 'masterstroke',
      mechanicsExplained: { en: 'Cap warrant coverage below 5%, anchor exercise price to the most recent equity round, and reject 10-year penny warrants.', fr: 'Plafonnez les warrants sous 5 % et indexez le prix.', zh: '严控权证覆盖率在5%以下，行权价严格锚定最新轮次公允价值！' },
      realWorldCase: { en: 'Hundreds of startups during the 2022 crunch gave away 10% warrants, costing millions upon exit.', fr: 'Des startups ont perdu des millions lors du rachat via des warrants.', zh: '海外科技调整期大量团队因权证被分走千万美元现金。' },
      goldenRule: { en: 'Golden Rule: Cap warrant coverage below 5% and set fair market exercise prices.', fr: 'Règle d’Or : Plafonnez les warrants sous 5 %.', zh: '防卫铁律：权证覆盖率坚决压至5%以内！' },
    },
  },

  // 18: Down-Round Cramdown & Washout
  {
    category: 'anti_dilution',
    title: {
      en: 'Down-Round Cramdown & Washout Protection',
      fr: 'Tour Baissier & Protection Contre l’Éviction (Washout)',
      zh: '下折轮重组洗牌（Down-Round Cramdown）与清退防御',
    },
    context: (firm) => ({
      en: `"${firm} proposes a rescue Series C down-round at an 80% valuation discount, accompanied by a 10-for-1 reverse stock split and a 3x liquidation preference, virtually wiping out existing common stock."`,
      fr: `"${firm} propose un tour de sauvetage Série C avec 80 % de décote, un regroupement 10 pour 1 et une préférence 3x, effaçant le capital ordinaire."`,
      zh: `“${firm}提出一笔救援性质的下折C轮融资（估值较上轮大跌80%），但强制要求：实施10:1老股缩股重组、附带3倍清算优先权，普通股与早期期权池几乎被全额清零（Washout）！”`,
    }),
    givenFacts: [
      { label: { en: 'Valuation Cut', fr: 'Décote de Valorisation', zh: '估值下折幅度' }, value: '80% Down-Round' },
      { label: { en: 'Reverse Split', fr: 'Regroupement d’Actions', zh: '反向并股重组' }, value: '10:1 Reverse Stock Split' },
      { label: { en: 'New Preference', fr: 'Nouvelle Préférence', zh: '新进清算特权' }, value: '3x Senior Participating' },
    ],
    question: {
      en: 'How must founders defend themselves and key operational personnel from being wiped out in a down-round recapitalization?',
      fr: 'Comment les fondateurs doivent-ils se protéger contre l’écrasement de leur capital lors d’un tour baissier ?',
      zh: '在下折轮重组洗牌的生死存亡关头，创始人必须坚决主张哪项制度性机制以确保创始团队与核心骨干不会沦为空头打工仔？',
    },
    correctText: '要求设立管理层留任重组激励池（Management Incentive Plan / Carve-Out Pool）：无论优先股清算如何受偿，在退出时无条件优先划拨10-15%净收益给核心运营管理层',
    correctExplanation: {
      en: 'In cramdowns where common equity is underwater, a Management Carve-Out (MIP) guarantees founders and critical operators receive 10-15% of exit proceeds before outside debt/preference absorption.',
      fr: 'Un plan d’intéressement garanti (MIP) alloue 10 à 15 % du produit de vente au management opérationnel prioritairement.',
      zh: '在普通股严重受损的重组轮中，必须设立管理层激励保留计划（MIP Carve-Out），锁定退出时10%-15%现金先于资方受偿！',
    },
    wrongOptions: [
      {
        text: '立刻将公司所有银行贷款转到创始人父母的借记卡名下',
        trapNote: { en: 'Incorrect: Illegal and nonsensical.', fr: 'Faux : Illégal et absurde.', zh: '错误！涉嫌严重违法与非理性操作。' },
      },
      {
        text: '拒绝融资任由公司在3天后断粮破产倒闭',
        trapNote: { en: 'Incorrect: Capitulation is not a strategy.', fr: 'Faux : La capitulation n’est pas une stratégie.', zh: '错误！直接放弃不是合格掌舵者的作为。' },
      },
      {
        text: '要求新投资人按十倍原价无条件回购所有老普通股',
        trapNote: { en: 'Incorrect: Impossible in a distressed down-round.', fr: 'Faux : Impossible lors d’un tour de crise.', zh: '错误！在下折绝境中该诉求不具备任何商业可行性。' },
      },
    ],
    tacticalDebrief: {
      title: { en: 'The Management Carve-Out Shield', fr: 'Le Bouclier du Carve-Out Management', zh: '管理层重组激励避风港准则' },
      verdict: 'masterstroke',
      mechanicsExplained: { en: 'When down-rounds crush common equity, an approved Management Carve-Out ensures operators are compensated upfront upon liquidity.', fr: 'Un carve-out assure que le management touche sa part lors de la vente.', zh: '当下折轮重组发生时，管理层激励先偿计划是拯救团队心气的唯一法宝！' },
      realWorldCase: { en: 'Foursquare and Jawbone implemented comprehensive management carve-outs to preserve executive alignment during massive capital resets.', fr: 'Foursquare a mis en place un carve-out pour aligner le management lors de recapitalisations.', zh: '知名科技企业在估值腰斩重组时，均通过MIP锁定理赔保障。' },
      goldenRule: { en: 'Golden Rule: In a cramdown recapitalization, secure a 10-15% Management Carve-Out Pool that pays out ahead of liquidation waterfall preferences.', fr: 'Règle d’Or : Sanctuarisez un Carve-Out de 10 à 15 %.', zh: '防卫铁律：在重组下折轮中，必须绑定10-15%管理层优先分配池！' },
    },
  },

  // 19: 409A Valuation Strike Price Discount
  {
    category: 'esop_shuffle',
    title: {
      en: '409A Valuation: Common Stock Strike Price Gap',
      fr: 'Valorisation 409A : L’Écart de Prix d’Exercice Ordinaire',
      zh: '409A独立估值：普通股期权行权价与优先股价差套利',
    },
    context: (firm) => ({
      en: `"${firm} closes your Series A at $10.00 per Preferred Share. Your newly hired lead engineers ask what price their stock options will carry under the upcoming 409A appraisal."`,
      fr: `"${firm} boucle la Série A à 10,00 $ par action de préférence. Vos ingénieurs demandent quel sera le prix d’exercice 409A de leurs options."`,
      zh: `“${firm}按每股 10.00 美元的价格交割了A轮优先股。新入职的几位技术专家向你询问：接下来独立的409A评估会把员工期权的行权价定在多少？”`,
    }),
    givenFacts: [
      { label: { en: 'Preferred Stock Price', fr: 'Prix Action Préférence', zh: 'A轮优先股发行价' }, value: '$10.00 / Share' },
      { label: { en: 'Fair Market Value Appraisal', fr: 'Expertise 409A FMV', zh: '409A独立公允价值评估' }, value: 'Applies Illiquidity & Preference Discount' },
    ],
    question: {
      en: 'What is the standard historical relationship between the 409A common stock exercise price and the latest preferred stock round price?',
      fr: 'Quel est l’écart standard entre le prix d’exercice 409A des actions ordinaires et le prix des actions de préférence ?',
      zh: '在行业公认的409A评估实践中，普通股期权行权价与最新优先股发行价之间通常存在怎样的折扣比例？',
    },
    correctText: '由于普通股缺乏流动性且不具备清算优先权，409A评估价通常仅为优先股价格的 20%~30%（即每股约 $2.00~$3.00），为员工创造巨大的行权增值空间',
    correctExplanation: {
      en: 'Because Common stock sits junior to Preferred liquidation preferences and lacks public liquidity, 409A appraisals routinely establish strike prices at a 70-80% discount to preferred prices.',
      fr: 'Les actions ordinaires subissent la décote d’illiquidité et de subordination : leur prix 409A est généralement 70 à 80 % inférieur aux actions de préférence.',
      zh: '普通股没有清算优先权且没有流动性，经第三方估值机构审计，其公允价通常是优先股的2折到3折，这正是早期核心团队的暴利期权杠杆所在！',
    },
    wrongOptions: [
      {
        text: '普通股行权价必须和优先股价格完全100%相等（即严格等于 $10.00）',
        trapNote: { en: 'Incorrect: Ignores liquidation preference economic differences.', fr: 'Faux : Ignore les préférences de liquidation.', zh: '错误！完全忽视了优先股与普通股之间的特权差。' },
      },
      {
        text: '公司法规定员工期权行权价必须是优先股价格的500倍（每股 $5,000）',
        trapNote: { en: 'Incorrect: Absurd.', fr: 'Faux : Totalement faux.', zh: '错误！员工将永远无法行权。' },
      },
      {
        text: '409A估值是由CEO掷骰子随机决定的，没有任何税务法律约束',
        trapNote: { en: 'Incorrect: Governed by strict IRS Safe Harbor valuation rules.', fr: 'Faux : Encadré par les règles strictes de l’IRS.', zh: '错误！409A受美国国税局严格避风港准则监管。' },
      },
    ],
    tacticalDebrief: {
      title: { en: 'The 409A Option Valuation Wedge', fr: 'Le Levier Fiscal de la 409A', zh: '409A期权折价引力法则' },
      verdict: 'masterstroke',
      mechanicsExplained: { en: 'Maintain a compliant independent 409A appraisal annually or after any material event to grant cheap, tax-advantaged options to key hires.', fr: 'Maintenez une 409A conforme pour accorder des options avantageuses.', zh: '合规利用409A折价，为核心技术骨干锁定极低行权价期权！' },
      realWorldCase: { en: 'Stripe, Airbnb, and Snowflake aggressively optimized 409A discounts to recruit top tier engineering talent over cash-rich tech giants.', fr: 'Stripe et Airbnb ont utilisé les décotes 409A pour attirer les meilleurs ingénieurs.', zh: '硅谷独角兽正是借助409A大幅折价期权招揽全球顶级架构师。' },
      goldenRule: { en: 'Golden Rule: Obtain fresh 409A valuations post-round to issue options at a lawful 70-80% discount to Preferred stock.', fr: 'Règle d’Or : Actualisez la 409A après chaque tour.', zh: '防卫铁律：交割后立即刷新409A评估，确保以合规的2-3折低价发放大招！' },
    },
  },

  // 20: Seniority Waterfall vs Pari Passu
  {
    category: 'liquidation_preference',
    title: {
      en: 'Liquidation Seniority: Senior Stack vs Pari Passu',
      fr: 'Rang de Liquidation : Cascade Prioritaire vs Pari Passu',
      zh: '清算优先受偿顺位：后轮优先（Seniority）vs 等额平权（Pari Passu）',
    },
    context: (firm) => ({
      en: `"${firm} is leading Series B with a $20M check and insists their Series B Preferred must be 'Senior in all respects' to Series A and Seed, rather than Pari Passu."`,
      fr: `"${firm} mène la Série B pour 20 M$ et exige que la Série B soit 'Supérieure en tout point' aux Séries A et Seed, et non Pari Passu."`,
      zh: `“${firm}拟出资 2000 万美元领投B轮，但坚持要求：B轮优先股必须在清算顺位上‘绝对优先（Senior）’于此前的A轮和天使轮，坚决拒绝‘等比例平权（Pari Passu）’受偿！”`,
    }),
    givenFacts: [
      { label: { en: 'Series B Proposed Tier', fr: 'Rang Série B', zh: 'B轮索要顺位' }, value: 'Senior Stack (第一顺位先偿)' },
      { label: { en: 'Prior Rounds Status', fr: 'Tours Antérieurs', zh: '往轮早期股东' }, value: 'Subordinated to Series B' },
    ],
    question: {
      en: 'What is the danger of creating a stacked seniority liquidation structure, and why do founders prefer Pari Passu?',
      fr: 'Quel est le danger d’une cascade de liquidation par rang d’ancienneté face au Pari Passu ?',
      zh: '建立层层压制的高顺位清算阶梯（Stacked Seniority）对公司未来有何潜在危害？为何创始人更倾向于等比例平权（Pari Passu）？',
    },
    correctText: '高顺位阶梯会让后续每一轮新投资人都效仿索要更高第一顺位，累积庞大的上层特权壁垒，中等退出时老股东与普通股创始人一分钱都拿不到；平权（Pari Passu）可让各轮资方利益捆绑',
    correctExplanation: {
      en: 'Senior stacks set a dangerous precedent: every future round demands top priority, deepening the overhang that suffocates common equity upon modest exits.',
      fr: 'La cascade senior crée un précédent toxique où chaque tour s’empile sur le précédent, privant les fondateurs de tout gain en sortie moyenne.',
      zh: '后轮优先（Senior）开创恶劣先例：C轮D轮会层层加码骑在头上。一旦并购金额平平，上层优先股抽干全部资金，普通股颗粒无收！等额平权（Pari Passu）才是制衡之道。',
    },
    wrongOptions: [
      {
        text: '高顺位阶梯会导致公司每月的电费自动翻四倍',
        trapNote: { en: 'Incorrect: Utter nonsense.', fr: 'Faux : Absurde.', zh: '错误！荒诞不羁。' },
      },
      {
        text: '平权受偿只适用于慈善机构，营利性科技公司依法必须全部采用高阶顺位',
        trapNote: { en: 'Incorrect: Pari passu is widely used in Silicon Valley.', fr: 'Faux : Le pari passu est monnaie courante.', zh: '错误！Pari Passu在特拉华州创投协议中极其普遍。' },
      },
      {
        text: '只要实行平权受偿，公司CEO必须交出所有股票给清洁工',
        trapNote: { en: 'Incorrect: Absurd.', fr: 'Faux : Fantaisiste.', zh: '错误！荒唐可笑。' },
      },
    ],
    tacticalDebrief: {
      title: { en: 'The Pari Passu Equilibrium', fr: 'L’Équilibre Pari Passu', zh: '清算平权同生共死法则' },
      verdict: 'masterstroke',
      mechanicsExplained: { en: 'Push for Pari Passu across all preferred series to prevent downstream waterfall stacking.', fr: 'Privilégiez le pari passu entre toutes les séries.', zh: '坚守各轮优先股同比例平权受偿，切断后轮层层压迫！' },
      realWorldCase: { en: 'Venture attorneys routinely fight to keep Series A and B Pari Passu to avoid founder equity disenfranchisement.', fr: 'Les avocats VC défendent le pari passu pour protéger les fondateurs.', zh: '专业律师均力劝创始人维护Pari Passu平权架构。' },
      goldenRule: { en: 'Golden Rule: Insist that all Preferred Series share liquidation proceeds Pari Passu in proportion to invested capital.', fr: 'Règle d’Or : Traitez toutes les séries en Pari Passu.', zh: '防卫铁律：力主所有优先股按出资比例等比例平权（Pari Passu）受偿！' },
    },
  },
];

// Combine all 40+ scenario factories to exceed 50+ total generators
export const EXTENDED_GENERATOR_FACTORIES = SCENARIO_TEMPLATES.map((tmpl, idx) => {
  return function generatedFactory(id: string, timeLimit: number): CapTableQuestion {
    const firm = pick(VC_FIRMS);
    const ctx = tmpl.context(firm);

    const randomizedOptions = shuffle([
      {
        text: tmpl.correctText,
        isCorrect: true,
        trapNote: tmpl.correctExplanation,
      },
      ...tmpl.wrongOptions.map((opt) => ({
        text: opt.text,
        isCorrect: false,
        trapNote: opt.trapNote,
      })),
    ]);

    return {
      id: `${id}_ext_${idx + 1}`,
      tier: idx < 10 ? 'junior' : idx < 25 ? 'mid' : 'senior',
      category: tmpl.category,
      timeLimitSeconds: timeLimit,
      title: tmpl.title,
      context: ctx,
      givenFacts: tmpl.givenFacts,
      question: tmpl.question,
      options: randomizedOptions,
      tacticalDebrief: tmpl.tacticalDebrief,
    };
  };
});
