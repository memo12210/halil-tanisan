import type { Genre } from './types';

const GENRES: Genre[] = ['Narrative', 'Music Videos', 'Commercials'];
const STATIC_ITEMS = ['Info', 'Stills'];

interface HeaderProps {
  activeGenre?: Genre | null;
  onSelectGenre?: (genre: Genre | null) => void;
}

export default function Header({ activeGenre = null, onSelectGenre }: HeaderProps) {
  const handleGenre = (genre: Genre) => {
    onSelectGenre?.(activeGenre === genre ? null : genre);
  };

  return (
    <header className="site-header">
      <div className="brand" onClick={() => onSelectGenre?.(null)}>
        <span className="brand-name">HALİL TANIŞAN</span>
        <span className="brand-role">CINEMATOGRAPHER</span>
      </div>
      <nav className="nav">
        {GENRES.map((genre) => (
          <span
            key={genre}
            className="nav-item"
            data-active={activeGenre === genre}
            onClick={() => handleGenre(genre)}
          >
            {genre}
          </span>
        ))}
        {STATIC_ITEMS.map((item) => (
          <span key={item} className="nav-item nav-item-static">
            {item}
          </span>
        ))}
      </nav>
    </header>
  );
}
