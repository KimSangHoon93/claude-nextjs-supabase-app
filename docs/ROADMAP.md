# 소모임 이벤트 관리 MVP 개발 로드맵

카카오톡 채팅에 묻히는 공지/명단 문제를 해결하기 위한, 가입 없는 참여 신청 기반 소모임 이벤트 관리 서비스.

## 개요

소모임 이벤트 관리 MVP는 수영, 헬스, 농구, 친구 모임 등 **소규모 비정기·정기 모임을 직접 운영하는 주최자**를 위한 서비스로 다음 기능을 제공합니다:

- **이벤트 생성/관리**: 주최자가 제목, 장소, 시각, 정원 등을 입력해 이벤트를 만들고 공유 링크(`share_token`)를 발급받아 카톡 외부로 공유
- **비로그인 참여 신청**: 참여자는 회원가입 없이 링크 접속 후 이름·연락처만으로 즉시 참여 확정, 정원 초과 시 마감 표시
- **공지 발송**: 주최자가 작성한 공지를 참여자에게 이메일(Resend)로 발송하고 공지 목록 페이지에서도 별도 확인 가능

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

기존 스타터에 이미 구축된 인증 인프라를 기반으로, 이벤트 도메인의 라우트 구조와 공통 레이아웃 골격을 먼저 완성합니다. 도메인 타입 및 DB 스키마 설계는 UI/UX를 먼저 검증한 뒤 Phase 3에서 진행합니다.

- **Task 001: 인증 및 기본 인프라 구축** ✅ - 완료 (기존 스타터)
  - 본 작업은 PRD 작성 시점 이전에 `claude-nextjs-supabase-app` 스타터로 이미 완료된 상태입니다.
  - ✅ Supabase 이메일/비밀번호 + Google OAuth 인증 구현
  - ✅ `/auth/login`, `/auth/sign-up`, `/auth/callback`, `/auth/confirm`, `/auth/forgot-password`, `/auth/update-password`, `/auth/sign-up-success`, `/auth/error` 라우트 구성
  - ✅ `/protected/` 레이아웃 및 미들웨어 기반 보호 라우팅 (`proxy.ts`, `lib/supabase/proxy.ts`)
  - ✅ Supabase 클라이언트 3종 분리 (`lib/supabase/server.ts`, `client.ts`, `proxy.ts`)
  - ✅ `components/ui/` shadcn/ui 공통 컴포넌트 (Button, Input, Card, Label, Textarea, Badge 등)
  - ✅ `next-themes` 기반 라이트/다크 테마 지원
  - ✅ `/protected/profile` 프로필 편집 페이지 및 `lib/supabase/profile.ts` 데이터 레이어
  - ✅ `types/database.ts` Supabase CLI 생성 타입 (profiles 테이블)

- **Task 002: 미들웨어 공개 경로 확장 및 라우트 골격 생성** - 우선순위
  - `lib/supabase/proxy.ts` `updateSession()` 화이트리스트에 `/e/` 경로 추가 (비로그인 참여자 접근 허용)
  - `app/e/[share_token]/page.tsx` 빈 껍데기 생성 (이벤트 공개 페이지)
  - `app/e/[share_token]/announcements/page.tsx` 빈 껍데기 생성 (참여자용 공지 목록)
  - `app/protected/events/new/page.tsx` 빈 껍데기 생성 (이벤트 생성)
  - `app/protected/events/[id]/page.tsx` 빈 껍데기 생성 (이벤트 관리 상세)
  - `app/protected/events/[id]/edit/page.tsx` 빈 껍데기 생성 (이벤트 수정)
  - `app/protected/events/[id]/participants/page.tsx` 빈 껍데기 생성 (참여자 목록)
  - `app/protected/events/[id]/announcements/page.tsx` 빈 껍데기 생성 (주최자용 공지 목록)
  - `app/protected/events/[id]/announcements/new/page.tsx` 빈 껍데기 생성 (공지 작성)

