import type { MetadataRoute } from "next";
import { calculators } from "@/lib/calculators";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lifeniche-calc.local";
  return [
    "",
    "/calculators",
    "/about",
    "/contact",
    ...calculators.map((calculator) => `/calculators/${calculator.slug}`)
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));
}
