"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProtectedError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertCircle size={48} className="text-destructive" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">오류가 발생했습니다</h2>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>다시 시도</Button>
        <Button variant="outline" asChild>
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </div>
  );
}
