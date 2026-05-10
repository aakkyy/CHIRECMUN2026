import { useState } from 'react'
import BlobBg from './BlobBg'
import { motion } from 'framer-motion'
import styles from './Contact.module.css'
import { slideLeft, slideRight, stagger, itemVariant, viewport } from '../lib/motion'

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={`section ${styles.section}`} id="contact" style={{position:'relative',overflow:'hidden'}}>
      <BlobBg variant="contact" />
      <div className="container" style={{position:"relative",zIndex:1}}>
        <div className={styles.grid}>

          <motion.div className={styles.left}
            initial="hidden" whileInView="visible" viewport={viewport} variants={slideLeft}
          >
            <p className={styles.eyebrow}>Get in Touch</p>
            <h2 className={styles.title}>Contact</h2>
            <motion.div className={styles.details}
              initial="hidden" whileInView="visible" viewport={viewport}
              variants={stagger(0.1, 0.1)}
            >
              <motion.div className={styles.row} variants={itemVariant}>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <p>CHIREC International School, IBDP &amp; Cambridge Campus</p>
                  <p>F8HM+3VM, Spring Valley, Serilingampalle (M)</p>
                  <p>Hyderabad, Telangana 500133</p>
                </div>
              </motion.div>
              <motion.div className={styles.row} variants={itemVariant}>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
                </svg>
                <a href="mailto:contact.mun@chirec.ac.in" className={styles.link}>contact.mun@chirec.ac.in</a>
              </motion.div>
              <motion.div className={styles.row} variants={itemVariant}>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
                <a href="https://instagram.com/chirecmun" target="_blank" rel="noopener noreferrer" className={styles.link}>@chirecmun</a>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className={styles.right}
            initial="hidden" whileInView="visible" viewport={viewport}
            variants={stagger(0.08, 0.15)}
          >
            {sent ? (
              <motion.div className={styles.thankYou}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#56CCF2" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3>Message sent!</h3>
                <p>We'll get back to you at {form.email}.</p>
              </motion.div>
            ) : (
              <form className={styles.form} onSubmit={submit}>
                <motion.div className={styles.row2} variants={itemVariant}>
                  <div className={styles.field}>
                    <label className={styles.label}>First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handle} className={styles.input} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handle} className={styles.input} />
                  </div>
                </motion.div>
                <motion.div className={styles.field} variants={itemVariant}>
                  <label className={styles.label}>Email <span className={styles.req}>*</span></label>
                  <input name="email" type="email" value={form.email} onChange={handle} className={styles.input} required />
                </motion.div>
                <motion.div className={styles.field} variants={itemVariant}>
                  <label className={styles.label}>Message</label>
                  <textarea name="message" value={form.message} onChange={handle} className={`${styles.input} ${styles.textarea}`} rows={5} />
                </motion.div>
                <motion.div className={styles.formFooter} variants={itemVariant}>
                  {error && (
                    <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                      {error}
                    </p>
                  )}
                  <motion.button
                    type="submit"
                    className={styles.btn}
                    disabled={submitting}
                    style={{ opacity: submitting ? 0.6 : 1 }}
                    whileHover={!submitting ? { scale: 1.04, boxShadow: '0 8px 28px rgba(86,204,242,0.35)' } : {}}
                    whileTap={!submitting ? { scale: 0.97 } : {}}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    {submitting ? 'Sending…' : 'Send'}
                  </motion.button>
                </motion.div>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
