# 구글 로그인 기능 추가 계획

## Context

현재 프로젝트는 이메일/패스워드 인증만 구현되어 있다. Google OAuth를 추가해 사용자가 구글 계정으로 빠르게 가입/로그인할 수 있도록 한다. Supabase의 OAuth PKCE 플로우를 사용하며, 로그인·회원가입 양쪽에 **소셜 로그인 전용 섹션**을 별도로 분리하여 추가한다. OAuth 가입 사용자의 `profiles` 레코드는 DB 트리거로 자동 생성한다.

---

## 현재 상태 파악

- 모든 인증 폼은 Client Component (`"use client"`) — `createClient()` (브라우저용) 사용
- OAuth 코드 없음, OAuth 콜백 라우트 없음
- `app/auth/confirm/route.ts` — 이메일 OTP 전용, OAuth와 분리 필요
- 프로젝트 ref: `ekvenriuhenwuvguhfad`
- Supabase OAuth callback URL: `https://ekvenriuhenwuvguhfad.supabase.co/auth/v1/callback`

---

## Phase 1 — 외부 서비스 수동 설정 (사용자가 직접)

> **코드 작업 전 이 단계를 완료해야 합니다.**

### 1-1. Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/) → 프로젝트 선택 또는 신규 생성
2. **API 및 서비스 > 사용자 인증 정보** → **OAuth 2.0 클라이언트 ID 만들기**
3. 애플리케이션 유형: **웹 애플리케이션**
4. **승인된 자바스크립트 원본** 추가:
   ```
   http://localhost:3000
   https://[프로덕션-도메인]  (있다면)
   ```
5. **승인된 리디렉션 URI** 추가:
   ```
   https://ekvenriuhenwuvguhfad.supabase.co/auth/v1/callback
   ```
6. 생성 후 **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

### 1-2. Supabase 대시보드

1. [Supabase 대시보드](https://supabase.com/dashboard) → 프로젝트 선택
2. **Authentication > Providers > Google** 클릭
3. **Enable** 토글 활성화
4. Google Cloud에서 복사한 값 입력:
   - Client ID (for OAuth)
   - Client Secret
5. **Save** 클릭

---

## Phase 2 — 코드 구현 (사용자 제안 순서)

### 변경 파일 목록

| 순서 | 파일 | 작업 |
|------|------|------|
| 1 | `app/auth/callback/route.ts` | 신규 생성 — OAuth 코드 교환 |
| 2 | `components/login-form.tsx` | 수정 — 소셜 섹션 분리 UI |
| 3 | `components/sign-up-form.tsx` | 수정 — 로그인과 동일 UI 패턴 |
| 4 | Supabase DB 트리거 | MCP로 적용 — 프로필 자동 생성 |

---

### Step 1: `app/auth/callback/route.ts` 신규 생성

OAuth PKCE 플로우의 코드 교환 담당. Google → Supabase → 앱 순서로 리다이렉트.
리다이렉트 기본값은 `/protected` (기존 이메일 로그인과 동일).

```typescript
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/protected";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=구글 로그인에 실패했습니다`,
  );
}
```

---

### Step 2: `components/login-form.tsx` 수정 — 소셜 섹션 분리 UI

Google 버튼을 폼 하단에 붙이는 것이 아니라, **소셜 로그인 전용 섹션**을 Card 상단에 독립적으로 배치. 구조:

```
┌─────────────────────────────┐
│ 로그인                       │
│ 이메일 또는 구글 계정으로      │
├─────────────────────────────┤
│  [G]  Google로 계속하기      │  ← 소셜 섹션 (상단)
├─── 또는 이메일로 로그인 ──────┤  ← 구분선
│  이메일 ________________     │
│  비밀번호 _______________     │  ← 기존 이메일 폼 (하단)
│  [로그인]                    │
│  비밀번호 찾기 | 회원가입      │
└─────────────────────────────┘
```

**추가할 핸들러:**
```typescript
// 구글 OAuth 시작 — 성공 시 페이지 이동하므로 isLoading 리셋 불필요
const handleGoogleLogin = async () => {
  setIsLoading(true);
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) {
    setError(error.message);
    setIsLoading(false);
  }
};
```

**CardContent 내 소셜 섹션 (이메일 폼 위에 삽입):**
```tsx
{/* 소셜 로그인 섹션 */}
<Button
  type="button"
  variant="outline"
  className="w-full gap-2"
  onClick={handleGoogleLogin}
  disabled={isLoading}
>
  <svg role="img" viewBox="0 0 24 24" className="h-4 w-4">
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
    />
  </svg>
  Google로 계속하기
</Button>

{/* 구분선 */}
<div className="relative my-2">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-background px-2 text-muted-foreground">
      또는 이메일로 로그인
    </span>
  </div>
</div>
```

---

### Step 3: `components/sign-up-form.tsx` 수정

로그인 폼과 **동일한 UI 패턴** 적용. 소셜 섹션 상단 배치, 구분선 "또는 이메일로 회원가입", 기존 이메일 폼 하단. OAuth 회원가입은 이메일 확인 불필요.

---

### Step 4: Supabase DB 트리거 (MCP로 적용)

OAuth 신규 사용자 `auth.users` INSERT 시 `profiles` 레코드 자동 생성. `ON CONFLICT DO NOTHING`으로 기존 사용자에 영향 없음.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## OAuth 플로우 전체 흐름

```
"Google로 계속하기" 클릭
    ↓
signInWithOAuth({ redirectTo: "/auth/callback" })
    ↓
Google 로그인 페이지
    ↓
Supabase Auth (ekvenriuhenwuvguhfad.supabase.co/auth/v1/callback)
    ↓
앱 콜백 (app/auth/callback/route.ts)
  exchangeCodeForSession(code) → 쿠키에 세션 저장
    ↓
/protected 리다이렉트
    ↓ (신규 사용자)
DB 트리거: profiles 레코드 자동 생성 (Google 이름·아바타 포함)
```

---

## 검증 방법

```bash
npm run dev

# Playwright MCP로 검증:
# 1. /auth/login — 소셜 섹션 렌더링 확인
# 2. Google 버튼 클릭 → Google 페이지 이동 확인
# 3. /auth/sign-up — 동일 UI 패턴 확인

npm run typecheck && npm run lint
```

---

## 주의사항

- `signInWithOAuth` 성공 시 페이지 이동 → `isLoading`을 `false`로 리셋하지 않음
- 로컬 개발: Google Console **승인된 JavaScript 원본**에 `http://localhost:3000` 등록 필요
- DB 트리거: `SECURITY DEFINER`로 `auth.users` 접근 권한 확보
