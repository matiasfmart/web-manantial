import { MetadataRoute } from "next";
import { ministries } from "@/lib/data";

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

  const ministryRoutes = ministries.map((m) => ({
    url: `${base}/ministerios/${m.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...ministryRoutes];
}
