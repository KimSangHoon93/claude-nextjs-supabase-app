"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEventsActive =
    pathname.startsWith("/protected/events") &&
    !pathname.startsWith("/protected/events/new");
  const isProfileActive = pathname.startsWith("/protected/profile");

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      {/* 모바일 컨테이너: 최대 430px */}
      <div className="relative flex w-full max-w-[430px] flex-col bg-background shadow-sm">
        {/* 상단 헤더 */}
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4">
          <Link href="/" className="text-lg font-bold">
            Gather
          </Link>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 pb-20">{children}</main>

        {/* 하단 내비게이션 - 컨테이너 너비에 맞게 중앙 고정 */}
        <nav className="fixed bottom-0 left-1/2 z-10 flex h-16 w-full max-w-[430px] -translate-x-1/2 items-center bg-white shadow-[0_-1px_0_0_#e5e7eb] dark:bg-zinc-950 dark:shadow-[0_-1px_0_0_#27272a]">
          {/* 내 이벤트 탭 */}
          <Link
            href="/protected/events"
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors",
              isEventsActive
                ? "text-emerald-500"
                : "text-zinc-400 dark:text-zinc-500",
            )}
          >
            <CalendarDays size={22} strokeWidth={isEventsActive ? 2.5 : 1.8} />
            <span
              className={cn(
                "text-[10px]",
                isEventsActive ? "font-semibold" : "font-normal",
              )}
            >
              내 이벤트
            </span>
          </Link>

          {/* 새 이벤트 만들기 FAB */}
          <div className="flex flex-1 -translate-y-3 items-center justify-center">
            <Link
              href="/protected/events/new"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40 transition-transform active:scale-95 dark:bg-emerald-600"
              aria-label="새 이벤트 만들기"
            >
              <Plus size={26} className="text-white" strokeWidth={2.5} />
            </Link>
          </div>

          {/* 프로필 탭 */}
          <Link
            href="/protected/profile"
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors",
              isProfileActive
                ? "text-emerald-500"
                : "text-zinc-400 dark:text-zinc-500",
            )}
          >
            <User size={22} strokeWidth={isProfileActive ? 2.5 : 1.8} />
            <span
              className={cn(
                "text-[10px]",
                isProfileActive ? "font-semibold" : "font-normal",
              )}
            >
              프로필
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
