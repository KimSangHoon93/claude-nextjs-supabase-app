import * as Sentry from "@sentry/nextjs";

// SENTRY_DSN이 설정된 경우에만 Sentry 초기화 (없어도 빌드/런타임 정상 동작)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // 클라이언트 사이드 트랜잭션 샘플링 비율 (0.0 ~ 1.0)
    tracesSampleRate: 1.0,
  });
}
