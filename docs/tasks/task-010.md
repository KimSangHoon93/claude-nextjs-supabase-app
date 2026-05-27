# Task 010: 참여자 관리

## 개요

- **목표**: 초대 링크 참여 Server Action 구현, 실시간 참여자 업데이트, 참여 취소 기능 활성화
- **예상 소요 시간**: 1일
- **관련 기능**: F004 (초대 링크 참여), F005 (실시간 참여자 목록), F007 (내 이벤트 목록)
- **의존성**: Task 009 (이벤트 CRUD 및 초대 시스템) ✅ 완료

## 현재 상태 분석

### 이미 구현된 항목

- `lib/supabase/participants.ts` — joinEvent, leaveEvent, isParticipant, getParticipantRole, getParticipantsByEventId 함수
- `lib/supabase/events.ts` — getHostedEvents, getJoinedEvents (내 이벤트 목록)
- `app/invite/[invite_code]/page.tsx` — 초대 링크 UI (참여 버튼 form 포함)
- `app/protected/events/page.tsx` — 주최/참여 탭 이벤트 목록 페이지
- `app/protected/events/[id]/page.tsx` — 참여자 목록, 역할별 액션 UI

### 누락된 항목 (이번 Task에서 구현)

1. **`app/invite/[invite_code]/actions.ts`** — joinEventAction Server Action (핵심 누락)
2. **실시간 참여자 업데이트** — Supabase Realtime Client Component
3. **참여 취소 액션** — leaveEventAction 및 UI 활성화

## 구현 사항

### Step 1: 초대 링크 참여 Server Action 구현

- [x] `app/invite/[invite_code]/actions.ts` 파일 생성
  - `joinEventAction(inviteCode: string, _formData: FormData)` 구현
  - 비로그인 시 `/auth/login?next=/invite/{inviteCode}` 리다이렉트
  - 초대 코드로 이벤트 조회 (없으면 notFound)
  - 이미 참여 중인지 확인 (중복 참여 방지)
  - `joinEvent()` 호출
  - 성공 시 `/protected/events/{eventId}` 리다이렉트
  - 에러 시 throw Error (현재 UI 패턴 일치)

### Step 2: 참여 취소 Server Action 구현

- [x] `app/protected/events/[id]/actions.ts`에 `leaveEventAction` 추가
  - 비로그인/비참여자 접근 차단
  - `leaveEvent()` 호출
  - `revalidatePath` 후 이벤트 목록으로 리다이렉트
- [x] `app/protected/events/[id]/page.tsx`에서 참여 취소 버튼 활성화
  - 현재 disabled 상태인 버튼을 form action으로 교체

### Step 3: 실시간 참여자 업데이트

- [x] `components/gather/realtime-participants.tsx` Client Component 생성
  - Supabase Realtime으로 `event_participants` 테이블 구독
  - INSERT/DELETE 이벤트 수신 시 `router.refresh()`로 Server Component 재실행
  - Server Component인 이벤트 상세 페이지에서 초기 데이터 props로 전달
- [x] `app/protected/events/[id]/page.tsx`에 실시간 컴포넌트 교체
  - 기존 정적 participants.map → RealtimeParticipants 컴포넌트로 교체

## 수락 기준

- 초대 링크(`/invite/{code}`)에서 "참여하기" 버튼 클릭 시 이벤트에 참여되고 상세 페이지로 이동
- 비로그인 사용자가 초대 링크에서 로그인 후 동일 이벤트 상세 페이지로 자동 복귀
- 동일 이벤트에 중복 참여 시 오류 없이 처리 (이미 참여 중 상태 유지)
- 참여자가 이벤트 상세 페이지에서 "참여 취소" 가능
- 주최자(host)는 참여 취소 불가 (role 체크)
- 참여자 추가/삭제 시 이벤트 상세 페이지 참여자 목록 실시간 갱신

## 테스트 체크리스트

- [x] 비로그인 사용자가 초대 링크 접근 → 로그인 페이지 이동 (next 파라미터 포함) 확인 ✅ Playwright 검증
- [ ] 로그인 사용자가 초대 링크 참여하기 → 이벤트 상세 페이지에서 참여자 목록에 표시 확인
- [ ] 동일 이벤트에 이미 참여 중인 사용자가 초대 링크 재접근 → "이미 참여 중" 상태 표시 확인
- [ ] 참여자가 이벤트 상세 페이지에서 참여 취소 → 목록에서 제거, 내 이벤트 목록에서도 제거 확인
- [ ] 주최자(host)는 참여 취소 버튼 없음 확인
- [ ] 새 사용자가 초대 링크로 참여 시 이벤트 상세 페이지 참여자 수 실시간 증가 확인

## 관련 파일

### 생성할 파일

- `app/invite/[invite_code]/actions.ts` — joinEventAction
- `components/gather/realtime-participants.tsx` — 실시간 참여자 Client Component

### 수정할 파일

- `app/protected/events/[id]/actions.ts` — leaveEventAction 추가
- `app/protected/events/[id]/page.tsx` — 참여 취소 버튼 활성화, RealtimeParticipants 교체

### 참조 파일

- `lib/supabase/participants.ts` — joinEvent, leaveEvent, getParticipantsByEventId
- `lib/supabase/events.ts` — getEventByInviteCode
- `app/invite/[invite_code]/page.tsx` — 초대 링크 페이지 UI
