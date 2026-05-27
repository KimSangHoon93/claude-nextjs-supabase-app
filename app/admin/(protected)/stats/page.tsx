import { createClient } from "@/lib/supabase/server";
import { getMonthlyEventStats, getWeeklyUserStats } from "@/lib/supabase/admin";
import { StatsCharts } from "@/components/admin/stats-charts";

export default async function AdminStatsPage() {
  const supabase = await createClient();

  // 실제 DB에서 통계 데이터 병렬 조회
  const [monthlyData, weeklyData] = await Promise.all([
    getMonthlyEventStats(supabase),
    getWeeklyUserStats(supabase),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">통계 분석</h1>
        <p className="text-sm text-muted-foreground">
          이벤트 및 사용자 추이를 분석하세요
        </p>
      </div>

      {/* 차트 — Client Component (Recharts SSR 불가) */}
      <StatsCharts monthlyData={monthlyData} weeklyData={weeklyData} />
    </div>
  );
}
