import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile, error } = await getProfile(supabase, user.id);
  if (error || !profile) redirect("/auth/login");

  // 구글 OAuth가 아닌 경우를 이메일 사용자로 처리
  const isEmailUser = user.app_metadata?.provider !== "google";

  return (
    <div className="space-y-4 p-4">
      {/* 헤더 */}
      <div className="flex items-center gap-1">
        <Button asChild variant="ghost" size="icon" className="-ml-2">
          <Link href="/protected/profile">
            <ChevronLeft size={20} />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">프로필 수정</h1>
      </div>

      {/* 프로필 폼 */}
      <ProfileForm profile={profile} isEmailUser={isEmailUser} />
    </div>
  );
}
