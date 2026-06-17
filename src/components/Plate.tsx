import type { Tone } from './types';

interface PlateProps {
  tone: Tone;
  /** Filename label shown faintly over the placeholder. */
  label: string;
  /** Optional aspect-ratio tag, e.g. "2.39:1". */
  tag?: string;
}

export default function Plate({ tone, label, tag }: PlateProps) {
  return (
    <div className={`plate plate-${tone}`}>
      <span className="plate-label">{label}</span>
      {tag && <span className="plate-tag">{tag}</span>}
    </div>
  );
}
