"use client";

import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { translateAuthError } from "@/lib/supabase/auth-errors";

// 카카오톡, 라인, 인스타그램 등 인앱 브라우저 감지
function detectWebView(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /KAKAOTALK/i.test(ua) ||
    /Line\//i.test(ua) ||
    /Instagram/i.test(ua) ||
    /FBAN|FBAV/i.test(ua) ||
    /NaverApp/i.test(ua) ||
    /Twitter/i.test(ua) ||
    (/Android/.test(ua) && /wv/.test(ua)) ||
    /WebView/i.test(ua)
  );
}

function getSafeNext(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/protected/events";
}

function LoginFormInner({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInWebView, setIsInWebView] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeNext = getSafeNext(searchParams.get("next"));

  useEffect(() => {
    setIsInWebView(detectWebView());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push(safeNext);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? translateAuthError(error.message)
          : "로그인에 실패했습니다",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 OAuth 로그인 — next 파라미터를 callback URL에 포함
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });
    if (error) {
      setError(translateAuthError(error.message));
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>
            이메일 또는 구글 계정으로 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 소셜 로그인 섹션 */}
          <div className="flex flex-col gap-4">
            {isInWebView ? (
              /* 인앱 브라우저 경고 — Google OAuth 차단됨 */
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950">
                <p className="font-semibold text-amber-800 dark:text-amber-200">
                  Google 로그인을 사용하려면
                </p>
                <p className="mt-1 text-amber-700 dark:text-amber-300">
                  현재 앱 내 브라우저에서는 Google 로그인이 지원되지 않습니다.
                  주소창 우측 메뉴(⋮)에서 <strong>Chrome으로 열기</strong> 또는{" "}
                  <strong>기본 브라우저로 열기</strong>를 선택해 주세요.
                </p>
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  이메일/비밀번호 로그인은 이 화면에서도 사용 가능합니다.
                </p>
              </div>
            ) : (
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
            )}

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
          </div>

          <form onSubmit={handleLogin} className="mt-4">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">비밀번호</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              계정이 없으신가요?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                회원가입
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <Suspense>
      <LoginFormInner className={className} {...props} />
    </Suspense>
  );
}
