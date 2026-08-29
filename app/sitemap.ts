import { MetadataRoute } from "next";
import { ministrySlugs } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://iglesiamanantial.org";
  const staticRoutes = [
    "",
    "/nosotros",
    "/primera-vez",
    "/ministerios",
    "/reuniones",
    "/en-vivo",
    "/radio",
    "/contacto",
    "/ofrendas",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const ministryRoutes = ministrySlugs.map((slug) => ({
    url: `${base}/ministerios/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...ministryRoutes];
}
