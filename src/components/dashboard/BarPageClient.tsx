"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart, useChartOptions } from "@/components/dashboard/Charts";
import { SimpleTable } from "@/components/dashboard/SimpleTable";
import type { Metrics } from "@/lib/metrics";

export function BarPageClient({
  data,
  kind,
  title,
}: {
  data: Metrics;
  kind: "employers" | "regions" | "occupations" | "areas";
  title: string;
}) {
  const charts = useChartOptions(data);
  if (!charts) return null;

  const config = {
    employers: {
      option: charts.barEmployers,
      rows: data.topEmployers,
      limit: 20,
    },
    regions: {
      option: charts.barRegions,
      rows: data.regions,
      limit: 20,
    },
    occupations: {
      option: charts.barOccupations,
      rows: data.topOccupations,
      limit: 20,
    },
    areas: {
      option: charts.barAreas,
      rows: data.areas,
      limit: 21,
    },
  }[kind];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart option={config.option} height={520} />
        </CardContent>
      </Card>

      <SimpleTable title={title} rows={config.rows} valueLabel="Jobs" limit={config.limit} />
    </div>
  );
}
