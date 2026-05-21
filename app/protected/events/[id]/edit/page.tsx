import { notFound } from "next/navigation";
import EventForm from "@/components/gather/event-form";
import { getMockEventById } from "@/lib/mock-data";

interface EventEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventEditPage({ params }: EventEditPageProps) {
  const { id } = await params;
  const event = getMockEventById(id);

  if (!event) notFound();

  // datetime-local input 형식(YYYY-MM-DDTHH:mm)에 맞게 변환
  const defaultValues = {
    title: event.title,
    location: event.location,
    eventDate: event.eventDate.slice(0, 16),
    description: event.description ?? "",
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold">이벤트 수정</h1>
      <EventForm
        mode="edit"
        defaultValues={defaultValues}
        defaultImageUrl={event.coverImageUrl}
      />
    </div>
  );
}
