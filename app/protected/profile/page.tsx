import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { ProfileForm } from "@/components/profile-form";
import { LogoutButton } from "@/components/logout-button";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold">프로필</h1>

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
