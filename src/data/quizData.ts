import { QuizQuestion } from '../types';

export const examQuestions: QuizQuestion[] = [
  // SECTION 1: Finance & Fundraising (20 questions)
  {
    id: 'exam_001',
    number: 1,
    category: 'funding',
    difficulty: 'intermediate',
    question: {
      en: 'A startup raises $3,000,000 at a $12,000,000 pre-money valuation. What is the post-money valuation and the investor’s ownership percentage?',
      fr: 'Une startup lève 3 000 000 $ sur une valorisation pré-money de 12 000 000 $. Quelles sont la valorisation post-money et la part de l’investisseur ?',
      zh: '初创公司按1200万美元投前估值完成300万美元融资。投后估值是多少？投资人的持股比例是多少？',
    },
    options: [
      {
        en: 'Post-money: $15,000,000; Investor ownership: 20.0%',
        fr: 'Post-money : 15 000 000 $ ; Part investisseur : 20,0 %',
        zh: '投后估值：1500万美元；投资人持股比例：20.0%',
      },
      {
        en: 'Post-money: $15,000,000; Investor ownership: 25.0%',
        fr: 'Post-money : 15 000 000 $ ; Part investisseur : 25,0 %',
        zh: '投后估值：1500万美元；投资人持股比例：25.0%',
      },
      {
        en: 'Post-money: $12,000,000; Investor ownership: 20.0%',
        fr: 'Post-money : 12 000 000 $ ; Part investisseur : 20,0 %',
        zh: '投后估值：1200万美元；投资人持股比例：20.0%',
      },
      {
        en: 'Post-money: $9,000,000; Investor ownership: 33.3%',
        fr: 'Post-money : 9 000 000 $ ; Part investisseur : 33,3 %',
        zh: '投后估值：900万美元；投资人持股比例：33.3%',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Post-Money = Pre-Money ($12M) + Investment Amount ($3M) = $15M. Investor Ownership = $3M / $15M = 20.0%.',
      fr: 'Post-Money = Pré-Money (12 M$) + Montant investi (3 M$) = 15 M$. Part investisseur = 3 M$ / 15 M$ = 20,0 %.',
      zh: '投后估值 = 投前估值(1200万) + 融资金额(300万) = 1500万美元。投资人股权占比 = 300万 / 1500万 = 20.0%。',
    },
    statutoryReference: 'NVCA Model Term Sheet § Valuation Mechanics',
  },
  {
    id: 'exam_002',
    number: 2,
    category: 'funding',
    difficulty: 'intermediate',
    question: {
      en: 'If a company has $1,200,000 in bank cash, generates $50,000 in monthly gross revenue, and has $130,000 in monthly gross operating expenses, what is its net runway?',
      fr: 'Si une entreprise dispose de 1 200 000 $ en banque, génère 50 000 $ de CA mensuel brut et dépense 130 000 $ de charges mensuelles, quel est son runway net ?',
      zh: '若公司银行账户现金为120万美元，每月总营收为5万美元，月度营运总支出为13万美元，净跑道（Runway）为多长？',
    },
    options: [
      {
        en: '15.0 months',
        fr: '15,0 mois',
        zh: '15.0 个月',
      },
      {
        en: '9.2 months',
        fr: '9,2 mois',
        zh: '9.2 个月',
      },
      {
        en: '24.0 months',
        fr: '24,0 mois',
        zh: '24.0 个月',
      },
      {
        en: '12.0 months',
        fr: '12,0 mois',
        zh: '12.0 个月',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Monthly Net Burn = Expenses ($130k) - Revenue ($50k) = $80k/month. Runway = $1,200,000 / $80,000 = 15.0 months.',
      fr: 'Burn net mensuel = Dépenses (130 k$) - CA (50 k$) = 80 k$/mois. Runway = 1 200 000 $ / 80 000 $ = 15,0 mois.',
      zh: '月净烧钱率 = 总支出(13万) - 总营收(5万) = 8万美元/月。净跑道 = 120万 / 8万 = 15.0个月。',
    },
  },
  {
    id: 'exam_003',
    number: 3,
    category: 'convertibles',
    difficulty: 'advanced',
    question: {
      en: 'What is the principal difference between a Pre-Money SAFE and a Post-Money SAFE for existing founders?',
      fr: 'Quelle est la différence fondamentale pour les fondateurs entre un SAFE Pre-Money et un SAFE Post-Money ?',
      zh: '对于原创始团队而言，投前SAFE (Pre-Money SAFE) 与投后SAFE (Post-Money SAFE) 的核心区别是什么？',
    },
    options: [
      {
        en: 'Post-Money SAFE locks the investor’s ownership percentage upfront; subsequent SAFEs dilute founders, not previous Post-Money SAFE holders.',
        fr: 'Le SAFE Post-Money fige d’emblée le pourcentage de l’investisseur ; les SAFEs suivants diluent les fondateurs, pas les détenteurs de Post-Money SAFE précédents.',
        zh: 'Post-Money SAFE提前锁定了投资人的固定股权比例；后续发行的SAFE全部稀释创始人，而不会稀释已发行的Post-Money SAFE持有者。',
      },
      {
        en: 'Pre-Money SAFEs require immediate interest payments, whereas Post-Money SAFEs do not.',
        fr: 'Les SAFEs Pre-Money exigent des intérêts périodiques immédiats, contrairement aux Post-Money SAFEs.',
        zh: 'Pre-Money SAFE需要按季度支付现金利息，而Post-Money SAFE不需要。',
      },
      {
        en: 'Post-Money SAFEs automatically give board observer rights, whereas Pre-Money SAFEs do not.',
        fr: 'Les SAFEs Post-Money accordent obligatoirement un siège d’observateur au conseil.',
        zh: 'Post-Money SAFE依法自动赋予董事会观察员席位。',
      },
      {
        en: 'There is no dilution difference; the terms are purely marketing nomenclature.',
        fr: 'Il n’y a aucune différence de dilution, il s’agit d’une simple appellation commerciale.',
        zh: '两者在稀释上没有任何区别，仅为商业包装称谓。',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'In Y Combinator’s Post-Money SAFE, the investor ownership is explicitly fixed as (Investment Amount / Post-Money Valuation Cap). Every additional SAFE dilutes only the founders until the priced round.',
      fr: 'Dans le SAFE Post-Money (standard YC), la part de l’investisseur est gravée à (Montant / Cap). Tout nouveau SAFE dilue exclusivement les fondateurs jusqu’au tour pricé.',
      zh: '在YC标准的Post-Money SAFE体系中，投资人所有权直接固定为(投资金额/投后估值上限)。在定价轮之前叠加的每一笔SAFE都将百分之百稀释创始人。',
    },
  },
  {
    id: 'exam_004',
    number: 4,
    category: 'economics',
    difficulty: 'advanced',
    question: {
      en: 'In an M&A exit of $30M, Series A investors invested $10M holding "1x Participating Preferred with no cap" for 33.3% of the company. How much do the Series A investors receive?',
      fr: 'Lors d’une acquisition à 30 M$, les investisseurs Série A ont investi 10 M$ avec une « Préférence 1x participante sans cap » pour 33,3 % du capital. Combien perçoivent-ils ?',
      zh: '在3000万美元并购退出中，A轮投资人当年投资1000万美元，持有“1倍无上限参与型优先股”，占股33.3%。他们最终将分得多少资金？',
    },
    options: [
      {
        en: '$16.66M ($10M preference first + 33.3% of remaining $20M)',
        fr: '16,66 M$ (10 M$ de préférence d’abord + 33,3 % des 20 M$ restants)',
        zh: '1666万美元（先拿走1000万美元优先清算额 + 剩余2000万美元中按33.3%分走666万）',
      },
      {
        en: '$10.00M (Only their 1x preference)',
        fr: '10,00 M$ (Uniquement leur préférence 1x)',
        zh: '1000万美元（仅拿回1倍本金优先额）',
      },
      {
        en: '$10.00M or 33.3% of $30M, whichever is higher ($10.00M)',
        fr: '10,00 M$ ou 33,3 % de 30 M$, selon le plus élevé',
        zh: '1000万美元或按33.3%拿走1000万美元，二者取高',
      },
      {
        en: '$20.00M (Double their principal investment)',
        fr: '20,00 M$ (Le double du principal investi)',
        zh: '2000万美元（两倍本金保证）',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'With Participating Preferred ("double dipping"), the investor takes their 1x liquidation preference ($10M) first. The remaining $20M is distributed pro-rata: 33.3% of $20M = $6.66M. Total = $16.66M.',
      fr: 'Avec une préférence participante, l’investisseur prend d’abord sa préférence de 10 M$. Le solde de 20 M$ est partagé au prorata : 33,3 % de 20 M$ = 6,66 M$. Total perçu = 16,66 M$.',
      zh: '参与型优先股（双重瓜分机制）：投资人首先全额拿回1000万美元清算优先本金，剩余2000万美元资金池再与普通股按比例瓜分（33.3%×2000万=666万），总计斩获1666万美元。',
    },
  },
  {
    id: 'exam_005',
    number: 5,
    category: 'control',
    difficulty: 'intermediate',
    question: {
      en: 'Which of the following is typically a Protective Provision requiring separate Preferred Stock class approval?',
      fr: 'Laquelle des décisions suivantes constitue typiquement une clause de protection (Protective Provision) requérant l’approbation spécifique des actions de préférence ?',
      zh: '下列哪一项属于典型的保护性条款（Protective Provisions），必须经由优先股独立投票批准？',
    },
    options: [
      {
        en: 'Amending the certificate of incorporation to create a new class of shares senior to Series A',
        fr: 'Modifier les statuts pour créer une nouvelle catégorie d’actions ayant un rang supérieur à la Série A',
        zh: '修改公司章程，创设清算排位优先于当前A轮的新股类别',
      },
      {
        en: 'Approving the quarterly office cleaning supply contractor',
        fr: 'Valider le contrat trimestriel de nettoyage des bureaux',
        zh: '批准办公室季度保洁物业供应商合同',
      },
      {
        en: 'Hiring a junior customer support representative',
        fr: 'Recruter un stagiaire ou chargé de support client junior',
        zh: '录用一名初级客服支持专员',
      },
      {
        en: 'Updating the company social media profile photo',
        fr: 'Mettre à jour la photo de profil du compte Twitter d’entreprise',
        zh: '更换公司官方推特社交媒体头像',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Protective provisions are fundamental shareholder veto rights protecting preferred investors against value impairment, such as senior equity issuance, sale of the company, or charter modifications.',
      fr: 'Les clauses de protection sont des vetos fondamentaux protégeant les investisseurs contre l’altération de leurs droits (création de titres seniors, vente de la société, modification statutaire).',
      zh: '保护性条款赋予优先股股东对于可能损害自身利益之重大事项的否决权（如创设优先劣后级更高的新股、出售并购公司或修改章程）。',
    },
    statutoryReference: 'NVCA Investors’ Rights Agreement § 3.3 Series A Protective Provisions',
  },

  // SECTION 2: Cap Table & Valuation (20 questions pattern)
  {
    id: 'exam_006',
    number: 6,
    category: 'captable',
    difficulty: 'advanced',
    question: {
      en: 'What is the "Option Pool Shuffle"?',
      fr: 'Qu’appelle-t-on l’effet de bascule du pool d’options (« Option Pool Shuffle ») ?',
      zh: '风投交易中所谓的“期权池洗牌戏法(Option Pool Shuffle)”是指什么？',
    },
    options: [
      {
        en: 'Requiring that a new 10%–15% employee stock option pool be created entirely out of the Pre-Money valuation, shifting 100% of the dilution onto existing founders.',
        fr: 'Exiger qu’un nouveau pool de 10 % à 15 % d’options salariés soit créé intégralement avant le tour (pré-money), reportant 100 % de la dilution sur les fondateurs.',
        zh: '投资人要求将新增的10%-15%员工期权池全额计入“投前估值”完成扩容，从而使期权稀释100%全部转嫁到现有创始团队头上。',
      },
      {
        en: 'Shuffling employee options between engineering and sales teams based on monthly performance.',
        fr: 'Redistribuer les options entre développeurs et commerciaux selon les performances mensuelles.',
        zh: '根据月度绩效考核，在技术团队与销售团队之间来回调整员工期权配额。',
      },
      {
        en: 'Trading common stock options for convertible promissory notes during an acquisition.',
        fr: 'Échanger des options d’actions ordinaires contre des obligations convertibles lors d’une acquisition.',
        zh: '在并购重组期间将普通期权置换为可转换期票。',
      },
      {
        en: 'Cancelling all unvested options when an employee departs the company.',
        fr: 'Annuler toutes les options non acquises lorsqu’un collaborateur quitte l’entreprise.',
        zh: '员工离职时依照常规归属计划注销所有未成熟的期权。',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'By insisting the option pool is expanded pre-money, the investor achieves their target ownership percentage cleanly while the founders absorb the entire dilution alone, reducing the effective pre-money valuation.',
      fr: 'En exigeant l’agrandissement du pool en pré-money, l’investisseur sécurise sa participation cible nette tandis que les fondateurs subissent seuls la dilution, réduisant la valorisation effective.',
      zh: '通过在投前扩大期权池，投资人得以毫发无损地确保自身既定持股比例，而创始人独自吞下全部稀释苦果，实质上变相压低了真实投前估值。',
    },
  },
  {
    id: 'exam_007',
    number: 7,
    category: 'captable',
    difficulty: 'expert',
    question: {
      en: 'A founder owns 8,000,000 common shares. Pre-round cap table is 10,000,000 fully diluted shares. The Series A investor invests $5,000,000 at a $20,000,000 pre-money valuation. How many new Series A shares are issued?',
      fr: 'Un fondateur détient 8 000 000 d’actions. Le total pré-tour est de 10 000 000 d’actions pleinement diluées. L’investisseur Série A apporte 5 000 000 $ sur une valorisation pré-money de 20 000 000 $. Combien de nouvelles actions Série A sont émises ?',
      zh: '创始人持有800万股普通股。融资前完全稀释总股本为1000万股。A轮投资人按2000万美元投前估值注资500万美元。本轮应发行多少股新A轮优先股？',
    },
    options: [
      {
        en: '2,500,000 new shares (at $2.00 per share)',
        fr: '2 500 000 nouvelles actions (à 2,00 $ par action)',
        zh: '2,500,000 股新股（每股单价 2.00 美元）',
      },
      {
        en: '2,000,000 new shares (at $2.50 per share)',
        fr: '2 000 000 nouvelles actions (à 2,50 $ par action)',
        zh: '2,000,000 股新股（每股单价 2.50 美元）',
      },
      {
        en: '5,000,000 new shares (at $1.00 per share)',
        fr: '5 000 000 nouvelles actions (à 1,00 $ par action)',
        zh: '5,000,000 股新股（每股单价 1.00 美元）',
      },
      {
        en: '1,250,000 new shares (at $4.00 per share)',
        fr: '1 250 000 nouvelles actions (à 4,00 $ par action)',
        zh: '1,250,000 股新股（每股单价 4.00 美元）',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Share Price = Pre-Money Valuation ($20M) / Pre-Round Shares (10M) = $2.00 per share. New Shares Issued = $5M / $2.00 = 2,500,000 shares. Total post-round shares = 12,500,000.',
      fr: 'Prix par action = Valorisation pré-money (20 M$) / Actions pré-tour (10 M) = 2,00 $. Actions émises = 5 M$ / 2,00 $ = 2 500 000 actions.',
      zh: '每股单价 = 投前估值(2000万) / 轮前总股数(1000万) = 2.00美元/股。应增发新股数 = 500万美元 / 2.00美元 = 2,500,000股。投后总股本增至12,500,000股。',
    },
  },

  // SECTION 3: Term Sheet & Protections (20 questions pattern)
  {
    id: 'exam_008',
    number: 8,
    category: 'protections',
    difficulty: 'advanced',
    question: {
      en: 'Why is a "Full Ratchet" anti-dilution clause considered extremely punitive to founders during a down round compared to "Broad-Based Weighted Average"?',
      fr: 'Pourquoi la clause anti-dilution « Full Ratchet » est-elle considérée comme extrêmement punitive pour les fondateurs lors d’un down round par rapport au « Broad-Based Weighted Average » ?',
      zh: '为什么在发生下调轮(Down Round)时，“完全棘轮(Full Ratchet)”反稀释条款相比“广义加权平均(Broad-Based Weighted Average)”对创始人而言具有毁灭性杀伤力？',
    },
    options: [
      {
        en: 'Full Ratchet reprices ALL prior investor shares down to the new lower price regardless of how little capital was raised in the down round, causing catastrophic founder dilution.',
        fr: 'Le Full Ratchet réajuste TOUTES les actions de l’investisseur précédent au nouveau prix le plus bas, quel que soit le montant dérisoire levé, écrasant les fondateurs.',
        zh: '完全棘轮将前期投资人持有的所有股份单价，无条件直接重置下调至本次下调轮的最低新股价，哪怕本次只融了极微小金额，也会引发创始人股权的毁灭性雪崩。',
      },
      {
        en: 'Full Ratchet forces founders to sell their personal intellectual property to the investor at par value.',
        fr: 'Le Full Ratchet oblige les fondateurs à céder leur propriété intellectuelle personnelle au pair.',
        zh: '完全棘轮强制创始人以票面价值将个人名下知识产权转让给投资人。',
      },
      {
        en: 'Broad-Based Weighted Average automatically removes the board seat of the investor.',
        fr: 'Le Broad-Based Weighted Average supprime automatiquement le siège au conseil de l’investisseur.',
        zh: '广义加权平均会在估值下调时自动剥夺投资人的董事会席位。',
      },
      {
        en: 'Full Ratchet only applies to public markets and has no effect on private cap tables.',
        fr: 'Le Full Ratchet ne s’applique qu’aux sociétés cotées et n’a aucun effet sur les startups.',
        zh: '完全棘轮仅适用于公开股票二级市场，在未上市初创公司中不产生效力。',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Broad-based weighted average considers both the price AND the amount of capital raised (dilution volume). Full Ratchet ignores volume completely: issuing even a single share at a $0.01 price would reset the entire Series A conversion price to $0.01.',
      fr: 'La moyenne pondérée prend en compte le prix ET le volume levé. Le Full Ratchet ignore le volume : émettre une seule action à bas prix réajuste l’intégralité des actions antérieures.',
      zh: '广义加权平均兼顾了新股发行的价格与实际融资金额（即稀释权重）；而完全棘轮完全不看融资规模，哪怕以极低价格增发哪怕一股，也会将全部历史优先股的转股价拉低至该谷底价。',
    },
    statutoryReference: 'NVCA Certificate of Incorporation § 4.4 Anti-Dilution Adjustment',
  },

  // SECTION 4: Psychology & Decision Making (15 questions pattern)
  {
    id: 'exam_009',
    number: 9,
    category: 'psychology',
    difficulty: 'intermediate',
    question: {
      en: 'What is the tactical purpose of Chris Voss’s "Calibrated How Question" when an investor asks for an untenable 3x liquidation preference?',
      fr: 'Quel est l’objectif tactique de la question calibrée en « Comment » face à un investisseur exigeant une préférence intenable de 3x ?',
      zh: '当投资人提出不可接受的3倍清算优先权要求时，使用克里斯·沃斯式的“校准型如何提问”具有什么战术意图？',
    },
    options: [
      {
        en: 'It stops counter-arguments, avoids defensive aggression, and invites the investor to solve the problem of attracting future tier-1 investors together.',
        fr: 'Elle désamorce l’agressivité défensive et invite l’investisseur à résoudre lui-même la contradiction d’attirer de futurs fonds de Série A.',
        zh: '消除防御性对抗情绪，将对方从居高临下的索要者转换为合作者，共同化解该条款将阻碍后续顶尖机构入局的治理困境。',
      },
      {
        en: 'It tricks the investor into signing the contract by mistake.',
        fr: 'Elle trompe l’investisseur pour qu’il signe le contrat par mégarde.',
        zh: '通过话术诱导投资人一时疏忽在终版协议上误签字。',
      },
      {
        en: 'It satisfies Delaware legal certification requirements for board minutes.',
        fr: 'Elle remplit les exigences formelles de certification du Delaware pour les procès-verbaux.',
        zh: '满足特拉华州公司法对于董事会会议纪要的法定认证要求。',
      },
      {
        en: 'It is a form of hypnotism that forces the VC to capitulate immediately.',
        fr: 'Il s’agit d’une technique d’hypnose forçant le VC à capituler sur-le-champ.',
        zh: '一种能迫使风投合伙人当场无条件妥协的心理催眠术。',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Asking "How are future Series B leads supposed to price our stock with a 3x senior preference overhang?" prompts analytical thinking and collaborative problem-solving instead of power struggles.',
      fr: 'Demander « Comment de futurs leads de Série B pourront-ils pricer notre action avec un tel surplomb de 3x ? » engage la réflexion plutôt que le conflit de pouvoir.',
      zh: '反问“如果顶着3倍优先清算权的重负，下一轮领投方该如何对我们进行合理公允的定价？”能引导对方用分析性思维面对行业通则，而非陷入权力博弈。',
    },
  },

  // SECTION 5: Negotiation & Strategy (10 questions pattern)
  {
    id: 'exam_010',
    number: 10,
    category: 'negotiation',
    difficulty: 'expert',
    question: {
      en: 'When faced with an "Exploding Offer" (term sheet expiring in 48 hours with a strict exclusivity clause), what is the most effective founder counter-strategy?',
      fr: 'Face à une « Offre explosive » (term sheet expirant sous 48 h avec exclusivité stricte), quelle est la contre-stratégie fondatrice la plus efficace ?',
      zh: '面对设定48小时作废时限并附带严苛排他期（No-Shop）的“暴雷型意向书（Exploding Offer）”，创始人最具杀伤力的应对策略是什么？',
    },
    options: [
      {
        en: 'Acknowledge enthusiasm, immediately notify parallel pipeline funds of an active term sheet to accelerate their partnership meetings, while offering the first fund an exclusivity window conditional upon standard NVCA diligence milestones.',
        fr: 'Accuser réception avec enthousiasme, avertir le pipeline parallèle qu’une term sheet est reçue pour précipiter leurs comités, et cadrer l’exclusivité sur des jalons de diligence NVCA.',
        zh: '热情致谢并确认推进意向，同时立刻通知平行管线中的其他深度沟通机构“首份意向书已入池”以倒逼其提前上会；同时与首家机构磋商将排他期与明确的尽调里程碑严格挂钩。',
      },
      {
        en: 'Sign immediately without consulting legal counsel because capital is scarce.',
        fr: 'Signer immédiatement sans avocat car le capital est rare.',
        zh: '由于市场缺钱，立即无条件签署，切勿找外部律师拖延审核。',
      },
      {
        en: 'Ignore the term sheet entirely and cease all communications forever.',
        fr: 'Ignorer totalement l’offre et couper les ponts pour toujours.',
        zh: '完全不予理睬，拉黑投资人并彻底中断一切沟通。',
      },
      {
        en: 'Post the raw term sheet on social media to humiliate the venture firm.',
        fr: 'Publier la term sheet brute sur LinkedIn pour humilier le fonds.',
        zh: '将带有保密条款的未脱敏意向书直接公开发布到社交平台曝光羞辱该机构。',
      },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Exploding deadlines are artificial psychological pressure devices to prevent price discovery. By signaling an active offer to parallel interested funds, the founder transforms manufactured urgency into genuine competitive deal heat.',
      fr: 'Les offres explosives sont des leviers psychologiques visant à bloquer la concurrence. Avertir les autres fonds transforme cette fausse urgence en véritable émulation de marché.',
      zh: '限时作废是投资人防止创始人比价的典型心理压迫手段。通过合规通知其他机构“已有意向书就位”，创始人能够把人为制造的单向恐慌转化为真实多方竞标的市场热度。',
    },
  },
];
