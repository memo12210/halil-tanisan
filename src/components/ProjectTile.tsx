import { useState } from 'react';
import type { CSSProperties } from 'react';
import Plate from './Plate';
import { theme } from '../config/theme';
import type { Project } from './types';

interface ProjectTileProps {
  project: Project;
  /** Position in the visible grid; drives the staggered entrance animation. */
  index?: number;
}

export default function ProjectTile({ project, index = 0 }: ProjectTileProps) {
  const [hover, setHover] = useState(false);
  const showCaption = hover && theme.captions;

  return (
    <div
      className="tile"
      style={{ '--i': index } as CSSProperties}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="tile-image">
        <Plate tone={project.tone} label={project.file} tag={project.tag} />
      </div>
      <div className="tile-dim" data-active={hover} />
      <div className="tile-caption" data-active={showCaption}>
        <span className="tile-title">{project.title}</span>
        <span className="tile-meta">{project.meta}</span>
      </div>
    </div>
  );
}
