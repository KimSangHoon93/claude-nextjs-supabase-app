import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type {
  GatherParticipant,
  GatherUser,
  ParticipantRole,
} from "@/types/gather";

type ParticipantWithProfile = {
  id: string;
  event_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    email: string | null;
  } | null;
};

function toGatherParticipant(row: ParticipantWithProfile): GatherParticipant {
  const profile = row.profiles;
  const seed = profile?.username ?? profile?.email ?? row.user_id;

  const user: GatherUser | undefined = profile
    ? {
        id: profile.id,
        email: profile.email ?? "",
        name: profile.full_name ?? profile.username ?? "사용자",
        avatarUrl:
          profile.avatar_url ??
          `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`,
        role: "user",
        createdAt: "",
      }
    : undefined;

  return {
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    role: row.role as ParticipantRole,
    joinedAt: row.joined_at,
    user,
  };
}

// 이벤트에 참여자로 참여 (role: 'participant')
export async function joinEvent(
  supabase: SupabaseClient<Database>,
  eventId: string,
  userId: string,
): Promise<{ error: { message: string; code?: string } | null }> {
  const { error } = await supabase.from("event_participants").insert({
    event_id: eventId,
    user_id: userId,
    role: "participant",
  });

  if (error) {
    return { error: { message: error.message, code: error.code } };
  }

  return { error: null };
}

// 이벤트 참여 취소 (참여자 role만 가능)
export async function leaveEvent(
  supabase: SupabaseClient<Database>,
  eventId: string,
  userId: string,
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("event_participants")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .eq("role", "participant");

  return { error: error ? new Error(error.message) : null };
}

// 이벤트의 모든 참여자 조회 (profiles JOIN)
export async function getParticipantsByEventId(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<GatherParticipant[]> {
  const { data, error } = await supabase
    .from("event_participants")
    .select("*, profiles(id, full_name, username, avatar_url, email)")
    .eq("event_id", eventId)
    .order("joined_at", { ascending: true });

  if (error || !data) return [];

  return (data as ParticipantWithProfile[]).map(toGatherParticipant);
}

// 특정 사용자가 이벤트에 참여 중인지 확인
export async function isParticipant(
  supabase: SupabaseClient<Database>,
  eventId: string,
  userId: string,
): Promise<boolean> {
  const { count } = await supabase
    .from("event_participants")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("user_id", userId);

  return (count ?? 0) > 0;
}

// 특정 사용자의 이벤트 내 역할 반환
export async function getParticipantRole(
  supabase: SupabaseClient<Database>,
  eventId: string,
  userId: string,
): Promise<ParticipantRole | null> {
  const { data } = await supabase
    .from("event_participants")
    .select("role")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return null;
  return data.role as ParticipantRole;
}
