import { promises as fs } from "fs";
import path from "path";
import type { Module } from "@/types/module";

const MODULES_DIR = path.join(process.cwd(), "content/modules");
const FALLBACK_SLUG = "alertness";

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function getModuleSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(MODULES_DIR);
    return entries
      .filter((entry) => entry.endsWith(".json"))
      .map((entry) => entry.replace(/\.json$/i, ""))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.warn("[modules] Failed to read modules directory:", error);
    return [FALLBACK_SLUG];
  }
}

export async function loadModule(slug: string): Promise<Module> {
  const safeSlug = slug || FALLBACK_SLUG;
  const filePath = path.join(MODULES_DIR, `${safeSlug}.json`);
  try {
    return await readJsonFile<Module>(filePath);
  } catch (error) {
    if (safeSlug !== FALLBACK_SLUG) {
      return loadModule(FALLBACK_SLUG);
    }
    throw error;
  }
}

export async function loadAllModules(): Promise<Module[]> {
  const slugs = await getModuleSlugs();
  const modules: Module[] = [];
  for (const slug of slugs) {
    try {
      const loadedModule = await loadModule(slug);
      modules.push(loadedModule);
    } catch (error) {
      console.warn(`[modules] Failed to load module ${slug}:`, error);
    }
  }
  return modules;
}

export async function getNextModuleSlug(
  currentSlug: string,
): Promise<string | null> {
  const slugs = await getModuleSlugs();
  const index = slugs.indexOf(currentSlug);
  if (index === -1) return slugs[0] ?? null;
  return slugs[index + 1] ?? null;
}
