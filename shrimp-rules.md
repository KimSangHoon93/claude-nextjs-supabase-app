# Development Guidelines — Gather

## 1. 프로젝트 개요

- **서비스**: 초대 링크 하나로 5-30명 소규모 일회성 이벤트를 관리하는 모바일 퍼스트 플랫폼
- **스택**: Next.js 15 App Router, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase (Auth/DB/Storage/Realtime)
- **현재 Phase**: Phase 1 완료 → Phase 2 진행 중 (더미 데이터 기반 UI/UX 구현)

---

## 2. 라우트 구조

| 경로                         | 설명                                | 인증         |
| ---------------------------- | ----------------------------------- | ------------ |
| `app/page.tsx`               | 랜딩 페이지                         | 불필요       |
| `app/auth/*`                 | 로그인/회원가입/비밀번호 관련       | 불필요       |
| `app/protected/*`            | 로그인 사용자 전용 (이벤트, 프로필) | 필수         |
| `app/admin/*`                | 관리자 전용 (role: admin)           | 필수 + admin |
| `app/invite/[invite_code]/*` | 초대 링크 참여 페이지               | 조건부       |

- **보호된 라우트 추가 시**: `proxy.ts`의 `updateSession()`에서 예외 처리 여부 확인
- **관리자 경로 추가 시**: `app/admin/layout.tsx`에서 role 체크 로직 반드시 포함

---

## 3. Supabase 클라이언트 — **절대 혼용 금지**

| 파일                     | 사용 위치                                      |
| ------------------------ | ---------------------------------------------- |
| `lib/supabase/server.ts` | Server Component, Route Handler, Server Action |
| `lib/supabase/client.ts` | Client Component (`'use client'` 파일)         |
| `lib/supabase/proxy.ts`  | `proxy.ts` 미들웨어 내부에서만 사용            |

- **금지**: 서버 클라이언트를 전역 변수에 저장. 매 요청마다 `createClient()` 새로 호출
- **금지**: Client Component에서 `lib/supabase/server.ts` import
- **금지**: 미들웨어 외부에서 `lib/supabase/proxy.ts` import

---

## 4. 데이터베이스 스키마

### 테이블 요약

