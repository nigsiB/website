import Image from "next/image";

import type { PortfolioProject } from "@/data/projects";

type ProjectCardProps = {
  project: PortfolioProject;
  screenshotPath: string;
};

export function ProjectCard({ project, screenshotPath }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-none border border-white/45 bg-black">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={screenshotPath}
          alt={`${project.title} screenshot`}
          fill
          className="object-cover grayscale transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
      </div>
      <div className="space-y-3 border-t border-white/35 p-5">
        <p className="text-[10px] tracking-[0.3em] text-white/70">{project.category.toUpperCase()}</p>
        <h3 className="text-2xl">{project.title}</h3>
        <p className="text-xs leading-relaxed text-white/75">{project.description}</p>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex border border-white px-3 py-1.5 text-[10px] tracking-[0.25em] transition hover:bg-white hover:text-black"
        >
          VISIT SITE
        </a>
      </div>
    </article>
  );
}
