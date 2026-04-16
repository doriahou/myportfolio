#!/usr/bin/env node
/**
 * sync-images.js
 *
 * Scans public/images/<category>/ and regenerates src/config/projects.ts.
 *
 * Usage:
 *   npm run sync          — scan & update projects.ts
 *   npm run sync -- --init — also scaffold the 7 default category folders
 *
 * Folder → display name rules (in priority order):
 *   1. public/images/<folder>/_name.txt  → use its contents verbatim
 *   2. auto: uppercase + hyphens/underscores → spaces
 *      e.g. "graphic-design" → "GRAPHIC DESIGN"
 *
 * Supported image formats: jpg, jpeg, png, webp, avif, gif
 */

const fs   = require("fs");
const path = require("path");

// ─── Paths ────────────────────────────────────────────────────────────────────
const ROOT       = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const OUTPUT     = path.join(ROOT, "src", "config", "projects.ts");

// ─── Config ───────────────────────────────────────────────────────────────────
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

/** Preferred sidebar order for known category IDs. Unknown folders are appended alphabetically. */
const KNOWN_ORDER = [
  "branding",
  "ui-ux",
  "graphic-design",
  "product-design",
  "digital-media",
  "documentary",
  "portrait-photography",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Natural sort so img-2 comes before img-10. */
function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

/** Derive the display name from a folder slug, with optional _name.txt override. */
function displayName(slug) {
  const override = path.join(IMAGES_DIR, slug, "_name.txt");
  if (fs.existsSync(override)) {
    return fs.readFileSync(override, "utf-8").trim();
  }
  return slug.replace(/[-_]/g, " ").toUpperCase();
}

/** Return sorted image paths (relative to /public) for one category folder. */
function getImages(slug) {
  const dir = path.join(IMAGES_DIR, slug);
  return fs
    .readdirSync(dir)
    .filter(
      (f) =>
        IMAGE_EXTS.has(path.extname(f).toLowerCase()) &&
        !f.startsWith("_") &&   // skip _name.txt etc.
        !f.startsWith(".")
    )
    .sort(naturalSort)
    .map((f) => `/images/${slug}/${f}`);
}

/** Render one category object as a TypeScript literal (no JSON.stringify). */
function renderCategory(cat, isLast) {
  const comma = isLast ? "" : ",";
  if (cat.images.length === 0) {
    return `  { id: "${cat.id}", category: "${cat.category}", images: [] }${comma}`;
  }
  const imgLines = cat.images.map((p) => `      "${p}",`).join("\n");
  return [
    `  {`,
    `    id: "${cat.id}",`,
    `    category: "${cat.category}",`,
    `    images: [`,
    imgLines,
    `    ],`,
    `  }${comma}`,
  ].join("\n");
}

// ─── Init scaffold ─────────────────────────────────────────────────────────────

function scaffold() {
  let created = 0;
  for (const slug of KNOWN_ORDER) {
    const dir = path.join(IMAGES_DIR, slug);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      created++;
      console.log(`  created  public/images/${slug}/`);
    }
  }
  if (created === 0) {
    console.log("  All default folders already exist.");
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const initMode = args.includes("--init");

  // Ensure public/images exists
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log("Created public/images/");
  }

  // --init: scaffold default folders, then continue
  if (initMode) {
    console.log("\nScaffolding default category folders:");
    scaffold();
    console.log();
  }

  // Discover all non-hidden subdirectories
  const allFolders = fs
    .readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !e.name.startsWith("_"))
    .map((e) => e.name);

  if (allFolders.length === 0) {
    console.log(
      "No category folders found in public/images/.\n" +
      "Run `npm run sync -- --init` to create the default folders,\n" +
      "or create your own: public/images/<category-name>/"
    );
    process.exit(0);
  }

  // Sort: known order first, then alphabetical for extras
  allFolders.sort((a, b) => {
    const ai = KNOWN_ORDER.indexOf(a);
    const bi = KNOWN_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  // Build category data
  const categories = allFolders.map((slug) => ({
    id: slug,
    category: displayName(slug),
    images: getImages(slug),
  }));

  // ── Generate TypeScript ──────────────────────────────────────────────────────
  const categoryBlocks = categories
    .map((cat, i) => renderCategory(cat, i === categories.length - 1))
    .join("\n");

  const output = `// AUTO-GENERATED — do not edit by hand.
// Run \`npm run sync\` after adding or removing images.
//
// ── How to manage your work ───────────────────────────────────────────────────
// • Add images    → drop files into  public/images/<category-id>/
// • New category  → create a new folder, then run \`npm run sync\`
// • Custom name   → create public/images/<category-id>/_name.txt
//                   with the display name inside (e.g. "UI/UX")
// • Image order   → files are sorted naturally (01.jpg, 02.jpg, …)
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectCategory = {
  /** URL slug, derived from the folder name */
  id: string;
  /** Display name shown in the sidebar and section headers */
  category: string;
  /** Image paths relative to /public */
  images: string[];
};

const projects: ProjectCategory[] = [
${categoryBlocks}
];

export default projects;
`;

  fs.writeFileSync(OUTPUT, output, "utf-8");

  // ── Summary ─────────────────────────────────────────────────────────────────
  const totalImages = categories.reduce((n, c) => n + c.images.length, 0);
  console.log(`✓ src/config/projects.ts updated`);
  console.log(`  ${categories.length} categories · ${totalImages} images\n`);

  const nameW = Math.max(...categories.map((c) => c.id.length), 8);
  for (const c of categories) {
    const bar = "▪".repeat(Math.min(c.images.length, 20));
    const count = c.images.length === 0 ? "(no images yet)" : `${c.images.length}`;
    console.log(`  ${c.id.padEnd(nameW + 2)} ${count.padStart(3)}  ${bar}`);
  }
  console.log();
}

main();
