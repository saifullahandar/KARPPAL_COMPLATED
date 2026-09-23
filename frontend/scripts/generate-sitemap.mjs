// Generates frontend/public/sitemap.xml for production deployment.
//
// This is intentionally a plain Node script (no new npm dependency) rather than
// a build-time plugin, since it needs two pieces of information that only exist
// at deployment time: the real production domain, and a reachable backend API
// to list dynamic Research article slugs.
//
// Usage (run once per deploy, before `npm run build`, or whenever content changes):
//   SITE_URL=https://your-production-domain.example \
//   API_BASE_URL=https://your-production-domain.example/api/v1 \
//   node scripts/generate-sitemap.mjs
//
// If SITE_URL is not set, the script refuses to run rather than writing a
// sitemap full of fabricated example.com URLs.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SITE_URL = process.env.SITE_URL;
const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000/api/v1";

if (!SITE_URL) {
    console.error(
        "generate-sitemap.mjs: SITE_URL env var is required (e.g. https://karppal.af). " +
        "Refusing to generate a sitemap with a fabricated domain."
    );
    process.exit(1);
}

// Static public routes worth indexing. Deliberately excludes /login (not
// content, low SEO value) and any /dashboard/* route (private application).
const STATIC_ROUTES = [
    "/",
    "/about",
    "/products",
    "/all",
    "/services",
    "/control-quality",
    "/gallery",
    "/research",
    "/export",
    "/jobs",
];

async function fetchResearchSlugs() {
    const slugs = [];
    let url = `${API_BASE_URL}/research/`;
    try {
        while (url) {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const data = await res.json();
            for (const article of data.results ?? []) {
                if (article.slug) slugs.push(article.slug);
            }
            url = data.next;
        }
    } catch (err) {
        console.warn(
            `generate-sitemap.mjs: could not fetch Research articles from ${API_BASE_URL}/research/ (${err.message}). ` +
            "Continuing with static routes only."
        );
    }
    return slugs;
}

function buildXml(urls) {
    const entries = urls
        .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
        .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

const slugs = await fetchResearchSlugs();
const urls = [
    ...STATIC_ROUTES.map((route) => `${SITE_URL}${route}`),
    ...slugs.map((slug) => `${SITE_URL}/research/${slug}`),
];

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "sitemap.xml");
writeFileSync(outPath, buildXml(urls));
console.log(`generate-sitemap.mjs: wrote ${urls.length} URLs to ${outPath}`);
