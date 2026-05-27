"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ParticipantCard from "@/components/gather/participant-card";
import type { GatherParticipant } from "@/types/gather";

interface RealtimeParticipantsProps {
  eventId: string;
  initialParticipants: GatherParticipant[];
}

export default function RealtimeParticipants({
  eventId,
  initialParticipants,
}: RealtimeParticipantsProps) {
  const [participants, setParticipants] =
    useState<GatherParticipant[]>(initialParticipants);
  const router = useRouter();

  useEffect(() => {
    // initialParticipants가 바뀌면 동기화
    setParticipants(initialParticipants);
  }, [initialParticipants]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`event-participants-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_participants",
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          // profiles JOIN 데이터가 payload에 없으므로 Server Component 재실행
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, router]);

  return (
    <>
      {participants.map((participant) => (
        <ParticipantCard key={participant.id} participant={participant} />
      ))}
    </>
  );
}
