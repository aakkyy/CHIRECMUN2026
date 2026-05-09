import { useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode, Ref } from 'react'
import styles from './BlobButton.module.css'

type BlobVariant = 'red' | 'blue'

interface BlobButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  variant?: BlobVariant
}

function makeGradient(variant: BlobVariant, x: number, intense: boolean): string {
  if (variant === 'red') {
    return intense
      ? `radial-gradient(circle closest-side at ${x}% 50%, rgba(255,255,255,1) 0%, rgba(215,238,255,0.99) 6%, rgba(100,175,255,0.96) 18%, rgba(45,118,255,0.72) 38%, rgba(12,55,230,0.32) 62%, transparent 100%)`
      : `radial-gradient(circle closest-side at ${x}% 50%, rgba(255,255,255,0.96) 0%, rgba(185,220,255,0.88) 12%, rgba(80,155,255,0.58) 32%, rgba(22,72,235,0.22) 60%, transparent 100%)`
  }
  return intense
    ? `radial-gradient(circle closest-side at ${x}% 50%, rgba(255,255,255,1) 0%, rgba(255,234,190,0.99) 6%, rgba(255,148,42,0.96) 18%, rgba(255,65,8,0.72) 38%, rgba(208,14,0,0.32) 62%, transparent 100%)`
    : `radial-gradient(circle closest-side at ${x}% 50%, rgba(255,255,255,0.96) 0%, rgba(255,205,125,0.88) 12%, rgba(255,92,22,0.58) 32%, rgba(198,16,0,0.22) 60%, transparent 100%)`
}

export default function BlobButton({ children, href, onClick, className = '', variant = 'red' }: BlobButtonProps) {
  const innerRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const [posX, setPosX]   = useState(22)
  const [hovered, setHov] = useState(false)

  const onMove = (e: MouseEvent) => {
    if (!innerRef.current) return
    const r = innerRef.current.getBoundingClientRect()
    setPosX(((e.clientX - r.left) / r.width) * 100)
  }

  const x = hovered ? posX : 22

  const outerGlowStyle: CSSProperties = {
    background: makeGradient(variant, x, hovered),
    transition: hovered ? 'background 0.06s linear' : 'background 0.65s ease',
  }

  const innerGlowStyle: CSSProperties = {
    background: makeGradient(variant, x, hovered),
    transition: hovered ? 'background 0.06s linear' : 'background 0.65s ease',
    filter: hovered ? 'blur(1px) brightness(1.3) saturate(1.5)' : 'blur(0.5px) brightness(1.08)',
  }

  const eventProps = {
    onMouseMove: onMove,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    onClick,
  }

  const innerContent = (
    <>
      <span style={innerGlowStyle} className={`${styles.innerGlow} ${hovered ? styles.innerGlowActive : ''}`} aria-hidden="true" />
      <span className={styles.content}>{children}</span>
    </>
  )

  return (
    <div className={styles.outer}>
      <span style={outerGlowStyle} className={`${styles.outerGlow} ${hovered ? styles.outerGlowActive : ''}`} aria-hidden="true" />
      {href ? (
        <a ref={innerRef as Ref<HTMLAnchorElement>} href={href} className={`${styles.inner} ${className}`} {...eventProps}>
          {innerContent}
        </a>
      ) : (
        <button ref={innerRef as Ref<HTMLButtonElement>} className={`${styles.inner} ${className}`} {...eventProps}>
          {innerContent}
        </button>
      )}
    </div>
  )
}
