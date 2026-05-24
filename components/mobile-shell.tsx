"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, CalendarDays, PlusSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/",
    label: "홈",
    icon: Home,
    exact: true,
  },
  {
    href: "/protected/events",
    label: "이벤트",
    icon: CalendarDays,
    exact: false,
    exclude: "/protected/events/new",
  },
  {
    href: "/protected/events/new",
    label: "새이벤트",
    icon: PlusSquare,
    exact: true,
  },
  {
    href: "/protected/profile",
    label: "프로필",
    icon: User,
    exact: false,
  },
];

export default function MobileShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    if (item.exact) return pathname === item.href;
    if (item.exclude && pathname.startsWith(item.exclude)) return false;
    return pathname.startsWith(item.href);
  }

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

        {/* 하단 내비게이션 */}
        <nav className="fixed bottom-0 left-1/2 z-10 flex h-16 w-full max-w-[430px] -translate-x-1/2 items-stretch bg-white shadow-[0_-1px_0_0_#e5e7eb] dark:bg-zinc-950 dark:shadow-[0_-1px_0_0_#27272a]">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors",
                  active
                    ? "text-emerald-500"
                    : "text-zinc-400 dark:text-zinc-500",
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span
                  className={cn(
                    "text-[10px]",
                    active ? "font-semibold" : "font-normal",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
