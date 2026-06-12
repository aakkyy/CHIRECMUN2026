import { useNavigate } from 'react-router-dom'
import styles from './HomeBeacon.module.css'

export default function HomeBeacon() {
  const navigate = useNavigate()

  return (
    <div className={styles.wrap}>
      <button
        className={styles.beacon}
        onClick={() => navigate('/')}
        aria-label="Back to home"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        <span>Back to Home</span>
      </button>
    </div>
  )
}
