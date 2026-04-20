export default function ContactPage() {
  return (
    <main className="invert-panel px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-5xl md:text-6xl">CONTACT</h1>
        <p className="mt-4 max-w-2xl text-sm text-black/80">Available for selected freelance and long-term projects.</p>
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
    </main>
  );
}
