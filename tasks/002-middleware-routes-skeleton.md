---
task: "002"
title: 미들웨어 공개 경로 확장 및 라우트 골격 생성
status: pending
---

## 개요

비로그인 참여자가 `/e/[share_token]` 경로에 접근할 수 있도록 미들웨어 화이트리스트를 확장하고,
이벤트 도메인에 필요한 모든 라우트의 빈 껍데기 페이지를 생성합니다.
이 단계는 이후 Phase 2 UI 구현의 기반이 되는 라우트 구조를 확정합니다.

## 관련 파일

- `lib/supabase/proxy.ts` — `/e/` 경로를 공개 허용 조건에 추가
- `app/e/[share_token]/page.tsx` — 이벤트 공개 페이지 (비로그인 접근 허용)
- `app/e/[share_token]/announcements/page.tsx` — 참여자용 공지 목록
- `app/protected/events/new/page.tsx` — 이벤트 생성 (주최자 전용)
- `app/protected/events/[id]/page.tsx` — 이벤트 관리 상세 (주최자 전용)
- `app/protected/events/[id]/edit/page.tsx` — 이벤트 수정 (주최자 전용)
- `app/protected/events/[id]/participants/page.tsx` — 참여자 목록 (주최자 전용)
- `app/protected/events/[id]/announcements/page.tsx` — 주최자용 공지 목록
- `app/protected/events/[id]/announcements/new/page.tsx` — 공지 작성

## 구현 단계

- [ ] 1단계: `lib/supabase/proxy.ts`의 `updateSession()` 리다이렉트 조건에 `/e/` 경로 예외 추가
- [ ] 2단계: `app/e/[share_token]/page.tsx` 빈 껍데기 생성
- [ ] 3단계: `app/e/[share_token]/announcements/page.tsx` 빈 껍데기 생성
- [ ] 4단계: `app/protected/events/new/page.tsx` 빈 껍데기 생성
- [ ] 5단계: `app/protected/events/[id]/page.tsx` 빈 껍데기 생성
- [ ] 6단계: `app/protected/events/[id]/edit/page.tsx` 빈 껍데기 생성
- [ ] 7단계: `app/protected/events/[id]/participants/page.tsx` 빈 껍데기 생성
- [ ] 8단계: `app/protected/events/[id]/announcements/page.tsx` 빈 껍데기 생성
- [ ] 9단계: `app/protected/events/[id]/announcements/new/page.tsx` 빈 껍데기 생성

## 수락 기준

- 비로그인 상태에서 `/e/임의값` 접근 시 로그인 페이지로 리다이렉트되지 않고 페이지가 렌더링됨
- 비로그인 상태에서 `/protected/events/new` 접근 시 `/auth/login`으로 리다이렉트됨 (기존 동작 유지)
- 위 목록의 모든 라우트가 404 없이 접근 가능함
- 빌드 오류 및 TypeScript 타입 오류 없음
