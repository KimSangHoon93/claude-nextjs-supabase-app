import { notFound, redirect } from "next/navigation";
import EventForm from "@/components/gather/event-form";
import { createClient } from "@/lib/supabase/server";
import { getEventById } from "@/lib/supabase/events";
import { updateEventAction } from "./actions";

interface EventEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventEditPage({ params }: EventEditPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const event = await getEventById(supabase, id);
  if (!event) notFound();

  // 주최자만 수정 가능
  if (event.createdBy !== user.id) notFound();

  // datetime-local input 형식(YYYY-MM-DDTHH:mm)에 맞게 변환
  const defaultValues = {
    title: event.title,
    location: event.location,
    eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
    description: event.description ?? "",
  };

  const boundAction = updateEventAction.bind(null, id);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold">이벤트 수정</h1>
      <EventForm
        mode="edit"
        action={boundAction}
        defaultValues={defaultValues}
        defaultImageUrl={event.coverImageUrl}
      />
    </div>
  );
}
