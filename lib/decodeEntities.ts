const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
};

function decodeEntity(entity: string): string | null {
  if (!entity) return null;
  if (entity.startsWith("#")) {
    const isHex = entity[1]?.toLowerCase() === "x";
    const value = isHex ? entity.slice(2) : entity.slice(1);
    const radix = isHex ? 16 : 10;
    const codePoint = Number.parseInt(value, radix);
    if (!Number.isNaN(codePoint)) {
      try {
        return String.fromCodePoint(codePoint);
      } catch (error) {
        return null;
      }
    }
    return null;
  }
  return NAMED_ENTITIES[entity] ?? null;
}

export function decodeEntities(input: string | null | undefined): string {
  if (!input) return "";
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    const decoded = decodeEntity(entity);
    return decoded ?? match;
  });
}
