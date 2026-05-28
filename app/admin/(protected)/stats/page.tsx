import { createClient } from "@/lib/supabase/server";
import { getMonthlyEventStats, getWeeklyUserStats } from "@/lib/supabase/admin";
// StatsChartsLoader: Client Component 래퍼 — ssr:false dynamic import 포함
import { StatsChartsLoader } from "@/components/admin/stats-charts-loader";

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

      {/* 차트 — Client Component 래퍼 (dynamic import + ssr:false, Recharts SSR 불가) */}
      <StatsChartsLoader monthlyData={monthlyData} weeklyData={weeklyData} />
    </div>
  );
}
