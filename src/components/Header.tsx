import type { Genre } from './types';

const GENRES: Genre[] = ['Narrative', 'Music Videos', 'Commercials'];

interface HeaderProps {
  view: 'work' | 'info';
  activeGenre: Genre | null;
  onSelectGenre: (genre: Genre | null) => void;
  onSelectInfo: () => void;
}

export default function Header({
  view,
  activeGenre,
  onSelectGenre,
  onSelectInfo,
}: HeaderProps) {
  const genreActive = (genre: Genre) => view === 'work' && activeGenre === genre;

  const handleGenre = (genre: Genre) => {
    onSelectGenre(genreActive(genre) ? null : genre);
  };

  return (
    <header className="site-header">
      <button type="button" className="brand" onClick={() => onSelectGenre(null)}>
        <span className="brand-name">HALİL TANIŞAN</span>
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
            onClick={() => handleGenre(genre)}
          >
            {genre}
          </button>
        ))}
        <button
          type="button"
          className="nav-item"
          data-active={view === 'info'}
          aria-pressed={view === 'info'}
          onClick={onSelectInfo}
        >
          Info
        </button>
        <span className="nav-item nav-item-static">Stills</span>
      </nav>
    </header>
  );
}
