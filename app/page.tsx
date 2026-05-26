import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MobileShell from "@/components/mobile-shell";
import HomeLanding from "@/components/gather/home-landing";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 사용자는 이벤트 목록으로 바로 이동
  if (user) {
    redirect("/protected/events");
  }

  return (
    <MobileShell>
      <HomeLanding />
    </MobileShell>
  );
}
