"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/supabase/profile";

export async function updateProfileAction(
  prevState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "인증이 필요합니다." };
  }

  const data = {
    full_name: (formData.get("full_name") as string) || null,
    website: (formData.get("website") as string) || null,
    bio: (formData.get("bio") as string) || null,
  };

  const { error } = await updateProfile(supabase, user.id, data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/protected/profile");
  revalidatePath("/protected/profile/edit");
  return { success: true };
}
