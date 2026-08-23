import type { Genre, Project } from "../components/types";

/** Placeholder media used until real stills/films are wired in, per project. */
const PLACEHOLDER_THUMBNAIL = "/placeholder_image.png";

/** A project entry before placeholder media is filled in. */
type ProjectSeed = Omit<Project, "thumbnail" | "images"> &
  Partial<Pick<Project, "thumbnail" | "images">>;

const seeds: ProjectSeed[] = [
  // ---------- Narrative ----------
  {
    file: "01.webp",
    tone: "dark",
    title: "Ferret",
    meta: "Lodz Film School · Experimental",
    genre: "Narrative",
    highlight: true,
    thumbnail: "/projects/ferret/01.webp",
    // The hero above already shows 01 — the row uses the next three so nothing repeats.
    images: [
      "/projects/ferret/02.webp",
      "/projects/ferret/03.webp",
      "/projects/ferret/04.webp",
    ],
  },
  {
    file: "01.webp",
    tone: "warm",
    title: "Hotel",
    meta: "Lodz Film School · Fantastic",
    genre: "Narrative",
    thumbnail: "/projects/hotel/01.webp",
    images: [
      "/projects/hotel/01.webp",
      "/projects/hotel/02.webp",
      "/projects/hotel/03.webp",
    ],
  },
  {
    file: "PROJECT.png",
    tone: "neutral",
    title: "Kepler-452",
    meta: "Lodz Film School · Drama",
    genre: "Narrative",
    thumbnail: "/projects/kepler/01.webp",
    images: [
      "/projects/kepler/01.webp",
      "/projects/kepler/02.webp",
      "/projects/kepler/03.webp",
    ],
  },
  {
    file: "PROJECT.png",
    tone: "neutral",
    title: "Ballet",
    meta: "Lodz Film School · Experimental",
    genre: "Narrative",
    thumbnail: "/projects/ballet/01.webp",
    images: [
      "/projects/ballet/01.webp",
      "/projects/ballet/02.webp",
      "/projects/ballet/03.webp",
    ],
  },

  // ---------- Commercials ----------
  {
    file: "01.webp",
    tone: "neutral",
    title: "Cinili",
    meta: "Turkish Bath House · Commercial",
    genre: "Commercials",
    highlight: true,
    thumbnail: "/projects/cinili/01.webp",
    images: [
      "/projects/cinili/02.webp",
      "/projects/cinili/03.webp",
      "/projects/cinili/04.webp",
    ],
    // Source files pillarbox a 4:3 photo inside a 1920x1080 canvas.
    frameRatio: "4 / 3",
  },
  {
    file: "01.webp",
    tone: "neutral",
    title: "Bomonti",
    meta: "Brewery · Commercial",
    genre: "Commercials",
    thumbnail: "/projects/bomonti/01.webp",
    images: [
      "/projects/bomonti/01.webp",
      "/projects/bomonti/02.webp",
      "/projects/bomonti/03.webp",
    ],
    // Source files pillarbox a 4:3 photo inside a 1920x1080 canvas.
    frameRatio: "4 / 3",
  },
];

/** Every project, with placeholder media filled in where a project omits its own. */
export const projects: Project[] = seeds.map((seed) => {
  const thumbnail = seed.thumbnail ?? PLACEHOLDER_THUMBNAIL;
  return {
    ...seed,
    thumbnail,
    // Projects without a dedicated triad repeat their single thumbnail across the row.
    images: seed.images ?? [thumbnail, thumbnail, thumbnail],
  };
});

/** The hero for a genre page: its highlighted project. */
export function heroFor(genre: Genre): Project {
  return (
    projects.find((project) => project.genre === genre && project.highlight) ??
    projects.find((project) => project.genre === genre) ??
    projects[0]
  );
}

/**
 * Grid projects for a genre page. The genre's highlighted project stays in the grid too —
 * repeated as the first row, right below the hero it's already shown large as up top.
 */
export function gridFor(genre: Genre): Project[] {
  const hero = heroFor(genre);
  const rest = projects.filter(
    (project) => project.genre === genre && project !== hero,
  );
  return [hero, ...rest];
}
