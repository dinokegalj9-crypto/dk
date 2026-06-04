import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import VoidSystem from "@/components/atmosphere/VoidSystem";
import Chrome from "@/components/layout/Chrome";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sensorium.example"),
  title: {
    default: "Sensorium — You have been here before",
    template: "%s · Sensorium",
  },
  description:
    "Sensorium explores memory, emotion, and forgotten experience through scent. Some things you didn't lose. You just stopped visiting them.",
  openGraph: {
    title: "Sensorium",
    description: "Some things you didn't lose. You just stopped visiting them.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-collection="default">
      {/* Fonts: the two voices. Resilient <link> for now; production
          migrates to self-hosted next/font/local with metric-matched
          fallbacks to close the FOUT seam (doc 11 §B6). */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <body>
        <Providers>
          {/* The Void is mounted once here and persists across every
              navigation — the world is never broken between scenes. */}
          <VoidSystem>
            <Chrome />
            {children}
            <Footer />
          </VoidSystem>
        </Providers>
      </body>
    </html>
  );
}
