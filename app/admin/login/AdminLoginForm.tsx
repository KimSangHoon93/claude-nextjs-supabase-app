"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLoginAction } from "./actions";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/supabase/auth-errors";

function AdminLoginFormInner() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  // 구글 OAuth 로그인 — 관리자 전용 콜백 URL 사용
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });
    if (error) {
      setGoogleError(translateAuthError(error.message));
      setIsGoogleLoading(false);
    }
  };

  // 에러 메시지 우선순위: Server Action 에러 > 구글 에러 > URL 파라미터 에러
  const errorMessage = state?.error ?? googleError ?? urlError;
  const isDisabled = isPending || isGoogleLoading;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-2 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield size={24} className="text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">관리자 로그인</CardTitle>
        <CardDescription>
          Gather 관리자 패널에 접속하려면 로그인하세요
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 구글 로그인 버튼 */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogleLogin}
          disabled={isDisabled}
        >
          <svg role="img" viewBox="0 0 24 24" className="h-4 w-4">
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
          </svg>
          {isGoogleLoading ? "처리 중..." : "Google로 로그인"}
        </Button>

        {/* 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              또는 이메일로 로그인
            </span>
          </div>
        </div>

        {/* 이메일/비밀번호 폼 */}
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              required
              disabled={isDisabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
              disabled={isDisabled}
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          <Button type="submit" className="w-full" disabled={isDisabled}>
            {isPending ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function AdminLoginForm() {
  return (
    <Suspense>
      <AdminLoginFormInner />
    </Suspense>
  );
}
