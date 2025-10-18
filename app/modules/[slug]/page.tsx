import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import ModulePage from "@/components/modules/ModulePage";
import {
  getModuleSlugs,
  getNextModuleSlug,
  loadModule,
} from "@/lib/modules/data";

export async function generateStaticParams() {
  const slugs = await getModuleSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { params: { slug: string } };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.drivingmastery.co.uk";

function resolveImagePath(path?: string | null): string {
  if (!path) return "/og/module.png";
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

export default async function ModuleDetailPage({ params }: Params) {
  const slugs = await getModuleSlugs();
  const index = slugs.indexOf(params.slug);
  if (index === -1) {
    notFound();
  }

  const moduleData = await loadModule(params.slug);
  const nextSlug = await getNextModuleSlug(params.slug);
  const nextModule = nextSlug
    ? { slug: nextSlug, title: (await loadModule(nextSlug)).title }
    : null;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: moduleData.title,
    description: moduleData.summary,
    mainEntityOfPage: new URL(
      `/modules/${moduleData.slug}`,
      SITE_URL,
    ).toString(),
    image: [
      new URL(resolveImagePath(moduleData.heroImage), SITE_URL).toString(),
    ],
    author: {
      "@type": "Organization",
      name: "Driving Mastery",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Driving Mastery",
      logo: {
        "@type": "ImageObject",
        url: new URL("/favicon.png", SITE_URL).toString(),
      },
    },
  };

  return (
    <>
      <Script
        id={`ld-json-module-${moduleData.slug}`}
        type="application/ld+json"
      >
        {JSON.stringify(articleLd)}
      </Script>
      <ModulePage
        module={moduleData}
        moduleNumber={index + 1}
        totalModules={slugs.length}
        nextModule={nextModule}
      />
    </>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const moduleData = await loadModule(params.slug);
  const canonicalPath = `/modules/${params.slug}`;
  const title = `${moduleData.title} | Driving Mastery Module Guide`;
  const description =
    moduleData.summary ||
    "Explore the Driving Mastery module to sharpen your DVSA theory knowledge.";
  const image = resolveImagePath(moduleData.heroImage);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${moduleData.title} module hero`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
