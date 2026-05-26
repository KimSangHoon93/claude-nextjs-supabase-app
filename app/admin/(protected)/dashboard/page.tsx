import {
  CalendarDays,
  CalendarRange,
  Users,
  TrendingUp,
  CalendarCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_ADMIN_STATS, MOCK_EVENTS } from "@/lib/mock-data";
import type { EventStatus } from "@/types/gather";

// 이벤트 상태 뱃지 — 기존 페이지 패턴 동일
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

export default function AdminDashboardPage() {
  const stats = MOCK_ADMIN_STATS;
  // 최근 이벤트 5개 (생성일 기준 최신순)
  const recentEvents = MOCK_EVENTS.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-sm text-muted-foreground">
          Gather 플랫폼 전체 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* KPI 섹션 1: 이벤트 지표 */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          이벤트
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* 오늘 이벤트 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">오늘</p>
                  <p className="mt-1 text-2xl font-bold">{stats.todayEvents}</p>
                </div>
                <CalendarDays size={20} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* 이번 주 이벤트 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">이번 주</p>
                  <p className="mt-1 text-2xl font-bold">{stats.weekEvents}</p>
                </div>
                <CalendarRange size={20} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* 이번 달 이벤트 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">이번 달</p>
                  <p className="mt-1 text-2xl font-bold">{stats.monthEvents}</p>
                </div>
                <CalendarCheck size={20} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* 전체 이벤트 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">전체</p>
                  <p className="mt-1 text-2xl font-bold">{stats.totalEvents}</p>
                </div>
                <TrendingUp size={20} className="text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* KPI 섹션 2: 사용자 지표 */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          사용자
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* 오늘 신규 사용자 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">오늘 신규</p>
                  <p className="mt-1 text-2xl font-bold">{stats.todayUsers}</p>
                </div>
                <UserPlus size={20} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* 이번 주 신규 사용자 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">이번 주 신규</p>
                  <p className="mt-1 text-2xl font-bold">{stats.weekUsers}</p>
                </div>
                <Users size={20} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* 전체 사용자 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">전체</p>
                  <p className="mt-1 text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <UsersRound size={20} className="text-violet-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 최근 이벤트 테이블 */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          최근 이벤트
        </h2>
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base">최근 등록된 이벤트</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이벤트명</TableHead>
                  <TableHead>날짜</TableHead>
                  <TableHead>장소</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {dateFormatter.format(new Date(event.eventDate))}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {event.location}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={event.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
