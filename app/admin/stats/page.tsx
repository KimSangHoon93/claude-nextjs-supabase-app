"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 월별 이벤트 더미 데이터 (2026년 1월~8월)
const MONTHLY_EVENTS = [
  { month: "1월", count: 10 },
  { month: "2월", count: 15 },
  { month: "3월", count: 22 },
  { month: "4월", count: 18 },
  { month: "5월", count: 30 },
  { month: "6월", count: 25 },
  { month: "7월", count: 35 },
  { month: "8월", count: 28 },
];

// 주별 신규 사용자 더미 데이터 (최근 8주)
const WEEKLY_USERS = [
  { week: "1주", count: 5 },
  { week: "2주", count: 8 },
  { week: "3주", count: 6 },
  { week: "4주", count: 12 },
  { week: "5주", count: 9 },
  { week: "6주", count: 15 },
  { week: "7주", count: 11 },
  { week: "8주", count: 18 },
];

export default function AdminStatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">통계 분석</h1>
        <p className="text-sm text-muted-foreground">
          이벤트 및 사용자 추이를 분석하세요
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 차트 1: 월별 이벤트 현황 BarChart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">월별 이벤트 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={MONTHLY_EVENTS}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value}건`, "이벤트 수"]}
                />
                {/* emerald-500 */}
                <Bar dataKey="count" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 차트 2: 주별 신규 사용자 LineChart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">주별 신규 사용자</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={WEEKLY_USERS}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value}명`, "신규 사용자"]}
                />
                {/* violet-500 */}
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
