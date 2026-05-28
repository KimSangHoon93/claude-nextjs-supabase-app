# Task 012: 핵심 기능 통합 테스트

## 개요

- **목표**: Playwright MCP로 Gather 앱 전체 사용자 플로우 E2E 검증
- **예상 소요 시간**: 1일
- **관련 기능**: F001~F015 (전체)
- **의존성**: Task 007~011 (모두 완료 ✅)

## 현재 구현 완료 상태

| 기능                      | 구현 파일                                     |
| ------------------------- | --------------------------------------------- |
| 인증 (Google OAuth)       | `lib/supabase/proxy.ts`, `middleware.ts`      |
| 이벤트 생성               | `app/protected/events/new/actions.ts`         |
| 이벤트 수정/삭제          | `app/protected/events/[id]/actions.ts`        |
| 초대 링크 참여            | `app/invite/[invite_code]/actions.ts`         |
| 참여 취소                 | `app/protected/events/[id]/actions.ts`        |
| 실시간 참여자 업데이트    | `components/gather/realtime-participants.tsx` |
| 관리자 대시보드           | `app/admin/(protected)/dashboard/page.tsx`    |
| 관리자 이벤트/사용자 관리 | `app/admin/(protected)/events/`, `users/`     |

## 구현 사항 (5단계)

### Step 1: 빌드 및 린트 검증

- [ ] `npm run lint:fix` 실행 → 린트 오류 자동 수정
- [ ] `npm run build` 실행 → 빌드 성공 (exit code 0)
- [ ] `npm run typecheck` 실행 → TypeScript 타입 오류 없음

### Step 2: 개발 서버 실행 및 비인증 접근 제어 테스트

- [ ] `npm run dev` 개발 서버 실행
- [ ] `/` → 랜딩 페이지 정상 표시 확인
- [ ] `/protected/events` → `/auth/login` 리다이렉트 확인
- [ ] `/invite/BADCODE` → `/auth/login?next=/invite/BADCODE` 리다이렉트 확인
- [ ] `/admin/dashboard` (비로그인) → `/` 또는 `/auth/login` 리다이렉트 확인
- [ ] `/auth/login` → Google 로그인 버튼 UI 표시 확인

### Step 3: 주최자 플로우 통합 테스트 (로그인 세션 필요)

- [ ] `/protected/events` → 이벤트 목록 로드 확인
- [ ] 이벤트 생성: 폼 입력 → 제출 → `/protected/events/[id]` 이동 확인
- [ ] 초대 코드 표시 확인 및 `/invite/[code]` 접근 → '이미 참여 중' 표시
- [ ] 이벤트 수정: 수정 후 상세 페이지에 변경 내용 반영 확인
- [ ] 이벤트 삭제: 삭제 후 목록으로 이동 및 목록에서 제거 확인

### Step 4: 참여자 플로우 및 에러 케이스 테스트

- [ ] 중복 참여 방지: 이미 참여한 초대 링크 재접근 → '이미 참여 중인 이벤트예요' 표시
- [ ] 주최자 참여 취소 불가: 주최자 뷰에서 '참여 취소' 버튼 미노출 확인
- [ ] 잘못된 초대 코드: `/invite/INVALIDCODE` → `/protected/events` 리다이렉트
- [ ] 참여자 참여 취소: 취소 버튼 클릭 → 목록으로 이동 (participant 역할일 때)

### Step 5: 관리자 플로우 통합 테스트

- [ ] `/admin/dashboard` → KPI 카드 정상 표시 (숫자 포함)
- [ ] `/admin/events` → 이벤트 테이블 로드 및 검색 동작
- [ ] `/admin/users` → 사용자 테이블 로드 및 검색 동작
- [ ] 페이지네이션 버튼 클릭 → 페이지 이동 확인

## 수락 기준

- 모든 비인증 접근 제어가 올바른 리다이렉트로 처리됨
- 주최자가 이벤트 생성/수정/삭제를 정상적으로 수행 가능
- 초대 링크 참여 플로우 정상 동작 (중복 참여 무시 포함)
- 관리자 대시보드에서 실시간 지표 표시
- 빌드 및 린트 오류 없음

## 테스트 체크리스트

- [ ] `/protected/*` 비로그인 접근 → `/auth/login` 리다이렉트
- [ ] `/invite/[code]` 비로그인 접근 → `/auth/login?next=/invite/[code]`
- [ ] `/admin/*` 비관리자 접근 → `/` 리다이렉트
- [ ] 이벤트 생성 → DB 저장 확인 (상세 페이지 렌더링)
- [ ] 이벤트 수정 → 변경 내용 반영 확인
- [ ] 이벤트 삭제 → 목록에서 제거 확인
- [ ] 초대 링크 재참여 → '이미 참여 중' 표시
- [ ] 주최자 '참여 취소' 버튼 미노출 확인
- [ ] 관리자 KPI 카드 데이터 표시

## 관련 파일

### 핵심 테스트 대상

- `app/invite/[invite_code]/page.tsx` — 초대 링크 페이지
- `app/invite/[invite_code]/actions.ts` — joinEventAction
- `app/protected/events/new/actions.ts` — createEventAction
- `app/protected/events/[id]/page.tsx` — 이벤트 상세 페이지
- `app/protected/events/[id]/actions.ts` — leaveEventAction, deleteEventAction
- `app/admin/(protected)/dashboard/page.tsx` — 관리자 대시보드
- `components/gather/realtime-participants.tsx` — 실시간 참여자

### 인프라

- `middleware.ts` — 라우트 보호
- `lib/supabase/proxy.ts` — updateSession (미들웨어)
- `app/admin/(protected)/layout.tsx` — 관리자 권한 (is_admin_user RPC)

## 주의사항

- **Google OAuth**: 자동화 불가 → 테스트 시작 전 브라우저에서 수동 로그인 필요
- **테스트 데이터 정리**: 생성한 테스트 이벤트는 반드시 삭제
- **관리자 계정**: `profiles.role = 'admin'`으로 설정된 계정 필요
