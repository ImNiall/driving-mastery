// Simple sitemap generator reading slugs from constants.ts via regex
// Outputs to public/sitemap.xml with root, /modules, and /modules/{slug}

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = process.env.VITE_SITE_URL || 'https://example.com';
const constantsPath = path.join(ROOT, 'constants.ts');
const publicDir = path.join(ROOT, 'public');
const outPath = path.join(publicDir, 'sitemap.xml');

function getSlugs() {
  const src = fs.readFileSync(constantsPath, 'utf8');
  // Very simple regex to capture slug: 'value' or slug: "value"
  const regex = /slug:\s*['\"]([^'\"]+)['\"]/g;
  const slugs = new Set();
  let m;
  while ((m = regex.exec(src)) !== null) {
    slugs.add(m[1]);
  }
  return Array.from(slugs);
}

function buildSitemap(urls) {
  const lastmod = new Date().toISOString();
  const urlset = urls
    .map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`) 
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;
}

function main() {
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const slugs = getSlugs();
  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/modules`,
    ...slugs.map((s) => `${SITE_URL}/modules/${s}`),
  ];
  const xml = buildSitemap(urls);
  fs.writeFileSync(outPath, xml);
  console.log(`Wrote ${outPath} with ${urls.length} urls.`);
}

if (require.main === module) {
  main();
}
