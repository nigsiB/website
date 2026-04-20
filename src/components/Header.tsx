"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/work", label: "WORK" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/35 px-6 py-8 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="text-xs tracking-[0.35em] text-white/80 transition-colors hover:text-white md:text-sm">
          NIGSI<span className="brand-b">B</span>
        </Link>
        <nav className="flex gap-6 text-xs tracking-[0.25em] text-white/80 md:text-sm">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={isActive ? "text-white" : "hover:text-white"}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
