import { CalendarDays, Users } from "lucide-react";
import EventCard from "@/components/gather/event-card";
import EmptyState from "@/components/gather/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GatherEvent } from "@/types/gather";

interface EventsContentProps {
  hostedEvents: GatherEvent[];
  joinedEvents: GatherEvent[];
}

export default function EventsContent({
  hostedEvents,
  joinedEvents,
}: EventsContentProps) {
  return (
    <div className="p-4">
      <Tabs defaultValue="hosted">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="hosted" className="flex-1">
            주최한 이벤트 {hostedEvents.length}개
          </TabsTrigger>
          <TabsTrigger value="joined" className="flex-1">
            참여한 이벤트 {joinedEvents.length}개
          </TabsTrigger>
        </TabsList>

        {/* 주최한 이벤트 탭 */}
        <TabsContent value="hosted" className="space-y-3">
          {hostedEvents.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="주최한 이벤트가 없어요"
              description="이벤트를 만들어 친구들을 초대해보세요"
              action={{ label: "이벤트 만들기", href: "/protected/events/new" }}
            />
          ) : (
            hostedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                href={`/protected/events/${event.id}`}
              />
            ))
          )}
        </TabsContent>

        {/* 참여한 이벤트 탭 */}
        <TabsContent value="joined" className="space-y-3">
          {joinedEvents.length === 0 ? (
            <EmptyState
              icon={Users}
              title="참여한 이벤트가 없어요"
              description="초대 링크로 이벤트에 참여해보세요"
            />
          ) : (
            joinedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                href={`/protected/events/${event.id}`}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
