import Link from "next/link";

import { WorkSubnav } from "@/components/WorkSubnav";
import { workSectionOrder, workSections } from "@/data/workSections";

export default function WorkIndexPage() {
  return (
    <main className="px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs tracking-[0.3em] text-white/70">WORK</p>
        <h1 className="mt-3 display-title">Portfolio Archive</h1>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/80">
          Browse work by discipline. Sections combine live project captures with curated visuals and concise case-study summaries.
        </p>
        <WorkSubnav />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {workSectionOrder.map((key) => {
            const section = workSections[key];
            return (
              <Link
                key={section.key}
                href={`/work/${section.key}`}
                className="block border border-white/35 bg-black p-6 transition-colors hover:border-white"
              >
                <p className="text-[10px] tracking-[0.3em] text-white/70">SECTION</p>
                <h2 className="mt-3 text-3xl text-white">{section.title}</h2>
                <p className="mt-4 text-xs leading-relaxed text-white/75">{section.intro}</p>
                <p className="mt-4 text-[10px] tracking-[0.2em] text-white/60">{section.items.length} PROJECTS</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
