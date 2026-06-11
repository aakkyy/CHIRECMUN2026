/**
 * CHIREC MUN 2026 Secretariat data
 *
 * Photos: upload to /media/secretariat/{photoSlug}.jpg
 * Descriptions: fill in the description field per member when ready.
 *
 * Levels are ordered TOP → BOTTOM (Co-SG first, Tech last).
 */

export type SecTier = 'sg' | 'dg' | 'cda' | 'hoc' | 'usg'

export interface SecretariatMember {
  id: string
  role: string
  tier: SecTier
  /** Upload photo to /media/secretariat/{photoSlug}.jpg */
  photoSlug: string
  /** Fill this in when ready — shows in the click modal */
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
      { id: 'co-sg-1', role: 'Co-Secretary General', tier: 'sg', photoSlug: 'co-sg-1', description: '' },
      { id: 'co-sg-2', role: 'Co-Secretary General', tier: 'sg', photoSlug: 'co-sg-2', description: '' },
    ],
  },
  {
    levelId: 'dg',
    levelTitle: 'Director General',
    members: [
      { id: 'dg', role: 'Director General', tier: 'dg', photoSlug: 'director-general', description: '' },
    ],
  },
  {
    levelId: 'cda',
    levelTitle: "Chargé D'Affaires",
    members: [
      { id: 'cda', role: "Chargé D'Affaires", tier: 'cda', photoSlug: 'charge-daffaires', description: '' },
    ],
  },
  {
    levelId: 'head-oc',
    levelTitle: 'Head of Organizing Committee',
    members: [
      { id: 'head-oc-1', role: 'Head of OC', tier: 'hoc', photoSlug: 'head-oc-1', description: '' },
      { id: 'head-oc-2', role: 'Head of OC', tier: 'hoc', photoSlug: 'head-oc-2', description: '' },
    ],
  },
  {
    levelId: 'usg-policy',
    levelTitle: 'USG of Policy',
    members: [
      { id: 'usg-policy-1', role: 'USG of Policy', tier: 'usg', photoSlug: 'usg-policy-1', description: '' },
      { id: 'usg-policy-2', role: 'USG of Policy', tier: 'usg', photoSlug: 'usg-policy-2', description: '' },
    ],
  },
  {
    levelId: 'usg-dr',
    levelTitle: 'USG of Delegate Relations',
    members: [
      { id: 'usg-dr-1', role: 'USG of Delegate Relations', tier: 'usg', photoSlug: 'usg-delegate-relations-1', description: '' },
      { id: 'usg-dr-2', role: 'USG of Delegate Relations', tier: 'usg', photoSlug: 'usg-delegate-relations-2', description: '' },
    ],
  },
  {
    levelId: 'usg-logistics',
    levelTitle: 'USG of Logistics',
    members: [
      { id: 'usg-log-1', role: 'USG of Logistics', tier: 'usg', photoSlug: 'usg-logistics-1', description: '' },
      { id: 'usg-log-2', role: 'USG of Logistics', tier: 'usg', photoSlug: 'usg-logistics-2', description: '' },
    ],
  },
  {
    levelId: 'usg-finance',
    levelTitle: 'USG of Finance',
    members: [
      { id: 'usg-fin-1', role: 'USG of Finance', tier: 'usg', photoSlug: 'usg-finance-1', description: '' },
      { id: 'usg-fin-2', role: 'USG of Finance', tier: 'usg', photoSlug: 'usg-finance-2', description: '' },
    ],
  },
  {
    levelId: 'usg-sponsorships',
    levelTitle: 'USG of Sponsorships',
    members: [
      { id: 'usg-spon-1', role: 'USG of Sponsorships', tier: 'usg', photoSlug: 'usg-sponsorships-1', description: '' },
      { id: 'usg-spon-2', role: 'USG of Sponsorships', tier: 'usg', photoSlug: 'usg-sponsorships-2', description: '' },
    ],
  },
  {
    levelId: 'usg-marketing',
    levelTitle: 'USG of Marketing',
    members: [
      { id: 'usg-mkt-1', role: 'USG of Marketing', tier: 'usg', photoSlug: 'usg-marketing-1', description: '' },
      { id: 'usg-mkt-2', role: 'USG of Marketing', tier: 'usg', photoSlug: 'usg-marketing-2', description: '' },
    ],
  },
  {
    levelId: 'usg-design',
    levelTitle: 'USG of Design',
    members: [
      { id: 'usg-des-1', role: 'USG of Design', tier: 'usg', photoSlug: 'usg-design-1', description: '' },
      { id: 'usg-des-2', role: 'USG of Design', tier: 'usg', photoSlug: 'usg-design-2', description: '' },
    ],
  },
  {
    levelId: 'usg-technology',
    levelTitle: 'USG of Technology',
    members: [
      { id: 'usg-tech-1', role: 'USG of Technology', tier: 'usg', photoSlug: 'usg-technology-1', description: '' },
      { id: 'usg-tech-2', role: 'USG of Technology', tier: 'usg', photoSlug: 'usg-technology-2', description: '' },
    ],
  },
]
