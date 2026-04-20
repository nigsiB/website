import { PdfImageLightbox } from "@/components/PdfImageLightbox";

export default function AboutPage() {
  return (
    <main className="px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs tracking-[0.3em] text-white/70">ABOUT</p>
        <h1 className="mt-3 max-w-4xl text-5xl leading-[0.92] md:text-7xl">Award-winning multidisciplinary designer with 20+ years of delivery.</h1>
        <p className="mt-6 max-w-4xl text-sm leading-relaxed text-white/80">
          A UK-born and UK-based creative working across digital, brand, print and experiential systems. I build work that is
          concept-led, commercially focused and consistent across every touchpoint, from websites and campaigns to large-format
          event environments.
        </p>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-white/80">
          Disciplines include web/mobile design, brand identity, print, animation and photography. Career highlights include
          IVCA Gold and Silver, MIMA Silver, and NMA B2B Effectiveness recognition.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="border border-white/35 bg-black">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-white/30">
              <PdfImageLightbox src="/portfolio-pdf/page-01.jpg" alt="Portfolio profile spread" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="p-5">
              <p className="text-[10px] tracking-[0.3em] text-white/70">PROFILE</p>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                Core profile highlights and selected visuals are curated from archived portfolio material.
              </p>
            </div>
          </article>

          <article className="border border-white/35 bg-black">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-white/30">
              <PdfImageLightbox src="/portfolio-pdf/page-13.jpg" alt="Portfolio project collage" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="p-5">
              <p className="text-[10px] tracking-[0.3em] text-white/70">APPROACH</p>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                Every project starts with the brief, then moves through structured exploration, clear visual language, and
                production-ready outputs.
              </p>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
