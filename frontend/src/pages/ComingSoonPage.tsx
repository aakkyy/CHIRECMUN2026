import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'
import styles from './ComingSoonPage.module.css'

export default function ComingSoonPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.center}>
        <h1 className={styles.headline}>COMING SOON</h1>
        <p className={styles.sub}>Stay Tuned</p>
      </div>
      <BottomBar />
    </div>
  )
}
