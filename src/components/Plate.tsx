import type { Tone } from './types';

interface PlateProps {
  tone: Tone;
  /** Filename of the still this plate stands in for (used as alt text). */
  label: string;
  /** Optional aspect-ratio tag, e.g. "2.39:1". Unused while plates are clean. */
  tag?: string;
}

export default function Plate({ tone, label }: PlateProps) {
  return <div className={`plate plate-${tone}`} role="img" aria-label={label} />;
}
