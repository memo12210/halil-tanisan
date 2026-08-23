export type Tone = 'warm' | 'cool' | 'dark' | 'neutral';

export type Genre = 'Narrative' | 'Commercials';

export interface Project {
  /** Source filename, shown as the plate label. */
  file: string;
  tone: Tone;
  title: string;
  meta: string;
  /** Genre used for nav filtering. */
  genre: Genre;
  /** Thumbnail image shown on the genre hero. */
  thumbnail: string;
  /** The three images shown together in this project's grid row (falls back to
   *  `thumbnail` repeated three times when a project has no dedicated triad). */
  images: [string, string, string];
  /** The single highlighted project for its genre — promoted to that genre's hero. */
  highlight?: boolean;
  /**
   * CSS `aspect-ratio` (e.g. `"4 / 3"`) overriding the default hero/row frame ratio.
   * Set this when the source media pillarboxes its real content inside a wider canvas
   * (e.g. a 4:3 photo centered in a 1920x1080/16:9 file) — framing at the true content
   * ratio lets `object-fit: cover` crop the black bars away instead of showing them.
   * Leave unset for media that already fills its canvas edge-to-edge.
   */
  frameRatio?: string;
}
