import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getAdminEvents } from "@/lib/supabase/admin";
import { EventsFilterForm } from "@/components/admin/events-filter-form";
import { DeleteEventButton } from "@/components/admin/delete-event-button";
import { AdminPagination } from "@/components/admin/admin-pagination";
import type { EventStatus } from "@/types/gather";

const PAGE_SIZE = 20;

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

interface SearchParams {
  search?: string;
  status?: string;
  page?: string;
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const status =
    (params.status as "all" | "upcoming" | "ongoing" | "ended") ?? "all";
  // NaN 방지: parseInt 후 유효성 검사
  const parsedPage = parseInt(params.page ?? "1", 10);
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const supabase = await createClient();
  const { events, total } = await getAdminEvents(supabase, {
    search,
    status,
    page,
    pageSize: PAGE_SIZE,
  });

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
          {/* 검색 및 필터 — Client Component */}
          <EventsFilterForm
            defaultSearch={search}
            defaultStatus={status}
            total={total}
          />
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
              {events.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    검색 결과가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {/* 수정은 이번 Task 범위 외 */}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          aria-label="이벤트 수정"
                        >
                          <Pencil size={14} className="mr-1" />
                          수정
                        </Button>
                        {/* 삭제 — Client Component */}
                        <DeleteEventButton
                          eventId={event.id}
                          eventTitle={event.title}
                        />
                      </div>
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
            basePath="/admin/events"
            currentParams={{
              search: search || undefined,
              status: status !== "all" ? status : undefined,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
