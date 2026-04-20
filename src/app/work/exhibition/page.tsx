import { WorkSectionGrid } from "@/components/WorkSectionGrid";
import { WorkSubnav } from "@/components/WorkSubnav";
import { workSections } from "@/data/workSections";

export default function ExhibitionWorkPage() {
  const section = workSections.exhibition;

  return (
    <main className="px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs tracking-[0.3em] text-white/70">WORK</p>
        <h1 className="mt-3 display-title">{section.title}</h1>
        <WorkSubnav />
        <WorkSectionGrid section={section} />
      </div>
    </main>
  );
}
