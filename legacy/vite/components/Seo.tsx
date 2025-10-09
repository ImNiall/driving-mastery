import React, { useEffect } from "react";
import { SITE_URL, DEFAULT_OG } from "../../config/seo";
import { assertString } from "../utils/assertString";

type Props = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};

function upsertMeta(
  name: string,
  content: string,
  attr: "name" | "property" = "name",
) {
  if (!content) return;
  const selector =
    attr === "name" ? `meta[name="${name}"]` : `meta[property="${name}"]`;
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  if (!href) return;
  let link = document.head.querySelector(
    `link[rel="${rel}"]`,
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export default function Seo({
  title = "Driving Mastery – UK Theory Coach",
  description = "Practice UK driving theory with adaptive quizzes.",
  url = SITE_URL,
  image = DEFAULT_OG,
}: Props) {
  useEffect(() => {
    // Ensure all values are strings
    const safeTitle = assertString("seo.title", title);
    const safeDesc = assertString("seo.description", description);
    const safeUrl = assertString("seo.url", url);
    const safeImage = assertString("seo.image", image);

    const cleanDesc = (safeDesc || "").slice(0, 160);
    if (safeTitle) document.title = safeTitle;

    upsertMeta("description", cleanDesc, "name");
    upsertLink("canonical", safeUrl);

    // Open Graph
    upsertMeta("og:type", "website", "property");
    upsertMeta("og:title", safeTitle, "property");
    upsertMeta("og:description", cleanDesc, "property");
    upsertMeta("og:url", safeUrl, "property");
    upsertMeta("og:image", safeImage, "property");

    // Twitter
    upsertMeta("twitter:card", "summary_large_image", "name");
  }, [title, description, url, image]);

  return null;
}
