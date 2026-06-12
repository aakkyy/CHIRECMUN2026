import { useNavigate } from 'react-router-dom'
import styles from './HomeBeacon.module.css'

export default function HomeBeacon() {
  const navigate = useNavigate()

  return (
    <button
      className={styles.beacon}
      onClick={() => navigate('/')}
      aria-label="Back to home"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      <span>Back to Home</span>
    </button>
  )
}
