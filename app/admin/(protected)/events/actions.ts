"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminDeleteEvent } from "@/lib/supabase/admin";

// 관리자 이벤트 삭제 Server Action
export async function adminDeleteEventAction(
  eventId: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  // 관리자 권한 재확인
  const { data: isAdmin } = await supabase.rpc("is_admin_user");
  if (!isAdmin) {
    return { error: "관리자 권한이 없습니다" };
  }

  const { error } = await adminDeleteEvent(supabase, eventId);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/events");
  revalidatePath("/admin/dashboard");
  return { error: null };
}
