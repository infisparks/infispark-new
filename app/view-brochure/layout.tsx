import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infispark Portfolio & Custom Software Brochure",
  description: "Download the official brochure for Infispark. Learn about our custom software development, cross-platform mobile apps, OTT platforms, and AI-powered enterprise systems.",
  keywords: "custom software brochure, enterprise software brochure, IT solutions India, Infispark portfolio, AI integration, app developers Mumbai, software agency",
  openGraph: {
    title: "Infispark - Custom Software & IT Solutions Brochure",
    description: "Transform your business with custom software systems built for scale, performance, and security. View our detailed features and benefits.",
    images: ["/brochure/brochure.png"],
  },
  alternates: {
    canonical: "/view-brochure",
  },
  other: {
    "instagram:card": "summary_large_image",
    "instagram:title": "Infispark - Custom Software & IT Solutions Brochure",
    "instagram:description": "Transform your business with custom software systems built for scale, performance, and security. View our detailed features and benefits.",
    "instagram:image": "/brochure/brochure.png",
  },
};

export default function BrochureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
