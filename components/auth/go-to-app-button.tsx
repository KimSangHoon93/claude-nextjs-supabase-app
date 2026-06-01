"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function GoToAppButton() {
  const router = useRouter();

  const handleClick = () => {
    // 히스토리에서 이 페이지를 제거하여 뒤로가기 불가
    router.replace("/protected/events");
  };

  return (
    <Button onClick={handleClick} className="w-full">
      인증 완료 후 시작하기
    </Button>
  );
}
