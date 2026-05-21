"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface InviteCopyButtonProps {
  inviteCode: string;
}

// 초대 링크를 클립보드에 복사하는 클라이언트 컴포넌트
export default function InviteCopyButton({
  inviteCode,
}: InviteCopyButtonProps) {
  const handleCopy = async () => {
    const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;
    await navigator.clipboard.writeText(inviteUrl);
    toast("초대 링크가 복사되었습니다");
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleCopy}>
      <Copy size={16} className="mr-2" />
      초대 링크 복사
    </Button>
  );
}
