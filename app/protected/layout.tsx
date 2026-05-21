import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex w-full flex-1 flex-col items-center gap-20">
        <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
          <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
            <div className="flex items-center gap-5 font-semibold">
              <Link href="/protected" className="text-base font-bold">
                모임링크
              </Link>
              <Link
                href="/protected"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                이벤트 관리
              </Link>
            </div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
        <div className="flex max-w-5xl flex-1 flex-col gap-20 p-5">
          {children}
        </div>

        <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs">
          <p className="text-muted-foreground">
            © 2025 모임링크. 소모임 이벤트 관리 서비스.
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
