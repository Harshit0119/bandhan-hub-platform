//\app\sitemap.xml\route.ts
import { getAllVendors } from "@/lib/db-actions";
import { CATEGORY_SLUG_MAP } from "@/lib/types";

export async function GET() {
  const BASE_URL = "https://bandhan-hub.vercel.app";

  const vendors = await getAllVendors();

  const cities = ["bhopal", "indore", "delhi", "mumbai"];
  const categorySlugs = Object.values(CATEGORY_SLUG_MAP);

  const urls = [
    `${BASE_URL}`,
    ...vendors.map((v) => `${BASE_URL}/vendor/${v.id}`),
    ...cities.flatMap((city) =>
      categorySlugs.map((slug) => `${BASE_URL}/${city}/${slug}`),
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`,
  )
  .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
