"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/protected/events", label: "이벤트", icon: CalendarDays },
  { href: "/", label: "홈", icon: Home },
  { href: "/protected/profile", label: "프로필", icon: User },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4">
        <Link href="/" className="text-lg font-bold">
          Gather
        </Link>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 pb-20">{children}</main>

      {/* 하단 내비게이션 바 (모바일) */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 flex h-16 items-center justify-around border-t bg-background">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href) && href !== "/";
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={22} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
