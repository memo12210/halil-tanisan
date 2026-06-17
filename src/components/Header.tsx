import styles from './Header.module.css';

const NAV_ITEMS = ['Narrative', 'Music videos', 'Commercials', 'Info', 'Stills'];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.name}>RINA YANG</span>
        <span className={styles.role}>CINEMATOGRAPHER</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <span key={item} className={styles.navItem}>
            {item}
          </span>
        ))}
      </nav>
    </header>
  );
}
