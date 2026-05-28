import { EventCardSkeleton } from "@/components/gather/skeletons";

export default function EventsLoading() {
  return (
    <div className="space-y-3 p-4">
      <EventCardSkeleton />
      <EventCardSkeleton />
      <EventCardSkeleton />
    </div>
  );
}
