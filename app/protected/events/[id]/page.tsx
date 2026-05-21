import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin, Users, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ParticipantCard from "@/components/gather/participant-card";
import InviteCopyButton from "@/components/gather/invite-copy-button";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import {
  getMockEventById,
  getMockParticipantsByEventId,
} from "@/lib/mock-data";
import type { EventStatus, GatherUser } from "@/types/gather";

export const dynamic = "force-dynamic";

const MOCK_USER_ID = "user-1";

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
  const event = getMockEventById(id);

  if (!event) notFound();

  // 실제 로그인 사용자 프로필 조회
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  let realUser: GatherUser | null = null;
  if (authUser) {
    const { data: profile } = await getProfile(supabase, authUser.id);
    if (profile) {
      const seed = profile.username ?? profile.email ?? authUser.id;
      realUser = {
        id: MOCK_USER_ID,
        email: profile.email ?? "",
        name: profile.full_name ?? profile.username ?? "사용자",
        avatarUrl:
          profile.avatar_url ??
          `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`,
        role: "user",
        createdAt: profile.created_at ?? "",
      };
    }
  }

  const rawParticipants = getMockParticipantsByEventId(id);
  // 현재 사용자(user-1)의 user 데이터를 실제 프로필로 교체
  const participants = realUser
    ? rawParticipants.map((p) =>
        p.userId === MOCK_USER_ID ? { ...p, user: realUser } : p,
      )
    : rawParticipants;

  const isHost = participants.some(
    (p) => p.userId === MOCK_USER_ID && p.role === "host",
  );

  const gradient = pickGradient(event.id);

  return (
    <div>
      {/* 커버 이미지 (full-bleed) */}
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
            <span className="font-semibold">
              참여자 {participants.length}명
            </span>
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
    </div>
  );
}
