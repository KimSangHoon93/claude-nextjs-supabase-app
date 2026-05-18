import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesUpdate } from "@/types/database";

type ProfileUpdate = TablesUpdate<"profiles">;

export async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  return supabase.from("profiles").select("*").eq("id", userId).single();
}

export async function updateProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  data: ProfileUpdate,
) {
  return supabase.from("profiles").update(data).eq("id", userId);
}
