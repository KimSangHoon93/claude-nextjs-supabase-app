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
npm run lint:fix      # 자동 수정

# 타입 체크
npm run typecheck

# 포맷
npm run format        # 자동 수정
npm run format:check  # 검사만
```

> Husky + lint-staged가 설정되어 있어 `git commit` 시 ESLint + Prettier가 자동 실행됩니다.

## 환경 변수

`.env.local` 파일에 아래 두 변수가 필요합니다:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` 값을 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`에 넣어도 됩니다.

## 앱 개요

**Gather** — 이벤트 생성 및 초대 링크 기반 참여자 관리 앱.

- 주최자(host)가 이벤트를 생성하면 8자리 초대 코드가 자동 발급됩니다.
- 참여자는 `/invite/[invite_code]` 링크로 참여합니다.
- 참여자 목록은 Supabase Realtime(postgres_changes)으로 실시간 갱신됩니다.

## 라우트 구조

| 경로                    | 설명                                                        |
| ----------------------- | ----------------------------------------------------------- |
| `/`                     | 랜딩 페이지 (비로그인 허용)                                 |
| `/auth/*`               | 인증 페이지 (로그인, 회원가입, 비밀번호 등)                 |
| `/protected/*`          | 로그인 필수 영역 (미들웨어가 리다이렉트)                    |
| `/invite/[invite_code]` | 초대 링크 (비로그인 시 `?next=` 포함 로그인으로 리다이렉트) |
| `/admin/*`              | 관리자 전용 패널 (`is_admin_user()` RPC로 권한 확인)        |

`app/protected/` 레이아웃은 `MobileShell` 래퍼를 사용합니다 (모바일 우선 디자인).

## 아키텍처

### 인증 흐름

`lib/supabase/proxy.ts`의 `updateSession()`이 미들웨어 역할을 합니다. `/auth/*` 및 `/` 이외의 경로에 비로그인 접근 시 `/auth/login`으로 리다이렉트합니다.

인증 관련 페이지는 `app/auth/` 하위에 있고, 로그인 후 이동하는 보호 구역은 `app/protected/` 하위입니다.

### Supabase 클라이언트 3종

| 파일                     | 용도                                                      |
| ------------------------ | --------------------------------------------------------- |
| `lib/supabase/server.ts` | Server Component / Route Handler / Server Action에서 사용 |
| `lib/supabase/client.ts` | Client Component에서 사용                                 |
| `lib/supabase/proxy.ts`  | 미들웨어에서 세션 갱신용으로만 사용                       |

> 서버 클라이언트는 전역 변수에 저장하지 말고, 매 요청마다 새로 생성해야 합니다.

### 데이터 레이어

**타입 파일:**

- `types/database.ts` — Supabase CLI로 생성된 DB 타입 (직접 수정 금지, CLI로 재생성)
- `types/gather.ts` — 도메인 타입 (`GatherEvent`, `GatherParticipant`, `GatherUser` 등)

**데이터 함수:**

- `lib/supabase/events.ts` — 이벤트 CRUD (`createEvent`, `updateEvent`, `deleteEvent`, `getEventById`, `getHostedEvents`, `getJoinedEvents`, `getEventByInviteCode`)
- `lib/supabase/participants.ts` — 참여자 관리 (`joinEvent`, `leaveEvent`, `getParticipantsByEventId`)
- `lib/supabase/profile.ts` — 프로필 CRUD (`getProfile`, `updateProfile`)
- `lib/supabase/auth-errors.ts` — Supabase 인증 에러 메시지를 한국어로 변환

**DB 특이사항:**

- `events_with_count`는 테이블이 아닌 DB **뷰** (참여자 수 집계 포함)
- `EventStatus`(`upcoming`/`ongoing`/`ended`)는 DB에 저장되지 않고 `calculateEventStatus()`가 런타임에 계산 (이벤트 날짜 ±2시간 기준)
- 이벤트 생성 시 주최자는 `event_participants` 테이블에 `role: "host"`로 자동 등록

**Server Action 위치:** `app/protected/events/[id]/actions.ts`처럼 라우트 폴더 내 `actions.ts`에 위치

### 유효성 검사

`lib/validations/event.ts` — Zod 스키마 (`eventSchema`). Server Action과 react-hook-form에서 재사용됩니다.

### 관리자 패널

`app/admin/(protected)/layout.tsx`에서 `supabase.rpc("is_admin_user")`(SECURITY DEFINER 함수)로 관리자 여부를 확인합니다. 일반 유저는 `/`로 리다이렉트됩니다.

### 컴포넌트

- `components/ui/` — shadcn/ui 기반 공통 컴포넌트 (`npx shadcn@latest add <component>`로 추가)
- `components/gather/` — Gather 앱 전용 기능 컴포넌트 (이벤트 카드, 참여자 카드, 초대 버튼 등)
- `components/admin/` — 관리자 패널 컴포넌트
- `components/` 루트 — 레이아웃 래퍼 등 공통 컴포넌트

**Realtime:** `components/gather/realtime-participants.tsx`는 `event_participants` 테이블 변경을 구독하고, payload에 profiles JOIN 데이터가 없어 변경 시 `router.refresh()`로 Server Component를 재실행합니다.

### 테마

`next-themes`를 통해 라이트/다크 테마를 지원하며, `ThemeProvider`는 루트 레이아웃(`app/layout.tsx`)에서 설정합니다.
