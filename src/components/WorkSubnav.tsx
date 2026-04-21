"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { workSectionAccents, workSectionOrder, workSections, type WorkSectionKey } from "@/data/workSections";

const allLinks = [
  { href: "/work", label: "Overview", sectionKey: null as WorkSectionKey | null },
  ...workSectionOrder.map((key) => ({
    href: `/work/${key}`,
    label: workSections[key].title,
    sectionKey: key,
  })),
];

export function WorkSubnav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-wrap gap-2 text-[11px] tracking-[0.18em]">
      {allLinks.map((link) => {
        const isActive = pathname === link.href;
        const accent = link.sectionKey ? workSectionAccents[link.sectionKey] : null;

        const className = isActive
          ? "border px-3 py-2 font-semibold visited:!text-black"
          : "border px-3 py-2 transition-colors";

        const style = isActive
          ? accent
            ? {
                borderColor: accent,
                color: "rgba(255,255,255,0.92)",
                backgroundImage: `repeating-linear-gradient(135deg, ${accent}33 0 8px, transparent 8px 16px)`,
              }
            : { backgroundColor: "#ffffff", borderColor: "#ffffff", color: "#000000" }
          : accent
            ? { borderColor: `${accent}99`, color: "rgba(255,255,255,0.8)" }
            : { borderColor: "rgba(255,255,255,0.5)", color: "rgba(255,255,255,0.8)" };

        return (
          <Link key={link.href} href={link.href} className={className} style={style}>
            {link.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
