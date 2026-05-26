"use client";

import { useActionState, useRef, useState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { eventSchema, type EventFormValues } from "@/lib/validations/event";
import type { ActionResult } from "@/app/protected/events/new/actions";

interface EventFormProps {
  mode: "create" | "edit";
  action: (
    prevState: ActionResult,
    formData: FormData,
  ) => Promise<ActionResult>;
  defaultValues?: EventFormValues;
  defaultImageUrl?: string | null;
}

const initialState: ActionResult = { success: false, message: "" };

export default function EventForm({
  mode,
  action,
  defaultValues,
  defaultImageUrl,
}: EventFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultImageUrl ?? null,
  );
  const [removeImage, setRemoveImage] = useState(false);

  const [state, formAction, isPending] = useActionState(action, initialState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues ?? {
      title: "",
      location: "",
      eventDate: "",
      description: "",
    },
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRemoveImage(false);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setPreviewUrl(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const onSubmit = (data: EventFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("location", data.location);
    formData.append("eventDate", data.eventDate);
    if (data.description) formData.append("description", data.description);

    const file = fileInputRef.current?.files?.[0];
    if (file && file.size > 0) {
      formData.append("coverImage", file);
    }
    if (removeImage) {
      formData.append("removeImage", "true");
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 커버 이미지 업로드 */}
      <div className="space-y-1.5">
        <Label>커버 이미지 (선택)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {previewUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="커버 이미지 미리보기"
              className="h-40 w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
              aria-label="이미지 제거"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-600"
          >
            <ImagePlus size={28} />
            <span className="text-sm">탭하여 이미지 추가</span>
          </button>
        )}
      </div>

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

      {/* 서버 에러 메시지 */}
      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      {/* 제출 버튼 */}
      <Button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600"
        disabled={isPending}
      >
        {isPending
          ? mode === "create"
            ? "생성 중..."
            : "수정 중..."
          : mode === "create"
            ? "이벤트 만들기"
            : "수정 완료"}
      </Button>
    </form>
  );
}
