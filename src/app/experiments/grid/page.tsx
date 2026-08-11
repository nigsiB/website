import type { Metadata } from "next";

import { PortfolioGridPrototype } from "@/components/PortfolioGridPrototype";

export const metadata: Metadata = {
  title: "Experiments / Grid",
  description:
    "Prototype portfolio interface exploring two-axis navigation across disciplines and projects using fullscreen imagery.",
  alternates: {
    canonical: "/experiments/grid",
  },
};

export default function GridExperimentPage() {
  return <PortfolioGridPrototype />;
}
