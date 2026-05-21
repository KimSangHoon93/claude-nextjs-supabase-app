import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Link2, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* 네비게이션 */}
      <nav className="flex h-14 w-full justify-center border-b border-b-foreground/10">
        <div className="flex w-full max-w-5xl items-center justify-between px-5 text-sm">
          <Link href="/" className="text-lg font-bold">
            Gather
          </Link>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>

      <div className="flex w-full max-w-5xl flex-1 flex-col gap-20 px-5 py-20">
        {/* 히어로 섹션 */}
        <section className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            이벤트 초대, 링크 하나로 끝
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            제목, 날짜, 장소만 입력하면 초대 링크가 만들어집니다.
            <br />
            카카오톡으로 공유하고 참여자를 실시간으로 확인하세요.
          </p>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">무료로 시작하기</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login">로그인</Link>
            </Button>
          </div>
        </section>

        {/* 핵심 기능 3가지 */}
        <section className="grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CalendarPlus size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold">간편한 이벤트 생성</h3>
            <p className="text-sm text-muted-foreground">
              제목, 날짜, 장소만 입력하면 즉시 이벤트가 생성됩니다.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Link2 size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold">원클릭 초대 링크</h3>
            <p className="text-sm text-muted-foreground">
              자동 생성된 초대 링크를 카카오톡으로 간편하게 공유하세요.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold">실시간 참여자 관리</h3>
            <p className="text-sm text-muted-foreground">
              참여자 목록이 실시간으로 업데이트되어 항상 최신 현황을 확인할 수
              있습니다.
            </p>
          </div>
        </section>
      </div>

      <footer className="flex w-full items-center justify-center border-t py-8 text-center text-xs text-muted-foreground">
        © 2025 Gather. 소규모 이벤트 관리 플랫폼.
      </footer>
    </main>
  );
}
