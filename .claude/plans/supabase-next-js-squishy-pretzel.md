# 프로필 테이블 생성 및 관리 기능 구현 — 최종 계획

## Context

현재 프로젝트는 Supabase 인증(이메일/패스워드)이 완전히 구현된 Next.js 15 스타터입니다.  
`auth.users` 외에 공개 스키마 테이블이 전혀 없어 사용자 추가 정보(이름, 소개 등)를 저장·표시할 수 없습니다.  
이 플랜은 `public.profiles` 테이블 생성부터 UI까지 전 과정을 다룹니다.  
**Supabase Storage(아바타 업로드)는 이번 범위에서 제외하며 추후 별도 진행합니다.**

---

## 구현 순서 및 상세 내용

### Step 1. SQL 마이그레이션 — 테이블 & 트리거 & RLS

도구: `mcp__supabase__apply_migration` (name: `create_profiles`)

```sql
-- ① profiles 테이블
CREATE TABLE public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  username    TEXT        UNIQUE,
  avatar_url  TEXT,           -- Storage 연동은 추후 진행
  website     TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ② updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ③ 회원가입 시 프로필 자동 생성 함수 (SECURITY DEFINER: auth 스키마 접근)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ④ RLS 활성화 및 정책
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 프로필 조회" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "본인 프로필 수정" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "본인 프로필 삽입" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

---

### Step 2. TypeScript 타입 생성

도구: `mcp__supabase__generate_typescript_types`  
결과: `types/database.ts` (신규 파일)에 저장

```ts
// 생성 결과 예시
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string | null; full_name: string | null; ... }
        Insert: { id: string; email?: string | null; ... }
        Update: { email?: string | null; full_name?: string | null; ... }
      }
    }
  }
}
```

---

### Step 3. 프로필 유틸리티 함수

신규 파일: `lib/supabase/profile.ts`

```ts
// getProfile: 사용자 ID로 프로필 조회
export async function getProfile(supabase, userId: string)

// updateProfile: 프로필 데이터 수정
export async function updateProfile(supabase, userId: string, data: ProfileUpdate)
```

- `Database` 타입을 import해 타입 안정성 확보
- 기존 `lib/supabase/server.ts`, `lib/supabase/client.ts` 패턴 그대로 재사용

---

### Step 4. Server Action

신규 파일: `app/protected/profile/actions.ts`

```ts
'use server'
// updateProfileAction(formData): 서버 액션으로 프로필 수정 처리
// revalidatePath('/protected/profile') 호출로 캐시 무효화
```

---

### Step 5. UI 컴포넌트 및 페이지

**`components/profile-form.tsx`** (신규)
- `'use client'` 컴포넌트
- 입력 필드: full_name, username, website, bio
- Shadcn UI: `Input`, `Textarea`, `Button`, `Label`, `Card`
- `updateProfileAction` Server Action 호출

**`app/protected/profile/page.tsx`** (신규)
- 서버 컴포넌트, `lib/supabase/server.ts`로 프로필 로드
- `<ProfileForm>` 렌더링

**`app/protected/page.tsx`** (수정)
- 기존 JSON 클레임 표시 제거
- 프로필 이름·이메일 표시 + "프로필 편집" 링크(`/protected/profile`) 추가

---

## 파일 목록

| 구분 | 경로 |
|------|------|
| 신규 | `types/database.ts` |
| 신규 | `lib/supabase/profile.ts` |
| 신규 | `app/protected/profile/actions.ts` |
| 신규 | `components/profile-form.tsx` |
| 신규 | `app/protected/profile/page.tsx` |
| 수정 | `app/protected/page.tsx` |

---

## 검증 방법

1. `mcp__supabase__list_tables` — `profiles` 테이블 생성 확인
2. `mcp__supabase__execute_sql` — 트리거·RLS 정책 존재 여부 쿼리
3. 신규 회원가입 → `profiles` 레코드 자동 삽입 확인
4. `/protected/profile` 접속 → 프로필 조회·수정 동작 확인
5. TypeScript 타입 오류 없이 빌드 통과 (`tsc --noEmit`)
