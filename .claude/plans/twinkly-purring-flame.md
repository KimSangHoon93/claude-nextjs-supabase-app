# 소모임 이벤트 관리 웹 MVP 기획

## Context

소모임 주최자(수영, 헬스, 농구, 친구 모임 등)가 이벤트를 열 때 발생하는 참여자 관리 및 공지 부담을 해소하기 위한 MVP다.

**핵심 가설**: 주최자는 로그인하고, 참여자는 링크 하나로 별도 가입 없이 참여 신청을 할 수 있으면 "공지–참여 확인" 루프가 크게 단순해진다.

**선택 사항**:
- 타겟: 일반 소모임 주최자
- 핵심 기능: 참여자 관리 + 공지 (1순위)
- 인증: 주최자만 로그인, 참여자는 링크 공유 비로그인 참여
- 타임라인: 4~6주

---

## MVP 범위

### In Scope
1. 이벤트 생성·수정·삭제 (주최자)
2. 공유 링크(`/e/[share_token]`) 기반 비로그인 참여 신청
3. 참여자 목록 관리 (주최자)
4. 공지 작성 + 참여자 공지 확인
5. 이메일 알림 (이메일을 입력한 참여자 대상, Resend 연동)

### Out of Scope (Phase 2 이후)
- 카풀 매칭, 정산, 반복 이벤트, SMS/카카오 알림

---

## DB 스키마

### events
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
owner_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
title       text NOT NULL
description text
location    text
starts_at   timestamptz NOT NULL
ends_at     timestamptz
capacity    int          -- NULL이면 무제한
share_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex')
status      text NOT NULL DEFAULT 'active'  -- active | cancelled | completed
created_at  timestamptz NOT NULL DEFAULT now()
updated_at  timestamptz NOT NULL DEFAULT now()
```

### participants
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
event_id          uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE
name              text NOT NULL
contact           text           -- 이메일 (선택)
status            text NOT NULL DEFAULT 'confirmed'  -- confirmed | cancelled
participant_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex')
note              text
created_at        timestamptz NOT NULL DEFAULT now()
```

### announcements
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
event_id     uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE
content      text NOT NULL
email_sent   boolean NOT NULL DEFAULT false
created_at   timestamptz NOT NULL DEFAULT now()
```

### RLS 정책
- **events**: 주최자(owner_id = auth.uid())만 CRUD. 공개 조회는 Server Action에서 share_token + service-role client로 처리.
- **participants**: Server Action에서 share_token 유효성 검증 후 삽입. 취소는 participant_token 검증.
- **announcements**: Server Action에서 event 소유권 검증 후 CRUD. 공개 읽기는 share_token 검증 후.

### service-role client 규칙
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용 환경변수 (NEXT_PUBLIC_ 접두사 절대 금지)
- `'use server'` Server Action 또는 Route Handler에서만 service-role client 생성
- Client Component에서 절대 import 금지

### 정원 동시성
- `participants` INSERT 전에 확정 참여자 수를 SELECT COUNT → 정원 초과 시 에러 반환
- MVP 트래픽에서는 단순 카운트 체크로 충분하나, 향후 트래픽 증가 시 DB 레벨 트랜잭션 또는 CHECK constraint 적용 고려

---

## 라우트 구조

```
app/
├── page.tsx                                # 랜딩 (서비스 소개)
├── auth/                                   # 기존 유지 (로그인/회원가입)
│
├── e/                                      # 공개 경로 (비로그인 접근 가능)
│   └── [share_token]/
│       ├── page.tsx                        # 이벤트 상세 + 참여 신청 폼
│       └── announcements/
│           └── page.tsx                    # 공지 목록
│
└── protected/                              # 주최자 전용 (기존 폴더 유지)
    ├── layout.tsx                          # nav에 이벤트 링크 추가
    ├── page.tsx                            # 내 이벤트 목록 (대시보드 교체)
    ├── profile/                            # 기존 유지
    └── events/
        ├── new/page.tsx                    # 이벤트 생성 폼
        ├── [id]/page.tsx                   # 이벤트 관리 상세
        ├── [id]/edit/page.tsx              # 이벤트 수정 폼
        ├── [id]/participants/page.tsx      # 참여자 목록
        ├── [id]/announcements/page.tsx     # 공지 목록
        ├── [id]/announcements/new/page.tsx # 공지 작성
        └── actions.ts                      # Server Actions
