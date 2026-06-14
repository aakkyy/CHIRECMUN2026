import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'
import HomeBeacon from '../components/HomeBeacon'
import styles from './RegisterPage.module.css'
import { COMMITTEES, TYPE_LABELS } from '../data/committees'
import type { CommitteeType } from '../data/committees'

// Single consolidated list (merge IP into one entry)
const REG_COMMITTEES = [
  ...COMMITTEES.filter(c => !c.id.startsWith('ip-')),
  { id: 'ip', abbr: 'IP', name: 'International Press', category: 'Press Corps', type: 'press' as CommitteeType },
]

const TYPE_BORDER: Record<CommitteeType, string> = {
  ga:          '#c0392b',
  security:    '#8b1a1a',
  specialized: '#1d4ed8',
  crisis:      '#b45309',
  press:       '#4b5563',
}

const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Other']

const EXPERIENCE_OPTIONS = [
  { value: 'novice',      label: 'Novice',      sub: 'First timer',     icon: '🎯' },
  { value: 'experienced', label: 'Experienced', sub: '1–3 conferences', icon: '📚' },
  { value: 'veteran',     label: 'Veteran',      sub: '4+ conferences',  icon: '⚡' },
]

type Step = 1 | 2 | 3

interface FormState {
  committee1: string; committee2: string
  firstName: string; lastName: string
  school: string; grade: string
  email: string; phone: string
  experience: string; dietary: string
  transactionId: string; agreed: boolean
}

const INIT: FormState = {
  committee1: '', committee2: '',
  firstName: '', lastName: '',
  school: '', grade: '',
  email: '', phone: '',
  experience: '', dietary: '',
  transactionId: '', agreed: false,
}