- **Task 003: 공통 레이아웃 및 네비게이션 골격 구성**
  - `app/protected/layout.tsx`에 이벤트 관리 사이드 네비게이션/브레드크럼 골격 추가
  - `app/e/[share_token]/layout.tsx` 신규 생성 (참여자용 공개 레이아웃: 이벤트 정보 헤더 + 공지 탭)
  - 랜딩 페이지(`app/page.tsx`) 골격 수정 — 서비스 소개 섹션 구조만 잡고 더미 카피 배치
  - 주최자 대시보드(`app/protected/page.tsx`) 골격 수정 — 이벤트 목록 영역 placeholder 배치

### Phase 2: UI/UX 완성 (더미 데이터 활용)

DB 연동 전에 모든 화면을 더미 데이터로 완성하여 사용자 플로우를 검증합니다. 더미 데이터는 인라인 타입으로 작성하며, 본 Phase 종료 시 도출된 UI 보완 사항(필드 추가/제거, 화면 흐름 변경 등)을 메모하여 Phase 3 스키마 설계의 입력으로 활용합니다.

- **Task 005: 더미 데이터 및 공통 컴포넌트 라이브러리 구축**
  - `lib/dummy/events.ts`, `lib/dummy/participants.ts`, `lib/dummy/announcements.ts` 더미 데이터 생성 (인라인 타입 또는 임시 타입 선언 활용)
  - 이벤트 카드 컴포넌트 (`components/event-card.tsx`) — 제목, 일시, 장소, 정원/현재 인원 뱃지
  - 참여자 행 컴포넌트 (`components/participant-row.tsx`) — 이름, 연락처, 상태 뱃지, 취소 버튼
  - 공지 아이템 컴포넌트 (`components/announcement-item.tsx`)
  - 정원 상태 뱃지 (`components/capacity-badge.tsx`) — 여유/마감 상태 표시
  - 공유 링크 복사 버튼 (`components/share-link-button.tsx`)
  - 빈 상태(EmptyState) 및 로딩 스켈레톤 컴포넌트
  - 필요한 shadcn/ui 컴포넌트 추가 설치 (`dialog`, `sonner`, `select`, `dropdown-menu` 등)
  - **UI 검증 후 보완 메모**: Phase 2 완료 시 UI 리뷰를 통해 추가/변경이 필요한 필드, 상태값, 화면 흐름을 `docs/ui-review-notes.md`(또는 동일 위치 메모)에 정리하여 Phase 3 Task 008 스키마 설계에 반영

- **Task 006: 공개 페이지 UI 구현 (더미 데이터)**
  - 랜딩 페이지 — 히어로, 핵심 가치 3가지, "시작하기" CTA → `/auth/login`
  - 이벤트 공개 페이지(`/e/[share_token]`) — 이벤트 상세 + 참여 신청 폼 + 정원 마감 시 비활성화 상태
  - 참여자용 공지 목록 페이지(`/e/[share_token]/announcements`) — 공지 목록 + 빈 상태
  - 반응형 디자인 (모바일 우선) 및 다크 모드 검증
  - 참여 신청 성공/실패 토스트 UI (Server Action은 Phase 3에서 연결)

- **Task 007: 주최자 페이지 UI 구현 (더미 데이터)**
  - 주최자 대시보드 — 내 이벤트 목록 카드 그리드 + "이벤트 만들기" 버튼
  - 이벤트 생성 페이지 — 제목, 설명, 장소, 시작/종료 일시, 정원 폼 (react-hook-form + zod 검증)
  - 이벤트 관리 상세 페이지 — 이벤트 요약 + 공유 링크 + 참여자/공지 진입 버튼 + 삭제(취소) 다이얼로그
  - 이벤트 수정 페이지 — 생성 폼 재사용
  - 참여자 목록 페이지 — 확정/취소 필터 + 취소 처리 버튼 + 인원 카운트
  - 주최자용 공지 목록 페이지 — 공지 목록 + "공지 작성" 버튼
  - 공지 작성 페이지 — 내용 입력 + 이메일 발송 체크박스
  - 사용자 플로우 전 구간 클릭스루 검증 (랜딩 → 로그인 → 대시보드 → 생성 → 관리 → 공개 페이지 → 참여 신청 → 공지 작성)

