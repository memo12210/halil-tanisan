import { useState } from 'react';
import type { CSSProperties } from 'react';
import { heroFor } from '../data/projects';
import type { Genre } from './types';

interface HeroProps {
  activeGenre: Genre;
}

export default function Hero({ activeGenre }: HeroProps) {
  const [hover, setHover] = useState(false);
  const project = heroFor(activeGenre);

  return (
    <section className="hero">
      <div
        className="hero-frame"
        style={{ '--frame-ratio': project.frameRatio } as CSSProperties}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="hero-image">
          <img className="media-img" src={project.thumbnail} alt="" />
        </div>
        <div className="hero-caption" data-active={hover}>
          <span className="hero-title">{project.title}</span>
          <span className="hero-credit">{project.meta}</span>
        </div>
      </div>
    </section>
  );
}
