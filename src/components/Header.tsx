export function Header() {
  return (
    <header className="border-b border-white/35 px-6 py-8 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <p className="text-xs tracking-[0.35em] text-white/80 md:text-sm">NIGSIB</p>
        <nav className="flex gap-6 text-xs tracking-[0.25em] text-white/80 md:text-sm">
          <a href="#work" className="hover:text-white">
            WORK
          </a>
          <a href="#about" className="hover:text-white">
            ABOUT
          </a>
          <a href="#contact" className="hover:text-white">
            CONTACT
          </a>
        </nav>
      </div>
    </header>
  );
}
