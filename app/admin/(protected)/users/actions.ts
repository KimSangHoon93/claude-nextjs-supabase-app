"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminDeleteUser } from "@/lib/supabase/admin";

// 관리자 사용자 삭제 Server Action
export async function adminDeleteUserAction(
  userId: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  // 관리자 권한 재확인
  const { data: isAdmin } = await supabase.rpc("is_admin_user");
  if (!isAdmin) {
    return { error: "관리자 권한이 없습니다" };
  }

  const { error } = await adminDeleteUser(supabase, userId);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
  return { error: null };
}
