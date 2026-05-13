import { useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './GuidelinesPage.module.css'
import AnimatedBg from '../components/AnimatedBg'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'

const sections = [
  {
    title: 'Registration & Attendance',
    items: [
      'All participants must sign the Liability Release Form and Tech Release Form before the conference begins.',
      'Participants under 18 must also have a parent or guardian sign the undertaking.',
      'Check-in begins at the venue on Day 1, July 31st, 2026. Please arrive on time.',
      'Missing more than 2 committee sessions makes you ineligible for certificates and awards.',
      'All registration details must be accurate. Discrepancies may result in cancellation.',
    ],
  },
  {
    title: 'Dress Code',
    items: [
      'Formal attire is mandatory on all conference days: formal shirts, trousers, dress shoes, loafers, heels, or ballet flats.',
      'Blazers and ties are encouraged but not compulsory. Sleeveless formal tops must be paired with a blazer.',
      'Crop tops, sheer blouses, spaghetti tops, skirts, dresses, t-shirts, jeans, and casual footwear are strictly not allowed.',
      'Exposed midriffs are not permitted under any circumstances.',
      'Social Night (August 1st, 2026): Traditional Indian wear only. Full-length skirts and dresses are allowed. The same restrictions on crop tops and exposed midriffs apply.',
    ],
  },
  {
    title: 'Conference Conduct',
    items: [
      'Mobile phones must be on silent during all committee sessions.',
      'Electronic devices may only be used for note-taking and research when approved by the Executive Board.',
      'Wi-Fi access during sessions is not permitted unless explicitly approved.',
      'Participants must remain in their committee rooms during sessions unless granted permission to leave.',
      'Photography and video recording are only permitted during designated times.',
      'Meals and refreshments must be consumed in designated areas outside committee rooms.',
    ],
  },
  {
    title: 'Diplomatic Standards',
    items: [
      'Maintain respect and courtesy toward all participants, guests, and staff at all times.',
      "No insults, jokes, or derogatory remarks about another person's culture, race, religion, gender, or sexual orientation.",
      'Constructive debate only. Personal attacks, aggressive confrontations, and offensive language are strictly prohibited.',
      'Plagiarism in position papers or resolutions will result in immediate disqualification.',
      'Any form of violence, stalking, physical harassment, or sexual harassment will be referred to the Complaints Committee immediately.',
      'Consumption of alcohol, drugs, nicotine products, or any illegal substances is strictly prohibited.',
    ],
  },
  {
    title: 'Reporting & Consequences',
    items: [
      'Breaches of this Code of Conduct can be reported to a Complaints Officer at any time during the conference.',
      'The Complaints Committee, comprising the Co-Secretaries General, Director General, and Faculty Coordinators, handles serious violations.',
      'Consequences range from a formal warning to suspension, expulsion from CHIREC MUN 2026, or a ban from future conferences.',
      "The Complaints Committee's decision is final. Appeals are not permitted, though re-admission may be applied for 6 months after the decision.",
    ],
  },
]

const cardVariants = {
  hidden: (fromLeft: boolean) => ({
    opacity: 0,
    x: fromLeft ? -60 : 60,
    y: 20,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

const titleWords = ['Delegate', 'Rules', '&', 'Regulations']

export default function GuidelinesPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      <AnimatedBg variant="streams" />
      <div className={styles.vignette} />

      <Navbar />

      <div className={styles.hero}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          CHIREC MUN 2026
        </motion.p>

        <h1 className={styles.title}>
          {titleWords.map((word, i) => (
            <motion.span
              key={word + i}
              className={styles.titleWord}
              initial={{ opacity: 0, y: 60, rotateX: -28 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 82, damping: 15, delay: 0.08 + i * 0.12 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          All participants must read and agree to abide by the following guidelines.
        </motion.p>

        {/* animated divider */}
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.75, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className={styles.content}>
        {sections.map((section, si) => {
          const fromLeft = si % 2 === 0
          return (
            <motion.div
              key={section.title}
              className={styles.card}
              custom={fromLeft}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <div className={styles.cardAccent} />
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <motion.ul
                className={styles.list}
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                {section.items.map((item, ii) => (
                  <motion.li key={ii} className={styles.item} variants={itemVariants}>
                    <span className={styles.bullet} />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )
        })}

        <motion.p
          className={styles.footer}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          As representatives of nations in a formal diplomatic setting, all participants are expected
          to maintain professionalism and adhere to these guidelines at all times. Failure to comply
          may result in disciplinary action or removal from the conference.
        </motion.p>
      </div>

      <BottomBar />
    </div>
  )
}
