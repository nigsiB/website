import { projects } from "@/data/projects";
import { slugifyUrl } from "@/lib/slugify";

export const workSectionOrder = ["branding", "web-interactive", "print-packaging", "exhibition"] as const;
export type WorkSectionKey = (typeof workSectionOrder)[number];

export type WorkItem = {
  title: string;
  summary: string;
  disciplines: string;
  imagePath: string;
  source: "pdf" | "live";
  url?: string;
};

export type WorkSection = {
  key: WorkSectionKey;
  title: string;
  intro: string;
  items: WorkItem[];
};

const webFromLive: WorkItem[] = projects.map((project) => ({
  title: project.title,
  summary: project.description,
  disciplines: "Web Design, UX/UI, Frontend Delivery",
  imagePath: `/screenshots/${slugifyUrl(project.url)}.png`,
  source: "live",
  url: project.url,
}));

export const workSections: Record<WorkSectionKey, WorkSection> = {
  branding: {
    key: "branding",
    title: "Branding",
    intro:
      "Identity systems from logo exploration to applied campaign assets, presented as a curated archive of brand work.",
    items: [
      {
        title: "Brand Design: Client (Various)",
        summary:
          "A broad set of logo studies translating client values into clear visual language across different sectors.",
        disciplines: "Identity Design, Brand Systems, Art Direction",
        imagePath: "/portfolio-pdf/page-04.jpg",
        source: "pdf",
      },
      {
        title: "G-Vape",
        summary:
          "Developed a fresh brand and packaging system to differentiate product lines and improve shelf impact.",
        disciplines: "Brand Design, Packaging, Graphic Design",
        imagePath: "/portfolio-pdf/page-11.jpg",
        source: "pdf",
      },
      {
        title: "The Hydroponic Expo 2019",
        summary:
          "Built brand language and visual consistency across web, social, event collateral, and large-format placements.",
        disciplines: "Branding, Campaign Design, Environmental Graphics",
        imagePath: "/portfolio-pdf/page-10.jpg",
        source: "pdf",
      },
      {
        title: "Wellan 2000 Africa",
        summary:
          "Creative direction across product launches and campaigns with consistent branding across digital, print, and exhibition channels.",
        disciplines: "Creative Direction, Brand Systems, Campaign Design",
        imagePath: "/portfolio-pdf/page-13.jpg",
        source: "pdf",
      },
    ],
  },
  "web-interactive": {
    key: "web-interactive",
    title: "Web + Interactive",
    intro: "Web and interactive work spanning live launches and standout campaigns from earlier eras.",
    items: [
      ...webFromLive,
      {
        title: "Panasonic VS3 Pan-European Launch",
        summary:
          "Integrated viral web and in-store animation campaign supporting a major mobile product launch.",
        disciplines: "3D, Video, Flash Animation, Interactive Production",
        imagePath: "/portfolio-pdf/page-05.jpg",
        source: "pdf",
      },
      {
        title: "Samsung Arcade",
        summary:
          "Bespoke retro platform game built to demonstrate and promote device capabilities to reseller audiences.",
        disciplines: "Concept, Sprite Animation, Unity Authoring",
        imagePath: "/portfolio-pdf/page-06.jpg",
        source: "pdf",
      },
      {
        title: "BT Openzone E-Learning",
        summary:
          "SCORM-compliant interactive course designed to educate sales teams and improve product adoption.",
        disciplines: "E-Learning UX, Flash Authoring, Interaction Design",
        imagePath: "/portfolio-pdf/page-12.jpg",
        source: "pdf",
      },
      {
        title: "Wellan 2000 Africa",
        summary:
          "Developed and maintained web and digital communications to support product positioning and customer education.",
        disciplines: "Web Design, Digital Communications, Marketing Support",
        imagePath: "/portfolio-pdf/page-13.jpg",
        source: "pdf",
      },
    ],
  },
  "print-packaging": {
    key: "print-packaging",
    title: "Print + Packaging",
    intro: "Editorial, promotional and packaging outputs designed for clarity, conversion and brand consistency.",
    items: [
      {
        title: "G-Vape Packaging",
        summary:
          "Designed packaging hierarchy, regulatory callouts and visual tone for initial CBD product range.",
        disciplines: "Packaging Design, Graphic Systems",
        imagePath: "/portfolio-pdf/page-11.jpg",
        source: "pdf",
      },
      {
        title: "The London Cabaret Club",
        summary:
          "Produced event posters, menus, invitations and digital support assets for ongoing shows and promotions.",
        disciplines: "Print Design, Campaign Artworking, Motion Support",
        imagePath: "/portfolio-pdf/page-15.jpg",
        source: "pdf",
      },
      {
        title: "Brochures, Tri-Folds & Print Ads",
        summary:
          "A curated print set including brochures, event guides and ad formats for diverse client campaigns.",
        disciplines: "Editorial Design, Advertising Layout, Production Artwork",
        imagePath: "/portfolio-pdf/page-16.jpg",
        source: "pdf",
      },
      {
        title: "Wellan 2000 Africa Print Campaigns",
        summary:
          "Delivered brochures, print adverts, and exhibition-ready marketing collateral with strong product storytelling.",
        disciplines: "Print Advertising, Brochure Design, Production",
        imagePath: "/portfolio-pdf/page-13.jpg",
        source: "pdf",
      },
    ],
  },
  exhibition: {
    key: "exhibition",
    title: "Exhibition",
    intro:
      "Large-scale event identity and environmental rollout spanning signage, wayfinding, social and digital ad placements.",
    items: [
      {
        title: "Product Earth 2016",
        summary:
          "Delivered full event branding with consistent assets across showground signage, print and promotional channels.",
        disciplines: "Exhibition Branding, Large Format, Wayfinding",
        imagePath: "/portfolio-pdf/page-07.jpg",
        source: "pdf",
      },
      {
        title: "Product Earth 2017",
        summary:
          "Evolved the event identity for a new urban venue and delivered integrated digital, print, and on-site collateral.",
        disciplines: "Branding, Print, Digital, Large Format",
        imagePath: "/portfolio-pdf/page-08.jpg",
        source: "pdf",
      },
      {
        title: "Product Earth 2019",
        summary:
          "Expanded the campaign with responsive web, DOOH placements, bus advertising and on-site collateral.",
        disciplines: "Branding, DOOH, Web, Print, Vehicle Livery",
        imagePath: "/portfolio-pdf/page-09.jpg",
        source: "pdf",
      },
      {
        title: "The Hydroponic Expo 2019",
        summary:
          "Developed event identity and rollout assets spanning web, social, print and large-format exhibition communications.",
        disciplines: "Branding, Web, Digital, Large Format Exhibition",
        imagePath: "/portfolio-pdf/page-10.jpg",
        source: "pdf",
      },
      {
        title: "Wellan 2000 Africa",
        summary:
          "Creative direction across exhibitions, product launches, brochures and customer-facing print campaigns.",
        disciplines: "Creative Direction, Print Advertising, Exhibition Systems",
        imagePath: "/portfolio-pdf/page-13.jpg",
        source: "pdf",
      },
    ],
  },
};
