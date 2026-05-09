import styles from './Location.module.css'

export default function Location() {
  return (
    <section className={`section ${styles.section}`} id="location">
      <div className="container">
        <p className={styles.eyebrow}>Getting Here</p>
        <h2 className={styles.title}>Find Us Here</h2>
        <p className={styles.sub}>Visit us at our campus in Serilingampalle, Hyderabad</p>

        <div className={`${styles.mapWrap} reveal`}>
          <iframe
            className={styles.map}
            title="CHIREC International School, Serilingampalle"
            src="https://maps.google.com/maps?q=F8HM%2B3VM+Serilingampalle+Hyderabad+Telangana&output=embed&z=17"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className={`${styles.details} reveal`}>
          <div className={styles.detailItem}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <div>
              <p className={styles.detailLabel}>Address</p>
              <p className={styles.detailValue}>F8HM+3VM, Spring Valley, Serilingampalle (M), Hyderabad, Telangana 500019</p>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.detailItem}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div>
              <p className={styles.detailLabel}>Conference Dates</p>
              <p className={styles.detailValue}>July 31, August 1 &amp; 2, 2026</p>
            </div>
          </div>
          <div className={styles.divider} />
          <a
            href="https://share.google/vIwGsXgARRpKcd9LC"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapsLink}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
