import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GatherParticipant, ParticipantRole } from "@/types/gather";

// 역할에 따른 배지 렌더링
function RoleBadge({ role }: { role: ParticipantRole }) {
  if (role === "host") {
    return <Badge className="bg-emerald-500 text-xs text-white">주최자</Badge>;
  }
  return (
    <Badge variant="secondary" className="text-xs">
      참여자
    </Badge>
  );
}

interface ParticipantCardProps {
  participant: GatherParticipant;
}

export default function ParticipantCard({ participant }: ParticipantCardProps) {
  // user가 undefined인 경우 폴백 처리
  const name = participant.user?.name ?? "알 수 없음";
  const avatarSrc = participant.user?.avatarUrl ?? undefined;
  const fallbackChar = participant.user?.name?.[0] ?? "?";

  return (
    <div className="flex min-h-[48px] items-center gap-3 py-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>{fallbackChar}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{name}</p>
      </div>

      <RoleBadge role={participant.role} />
    </div>
  );
}
