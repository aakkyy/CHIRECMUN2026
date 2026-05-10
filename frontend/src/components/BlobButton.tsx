import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import styles from './BlobButton.module.css'

type BlobVariant = 'red' | 'blue'

interface BlobButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  variant?: BlobVariant
}

export default function BlobButton({
  children,
  href,
  onClick,
  className = '',
  variant: _variant = 'red',
}: BlobButtonProps) {
  const isInternal = href && href.startsWith('/')
  const inner = href ? (
    isInternal
      ? <Link to={href} className={`${styles.inner} ${className}`} onClick={onClick}>{children}</Link>
      : <a href={href} className={`${styles.inner} ${className}`} onClick={onClick}>{children}</a>
  ) : (
    <button className={`${styles.inner} ${className}`} onClick={onClick}>
      {children}
    </button>
  )

  const underlineCls = _variant === 'blue'
    ? `${styles.underline} ${styles.underlineBlue}`
    : `${styles.underline} ${styles.underlineRed}`

  return (
    <motion.div
      className={styles.outer}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22, mass: 0.8 }}
    >
      {inner}
      <span className={underlineCls} aria-hidden="true" />
    </motion.div>
  )
}
