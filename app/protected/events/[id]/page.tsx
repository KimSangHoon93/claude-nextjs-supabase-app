import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import InviteCopyButton from "@/components/gather/invite-copy-button";
import DeleteEventButton from "@/components/gather/delete-event-button";
import RealtimeParticipants from "@/components/gather/realtime-participants";
import { createClient } from "@/lib/supabase/server";
import { getEventById } from "@/lib/supabase/events";
import { getParticipantsByEventId } from "@/lib/supabase/participants";
import { deleteEventAction, leaveEventAction } from "./actions";
import type { EventStatus } from "@/types/gather";

export const dynamic = "force-dynamic";

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

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Seoul",
  hour12: false,
});

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [event, participants] = await Promise.all([
    getEventById(supabase, id),
    getParticipantsByEventId(supabase, id),
  ]);

  if (!event) notFound();

  const currentUserId = user?.id ?? "";
  const isHost = participants.some(
    (p) => p.userId === currentUserId && p.role === "host",
  );
  const isParticipant = participants.some(
    (p) => p.userId === currentUserId && p.role === "participant",
  );

  const gradient = pickGradient(event.id);
  const boundDeleteAction = deleteEventAction.bind(null, event.id);
  const boundLeaveAction = leaveEventAction.bind(null, event.id);

  return (
    <div>
      {/* 커버 이미지 */}
      {event.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.coverImageUrl}
          alt={event.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div
          className={`flex h-48 w-full items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          <span className="text-6xl">🎉</span>
        </div>
      )}

      <div className="space-y-6 p-4">
        {/* 섹션1: 이벤트 정보 */}
        <section className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl leading-tight font-bold">{event.title}</h1>
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
            <span className="font-semibold">
              참여자 {participants.length}명
            </span>
          </div>
          <RealtimeParticipants
            eventId={event.id}
            initialParticipants={participants}
          />
        </section>

        {/* 섹션3: 역할별 액션 */}
        {isHost ? (
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
              <DeleteEventButton deleteAction={boundDeleteAction} />
            </section>
          </>
        ) : isParticipant ? (
          <>
            <Separator />
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle2 size={16} />
                <span>참여 중인 이벤트입니다</span>
              </div>
              <form action={boundLeaveAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-destructive"
                >
                  <LogOut size={16} className="mr-2" />
                  참여 취소
                </Button>
              </form>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
