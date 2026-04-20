import { projects } from "@/data/projects";
import { slugifyUrl } from "@/lib/slugify";

import { ProjectCard } from "./ProjectCard";

type ProjectGridProps = {
  limit?: number;
  latestOnly?: boolean;
  compact?: boolean;
};

export function ProjectGrid({ limit, latestOnly = false, compact = false }: ProjectGridProps) {
  const sourceProjects = latestOnly ? projects.filter((project) => project.latest) : projects;
  const visibleProjects = typeof limit === "number" ? sourceProjects.slice(0, limit) : sourceProjects;
  const gridClass = compact ? "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4" : "grid gap-6 md:grid-cols-2";

  return (
    <div className={gridClass}>
      {visibleProjects.map((project) => (
        <ProjectCard
          key={project.url}
          project={project}
          screenshotPath={`/screenshots/${slugifyUrl(project.url)}.png`}
          compact={compact}
        />
      ))}
    </div>
  );
}
