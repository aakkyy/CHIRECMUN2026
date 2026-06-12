/**
 * CHIREC MUN 2026 Secretariat data
 *
 * Photos: upload to /media/secretariat/{photoSlug}.jpg
 * Levels are ordered TOP → BOTTOM (Co-SG first, Tech last).
 */

export type SecTier = 'sg' | 'dg' | 'cda' | 'hoc' | 'usg'

export interface SecretariatMember {
  id: string
  role: string
  tier: SecTier
  /** Upload photo to /media/secretariat/{photoSlug}.jpg */
  photoSlug: string
  description: string
}

export interface SecretariatLevel {
  levelId: string
  levelTitle: string
  members: SecretariatMember[]
}

export const SECRETARIAT_LEVELS: SecretariatLevel[] = [
  {
    levelId: 'co-sg',
    levelTitle: 'Co-Secretary General',
    members: [
      {
        id: 'co-sg-1', role: 'Co-Secretary General', tier: 'sg', photoSlug: 'co-sg-1',
        description: `Whether he's discussing a new business idea, analysing a cricket match or planning the next big conference detail, Dev is someone who genuinely enjoys taking on new challenges and working with people. Having experienced MUN as a delegate, OC member, and USG, he is thrilled now to serve as the Co-Secretary General of this year's conference. For Dev, MUN has always been more than just debate, it's about connections, teamwork and creating an environment where every delegate feels challenged and inspired. He is looking forward to shaping a conference filled with meaningful discussions, unforgettable moments and an experience that everyone a part of this edition of CHIREC MUN, will truly enjoy.`,
      },
      {
        id: 'co-sg-2', role: 'Co-Secretary General', tier: 'sg', photoSlug: 'co-sg-2',
        description: `Anusha Anchlia is a 12th grader at Chirec International School, Kondapur, studying Commerce with Mathematics. Since beginning her MUN journey in 2021, she has participated in nearly 20 conferences, delegating in a wide range of committees. Anusha also serves as Secretary of her school's Interact Club. In her free time, she loves to read books, listen to music and audiobooks, fill her scrapbook, attempt (and often fail) to bake the perfect chocolate chip cookies, and binge-watch her favourite TV shows for the fifth time. Having been part of Chirec MUN as a delegate, OC member, Executive Board member, and member of the secretariat, she now returns as Secretary-General for the second time. As Secretary-General for CHIREC MUN 2026, she aims to work tirelessly to make this edition the most impactful and memorable one yet.`,
      },
    ],
  },
  {
    levelId: 'dg',
    levelTitle: 'Director General',
    members: [
      {
        id: 'dg', role: 'Director General', tier: 'dg', photoSlug: 'director-general',
        description: `Having served as a Delegate, IP, OC, USG and now Director General, Anika has experienced MUN from every side of a conference and is excited to bring those experiences into this year's edition. Currently a DP2 student and aspiring pharmacologist, you'll usually find her between experiments in the chemistry lab, working on her research, meeting new people, or taking on one project too many. If she's not doing any of the above, she's probably watching a cricket match or revisiting one of her favourite TFI movies. She looks forward to working alongside the Secretariat and OC to make this conference an engaging and memorable experience for all participants.`,
      },
    ],
  },
  {
    levelId: 'cda',
    levelTitle: "Chargé D'Affaires",
    members: [
      {
        id: 'cda', role: "Chargé D'Affaires", tier: 'cda', photoSlug: 'charge-daffaires',
        description: `From driving down the court to driving the debate floor, Arnav has a dozen conferences under his belt. Taking Physics, Chemistry and Maths AA at Higher Level in the IB diploma, he is aspiring for a strong future in aerospace engineering. When he isn't engrossed in following the Lakers or rewatching Suits for the zillionth time, you can find him listening to music or getting into an argument with someone over the smallest things. While playing the piano and annoying others are his two biggest sidequests, he can prove to be surprising when you least expect it. He is truly excited for having you all and making this conference a grand success!`,
      },
    ],
  },
  {
    levelId: 'head-oc',
    levelTitle: 'Head of Organizing Committee',
    members: [
      {
        id: 'head-oc-1', role: 'Head of OC', tier: 'hoc', photoSlug: 'head-oc-1',
        description: `Aditi is an IBDP Year 2 student studying Math, Biology, and Chemistry at a higher level. If you know Aditi, you know that when she's not squeezing in a nap, she's probably listening to music or meeting friends. Approachable and always willing to help, she thrives on collaboration and never backs down from a challenge. With her love for connecting with people and making the most of every opportunity, she's thrilled to make this MUN the best yet. As Head of OC for this year's edition, she can't wait to work with her team and bring CMUN to life!`,
      },
      {
        id: 'head-oc-2', role: 'Head of OC', tier: 'hoc', photoSlug: 'head-oc-2',
        description: `Dakshita is a Grade 12 CBSE Commerce student pursuing Accountancy. When she's not busy with numbers, you can find her rewatching her favourite shows, working on her latest art piece, or on the basketball court. A firm believer that fries and naps can solve most problems, she brings creativity, dedication, and enthusiasm to everything she does. She's thrilled to be a part of the Secretariat and looks forward to making CHIRECMUN 2026 an unforgettable experience!`,
      },
    ],
  },
  {
    levelId: 'usg-policy',
    levelTitle: 'USG of Policy',
    members: [
      {
        id: 'usg-policy-1',
        role: 'USG of Policy',
        tier: 'usg',
        photoSlug: 'usg-policy-1',
        description: `Yashraj is a DP2 student at Chirec, pursuing Global Politics, English, and Economics at higher levels. A confident speaker, he has a deep passion for debate and thrives at MUNs, having attended 10+ conferences in various capacities. When he's not searching for articles on an obscure conflict or spewing economic jargon, you can find him dedicating extensive time and effort to understanding astrophysics, playing the drums, or listening to metal music. He is thrilled to take on this role and is committed to making this year's CHIREC MUN a conference worth remembering.`,
      },
      {
        id: 'usg-policy-2',
        role: 'USG of Policy',
        tier: 'usg',
        photoSlug: 'usg-policy-2',
        description: `Sharvina is a Grade 12 student with a keen interest in Math, Physics, and Chemistry — known for her discipline, focus, and steady work ethic. Curious by nature and a debater at heart, she loves learning, meeting new people, and challenging her own boundaries. Outside the classroom, she enjoys playing tennis, reading, and researching just about anything that sparks her interest. Sharvina is thrilled to serve as the USG Policy for the 14th edition of CHIRECMUN, and looks forward to bringing her clarity and precision to make it a memorable experience for everyone.`,
      },
    ],
  },
  {
    levelId: 'usg-dr',
    levelTitle: 'USG of Delegate Relations',
    members: [
      {
        id: 'usg-dr-1',
        role: 'USG of Delegate Relations',
        tier: 'usg',
        photoSlug: 'usg-delegate-relations-1',
        description: `Chaitra is an IBDP Year 2 student studying Global Politics, Economics, and Mathematics at a higher level. Aspiring to be a lawyer, she's not nearly as serious as you'd think. You'll probably spot her giggling or laughing and keeping the mood light always — she's a people person through and through. When she's not busy debating her opinions with others or drafting emails for extensions, she's swimming laps, catching up on her favourite sports, or rewatching Game of Thrones. Dedicated and approachable, she's ready to make CHIREC MUN '26 a memorable experience for every delegate.`,
      },
      {
        id: 'usg-dr-2',
        role: 'USG of Delegate Relations',
        tier: 'usg',
        photoSlug: 'usg-delegate-relations-2',
        description: `Aisha is a 12th CBSE student with a strong passion for Economics and Mathematics. When she's not sending out emails or calling delegates, she enjoys reading, doodling in her sketchbook, going for runs, and rewatching her favourite TV shows. Organized, reliable, and approachable, she is excited to ensure that your CHIREC MUN experience is seamless, engaging, and memorable.`,
      },
    ],
  },
  {
    levelId: 'usg-logistics',
    levelTitle: 'USG of Logistics',
    members: [
      {
        id: 'usg-log-1',
        role: 'USG of Logistics',
        tier: 'usg',
        photoSlug: 'usg-logistics-1',
        description: `Abhigna is an IBDP Year 2 student studying Mathematics, Physics, and Economics at Higher Level. Known for her liveliness, enthusiasm, and ability to connect with people, she brings energy and dedication to everything she takes on. When she's not binge-watching Brooklyn Nine-Nine, taking a "quick" power nap, or planning her daily side quest, you'll find her trying to finish her never-ending to-do list while organizing events, turning ideas into reality. She approaches every task with commitment, attention to detail, and a determination to get things done. As USG Logistics, she looks forward to helping make CHIREC MUN XIV a memorable and impactful experience for all.`,
      },
      {
        id: 'usg-log-2',
        role: 'USG of Logistics',
        tier: 'usg',
        photoSlug: 'usg-logistics-2',
        description: `Sourabhi is a grade 12 student studying business, accountancy and economics. Known for her optimism, excitement and punctuality, she approaches every task with utmost dedication. When she's not going on a run or vibing to a new song to sing, you'll find her enthusiastically planning and organising her never ending endeavours. A passionate kathak dancer at heart, she has an eye for detail and expression. She's thrilled to be serving as USG Logistics this year and is committed to making this edition a truly unforgettable experience.`,
      },
    ],
  },
  {
    levelId: 'usg-finance',
    levelTitle: 'USG of Finance',
    members: [
      {
        id: 'usg-fin-1',
        role: 'USG of Finance',
        tier: 'usg',
        photoSlug: 'usg-finance-1',
        description: `Srishti's mind is usually occupied by music, movies, and the constant reminder that she should probably be studying. She loves exploring new places, meeting new people, and taking on new experiences. As the USG of Finance, she finally has a use for all those math classes. She's excited to contribute to the conference and make loads of memories along the way!`,
      },
      {
        id: 'usg-fin-2',
        role: 'USG of Finance',
        tier: 'usg',
        photoSlug: 'usg-finance-2',
        description: `A Grade 12 science student, Nanditha loves playing tennis, catching up on movies and TV shows like Suits, and taking naps whenever she gets the chance. Calm, dependable, and organised, she's excited to work behind the scenes as part of the Secretariat and help make this edition of CHIREC MUN a memorable one!`,
      },
    ],
  },
  {
    levelId: 'usg-sponsorships',
    levelTitle: 'USG of Sponsorships',
    members: [
      {
        id: 'usg-spon-1',
        role: 'USG of Sponsorships',
        tier: 'usg',
        photoSlug: 'usg-sponsorships-1',
        description: `An IBDP Year 1 student with a passion for business, networking, and sponsorships, Gautham is determined to bring creativity, ambition, and strong partnerships to CHIREC MUN. Beyond academics, he's a massive car enthusiast and a die-hard Balayya fan. His love for Nandamuri Balakrishna runs deep — and yes, the Veera Simha Reddy entry scene is always on repeat. Whether he's talking cars, sponsorships, or iconic Balayya moments, he's ready to help make CHIREC MUN a grand success!`,
      },
      {
        id: 'usg-spon-2',
        role: 'USG of Sponsorships',
        tier: 'usg',
        photoSlug: 'usg-sponsorships-2',
        description: `Dakshita Reddy is a quiet observer to most, but a lively chatterbox with those she's close to. As a passionate football player, she brings that same energy and team spirit into her friendships — loyal, thoughtful, and easy to connect with. Her strong instincts and caring nature make her great at building meaningful relations and connections. She balances it all with a focused attitude towards her studies, always aiming to grow both on and off the field.`,
      },
    ],
  },
  {
    levelId: 'usg-marketing',
    levelTitle: 'USG of Marketing',
    members: [
      {
        id: 'usg-mkt-1',
        role: 'USG of Marketing',
        tier: 'usg',
        photoSlug: 'usg-marketing-1',
        description: `Hetvika is an IBDP Year 2 student studying Higher Level Math, Biology, and Chemistry. Known for her creativity, determination, and sharp problem-solving, she brings a fresh perspective to everything she works on. When she's not brainstorming marketing ideas, you'll find her watching her favourite shows, playing volleyball, or defending her right to sleep like it's a competitive sport. No matter the task, Hetvika shows up with intention and energy, always pushing for something better. Committed to challenges and never afraid to experiment with new ideas, she's determined to make this year's CHIREC MUN not just memorable — but the best one yet.`,
      },
      {
        id: 'usg-mkt-2',
        role: 'USG of Marketing',
        tier: 'usg',
        photoSlug: 'usg-marketing-2',
        description: `Bhavya is a Class 12 CBSE student in the science stream, known for her optimism, creativity, and having an opinion on almost everything. When she's not capturing moments on her camera roll or watching Julai for the millionth time, you'll find her listening to music, talking about how One Tree Hill changed her life, or hunting for new restaurants to try. From brainstorming campaigns to creating content that stands out, she looks forward to making this year's MUN a conference people won't stop talking about long after it's over!`,
      },
    ],
  },
  {
    levelId: 'usg-design',
    levelTitle: 'USG of Design',
    members: [
      {
        id: 'usg-des-1',
        role: 'USG of Design',
        tier: 'usg',
        photoSlug: 'usg-design-1',
        description: `Anwita is an IB Year 2 student pursuing Visual Arts, Physics, and Math AA at the Higher Level. She's behind this year's CMUN design, turning ideas into visuals that speak louder than words. Aspiring to become a top architect, Anwita dreams of designing skylines that people can't stop staring at. When she's not bringing her creative visions to life, you'll find her on the volleyball court, trying out new places to eat, napping with her dog, or planning the next addition to her ever-growing collection of design ideas. With her ability to pull all-nighters and somehow still come up with new design ideas the next morning, Anwita is ready to give her all to make this year's CMUN the best one yet!`,
      },
      {
        id: 'usg-des-2',
        role: 'USG of Design',
        tier: 'usg',
        photoSlug: 'usg-design-2',
        description: `Yukti is a CBSE grade 12 student studying Maths, Physics, and Chemistry who hopes to pursue fashion design. She's an avid reader, and when her nose isn't buried in a book you can find her listening to music, scribbling in a sketchbook, or hanging out with her friends. She is delighted to be a part of this team and can't wait to meet you all at CHIRECMUN '26!`,
      },
    ],
  },
  {
    levelId: 'usg-technology',
    levelTitle: 'USG of Technology',
    members: [
      {
        id: 'usg-tech-1',
        role: 'USG of Technology',
        tier: 'usg',
        photoSlug: 'usg-technology-1',
        description: `Balancing Physics, Math, and Business at Higher Level in DP2, Akshaj is someone who enjoys both problem-solving and staying involved in everything happening around him. When he's not busy coding or working on tech-related projects, you'll probably find him at the cricket nets, passionately supporting SRH. As this year's USG Tech, Akshaj is excited to contribute behind the scenes and help ensure CHIRECMUN runs as smoothly and efficiently as possible.`,
      },
      {
        id: 'usg-tech-2',
        role: 'USG of Technology',
        tier: 'usg',
        photoSlug: 'usg-technology-2',
        description: `Aditi Haasini is a Grade 12 student with a keen interest in all things STEM. She enjoys exploring new ideas and spending her time tinkering with different projects and technologies. Outside of academics, she loves watching movies and binge-reading books. Haasini is delighted to be part of this opportunity and is committed to giving her very best to help make this conference a great success.`,
      },
    ],
  },
]
