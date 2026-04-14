import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Nigsib Portfolio",
  description: "Black and white portfolio with automated project screenshots.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