### Phase 3: 핵심 기능 구현

Phase 2에서 완성된 UI를 검토하고 필요한 수정을 반영한 뒤, 확정된 화면 흐름을 기반으로 DB 스키마를 설계하고 실제 데이터를 연결합니다. 도메인 타입 → 마이그레이션/RLS → Server Action 순서로 진행합니다.

- **Task 008: 도메인 타입 및 데이터 모델 설계 (UI 검증 결과 반영)** - 우선순위
  - Phase 2 종료 시 작성된 UI 보완 메모를 검토하여 필요한 필드/상태/관계 변경사항을 도메인 모델에 반영
  - `types/event.ts`에 `Event`, `EventStatus`, `EventFormInput` 타입 정의
  - `types/participant.ts`에 `Participant`, `ParticipantStatus` 타입 정의
  - `types/announcement.ts`에 `Announcement` 타입 정의
  - Supabase 마이그레이션 SQL 초안 작성 (`supabase/migrations/` 디렉토리, events / participants / announcements 테이블 스키마, 인덱스, 제약조건 정의)
  - share_token / participant_token 발급 정책 문서화 (UUID v4 또는 nanoid)
  - RLS 정책 설계 문서 작성 (적용은 Task 009에서)
  - Phase 2 더미 컴포넌트의 인라인 타입을 새로 정의된 도메인 타입으로 점진 교체할 수 있도록 import 경로 정리

- **Task 009: DB 마이그레이션 적용 및 RLS 정책 구성**
  - `supabase` MCP `apply_migration`으로 events / participants / announcements 테이블 생성
  - 인덱스: `events(owner_id)`, `events(share_token)` unique, `participants(event_id, status)`, `participants(participant_token)` unique, `announcements(event_id, created_at)`
  - `updated_at` 자동 갱신 트리거 (events 테이블)
  - RLS 정책 적용:
    - events: 주최자(owner)만 select/update/delete, share_token 기반 익명 select 허용
    - participants: share_token 기반 익명 insert 허용, owner만 select/update
    - announcements: owner만 insert, share_token 기반 익명 select 허용
  - `supabase generate_typescript_types`로 `types/database.ts` 재생성
  - `get_advisors`로 보안/성능 권고사항 점검

- **Task 010: 이벤트 도메인 데이터 레이어 및 Server Action 구현**
  - `lib/supabase/events.ts` — `createEvent`, `getEventById`, `getEventByShareToken`, `listMyEvents`, `updateEvent`, `cancelEvent`
  - `app/protected/events/new/actions.ts` — 이벤트 생성 Server Action (zod 검증, share_token 발급)
  - `app/protected/events/[id]/edit/actions.ts` — 이벤트 수정 Server Action
  - `app/protected/events/[id]/actions.ts` — 이벤트 취소(soft delete) Server Action
  - 주최자 대시보드 / 이벤트 관리 상세 / 수정 페이지에서 더미 데이터를 실 데이터로 교체
  - **Playwright MCP 테스트**: 이벤트 생성 → 대시보드 노출 → 수정 → 취소 전체 흐름 E2E 검증

