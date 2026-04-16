#!/usr/bin/env node
/**
 * update-projects.mjs
 *
 * Scans public/images/ and updates ONLY the `images` arrays in
 * src/config/projects.ts.  All other fields (description, link, category…)
 * are preserved exactly as written.
 *
 * Run: npm run sync
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const CONFIG     = path.join(ROOT, "src", "config", "projects.ts");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);

const PREFERRED_ORDER = [
  "branding", "ui-ux", "graphic-design", "product-design",
  "digital-media", "documentary", "portrait-photography",
];

// ── helpers ────────────────────────────────────────────────────────────────────

function toId(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function toTitle(id, folderPath) {
  const override = path.join(folderPath, "_name.txt");
  if (fs.existsSync(override)) return fs.readFileSync(override, "utf-8").trim();
  return id.replace(/-/g, " ").toUpperCase();
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function getImages(id, folderPath) {
  return fs.readdirSync(folderPath)
    .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()) && !f.startsWith("_") && !f.startsWith("."))
    .sort(naturalSort)
    .map(f => `/images/${id}/${f}`);
}

// ── read existing config to preserve metadata ──────────────────────────────────

/**
 * Parse the existing projects.ts and return a Map<id, {description, link, category}>.
 * Uses simple regex — good enough for our controlled format.
 */
function parseExistingConfig() {
  const meta = new Map();
  if (!fs.existsSync(CONFIG)) return meta;

  const src = fs.readFileSync(CONFIG, "utf-8");

  // Split on object boundaries: each entry starts with "  {"
  const blocks = src.split(/(?=\n  \{)/g);
  for (const block of blocks) {
    const id          = (block.match(/id:\s*"([^"]+)"/)     || [])[1];
    const description = (block.match(/description:\s*"([^"]+)"/) || [])[1];
    const link        = (block.match(/link:\s*"([^"]+)"/)   || [])[1];
    const category    = (block.match(/category:\s*"([^"]+)"/) || [])[1];
    if (id) meta.set(id, { description, link, category });
  }
  return meta;
}

// ── render ─────────────────────────────────────────────────────────────────────

function renderCategory(cat, isLast, meta) {
  const saved = meta.get(cat.id) || {};
  const comma = isLast ? "" : ",";

  // Use saved category name if available (preserves "UI/UX" vs "UI UX")
  const categoryName = saved.category ?? cat.category;

  const lines = [
    `  {`,
    `    id: "${cat.id}",`,
    `    category: "${categoryName}",`,
  ];

  if (saved.description) lines.push(`    description: "${saved.description}",`);
  if (saved.link)        lines.push(`    link: "${saved.link}",`);

  if (cat.images.length === 0) {
    lines.push(`    images: [],`);
  } else {
    lines.push(`    images: [`);
    cat.images.forEach(p => lines.push(`      "${p}",`));
    lines.push(`    ],`);
  }

  lines.push(`  }${comma}`);
  return lines.join("\n");
}

// ── main ───────────────────────────────────────────────────────────────────────

if (!fs.existsSync(IMAGES_DIR)) {
  console.error("public/images/ not found.");
  process.exit(1);
}

const existingMeta = parseExistingConfig();

const folders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith(".") && !e.name.startsWith("_"))
  .map(e => e.name);

const categories = folders.map(folderName => {
  const id         = toId(folderName);
  const folderPath = path.join(IMAGES_DIR, folderName);
  return { id, category: toTitle(id, folderPath), images: getImages(id, folderPath) };
});

categories.sort((a, b) => {
  const ai = PREFERRED_ORDER.indexOf(a.id), bi = PREFERRED_ORDER.indexOf(b.id);
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  return a.id.localeCompare(b.id);
});

const blocks = categories
  .map((cat, i) => renderCategory(cat, i === categories.length - 1, existingMeta))
  .join("\n");

const ts = `// src/config/projects.ts
// Images are auto-managed — run \`npm run sync\` after adding/removing files.
// description, link, and category fields are hand-edited and preserved by sync.

export type ProjectCategory = {
  id: string;
  category: string;
  description?: string;
  link?: string;
  images: string[];
};

const projects: ProjectCategory[] = [
${blocks}
];

export default projects;
`;

fs.writeFileSync(CONFIG, ts, "utf-8");

const total = categories.reduce((n, c) => n + c.images.length, 0);
const pad   = Math.max(...categories.map(c => c.id.length));
console.log(`\n✓  src/config/projects.ts updated`);
console.log(`   ${categories.length} categories · ${total} images\n`);
for (const c of categories) {
  const bar   = "▪".repeat(Math.min(c.images.length, 30));
  const count = c.images.length === 0 ? "(empty)" : String(c.images.length);
  const saved = existingMeta.get(c.id);
  const flag  = saved?.link ? " 🔗" : "";
  console.log(`   ${c.id.padEnd(pad + 2)} ${count.padStart(7)}  ${bar}${flag}`);
}
console.log();
