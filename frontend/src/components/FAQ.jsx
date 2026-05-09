import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './FAQ.module.css'
import AnimatedBg from './AnimatedBg'
import { viewport } from '../lib/motion'

const faqs = [
  {
    q: 'What is an MUN?',
    a: 'A Model United Nations (MUN) is an educational simulation of the United Nations where students take on the roles of delegates representing different countries. Participants research global issues, debate policies, and collaborate on resolutions, building skills in public speaking, diplomacy, critical thinking, and leadership.',
  },
  {
    q: 'What forms must be signed prior to the conference?',
    a: 'The liability and tech release form are mandatory to be filled prior to the conference. All delegates are also required to read the code of conduct thoroughly before attending.',
  },
  {
    q: 'Will there be transport provided?',
    a: 'Coming soon.',
    soon: true,
  },
  {
    q: 'What food options are available for delegates?',
    a: 'Delegates can buy food from stalls, but school lunch will also be provided for free.',
  },
  {
    q: 'What is the dress code that must be followed?',
    a: 'Delegates must wear formal clothing on Day 1 and Day 3 of the conference. Skirts, dresses, and sleeveless attire are not allowed. Traditional clothing may be worn on Day 2. Please check the guidelines that will be posted later for further details.',
  },
  {
    q: 'Where is the event occurring?',
    a: 'The event will be held at the new CHIREC ISRP Campus in Serilingampally.',
  },
  {
    q: 'Will on-spot registrations be available?',
    a: 'Coming soon.',
    soon: true,
  },
  {
    q: 'Will cameras be provided to IP photographers?',
    a: 'No, IP photographers are required to carry their own cameras.',
  },
  {
    q: 'Is there a social night?',
    a: 'Yes, there will be a social night following the last committee session on Day 2.',
  },
]

function FAQItem({ faq, isOpen, onToggle, index }) {
  return (
    <motion.div
      className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ type: 'spring', stiffness: 80, damping: 20, delay: index * 0.05 }}
    >
      <button className={styles.question} onClick={onToggle} aria-expanded={isOpen}>
        <span className={styles.qText}>{faq.q}</span>
        <motion.span
          className={styles.chevron}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={styles.answer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <p className={`${styles.aText} ${faq.soon ? styles.soon : ''}`}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className={`section ${styles.section}`} id="faq" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(4,3,8,0.72) 0%, rgba(4,3,8,0.65) 100%)', zIndex: 0, pointerEvents: 'none' }} />
      <AnimatedBg variant="red" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.p className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        >Got Questions?</motion.p>

        <motion.h2 className={styles.title}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.07 }}
        >Frequently Asked Questions</motion.h2>

        <div className={styles.list}>
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
