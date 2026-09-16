import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Internal pages contain sample operations data, QA notes and commercial details.
// Keep them default-deny so a normal production deployment cannot expose them.
export default function InternalLayout({ children }: { children: React.ReactNode }) {
  if (process.env.ENABLE_INTERNAL_PREVIEWS !== "true") {
    notFound();
  }

  return (
    <html
      lang="en"
      dir="ltr"
      className={`${outfit.variable} ${plexArabic.variable} antialiased`}
      style={{ colorScheme: "light", background: "#f7f2e8" }}
    >
      <body className="min-h-[100dvh] bg-cream text-ink">{children}</body>
    </html>
  );
}
