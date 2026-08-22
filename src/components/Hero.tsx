import { useState } from 'react';
import type { CSSProperties } from 'react';
import { heroFor } from '../data/projects';
import type { Genre, Project } from './types';

interface HeroProps {
  activeGenre: Genre;
  onOpen: (project: Project) => void;
}

export default function Hero({ activeGenre, onOpen }: HeroProps) {
  const [hover, setHover] = useState(false);
  const project = heroFor(activeGenre);

  return (
    <section className="hero">
      <button
        type="button"
        className="hero-frame"
        style={{ '--frame-ratio': project.frameRatio } as CSSProperties}
        aria-label={`${project.title} — ${project.meta}`}
        onClick={() => onOpen(project)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        <div className="hero-image">
          <img className="media-img" src={project.thumbnail} alt="" />
        </div>
        <div className="hero-caption" data-active={hover}>
          <span className="hero-title">{project.title}</span>
          <span className="hero-credit">{project.meta}</span>
        </div>
      </button>
    </section>
  );
}
