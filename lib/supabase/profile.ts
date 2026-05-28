import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesUpdate } from "@/types/database";

type ProfileUpdate = TablesUpdate<"profiles">;

export async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  // 사용하는 컬럼만 명시적으로 선택하여 불필요한 데이터 전송 방지
  // bio, website, updated_at은 프로필 수정 폼(ProfileForm)에서 사용
  return supabase
    .from("profiles")
    .select(
      "id, full_name, username, avatar_url, email, role, created_at, bio, website, updated_at",
    )
    .eq("id", userId)
    .single();
}

export async function updateProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  data: ProfileUpdate,
) {
  return supabase.from("profiles").update(data).eq("id", userId);
}
