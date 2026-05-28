import Link from "next/link";
import { CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <CalendarOff size={48} className="text-muted-foreground" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">이벤트를 찾을 수 없습니다</h2>
        <p className="text-sm text-muted-foreground">
          이미 삭제되었거나 존재하지 않는 이벤트입니다.
        </p>
      </div>
      <Button asChild>
        <Link href="/protected/events">이벤트 목록으로</Link>
      </Button>
    </div>
  );
}
