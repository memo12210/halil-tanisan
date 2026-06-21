import type { Genre, Project } from "../components/types";

export const projects: Project[] = [
  // ---------- Narrative ----------
  {
    file: "PROJECT.png",
    tone: "dark",
    tag: "2.00:1",
    title: "Euphoria — S2",
    meta: "HBO / A24 · Narrative",
    genre: "Narrative",
    highlight: true,
    featured: true,
  },
  {
    file: "PROJECT.png",
    tone: "warm",
    tag: "2.39:1",
    title: "O'Dessa",
    meta: "Searchlight · Narrative",
    genre: "Narrative",
  },
  {
    file: "PROJECT.png",
    tone: "neutral",
    tag: "1.85:1",
    title: "Nanny",
    meta: "Amazon Studios · Narrative",
    genre: "Narrative",
  },
  {
    file: "PROJECT.png",
    tone: "dark",
    tag: "2.00:1",
    title: "Top Boy III",
    meta: "Netflix · Narrative",
    genre: "Narrative",
  },
  {
    file: "PROJECT.png",
    tone: "warm",
    tag: "2.39:1",
    title: "The Fire Inside",
    meta: "MGM Studios · Narrative",
    genre: "Narrative",
  },
  {
    file: "PROJECT.png",
    tone: "cool",
    tag: "1.85:1",
    title: "The Quiet Coast",
    meta: "Untitled Feature · Narrative",
    genre: "Narrative",
  },
  {
    file: "PROJECT.png",
    tone: "neutral",
    tag: "2.39:1",
    title: "Aftersun II",
    meta: "Short Film · Narrative",
    genre: "Narrative",
  },

  // ---------- Music Videos ----------
  {
    file: "PROJECT.png",
    tone: "cool",
    tag: "1.85:1",
    title: "The Weeknd — Sacrifice",
    meta: "Dir. Cliqua · Music Video",
    genre: "Music Videos",
    highlight: true,
  },
  {
    file: "PROJECT.png",
    tone: "dark",
    tag: "2.39:1",
    title: "FKA twigs — Eusexua",
    meta: "Dir. Jordan Hemingway · Music Video",
    genre: "Music Videos",
  },
  {
    file: "PROJECT.png",
    tone: "warm",
    tag: "1.78:1",
    title: "Rosalía — Saoko",
    meta: "Dir. Valentín & Marçal · Music Video",
    genre: "Music Videos",
  },
  {
    file: "PROJECT.png",
    tone: "cool",
    tag: "2.00:1",
    title: "Dua Lipa — Mirage",
    meta: "Dir. Tanu Muino · Music Video",
    genre: "Music Videos",
  },
  {
    file: "PROJECT.png",
    tone: "warm",
    tag: "2.39:1",
    title: "Burna Boy — Solis",
    meta: "Dir. Meji Alabi · Music Video",
    genre: "Music Videos",
  },
  {
    file: "PROJECT.png",
    tone: "dark",
    tag: "1.85:1",
    title: "ROSÉ — Glasshouse",
    meta: "Dir. Dave Meyers · Music Video",
    genre: "Music Videos",
  },
  {
    file: "PROJECT.png",
    tone: "neutral",
    tag: "1.78:1",
    title: "Tyla — Tide",
    meta: "Dir. Child · Music Video",
    genre: "Music Videos",
  },

  // ---------- Commercials ----------
  {
    file: "PROJECT.png",
    tone: "cool",
    tag: "2.39:1",
    title: "Hermès — Beauté",
    meta: "Dir. Rubberband · Commercial",
    genre: "Commercials",
    highlight: true,
  },
  {
    file: "PROJECT.png",
    tone: "dark",
    tag: "2.00:1",
    title: "Nike — Run the Night",
    meta: "Dir. Megaforce · Commercial",
    genre: "Commercials",
  },
  {
    file: "PROJECT.png",
    tone: "neutral",
    tag: "1.85:1",
    title: "Apple — Close Up",
    meta: "Dir. Park Pictures · Commercial",
    genre: "Commercials",
  },
  {
    file: "PROJECT.png",
    tone: "warm",
    tag: "2.39:1",
    title: "Chanel — N°5 Nocturne",
    meta: "Dir. Iconoclast · Commercial",
    genre: "Commercials",
  },
  {
    file: "PROJECT.png",
    tone: "dark",
    tag: "2.00:1",
    title: "Mercedes — Vantablack",
    meta: "Dir. Smuggler · Commercial",
    genre: "Commercials",
  },
  {
    file: "PROJECT.png",
    tone: "neutral",
    tag: "1.78:1",
    title: "Aesop — Hands",
    meta: "Dir. Academy · Commercial",
    genre: "Commercials",
  },
  {
    file: "PROJECT.png",
    tone: "cool",
    tag: "1.85:1",
    title: "Bottega — Green Room",
    meta: "Dir. Pulse Films · Commercial",
    genre: "Commercials",
  },
];

/** The site-wide most-highlighted project — the Home page hero. */
export const featured: Project =
  projects.find((project) => project.featured) ?? projects[0];

/** The hero for a given view: a genre's highlight, or the global featured on Home. */
export function heroFor(genre: Genre | null): Project {
  if (!genre) return featured;
  return (
    projects.find((project) => project.genre === genre && project.highlight) ??
    projects.find((project) => project.genre === genre) ??
    featured
  );
}

/** Grid projects for a view, with the promoted hero removed to avoid duplication. */
export function gridFor(genre: Genre | null): Project[] {
  const hero = heroFor(genre);
  const list = genre
    ? projects.filter((project) => project.genre === genre)
    : projects;
  return list.filter((project) => project !== hero);
}
