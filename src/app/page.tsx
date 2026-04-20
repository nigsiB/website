import Link from "next/link";

import { ProjectGrid } from "@/components/ProjectGrid";

export default function Home() {
  return (
    <main>
      <section className="px-6 py-16 md:px-12 md:py-28">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs tracking-[0.3em] text-white/80">PORTFOLIO</p>
          <h1 className="mt-3 max-w-4xl text-6xl leading-[0.96] md:text-8xl">MULTIDISCIPLINARY DESIGN THAT SHIPS.</h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/75">
            Across digital, print, brand and exhibition, I design clear visual systems that perform in the real world.
            Explore the latest work here, then dive deeper across categories.
          </p>
        </div>
      </section>

      <section className="invert-panel px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-5xl md:text-6xl">LATEST WORK</h2>
          <p className="mt-3 max-w-2xl text-sm text-black/70">
            A rotating set of recent web and brand projects. Visit the Work pages for the full archive.
          </p>
          <div className="mt-8">
            <ProjectGrid latestOnly limit={4} compact />
          </div>
          <div className="mt-8 flex justify-center md:justify-start">
            <Link
              href="/work"
              className="inline-flex min-w-[10rem] items-center justify-center border border-black px-4 py-2 text-xs tracking-[0.2em] text-black transition-colors hover:bg-black hover:text-white"
            >
              VIEW MORE
            </Link>
          </div>
        </div>
      </section>

      <section className="invert-panel border-t border-black/10 px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto w-full max-w-6xl rounded-sm bg-white p-5 md:p-7">
          <div className="invert-dots flex flex-col gap-6 border border-black/15 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div>
              <p className="text-xs tracking-[0.3em] text-black/60">READY TO TALK?</p>
              <h2 className="mt-3 max-w-3xl text-4xl leading-[1.04] text-black md:text-6xl">Let&apos;s build your next project.</h2>
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
