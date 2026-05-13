import { motion } from 'framer-motion'
import styles from './Secretariat.module.css'
import { viewport, spring } from '../lib/motion'
import BlobBg from './BlobBg'
import devImg from '@assets/dev.jpg'
import anushaImg from '@assets/anusha.jpg'

const addresses = [
  {
    initials: 'DA', name: 'Dev Agarwal', role: 'Co-Secretary General',
    photo: devImg,
    conf: 'CHIREC MUN 2026', greeting: 'Regards',
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
    photo: anushaImg,
    conf: 'CHIREC MUN 2026', greeting: 'Warm regards',
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ ...spring }}
    >
      {/* Photo column — top-aligned */}
      <div className={styles.photoCol}>
        <div className={styles.avatar}>
          <img src={addr.photo} alt={addr.name} className={styles.avatarImg} />
        </div>
        <p className={styles.personName}>{addr.name}</p>
        <p className={styles.personRole}>{addr.role}</p>
        <p className={styles.personConf}>{addr.conf}</p>
      </div>

      {/* Text column — starts at same level as avatar top */}
      <div className={styles.textCol}>
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
    <section className={styles.section} id="secretariat" style={{ position: 'relative', overflow: 'hidden' }}>
      <BlobBg variant="secretariat" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div className={styles.header}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        >
          <p className={styles.eyebrow}>A Word from the Top</p>
          <h2 className={styles.title}>Addresses by the Co-Secretary Generals</h2>
          <p className={styles.sub}>Hear directly from the leaders shaping this year's conference.</p>
        </motion.div>

        <div className={styles.stack}>
          {addresses.map((a, i) => (
            <AddressCard key={a.name} addr={a} reverse={i % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
