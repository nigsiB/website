export type PortfolioProject = {
  url: string;
  title: string;
  description: string;
  category: string;
  device: "desktop" | "tablet" | "mobile";
  latest?: boolean;
  /**
   * The live site is no longer reachable, so the project is presented from its
   * captured screenshot only: no outbound links, and `npm run screenshots`
   * skips it so the existing capture is never overwritten with a placeholder.
   */
  archived?: boolean;
  /**
   * Extra imagery for the /work case study, shown as a slideshow. The first
   * entry should be the site screenshot. The homepage grid stays single-image.
   */
  slideshowImages?: string[];
};

export const projects: PortfolioProject[] = [
  {
    url: "https://www.medellin-tour.com",
    title: "Tour de La Paz",
    description: "Luxury Medellin travel experience rooted in education and impact.",
    category: "Tourism",
    device: "desktop",
    latest: true,
  },
  {
    url: "https://wra-official.com",
    title: "WRA Official",
    description: "Personal platform centered on speaking, advocacy, and media.",
    category: "Personal Brand",
    device: "desktop",
    latest: true,
    archived: true,
    slideshowImages: [
      // Index 0 is the card thumbnail as well as the first slide - keep the
      // original site screenshot here.
      "/screenshots/wra-official-com.png",
      "/WRA/01-mission.webp",
      "/WRA/02-the-book.webp",
      "/WRA/03-the-truth.webp",
      "/WRA/04-the-past.webp",
      "/WRA/05-membership.webp",
      "/WRA/06-contact.webp",
    ],
  },
  {
    url: "https://kdcexclusive.com",
    title: "KDC Exclusive",
    description: "Celebrity-backed jewellery e-commerce with campaign storytelling.",
    category: "E-Commerce",
    device: "desktop",
    latest: true,
    archived: true,
    slideshowImages: [
      // Index 0 is the card thumbnail as well as the first slide - keep the
      // original site screenshot here.
      "/screenshots/kdcexclusive-com.png",
      "/KDC/01-about.webp",
      "/KDC/02-necklace-story.webp",
      "/KDC/03-collection.webp",
      "/KDC/04-shop.webp",
      "/KDC/05-contact.webp",
    ],
  },
  {
    url: "https://www.montrosesolicitors.co.uk",
    title: "Montrose Solicitors",
    description: "Branding + Website - UK law firm site focused on trust, clarity, and service depth.",
    category: "Legal",
    device: "desktop",
    latest: true,
  },
  {
    url: "https://www.ellyowenwine.com",
    title: "Elly Owen Wine",
    description: "Branding + Website - Sommelier and wine education brand with a polished editorial tone.",
    category: "Food and Drink",
    device: "desktop",
  },
  {
    url: "https://www.truecannagenetics.com",
    title: "True Canna Genetics",
    description: "Product-led seed genetics store with strong visual merchandising.",
    category: "E-Commerce",
    device: "desktop",
  },
];
