import styles from './CommitteeMarquee.module.css'

const ROW_1 = [
  'DISEC', 'UNSC', 'UNHRC', 'ECOFIN', 'UNODC',
  'WHO', 'COPUOS', 'Historical Crisis Committee', 'Joint Crisis Cabinet',
  'UNEP', 'Human Rights Council', 'Security Council', 'General Assembly',
]

const ROW_2 = [
  'Special Committee', 'UNFCCC', 'International Court', 'DISEC', 'UNODC',
  'WHO', 'Economic Forum', 'UNSC', 'Press Corps', 'COPUOS',
  'UNHRC', 'Crisis Cabinet', 'ECOFIN', 'Historical Crisis',
]

function MarqueeRow({ items, reverse, accent }: { items: string[]; reverse?: boolean; accent?: boolean }) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items]
  return (
    <div className={styles.rowWrap}>
      <div className={`${styles.track} ${reverse ? styles.trackReverse : ''}`}>
        {doubled.map((name, i) => (
          <span key={i} className={`${styles.pill} ${accent ? styles.pillAccent : ''}`}>
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function CommitteeMarquee() {
  return (
    <section className={styles.section}>
      <div className={styles.topBorder} aria-hidden="true" />
      <div className={styles.fadeLeft}  aria-hidden="true" />
      <div className={styles.fadeRight} aria-hidden="true" />
      <div className={styles.rows}>
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse accent />
      </div>
      <div className={styles.bottomBorder} aria-hidden="true" />
    </section>
  )
}
