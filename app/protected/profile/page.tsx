import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { ProfileForm } from "@/components/profile-form";

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
    <div className="flex w-full max-w-2xl flex-1 flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">프로필 편집</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          프로필 정보를 수정하고 저장하세요.
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
