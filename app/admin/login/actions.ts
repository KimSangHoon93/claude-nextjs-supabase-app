"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminLoginState = {
  error?: string;
} | null;

export async function adminLoginAction(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  // 로그인 성공 후 관리자 권한 확인
  const { data: isAdmin } = await supabase.rpc("is_admin_user");

  if (!isAdmin) {
    // 관리자가 아니면 세션 제거 후 에러 반환
    await supabase.auth.signOut();
    return { error: "관리자 계정이 아닙니다." };
  }

  redirect("/admin");
}
