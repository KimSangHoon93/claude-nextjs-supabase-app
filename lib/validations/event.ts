import { z } from "zod";

// 이벤트 생성/수정 폼 공통 Zod 스키마 (Phase 3 Server Action에서도 재사용)
export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(100, "제목은 100자 이내로 입력해주세요"),
  location: z.string().min(1, "장소를 입력해주세요"),
  eventDate: z.string().min(1, "날짜를 선택해주세요"),
  description: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;
