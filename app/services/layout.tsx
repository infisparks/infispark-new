import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Specialized Custom Software & IT Solutions",
  description: "Explore Infispark's range of custom software development, mobile app engineering, OTT platforms, AI integrations, and IT solutions tailored for high-growth enterprises.",
  keywords: "custom software development, custom web platforms, cross-platform mobile apps, AI integrations, e-commerce storefronts, OTT streaming platforms, Mumbai, Bandra Kurla Complex",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Specialized Custom Software & IT Solutions | Infispark",
    description: "Explore Infispark's range of custom software development, mobile app engineering, OTT platforms, AI integrations, and IT solutions tailored for high-growth enterprises.",
    url: "https://infisparks.com/services",
    siteName: "Infispark",
    images: [
      {
        url: "https://infisparks.com/whatsap.webp",
        width: 1200,
        height: 630,
        alt: "Infispark Custom Software Solutions",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  other: {
    "instagram:card": "summary_large_image",
    "instagram:title": "Specialized Custom Software & IT Solutions | Infispark",
    "instagram:description": "Explore Infispark's range of custom software development, mobile app engineering, OTT platforms, AI integrations, and IT solutions.",
    "instagram:image": "https://infisparks.com/whatsap.webp",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
