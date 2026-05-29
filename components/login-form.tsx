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

interface WebViewInfo {
  isWebView: boolean;
  isAndroid: boolean;
  isIOS: boolean;
}

// 카카오톡, 라인, 인스타그램 등 인앱 브라우저 감지 및 플랫폼 정보 반환
function detectWebViewInfo(): WebViewInfo {
  if (typeof window === "undefined")
    return { isWebView: false, isAndroid: false, isIOS: false };
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isWebView =
    /KAKAOTALK/i.test(ua) ||
    /Line\//i.test(ua) ||
    /Instagram/i.test(ua) ||
    /FBAN|FBAV/i.test(ua) ||
    /NaverApp/i.test(ua) ||
    /Twitter/i.test(ua) ||
    (isAndroid && /wv/.test(ua)) ||
    /WebView/i.test(ua);
  return { isWebView, isAndroid, isIOS };
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
  const [webViewInfo, setWebViewInfo] = useState<WebViewInfo>({
    isWebView: false,
    isAndroid: false,
    isIOS: false,
  });
  const [urlCopied, setUrlCopied] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeNext = getSafeNext(searchParams.get("next"));

  useEffect(() => {
    setWebViewInfo(detectWebViewInfo());
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

  // Android: intent URL로 Chrome 강제 실행, iOS: 클립보드 복사
  const handleOpenInBrowser = async () => {
    const currentUrl = window.location.href;
    if (webViewInfo.isAndroid) {
      const host = currentUrl.replace(/^https?:\/\//, "");
      const fallback = encodeURIComponent(currentUrl);
      window.location.href = `intent://${host}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
    } else {
      await navigator.clipboard.writeText(currentUrl);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 3000);
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
            {webViewInfo.isWebView ? (
              /* 인앱 브라우저 — Google OAuth 차단, 외부 브라우저 유도 */
              <div className="flex flex-col gap-3">
                {webViewInfo.isAndroid ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleOpenInBrowser}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Chrome으로 열기
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleOpenInBrowser}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {urlCopied ? "링크가 복사되었습니다!" : "링크 복사하기"}
                  </Button>
                )}

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {webViewInfo.isAndroid ? (
                    <p>
                      Google 로그인은 인앱 브라우저에서 지원되지 않습니다. 위
                      버튼으로 Chrome에서 열거나, 하단 <strong>···</strong> 메뉴
                      → <strong>외부 브라우저로 열기</strong>를 이용하세요.
                    </p>
                  ) : (
                    <p>
                      Google 로그인은 인앱 브라우저에서 지원되지 않습니다.
                      링크를 복사한 뒤 <strong>Safari</strong>에서 열거나, 하단{" "}
                      <strong>···</strong> 메뉴 →{" "}
                      <strong>기본 브라우저로 열기</strong>를 이용하세요.
                    </p>
                  )}
                </div>
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
