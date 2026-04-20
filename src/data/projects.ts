export type PortfolioProject = {
  url: string;
  title: string;
  description: string;
  category: string;
  device: "desktop" | "tablet" | "mobile";
  latest?: boolean;
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
  },
  {
    url: "https://kdcexclusive.com",
    title: "KDC Exclusive",
    description: "Celebrity-backed jewellery e-commerce with campaign storytelling.",
    category: "E-Commerce",
    device: "mobile",
    latest: true,
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
    device: "mobile",
  },
];
