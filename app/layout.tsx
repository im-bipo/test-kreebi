import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import VisitTracker from "./components/visit-tracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Kreebi AI Website Builder";
const description =
  "Kreebi AI Website Builder is the fastest free way to build stunning WordPress pages with AI. Launching 14th September — join the beta.";

// The live site will be https://kreebi.com — used as the base for absolute
// Open Graph / Twitter URLs (logo included). Override per-deploy with
// NEXT_PUBLIC_SITE_URL if needed.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kreebi.com";

let metadataBase: URL | undefined;
try {
  metadataBase = new URL(siteUrl);
} catch {
  metadataBase = new URL("https://kreebi.com");
}

const ogImages = [
  { url: "/kreebi-ai.png", width: 600, height: 600, alt: "Kreebi AI logo" },
];

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: title,
    template: "%s | Kreebi AI",
  },
  description,
  keywords: [
    "Kreebi AI",
    "AI website builder",
    "WordPress page builder",
    "AI landing page generator",
    "free page builder",
    "beta",
  ],
  authors: [{ name: "Kreebi AI" }],
  creator: "Kreebi AI",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/kreebi-ai.png",
    apple: "/kreebi-ai.png",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Kreebi AI",
    title,
    description,
    images: ogImages,
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ogImages,
  },
};

export const viewport: Viewport = {
  themeColor: "#7C28EE",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
