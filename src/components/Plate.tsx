import type { Tone } from './types';
import styles from './Plate.module.css';

const TONE_GRADIENT: Record<Tone, string> = {
  warm: 'linear-gradient(135deg, #3a2a1d 0%, #7a4e30 55%, #b9844f 100%)',
  cool: 'linear-gradient(135deg, #1d2733 0%, #33485c 55%, #6f8ea8 100%)',
  dark: 'linear-gradient(135deg, #0e0e10 0%, #24232a 60%, #3a3742 100%)',
  neutral: 'linear-gradient(135deg, #34322c 0%, #6a655b 55%, #a39d90 100%)',
};

interface PlateProps {
  tone: Tone;
  /** Filename label shown faintly over the placeholder. */
  label: string;
  /** Optional aspect-ratio tag, e.g. "2.39:1". */
  tag?: string;
}

export default function Plate({ tone, label, tag }: PlateProps) {
  return (
    <div className={styles.plate} style={{ backgroundImage: TONE_GRADIENT[tone] }}>
      <span className={styles.label}>{label}</span>
      {tag && <span className={styles.tag}>{tag}</span>}
    </div>
  );
}
