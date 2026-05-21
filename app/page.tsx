import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Link2, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* 네비게이션 */}
      <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
        <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
          <Link href="/" className="text-base font-bold">
            모임링크
          </Link>
          <div className="flex items-center gap-4">
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
            카톡에 묻히는 공지,
            <br />
            이제 링크 하나로 해결하세요
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            수영, 헬스, 농구, 친구 모임 — 회원가입 없이 링크만 공유하면 참여자가
            바로 신청할 수 있습니다.
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

        {/* 핵심 가치 3가지 */}
        <section className="grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Link2 size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold">링크 하나로 공유</h3>
            <p className="text-sm text-muted-foreground">
              이벤트를 만들고 고유 링크를 카톡, 인스타, 문자 어디든 공유하세요.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold">가입 없이 참여 신청</h3>
            <p className="text-sm text-muted-foreground">
              참여자는 회원가입 없이 이름과 연락처만으로 즉시 신청할 수
              있습니다.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CalendarCheck size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold">공지로 소통</h3>
            <p className="text-sm text-muted-foreground">
              이메일 공지를 보내거나 공지 페이지를 공유해 참여자와 쉽게
              소통하세요.
            </p>
          </div>
        </section>
      </div>

      <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs">
        <p className="text-muted-foreground">
          © 2025 모임링크. 소모임 이벤트 관리 서비스.
        </p>
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
