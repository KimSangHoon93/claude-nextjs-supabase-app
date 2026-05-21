import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin, Users, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ParticipantCard from "@/components/gather/participant-card";
import InviteCopyButton from "@/components/gather/invite-copy-button";
import {
  getMockEventById,
  getMockParticipantsByEventId,
} from "@/lib/mock-data";
import type { EventStatus } from "@/types/gather";

// Phase 3에서 실제 인증으로 교체 예정
const MOCK_USER_ID = "user-1";

// 이벤트 상태 배지 (인라인 재구현)
function StatusBadge({ status }: { status: EventStatus }) {
  if (status === "upcoming") return <Badge variant="secondary">예정</Badge>;
  if (status === "ongoing")
    return <Badge className="bg-emerald-500 text-white">진행중</Badge>;
  return (
    <Badge variant="outline" className="text-muted-foreground">
      종료
    </Badge>
  );
}

// 날짜 포맷터
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
});

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  const event = getMockEventById(id);

  if (!event) notFound();

  const participants = getMockParticipantsByEventId(id);
  // 현재 사용자가 주최자인지 확인
  const isHost = participants.some(
    (p) => p.userId === MOCK_USER_ID && p.role === "host",
  );

  return (
    <div className="space-y-6 p-4">
      {/* 섹션1: 이벤트 정보 */}
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold leading-tight">{event.title}</h1>
          <StatusBadge status={event.status} />
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            <span>{dateFormatter.format(new Date(event.eventDate))}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          {event.description && (
            <p className="pt-1 leading-relaxed text-foreground/80">
              {event.description}
            </p>
          )}
        </div>
      </section>

      <Separator />

      {/* 섹션2: 참여자 목록 */}
      <section className="space-y-1">
        <div className="mb-2 flex items-center gap-2">
          <Users size={16} className="text-muted-foreground" />
          <span className="font-semibold">참여자 {participants.length}명</span>
        </div>
        {participants.map((participant) => (
          <ParticipantCard key={participant.id} participant={participant} />
        ))}
      </section>

      {/* 섹션3: 주최자 전용 액션 */}
      {isHost && (
        <>
          <Separator />
          <section className="space-y-2">
            <InviteCopyButton inviteCode={event.inviteCode} />
            <Button asChild variant="outline" className="w-full">
              <Link href={`/protected/events/${event.id}/edit`}>
                <Pencil size={16} className="mr-2" />
                이벤트 수정
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive"
            >
              <Trash2 size={16} className="mr-2" />
              이벤트 삭제
            </Button>
          </section>
        </>
      )}
    </div>
  );
}
