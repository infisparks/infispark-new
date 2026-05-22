import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internship Application | Infispark Technologies",
  description: "Apply for our specialized Custom Software Developer Internship in Panvel, Navi Mumbai. Build next-generation applications using React, Next.js, and Supabase.",
  keywords: ["software engineer internship", "web developer intern Panvel", "hiring react developers Mumbai", "Supabase developer internship", "Infisparks internship"],
  alternates: {
    canonical: "/internship",
  },
};

export default function InternshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
