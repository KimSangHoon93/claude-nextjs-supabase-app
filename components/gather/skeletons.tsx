import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// EventCard 로딩 스켈레톤
export function EventCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        {/* 제목 + 배지 행 */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        {/* 날짜 행 */}
        <Skeleton className="h-4 w-1/2" />
        {/* 장소 행 */}
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

// ParticipantCard 로딩 스켈레톤
export function ParticipantCardSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      {/* 아바타 */}
      <Skeleton className="h-10 w-10 rounded-full" />
      {/* 이름 */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
      </div>
      {/* 역할 배지 */}
      <Skeleton className="h-5 w-12" />
    </div>
  );
}
