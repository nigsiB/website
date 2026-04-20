"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import type { PortfolioProject } from "@/data/projects";

type ProjectCardProps = {
  project: PortfolioProject;
  screenshotPath: string;
};

export function ProjectCard({ project, screenshotPath }: ProjectCardProps) {
  const placeholderSrc = useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='900' viewBox='0 0 1440 900'>
      <rect width='1440' height='900' fill='black'/>
      <text x='80' y='430' fill='white' font-size='64' font-family='Arial, sans-serif'>Screenshot unavailable</text>
      <text x='80' y='500' fill='white' font-size='30' font-family='monospace'>${project.url}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }, [project.url]);

  const [imageSrc, setImageSrc] = useState(screenshotPath);
  const frameClass =
    project.device === "mobile"
      ? "device-frame device-mobile"
      : project.device === "tablet"
        ? "device-frame device-tablet"
        : "device-frame device-desktop";

  return (
    <article className="group overflow-hidden rounded-none border border-white/45 bg-black">
      <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden p-4 sm:p-8">
        <div className={frameClass}>
          <Image
            src={imageSrc}
            alt={`${project.title} screenshot`}
            fill
            unoptimized
            className="object-cover object-top transition duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageSrc(placeholderSrc)}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className="space-y-3 border-t border-white/35 p-5">
        <p className="text-[10px] tracking-[0.3em] text-white/70">{project.category.toUpperCase()}</p>
        <h3 className="text-2xl">{project.title}</h3>
        <p className="text-xs leading-relaxed text-white/75">{project.description}</p>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-[7.5rem] items-center justify-center border border-white px-3 py-1.5 text-xs leading-none tracking-[0.12em] !text-white visited:!text-white transition-colors duration-200 hover:bg-white hover:!text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:bg-white/90 active:!text-black"
          style={{ color: "#ffffff" }}
        >
          VISIT SITE
        </a>
      </div>
    </article>
  );
}
