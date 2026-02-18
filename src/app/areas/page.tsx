"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/dashboard/AppShell";
import { Chart, useChartOptions } from "@/components/dashboard/Charts";
import { RefreshToolbar } from "@/components/dashboard/RefreshToolbar";
import { FilterChips } from "@/components/dashboard/FilterChips";
import { SimpleTable } from "@/components/dashboard/SimpleTable";
import { useMetrics } from "@/lib/useMetrics";

export default function AreasPage() {
  const { data, error, loading, lastUpdated, refresh } = useMetrics();
  const charts = useChartOptions(data);

  return (
    <AppShell
      title="Areas"
      subtitle="Occupation areas (21) by job postings (last 90 days)"
      toolbar={
        <>
          <FilterChips chips={["Last 90 days", "21 occupation areas", "Supabase source", "Live"]} />
          <RefreshToolbar
            lastUpdated={lastUpdated}
            loading={loading}
            onRefresh={refresh}
          />
        </>
      }
    >
      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!data && loading && <div className="h-[420px] animate-pulse rounded-xl border bg-card" />}

      {data && charts && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Jobs by occupation area</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart option={charts.barAreas} height={520} />
            </CardContent>
          </Card>

          <SimpleTable title="Occupation areas" rows={data.areas} valueLabel="Jobs" limit={21} />
        </div>
      )}
    </AppShell>
  );
}
