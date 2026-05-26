// 이벤트 상태 타입
export type EventStatus = "upcoming" | "ongoing" | "ended";

// 참여자 역할 타입
export type ParticipantRole = "host" | "participant";

// 사용자 역할 타입
export type UserRole = "user" | "admin";

// 사용자 엔티티 (profiles 테이블 매핑)
export interface GatherUser {
  id: string; // profiles.id
  email: string; // profiles.email
  name: string; // profiles.full_name
  avatarUrl: string | null; // profiles.avatar_url
  role: UserRole; // profiles.role
  createdAt: string; // profiles.created_at
}

// 이벤트 엔티티 (events / events_with_count 뷰 매핑)
export interface GatherEvent {
  id: string; // events.id
  title: string; // events.title
  description: string | null; // events.description
  location: string; // events.location
  eventDate: string; // events.event_date
  coverImageUrl: string | null; // events.cover_image_url
  inviteCode: string; // events.invite_code
  status: EventStatus; // events.status
  createdBy: string; // events.created_by
  participantCount: number; // events_with_count.participant_count (집계값)
  createdAt: string; // events.created_at
  updatedAt: string; // events.updated_at
}

// 참여자 엔티티 (event_participants 테이블 매핑)
export interface GatherParticipant {
  id: string; // event_participants.id
  eventId: string; // event_participants.event_id
  userId: string; // event_participants.user_id
  role: ParticipantRole; // event_participants.role
  joinedAt: string; // event_participants.joined_at
  user?: GatherUser; // profiles JOIN (선택적)
}

// 관리자 통계
export interface AdminStats {
  todayEvents: number;
  weekEvents: number;
  monthEvents: number;
  totalEvents: number;
  todayUsers: number;
  weekUsers: number;
  totalUsers: number;
}

// 이벤트 폼 입력값
export interface EventFormValues {
  title: string;
  description: string;
  location: string;
  eventDate: string;
  coverImage?: File;
}

// 이벤트 카드 컴포넌트 Props
export interface EventCardProps {
  event: GatherEvent;
  onClick?: () => void;
}

// 참여자 카드 컴포넌트 Props
export interface ParticipantCardProps {
  participant: GatherParticipant;
}
