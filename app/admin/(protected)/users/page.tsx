"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_USERS } from "@/lib/mock-data";
import type { UserRole } from "@/types/gather";

// 역할 뱃지 — admin: 보라색, user: 기본
function RoleBadge({ role }: { role: UserRole }) {
  if (role === "admin")
    return <Badge className="bg-violet-500 text-white">관리자</Badge>;
  return <Badge variant="secondary">일반</Badge>;
}

// 날짜 포매터
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

// 이름에서 아바타 폴백 이니셜 추출 (첫 글자)
function getInitial(name: string) {
  return name.charAt(0);
}

export default function AdminUsersPage() {
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState("");

  // 이름 또는 이메일 기반 필터링
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return MOCK_USERS;
    return MOCK_USERS.filter(
      (user) =>
        user.name.includes(searchQuery) || user.email.includes(searchQuery),
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">사용자 관리</h1>
        <p className="text-sm text-muted-foreground">
          가입된 사용자를 검색하고 관리하세요
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          {/* 검색 영역 */}
          <div className="flex items-center gap-3">
            <Input
              placeholder="이름 또는 이메일 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <span className="ml-auto text-sm text-muted-foreground">
              {filteredUsers.length}명
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    검색 결과가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    {/* 아바타 + 이름 */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatarUrl ?? undefined}
                            alt={user.name}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitial(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>

                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {dateFormatter.format(new Date(user.createdAt))}
                    </TableCell>

                    {/* TODO: Phase 3에서 삭제 로직 구현 */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="text-destructive"
                        aria-label="사용자 삭제"
                      >
                        <Trash2 size={14} className="mr-1" />
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
