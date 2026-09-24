"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const CHART_TOOLTIP_STYLE = {
  background: "var(--chart-tooltip-bg)",
  border: "1px solid var(--card-border-hex)",
  borderRadius: "var(--radius-lg)",
  color: "var(--text-primary)",
  fontSize: 13,
  boxShadow: "var(--shadow-card)",
} as const;

interface ChartPanelProps {
  title: string;
  children: ReactNode;
  height?: number;
}

export function ChartPanel({ title, children, height = 280 }: ChartPanelProps) {
  return (
    <Card variant="chart">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Box
          width="full"
          height={`${height}px`}
          css={{
            "& .recharts-wrapper": { background: "transparent !important" },
            "& .recharts-surface": { background: "transparent !important" },
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
