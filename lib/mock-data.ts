// 임시 더미 데이터 파일 - Phase 3 Task 007(DB 스키마 생성) 완료 후 전량 교체 예정
import type {
  AdminStats,
  GatherEvent,
  GatherParticipant,
  GatherUser,
} from "@/types/gather";

export const MOCK_USERS: GatherUser[] = [
  {
    id: "user-1",
    email: "host@example.com",
    name: "김주최",
    avatarUrl: null,
    role: "user",
    createdAt: "2025-01-10T09:00:00Z",
  },
  {
    id: "user-2",
    email: "participant1@example.com",
    name: "이참여",
    avatarUrl: null,
    role: "user",
    createdAt: "2025-02-05T10:00:00Z",
  },
  {
    id: "user-3",
    email: "participant2@example.com",
    name: "박길동",
    avatarUrl: null,
    role: "user",
    createdAt: "2025-03-20T11:00:00Z",
  },
];

export const MOCK_EVENTS: GatherEvent[] = [
  {
    id: "evt-1",
    title: "팀 점심 모임",
    description: "분기별 팀 점심 식사 모임입니다. 편하게 참여해주세요!",
    location: "강남구 선릉역 근처 한식당",
    eventDate: "2026-06-10T12:00:00Z",
    coverImageUrl: null,
    inviteCode: "abc123",
    status: "upcoming",
    createdBy: "user-1",
    participantCount: 5,
    createdAt: "2026-05-01T09:00:00Z",
    updatedAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "evt-2",
    title: "개발팀 워크샵",
    description: "2026 상반기 개발팀 워크샵. 발표 자료를 준비해주세요.",
    location: "판교 테크노밸리 컨퍼런스홀",
    eventDate: "2026-07-20T10:00:00Z",
    coverImageUrl: null,
    inviteCode: "def456",
    status: "upcoming",
    createdBy: "user-1",
    participantCount: 12,
    createdAt: "2026-05-10T14:00:00Z",
    updatedAt: "2026-05-10T14:00:00Z",
  },
  {
    id: "evt-3",
    title: "사내 해커톤",
    description: "24시간 아이디어 해커톤 - 지금 진행 중입니다!",
    location: "본사 3층 대회의실",
    eventDate: "2026-05-21T09:00:00Z",
    coverImageUrl: null,
    inviteCode: "ghi789",
    status: "ongoing",
    createdBy: "user-2",
    participantCount: 20,
    createdAt: "2026-05-01T08:00:00Z",
    updatedAt: "2026-05-01T08:00:00Z",
  },
  {
    id: "evt-4",
    title: "신입사원 환영회",
    description:
      "3월 신규 입사자 환영 파티입니다. 즐거운 시간 되셨길 바랍니다!",
    location: "마포구 홍대 루프탑 카페",
    eventDate: "2026-03-15T18:00:00Z",
    coverImageUrl: null,
    inviteCode: "jkl012",
    status: "ended",
    createdBy: "user-1",
    participantCount: 8,
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
];

export const MOCK_PARTICIPANTS: GatherParticipant[] = [
  // evt-1 참여자
  {
    id: "par-1",
    eventId: "evt-1",
    userId: "user-1",
    role: "host",
    joinedAt: "2026-05-01T09:00:00Z",
    user: MOCK_USERS[0],
  },
  {
    id: "par-2",
    eventId: "evt-1",
    userId: "user-2",
    role: "participant",
    joinedAt: "2026-05-02T10:00:00Z",
    user: MOCK_USERS[1],
  },
  {
    id: "par-3",
    eventId: "evt-1",
    userId: "user-3",
    role: "participant",
    joinedAt: "2026-05-03T11:00:00Z",
    user: MOCK_USERS[2],
  },
  // evt-3 참여자
  {
    id: "par-4",
    eventId: "evt-3",
    userId: "user-2",
    role: "host",
    joinedAt: "2026-05-01T08:00:00Z",
    user: MOCK_USERS[1],
  },
  {
    id: "par-5",
    eventId: "evt-3",
    userId: "user-1",
    role: "participant",
    joinedAt: "2026-05-05T09:00:00Z",
    user: MOCK_USERS[0],
  },
];

export const MOCK_ADMIN_STATS: AdminStats = {
  todayEvents: 2,
  weekEvents: 8,
  monthEvents: 25,
  totalEvents: 120,
  todayUsers: 5,
  weekUsers: 32,
  totalUsers: 450,
};

export function getMockEventById(id: string): GatherEvent | undefined {
  return MOCK_EVENTS.find((event) => event.id === id);
}

export function getMockEventByInviteCode(
  code: string,
): GatherEvent | undefined {
  return MOCK_EVENTS.find((event) => event.inviteCode === code);
}

export function getMockParticipantsByEventId(
  eventId: string,
): GatherParticipant[] {
  return MOCK_PARTICIPANTS.filter((p) => p.eventId === eventId);
}
