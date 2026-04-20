export type PortfolioProject = {
  url: string;
  title: string;
  description: string;
  category: string;
  device: "desktop" | "tablet" | "mobile";
};

export const projects: PortfolioProject[] = [
  {
    url: "https://www.medellin-tour.com",
    title: "Tour de La Paz",
    description: "Luxury Medellin travel experience rooted in education and impact.",
    category: "Tourism",
    device: "desktop",
  },
  {
    url: "https://www.ednmanagement.com",
    title: "EDN Management",
    description: "Artist and talent management with a clean corporate presentation.",
    category: "Entertainment",
    device: "mobile",
  },
  {
    url: "https://www.montrosesolicitors.co.uk",
    title: "Montrose Solicitors - Branding and website",
    description: "UK law firm site focused on trust, clarity, and service depth.",
    category: "Legal",
    device: "desktop",
  },
  {
    url: "https://www.ellyowenwine.com",
    title: "Elly Owen Wine",
    description: "Sommelier and wine education brand with a polished editorial tone.",
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
  {
    url: "https://de-odr.com",
    title: "DE-ODR",
    description: "Online dispute-resolution platform concept and product narrative.",
    category: "Legal Tech",
    device: "tablet",
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
  },
];
