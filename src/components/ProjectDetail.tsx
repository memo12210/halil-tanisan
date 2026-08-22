import type { Project } from './types';

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article className="detail">
      <div className="detail-player">
        <video
          className="media-video"
          src={project.video}
          poster={project.thumbnail}
          controls
          playsInline
          preload="metadata"
        />
      </div>

      <div className="detail-meta">
        <h1 className="detail-title">{project.title}</h1>
        <p className="detail-credit">{project.meta}</p>
        <p className="detail-credit">Format · {project.tag}</p>
      </div>
    </article>
  );
}
