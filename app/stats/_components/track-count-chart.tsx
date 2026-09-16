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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card";
import type { TrackSessionCount } from "@/lib/shared/session-stats";

interface TrackCountChartProps {
  data: TrackSessionCount[];
}

export function TrackCountChart({ data }: TrackCountChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions per track</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                stroke="var(--card-border-hex)"
              />
              <XAxis
                dataKey="track"
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
                cursor={{ fill: "var(--card-bg)" }}
                contentStyle={{
                  background: "var(--surface-hex)",
                  border: "1px solid var(--card-border-hex)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                  fontSize: 13,
                }}
                labelStyle={{ color: "var(--text-secondary)" }}
              />
              <Bar
                dataKey="count"
                name="Sessions"
                fill="var(--accent-hex)"
                radius={[4, 4, 0, 0]}
                maxBarSize={56}
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
        </div>
      </CardContent>
    </Card>
  );
}
