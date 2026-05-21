import EventForm from "@/components/gather/event-form";

export default function EventNewPage() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold">새 이벤트 만들기</h1>
      <EventForm mode="create" />
    </div>
  );
}
