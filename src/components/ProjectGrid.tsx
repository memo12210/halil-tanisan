import ProjectTile from './ProjectTile';
import { projects } from '../data/projects';
import type { Genre } from './types';

interface ProjectGridProps {
  activeGenre: Genre | null;
}

export default function ProjectGrid({ activeGenre }: ProjectGridProps) {
  const visible = activeGenre
    ? projects.filter((project) => project.genre === activeGenre)
    : projects;

  return (
    <div className="grid" key={activeGenre ?? 'all'}>
      {visible.map((project, index) => (
        <ProjectTile key={project.title} project={project} index={index} />
      ))}
    </div>
  );
}
