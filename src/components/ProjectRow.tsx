import { useState } from 'react';
import type { CSSProperties } from 'react';
import { theme } from '../config/theme';
import type { Project } from './types';

interface ProjectRowProps {
  project: Project;
  /** Position among the visible rows; drives the staggered entrance animation. */
  index?: number;
}

export default function ProjectRow({ project, index = 0 }: ProjectRowProps) {
  const [hover, setHover] = useState(false);
  const showCaption = hover && theme.captions;

  return (
    <div
      className="row"
      style={{ '--i': index, '--frame-ratio': project.frameRatio } as CSSProperties}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="row-images">
        {project.images.map((src, i) => (
          <div className="row-image" key={i}>
            <img className="media-img" src={src} alt="" />
          </div>
        ))}
      </div>
      <div className="row-dim" data-active={hover} />
      <div className="row-caption" data-active={showCaption}>
        <span className="row-title">{project.title}</span>
        <span className="row-meta">{project.meta}</span>
      </div>
    </div>
  );
}
