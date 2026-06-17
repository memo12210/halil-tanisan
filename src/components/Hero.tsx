import { useState } from 'react';
import Plate from './Plate';
import { featured } from '../data/projects';
import styles from './Hero.module.css';

export default function Hero() {
  const [hover, setHover] = useState(false);

  return (
    <section className={styles.hero}>
      <div
        className={styles.frame}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={styles.image}>
          <Plate tone={featured.tone} label={featured.file} tag={featured.tag} />
        </div>
        <div className={styles.baseDim} />
        <div className={styles.focusVeil} data-active={hover} />
        <div className={styles.overlay} data-active={hover}>
          <div className={styles.featuredTag}>{featured.label}</div>
          <div className={styles.caption}>
            <div className={styles.title}>{featured.title}</div>
            <div className={styles.credit}>{featured.credit}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
