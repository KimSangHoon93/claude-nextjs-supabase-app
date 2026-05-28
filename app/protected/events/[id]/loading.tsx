import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <div>
      {/* 커버 이미지 스켈레톤 */}
      <Skeleton className="h-48 w-full rounded-none" />

      <div className="space-y-4 p-4">
        {/* 제목 + 배지 */}
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* 액션 버튼 3열 */}
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* 이벤트 정보 카드 */}
        <div className="space-y-3 rounded-xl border p-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* 참여자 목록 카드 */}
        <div className="space-y-3 rounded-xl border p-4">
          <Skeleton className="h-5 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
