import ProjectTile from './ProjectTile';
import { projects } from '../data/projects';
import styles from './ProjectGrid.module.css';

export default function ProjectGrid() {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <ProjectTile key={project.file} project={project} />
      ))}
    </div>
  );
}
