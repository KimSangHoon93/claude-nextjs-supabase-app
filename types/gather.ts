// 이벤트 상태 타입
export type EventStatus = "upcoming" | "ongoing" | "ended";

// 참여자 역할 타입
export type ParticipantRole = "host" | "participant";

// 사용자 역할 타입
export type UserRole = "user" | "admin";

// 사용자 엔티티
export interface GatherUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}

// 이벤트 엔티티
export interface GatherEvent {
  id: string;
  title: string;
  description: string | null;
  location: string;
  eventDate: string;
  coverImageUrl: string | null;
  inviteCode: string;
  status: EventStatus;
  createdBy: string;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

// 참여자 엔티티
export interface GatherParticipant {
  id: string;
  eventId: string;
  userId: string;
  role: ParticipantRole;
  joinedAt: string;
  user?: GatherUser;
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
