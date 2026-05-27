import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 관리자 권한 확인
      const { data: isAdmin } = await supabase.rpc("is_admin_user");

      if (isAdmin) {
        return NextResponse.redirect(`${origin}/admin`);
      }

      // 관리자가 아니면 세션 제거 후 에러와 함께 로그인 페이지로 리다이렉트
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/admin/login?error=${encodeURIComponent("관리자 계정이 아닙니다.")}`,
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/admin/login?error=${encodeURIComponent("구글 로그인에 실패했습니다.")}`,
  );
}
