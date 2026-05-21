import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EventStatus, GatherEvent } from "@/types/gather";

interface EventCardLinkProps {
  event: GatherEvent;
  href: string;
}

// 이벤트 상태에 따른 배지 렌더링
function StatusBadge({ status }: { status: EventStatus }) {
  if (status === "upcoming") {
    return <Badge variant="secondary">예정</Badge>;
  }
  if (status === "ongoing") {
    return <Badge className="bg-emerald-500 text-white">진행중</Badge>;
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      종료
    </Badge>
  );
}

// 이벤트 날짜를 한국어 형식으로 포맷
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default function EventCard({ event, href }: EventCardLinkProps) {
  const formattedDate = dateFormatter.format(new Date(event.eventDate));

  return (
    <Link href={href} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          {/* 제목 + 상태 배지 */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="truncate font-semibold">{event.title}</p>
            <StatusBadge status={event.status} />
          </div>

          {/* 날짜 */}
          <div className="mb-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays size={16} />
            <span>{formattedDate}</span>
          </div>

          {/* 장소 */}
          <div className="mb-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span className="truncate">{event.location}</span>
          </div>

          {/* 참여자 수 */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users size={16} />
            <span>{event.participantCount}명</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
