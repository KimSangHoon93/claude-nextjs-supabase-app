import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type {
  AdminStats,
  GatherEvent,
  GatherUser,
  UserRole,
} from "@/types/gather";
import { toGatherEvent } from "@/lib/supabase/events";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

// profiles Row → GatherUser 변환 헬퍼
function toGatherUser(row: ProfileRow): GatherUser {
  return {
    id: row.id,
    email: row.email ?? "",
    name: row.full_name ?? row.username ?? "사용자",
    avatarUrl: row.avatar_url ?? null,
    role: (row.role as UserRole) ?? "user",
    createdAt: row.created_at,
  };
}

// 오늘 UTC midnight 기준 날짜 경계 반환
function getUtcDateBounds() {
  const now = new Date();

  // UTC 기준 오늘 자정
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const tomorrowStart = new Date(todayStart.getTime() + 86400 * 1000);

  // UTC 기준 이번 주 월요일 자정 (ISO 주: 월요일 시작)
  const dayOfWeek = now.getUTCDay(); // 0=일, 1=월 ... 6=토
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysToMonday,
    ),
  );

  // UTC 기준 이번 달 1일 자정
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );

  // 상한선: 다음 주 월요일, 다음 달 1일
  const nextWeekStart = new Date(weekStart.getTime() + 7 * 86400 * 1000);
  const nextMonthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  );

  return {
    todayStart,
    tomorrowStart,
    weekStart,
    nextWeekStart,
    monthStart,
    nextMonthStart,
  };
}

// 관리자 대시보드 통계 집계
export async function getAdminStats(
  supabase: SupabaseClient<Database>,
): Promise<AdminStats> {
  const {
    todayStart,
    tomorrowStart,
    weekStart,
    nextWeekStart,
    monthStart,
    nextMonthStart,
  } = getUtcDateBounds();

  // 이벤트 통계 (event_date 기준, 상한/하한 모두 적용)
  const [
    { count: todayEvents },
    { count: weekEvents },
    { count: monthEvents },
    { count: totalEvents },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("event_date", todayStart.toISOString())
      .lt("event_date", tomorrowStart.toISOString()),

    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("event_date", weekStart.toISOString())
      .lt("event_date", nextWeekStart.toISOString()),

    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("event_date", monthStart.toISOString())
      .lt("event_date", nextMonthStart.toISOString()),

    supabase.from("events").select("*", { count: "exact", head: true }),
  ]);

  // 사용자 통계 (created_at 기준)
  const [{ count: todayUsers }, { count: weekUsers }, { count: totalUsers }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString()),

      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekStart.toISOString()),

      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);

  return {
    todayEvents: todayEvents ?? 0,
    weekEvents: weekEvents ?? 0,
    monthEvents: monthEvents ?? 0,
    totalEvents: totalEvents ?? 0,
    todayUsers: todayUsers ?? 0,
    weekUsers: weekUsers ?? 0,
    totalUsers: totalUsers ?? 0,
  };
}

// 이벤트 관리 목록 (페이지네이션 + 검색 + 상태 필터)
export async function getAdminEvents(
  supabase: SupabaseClient<Database>,
  {
    search,
    status,
    page = 1,
    pageSize = 20,
  }: {
    search?: string;
    status?: "all" | "upcoming" | "ongoing" | "ended";
    page?: number;
    pageSize?: number;
  },
): Promise<{ events: GatherEvent[]; total: number }> {
  const offset = (page - 1) * pageSize;

  // EventStatus ±2h 경계 (calculateEventStatus와 동일 로직)
  const now = new Date();
  const twoHours = 2 * 60 * 60 * 1000;
  const ongoingStart = new Date(now.getTime() - twoHours).toISOString();
  const ongoingEnd = new Date(now.getTime() + twoHours).toISOString();

  let query = supabase
    .from("events_with_count")
    .select("*", { count: "exact" });

  // 검색어 필터 (이벤트명 또는 장소) — 특수문자 이스케이프로 쿼리 오동작 방지
  if (search && search.trim()) {
    const safeSearch = search
      .trim()
      .replace(/[,()%_]/g, (c) => (c === "%" ? "\\%" : c === "_" ? "\\_" : ""));
    if (safeSearch) {
      query = query.or(
        `title.ilike.%${safeSearch}%,location.ilike.%${safeSearch}%`,
      );
    }
  }

  // 상태 필터 (event_date 범위로 DB 레벨 처리)
  if (status && status !== "all") {
    if (status === "upcoming") {
      query = query.gt("event_date", ongoingEnd);
    } else if (status === "ongoing") {
      query = query
        .gte("event_date", ongoingStart)
        .lte("event_date", ongoingEnd);
    } else if (status === "ended") {
      query = query.lt("event_date", ongoingStart);
    }
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error("[getAdminEvents] DB 오류:", error.message);
    return { events: [], total: 0 };
  }

  return {
    events: (data ?? []).map(toGatherEvent),
    total: count ?? 0,
  };
}

