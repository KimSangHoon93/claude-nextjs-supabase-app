"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { eventSchema, type EventFormValues } from "@/lib/validations/event";

interface EventFormProps {
  mode: "create" | "edit";
  defaultValues?: EventFormValues;
  defaultImageUrl?: string | null;
}

export default function EventForm({
  mode,
  defaultValues,
  defaultImageUrl,
}: EventFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultImageUrl ?? null,
  );

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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function handleRemoveImage() {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const onSubmit = async () => {
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
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
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
