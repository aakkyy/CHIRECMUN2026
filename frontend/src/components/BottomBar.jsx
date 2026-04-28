import styles from './BottomBar.module.css'

export default function BottomBar() {
  return (
    <div className={styles.bar}>
      <span>&copy; 2026 CHIREC Model United Nations</span>
      <span>
        Developed by{' '}
        <a href="https://instagram.com/akshajvelpula" target="_blank" rel="noopener noreferrer" className={styles.devLink}>Akshaj Velpula</a>
        {' '}&amp;{' '}
        <a href="https://instagram.com/tirumalai.aditya" target="_blank" rel="noopener noreferrer" className={styles.devLink}>Aditya Tirumalai</a>
      </span>
      <span>Edition XIV &nbsp;&bull;&nbsp; Represent. Reason. Resolve.</span>
    </div>
  )
}
