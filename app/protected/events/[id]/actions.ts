"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteEvent } from "@/lib/supabase/events";

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
