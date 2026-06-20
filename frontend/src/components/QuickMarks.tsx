import styles from './QuickMarks.module.css'

const MARKS = [
  'Edition XIV',
  '13 Committees',
  '600+ Delegates',
  'July 31 – August 2, 2026',
  'CHIREC International School',
  'Hyderabad, India',
  'Represent · Reason · Resolve',
  '3 Days of Diplomacy',
  'Founded 2012',
]

const CheckIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function QuickMarks() {
  return (
    <div className={styles.strip} aria-hidden="true">
      <div className={styles.track}>
        {[...MARKS, ...MARKS].map((mark, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.check}><CheckIcon /></span>
            {mark}
          </span>
        ))}
      </div>
    </div>
  )
}
