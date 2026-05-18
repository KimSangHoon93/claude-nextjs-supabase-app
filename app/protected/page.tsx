import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await getProfile(supabase, user.id);

  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          로그인된 사용자만 이 페이지를 볼 수 있습니다.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <UserIcon size={24} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">
              {profile?.full_name ?? "이름 미설정"}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {profile?.bio && (
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
        )}

        {profile?.username && (
          <p className="text-sm">
            <span className="text-muted-foreground">사용자명: </span>
            <span className="font-mono">@{profile.username}</span>
          </p>
        )}

        <Button asChild variant="outline" className="w-fit">
          <Link href="/protected/profile">프로필 편집</Link>
        </Button>
      </div>
    </div>
  );
}