// 사용자 관리 목록 (페이지네이션 + 검색)
export async function getAdminUsers(
  supabase: SupabaseClient<Database>,
  {
    search,
    page = 1,
    pageSize = 20,
  }: {
    search?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<{ users: GatherUser[]; total: number }> {
  const offset = (page - 1) * pageSize;

  let query = supabase.from("profiles").select("*", { count: "exact" });

  // 검색어 필터 (이름 또는 이메일) — 특수문자 이스케이프
  if (search && search.trim()) {
    const safeSearch = search
      .trim()
      .replace(/[,()%_]/g, (c) => (c === "%" ? "\\%" : c === "_" ? "\\_" : ""));
    if (safeSearch) {
      query = query.or(
        `full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%`,
      );
    }
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error("[getAdminUsers] DB 오류:", error.message);
    return { users: [], total: 0 };
  }

  return {
    users: (data ?? []).map(toGatherUser),
    total: count ?? 0,
  };
}

// 최근 이벤트 N개 (대시보드 테이블용)
export async function getRecentEvents(
  supabase: SupabaseClient<Database>,
  limit: number,
): Promise<GatherEvent[]> {
  const { data } = await supabase
    .from("events_with_count")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(toGatherEvent);
}

// 월별 이벤트 통계 (최근 12개월, event_date 기준)
export async function getMonthlyEventStats(
  supabase: SupabaseClient<Database>,
): Promise<{ month: string; count: number }[]> {
  // 12개월 전 첫째 날 계산
  const now = new Date();
  const twelveMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 11,
    1,
    0,
    0,
    0,
    0,
  );

  const { data } = await supabase
    .from("events")
    .select("event_date")
    .gte("event_date", twelveMonthsAgo.toISOString());

  // 최근 12개월 버킷 초기화 (오래된 순)
  const result: { month: string; count: number }[] = [];
  const monthKeys: string[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ month: `${d.getMonth() + 1}월`, count: 0 });
    // "YYYY-M" 형식 키로 중복 없이 식별
    monthKeys.push(`${d.getFullYear()}-${d.getMonth()}`);
  }

  // 이벤트를 해당 월 버킷에 배분
  for (const event of data ?? []) {
    const d = new Date(event.event_date!);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const idx = monthKeys.indexOf(key);
    if (idx !== -1) {
      result[idx].count++;
    }
  }

  return result;
}

// 주별 신규 사용자 통계 (최근 8주, created_at 기준)
export async function getWeeklyUserStats(
  supabase: SupabaseClient<Database>,
): Promise<{ week: string; count: number }[]> {
  // 8주 전(56일) 기준
  const now = new Date();
  const eightWeeksAgo = new Date(now.getTime() - 56 * 24 * 60 * 60 * 1000);

  const { data } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", eightWeeksAgo.toISOString());

  // 8개 주 버킷 초기화 (1주=가장 오래된, 8주=현재)
  const result: { week: string; count: number }[] = Array.from(
    { length: 8 },
    (_, i) => ({ week: `${i + 1}주`, count: 0 }),
  );

  // 각 사용자를 몇 주 전에 가입했는지 계산하여 버킷 배분
  for (const profile of data ?? []) {
    const createdAt = new Date(profile.created_at);
    const weeksAgo = Math.floor(
      (now.getTime() - createdAt.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );
    // weeksAgo: 0=이번 주, 1=지난 주, ..., 7=8주 전
    const weekIndex = 7 - weeksAgo; // 배열 인덱스 (0=1주, 7=8주)
    if (weekIndex >= 0 && weekIndex <= 7) {
      result[weekIndex].count++;
    }
  }

  return result;
}

// 관리자용 이벤트 삭제 (권한 체크 없이 직접 삭제)
export async function adminDeleteEvent(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<{ error: Error | null }> {
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  return { error: error ? new Error(error.message) : null };
}

// 관리자용 사용자 삭제 (admin 역할 계정 보호)
// 참고: auth.users 삭제는 service_role 키 필요 (현재 미구현).
// profiles 테이블만 삭제하므로 해당 사용자의 로그인 계정은 유지됨.
// 완전한 계정 삭제가 필요한 경우 SUPABASE_SERVICE_ROLE_KEY 기반 Route Handler 추가 필요.
export async function adminDeleteUser(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<{ error: Error | null }> {
  // 삭제 대상 역할 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role === "admin") {
    return { error: new Error("관리자 계정은 삭제할 수 없습니다") };
  }

  const { error } = await supabase.from("profiles").delete().eq("id", userId);

  return { error: error ? new Error(error.message) : null };
}
