import { projects } from "@/data/projects";

import { ProjectCard } from "./ProjectCard";

const slugify = (url: string) =>
  url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

export function ProjectGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard
          key={project.url}
          project={project}
          screenshotPath={`/screenshots/${slugify(project.url)}.png`}
        />
      ))}
    </div>
  );
}
