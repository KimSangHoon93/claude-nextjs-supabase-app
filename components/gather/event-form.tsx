"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { eventSchema, type EventFormValues } from "@/lib/validations/event";

interface EventFormProps {
  mode: "create" | "edit";
  defaultValues?: EventFormValues;
}

// 이벤트 생성/수정 공용 폼 클라이언트 컴포넌트
export default function EventForm({ mode, defaultValues }: EventFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues ?? {
      title: "",
      location: "",
      eventDate: "",
      description: "",
    },
  });

  const onSubmit = async () => {
    // 더미 모드: 실제 저장 없이 토스트만 표시 (Phase 3에서 Server Action으로 교체)
    if (mode === "create") {
      toast("이벤트가 생성되었습니다");
      router.push("/protected/events");
    } else {
      toast("이벤트가 수정되었습니다");
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 제목 */}
      <div className="space-y-1.5">
        <Label htmlFor="title">이벤트 제목 *</Label>
        <Input
          id="title"
          placeholder="예) 팀 점심 모임"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* 장소 */}
      <div className="space-y-1.5">
        <Label htmlFor="location">장소 *</Label>
        <Input
          id="location"
          placeholder="예) 강남구 선릉역 근처 한식당"
          {...register("location")}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      {/* 날짜/시간 */}
      <div className="space-y-1.5">
        <Label htmlFor="eventDate">날짜 및 시간 *</Label>
        <Input
          id="eventDate"
          type="datetime-local"
          {...register("eventDate")}
        />
        {errors.eventDate && (
          <p className="text-sm text-destructive">{errors.eventDate.message}</p>
        )}
      </div>

      {/* 설명 (선택) */}
      <div className="space-y-1.5">
        <Label htmlFor="description">설명 (선택)</Label>
        <Textarea
          id="description"
          placeholder="이벤트에 대한 간단한 설명을 입력해주세요"
          rows={3}
          {...register("description")}
        />
      </div>

      {/* 제출 버튼 */}
      <Button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600"
        disabled={isSubmitting}
      >
        {mode === "create" ? "이벤트 만들기" : "수정 완료"}
      </Button>
    </form>
  );
}
