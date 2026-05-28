import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
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

// 페이지 props 타입 — generateMetadata와 페이지 컴포넌트 모두에서 사용
interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

// 보호된 이벤트 상세 페이지 — 검색엔진 인덱싱 차단
export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const event = await getEventById(supabase, id);

  return {
    title: event ? event.title : "이벤트",
    description: event?.description ?? undefined,
    robots: { index: false, follow: false },
  };
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
        <div className="relative h-48 w-full">
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ) : (
        <div
          className={`flex h-48 w-full items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          <span className="text-6xl">🎉</span>
        </div>
      )}

      <div className="space-y-4 p-4">
        {/* 제목 + 배지 + 설명 */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl leading-tight font-bold">{event.title}</h1>
            <StatusBadge status={event.status} />
          </div>
          {event.description && (
            <p className="text-sm text-muted-foreground">{event.description}</p>
          )}
        </div>

        {/* 호스트 액션 버튼 3열 */}
        {isHost && (
          <div className="grid grid-cols-3 gap-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/protected/events/${event.id}/edit`}>
                <Pencil size={15} className="mr-1" />
                수정
              </Link>
            </Button>
            <InviteCopyButton inviteCode={event.inviteCode} compact />
            <DeleteEventButton deleteAction={boundDeleteAction} compact />
          </div>
        )}

        {/* 이벤트 정보 카드 */}
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center gap-3 px-4 py-3">
            <CalendarDays
              size={16}
              className="shrink-0 text-muted-foreground"
            />
            <div>
              <p className="text-xs text-muted-foreground">날짜 및 시간</p>
              <p className="text-sm font-medium">
                {dateFormatter.format(new Date(event.eventDate))}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3 px-4 py-3">
            <MapPin size={16} className="shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">장소</p>
              <p className="text-sm font-medium">{event.location}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3 px-4 py-3">
            <Users size={16} className="shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">참여자</p>
              <p className="text-sm font-medium">
                {participants.length}명 참여
              </p>
            </div>
          </div>
        </div>

        {/* 초대 코드 카드 (호스트만) */}
        {isHost && (
          <div className="space-y-1 rounded-xl border bg-card px-4 py-3">
            <p className="text-sm text-muted-foreground">초대 코드</p>
            <p className="font-mono text-lg font-bold tracking-wider">
              {event.inviteCode}
            </p>
            <p className="text-xs text-muted-foreground">
              이 코드로 다른 사람을 초대할 수 있어요
            </p>
          </div>
        )}

        {/* 참여자 목록 카드 */}
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="px-4 pt-4 pb-1">
            <h2 className="font-semibold">참여자 목록</h2>
          </div>
          <div className="divide-y px-4 pb-2">
            <RealtimeParticipants
              eventId={event.id}
              initialParticipants={participants}
            />
          </div>
        </div>

        {/* 참여자 이탈 액션 */}
        {isParticipant && (
          <div className="space-y-2">
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
          </div>
        )}
      </div>
    </div>
  );
}
