"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEventByInviteCode } from "@/lib/supabase/events";
import { joinEvent } from "@/lib/supabase/participants";

export async function joinEventAction(
  inviteCode: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/invite/${inviteCode}`);
  }

  const event = await getEventByInviteCode(supabase, inviteCode);

  if (!event) {
    redirect("/protected/events");
  }

  const { error } = await joinEvent(supabase, event.id, user.id);

  // 중복 참여(23505 unique_violation)이면 이미 참여 중 — 상세 페이지로 이동
  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }

  revalidatePath(`/protected/events/${event.id}`);
  revalidatePath("/protected/events");
  redirect(`/protected/events/${event.id}`);
}
