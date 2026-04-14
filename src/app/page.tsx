import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProjectGrid } from "@/components/ProjectGrid";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="px-6 py-16 md:px-12 md:py-28">
          <div className="mx-auto w-full max-w-6xl">
            <p className="text-xs tracking-[0.3em] text-white/80">PORTFOLIO</p>
            <h1 className="mt-3 max-w-4xl text-6xl leading-[0.9] md:text-8xl">SUPER BLACK WHITE POLKA DOT SHIT.</h1>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/75">
              I design and build websites that punch hard, load fast, and convert. This page auto-generates project screenshots
              from a simple URL list, so adding fresh work takes minutes.
            </p>
          </div>
        </section>

        <section id="work" className="invert-panel px-6 py-14 md:px-12 md:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-5xl md:text-6xl">LATEST WORK</h2>
            <p className="mt-3 max-w-2xl text-sm text-black/70">
              Curated projects across tourism, legal, personal brands, and e-commerce.
            </p>
            <div className="mt-8">
              <ProjectGrid />
            </div>
          </div>
        </section>

        <section id="about" className="px-6 py-14 md:px-12 md:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-5xl md:text-6xl">ABOUT</h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
              I partner with founders, teams, and brands who want bold digital presence. From concept to launch, I build
              strategic websites with clean architecture, sharp design systems, and production-ready code on modern stacks.
            </p>
          </div>
        </section>

        <section id="contact" className="invert-panel px-6 py-14 md:px-12 md:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-5xl md:text-6xl">CONTACT</h2>
            <p className="mt-4 max-w-2xl text-sm text-black/80">
              Available for selected freelance and long-term projects.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs tracking-[0.25em]">
              <a className="border border-black px-4 py-2 hover:bg-black hover:text-white" href="mailto:hello@example.com">
                HELLO@EXAMPLE.COM
              </a>
              <a className="border border-black px-4 py-2 hover:bg-black hover:text-white" href="#">
                INSTAGRAM
              </a>
              <a className="border border-black px-4 py-2 hover:bg-black hover:text-white" href="#">
                LINKEDIN
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
