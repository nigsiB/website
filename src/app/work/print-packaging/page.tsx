import { WorkSectionGrid } from "@/components/WorkSectionGrid";
import { WorkSubnav } from "@/components/WorkSubnav";
import { workSectionAccents, workSections } from "@/data/workSections";

export default function PrintPackagingWorkPage() {
  const section = workSections["print-packaging"];

  return (
    <main className="px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs tracking-[0.3em] text-white/70">WORK</p>
        <h1 className="mt-3 display-title">{section.title}</h1>
        <WorkSubnav />
        <div className="mt-6 mb-8 h-[5px] w-full" style={{ backgroundColor: workSectionAccents[section.key] }} />
        <WorkSectionGrid section={section} />
      </div>
    </main>
  );
}
