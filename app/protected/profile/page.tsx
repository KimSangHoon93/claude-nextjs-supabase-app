import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Settings, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile, error } = await getProfile(supabase, user.id);
  if (error || !profile) redirect("/auth/login");

  // 이벤트 통계 병렬 조회
  const [{ count: hostedCount }, { count: joinedCount }] = await Promise.all([
    supabase
      .from("event_participants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("role", "host"),
    supabase
      .from("event_participants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("role", "participant"),
  ]);

  const displayName = profile.full_name ?? profile.username ?? "사용자";
  const fallback = displayName.slice(0, 1).toUpperCase();
  const seed = profile.username ?? profile.email ?? user.id;
  const avatarUrl =
    profile.avatar_url ??
    `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`;

  const roleLabel = profile.role === "admin" ? "관리자" : "사용자";
  const joinedDate = dateFormatter.format(new Date(profile.created_at));

  return (
    <div className="space-y-3 p-4">
      {/* 아바타 + 기본 정보 */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
        <Avatar className="h-16 w-16 flex-shrink-0">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="text-2xl">{fallback}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{displayName}</p>
          <p className="truncate text-sm text-muted-foreground">
            {profile.email}
          </p>
        </div>
      </div>

      {/* 이벤트 통계 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-1.5 rounded-xl border bg-card py-4">
          <CalendarDays size={22} className="text-primary" />
          <p className="text-2xl font-bold">{hostedCount ?? 0}</p>
          <p className="text-xs text-muted-foreground">만든 이벤트</p>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-xl border bg-card py-4">
          <Users size={22} className="text-primary" />
          <p className="text-2xl font-bold">{joinedCount ?? 0}</p>
          <p className="text-xs text-muted-foreground">참여한 이벤트</p>
        </div>
      </div>

      {/* 계정 정보 */}
      <div className="space-y-3 rounded-xl border bg-card p-4">
        <p className="text-sm font-semibold">계정 정보</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">역할</span>
          <span>{roleLabel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">가입일</span>
          <span>{joinedDate}</span>
        </div>
      </div>

      {/* 프로필 수정 버튼 */}
      <Button asChild variant="outline" className="w-full">
        <Link href="/protected/profile/edit">
          <Settings size={16} className="mr-2" />
          프로필 수정
        </Link>
      </Button>

      {/* 로그아웃 */}
      <LogoutButton />
    </div>
  );
}
