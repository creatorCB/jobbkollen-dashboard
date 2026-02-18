"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/dashboard/AppShell";
import { Chart, useChartOptions } from "@/components/dashboard/Charts";
import { RefreshToolbar } from "@/components/dashboard/RefreshToolbar";
import { useMetrics } from "@/lib/useMetrics";

export default function RegionsPage() {
  const { data, error, loading, lastUpdated, refresh } = useMetrics();
  const charts = useChartOptions(data);

  return (
    <AppShell
      title="Regions"
      subtitle="Top regions by job postings (last 90 days)"
      toolbar={
        <RefreshToolbar
          lastUpdated={lastUpdated}
          loading={loading}
          onRefresh={refresh}
        />
      }
    >
      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!data && loading && <div className="h-[420px] animate-pulse rounded-xl border bg-card" />}

      {data && charts && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top regions</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart option={charts.barRegions} height={520} />
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
