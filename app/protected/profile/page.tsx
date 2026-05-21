import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { ProfileForm } from "@/components/profile-form";
import { LogoutButton } from "@/components/logout-button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await getProfile(supabase, user.id);

  if (error || !profile) {
    redirect("/auth/login");
  }

  const seed = profile.username ?? profile.email ?? user.id;
  const avatarUrl =
    profile.avatar_url ??
    `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`;

  const displayName = profile.full_name ?? profile.username ?? "사용자";
  const fallback = displayName.slice(0, 1);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold">프로필</h1>

      {/* 아바타 + 기본 정보 */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 flex-shrink-0">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="text-2xl">{fallback}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-base font-semibold">{displayName}</p>
          <p className="truncate text-sm text-muted-foreground">
            {profile.email}
          </p>
          {profile.username && (
            <p className="truncate text-xs text-muted-foreground">
              @{profile.username}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* 프로필 폼 (Supabase 연동 유지) */}
      <ProfileForm profile={profile} />

      <Separator />

      {/* 로그아웃 */}
      <div>
        <LogoutButton />
      </div>
    </div>
  );
}
