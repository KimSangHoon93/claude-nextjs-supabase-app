"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction } from "@/app/protected/profile/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/types/database";

type Profile = Tables<"profiles">;

// 저장 버튼 — pending 상태일 때 비활성화
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : "저장"}
    </Button>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState(updateProfileAction, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-green-600">프로필이 저장되었습니다.</p>
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
        <Label htmlFor="username">사용자명</Label>
        <Input
          id="username"
          name="username"
          defaultValue={profile.username ?? ""}
          placeholder="honggildong"
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