```

---

## 미들웨어 수정

**파일**: `lib/supabase/proxy.ts`

```typescript
// 기존 auth 경로 체크 코드를 아래와 같이 교체
const PUBLIC_PATHS = ["/", "/auth", "/e"];
const isPublic = PUBLIC_PATHS.some(
  (p) => request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(p + "/")
);
if (!user && !isPublic) {
  return NextResponse.redirect(new URL("/auth/login", request.url));
}
```

---

## 비로그인 참여 흐름

1. 주최자가 `/protected/events/[id]`에서 공유 링크 복사
2. 참여자가 `/e/[share_token]` 접속 → 이벤트 정보 확인
3. 이름(필수) + 이메일(선택) 입력 후 참여 신청
4. Server Action: share_token 검증 → 정원 확인 → participants 행 삽입 → participant_token 생성
5. `participant_token`을 쿠키(`ptk_[event_id]`)에 저장 → 같은 기기 재방문 시 상태 표시
6. 이메일 입력 시: 취소 링크(`?me=[participant_token]`) 포함 확인 이메일 발송

---

## 공지 이메일 알림

**채널**: 인앱 공지 목록 + Resend 이메일 (이메일 입력 참여자만)

**구조**:
```
supabase/functions/
└── send-announcement/
    └── index.ts    # Resend API 호출
```

Server Action에서 공지 저장 후 Edge Function을 직접 HTTP fetch로 호출.

**환경변수**:
```
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_APP_URL=https://yourapp.com
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # 서버 전용, 절대 NEXT_PUBLIC_ 접두사 금지
```

---

## 개발 Phase

### Phase 1 (Week 1-2): DB + 이벤트 CRUD
- Supabase 마이그레이션 (3개 테이블 + RLS)
- `types/database.ts` 재생성
- `lib/supabase/events.ts` 작성 (getEventByToken, listEvents, createEvent, updateEvent)
- 이벤트 생성/수정 폼 + Server Actions
- 주최자 대시보드 (내 이벤트 목록)
- 미들웨어 PUBLIC_PATHS 수정

### Phase 2 (Week 3): 참여자 공개 뷰 + RSVP
- `/e/[share_token]` 공개 이벤트 페이지
- `lib/supabase/participants.ts` (joinEvent, cancelParticipant)
- RSVP Server Action (정원 확인 → 참여 신청 → 쿠키 저장)
- 참여 취소 (participant_token 검증)
- 주최자용 참여자 목록

### Phase 3 (Week 4): 공지 시스템
- 공지 작성/목록 (주최자)
- 공지 공개 목록 (참여자)
- `lib/supabase/announcements.ts`
- Resend Edge Function 연동 (이메일 알림)

### Phase 4 (Week 5-6): 마무리 + 배포
- 이벤트 취소 + 참여자 이메일 알림
- 참여자 명단 CSV 내보내기 (Route Handler)
- 모바일 반응형 점검
- 랜딩 페이지 교체
- Vercel 배포

---

## 재사용 기존 코드

| 재사용 대상 | 위치 |
|------------|------|
| `createClient()` 서버/클라이언트 | `lib/supabase/server.ts`, `client.ts` |
| `updateSession()` 미들웨어 | `lib/supabase/proxy.ts` |
| CRUD 함수 패턴 | `lib/supabase/profile.ts` → events/participants/announcements.ts |
| Server Action 패턴 | `app/protected/profile/actions.ts` |
| Form 컴포넌트 패턴 | `components/profile-form.tsx` |
| UI 컴포넌트 | `components/ui/` (Button, Input, Card, Label, Textarea) |
| Protected 레이아웃 | `app/protected/layout.tsx` (nav 링크만 추가) |

---

## 검증 방법

1. 주최자 계정으로 이벤트 생성 → 공유 링크 복사 확인
2. 로그아웃 상태에서 공유 링크 접속 → 참여 신청 완료
3. 주최자 대시보드에서 참여자 이름 확인
4. 공지 작성 후 참여자 뷰에서 공지 확인
5. (이메일 입력 시) 이메일 수신 확인
6. 정원 초과 시 에러 메시지 확인

---

## 확정된 결정 사항

1. **정원 초과 시**: 신청 자체를 막음 (버튼 비활성화 + "마감" 표시)
2. **참여 승인 방식**: 링크를 아는 누구나 즉시 참여 확정 (수동 승인 없음)
