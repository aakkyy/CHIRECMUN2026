// Shared animation primitives — used across all components

export const ease = [0.22, 1, 0.36, 1]

export const spring = { type: 'spring', stiffness: 88, damping: 22 }
export const springFast = { type: 'spring', stiffness: 220, damping: 28 }

// Basic fade-up item (used as a variant child)
export const itemVariant = {
  hidden:   { opacity: 0, y: 32 },
  visible:  { opacity: 1, y: 0, transition: { ...spring } },
}

// Slide from left
export const slideLeft = {
  hidden:   { opacity: 0, x: -48 },
  visible:  { opacity: 1, x: 0, transition: { ...spring } },
}

// Slide from right
export const slideRight = {
  hidden:   { opacity: 0, x: 48 },
  visible:  { opacity: 1, x: 0, transition: { ...spring } },
}

// Container that staggers children
export const stagger = (delay = 0, staggerTime = 0.1) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: staggerTime, delayChildren: delay } },
})

// Viewport options (used in whileInView)
export const viewport = { once: true, margin: '-60px' }
