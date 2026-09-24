"use client";

import { InteractiveSurface } from "@/components/atoms/interactive-surface";
import { Grid, Heading, Text } from "@chakra-ui/react";

interface StatsKpiStripProps {
  items: { label: string; value: number }[];
}

export function StatsKpiStrip({ items }: StatsKpiStripProps) {
  return (
    <Grid
      gap="4"
      templateColumns={{
        base: "repeat(2, 1fr)",
        md: `repeat(${items.length}, 1fr)`,
      }}
    >
      {items.map((item) => (
        <InteractiveSurface key={item.label}>
          <Text
            fontSize="xs"
            color="var(--text-muted)"
            textTransform="uppercase"
            letterSpacing="0.12em"
          >
            {item.label}
          </Text>
          <Heading as="p" fontSize="3xl" fontWeight="semibold" marginTop="2">
            {item.value}
          </Heading>
        </InteractiveSurface>
      ))}
    </Grid>
  );
}
