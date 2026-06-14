import styles from './BottomBar.module.css'
import QuickMarks from './QuickMarks'

export default function BottomBar() {
  return (
    <>
      <QuickMarks />
      <div className={styles.bar}>
        <span className={styles.copy}>
          &copy; 2026 <span className={styles.brand}>CHIREC <span className={styles.brandRed}>International</span> School</span>
        </span>
        <span className={styles.credits}>
          Developed by{' '}
          <a href="https://instagram.com/akshajvelpula" target="_blank" rel="noopener noreferrer" className={styles.devLink}>Akshaj Velpula</a>
          {' '}&amp;{' '}
          <a href="https://instagram.com/tirumalai.aditya" target="_blank" rel="noopener noreferrer" className={styles.devLink}>Aditya Tirumalai</a>
        </span>
        <span className={styles.tagline}>
          Edition XIV <span className={styles.dot}>&bull;</span> Represent. Reason. Resolve.
        </span>
      </div>
    </>
  )
}