const slide = {
  enter:  (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
}

const STEP_LABELS = ['Committees', 'About You', 'Confirm & Pay']

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1)
  const [dir,  setDir]  = useState(1)
  const [form, setForm] = useState<FormState>(INIT)
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }))

  const selectCommittee = (id: string) => {
    if (form.committee1 === id) {
      setForm(f => ({ ...f, committee1: f.committee2, committee2: '' }))
      return
    }
    if (form.committee2 === id) { set('committee2', ''); return }
    if (!form.committee1) { set('committee1', id); return }
    if (!form.committee2) { set('committee2', id); return }
    // Both filled — swap second choice
    set('committee2', id)
  }

  const advance = () => { setDir(1); setStep(s => Math.min(s + 1, 3) as Step) }
  const retreat = () => { setDir(-1); setStep(s => Math.max(s - 1, 1) as Step) }

  const canNext1 = !!(form.committee1 && form.committee2)
  const canNext2 = !!(
    form.firstName && form.lastName && form.school &&
    form.grade && form.email && form.phone && form.experience
  )

  const submit = async () => {
    if (!form.transactionId.trim()) { setError('Please enter your transaction / UTR ID.'); return }
    if (!form.agreed) { setError('Please agree to the terms to continue.'); return }
    setError(''); setSubmitting(true)
    try {
      const res = await fetch('/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName:     form.firstName,
          lastName:      form.lastName,
          school:        form.school,
          grade:         form.grade,
          email:         form.email,
          phone:         form.phone,
          experience:    form.experience,
          committee1:    form.committee1,
          committee2:    form.committee2,
          transactionId: form.transactionId,
          dietary:       form.dietary,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setSubmitted(true)
    } catch (e: any) {
      setError(e.message || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const byId = (id: string) => REG_COMMITTEES.find(c => c.id === id)

  /* ── SUCCESS ── */
  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.bgOrb1} /><div className={styles.bgOrb2} />
        <Navbar />
        <div className={styles.successWrap}>
          <motion.div
            className={styles.successCard}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          >
            <motion.div
              className={styles.successCheck}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.2 }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <motion.h2 className={styles.successTitle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              Application Submitted
            </motion.h2>
            <motion.p className={styles.successSub} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}>
              We've received your registration, <strong>{form.firstName}</strong>. A confirmation has been sent to <strong>{form.email}</strong>. The Secretariat will verify your payment within 48 hours.
            </motion.p>
            <motion.div className={styles.successDetails} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}>
              <div className={styles.successRow}><span className={styles.successLabel}>Committee 1</span><span className={styles.successVal}>{byId(form.committee1)?.abbr} — {byId(form.committee1)?.name}</span></div>
              <div className={styles.successRow}><span className={styles.successLabel}>Committee 2</span><span className={styles.successVal}>{byId(form.committee2)?.abbr} — {byId(form.committee2)?.name}</span></div>
              <div className={styles.successRow}><span className={styles.successLabel}>School</span><span className={styles.successVal}>{form.school}</span></div>
              <div className={styles.successRow}><span className={styles.successLabel}>Transaction ID</span><span className={styles.successVal}>{form.transactionId}</span></div>
            </motion.div>
          </motion.div>
        </div>
        <BottomBar />
      </div>
    )
  }

  /* ── MAIN WIZARD ── */
  return (
    <div className={styles.page}>
      <div className={styles.bgOrb1} /><div className={styles.bgOrb2} />
      <Navbar />

      {/* Hero */}
      <div className={styles.hero}>
        <HomeBeacon />
        <motion.p className={styles.eyebrow} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          CHIREC MUN 2026 · Edition XIV
        </motion.p>
        <motion.h1 className={styles.title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
          Register
        </motion.h1>
        <motion.p className={styles.sub} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22, duration: 0.5 }}>
          July 31 – August 2 · CHIREC International School · Hyderabad
        </motion.p>
      </div>

      {/* Wizard card */}
      <div className={styles.wizardWrap}>
        <motion.div className={styles.wizard} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.5 }}>

          {/* Step indicator */}
          <div className={styles.steps}>
            {STEP_LABELS.map((label, i) => {
              const n = i + 1
              const active = step === n
              const done   = step > n
              return (
                <>
                  <div key={label} className={`${styles.stepItem} ${active ? styles.stepActive : ''} ${done ? styles.stepDone : ''}`}>
                    <div className={styles.stepDot}>
                      {done
                        ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        : n
                      }
                    </div>
                    <span className={styles.stepLabel}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`${styles.stepLine} ${done ? styles.stepLineDone : ''}`} />
                  )}
                </>
              )
            })}
          </div>

          {/* Content */}
          <div className={styles.content}>
            <AnimatePresence mode="wait" custom={dir}>

              {/* ── STEP 1: Committees ── */}
              {step === 1 && (
                <motion.div key="s1" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}>
                  <div className={styles.stepHeader}>
                    <h2 className={styles.stepTitle}>Choose Your Committees</h2>
                    <p className={styles.stepSub}>Select your top 2 preferences in order. We'll do our best to honour your first choice.</p>
                  </div>

                  <div className={styles.choiceRow}>
                    <div className={`${styles.choicePill} ${form.committee1 ? styles.choicePillFilled : ''}`}>
                      <span className={styles.choiceNum}>1</span>
                      {form.committee1 ? <span>{byId(form.committee1)?.abbr} — {byId(form.committee1)?.name}</span> : <span className={styles.choiceEmpty}>First Choice</span>}
                    </div>
                    <div className={`${styles.choicePill} ${form.committee2 ? styles.choicePillFilled : ''}`}>
                      <span className={styles.choiceNum}>2</span>
                      {form.committee2 ? <span>{byId(form.committee2)?.abbr} — {byId(form.committee2)?.name}</span> : <span className={styles.choiceEmpty}>Second Choice</span>}
                    </div>
                  </div>

                  <div className={styles.committeeGrid}>
                    {REG_COMMITTEES.map(c => {
                      const sel1 = form.committee1 === c.id
                      const sel2 = form.committee2 === c.id
                      const selected = sel1 || sel2
                      return (
                        <button
                          key={c.id}
                          type="button"
                          className={`${styles.cCard} ${selected ? styles.cCardSelected : ''}`}
                          style={{ '--type-color': TYPE_BORDER[c.type] } as React.CSSProperties}
                          onClick={() => selectCommittee(c.id)}
                        >
                          {selected && <span className={styles.cBadge}>{sel1 ? '1' : '2'}</span>}
                          <span className={styles.cTypePill} style={{ color: TYPE_BORDER[c.type] }}>{TYPE_LABELS[c.type]}</span>
                          <span className={styles.cAbbr}>{c.abbr}</span>
                          <span className={styles.cName}>{c.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Details ── */}
              {step === 2 && (
                <motion.div key="s2" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}>
                  <div className={styles.stepHeader}>
                    <h2 className={styles.stepTitle}>About You</h2>
                    <p className={styles.stepSub}>These details will be used for your delegate badge and conference records.</p>
                  </div>
                  <div className={styles.form}>
                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label className={styles.label}>First Name <span className={styles.req}>*</span></label>
                        <input className={styles.input} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Arjun" />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Last Name <span className={styles.req}>*</span></label>
                        <input className={styles.input} value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Sharma" />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>School <span className={styles.req}>*</span></label>
                      <input className={styles.input} value={form.school} onChange={e => set('school', e.target.value)} placeholder="CHIREC International School" />
                    </div>
                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label className={styles.label}>Grade <span className={styles.req}>*</span></label>
                        <select className={styles.input} value={form.grade} onChange={e => set('grade', e.target.value)}>
                          <option value="">Select grade</option>
                          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Phone <span className={styles.req}>*</span></label>
                        <div className={styles.phoneWrap}>
                          <span className={styles.phonePrefix}>+91</span>
                          <input
                            className={`${styles.input} ${styles.phoneInput}`}
                            value={form.phone}
                            onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="9876543210"
                            maxLength={10}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Email <span className={styles.req}>*</span></label>
                      <input className={styles.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@school.ac.in" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>MUN Experience <span className={styles.req}>*</span></label>
                      <div className={styles.expRow}>
                        {EXPERIENCE_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            className={`${styles.expCard} ${form.experience === opt.value ? styles.expCardSelected : ''}`}
                            onClick={() => set('experience', opt.value)}
                          >
                            <span className={styles.expIcon}>{opt.icon}</span>
                            <span className={styles.expLabel}>{opt.label}</span>
                            <span className={styles.expSub}>{opt.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Dietary / Accessibility <span className={styles.opt}>(optional)</span></label>
                      <input className={styles.input} value={form.dietary} onChange={e => set('dietary', e.target.value)} placeholder="e.g. vegetarian, nut allergy…" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Confirm & Pay ── */}
              {step === 3 && (
                <motion.div key="s3" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}>
                  <div className={styles.stepHeader}>
                    <h2 className={styles.stepTitle}>Confirm & Pay</h2>
                    <p className={styles.stepSub}>Review your details, complete payment, then enter the transaction ID below.</p>
                  </div>

                  {/* Summary */}
                  <div className={styles.summary}>
                    <div className={styles.summaryRow}><span className={styles.summaryKey}>Name</span><span className={styles.summaryVal}>{form.firstName} {form.lastName}</span></div>
                    <div className={styles.summaryRow}><span className={styles.summaryKey}>School</span><span className={styles.summaryVal}>{form.school}</span></div>
                    <div className={styles.summaryRow}><span className={styles.summaryKey}>Grade</span><span className={styles.summaryVal}>{form.grade}</span></div>
                    <div className={styles.summaryRow}><span className={styles.summaryKey}>Email</span><span className={styles.summaryVal}>{form.email}</span></div>
                    <div className={styles.summarySep} />
                    <div className={styles.summaryRow}><span className={styles.summaryKey}>Committee 1</span><span className={styles.summaryVal}>{byId(form.committee1)?.abbr} — {byId(form.committee1)?.name}</span></div>
                    <div className={styles.summaryRow}><span className={styles.summaryKey}>Committee 2</span><span className={styles.summaryVal}>{byId(form.committee2)?.abbr} — {byId(form.committee2)?.name}</span></div>
                  </div>

                  {/* Payment */}
                  <div className={styles.payBox}>
                    <div className={styles.payHeader}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></svg>
                      Payment Instructions
                    </div>
                    <div className={styles.payDetails}>
                      <div className={styles.payRow}><span>Registration Fee</span><strong>₹1,500</strong></div>
                      <div className={styles.payRow}><span>UPI ID</span><strong>chirec.mun@upi</strong></div>
                      <p className={styles.payNote}>Pay via UPI or bank transfer and save your transaction ID. Your seat is confirmed only after the Secretariat verifies payment.</p>
                    </div>
                  </div>

                  <div className={styles.field} style={{ marginTop: '1.2rem' }}>
                    <label className={styles.label}>Transaction / UTR ID <span className={styles.req}>*</span></label>
                    <input className={styles.input} value={form.transactionId} onChange={e => set('transactionId', e.target.value)} placeholder="e.g. 123456789012" />
                  </div>

                  <label className={styles.terms}>
                    <input type="checkbox" className={styles.checkbox} checked={form.agreed} onChange={e => set('agreed', e.target.checked)} />
                    <span>I agree to the CHIREC MUN 2026 Code of Conduct and confirm all information provided is accurate.</span>
                  </label>

                  {error && <p className={styles.error}>{error}</p>}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Nav buttons */}
          <div className={styles.nav}>
            {step > 1 && (
              <button type="button" className={styles.backBtn} onClick={retreat}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 3 ? (
              <button type="button" className={styles.nextBtn} onClick={advance} disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}>
                Continue
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            ) : (
              <button type="button" className={styles.submitBtn} onClick={submit} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Registration'}
                {!submitting && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
              </button>
            )}
          </div>

        </motion.div>
      </div>

      <BottomBar />
    </div>
  )
}
