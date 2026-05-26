"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const SIDEBAR_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "대시보드",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/admin/events", label: "이벤트 관리", icon: CalendarDays },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/stats", label: "통계 분석", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
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

      {/* 로그아웃 버튼 */}
      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut size={18} />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
