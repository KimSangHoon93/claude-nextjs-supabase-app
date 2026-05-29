"use client";

import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface InviteCopyButtonProps {
  inviteCode: string;
  compact?: boolean;
}

export default function InviteCopyButton({
  inviteCode,
  compact,
}: InviteCopyButtonProps) {
  const handleCopy = async () => {
    const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;
    await navigator.clipboard.writeText(inviteUrl);
    toast("초대 링크가 복사되었습니다");
  };

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="w-full"
      >
        <Share2 size={16} className="mr-1" />
        공유
      </Button>
    );
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleCopy}>
      <Copy size={16} className="mr-2" />
      초대 링크 복사
    </Button>
  );
}
