import ProjectRow from './ProjectRow';
import { gridFor } from '../data/projects';
import type { Genre } from './types';

interface ProjectGridProps {
  activeGenre: Genre;
}

export default function ProjectGrid({ activeGenre }: ProjectGridProps) {
  const visible = gridFor(activeGenre);

  return (
    <div className="rows" key={activeGenre}>
      {visible.map((project, index) => (
        <ProjectRow key={project.title} project={project} index={index} />
      ))}
    </div>
  );
}
