import { motion } from 'framer-motion'
import type { ReactNode, Ref } from 'react'
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
  const inner = href ? (
    <a href={href} className={`${styles.inner} ${className}`} onClick={onClick}>
      {children}
    </a>
  ) : (
    <button className={`${styles.inner} ${className}`} onClick={onClick}>
      {children}
    </button>
  )

  return (
    <motion.div
      className={styles.outer}
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ y: 0, scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22, mass: 0.8 }}
    >
      {inner}
    </motion.div>
  )
}