| 테이블               | 핵심 컬럼                                                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`              | id (UUID), email, name, avatar_url, role ('user'/'admin')                                                                                           |
| `events`             | id, title, description, location, event_date, cover_image_url, invite_code (UNIQUE), status ('upcoming'/'ongoing'/'ended'), created_by (→ users.id) |
| `event_participants` | id, event_id (→ events.id), user_id (→ users.id), role ('host'/'participant'), joined_at                                                            |

- `event_participants.(event_id, user_id)` 조합 UNIQUE — 중복 참여 방지 로직 필수
- `events.invite_code`로 초대 링크 조회 — 인덱스 존재, 직접 쿼리 사용
- `types/database.ts` **직접 수정 금지** — Supabase CLI `supabase gen types typescript`로만 재생성

---

## 5. 데이터 레이어 규칙

- CRUD 함수는 `lib/supabase/` 하위에 도메인별로 위치 (예: `lib/supabase/events.ts`, `lib/supabase/profile.ts`)
- Server Action은 반드시 해당 라우트 폴더 내 `actions.ts`에 위치
  - 예: `app/protected/events/new/actions.ts`
- Server Action 파일 상단에 `'use server'` 지시어 필수
- 데이터 조회는 Server Component에서 직접 수행, Client Component에 데이터를 props로 전달

---

## 6. 컴포넌트 규칙

- `components/ui/` — shadcn/ui 기반 원자 컴포넌트 (직접 수정 최소화)
- `components/` 루트 — 기능별 복합 컴포넌트 (폼, 카드, 버튼 조합 등)
- **shadcn/ui 컴포넌트 추가**: `npx shadcn@latest add <component>` 명령 사용, 수동 생성 금지
- Client Component가 필요한 경우만 `'use client'` 선언, 기본은 Server Component
- 이벤트 상태에 따른 조건부 UI: `event.status` 값 기준 (`upcoming` / `ongoing` / `ended`)
- 권한에 따른 조건부 UI: `event_participants.role` 기준 (`host` / `participant`)

---

## 7. 인증 및 권한

- 미들웨어: 루트 `proxy.ts`의 `updateSession()` — `/auth/*`, `/`, `/invite/*` 이외 비로그인 시 `/auth/login` 리다이렉트
- 관리자 체크: `users.role === 'admin'` 확인 — `app/admin/layout.tsx`에서 서버 사이드 체크
- Google OAuth: `app/auth/callback/route.ts`에서 처리, 수동으로 OAuth 흐름 구현 금지
- 로그아웃 후 리다이렉트 목적지: `/` (랜딩 페이지)

---

## 8. 스타일링 규칙

- **Tailwind CSS v4** — 설정 파일 없는 새 엔진, `tailwind.config.js` 생성 금지
- 컬러 시스템: Primary `#10B981` (Emerald 500), Accent `#F59E0B` (Amber 500)
- 모바일: 단일 컬럼, 좌우 패딩 `px-4`, 카드 radius `rounded-2xl`
- 버튼 최소 높이: `min-h-[48px]` (터치 영역 확보)
- 다크 모드: `next-themes` 사용, `ThemeProvider`는 `app/layout.tsx`에서만 설정
- 클래스 병합: `cn()` 유틸리티 사용 (`lib/utils.ts`)

---

## 9. 폼 처리

- 폼 상태 관리: **React Hook Form** + **Zod** 스키마 검증 (미설치 시 먼저 설치)
- 설치 명령: `npm install react-hook-form zod @hookform/resolvers`
- Zod 스키마는 해당 폼 컴포넌트 파일 내 또는 별도 `schemas/` 폴더에 위치
- 필드 유효성 에러 메시지: 한국어로 작성

---

## 10. Supabase Storage (이미지 업로드)

- 버킷명: `event-covers`
- 허용 파일: jpg, png, webp — 서버 사이드에서 MIME 타입 검증 필수
- 최대 크기: 5MB — 업로드 전 클라이언트 사이드 크기 체크
- 파일명: `{userId}/{eventId}/{timestamp}.{ext}` 패턴 사용 (충돌 방지)
- 공개 URL: `supabase.storage.from('event-covers').getPublicUrl(path)`

---

## 11. 실시간 기능

- Supabase Realtime: `event_participants` 테이블 구독으로 참여자 목록 자동 업데이트
- 구독은 Client Component 내 `useEffect`에서 설정, 컴포넌트 언마운트 시 `unsubscribe()` 필수
- 구독 시 필요한 컬럼만 `select` — 전체 행 구독 금지 (성능)

---

## 12. 워크플로우

### 새 기능 추가 순서

1. `docs/ROADMAP.md` Task 확인 후 해당 Task 번호 기준으로 작업
2. 라우트 파일 수정/생성 → 컴포넌트 구현 → Server Action/데이터 함수 구현
3. `npm run lint` 실행 (커밋 전 필수, Husky pre-commit으로 자동 실행됨)
4. API 연동 및 비즈니스 로직 구현 시 **Playwright MCP 테스트 필수**
5. `docs/ROADMAP.md` Task 완료 체크

### 파일 수정 시 동시 수정 필요 항목

- `events` 타입 변경 시: `lib/supabase/events.ts` + 해당 Server Action 파일
- 라우트 권한 변경 시: `proxy.ts` 미들웨어 예외 목록 확인
- DB 스키마 변경 시: `types/database.ts` 재생성 (CLI) + 관련 함수 파일

---

## 13. 코드 스타일

- 변수명: camelCase
- 함수명: 동사로 시작 (예: `getEvents`, `handleSubmit`, `createInviteCode`)
- 주석: 한글 사용
- 파일명: kebab-case (컴포넌트는 PascalCase 허용)

---

## 14. 금지 사항

- `types/database.ts` 직접 수정 — CLI 재생성만 허용
- 서버 클라이언트(`lib/supabase/server.ts`)를 전역 변수에 저장
- Client Component에서 서버 전용 API 직접 호출 (Server Action 경유 필수)
- `app/admin/*` 경로에서 role 체크 생략
- shadcn/ui 컴포넌트 수동 생성 (CLI 명령 사용)
- `tailwind.config.js` 생성 (Tailwind v4는 설정 파일 불필요)
- `--no-verify` 플래그로 커밋 훅 우회
- Phase 2 완료 전 실제 DB 스키마 생성 (더미 데이터로 UI 완성 후 진행)
- `app/auth/*` 및 `/invite/*` 이외 공개 경로를 미들웨어 없이 추가
