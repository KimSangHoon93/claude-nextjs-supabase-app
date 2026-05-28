import { Skeleton } from "@/components/ui/skeleton";

export default function NewEventLoading() {
  return (
    <div className="space-y-5 p-4">
      {/* 커버 이미지 업로드 영역 */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>

      {/* 제목 필드 */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* 장소 필드 */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* 날짜 필드 */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* 설명 필드 */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>

      {/* 제출 버튼 */}
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
