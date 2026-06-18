export type Tone = 'warm' | 'cool' | 'dark' | 'neutral';

export type Genre = 'Narrative' | 'Music Videos' | 'Commercials';

export interface Project {
  /** Source filename, shown as the plate label. */
  file: string;
  tone: Tone;
  /** Aspect-ratio tag, e.g. "2.39:1". */
  tag: string;
  title: string;
  meta: string;
  /** Genre used for nav filtering. */
  genre: Genre;
}

export interface Featured {
  file: string;
  tone: Tone;
  tag: string;
  /** Overlay eyebrow label, e.g. "FEATURED". */
  label: string;
  title: string;
  /** Director / studio credit line. */
  credit: string;
}
