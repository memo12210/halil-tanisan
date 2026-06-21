import Plate from './Plate';
import type { Project } from './types';

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article className="detail">
      <div className="detail-player">
        <Plate tone={project.tone} label={`${project.title} — film`} />
        <span className="detail-play" aria-hidden="true" />
      </div>

      <div className="detail-meta">
        <h1 className="detail-title">{project.title}</h1>
        <p className="detail-credit">{project.meta}</p>
        <p className="detail-credit">Format · {project.tag}</p>
      </div>
    </article>
  );
}
