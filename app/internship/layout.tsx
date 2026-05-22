import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internship Application | Infispark Technologies",
  description: "Apply for our specialized Custom Software Developer Internship in Panvel, Navi Mumbai. Stipend up to ₹10,000/month. Build with React, Next.js, Firebase & Supabase.",
  keywords: ["software engineer internship", "web developer intern Panvel", "hiring react developers Mumbai", "Supabase developer internship", "Infisparks internship", "paid internship Mumbai"],
  alternates: {
    canonical: "/internship",
  },
  openGraph: {
    title: "We're Hiring Developer Interns 🚀 | Infispark Technologies",
    description: "Stipend up to ₹10,000/month · React · Next.js · Firebase · Supabase · Panvel, Navi Mumbai. Apply now and work on live client projects!",
    url: "https://infispark.in/internship",
    siteName: "Infispark Technologies",
    images: [
      {
        url: "https://infispark.in/wh-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Infispark Technologies - Developer Internship · Stipend up to ₹10,000/month",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "We're Hiring Developer Interns 🚀 | Infispark Technologies",
    description: "Stipend up to ₹10,000/month · React · Next.js · Firebase · Panvel, Navi Mumbai. Apply now!",
    images: ["https://infispark.in/wh-thumbnail.png"],
  },
};

export default function InternshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
