import type { Metadata } from "next";
import Link from "next/link";

import { ProjectGrid } from "@/components/ProjectGrid";
import { workSectionAccents, workSectionOrder, workSections } from "@/data/workSections";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Multidisciplinary design portfolio featuring web, branding, print, and exhibition projects with real-world commercial outcomes.",
  keywords: [
    "multidisciplinary designer",
    "freelance designer UK",
    "branding design portfolio",
    "web design portfolio",
    "print and exhibition design",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      <section className="px-6 py-16 md:px-12 md:py-28">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs tracking-[0.3em] text-white/80">PORTFOLIO</p>
          <h1 className="display-hero mt-3 max-w-4xl">MULTIDISCIPLINARY DESIGN THAT SHIPS.</h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/75">
            I am a UK multidisciplinary designer delivering brand, web, print, and exhibition projects that perform in the
            real world. Explore selected work below, or get in touch to discuss your next project.
          </p>
        </div>
      </section>

      <section className="invert-panel px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="display-title">LATEST WORK</h2>
          <p className="mt-3 max-w-2xl text-sm text-black/70">
            A rotating set of recent web and brand projects. Visit the Work pages for the full archive.
          </p>
          <div className="mt-8">
            <ProjectGrid latestOnly limit={4} compact />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Link
              href="/work"
              className="inline-flex min-w-[10rem] items-center justify-center border border-black px-4 py-2 text-xs tracking-[0.2em] text-black transition-colors hover:bg-black hover:!text-white"
            >
              VIEW MORE
            </Link>
            {workSectionOrder.map((sectionKey) => {
              const section = workSections[sectionKey];
              const accent = workSectionAccents[sectionKey];

              return (
                <Link
                  key={sectionKey}
                  href={`/work/${sectionKey}`}
                  className="inline-flex items-center justify-center border px-4 py-2 text-[11px] tracking-[0.18em] text-black transition-colors hover:bg-black hover:!text-white"
                  style={{
                    borderColor: `${accent}cc`,
                    backgroundImage: `repeating-linear-gradient(135deg, ${accent}14 0 6px, transparent 6px 12px)`,
                  }}
                >
                  {section.title.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="invert-panel border-t border-black/10 px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto w-full max-w-6xl rounded-sm bg-white p-5 md:p-7">
          <div className="invert-dots flex flex-col gap-6 border border-black/15 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div>
              <p className="text-xs tracking-[0.3em] text-black/60">READY TO TALK?</p>
              <h2 className="display-title mt-3 max-w-3xl text-black">Let&apos;s build your next project.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/70">
                If you need strategic design across web, branding, print or exhibition, I&apos;m available for selected projects.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-w-[13rem] items-center justify-center border border-black bg-white px-5 py-3 text-xs tracking-[0.2em] text-black transition-colors hover:bg-black hover:text-white"
            >
              get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
