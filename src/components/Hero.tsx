import { useState } from 'react';
import Plate from './Plate';
import { featured } from '../data/projects';

export default function Hero() {
  const [hover, setHover] = useState(false);

  return (
    <section className="hero">
      <div
        className="hero-frame"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="hero-image">
          <Plate tone={featured.tone} label={featured.file} tag={featured.tag} />
        </div>
        <div className="hero-dim" />
        <div className="hero-veil" data-active={hover} />
        <div className="hero-overlay" data-active={hover}>
          <div className="hero-featured">{featured.label}</div>
          <div className="hero-caption">
            <div className="hero-title">{featured.title}</div>
            <div className="hero-credit">{featured.credit}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
