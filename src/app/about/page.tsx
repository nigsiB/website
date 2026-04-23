import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Nigel Burt: an award-winning multidisciplinary designer with almost 30 years across digital, branding, print, and experiential design.",
  keywords: [
    "Nigel Burt designer",
    "award-winning designer",
    "brand and web designer",
    "freelance creative director",
  ],
  alternates: {
    canonical: "/about",
  },
};

const workHistory = [
  {
    period: "Sept 2016 - Present",
    role: "Integrated Designer (Contractor/Freelance)",
    company: "Independent",
    summary:
      "Delivered long-term cross-channel contracts spanning expo and festival campaigns, web and e-commerce delivery, digital promotion, print systems, and event collateral.",
  },
  {
    period: "Oct 2016 - Jan 2017",
    role: "Freelance Creative Designer",
    company: "LONDON CABARET CLUB - Live Entertainment Venue",
    summary: "Produced promotional design, social content, and motion/video assets for premium live event marketing.",
  },
  {
    period: "June 2015 - Oct 2015",
    role: "Video Producer (Contract)",
    company: "Bizlink.link, Johannesburg",
    summary:
      "Defined visual brand style and produced onboarding, how-to, and introductory animation-led video content for a business social platform.",
  },
  {
    period: "Sept 2012 - Jan 2016",
    role: "Creative Director",
    company: "Wellan 2000 Africa, Johannesburg",
    summary:
      "Led creative output across brand, web, print, and social channels while supporting product marketing and customer communications.",
  },
  {
    period: "Nov 2007 - Aug 2008",
    role: "Multimedia Developer",
    company: "McMenemy Hill Live Communications",
    summary:
      "Created campaign concepts and supporting assets including event branding, web content, email marketing, 3D visualisation, and animation.",
  },
  {
    period: "June 2006 - Nov 2007",
    role: "Multimedia Developer",
    company: "Symbius Ltd",
    summary: "Delivered flash, video, and 3D work for high-profile clients and advised on new multimedia service capabilities.",
  },
  {
    period: "Sept 2001 - June 2002",
    role: "New Media Interactive Designer",
    company: "IQdos (e-Learning Consultancy)",
    summary: "Designed and produced 2D/3D animation, audiovisual and interactive learning media, including iTV learning research.",
  },
  {
    period: "March 1999 - Sept 2001",
    role: "Senior Designer / Project Manager",
    company: "Matinee Sound & Vision",
    summary:
      "Managed projects end-to-end from client briefing to production delivery across online and offline media for a diverse client base.",
  },
];

export default function AboutPage() {
  return (
    <main className="px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs tracking-[0.3em] text-white/70">ABOUT</p>
        <h1 className="mt-3 max-w-4xl display-title">Award-winning multidisciplinary designer with almost 30 years of delivery.</h1>
        <p className="mt-6 max-w-4xl text-sm leading-relaxed text-white/80">
          A UK-born and UK-based creative working across digital, brand, print and experiential systems. I build work that is
          concept-led, commercially focused and consistent across every touchpoint, from websites and campaigns to large-format
          event environments.
        </p>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-white/80">
          Disciplines include web/mobile design, brand identity, print, animation and photography. Career highlights include
          IVCA Gold and Silver, MIMA Silver, and NMA B2B Effectiveness recognition.
        </p>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-white/80">
          Explore the{" "}
          <Link href="/work" className="underline decoration-white/50 underline-offset-4 transition-colors hover:text-white">
            full portfolio archive
          </Link>{" "}
          or{" "}
          <Link
            href="/contact"
            className="underline decoration-white/50 underline-offset-4 transition-colors hover:text-white"
          >
            contact me
          </Link>{" "}
          to discuss an upcoming project.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="border border-white/35 bg-black p-5">
            <div>
              <div className="relative float-left mr-4 mb-[3px] h-28 w-28 overflow-hidden border border-white/25">
                <Image
                  src="/images/nigel-profile.png"
                  alt="Nigel Burt portrait"
                  fill
                  className="object-cover grayscale"
                  sizes="112px"
                />
              </div>
              <p className="text-[10px] tracking-[0.3em] text-white/70">PROFILE</p>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                Nearly three decades of multidisciplinary creative delivery across digital, print, motion, branding and
                experiential projects for agencies, brands and founder-led businesses.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-white/80">
                My core approach is still the same: solve the brief properly, build a tailored concept that genuinely fits the
                audience, then execute with precision and clarity across every touchpoint.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-white/80">
                Alongside design direction, I usually lead projects from first client conversations through planning, production and
                delivery, balancing creativity, timescales and commercial outcomes.
              </p>
              <div className="clear-both" />
            </div>
          </article>

          <article className="border border-white/35 bg-black p-5">
            <p className="text-[10px] tracking-[0.3em] text-white/70">CAPABILITIES</p>
            <p className="mt-2 text-xs leading-relaxed text-white/80">
              Digital design (web/mobile/DOOH), brand systems, print campaigns, video and animation, photography, and production
              rollout. Platform/tool experience includes Adobe CC, 3D Studio Max, Squarespace, HTML/CSS, and coding in Cursor.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/80">
              I am evolving as a creative, utilising AI systems, image and video generation, and modern coding workflows to stay
              current with the latest tools while moving from concept to polished output at pace.
            </p>
            <p className="mt-4 text-[10px] tracking-[0.3em] text-white/70">RECOGNITION</p>
            <p className="mt-2 text-xs leading-relaxed text-white/80">
              Awards include IVCA Gold, IVCA Silver, MIMA Silver, and NMA B2B Effectiveness.
            </p>
          </article>
        </div>

        <div className="mt-10">
          <p className="text-xs tracking-[0.3em] text-white/70">A BRIEF WORK HISTORY</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {workHistory.map((item, index) => (
              <article key={`${item.period}-${item.role}`} className="relative border border-white/30 bg-black p-5">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2 right-3 text-4xl leading-none font-black text-white/10"
                >
                  {workHistory.length - index}
                </span>
                <p className="text-[10px] tracking-[0.25em] text-white/60">{item.period.toUpperCase()}</p>
                <h3 className="mt-2 text-2xl text-white">{item.role}</h3>
                <p className="mt-1 text-xs tracking-[0.16em] text-white/65">{item.company.toUpperCase()}</p>
                <p className="mt-3 text-xs leading-relaxed text-white/80">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
