# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
# 개발 서버 실행 (webpack 모드)
npm run dev

# 빌드
npm run build

# 린트 (커밋 전 반드시 실행)
npm run lint
```

## 환경 변수

`.env.local` 파일에 아래 두 변수가 필요합니다:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Supabase 대시보드의 API 설정에서 확인할 수 있습니다. `NEXT_PUBLIC_SUPABASE_ANON_KEY` 값을 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`에 넣어도 됩니다.

## 아키텍처

### 인증 흐름

`lib/supabase/proxy.ts`의 `updateSession()`이 미들웨어 역할을 합니다. `/auth/*` 및 `/` 이외의 경로에 비로그인 접근 시 `/auth/login`으로 리다이렉트합니다.

인증 관련 페이지는 `app/auth/` 하위에 있고, 로그인 후 이동하는 보호 구역은 `app/protected/` 하위입니다.

### Supabase 클라이언트 3종

| 파일                     | 용도                                                      |
| ------------------------ | --------------------------------------------------------- |
| `lib/supabase/server.ts` | Server Component / Route Handler / Server Action에서 사용 |
| `lib/supabase/client.ts` | Client Component에서 사용                                 |
| `lib/supabase/proxy.ts`  | 미들웨어(`proxy.ts` 루트)에서 세션 갱신용으로만 사용      |

> 서버 클라이언트는 전역 변수에 저장하지 말고, 매 요청마다 새로 생성해야 합니다.

### 데이터 레이어

- `lib/supabase/profile.ts` — `profiles` 테이블 CRUD 함수 (`getProfile`, `updateProfile`)
- `types/database.ts` — Supabase CLI로 생성된 DB 타입 (직접 수정 금지, CLI로 재생성)
- Server Action은 `app/protected/profile/actions.ts`처럼 라우트 폴더 내 `actions.ts`에 위치

### 컴포넌트

- `components/ui/` — shadcn/ui 기반 공통 컴포넌트
- `components/` 루트 — 기능별 복합 컴포넌트 (폼, 버튼 등)
- UI 컴포넌트 추가 시 `npx shadcn@latest add <component>` 사용

### 테마

`next-themes`를 통해 라이트/다크 테마를 지원하며, `ThemeProvider`는 루트 레이아웃(`app/layout.tsx`)에서 설정합니다.
