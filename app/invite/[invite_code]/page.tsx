import { notFound, redirect } from "next/navigation";
import { CalendarDays, MapPin, Users, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEventByInviteCode } from "@/lib/supabase/events";
import {
  getParticipantsByEventId,
  isParticipant,
} from "@/lib/supabase/participants";
import { joinEventAction } from "./actions";
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

interface InvitePageProps {
  params: Promise<{ invite_code: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { invite_code } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/invite/${invite_code}`);
  }

  const event = await getEventByInviteCode(supabase, invite_code);
  if (!event) notFound();

  const [participants, alreadyJoined] = await Promise.all([
    getParticipantsByEventId(supabase, event.id),
    isParticipant(supabase, event.id, user.id),
  ]);

  const gradient = pickGradient(event.id);
  const boundJoinAction = joinEventAction.bind(null, invite_code);

  return (
    <div>
      {/* 커버 이미지 또는 그라데이션 플레이스홀더 */}
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
        {/* 이벤트 제목 및 상태 */}
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

        {/* 참여자 수 표시 */}
        <section>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={16} />
            <span className="font-medium">{participants.length}명 참여 중</span>
          </div>
        </section>
      </div>

      {/* 하단 CTA 영역 */}
      <div className="border-t px-4 py-4">
        {alreadyJoined ? (
          // 이미 참여 중인 경우
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 size={16} />
              <span>이미 참여 중인 이벤트예요</span>
            </div>
            <Link href={`/protected/events/${event.id}`} className="block">
              <Button size="lg" variant="outline" className="w-full">
                이벤트 보기
              </Button>
            </Link>
          </div>
        ) : (
          // 로그인 사용자 — 참여하기
          <form action={boundJoinAction}>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
            >
              참여하기
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
