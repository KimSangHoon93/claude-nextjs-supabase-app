"use client";

// Client Component에서 dynamic import — Server Component에서는 ssr:false 사용 불가
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Recharts는 SSR 불가 — dynamic import로 코드 스플리팅 적용
const StatsCharts = dynamic(
  () => import("./stats-charts").then((mod) => mod.StatsCharts),
  {
    ssr: false,
    // 차트 로딩 중 스켈레톤 UI 표시
    loading: () => (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    ),
  },
);

interface StatsChartsLoaderProps {
  monthlyData: { month: string; count: number }[];
  weeklyData: { week: string; count: number }[];
}

// Server Component(stats/page.tsx)에서 사용하는 래퍼 — props를 그대로 전달
export function StatsChartsLoader({
  monthlyData,
  weeklyData,
}: StatsChartsLoaderProps) {
  return <StatsCharts monthlyData={monthlyData} weeklyData={weeklyData} />;
}
