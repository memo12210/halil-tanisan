import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import Info from './components/Info';
import ProjectDetail from './components/ProjectDetail';
import Footer from './components/Footer';
import type { Genre, Project } from './components/types';

type Route =
  | { name: 'work'; genre: Genre | null }
  | { name: 'info' }
  | { name: 'project'; project: Project };

export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'work', genre: null });

  const go = (next: Route) => {
    setRoute(next);
    window.scrollTo(0, 0);
  };

  const headerView = route.name === 'info' ? 'info' : 'work';
  const activeGenre = route.name === 'work' ? route.genre : null;

  return (
    <div className="page">
      <div className="container">
        <Header
          view={headerView}
          activeGenre={activeGenre}
          onSelectGenre={(genre) => go({ name: 'work', genre })}
          onSelectInfo={() => go({ name: 'info' })}
        />
        {route.name === 'info' && <Info />}
        {route.name === 'project' && <ProjectDetail project={route.project} />}
        {route.name === 'work' && (
          <>
            <Hero
              key={route.genre ?? 'home'}
              activeGenre={route.genre}
              onOpen={(project) => go({ name: 'project', project })}
            />
            <ProjectGrid
              activeGenre={route.genre}
              onOpen={(project) => go({ name: 'project', project })}
            />
          </>
        )}
        <Footer />
      </div>
    </div>
  );
}
