import type { Genre } from "./types";

const GENRES: Genre[] = ["Narrative", "Commercials"];

interface HeaderProps {
  view: "work" | "info" | "stills";
  activeGenre: Genre;
  onSelectGenre: (genre: Genre) => void;
  onSelectInfo: () => void;
  onSelectStills: () => void;
}

export default function Header({
  view,
  activeGenre,
  onSelectGenre,
  onSelectInfo,
  onSelectStills,
}: HeaderProps) {
  const genreActive = (genre: Genre) =>
    view === "work" && activeGenre === genre;

  return (
    <header className="site-header">
      <button
        type="button"
        className="brand"
        onClick={() => onSelectGenre("Narrative")}
      >
        <span className="brand-name">HALIL TANISAN</span>
        <span className="brand-role">CINEMATOGRAPHER</span>
      </button>
      <nav className="nav">
        {GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            className="nav-item"
            data-active={genreActive(genre)}
            aria-pressed={genreActive(genre)}
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
        <button
          type="button"
          className="nav-item"
          data-active={view === "stills"}
          aria-pressed={view === "stills"}
          onClick={onSelectStills}
        >
          Stills
        </button>
        <button
          type="button"
          className="nav-item"
          data-active={view === "info"}
          aria-pressed={view === "info"}
          onClick={onSelectInfo}
        >
          Info
        </button>
      </nav>
    </header>
  );
}
