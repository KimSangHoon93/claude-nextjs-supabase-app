import Link from "next/link";
import { CalendarDays, MapPin, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { EventStatus, GatherEvent } from "@/types/gather";

interface EventCardLinkProps {
  event: GatherEvent;
  href: string;
}

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

const PLACEHOLDER_GRADIENTS = [
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-orange-400 to-pink-500",
  "from-sky-400 to-blue-500",
  "from-rose-400 to-red-500",
  "from-amber-400 to-yellow-500",
  "from-cyan-400 to-emerald-500",
];

function pickGradient(id: string) {
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PLACEHOLDER_GRADIENTS[sum % PLACEHOLDER_GRADIENTS.length];
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Seoul",
  hour12: false,
});

export default function EventCard({ event, href }: EventCardLinkProps) {
  const formattedDate = dateFormatter.format(new Date(event.eventDate));
  const gradient = pickGradient(event.id);

  return (
    <Link href={href} className="block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="flex">
          {/* 좌측 커버 이미지 */}
          <div className="w-28 flex-shrink-0">
            {event.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.coverImageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
              >
                <span className="text-3xl">🎉</span>
              </div>
            )}
          </div>

          {/* 우측 정보 */}
          <div className="flex flex-1 flex-col justify-center gap-1.5 p-3">
            {/* 제목 + 상태 배지 */}
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold">{event.title}</p>
              <StatusBadge status={event.status} />
            </div>

            {/* 날짜 */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays size={13} />
              <span>{formattedDate}</span>
            </div>

            {/* 장소 */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={13} />
              <span className="truncate">{event.location}</span>
            </div>

            {/* 주최자 + 참여자 수 */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User size={13} />
                <span className="truncate">
                  {event.hostName ?? "알 수 없음"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={13} />
                <span>{event.participantCount}명</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
