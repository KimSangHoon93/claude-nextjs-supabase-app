import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { GatherEvent, EventStatus } from "@/types/gather";

type EventRow = Database["public"]["Views"]["events_with_count"]["Row"];

export type EventInsertData = {
  title: string;
  location: string;
  eventDate: string;
  description?: string;
  coverImageUrl?: string | null;
};

// event_date 기반 이벤트 상태 계산 (±2시간 범위)
export function calculateEventStatus(eventDate: string): EventStatus {
  const now = new Date();
  const date = new Date(eventDate);
  const twoHours = 2 * 60 * 60 * 1000;

  if (now < new Date(date.getTime() - twoHours)) return "upcoming";
  if (now > new Date(date.getTime() + twoHours)) return "ended";
  return "ongoing";
}

// DB Row → GatherEvent 변환 (snake_case → camelCase, status 런타임 계산)
export function toGatherEvent(row: EventRow): GatherEvent {
  return {
    id: row.id!,
    title: row.title!,
    description: row.description ?? null,
    location: row.location!,
    eventDate: row.event_date!,
    coverImageUrl: row.cover_image_url ?? null,
    inviteCode: row.invite_code!,
    status: calculateEventStatus(row.event_date!),
    createdBy: row.created_by!,
    participantCount: row.participant_count ?? 0,
    createdAt: row.created_at!,
    updatedAt: row.updated_at!,
  };
}

// 8자리 랜덤 영문+숫자 초대 코드 생성 (최대 5회 UNIQUE 재시도)
async function generateInviteCode(
  supabase: SupabaseClient<Database>,
): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let attempt = 0; attempt < 5; attempt++) {
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const { data } = await supabase
      .from("events")
      .select("id")
      .eq("invite_code", code)
      .maybeSingle();

    if (!data) return code;
  }

  // 최대 재시도 초과 시 타임스탬프 기반 폴백
  return Date.now().toString(36).toUpperCase().slice(-8).padStart(8, "0");
}

export async function createEvent(
  supabase: SupabaseClient<Database>,
  userId: string,
  data: EventInsertData,
): Promise<{ data: GatherEvent | null; error: Error | null }> {
  const inviteCode = await generateInviteCode(supabase);

  const { data: event, error: insertError } = await supabase
    .from("events")
    .insert({
      title: data.title,
      location: data.location,
      event_date: new Date(data.eventDate).toISOString(),
      description: data.description ?? null,
      cover_image_url: data.coverImageUrl ?? null,
      invite_code: inviteCode,
      created_by: userId,
    })
    .select()
    .single();

  if (insertError || !event) {
    return {
      data: null,
      error: new Error(insertError?.message ?? "이벤트 생성 실패"),
    };
  }

  // 주최자를 참여자 테이블에 host 역할로 등록
  await supabase.from("event_participants").insert({
    event_id: event.id,
    user_id: userId,
    role: "host",
  });

  const { data: withCount } = await supabase
    .from("events_with_count")
    .select("*")
    .eq("id", event.id)
    .maybeSingle();

  return { data: withCount ? toGatherEvent(withCount) : null, error: null };
}

export async function updateEvent(
  supabase: SupabaseClient<Database>,
  eventId: string,
  userId: string,
  data: Partial<EventInsertData>,
): Promise<{ error: Error | null }> {
  const { data: existing } = await supabase
    .from("events")
    .select("created_by")
    .eq("id", eventId)
    .single();

  if (!existing || existing.created_by !== userId) {
    return { error: new Error("수정 권한이 없습니다") };
  }

  const updatePayload: Database["public"]["Tables"]["events"]["Update"] = {};
  if (data.title !== undefined) updatePayload.title = data.title;
  if (data.location !== undefined) updatePayload.location = data.location;
  if (data.eventDate !== undefined) {
    updatePayload.event_date = new Date(data.eventDate).toISOString();
  }
  if (data.description !== undefined)
    updatePayload.description = data.description;
  if (data.coverImageUrl !== undefined) {
    updatePayload.cover_image_url = data.coverImageUrl;
  }

  const { error } = await supabase
    .from("events")
    .update(updatePayload)
    .eq("id", eventId);

  return { error: error ? new Error(error.message) : null };
}

export async function deleteEvent(
  supabase: SupabaseClient<Database>,
  eventId: string,
  userId: string,
): Promise<{ error: Error | null }> {
  const { data: existing } = await supabase
    .from("events")
    .select("created_by")
    .eq("id", eventId)
    .single();

  if (!existing || existing.created_by !== userId) {
    return { error: new Error("삭제 권한이 없습니다") };
  }

  const { error } = await supabase.from("events").delete().eq("id", eventId);

  return { error: error ? new Error(error.message) : null };
}

export async function getEventById(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<GatherEvent | null> {
  const { data } = await supabase
    .from("events_with_count")
    .select("*")
    .eq("id", eventId)
    .maybeSingle();

  return data ? toGatherEvent(data) : null;
}

export async function getHostedEvents(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<GatherEvent[]> {
  const { data: participations } = await supabase
    .from("event_participants")
    .select("event_id")
    .eq("user_id", userId)
    .eq("role", "host");

  if (!participations || participations.length === 0) return [];

  const eventIds = participations.map((p) => p.event_id);

  const [{ data }, { data: profile }] = await Promise.all([
    supabase
      .from("events_with_count")
      .select("*")
      .in("id", eventIds)
      .order("event_date", { ascending: false }),
    supabase.from("profiles").select("full_name").eq("id", userId).single(),
  ]);

  const hostName = profile?.full_name ?? undefined;

  return (data ?? []).map((row) => ({ ...toGatherEvent(row), hostName }));
}

export async function getJoinedEvents(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<GatherEvent[]> {
  const { data: participations } = await supabase
    .from("event_participants")
    .select("event_id")
    .eq("user_id", userId)
    .eq("role", "participant");

  if (!participations || participations.length === 0) return [];

  const eventIds = participations.map((p) => p.event_id);

  const { data } = await supabase
    .from("events_with_count")
    .select("*")
    .in("id", eventIds)
    .order("event_date", { ascending: false });

  if (!data || data.length === 0) return [];

  // 주최자 이름 일괄 조회
  const hostIds = [...new Set(data.map((e) => e.created_by!))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", hostIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

  return data.map((row) => ({
    ...toGatherEvent(row),
    hostName: profileMap.get(row.created_by!) ?? undefined,
  }));
}

export async function getEventByInviteCode(
  supabase: SupabaseClient<Database>,
  inviteCode: string,
): Promise<GatherEvent | null> {
  const { data } = await supabase
    .from("events_with_count")
    .select("*")
    .eq("invite_code", inviteCode)
    .maybeSingle();

  return data ? toGatherEvent(data) : null;
}
