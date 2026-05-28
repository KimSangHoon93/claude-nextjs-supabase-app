"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteEventButtonProps {
  deleteAction: (formData: FormData) => Promise<void>;
  compact?: boolean;
}

export default function DeleteEventButton({
  deleteAction,
  compact,
}: DeleteEventButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {compact ? (
          <Button
            variant="outline"
            size="sm"
            className="min-h-[44px] w-full text-destructive hover:text-destructive"
            type="button"
          >
            <Trash2 size={16} className="mr-1" />
            삭제
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive"
            type="button"
          >
            <Trash2 size={16} className="mr-2" />
            이벤트 삭제
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>이벤트를 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            삭제된 이벤트는 복구할 수 없습니다. 모든 참여자 정보도 함께
            삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <form ref={formRef} action={deleteAction}>
            <AlertDialogAction
              type="submit"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
