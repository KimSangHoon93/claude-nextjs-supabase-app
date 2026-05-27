"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface EventsFilterFormProps {
  defaultSearch?: string;
  defaultStatus?: string;
  total: number;
}

export function EventsFilterForm({
  defaultSearch = "",
  defaultStatus = "all",
  total,
}: EventsFilterFormProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(defaultSearch);
  const [statusValue, setStatusValue] = useState(defaultStatus);

  // URL 파라미터를 업데이트하여 서버에서 재조회
  function pushUrl(search: string, status: string) {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status && status !== "all") params.set("status", status);
    params.set("page", "1"); // 필터 변경 시 항상 첫 페이지로
    router.push(`/admin/events?${params.toString()}`);
  }

  function handleStatusChange(value: string) {
    setStatusValue(value);
    pushUrl(searchValue, value);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    pushUrl(searchValue, statusValue);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* 검색 폼 — Enter 키로 제출 */}
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="이벤트명 또는 장소 검색..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="sm:max-w-xs"
        />
      </form>

      {/* 상태 필터 — 선택 즉시 반영 */}
      <Select value={statusValue} onValueChange={handleStatusChange}>
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

      {/* 결과 개수 */}
      <span className="text-sm text-muted-foreground sm:ml-auto">
        {total}개 이벤트
      </span>
    </div>
  );
}
