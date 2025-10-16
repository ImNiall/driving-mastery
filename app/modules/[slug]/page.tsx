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

  return (
    <ModulePage
      module={moduleData}
      moduleNumber={index + 1}
      totalModules={slugs.length}
      nextModule={nextModule}
    />
  );
}
