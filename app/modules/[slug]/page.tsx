import { notFound } from "next/navigation";
import ModulePageClient from "./ModulePageClient";
import { LEARNING_MODULES } from "@/constants";

export function generateStaticParams() {
  return LEARNING_MODULES.map((lesson) => ({ slug: lesson.slug }));
}

type Params = { params: { slug: string } };

export default function ModuleDetailPage({ params }: Params) {
  const lesson = LEARNING_MODULES.find((item) => item.slug === params.slug);
  if (!lesson) {
    notFound();
  }

  return <ModulePageClient module={lesson} />;
}
