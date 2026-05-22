import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infispark Blog | Custom Software & IT Engineering Insights",
  description: "Read the latest about custom software development, mobile app engineering, AI integrations, and cloud architectures. Expert insights by Shaikh Mudassir and Moin Zariwala.",
  keywords: "custom software blog, mobile app development blog, AI integration insights, infispark news, software engineering blog",
  alternates: {
    canonical: "https://infisparks.com/blog",
  },
  openGraph: {
    title: "Infispark Blog | Custom Software & IT Engineering Insights",
    description: "Read the latest about custom software development, mobile app engineering, AI integrations, and cloud architectures. Expert insights by Shaikh Mudassir and Moin Zariwala.",
    url: "https://infisparks.com/blog",
    siteName: "Infispark",
    images: [
      {
        url: "https://infisparks.com/whatsap.webp",
        width: 1200,
        height: 630,
        alt: "Infispark Custom Software Blog",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  other: {
    "instagram:card": "summary_large_image",
    "instagram:title": "Infispark Blog | Custom Software & IT Engineering Insights",
    "instagram:description": "Read the latest about custom software development, mobile app engineering, AI integrations, and cloud architectures.",
    "instagram:image": "https://infisparks.com/whatsap.webp",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
