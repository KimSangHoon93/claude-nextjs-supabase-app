import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { SetupProfileForm } from "@/components/setup-profile-form";

export default async function SetupProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 이미 닉네임이 설정된 경우 이벤트 페이지로
  const { data: profile } = await getProfile(supabase, user.id);
  if (profile?.full_name) {
    redirect("/protected/events");
  }

  // OAuth user_metadata에서 Google 계정 이름을 기본값으로
  const defaultName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    "";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SetupProfileForm defaultName={defaultName} />
      </div>
    </div>
  );
}
