import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 비로그인 → 로그인 페이지로
  if (!user) {
    redirect("/auth/login");
  }

  // SECURITY DEFINER 함수로 RLS 없이 admin 여부 확인
  const { data: isAdmin } = await supabase.rpc("is_admin_user");

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-6">
          <span className="text-sm text-muted-foreground">관리자 패널</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
