"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { setupProfileAction } from "@/app/auth/setup-profile/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "저장 중..." : "시작하기"}
    </Button>
  );
}

export function SetupProfileForm({ defaultName }: { defaultName: string }) {
  const [state, action] = useActionState(setupProfileAction, null);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">닉네임 설정</CardTitle>
          <CardDescription>
            Gather에서 사용할 닉네임을 설정해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            {state && "error" in state && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="full_name">닉네임</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="닉네임을 입력하세요"
                defaultValue={defaultName}
                required
                maxLength={30}
              />
            </div>
            <SubmitButton />
            <Link
              href="/protected/events"
              className="text-center text-sm text-muted-foreground hover:underline"
            >
              나중에 설정하기
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
