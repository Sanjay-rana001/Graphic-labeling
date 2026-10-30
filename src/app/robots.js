export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://souravgraphic.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/customize"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

