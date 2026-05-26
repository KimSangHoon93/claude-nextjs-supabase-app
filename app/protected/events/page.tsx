import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getHostedEvents, getJoinedEvents } from "@/lib/supabase/events";
import EventsContent from "@/components/gather/events-content";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const [hostedEvents, joinedEvents] = await Promise.all([
    getHostedEvents(supabase, user.id),
    getJoinedEvents(supabase, user.id),
  ]);

  return (
    <EventsContent hostedEvents={hostedEvents} joinedEvents={joinedEvents} />
  );
}
