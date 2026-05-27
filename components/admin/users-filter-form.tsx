"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface UsersFilterFormProps {
  defaultSearch?: string;
  total: number;
}

export function UsersFilterForm({
  defaultSearch = "",
  total,
}: UsersFilterFormProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(defaultSearch);

  function pushUrl(search: string) {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    params.set("page", "1"); // 검색 변경 시 첫 페이지로
    router.push(`/admin/users?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    pushUrl(searchValue);
  }

  return (
    <div className="flex items-center gap-3">
      {/* 검색 폼 — Enter 키로 제출 */}
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="이름 또는 이메일 검색..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-xs"
        />
      </form>

      {/* 결과 개수 */}
      <span className="ml-auto text-sm text-muted-foreground">{total}명</span>
    </div>
  );
}
