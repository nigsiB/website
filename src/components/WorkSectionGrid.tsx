import Image from "next/image";

import type { WorkSection } from "@/data/workSections";
import { ImageSlideshowLightbox } from "@/components/ImageSlideshowLightbox";
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
              {item.slideshowImages?.length ? (
                <ImageSlideshowLightbox
                  images={item.slideshowImages}
                  alt={`${item.title} project slideshow`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : item.source === "pdf" ? (
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
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 text-sm font-black tracking-[0.24em] text-white/90 opacity-0 transition-all duration-200 hover:bg-black/35 hover:opacity-100 focus-visible:bg-black/35 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
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
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
