import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { getAdminUsers } from "@/lib/supabase/admin";
import { UsersFilterForm } from "@/components/admin/users-filter-form";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { AdminPagination } from "@/components/admin/admin-pagination";
import type { UserRole } from "@/types/gather";

const PAGE_SIZE = 20;

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

// 이름 첫 글자 이니셜 추출 (빈 문자열 보호)
function getInitial(name: string) {
  return name.charAt(0) || "?";
}

interface SearchParams {
  search?: string;
  page?: string;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  // NaN 방지: parseInt 후 유효성 검사
  const parsedPage = parseInt(params.page ?? "1", 10);
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const supabase = await createClient();
  const { users, total } = await getAdminUsers(supabase, {
    search,
    page,
    pageSize: PAGE_SIZE,
  });

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
          {/* 검색 — Client Component */}
          <UsersFilterForm defaultSearch={search} total={total} />
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
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    검색 결과가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
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

                    {/* 삭제 — Client Component */}
                    <TableCell className="text-right">
                      <DeleteUserButton userId={user.id} userName={user.name} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          <AdminPagination
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            basePath="/admin/users"
            currentParams={{
              search: search || undefined,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
