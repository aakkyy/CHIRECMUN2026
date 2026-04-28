import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './FAQPage.module.css'
import AnimatedBg from '../components/AnimatedBg'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'

const faqs = [
  {
    q: 'What is an MUN?',
    a: 'A Model United Nations (MUN) is an educational simulation of the United Nations where students take on the roles of delegates representing different countries. Participants research global issues, debate policies, and collaborate on resolutions — building skills in public speaking, diplomacy, critical thinking, and leadership.',
  },
  {
    q: 'What forms must be signed prior to the conference?',
    a: 'The liability and tech release form are mandatory to be filled prior to the conference.',
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
    a: 'Delegates must wear formal clothing on Day 1 and Day 3 of the conference (skirts and dresses are not allowed), and traditional clothing on Day 2.',
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
    a: 'Yes — there will be a social night following the last committee session on Day 2.',
  },
]

function FAQItem({ faq, isOpen, onToggle, index }) {
  return (
    <motion.div
      className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20, delay: index * 0.06 }}
    >
      <button className={styles.question} onClick={onToggle} aria-expanded={isOpen}>
        <span className={styles.qText}>{faq.q}</span>

        {/* + rotates 45° into × */}
        <motion.div
          className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ''}`}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        >
          <span className={styles.hBar} />
          <span className={styles.vBar} />
        </motion.div>
      </button>

      {/* Pure CSS transition — no layout reflow, no framer-motion height calc */}
      <div className={`${styles.answer} ${isOpen ? styles.answerOpen : ''}`}>
        <p className={`${styles.aText} ${faq.soon ? styles.soon : ''}`}>{faq.a}</p>
      </div>
    </motion.div>
  )
}

export default function FAQPage() {
  const [open, setOpen] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      <AnimatedBg variant="cosmic" />
      <div className={styles.overlay} />

      <Navbar />

      {/* Hero text */}
      <div className={styles.hero}>
        <motion.p className={styles.eyebrow}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}
        >Got Questions?</motion.p>

        <h1 className={styles.title}>
          {['Frequently', 'Asked', 'Questions'].map((word, i) => (
            <motion.span
              key={word}
              className={styles.titleWord}
              initial={{ opacity: 0, y: 52, rotateX: -22 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 88, damping: 16, delay: 0.1 + i * 0.13 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p className={styles.sub}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.52, duration: 0.6 }}
        >Everything you need to know about CHIREC MUN 2026.</motion.p>
      </div>

      {/* FAQ list */}
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

      <BottomBar />
    </div>
  )
}
