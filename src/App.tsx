import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import Footer from './components/Footer';
import type { Genre } from './components/types';

export default function App() {
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null);

  return (
    <div className="page">
      <div className="container">
        <Header activeGenre={activeGenre} onSelectGenre={setActiveGenre} />
        <Hero />
        <ProjectGrid activeGenre={activeGenre} />
        <Footer />
      </div>
    </div>
  );
}
