import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getMockEventByInviteCode,
  getMockParticipantsByEventId,
} from "@/lib/mock-data";
import type { EventStatus } from "@/types/gather";

// 더미 데이터 사용 중 — Phase 3에서 DB 연동으로 교체 예정
export const dynamic = "force-dynamic";

// 그라데이션 플레이스홀더 배열 — 커버 이미지 없을 때 사용
const PLACEHOLDER_GRADIENTS = [
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-orange-400 to-pink-500",
  "from-sky-400 to-blue-500",
  "from-rose-400 to-red-500",
  "from-amber-400 to-yellow-500",
  "from-cyan-400 to-emerald-500",
];

// 이벤트 ID 기반으로 그라데이션을 일관되게 선택
function pickGradient(id: string) {
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PLACEHOLDER_GRADIENTS[sum % PLACEHOLDER_GRADIENTS.length];
}

// 이벤트 상태 뱃지 컴포넌트
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

// 날짜 포매터 — 한국어 시간대 기준
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
  // Next.js 15: params는 반드시 await 해야 함
  const { invite_code } = await params;

  // 초대 코드로 이벤트 조회 — 없으면 404
  const event = getMockEventByInviteCode(invite_code);
  if (!event) notFound();

  // 참여자 목록 조회
  const participants = getMockParticipantsByEventId(event.id);
  const gradient = pickGradient(event.id);

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
            <h1 className="text-xl font-bold leading-tight">{event.title}</h1>
            <StatusBadge status={event.status} />
          </div>

          {/* 날짜, 장소, 설명 */}
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

      {/* 하단 CTA 영역 — 참여 버튼 */}
      <div className="border-t px-4 py-4">
        {/* Phase 3에서 실제 참여 로직으로 교체 예정 */}
        <Button
          size="lg"
          className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
        >
          참여하기
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          로그인 후 참여할 수 있어요
        </p>
      </div>
    </div>
  );
}
