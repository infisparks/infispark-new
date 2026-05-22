import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://infisparks.com"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "INFISPARK TECHNOLOGIES LLP | Custom Software Development & IT Solutions Company India",
    template: "%s | Infispark"
  },
  description:
    "INFISPARK TECHNOLOGIES LLP is India's leading custom software development and IT solutions provider. We design bespoke web platforms, cross-platform mobile apps, AI-integrated software, e-commerce systems, and official WhatsApp API integrations.",
  keywords: [
    "custom software development",
    "IT solutions company India",
    "custom software developer",
    "custom mobile app development",
    "custom web systems",
    "ecommerce custom software",
    "AI integration software",
    "Infispark custom software",
    "Shaikh Mudassir",
    "Moin Zariwala"
  ],
  authors: [{ name: "Shaikh Mudassir" }, { name: "Moin Zariwala" }],
  creator: "INFISPARK TECHNOLOGIES LLP Team",
  publisher: "INFISPARK TECHNOLOGIES LLP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "INFISPARK TECHNOLOGIES LLP | Custom Software Development & IT Solutions Company India",
    description: "Scale your business with India's premier custom software and IT solutions agency. Beautiful design, native performance, and AI-integrated workflows.",
    url: "https://infisparks.com",
    siteName: "Infispark",
    images: [
      {
        url: "https://infisparks.com/whatsap.webp",
        width: 1200,
        height: 630,
        alt: "Infispark Custom Software Solutions Thumbnail",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "INFISPARK TECHNOLOGIES LLP | Custom Software Development & IT Solutions",
    description: "Scale your business with India's premier custom software and IT solutions agency.",
    images: ["https://infisparks.com/whatsap.webp"],
    creator: "@infispark",
  },
  other: {
    "instagram:card": "summary_large_image",
    "instagram:title": "INFISPARK TECHNOLOGIES LLP | Custom Software Development & IT Solutions Company India",
    "instagram:description": "Scale your business with India's premier custom software and IT solutions agency. Beautiful design, native performance, and AI-integrated workflows.",
    "instagram:image": "https://infisparks.com/whatsap.webp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/meta-logo.png",
    shortcut: "/meta-logo.png",
    apple: "/meta-logo.png",
  },
  verification: {
    google: "google-site-verification-id",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
