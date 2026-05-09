import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'
import styles from './ComingSoonPage.module.css'

const schemes = {
  '/team':       { blob1: 'rgba(139,29,29,0.60)',  blob2: 'rgba(26,41,128,0.22)' },
  '/committees': { blob1: 'rgba(100,18,18,0.65)',  blob2: 'rgba(21,67,96,0.26)'  },
  '/guidelines': { blob1: 'rgba(174,48,36,0.58)',  blob2: 'rgba(14,42,71,0.28)'  },
  '/schedule':   { blob1: 'rgba(91,25,45,0.62)',   blob2: 'rgba(13,27,55,0.32)'  },
}

export default function ComingSoonPage() {
  const { pathname } = useLocation()
  const s = schemes[pathname] || schemes['/team']

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      <div
        className={styles.blob1}
        style={{ background: `radial-gradient(ellipse at 25% 35%, ${s.blob1} 0%, transparent 65%)` }}
      />
      <div
        className={styles.blob2}
        style={{ background: `radial-gradient(ellipse at 82% 78%, ${s.blob2} 0%, transparent 55%)` }}
      />

      <Navbar />

      <div className={styles.center}>
        <h1 className={styles.headline}>COMING SOON...</h1>
        <p className={styles.sub}>Stay Tuned</p>
      </div>

      <BottomBar />
    </div>
  )
}
