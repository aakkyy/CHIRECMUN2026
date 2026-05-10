import { motion } from 'framer-motion'
import styles from './Secretariat.module.css'
import { viewport, spring } from '../lib/motion'
import AnimatedBg from './AnimatedBg'

const addresses = [
  {
    initials: 'DA', name: 'Dev Agarwal', role: 'Co-Secretary General',
    conf: 'CHIREC MUN 2026', variant: 'sky', greeting: 'Regards',
    body: [
      'Dear Delegates,',
      'It is my privilege to welcome you to the 14th Edition of CHIREC Model United Nations.',
      'Through its various editions, CHIRECMUN has been a home for voices that question, challenge, and seek to understand. This year, we return to make the 14th edition more dynamic, more ambitious, and more impactful, for you.',
      'Through a diverse array of committees and engaging agendas, this edition is designed to encourage critical thinking, meaningful dialogue, and the exchange of perspectives within a community that values informed and respectful discussion. Whether you are an experienced delegate or stepping into your first committee, CHIRECMUN 2026 offers you the opportunity to challenge yourself and grow as a communicator and thinker.',
      'I encourage each of you to make the most of this experience: immerse yourselves fully, engage with intention, and embrace every moment of the journey, much like many of us did through the years.',
      'On behalf of the CHIREC MUN 2026 Secretariat, I would like to thank you for being a part of this conference and contributing to what makes it truly meaningful.',
      "We look forward to seeing you at this year's CHIREC Model United Nations and to a new journey filled with meaningful discussion, fresh perspectives, and memories to take back.",
    ],
  },
  {
    initials: 'AA', name: 'Anusha Anchlia', role: 'Co-Secretary General',
    conf: 'CHIREC MUN 2026', variant: 'red', greeting: 'Warm regards',
    body: [
      'Dear Delegates,',
      'It is with immense pride and great pleasure that I welcome you to the 14th Edition of CHIREC Model United Nations.',
      'Over the years, CHIREC MUN has evolved into far more than just a conference. It is a dynamic forum where young minds come together to question, collaborate, and lead. This year, we are committed to carrying this legacy forward by fostering an environment that inspires curiosity, builds confidence, and encourages meaningful engagement.',
      'Each committee has been thoughtfully curated to challenge you to think critically, research deeply, and deliberate on some of the most pressing global issues of our time. Whether you are a first-time delegate or a seasoned participant, we hope this conference empowers you to express your ideas, learn from diverse perspectives, and embrace the true spirit of diplomacy.',
      'Beyond debate and discussion, CHIREC MUN is about discovery: of new ideas, new perspectives, and your own potential. We hope your experience here is not only intellectually enriching, but also memorable and rewarding.',
      'On behalf of the Secretariat, I extend my sincere gratitude for your participation. We look forward to witnessing the insightful debates, innovative solutions, and diplomatic excellence that define this conference.',
      'We eagerly await your presence at CHIREC International School for what promises to be an unforgettable experience.',
    ],
  },
]

function AddressCard({ addr, reverse }) {
  return (
    <motion.div
      className={`${styles.card} ${reverse ? styles.reverse : ''}`}
      initial={{ opacity: 0, x: reverse ? 60 : -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport}
      transition={{ ...spring }}
      whileHover={{ boxShadow: '0 8px 40px rgba(86,204,242,0.12)', borderColor: 'rgba(86,204,242,0.18)', transition: { duration: 0.25 } }}
    >
      <div className={styles.photoCol}>
        <div className={`${styles.avatar} ${styles[addr.variant]}`}><span>{addr.initials}</span></div>
        <p className={styles.avatarName}>{addr.name}</p>
        <p className={styles.avatarRole}>{addr.role}</p>
        <p className={styles.avatarConf}>{addr.conf}</p>
      </div>
      <div className={styles.textCol}>
        <p className={styles.eyebrowCard}>Letter from the</p>
        <h3 className={styles.cardTitle}>Co-Secretary General</h3>
        <div className={styles.body}>
          {addr.body.map((para, i) => (
            <p key={i} className={i === 0 ? styles.salutation : ''}>{para}</p>
          ))}
        </div>
        <div className={styles.sign}>
          <p>{addr.greeting},</p>
          <p className={styles.signName}>{addr.name}</p>
          <p className={styles.signRole}>{addr.role}, {addr.conf}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Secretariat() {
  return (
    <section className={`section ${styles.section}`} id="secretariat" style={{position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(4,3,8,0.65) 0%, rgba(4,3,8,0.58) 100%)',zIndex:0,pointerEvents:'none'}} />
      <AnimatedBg variant="blue" />
      <div className="container" style={{position:"relative",zIndex:1}}>
        <motion.p className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        >A Word from the Top</motion.p>
        <motion.h2 className={styles.title}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.07 }}
        >Addresses by the Co-Secretary Generals</motion.h2>
        <motion.p className={styles.sub}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={viewport} transition={{ delay: 0.15, duration: 0.6 }}
        >Hear directly from the leaders shaping this year's conference.</motion.p>

        <div className={styles.stack}>
          {addresses.map((a, i) => <AddressCard key={a.name} addr={a} reverse={i % 2 !== 0} />)}
        </div>
      </div>
    </section>
  )
}
