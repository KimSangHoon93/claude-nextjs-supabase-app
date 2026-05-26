"use client";

import { CalendarDays, Link2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const FEATURES = [
  {
    icon: CalendarDays,
    title: "간편한 이벤트 생성",
    description: "제목, 날짜, 장소만 입력하면 즉시 이벤트 생성",
  },
  {
    icon: Link2,
    title: "원클릭 초대 시스템",
    description: "자동 생성된 초대 링크를 카카오톡으로 간편 공유",
  },
  {
    icon: Users,
    title: "실시간 참여자 관리",
    description: "참여자 목록 자동 업데이트로 현황 파악",
  },
];

export default function HomeLanding() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setIsLoading(false);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      {/* 히어로 섹션 */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-bold text-[#5B6EF5]">Gather</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          초대 링크 하나로 모든 것을 해결하는
          <br />
          일회성 이벤트 관리 플랫폼
        </p>
      </div>

      {/* 기능 카드 목록 */}
      <div className="mb-8 w-full space-y-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col items-center gap-1.5 rounded-xl border bg-card px-5 py-5 text-center shadow-sm"
          >
            <Icon size={28} className="mb-1 text-[#5B6EF5]" strokeWidth={1.6} />
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      {/* CTA 버튼 */}
      <Button
        className="mb-4 w-full bg-[#5B6EF5] py-6 text-base font-semibold hover:bg-[#4a5de4]"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        {isLoading ? "잠시 기다려주세요..." : "Google로 시작하기"}
      </Button>

      {/* 하단 설명 */}
      <p className="text-center text-xs text-muted-foreground">
        5-30명 규모의 소규모 이벤트에 최적화된 플랫폼
      </p>
    </div>
  );
}
