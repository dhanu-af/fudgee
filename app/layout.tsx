import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Base metadata for the whole app (both the public storefront and the
// internal ops dashboard share this root layout). metadataBase is required
// for any relative OG/Twitter image URL to resolve to an absolute one.
// Storefront pages override title/description with their own; the dashboard
// additionally marks itself noindex in (dashboard)/layout.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Fudgee",
  description: "Fudgee — manufacturing operations platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${fredoka.variable}`}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
