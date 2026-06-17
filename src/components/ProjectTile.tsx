import { useState } from 'react';
import Plate from './Plate';
import { theme } from '../config/theme';
import type { Project } from './types';
import styles from './ProjectTile.module.css';

interface ProjectTileProps {
  project: Project;
}

export default function ProjectTile({ project }: ProjectTileProps) {
  const [hover, setHover] = useState(false);
  const showCaption = hover && theme.captions;

  return (
    <div
      className={styles.tile}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={styles.image}>
        <Plate tone={project.tone} label={project.file} tag={project.tag} />
      </div>
      <div className={styles.dim} data-active={hover} />
      <div className={styles.caption} data-active={showCaption}>
        <span className={styles.title}>{project.title}</span>
        <span className={styles.meta}>{project.meta}</span>
      </div>
    </div>
  );
}
