export function assertString(name: string, v: unknown): string {
  if (typeof v === 'string') return v;
  if (v == null) return '';
  // Dates & URLs are objects; stringify to a stable primitive
  if (v instanceof Date) return v.toISOString();
  if (v instanceof URL) return v.toString();
  // If it's an enum member that's actually a number, coerce
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  // Last resort: reveal shape in console to find offender fast
  // eslint-disable-next-line no-console
  console.error(`[assertString] Non-string for "${name}":`, v);
  return String(v); // keeps app rendering so you can see the console
}

export function normalizeCategory(cat: unknown): string {
  // Common enum pitfalls handled here:
  // - If it's a TS enum object, resolve to its value
  // - If it's a zod enum, it should already be a string but we coerce anyway
  // - If it's { label, value }, prefer label/value heuristically
  if (typeof cat === 'string') return cat;
  if (typeof cat === 'number' || typeof cat === 'boolean') return String(cat);
  if (cat && typeof cat === 'object') {
    const maybeValue = (cat as any).value ?? (cat as any).label ?? (cat as any).name;
    if (maybeValue) return String(maybeValue);
  }
  return assertString('category', cat);
}

export type ModuleVM = {
  id: string;
  title: string;
  category: string;
  slug: string;
  summary: string;
  content: string;
};

export function normalizeModule(raw: any): ModuleVM {
  return {
    id: assertString('id', raw?.id),
    title: assertString('title', raw?.title),
    category: normalizeCategory(raw?.category),
    slug: assertString('slug', raw?.slug),
    summary: assertString('summary', raw?.summary),
    content: assertString('content', raw?.content),
  };
}
