// scripts/scan-built-for-clerk.cjs
// Fail the build if any compiled file still contains "clerk"
const fs = require('fs');
const path = require('path');

const ROOTS = ['dist', 'build', 'out', '.next'];
let found = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p);
    else {
      if (p.endsWith('.map')) continue;
      const buf = fs.readFileSync(p);
      if (buf.toString().toLowerCase().includes('clerk')) {
        found.push(p);
      }
    }
  }
}

for (const r of ROOTS) walk(path.resolve(process.cwd(), r));

if (found.length) {
  console.error('❌ Found "clerk" strings in built output:');
  for (const f of found) console.error(' -', f);
  process.exit(1);
} else {
  console.log('✅ No "clerk" strings detected in built output.');
}
