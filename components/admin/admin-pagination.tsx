import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPaginationProps {
  total: number;
  page: number;
  pageSize: number;
  basePath: string;
  currentParams?: Record<string, string | undefined>;
}

// URL 파라미터를 조합하여 페이지 링크 생성 (Server Component)
export function AdminPagination({
  total,
  page,
  pageSize,
  basePath,
  currentParams = {},
}: AdminPaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  // 1페이지 이하이면 페이지네이션 불필요
  if (totalPages <= 1) return null;

  function buildUrl(targetPage: number) {
    const params = new URLSearchParams();
    // 기존 파라미터 유지 (undefined 제외)
    for (const [key, value] of Object.entries(currentParams)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  }

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {/* 이전 페이지 */}
      {hasPrev ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildUrl(page - 1)}>
            <ChevronLeft size={16} />
            이전
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft size={16} />
          이전
        </Button>
      )}

      {/* 현재 페이지 / 전체 페이지 */}
      <span className="text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>

      {/* 다음 페이지 */}
      {hasNext ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildUrl(page + 1)}>
            다음
            <ChevronRight size={16} />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          다음
          <ChevronRight size={16} />
        </Button>
      )}
    </div>
  );
}
