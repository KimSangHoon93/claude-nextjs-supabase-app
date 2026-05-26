"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { eventSchema } from "@/lib/validations/event";
import { updateEvent } from "@/lib/supabase/events";
import type { ActionResult } from "@/app/protected/events/new/actions";

export async function updateEventAction(
  eventId: string,
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

  // 커버 이미지 처리: 새 파일이 있으면 업로드, 없으면 기존 URL 유지
  let coverImageUrl: string | null | undefined = undefined;
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

  // 이미지 제거 요청 시
  const removeImage = formData.get("removeImage");
  if (removeImage === "true") {
    coverImageUrl = null;
  }

  const { error } = await updateEvent(supabase, eventId, user.id, {
    ...validated.data,
    ...(coverImageUrl !== undefined ? { coverImageUrl } : {}),
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/protected/events");
  revalidatePath(`/protected/events/${eventId}`);
  redirect(`/protected/events/${eventId}`);
}
