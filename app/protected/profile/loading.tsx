import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-6 p-4">
      {/* 아바타 + 이름 */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* 정보 카드 */}
      <div className="space-y-3 rounded-xl border p-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-40" />
      </div>

      {/* 버튼 */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
