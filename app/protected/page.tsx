import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex w-full max-w-5xl flex-1 flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">내 이벤트</h1>
        <Button asChild>
          <Link href="/protected/events/new">
            <CalendarPlus size={16} />
            이벤트 만들기
          </Link>
        </Button>
      </div>

      {/* 이벤트 목록 placeholder */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-center">
        <CalendarPlus size={40} className="text-muted-foreground" />
        <div>
          <p className="font-medium">아직 만든 이벤트가 없어요</p>
          <p className="mt-1 text-sm text-muted-foreground">
            첫 번째 이벤트를 만들고 참여자를 모아보세요
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/protected/events/new">이벤트 만들기</Link>
        </Button>
      </div>
    </div>
  );
}
