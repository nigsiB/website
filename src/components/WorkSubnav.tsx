"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { workSectionOrder, workSections } from "@/data/workSections";

const allLinks = [
  { href: "/work", label: "Overview" },
  ...workSectionOrder.map((key) => ({
    href: `/work/${key}`,
    label: workSections[key].title,
  })),
];

export function WorkSubnav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-wrap gap-2 text-[11px] tracking-[0.18em]">
      {allLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive
                ? "border border-white bg-white px-3 py-2 !text-black visited:!text-black"
                : "border border-white/50 px-3 py-2 text-white/80 transition-colors hover:border-white hover:text-white"
            }
          >
            {link.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
