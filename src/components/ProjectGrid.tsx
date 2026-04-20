import { projects } from "@/data/projects";
import { slugifyUrl } from "@/lib/slugify";

import { ProjectCard } from "./ProjectCard";

type ProjectGridProps = {
  limit?: number;
  latestOnly?: boolean;
};

export function ProjectGrid({ limit, latestOnly = false }: ProjectGridProps) {
  const sourceProjects = latestOnly ? projects.filter((project) => project.latest) : projects;
  const visibleProjects = typeof limit === "number" ? sourceProjects.slice(0, limit) : sourceProjects;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {visibleProjects.map((project) => (
        <ProjectCard
          key={project.url}
          project={project}
          screenshotPath={`/screenshots/${slugifyUrl(project.url)}.png`}
        />
      ))}
    </div>
  );
}
