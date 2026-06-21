import ProjectTile from './ProjectTile';
import { gridFor } from '../data/projects';
import type { Genre, Project } from './types';

interface ProjectGridProps {
  activeGenre: Genre | null;
  onOpen: (project: Project) => void;
}

export default function ProjectGrid({ activeGenre, onOpen }: ProjectGridProps) {
  const visible = gridFor(activeGenre);

  return (
    <div className="grid" key={activeGenre ?? 'all'}>
      {visible.map((project, index) => (
        <ProjectTile
          key={project.title}
          project={project}
          index={index}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
