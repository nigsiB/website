import type { Metadata } from "next";

import { WorkSectionGrid } from "@/components/WorkSectionGrid";
import { WorkSubnav } from "@/components/WorkSubnav";
import { workSectionAccents, workSections } from "@/data/workSections";

export const metadata: Metadata = {
  title: "Branding Work",
  description: "Brand identity and visual system projects designed for clarity, consistency, and measurable brand impact.",
  alternates: {
    canonical: "/work/branding",
  },
};

export default function BrandingWorkPage() {
  const section = workSections.branding;

  return (
    <main className="px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs tracking-[0.3em] text-white/70">WORK</p>
        <h1 className="mt-3 display-title">{section.title}</h1>
        <WorkSubnav />
        <div className="mt-6 mb-8 h-[5px] w-full" style={{ backgroundColor: workSectionAccents.branding }} />
        <WorkSectionGrid section={section} />
      </div>
    </main>
  );
}
