import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-center">
      <div className="space-y-2">
        <p className="text-8xl font-bold text-emerald-500">404</p>
        <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
      <p className="text-sm font-bold text-emerald-500">Gather</p>
    </div>
  );
}
