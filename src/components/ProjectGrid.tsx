import ProjectTile from './ProjectTile';
import { projects } from '../data/projects';

export default function ProjectGrid() {
  return (
    <div className="grid">
      {projects.map((project) => (
        <ProjectTile key={project.file} project={project} />
      ))}
    </div>
  );
}
