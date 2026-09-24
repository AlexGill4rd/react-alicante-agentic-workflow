"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CHART_TOOLTIP_STYLE,
  ChartPanel,
} from "@/components/molecules/chart-panel";
import type { LevelSessionCount } from "@/utils/session-stats";

interface LevelCountChartProps {
  data: LevelSessionCount[];
  title: string;
  levelLabels: Record<string, string>;
}

export function LevelCountChart({
  data,
  title,
  levelLabels,
}: LevelCountChartProps) {
  const chartData = data.map((row) => ({
    ...row,
    label: levelLabels[row.level] ?? row.level,
  }));

  return (
    <ChartPanel title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 16, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="var(--card-border-hex)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--card-border-hex)" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ fill: "var(--chart-cursor)" }}
            contentStyle={CHART_TOOLTIP_STYLE}
            labelStyle={{ color: "var(--text-secondary)" }}
          />
          <Bar
            dataKey="count"
            name="Sessions"
            fill="var(--accent-hex)"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          >
            <LabelList
              dataKey="count"
              position="top"
              fill="var(--text-secondary)"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
