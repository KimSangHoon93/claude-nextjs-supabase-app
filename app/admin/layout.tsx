"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart3, CalendarDays, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard, exact: true },
  { href: "/admin/events", label: "이벤트 관리", icon: CalendarDays },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/stats", label: "통계 분석", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 로그인 페이지는 사이드바/헤더 없이 full-screen으로 렌더링
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* 사이드바 */}
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r md:flex">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/admin" className="text-lg font-bold">
            Gather Admin
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {SIDEBAR_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-6">
          <span className="text-sm text-muted-foreground">관리자 패널</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
