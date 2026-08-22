/**
 * A single still photograph shown on the Stills page. New stills are added here — an
 * entry plus, optionally, a dedicated image under `public/projects/<slug>/` — the same
 * seed-plus-placeholder-fallback mechanism `projects.ts` uses for narrative/commercials.
 * Unlike projects, stills carry no title or description — just an image.
 */
export interface Still {
  image: string;
  /** The single highlighted still, shown large at the top of the page. */
  highlight?: boolean;
}

const PLACEHOLDER_IMAGE = "/placeholder_image.png";

type StillSeed = Partial<Still>;

const seeds: StillSeed[] = [
  { image: "/projects/stills/01.webp", highlight: true },
  { image: "/projects/stills/02.webp" },
  { image: "/projects/stills/03.webp" },
  { image: "/projects/stills/04.webp" },
  { image: "/projects/stills/05.webp" },
  { image: "/projects/stills/06.webp" },
  { image: "/projects/stills/07.webp" },
];

/** Every still, with placeholder media filled in where a seed omits its own image. */
export const stills: Still[] = seeds.map((seed) => ({
  image: seed.image ?? PLACEHOLDER_IMAGE,
  highlight: seed.highlight,
}));

/** The highlighted still — shown large at the top of the page. */
export const highlightedStill: Still =
  stills.find((still) => still.highlight) ?? stills[0];

/** Every still except the highlighted one, for the grid below it. */
export const gridStills: Still[] = stills.filter(
  (still) => still !== highlightedStill,
);
