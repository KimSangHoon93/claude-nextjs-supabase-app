"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/supabase/profile";

export async function setupProfileAction(
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

  const fullName = (formData.get("full_name") as string)?.trim();

  if (!fullName) {
    return { error: "닉네임을 입력해주세요." };
  }

  const { error } = await updateProfile(supabase, user.id, {
    full_name: fullName,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/protected/events");
}
