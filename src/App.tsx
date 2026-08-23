import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import Info from './components/Info';
import Stills from './components/Stills';
import Footer from './components/Footer';
import type { Genre } from './components/types';

type Route =
  | { name: 'work'; genre: Genre }
  | { name: 'info' }
  | { name: 'stills' };

export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'work', genre: 'Narrative' });

  const go = (next: Route) => {
    setRoute(next);
    window.scrollTo(0, 0);
  };

  const headerView =
    route.name === 'info' || route.name === 'stills' ? route.name : 'work';
  // Falls back to 'Narrative' when not on a work route; Header only shows a genre as
  // active while headerView === 'work', so the exact value doesn't matter otherwise.
  const activeGenre = route.name === 'work' ? route.genre : 'Narrative';

  return (
    <div className="page">
      <div className="container">
        <Header
          view={headerView}
          activeGenre={activeGenre}
          onSelectGenre={(genre) => go({ name: 'work', genre })}
          onSelectInfo={() => go({ name: 'info' })}
          onSelectStills={() => go({ name: 'stills' })}
        />
        {route.name === 'info' && <Info />}
        {route.name === 'stills' && <Stills />}
        {route.name === 'work' && (
          <>
            <Hero key={route.genre} activeGenre={route.genre} />
            <ProjectGrid activeGenre={route.genre} />
          </>
        )}
        <Footer />
      </div>
    </div>
  );
}
