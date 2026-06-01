"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction } from "@/app/protected/profile/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PRESET_AVATARS } from "@/lib/avatars";
import type { Tables } from "@/types/database";

type Profile = Tables<"profiles">;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : "저장"}
    </Button>
  );
}

export function ProfileForm({
  profile,
  isEmailUser,
}: {
  profile: Profile;
  isEmailUser: boolean;
}) {
  const [state, action] = useActionState(updateProfileAction, null);

  // 현재 avatar_url이 프리셋 목록에 있으면 초기 선택값으로 설정
  const initialAvatar = PRESET_AVATARS.includes(
    profile.avatar_url as (typeof PRESET_AVATARS)[number],
  )
    ? profile.avatar_url
    : null;
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    initialAvatar,
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-green-600">프로필이 저장되었습니다.</p>
      )}

      {/* 이메일 인증 사용자에게만 아바타 선택 UI 표시 */}
      {isEmailUser && (
        <div className="flex flex-col gap-2">
          <Label>프로필 이미지 선택</Label>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_AVATARS.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() =>
                  setSelectedAvatar(url === selectedAvatar ? null : url)
                }
                className={`rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selectedAvatar === url
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label="아바타 선택"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="아바타"
                  className="h-16 w-16 rounded-full object-cover"
                />
              </button>
            ))}
          </div>
          <input type="hidden" name="avatar_url" value={selectedAvatar ?? ""} />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          value={profile.email ?? ""}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">이름</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile.full_name ?? ""}
          placeholder="홍길동"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="website">웹사이트</Label>
        <Input
          id="website"
          name="website"
          type="url"
          defaultValue={profile.website ?? ""}
          placeholder="https://example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">소개</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio ?? ""}
          placeholder="자기소개를 입력하세요"
          rows={4}
        />
      </div>

      <SubmitButton />
    </form>
  );
}
