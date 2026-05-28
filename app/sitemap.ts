import type { MetadataRoute } from "next";

// sitemap.xml 동적 생성 — 공개 정적 라우트만 포함
// 초대 링크(/invite/*)는 개인용이므로 포함하지 않음
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
