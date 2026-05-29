// Next.js 15 App Router instrumentation 훅
// 런타임 환경에 따라 적절한 Sentry 설정 파일을 동적으로 로드
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Node.js 서버 런타임 (Server Components, Route Handlers, Server Actions)
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge 런타임 (미들웨어, Edge Route Handlers)
    await import("./sentry.edge.config");
  }
}
