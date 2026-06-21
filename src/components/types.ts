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
  /** The single highlighted project for its genre — promoted to that genre's hero. */
  highlight?: boolean;
  /** The site-wide most-highlighted project — shown as the Home hero. */
  featured?: boolean;
}
