export type CommitteeType = 'ga' | 'security' | 'specialized' | 'crisis' | 'press'

export interface Committee {
  id: string
  abbr: string
  name: string
  category: string
  type: CommitteeType
}

export const COMMITTEES: Committee[] = [
  { id: 'disec',    abbr: 'DISEC',  name: 'Disarmament and International Security Committee', category: 'General Assembly',      type: 'ga' },
  { id: 'unhrc',    abbr: 'UNHRC',  name: 'United Nations Human Rights Council',              category: 'Human Rights',          type: 'ga' },
  { id: 'who',      abbr: 'WHO',    name: 'World Health Organization',                        category: 'Specialized Agency',    type: 'specialized' },
  { id: 'unctad',   abbr: 'UNCTAD', name: 'UN Conference on Trade and Development',           category: 'Trade & Development',   type: 'specialized' },
  { id: 'loksabha', abbr: 'LS',     name: 'Lok Sabha',                                        category: 'National Legislature',  type: 'crisis' },
  { id: 'unsc',     abbr: 'UNSC',   name: 'United Nations Security Council',                  category: 'Security Council',      type: 'security' },
  { id: 'unodc',    abbr: 'UNODC',  name: 'UN Office on Drugs and Crime',                     category: 'Specialized Agency',    type: 'specialized' },
  { id: 'copuos',   abbr: 'COPUOS', name: 'Committee on the Peaceful Uses of Outer Space',    category: 'Specialized Committee', type: 'specialized' },
  { id: 'ec',       abbr: 'EC',     name: 'European Council',                                 category: 'Regional Body',         type: 'crisis' },
  { id: 'jcc',      abbr: 'JCC',    name: 'Joint Crisis Cabinet',                             category: 'Crisis Committee',      type: 'crisis' },
  { id: 'sci',      abbr: 'SCI',    name: 'Supreme Court of India',                           category: 'Legal Body',            type: 'crisis' },
  { id: 'bcci',     abbr: 'BCCI',   name: 'Board of Control for Cricket in India',            category: 'Specialized Committee', type: 'crisis' },
  { id: 'ip-r',     abbr: 'IP',     name: 'International Press — Reporters',                  category: 'Press Corps',           type: 'press' },
  { id: 'ip-p',     abbr: 'IP',     name: 'International Press — Photojournalists',           category: 'Press Corps',           type: 'press' },
]

export const TYPE_COLORS: Record<CommitteeType, string> = {
  ga:          'rgba(192,57,43,',
  security:    'rgba(139,0,0,',
  specialized: 'rgba(12,38,172,',
  crisis:      'rgba(140,30,10,',
  press:       'rgba(80,80,80,',
}

export const TYPE_LABELS: Record<CommitteeType, string> = {
  ga:          'General Assembly',
  security:    'Security Council',
  specialized: 'Specialized Agency',
  crisis:      'Crisis Committee',
  press:       'Press Corps',
}
