import type { Metadata } from "next";
import { PublicNavigationHistory } from "@/shared/layout/public-navigation-history";
import { rootMetadata } from "@/features/home/metadata";
import "./globals.css";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body><PublicNavigationHistory /><a className="skip-link" href="#main-content">Skip to main content</a>{children}</body></html>;
}
