import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 관리자 전용 로그인 페이지 — 실제 인증 로직은 Phase 3 Task 008에서 구현 예정
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          {/* 관리자 아이콘 */}
          <div className="mb-2 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield size={24} className="text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">관리자 로그인</CardTitle>
          <CardDescription>
            Gather 관리자 패널에 접속하려면 로그인하세요
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 로그인 폼 — TODO: Phase 3 Task 008에서 실제 인증 연동 */}
          <form className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
              />
            </div>

            {/* 로그인 버튼 */}
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
