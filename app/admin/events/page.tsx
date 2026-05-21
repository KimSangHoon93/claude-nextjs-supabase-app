"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_EVENTS } from "@/lib/mock-data";
import type { EventStatus } from "@/types/gather";

// 이벤트 상태 뱃지
function StatusBadge({ status }: { status: EventStatus }) {
  if (status === "upcoming") return <Badge variant="secondary">예정</Badge>;
  if (status === "ongoing")
    return <Badge className="bg-emerald-500 text-white">진행중</Badge>;
  return (
    <Badge variant="outline" className="text-muted-foreground">
      종료
    </Badge>
  );
}

// 날짜 포매터
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

export default function AdminEventsPage() {
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState("");
  // 상태 필터 상태 ('all' | EventStatus)
  const [statusFilter, setStatusFilter] = useState<"all" | EventStatus>("all");

  // 검색어 + 상태 필터 조합 — 클라이언트 사이드 필터링
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        event.title.includes(searchQuery) ||
        event.location.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">이벤트 관리</h1>
        <p className="text-sm text-muted-foreground">
          전체 이벤트를 검색하고 관리하세요
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          {/* 검색 및 필터 영역 */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="이벤트명 또는 장소 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "all" | EventStatus)}
            >
              <SelectTrigger className="sm:w-36">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="upcoming">예정</SelectItem>
                <SelectItem value="ongoing">진행중</SelectItem>
                <SelectItem value="ended">종료</SelectItem>
              </SelectContent>
            </Select>
            {/* 필터 결과 수 표시 */}
            <CardTitle className="flex items-center text-sm font-normal text-muted-foreground sm:ml-auto">
              {filteredEvents.length}개 이벤트
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이벤트명</TableHead>
                <TableHead>날짜</TableHead>
                <TableHead>장소</TableHead>
                <TableHead className="text-center">참여자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    검색 결과가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {dateFormatter.format(new Date(event.eventDate))}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">
                      {event.location}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {event.participantCount}명
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={event.status} />
                    </TableCell>
                    {/* TODO: Phase 3에서 수정/삭제 로직 구현 */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          aria-label="이벤트 수정"
                        >
                          <Pencil size={14} className="mr-1" />
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="text-destructive"
                          aria-label="이벤트 삭제"
                        >
                          <Trash2 size={14} className="mr-1" />
                          삭제
                        </Button>
                      </div>
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
