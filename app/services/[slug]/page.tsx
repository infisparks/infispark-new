import { services, Service } from "@/app/constants/servicesData";
import { Metadata } from "next";
import ServiceDetailClient from "./ServiceDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const service = (services as Service[]).find((s: Service) => s.slug === slug);

  if (!service) {
    return { title: "Service Not Found | Infispark" };
  }

  const imageUrl = `https://infisparks.com${service.image}`;

  return {
    title: `${service.title} | Infispark Custom Software Solutions`,
    description: service.description,
    alternates: {
      canonical: `https://infisparks.com/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} | Infispark Custom Software Solutions`,
      description: service.description,
      url: `https://infisparks.com/services/${slug}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | Infispark Custom Software Solutions`,
      description: service.description,
      images: [imageUrl],
    },
    other: {
      "instagram:card": "summary_large_image",
      "instagram:title": `${service.title} | Infispark Custom Software Solutions`,
      "instagram:description": service.description,
      "instagram:image": imageUrl,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const slug = (await params).slug;
  const service = (services as Service[]).find((s: Service) => s.slug === slug);

  if (!service) {
     return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <h1>Service Not Found</h1>
      </div>
    );
  }

  // Generate structured data for the service to improve Google search discovery
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "image": `https://infisparks.com${service.image}`,
    "provider": {
      "@type": "Organization",
      "name": "INFISPARK TECHNOLOGIES LLP",
      "url": "https://infisparks.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://infisparks.com/logo.png",
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ServiceDetailClient service={service} />
    </>
  );
}

