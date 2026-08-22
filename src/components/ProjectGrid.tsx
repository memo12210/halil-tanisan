import ProjectRow from './ProjectRow';
import { gridFor } from '../data/projects';
import type { Genre, Project } from './types';

interface ProjectGridProps {
  activeGenre: Genre;
  onOpen: (project: Project) => void;
}

export default function ProjectGrid({ activeGenre, onOpen }: ProjectGridProps) {
  const visible = gridFor(activeGenre);

  return (
    <div className="rows" key={activeGenre}>
      {visible.map((project, index) => (
        <ProjectRow
          key={project.title}
          project={project}
          index={index}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
