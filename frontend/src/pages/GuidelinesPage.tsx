import { useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './GuidelinesPage.module.css'
import GuidelinesBg from '../components/GuidelinesBg'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'

const sections = [
  {
    title: 'Registration & Attendance',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="13" rx="2.5" stroke="rgba(231,76,60,0.75)" strokeWidth="1.4"/>
        <path d="M6 3V1.5M12 3V1.5M2 8h14" stroke="rgba(231,76,60,0.75)" strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="5" y="11" width="2.5" height="2.5" rx="0.6" fill="rgba(231,76,60,0.55)"/>
        <rect x="10" y="11" width="2.5" height="2.5" rx="0.6" fill="rgba(231,76,60,0.55)"/>
      </svg>
    ),
    items: [
      'All participants must sign the Liability Release Form and Tech Release Form before the conference begins.',
      'Participants under 18 must also have a parent or guardian sign the undertaking.',
      'Registration begins at the venue on Day 1, July 31st, 2026. Please arrive on time.',
      'Missing more than 2 committee sessions makes you ineligible for certificates and awards.',
      'All registration details must be accurate.',
    ],
  },
  {
    title: 'Dress Code',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M6 2L3 5.5l2.5 1.5v8h7V7L15 5.5 12 2" stroke="rgba(231,76,60,0.75)" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M6 2c0 1.657 1.343 3 3 3s3-1.343 3-3" stroke="rgba(231,76,60,0.75)" strokeWidth="1.4"/>
      </svg>
    ),
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
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2C5.134 2 2 4.91 2 8.5c0 1.48.518 2.847 1.388 3.944L2.5 15.5l3.5-1c.9.467 1.924.75 3 .75C12.866 15.25 16 12.34 16 8.75S12.866 2 9 2z" stroke="rgba(231,76,60,0.75)" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M6 8.5h6M6 11h4" stroke="rgba(231,76,60,0.75)" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
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
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="rgba(231,76,60,0.75)" strokeWidth="1.4"/>
        <ellipse cx="9" cy="9" rx="3.5" ry="7" stroke="rgba(231,76,60,0.75)" strokeWidth="1.4"/>
        <path d="M2 9h14M3 5.5h12M3 12.5h12" stroke="rgba(231,76,60,0.75)" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
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
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 2h10l-2 4.5L14 11H4V2z" stroke="rgba(231,76,60,0.75)" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M4 16V2" stroke="rgba(231,76,60,0.75)" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    items: [
      'Breaches of this Code of Conduct can be reported to a Complaints Officer at any time during the conference.',
      'The Complaints Committee, comprising the Co-Secretaries General, Director General, and Faculty Coordinators, handles serious violations.',
      'Consequences range from a formal warning to suspension, expulsion from CHIREC MUN 2026, or a ban from future conferences.',
      "The Complaints Committee's decision is final. Appeals are not permitted, though re-admission may be applied for 6 months after the decision.",
    ],
  },
]

const Planet = () => (
  <svg className={styles.planet} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="4.2" fill="rgba(192,57,43,0.55)" />
    <circle cx="9" cy="9" r="4.2" fill="url(#pgrad)" />
    <ellipse cx="9" cy="9" rx="8" ry="2.6" stroke="rgba(231,76,60,0.55)" strokeWidth="1.1" fill="none" transform="rotate(-22 9 9)" />
    <circle cx="7.5" cy="7.5" r="1.1" fill="rgba(255,130,90,0.28)" />
    <defs>
      <radialGradient id="pgrad" cx="38%" cy="35%" r="65%" gradientUnits="objectBoundingBox">
        <stop offset="0%" stopColor="rgba(231,100,60,0.7)" />
        <stop offset="100%" stopColor="rgba(100,20,10,0)" />
      </radialGradient>
    </defs>
  </svg>
)

const cardVariants = {
  hidden: (fromLeft: boolean) => ({ opacity: 0, x: fromLeft ? -55 : 55, y: 16 }),
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
}

const titleWords = ['Delegate', 'Rules', '&', 'Regulations']

export default function GuidelinesPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      <GuidelinesBg />
      <div className={styles.vignette} />

      {/* Small animated orbs — only these move */}
      <div className={`${styles.orb} ${styles.orbRed1}`} />
      <div className={`${styles.orb} ${styles.orbBlue1}`} />
      <div className={`${styles.orb} ${styles.orbRed2}`} />
      <div className={`${styles.orb} ${styles.orbBlue2}`} />

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

        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.75, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className={styles.content}>
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            className={styles.card}
            custom={si % 2 === 0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {/* Icon column */}
            <div className={styles.iconCol}>
              <div className={styles.iconCircle}>{section.icon}</div>
              {si < sections.length - 1 && <div className={styles.iconLine} />}
            </div>

            {/* Content */}
            <div className={styles.cardBody}>
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
                    <Planet />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        ))}

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