- **Task 011: 참여자 도메인 구현 (비로그인 신청 + 정원 제어)**
  - `lib/supabase/participants.ts` — `createParticipant`, `listParticipantsByEvent`, `cancelParticipant`, `countConfirmedParticipants`
  - 정원 초과 방지를 위한 트랜잭션/RPC 함수 작성 (PostgreSQL function: `apply_participant` — capacity 체크 후 insert)
  - `app/e/[share_token]/actions.ts` — 비로그인 참여 신청 Server Action (participant_token 발급)
  - `app/protected/events/[id]/participants/actions.ts` — 참여자 취소 Server Action
  - 이벤트 공개 페이지 / 참여자 목록 페이지에서 더미 데이터를 실 데이터로 교체
  - 정원 마감 시 공개 페이지 버튼 비활성화 동작 실데이터 기반 연결
  - **Playwright MCP 테스트**:
    - 공유 링크 접속 → 참여 신청 성공 시나리오
    - 정원 가득 찬 상태에서 신청 버튼 비활성 검증
    - 주최자가 참여자 취소 처리 후 정원에 여유 생기는지 검증
    - 동시 신청 시 정원 초과 방지 검증 (RPC 함수)

- **Task 012: 공지 및 이메일 발송 파이프라인 구현**
  - `lib/supabase/announcements.ts` — `createAnnouncement`, `listAnnouncementsByEvent`, `markEmailSent`
  - Supabase Edge Function `send-announcement` 작성 (`supabase/functions/send-announcement/index.ts`)
    - 입력: announcement_id
    - 처리: 해당 이벤트의 confirmed 참여자 중 contact(이메일)가 있는 명단 조회 → Resend API로 발송 → `email_sent=true` 업데이트
  - `RESEND_API_KEY` 시크릿 설정 가이드 문서화 (`docs/guides/`)
  - `app/protected/events/[id]/announcements/new/actions.ts` — 공지 생성 Server Action (생성 후 옵션에 따라 Edge Function 호출)
  - 주최자용/참여자용 공지 목록 페이지에서 실데이터 연결
  - **Playwright MCP 테스트**:
    - 공지 작성 → 주최자/참여자용 공지 목록에 노출
    - 이메일 발송 체크 시 `email_sent=true` 전환 검증
    - 이메일 미수신자(contact 없는 참여자) 누락 처리 검증

- **Task 013: 핵심 기능 통합 E2E 테스트**
  - Playwright MCP로 전체 사용자 여정 회귀 테스트:
    - 주최자: 회원가입 → 로그인 → 이벤트 생성 → 공유 링크 복사 → 참여자 확인 → 공지 작성
    - 참여자: 공유 링크 접속 → 참여 신청 → 공지 페이지 확인
  - 에러 핸들링 케이스:
    - 만료/취소된 share_token 접근
    - 잘못된 participant_token
    - RLS 차단 (다른 주최자 이벤트 접근 시도)
  - 콘솔/네트워크 에러 로그 점검 (`browser_console_messages`, `browser_network_requests`)

### Phase 4: 고급 기능 및 최적화

- **Task 014: 사용자 경험 향상 및 운영 보강**
  - 참여 확정 시 참여자에게 확인 이메일 자동 발송 (옵션, contact 있는 경우)
  - 이벤트 시작 24시간 전 리마인더 이메일 (Supabase Scheduled Function)
  - 참여자 본인이 `participant_token` 으로 자기 신청 취소 기능 (`/e/[share_token]/cancel/[participant_token]`)
  - 이벤트 카드/공개 페이지에 OpenGraph 메타데이터 동적 생성 (카톡 공유 미리보기 최적화)
  - sonner 토스트 + 에러 바운더리 일관성 정리

- **Task 015: 성능 최적화, 품질 보증 및 Vercel 배포**
  - Next.js 캐싱 전략: `revalidateTag`로 이벤트 단위 캐시 무효화
  - 이미지/폰트 최적화, Lighthouse 모바일 90+ 목표
  - `npm run lint` 및 타입 체크 CI 구성 (GitHub Actions)
  - `get_advisors`로 Supabase 보안/성능 마지막 점검
  - Vercel 환경 변수 구성 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `RESEND_API_KEY`)
  - 프로덕션 배포 후 Playwright MCP 스모크 테스트 (주요 경로 5개)
  - 로깅/모니터링: Supabase `get_logs` 기반 운영 매뉴얼 작성
