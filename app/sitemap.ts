import type { MetadataRoute } from "next";
import { getModuleSlugs } from "@/lib/modules/data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.drivingmastery.co.uk";

const basePaths = [
  "/",
  "/dashboard",
  "/modules",
  "/mock-test",
  "/quiz-by-category",
  "/leaderboard",
  "/memberships",
  "/faqs",
  "/auth",
  "/auth/change-password",
  "/mentor",
  "/about",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseEntries = basePaths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changefreq: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const moduleSlugs = await getModuleSlugs();
  const moduleEntries = moduleSlugs.map((slug) => ({
    url: new URL(`/modules/${slug}`, SITE_URL).toString(),
    changefreq: "weekly" as const,
    priority: 0.6,
  }));

  return [...baseEntries, ...moduleEntries];
}
