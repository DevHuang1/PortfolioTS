import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import CommandPaletteShell from "@/components/CommandPalette";
import { EDUCATION, PROFILE } from "@/data/portfolio";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${PROFILE.domain}`
).replace(/\/+$/, "");

const pageTitle = `${PROFILE.name} — ${PROFILE.headline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle,
    template: `%s — ${PROFILE.name}`,
  },
  description: PROFILE.summary,
  keywords: [
    PROFILE.name,
    PROFILE.handle,
    "Forward Deployed Engineer",
    "Full-Stack Engineer",
    "AI Systems Engineer",
    "Applied ML",
    "MLOps",
    "GeoAI",
    "Next.js",
    "TypeScript",
    "Python",
    "Docker",
    "Linux VPS",
    "Spring Boot",
    "Three.js",
    "Yangon",
    "UIT",
  ],
  authors: [{ name: PROFILE.name, url: PROFILE.links.github }],
  creator: PROFILE.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: pageTitle,
    description: PROFILE.summary,
    url: siteUrl,
    type: "website",
    siteName: PROFILE.domain,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: PROFILE.summary,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1017",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  alternateName: PROFILE.handle,
  jobTitle: PROFILE.headline,
  description: PROFILE.summary,
  url: siteUrl,
  email: PROFILE.links.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Yangon",
    addressCountry: "MM",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name:
      EDUCATION[0]?.institution ??
      "University of Information Technology (UIT), Yangon",
  },
  knowsLanguage: ["English", "Burmese", "Japanese"],
  sameAs: [
    PROFILE.links.github,
    PROFILE.links.linkedin,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased selection:bg-[#2dd4bf] selection:text-[#0d1017]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main-content"
          className="font-mono-tech fixed top-4 left-4 z-[100] -translate-y-24 border-2 border-[#2dd4bf] bg-[#0d1017] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2dd4bf] transition focus:translate-y-0"
        >
          Skip to content
        </a>
        <CommandPaletteShell>{children}</CommandPaletteShell>
      </body>
    </html>
  );
}
