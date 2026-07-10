export interface CommitteeAgenda {
  items: string[]
  classified?: boolean
}

export const AGENDAS: Record<string, CommitteeAgenda> = {
  who: {
    items: [
      'Deliberating measures to strengthen global pandemic preparedness and response mechanisms, with emphasis on state sovereignty, equitable access, and emergency coordination.',
    ],
  },
  disec: {
    items: [
      'Developing International Frameworks to Regulate the Military Application of Artificial Intelligence and Lethal Autonomous Weapons Systems (LAWS).',
    ],
  },
  unhrc: {
    items: [
      'Examining the Human Rights Implications of Climate Change and Environmental Displacement',
    ],
  },
  unodc: {
    items: [
      'Discussion on Strengthening International Responses to State-Enabled Organized Crime',
    ],
  },
  loksabha: {
    items: [
      "Deliberation on the implementation of the Women's Reservation Act, 2023, with special emphasis on the Constitution (One Hundred and Thirty-first Amendment) Bill, 2026, and its implications for women's political representation in India.",
    ],
  },
  ec: {
    items: [
      "Reassessing Europe's Strategic Security Partnerships Amid Evolving Geopolitical and Security Challenges",
    ],
  },
  copuos: {
    items: [
      'Scientific and Technical Subcommittee (STSC): Dark and quiet skies, astronomy and large constellations: addressing emerging issues and challenges.',
      'Legal Subcommittee (LSC): Status and application of the five United Nations treaties on outer space, and ways and means, including capacity-building, to promote their implementation.',
    ],
  },
  unctad: {
    items: [
      'Meeting of the First Committee of the United Nations Conference on Trade and Development - 1964.',
    ],
  },
  sci: {
    items: [
      '"ASSENT, WITHHOLDING OR RESERVATION OF BILLS BY THE GOVERNOR AND THE PRESIDENT OF INDIA. (THE STATE OF TAMIL NADU V. THE GOVERNOR OF TAMILNADU & ANR) "',
    ],
  },
  unsc: {
    items: [
      'Children, technology, and education in conflict',
    ],
  },
  bcci: {
    items: [
      'Deliberating on the effect of the "Impact Player" rule on regional cricket and its future implementation in other leagues beyond the IPL',
      'Discussing reforms and expansions to global franchise cricket with an emphasis on improving tournament conditions and private ownership',
      'Deliberating on the current auction and retention system used in franchise cricket and discussing potential changes to improve it',
    ],
  },
  'jcc-1': { items: [], classified: true },
  'jcc-2': { items: [], classified: true },
}
