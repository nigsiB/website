import Image from "next/image";

import type { WorkSection } from "@/data/workSections";
import { PdfImageLightbox } from "@/components/PdfImageLightbox";

type WorkSectionGridProps = {
  section: WorkSection;
};

export function WorkSectionGrid({ section }: WorkSectionGridProps) {
  return (
    <section className="mt-10">
      <p className="max-w-3xl text-sm leading-relaxed text-white/75">{section.intro}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {section.items.map((item) => (
          <article key={`${section.key}-${item.title}`} className="group border border-white/35 bg-black">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-white/30">
              {item.source === "pdf" ? (
                <PdfImageLightbox src={item.imagePath} alt={`${item.title} portfolio visual`} sizes="(max-width: 768px) 100vw, 50vw" />
              ) : (
                <>
                  <Image
                    src={item.imagePath}
                    alt={`${item.title} portfolio visual`}
                    fill
                    className="bg-black object-contain object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Launch ${item.title}`}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 text-xs tracking-[0.2em] text-white/80 opacity-0 transition-all duration-200 hover:bg-black/35 hover:opacity-100 focus-visible:bg-black/35 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                    >
                      LAUNCH SITE
                    </a>
                  ) : null}
                </>
              )}
            </div>
            <div className="space-y-3 p-5">
              <p className="text-[10px] tracking-[0.3em] text-white/70">{item.source === "pdf" ? "ARCHIVE PROJECT" : "LIVE PROJECT"}</p>
              <h3 className="text-2xl text-white">{item.title}</h3>
              <p className="text-xs leading-relaxed text-white/80">{item.summary}</p>
              <p className="text-[10px] tracking-[0.16em] text-white/60">{item.disciplines.toUpperCase()}</p>
              {item.source === "live" && item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[10rem] items-center justify-center border border-white px-3 py-1.5 text-xs tracking-[0.12em] !text-white visited:!text-white transition-colors duration-200 hover:bg-white hover:!text-black"
                >
                  VISIT LIVE SITE
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
