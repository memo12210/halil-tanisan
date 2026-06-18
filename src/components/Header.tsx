const NAV_ITEMS = [
  "Narrative",
  "Music videos",
  "Commercials",
  "Info",
  "Stills",
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-name">HALİL TANIŞAN</span>
        <span className="brand-role">CINEMATOGRAPHER</span>
      </div>
      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <span key={item} className="nav-item">
            {item}
          </span>
        ))}
      </nav>
    </header>
  );
}
