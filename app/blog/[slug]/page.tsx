import { blogPosts } from "@/app/constants/blogData";
import { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const post = blogPosts.find((p: any) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found | Infispark",
    };
  }

  const imageUrl = `https://infisparks.com${post.image}`;

  return {
    title: `${post.title} | Infispark Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | Infispark Blog`,
      description: post.description,
      url: `https://infisparks.com/blog/${slug}`,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Infispark Blog`,
      description: post.description,
      images: [imageUrl],
    },
    other: {
      "instagram:card": "summary_large_image",
      "instagram:title": `${post.title} | Infispark Blog`,
      "instagram:description": post.description,
      "instagram:image": imageUrl,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const slug = (await params).slug;
  const post = blogPosts.find((p: any) => p.slug === slug);

  if (!post) {
     return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <h1>Post Not Found</h1>
      </div>
    );
  }

  // Generate structured data for the article to improve Google Image Search discovery
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": `https://infisparks.com${post.image}`,
    "datePublished": new Date(post.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Infispark",
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
      <BlogPostClient post={post} />
    </>
  );
}
