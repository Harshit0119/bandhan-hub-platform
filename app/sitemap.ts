//\app\sitemap.ts
// app/sitemap.ts

import { MetadataRoute } from "next";
import { getAllVendors } from "@/lib/db-actions";
import { CATEGORY_SLUG_MAP } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = "https://bandhan-hub.vercel.app";

  const vendors = await getAllVendors();

  const vendorUrls = vendors.map((vendor) => ({
    url: `${BASE_URL}/vendor/${vendor.id}`,
    lastModified: new Date(),
  }));

  const cities = ["bhopal", "indore", "delhi", "mumbai"];

  const categorySlugs = Object.values(CATEGORY_SLUG_MAP);

  const listingUrls = cities.flatMap((city) =>
    categorySlugs.map((slug) => ({
      url: `${BASE_URL}/${city}/${slug}`,
      lastModified: new Date(),
    })),
  );

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    ...vendorUrls,
    ...listingUrls,
  ];
}
