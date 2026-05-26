"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { eventSchema } from "@/lib/validations/event";
import { createEvent } from "@/lib/supabase/events";

export type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createEventAction(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "인증이 필요합니다" };
  }

  const validated = eventSchema.safeParse({
    title: formData.get("title"),
    location: formData.get("location"),
    eventDate: formData.get("eventDate"),
    description: formData.get("description") || undefined,
  });

  if (!validated.success) {
    return {
      success: false,
      message: "입력 내용을 확인해주세요",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 커버 이미지 업로드 (선택 사항, 실패해도 이벤트 생성 계속)
  let coverImageUrl: string | null = null;
  const coverImageFile = formData.get("coverImage");
  if (coverImageFile instanceof File && coverImageFile.size > 0) {
    const ext = coverImageFile.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { data: uploadData } = await supabase.storage
      .from("event-covers")
      .upload(path, coverImageFile, { upsert: false });

    if (uploadData) {
      const { data: urlData } = supabase.storage
        .from("event-covers")
        .getPublicUrl(uploadData.path);
      coverImageUrl = urlData.publicUrl;
    }
  }

  const { error } = await createEvent(supabase, user.id, {
    ...validated.data,
    coverImageUrl,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/protected/events");
  redirect("/protected/events");
}
