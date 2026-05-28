import type { MetadataRoute } from "next";

// robots.txt 동적 생성 — 검색엔진 크롤러 접근 규칙 정의
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 관리자 패널, 보호된 영역, 인증 페이지는 색인 차단
        disallow: ["/admin/", "/protected/", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
