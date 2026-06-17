import { useState } from 'react';
import Plate from './Plate';
import { theme } from '../config/theme';
import type { Project } from './types';

interface ProjectTileProps {
  project: Project;
}

export default function ProjectTile({ project }: ProjectTileProps) {
  const [hover, setHover] = useState(false);
  const showCaption = hover && theme.captions;

  return (
    <div
      className="tile"
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
