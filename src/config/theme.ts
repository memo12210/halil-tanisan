export interface Theme {
  /** Opacity (0–1) of the resting dim overlay covering each plate. */
  restDim: number;
  /** Accent color. Exposed as the `--accent` CSS var; unused in the current
   *  layout (matches the original, where it is also not referenced). */
  accent: string;
  /** Whether project tiles reveal a caption on hover. */
  captions: boolean;
}

export const theme: Theme = {
  restDim: 0,
  accent: '#111111',
  captions: true,
};
