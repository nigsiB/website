import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Nigel Burt for selected freelance and long-term multidisciplinary design projects across web, brand, print, and exhibition.",
  keywords: [
    "contact freelance designer",
    "hire multidisciplinary designer",
    "web branding print designer UK",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
