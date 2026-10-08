import { site } from "@/lib/siteConfig";

export default function sitemap() {
  const paths = ["", "/about", "/contact", "/privacy-policy", "/terms-of-service", "/shipping-policy", "/return-policy", "/disclaimer"];
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date() }));
}
