// Simple SEO audit tool: warns about <img> without alt and multiple <h1> in a file
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const compDir = path.join(ROOT, 'components');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(p));
    else if (e.isFile() && p.endsWith('.tsx')) files.push(p);
  }
  return files;
}

function auditFile(fp) {
  const src = fs.readFileSync(fp, 'utf8');
  const rel = path.relative(ROOT, fp);
  let warnings = [];

  // crude checks
  const imgNoAlt = src.match(/<img(?![^>]*\balt=)[^>]*>/gi) || [];
  if (imgNoAlt.length > 0) {
    warnings.push(`- ${rel}: ${imgNoAlt.length} <img> without alt attribute`);
  }

  const h1Matches = src.match(/<h1\b[^>]*>/gi) || [];
  if (h1Matches.length > 1) {
    warnings.push(`- ${rel}: multiple <h1> tags (${h1Matches.length})`);
  }

  return warnings;
}

function main() {
  const files = walk(compDir);
  let all = [];
  for (const f of files) all.push(...auditFile(f));
  if (all.length === 0) {
    console.log('SEO audit: no warnings found.');
  } else {
    console.log('SEO audit warnings:');
    for (const w of all) console.log(w);
  }
}

if (require.main === module) main();
