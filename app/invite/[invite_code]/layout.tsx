import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 전체 화면 배경 — 모바일 프레임 외부 영역
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      {/* 모바일 컨테이너: 최대 430px */}
      <div className="relative flex w-full max-w-[430px] flex-col bg-background shadow-sm">
        {/* 상단 헤더 */}
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4">
          {/* 뒤로가기 버튼 — 홈으로 이동 */}
          <Link
            href="/"
            className="mr-2 flex items-center text-muted-foreground hover:text-foreground"
            aria-label="홈으로 돌아가기"
          >
            <ChevronLeft size={20} />
          </Link>

          {/* Gather 로고 */}
          <Link href="/" className="text-lg font-bold">
            Gather
          </Link>
        </header>

        {/* 메인 컨텐츠 — 하단 네비게이션 없으므로 pb 최소화 */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
