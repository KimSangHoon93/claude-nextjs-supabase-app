"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteEvent } from "@/lib/supabase/events";
import { leaveEvent, getParticipantRole } from "@/lib/supabase/participants";

export async function leaveEventAction(
  eventId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const role = await getParticipantRole(supabase, eventId, user.id);

  if (role !== "participant") {
    throw new Error("참여 취소 권한이 없습니다");
  }

  const { error } = await leaveEvent(supabase, eventId, user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/protected/events");
  redirect("/protected/events");
}

export async function deleteEventAction(
  eventId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { error } = await deleteEvent(supabase, eventId, user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/protected/events");
  redirect("/protected/events");
}
